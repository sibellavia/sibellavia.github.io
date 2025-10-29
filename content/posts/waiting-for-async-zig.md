---
title: "Waiting for Zig's new Async I/O"
date: 2025-10-29T21:39:00+01:00
---

Zig will introduce its [new async](https://github.com/ziglang/zig/pull/25592) soon. It is still under active development. While we wait for it, you can already build async code in Zig today, you just don't get language keywords for it. Some readers will already know how to do it, others won't. Since I love unpacking things, let's see how async actually works under the hood, using Zig as the example language.

When you do this:

```zig
const std = @import("std");

pub fn main() !void {
    const file = try std.fs.cwd().openFile("data.txt", .{});
    const contents = try file.readToEndAlloc(std.heap.page_allocator, 1 << 20);
    std.debug.print("Read {} bytes\n", .{contents.len});
}
```

Zig executes one thing at a time: open a file, wait for disk, read bytes, and print.

While the file read is waiting, the CPU is idle. That's fine for a CLI, not for a server handling 10k connections, this means the program would freeze while waiting on each socket. We all know that: instead of waiting until done, we ask the OS to tell when it's done, and in the meanwhile run something else.

Operating systems let you open sockets or files in non-blocking mode. Then if you call `read()`, it may say "not ready yet" instead of waiting. The OS also lets you ask "tell me when socket 3 has data". Different OSes have different APIs for that: Linux has `epoll` and `io_uring`, macOS and BSD have `kqueue`, Windows has `IOCP`.

You then write a little *event loop*, that asks the OS to run handlers for sockets that are ready. This is a classic reactor pattern.

If you want to make code look synchronous (like `await doThing()`), under the hood you need a scheduler that remembers which task is waiting for which event, and resumes it when the event completes. In older versions of Zig, `async` and `await` were compiler features that built these state machines for you. While waiting for the new async set, you can still build them manually using (1) non-blocking I/O (epoll, io_uring, etc.), (2) an event loop that waits for events, (3) a scheduler to keep track of paused tasks. This is, of course, a sufficient but not exhaustive list, just to give an idea of it.

This is nothing new for an experienced programmer. The reactor pattern is one of the main ways in which C does async. In C you choose an event API and optionally a coroutine library, then write or reuse a tiny scheduler. That’s the same structure we just outlined for Zig, only with Zig’s tooling and syntax.

You don't have to build everything from scratch by the way. Many projects, both in C and Zig, use event loop libraries, which are reusable implementations of the reactor or proactor pattern. These libraries handle all the platform specific details and give you a simple API for running timers, sockets, files and subprocesses in a single thread. Some notable ones are [libev](https://github.com/enki/libev), [libuv](https://github.com/libuv/libuv) (Node, for example, uses libuv) and [libxev](https://github.com/mitchellh/libxev), with the latter that was created by [mitchellh](https://x.com/mitchellh), the creator of Ghostty!

Zig's new async I/O system, once merged, will likely make it easier to build on top of these ideas, offering a standard API that libraries like libxev can plug into without locking you into one specific backend. The new PR mentioned at the beginning of this blog post tries to standardize how async I/O will be done in Zig's standard library, so user code will rely on a uniform `Io` interface rather than whichever library you pull in. 

As a Zig fan, I'm really looking forward to it.