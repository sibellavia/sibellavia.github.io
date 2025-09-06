---
title: "Fil-C, a memory safe implementation of C and C++"
date: "2025-09-06"
---

Yesterday, [Fil-C](https://fil-c.org/programs_that_work) popped up to the top of [Hacker News](https://news.ycombinator.com/item?id=45133938). This time the submission got a fair amount of traction, sparking a lot of interest in the community, including a comment from Andrew Kelley. In fact, I’ve been interested in Fil-C for about a year already: my first submission on Hacker News was eight months ago. So I can say I’ve been actively following the project’s progress, also thanks to the activity of its creator, @filpizlo, on Twitter.

Fil-C is a compiler that implements the C and C++ languages with a memory-safe approach. Recently, Filip has published more documentation about the Garbage Collector and about the capabilities he calls "InvisiCaps", which are more related to pointer safety.

Well, for me this is kind of a dream. I love the C language, it's my favorite, but I admit I have some skill issues when it comes to memory management, though not because of the language itself, but rather due to my own code-writing proficiency, which could definitely be better. Recently, I’ve been exploring Rust and Zig precisely for this reason, and I’ve found myself appreciating Zig more than Rust because of its minimalism. Having a memory-safe implementation of C would therefore resolve a lot of the headaches caused by memory management.

Fil-C seems like the sweet spot between academic research and pragmatic work. Beyond the documentation, there’s also [a list of programs already ported to Fil-C](https://fil-c.org/programs_that_work), showing that sometimes no code changes are required, and when they are, the effort is moderate.

So, the next step for me is to dig deeper into the topic and try it out myself! In the meantime, I thought it would be fair to personally share what Filip is doing, because the project deserves much more attention than it’s currently getting, imo.
