---
title: "Morphing the Divina Commedia into byte tokens with Zig"
date: "2025-08-18"
---

Nothing fancy. I just dumped the Divina Commedia into a contiguous `u16` slice.

```zig 
const path = "commedia.txt";
const buf = try tok.tokenizeFile(allocator, path);
defer allocator.free(buf.data);
```

Running it:

```bash
$ zig run src/main.zig -- commedia.txt
tokens: 300682 (expected 300682)
head: { 10, 32, 32, 78, 101, 108, 32, 109, 101, 122 }
```

Just 300682 u16s waiting for an embedding matrix :)



