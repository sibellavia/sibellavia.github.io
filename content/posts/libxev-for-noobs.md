---
title: "Libxev for Noobs"
date: 2025-11-01T16:03:00+01:00
---

Lately, I've been working on a Zig project in my spare time. I needed a solution for managing async, and I chose [libxev](https://github.com/mitchellh/libxev) for this. I think it's an excellent library, and I admire [mitchellh](https://x.com/mitchellh)'s work. While studying the library, I had the idea of gathering some basic notes and sharing them as a blog post for those approaching it for the first time. 

Please note that I haven't made any effort to structure this page in a user-friendly format. Rather, it's a consolidation of my notes organized according to my own mental model. It may be updated over time, so please check the end of the page for the last updated date.

If you're new to async/event loops, read up to Watchers. If you're diving deep into internals, jump to Backend specifics.

## Table of Contents

- [What libxev is](#what-libxev-is)
- [Big picture: modules and types](#big-picture-modules-and-types)
- [Core loop model](#core-loop-model)
- [Watchers](#watchers)
- [Buffers and polling semantics](#buffers-and-polling-semantics)
- [Thread pool](#thread-pool)
- [Backend specifics](#backend-specifics)

## What libxev is

libxev is a cross-platform Proactor event loop (completion-based), written in Zig with a C API. If you are not familiar with proactor pattern, you can find more [here](https://en.wikipedia.org/wiki/Proactor_pattern), but I will try to summarize the workflow:

- You submit an operation (e.g., "connect to this address").
- The backend performs the operation.
- You get a callback when the operation is DONE with its result.

As an example: with the Reactor pattern, you wait for readiness, then you must call read/write to actually do I/O; instead, with Proactor you submit the read/write up front, then the OS/backend performs it and your callback gets the completion result. You don't issue another read/write when the event fires, only optionally submit the next operaiton.

So how does a completion-based model behave in libxev? I'll do the same exercise as before:

- You enqueue (add) a `Completion` (the pending operation + callback + userdata) to the loop.
- When it completes, the loop calls your callback with the Result.
- Your callback returns a CallbackAction:
    - `.disarm` to stop, or
    - `.rearm` to requeue the exact same operation.

libxev chooses a backend per OS (`io_uring`, `kqueue`, `epoll`, `IOCP`, `WASI`) but keeps the same Proactor API. Zero runtime allocations per operations. Also, it provides *high-level platform-agnostic APIs for interacting with timers, TCP/UDP sockets, files, processes, and more.*

## Big picture: modules and types

`xev` module exposes types based on the selected backend (`Loop`, `Completion`, `Timer`, `TCP`, etc.):

```zig, api.zig
// api.zig

/// The core loop APIs.
pub const Loop = T.Loop;
pub const Completion = T.Completion;
pub const Result = T.Result;
pub const ReadBuffer = T.ReadBuffer;
pub const WriteBuffer = T.WriteBuffer;
pub const Options = loop.Options;
pub const RunMode = loop.RunMode;
pub const CallbackAction = loop.CallbackAction;
pub const CompletionState = loop.CompletionState;

/// Error types
pub const AcceptError = T.AcceptError;
pub const CancelError = T.CancelError;
pub const CloseError = T.CloseError;
pub const ConnectError = T.ConnectError;
pub const ShutdownError = T.ShutdownError;
pub const WriteError = T.WriteError;
pub const ReadError = T.ReadError;

/// Shared stream types
const SharedStream = stream.Shared(Self);
pub const PollError = SharedStream.PollError;
pub const PollEvent = SharedStream.PollEvent;
pub const WriteQueue = SharedStream.WriteQueue;
pub const WriteRequest = SharedStream.WriteRequest;

/// The high-level helper interfaces that make it easier to perform
/// common tasks. These may not work with all possible Loop implementations.
pub const Async = @import("watcher/async.zig").Async(Self);
pub const File = @import("watcher/file.zig").File(Self);
pub const Process = @import("watcher/process.zig").Process(Self);
pub const Stream = stream.GenericStream(Self);
pub const Timer = @import("watcher/timer.zig").Timer(Self);
pub const TCP = @import("watcher/tcp.zig").TCP(Self);
pub const UDP = @import("watcher/udp.zig").UDP(Self);
```

Backend selection defaults to your OS. You can inspect or pin a backend:

```zig
// backend.zig

pub const Backend = enum {
    io_uring, epoll, kqueue, wasi_poll, iocp,
    pub fn default() Backend { ... .linux => .io_uring, .macos => .kqueue, ... }
    pub fn candidates() []const Backend { ... }
    pub fn Api(comptime self: Backend) type { ... }
};
```

## Core loop model

### Initialization and teardown

We create a `Loop` with options, use it, then `deinit` it. 

```zig
// _basic.zig 

// Initialize the loop state. Notice we can use a stack-allocated
// value here. We can even pass around the loop by value! The loop
// will contain all of our "completions" (watches).
var loop = try xev.Loop.init(.{});
defer loop.deinit();

...

// Run the loop until there are no more completions.
try loop.run(.until_done);
```

Loops also support `stop()` / `stopped()`, the exact methods live on the backend `Loop`.

Shared options are queue depth and optional thread pool:

```zig
// loop.zig

/// Common options across backends. Not all options apply to all backends.
/// Read the doc comment for individual fields to learn what backends they
/// apply to.
pub const Options = struct {
    /// The number of queued completions that can be in flight before
    /// requiring interaction with the kernel.
    ///
    /// Backends: io_uring
    entries: u32 = 256,

    /// A thread pool to use for blocking operations. If the backend doesn't
    /// need to perform any blocking operations then no threads will ever
    /// be spawned. If the backend does need to perform blocking operations
    /// on a thread and no thread pool is provided, the operations will simply
    /// fail. Unless you're trying to really optimize for space, it is
    /// recommended you provide a thread pool.
    ///
    /// Backends: epoll, kqueue
    thread_pool: ?*xev.ThreadPool = null,
};
```

### Adding work (Completions) and callbacks

We express work enqueuing a Completion and supplying a callback. When the operation finishes, the loop calls the callback with a Result. The callback returns a CallbackAction (`.disarm` or `.rearm`). The Completion stores the callback, the action is the callback's return value.

```zig
// loop.zig

/// The result type for callbacks. This should be used by all loop
/// implementations and higher level abstractions in order to control
/// what to do after the loop completes.
pub const CallbackAction = enum(c_int) {
    /// The request is complete and is not repeated. For example, a read
    /// callback only fires once and is no longer watched for reads. You
    /// can always free memory associated with the completion prior to
    /// returning this.
    disarm = 0,

    /// Requeue the same operation request with the same parameters
    /// with the event loop. This makes it easy to repeat a read, timer,
    /// etc. This rearms the request EXACTLY as-is. For example, the
    /// low-level timer interface for io_uring uses an absolute timeout.
    /// If you rearm the timer, it will fire immediately because the absolute
    /// timeout will be in the past.
    ///
    /// The completion is reused so it is not safe to use the same completion
    /// for anything else.
    rearm = 1,
};
```

As we can see from the code documentation, `rearm` semantics are intentionally "exactly the same operation". The implication is to prefer re-scheduling in your callback computing new parameters, unless you deliberately want the same behavior.

The callback of the main Loop operations looks like this:

```zig
// loop.zig

pub fn Callback(comptime T: type) type {
    return *const fn (
        userdata: ?*anyopaque,
        loop: *T.Loop,
        completion: *T.Completion,
        result: T.Result,
    ) CallbackAction;
}
```

### Cancellations and reset

Cancellation is just another operation submitted to the loop. High-level helpers encapsulate this for us. For example, timer reset uses a paired completion and the loop's reset entrypoint:

```zig
// timer.zig

/// Reset a timer to execute in next_ms milliseconds. If the timer
/// is already started, this will stop it and restart it. If the
/// timer has never been started, this is equivalent to running "run".
/// In every case, the timer callback is updated to the given userdata
/// and callback.
///
/// This requires an additional completion c_cancel to represent
/// the need to possibly cancel the previous timer. You can check
/// if c_cancel was used by checking the state() after the call.
///
/// VERY IMPORTANT: both c and c_cancel MUST NOT be undefined. They
/// must be initialized to ".{}" if being used for the first time.
pub fn reset(
    self: Self,
    loop: *xev.Loop,
    c: *xev.Completion,
    c_cancel: *xev.Completion,
    next_ms: u64,
    comptime Userdata: type,
    userdata: ?*Userdata,
    comptime cb: *const fn (
        ud: ?*Userdata,
        l: *xev.Loop,
        c: *xev.Completion,
        r: RunError!void,
    ) xev.CallbackAction,
) void {
    _ = self;
    loop.timer_reset(c, c_cancel, next_ms, userdata, (struct {
        fn callback(
            ud: ?*anyopaque,
            l_inner: *xev.Loop,
            c_inner: *xev.Completion,
            r: xev.Result,
        ) xev.CallbackAction {
            return @call(.always_inline, cb, .{
                @as(?*Userdata, if (Userdata == void) null else @ptrCast(@alignCast(ud))),
                l_inner,
                c_inner,
                if (r.timer) |trigger| @as(RunError!void, switch (trigger) {
                    .request, .expiration => {},
                    .cancel => error.Canceled,
                }) else |err| err,
            });
        }
    }).callback);
}
```

### Running the loop

We can control how the loop advances via `RunMode`:

```zig
// loop.zig

/// The loop run mode -- all backends are required to support this in some way.
/// Backends may provide backend-specific APIs that behave slightly differently
/// or in a more configurable way.
pub const RunMode = enum(c_int) {
    /// Run the event loop once. If there are no blocking operations ready,
    /// return immediately.
    no_wait = 0,

    /// Run the event loop once, waiting for at least one blocking operation
    /// to complete.
    once = 1,

    /// Run the event loop until it is "done". "Doneness" is defined as
    /// there being no more completions that are active.
    until_done = 2,
};
```

Typical flow would be to enqueue one or more completions (directly or via watchers) and call `loop.run(.until_done)`. Each completion's callback fires with a final `Result`. Return `.disarm` to stop or `.rearm` to repeat the same operation.

### Completion state

It is possible to query whether a `Completion` is in use: `.dead` means reusable, `.active` means "on going":

```zig
// loop.zig

/// The state that a completion can be in.
pub const CompletionState = enum(c_int) {
    /// The completion is not being used and is ready to be configured
    /// for new work.
    dead = 0,

    /// The completion is part of an event loop. This may be already waited
    /// on or in the process of being registered.
    active = 1,
};
```

I may be naive, but to put it simple: enqueue -> complete -> callback(Result) -> disarm/rearm.

## Watchers

libxev exposes watchers. They are high-level helpers that build the right Completion(s) for a task (timers, sockets, files, processes, async notifications) and forward a typed result to the callback.

### Timer

One-shot timer, reset to new deadline, cancel active timer. The callback returns `.disarm` or `.rearm`:

```zig
// timer.zig

/// Start the timer. The timer will execute in next_ms milliseconds from
/// now.
///
/// This will use the monotonic clock on your system if available so
/// this is immune to system clock changes or drift. The callback is
/// guaranteed to fire NO EARLIER THAN "next_ms" milliseconds. We can't
/// make any guarantees about exactness or time bounds because its possible
/// for your OS to just... pause.. the process for an indefinite period of
/// time.
///
/// Like everything else in libxev, if you want something to repeat, you
/// must then requeue the completion manually. This punts off one of the
/// "hard" aspects of timers: it is up to you to determine what the semantic
/// meaning of intervals are. For example, if you want a timer to repeat every
/// 10 seconds, is it every 10th second of a wall clock? every 10th second
/// after an invocation? every 10th second after the work time from the
/// invocation? You have the power to answer these questions, manually.
pub fn run(
    self: Self,
    loop: *xev.Loop,
    c: *xev.Completion,
    next_ms: u64,
    comptime Userdata: type,
    userdata: ?*Userdata,
    comptime cb: *const fn (
        ud: ?*Userdata,
        l: *xev.Loop,
        c: *xev.Completion,
        r: RunError!void,
    ) xev.CallbackAction,
) void { ... }
```

```zig
pub fn reset(self: Self, loop: *xev.Loop, c: *xev.Completion, c_cancel: *xev.Completion,
             next_ms: u64, comptime Userdata: type, userdata: ?*Userdata,
             comptime cb: *const fn (...) xev.CallbackAction) void { ... }
```

```zig
pub fn cancel(self: Self, loop: *xev.Loop, c_timer: *xev.Completion, c_cancel: *xev.Completion,
              comptime Userdata: type, userdata: ?*Userdata,
              comptime cb: *const fn (...) xev.CallbackAction) void { ... }
```

Let's remember that `.rearm` repeats exactly, so for periodic timers it should be preferred computing the next deadline and calling `run/reset` with new parameters.

### Stream

Generic stream operations via `Stream(xev, T, options)`: read, write, poll, close. Use `WriteRequest` and `WriteQueue`:

```zig
/// WriteQueue is the queue of write requests for ordered writes.
/// This can be copied around.
pub const WriteQueue = queue.Intrusive(WriteRequest);

/// WriteRequest is a single request for a write. It wraps a
/// completion so that it can be inserted into the WriteQueue.
pub const WriteRequest = struct { completion: xev.Completion = .{}, userdata: ?*anyopaque = null, full_write_buffer: xev.WriteBuffer, ... };
```

### TCP

It provides client and server helper built on Stream. Provides `init`, `bind`, `listen`, `accept`, `connect`, `shutdown`. Read/write come from Stream methods.

```zig
/// Bind the address to the socket.
pub fn bind(self: Self, addr: std.net.Address) !void {
    if (xev.backend == .wasi_poll) @compileError("unsupported in WASI");
    const fd = if (xev.backend == .iocp) @as(std.os.windows.ws2_32.SOCKET, @ptrCast(self.fd)) else self.fd;
    try posix.setsockopt(fd, posix.SOL.SOCKET, posix.SO.REUSEADDR, &std.mem.toBytes(@as(c_int, 1)));
    try posix.bind(fd, &addr.any, addr.getOsSockLen());
}
/// Listen for connections on the socket. This puts the socket into passive
/// listening mode. Connections must still be accepted one at a time.
pub fn listen(self: Self, backlog: u31) !void {
    if (xev.backend == .wasi_poll) @compileError("unsupported in WASI");
    const fd = if (xev.backend == .iocp) @as(std.os.windows.ws2_32.SOCKET, @ptrCast(self.fd)) else self.fd;
    try posix.listen(fd, backlog);
}
/// Accept a single connection.
pub fn accept(
    self: Self,
    loop: *xev.Loop,
    c: *xev.Completion,
    comptime Userdata: type,
    userdata: ?*Userdata,
    comptime cb: *const fn (
        ud: ?*Userdata,
        l: *xev.Loop,
        c: *xev.Completion,
        r: xev.AcceptError!Self,
    ) xev.CallbackAction,
) void {
    c.* = .{
        .op = .{
            .accept = .{
                .socket = self.fd,
            },
        },
        .userdata = userdata,
        .callback = (struct {
            fn callback(
                ud: ?*anyopaque,
                l_inner: *xev.Loop,
                c_inner: *xev.Completion,
                r: xev.Result,
            ) xev.CallbackAction {
                return @call(.always_inline, cb, .{
                    common.userdataValue(Userdata, ud),
                    l_inner,
                    c_inner,
                    if (r.accept) |fd| initFd(fd) else |err| err,
                });
            }
        }).callback,
    };
    // If we're dup-ing, then we ask the backend to manage the fd.
    switch (xev.backend) {
        .io_uring,
        .kqueue,
        .wasi_poll,
        .iocp,
        => {},
        .epoll => c.flags.dup = true,
    }
    loop.add(c);
}
/// Establish a connection as a client.
pub fn connect(
    self: Self,
    loop: *xev.Loop,
    c: *xev.Completion,
    addr: std.net.Address,
    comptime Userdata: type,
    userdata: ?*Userdata,
    comptime cb: *const fn (
        ud: ?*Userdata,
        l: *xev.Loop,
        c: *xev.Completion,
        s: Self,
        r: xev.ConnectError!void,
    ) xev.CallbackAction,
) void {
    if (xev.backend == .wasi_poll) @compileError("unsupported in WASI");
    c.* = .{
        .op = .{
            .connect = .{
                .socket = self.fd,
                .addr = addr,
            },
        },
        .userdata = userdata,
        .callback = (struct {
            fn callback(
                ud: ?*anyopaque,
                l_inner: *xev.Loop,
                c_inner: *xev.Completion,
                r: xev.Result,
            ) xev.CallbackAction {
                return @call(.always_inline, cb, .{
                    common.userdataValue(Userdata, ud),
                    l_inner,
                    c_inner,
                    initFd(c_inner.op.connect.socket),
                    if (r.connect) |_| {} else |err| err,
                });
            }
        }).callback,
    };
    loop.add(c);
}
```

### File

File I/O via Stream, typically using the thread pool where needed. Supports read/write, pread/pwrite, queuePWrite for ordered writes.

```zig
/// An implementation of File that uses the stream abstractions.
fn FileStream(comptime xev: type) type {
    return struct {
        const Self = @This();
        const FdType = if (xev.backend == .iocp) std.os.windows.HANDLE else posix.socket_t;

        /// The underlying file
        fd: FdType,

        const S = stream.Stream(xev, Self, .{
            .close = true,
            .poll = true,
            .read = .read,
            .write = .write,
            .threadpool = true,
        });
        pub const close = S.close;
        pub const poll = S.poll;
        pub const read = S.read;
        pub const write = S.write;
        pub const writeInit = S.writeInit;
        pub const queueWrite = S.queueWrite;
    }
}
```

### Process

Watch for a process exit and get its exit code. Platform-specific under the hood (pidfd/poll, kqueue proc filter, ...) but with a unified API: 

```zig
/// Create a new process watcher for the given pid.
pub fn init(pid: posix.pid_t) !Self {
    // Note: SOCK_NONBLOCK == PIDFD_NONBLOCK but we should PR that
    // over to Zig.
    const res = linux.pidfd_open(pid, posix.SOCK.NONBLOCK);
    const fd = switch (posix.errno(res)) {
        .SUCCESS => @as(posix.fd_t, @intCast(res)),
        .INVAL => return error.InvalidArgument,
        .MFILE => return error.ProcessFdQuotaExceeded,
        .NFILE => return error.SystemFdQuotaExceeded,
        .NODEV => return error.SystemResources,
        .NOMEM => return error.SystemResources,
        else => |err| return posix.unexpectedErrno(err),
    };
    return .{
        .fd = fd,
    };
}

...

/// Wait for the process to exit. This will automatically call
/// `waitpid` or equivalent and report the exit status.
pub fn wait(
    self: Self,
    loop: *xev.Loop,
    c: *xev.Completion,
    comptime Userdata: type,
    userdata: ?*Userdata,
    comptime cb: *const fn (
        ud: ?*Userdata,
        l: *xev.Loop,
        c: *xev.Completion,
        r: WaitError!u32,
    ) xev.CallbackAction,
) void { ... }
```

### Async (wake the loop from any thread)

An Async is a cross-thread wakeup primitive with a single effective waiter at a time. Calling `wait` installs that waiter for a loop and you must re-queue wait after each callback if you want future notifications. Multiple `notify()` calls can be coalesced by the backend. And don't register the same Async with multiple loops since that's explicitly undefined.

```zig
/// Create a new async. An async can be assigned to exactly one loop
/// to be woken up. The completion must be allocated in advance.
pub fn init() !Self { ... }

...

/// Wait for a message on this async. Note that async messages may be
/// coalesced (or they may not be) so you should not expect a 1:1 mapping
/// between send and wait.
///
/// Just like the rest of libxev, the wait must be re-queued if you want
/// to continue to be notified of async events.
///
/// You should NOT register an async with multiple loops (the same loop
/// is fine -- but unnecessary). The behavior when waiting on multiple
/// loops is undefined.
pub const wait = switch (xev.backend) {
    .io_uring, .epoll => waitPoll,
    .kqueue => waitRead,
    .iocp, .wasi_poll => @compileError("AsyncEventFd does not support wait for this backend"),
};

...

/// Notify a loop to wake up synchronously. This should never block forever
/// (it will always EVENTUALLY succeed regardless of if the loop is currently
/// ticking or not).
///
/// The "c" value is the completion associated with the "wait".
///
/// Internal details subject to change but if you're relying on these
/// details then you may want to consider using a lower level interface
/// using the loop directly:
///
///   - linux+io_uring: eventfd is used. If the eventfd write would block
///     (EAGAIN) then we assume success because the eventfd is full.
///
pub fn notify(self: Self) !void {
    // We want to just write "1" in the correct byte order as our host.
    const val = @as([8]u8, @bitCast(@as(u64, 1)));
    _ = posix.write(self.fd, &val) catch |err| switch (err) {
        error.WouldBlock => return,
        else => return err,
    };
}
```

## Buffers and polling semantics

We pass a ReadBuffer/WriteBuffer (either a slice or a small inline array). libxev reads/writes directly into that buffer, and our callback gets the byte count (or EOF/error). We still hold the same buffer, so we can reuse or slice it as we like.

```zig
// kqueue.zig

pub const ReadBuffer = union(enum) {
    slice: []u8,
    array: [32]u8,
};

pub const WriteBuffer = union(enum) {
    slice: []const u8,
    array: struct { array: [32]u8, len: usize },
};
```

## Thread pool

The loop can run everything on the OS async interface when the platform supports it (sockets, pipes), but regular files can be an exception since many backends can't do non-blocking file I/O directly. A configurable thread pool can be a solution. We opt in at loop creation, then watchers that require blocking I/O mark their completions to be executed on the pool. The worker thread performs the blocking system call and hands the finished completion back to the loop, so the callback still runs on the loop thread with a normal Result.

We can just provide a ThreadPool in Loop.Options for file I/O, as we've seen before:

```zig
pub const Options = struct { entries: u32 = 256, thread_pool: ?*xev.ThreadPool = null, };
```

## Backend specifics

This section only documents deltas from Core loop model. If something isn't mentioned, it follow Core. Be advised: some parts may be redundant. Nevertheless, I included them anyway to emphasize some technical details for my own understanding. If you're just using libxev, you can skip this. This section explores internals for those curious about how completions map to OS primitives.

At a high level, the loop is a state machine that:

- accepts requests (completions),
- turns them into kernel registrations or immediate actions,
- drives them to completion,
- invokes your callback with a Result,
- and repeats or stops per your intent.

This is represented by the `loop.zig`. Let's walk the phases.

### 1. Accepts requests (completions)

You enqueue work by handing a `Completion` to the loop. The loop marks it and either places it into a user-space FIFO or directly prepares a kernel submission. This is the same idea across backends, but mechanics vary:

```zig
// kqueue.zig
// mark "adding", then user FIFO

pub fn add(self: *Loop, completion: *Completion) void {
    // If this is a cancellation, we special case it and add it to
    // a separate queue so we can handle them first.
    if (completion.op == .cancel) {
        assert(!self.start(completion, undefined));
        return;
    }
    // We just add the completion to the queue. Failures can happen
    // at submission or tick time.
    completion.flags.state = .adding;
    self.submissions.push(completion);
}
```

```zig
// iouring.zig
// mark "active", try SQE. if full, user FIFO

pub fn add(self: *Loop, completion: *Completion) void { self.add_(completion, false); }
...
completion.flags.state = .active;
const sqe = self.ring.get_sqe() catch |err| switch (err) {
    error.SubmissionQueueFull => { self.submissions.push(completion); return; },
};
self.active += 1;
```

### 2. Turns requests into kernel registrations or immediate actions

The loop inspects the operation and chooses one of: register with kernel poller, schedule a timer, request cancellation, offload to thread pool, or resolve immediately via a syscall. From what I've seen, this decision is explicit in kqueue and iouring, I didn't check if it is like that in all backends but I imagine so.

```zig
// iouring.zig

// Setup the submission depending on the operation
switch (completion.op) {
    // Do nothing with noop completions.
    .noop => {
        completion.flags.state = .dead;
        self.active -= 1;
        return;
    },
    .accept => |*v| sqe.prep_accept(
        v.socket,
        &v.addr,
        &v.addr_size,
        v.flags,
    ),
    .close => |v| sqe.prep_close(v.fd),
    .connect => |*v| sqe.prep_connect(
        v.socket,
        &v.addr.any,
        v.addr.getOsSockLen(),
    ),
    .poll => |v| sqe.prep_poll_add(v.fd, v.events),
    .read => |*v| switch (v.buffer) {
        .array => |*buf| sqe.prep_read(
            v.fd,
            buf,
            // offset is a u64 but if the value is -1 then it uses
            // the offset in the fd.
            @bitCast(@as(i64, -1)),
        ),
        .slice => |buf| sqe.prep_read(
            v.fd,
            buf,
            // offset is a u64 but if the value is -1 then it uses
            // the offset in the fd.
            @bitCast(@as(i64, -1)),
        ),
    },
    .pread => |*v| switch (v.buffer) {
        .array => |*buf| sqe.prep_read(
            v.fd,
            buf,
            v.offset,
        ),
        .slice => |buf| sqe.prep_read(
            v.fd,
            buf,
            v.offset,
        ),
    },
    .recv => |*v| switch (v.buffer) {
        .array => |*buf| sqe.prep_recv(
            v.fd,
            buf,
            0,
        ),
        .slice => |buf| sqe.prep_recv(
            v.fd,
            buf,
            0,
        ),
    },
    .recvmsg => |*v| {
        sqe.prep_recvmsg(
            v.fd,
            v.msghdr,
            0,
        );
    },
    .send => |*v| switch (v.buffer) {
        .array => |*buf| sqe.prep_send(
            v.fd,
            buf.array[0..buf.len],
            0,
        ),
        .slice => |buf| sqe.prep_send(
            v.fd,
            buf,
            0,
        ),
    },
    // ...
```

### 3. Drives them to completion

The loop submits pending changes and then blocks (or not) until at least one completion is ready. The kernel reports completed work.

In the case of kqueue, it batches changes then kevent wait. io_uring uses ring submit/wait + CQEs.

```zig
// kqueue.zig

// Wait for changes. Note that we ALWAYS attempt to get completions
// back even if are done waiting (wait_rem == 0) because if we have
// to make a syscall to submit changes, we might as well also check
// for done events too.
const completed = completed: while (true) {
    break :completed kevent_syscall(
        self.kqueue_fd,
        events[0..changes],
        events[0..events.len],
        if (timeout) |*t| t else null,
    ) catch |err| switch (err) {
        // This should never happen because we always have
        // space in our event list. If I'm reading the BSD source
        // right (and Apple does something similar...) then ENOENT
        // is always put into the eventlist if there is space:
        // https://github.com/freebsd/freebsd-src/blob/5a4a83fd0e67a0d7787d2f3e09ef0e5552a1ffb6/sys/kern/kern_event.c#L1668
        error.EventNotFound => unreachable,
        // Any other error is fatal
        else => return err,
    };
};
```

```zig
// io_uring

// Wait for completions...
const count = self.ring.copy_cqes(&cqes, wait) catch |err| switch (err) {
    // EINTR means our blocking syscall was interrupted by some
    // process signal. We just retry when we can. See signal(7).
    error.SignalInterrupt => continue,
    else => return err,
};
for (cqes[0..count]) |cqe| {
    const c = @as(?*Completion, @ptrFromInt(@as(usize, @intCast(cqe.user_data)))) orelse continue;
    self.active -= 1;
    c.flags.state = .dead;
    switch (c.invoke(self, cqe.res)) {
        .disarm => {},
        .rearm => self.add(c),
    }
}
```

I imagine that this amortizes syscalls and ensures completions are processed consistently on the main thread.

### 4. Invoking the callback with a Result

The loop constructs a backend-specific `Result` (success/error payloads) and calls your callback. The callback only deals with final outcomes (bytes, EOF, errors), never readiness.

Examples: kqueue calls the callback after building or staging `Result`, io_uring builds `Result` in `Completion.invoke`:

```zig
// kqueue.zig

// Completion queue items MUST have a result set.
const action = c.callback(c.userdata, self, c, c.result.?);
switch (action) {
    // If we're active we have to schedule a delete. Otherwise
    // we do nothing because we were never part of the kqueue.
    .disarm => {
        if (disarm_ev) |ev| {
            events[changes] = ev;
            events[changes].flags = std.c.EV.DELETE;
            events[changes].udata = 0;
            changes += 1;
            assert(changes <= events.len);
        }
        if (c_active) self.active -= 1;
    },
    // Only resubmit if we aren't already active (in the queue)
    .rearm => if (!c_active) self.submissions.push(c),
}
```

```zig
// io_uring.zig

/// Invokes the callback for this completion after properly constructing
/// the Result based on the res code.

fn invoke(self: *Completion, loop: *Loop, res: i32) CallbackAction {
    const result: Result = switch (self.op) {
        .accept => .{ .accept = if (res >= 0) @intCast(res) else switch (...) { ... } },
        .read   => .{ .read = self.readResult(.read, res) },
        .send   => .{ .send = if (res >= 0) @intCast(res) else switch (...) { ... } },
        // ...
    };
    return self.callback(self.userdata, loop, self, result);
}
```

### 5. Repeats or stops per intent

The callback returns `.rearm` to repeat the same operation or `.disarm` to stop. The loop either re-adds the completion or schedules a deletion/unregistration. Termination means no active work and no pending queues.

```zig
// kqueue.zig

// Only resubmit if we aren't already active (in the queue)
.rearm => if (!c_active) self.submissions.push(c),

...

fn done(self: *Loop) bool {
        return self.flags.stopped or (self.active == 0 and
            self.submissions.empty() and
            self.completions.empty());
}
```

```zig
// iouring.zig

if (self.active == 0 and self.submissions.empty()) break;

// If we have no queued submissions then we do the wait as part
// of the submit call, because then we can do exactly once syscall
// to get all our events.
if (self.submissions.empty()) {
    _ = self.ring.submit_and_wait(wait) catch |err| switch (err) {

...

switch (c.invoke(self, cqe.res)) {
                    .disarm => {},
                    .rearm => self.add(c),
                }
```

---

*Last updated: 251101*