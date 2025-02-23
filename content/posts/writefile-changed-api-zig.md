---
title: Zig, writeFile signature
date: 2025-02-23
---

Lately, I've been working on a library that generates content--let's say blog posts for simplicity--and saves them to files. The idea is straightforward: take some text and write it to a file at a specified path.

Here's the line of code I started with:

```zig
try std.fs.cwd().writeFile(output_path, post_page.content);
```

In the current version of Zig (I'm using 0.13.0) the compiler threw an error. That's because `writeFile` changed signature:

```zig
pub fn writeFile(self: Dir, options: WriteFileOptions) WriteFileError!void
```

Instead of taking separate arguments for the path and data, `writeFile` expects a single argument, a `WriteFileOptions` struct. Here’s what that struct looks like:

```zig
pub const WriteFileOptions = struct {
    sub_path: []const u8,       // The file path relative to the directory
    data: []const u8,          // The content to write
    flags: File.CreateFlags = .{}, // Optional flags (defaults to an empty set)
};
```

It uses a struct instead of separate arguments. Actually, I'm noticing that this design is common in Zig to make functions more explicit and flexible. In older versions of Zig, the `writeFile` did take two arguments -- in fact, don't be surprised if Claude might suggest you to use the old signature.

Here's the corrected version of my initial code, that now uses an anonymous struct:

```zig
try std.fs.cwd().writeFile(.{
    .sub_path = output_path,
    .data = post_page.content,
});
```

If you're new to Zig, I hope this small peek into `std.fs` was helpful.

Happy coding!