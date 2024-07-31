+++
title = "malloc() from scratch in C"
date = "2024-07-12"
description = "How I implemented malloc library from scratch in C, step by step and briefly explained."
draft = "true"
+++

## Sources
1. https://danluu.com/malloc-tutorial/
2. https://man7.org/linux/man-pages/man3/malloc.3.html
3. https://www.gnu.org/software/libc/manual/html_node/Basic-Allocation.html
4. https://www.ibm.com/docs/en/i/7.5?topic=functions-malloc-reserve-storage-block
5. https://moss.cs.iit.edu/cs351/slides/slides-malloc.pdf

In this article I would like to show you my malloc() implementation from scratch in C. I'll take the chance to show the code step by step and I'll try to cover all the didactical aspects involved.

I'm assuming you already know C at an intermediate level, so you already know what pointers are. I'm also assuming you're already familiar with the concept of Linked List. If you think you have to fill some of these gaps, you can look at the references I put at the beginning.

This article is inspired by Dan Luu's malloc tutorial[1] :-)

## About Memory Layout

Before diving into the implementation, let's briefly have a look at how a typical program's memory is laid out. Memory layout typically consists of the following sections (from bottom to top):

- Text Segment (Code Segment)
	- Contains executable instructions
	- Typically read-only to prevent accidental modification of instructions
	- Shared among different processes running the same program
- Initialized Data Segment
	- Contains global and static variables that are initialized with non-zero values
	- Example: `static int i = 10;`
- Unitialized Data Segment (BSS - Block Started by Symbol)
	- Contains global and static variables initialized to zero or not initialized
	- Example: `static int j;`
- Heap
	- Used for dynamic memory allocation
	- Grows upward (toward higher addresses)
	- Managed by `malloc`, `free`, `realloc`, etc.
- Stack
	- Used for local variables, function parameters, return addresses
	- Grows downward (toward lower addresses)
	- Managed automatically by the compiler
- Environment Variables and Command Line Arguments
	- Highest addresses in the user space memory
-

The heap and stack grow in opposite directions to maximize the use of the available address space. This design allows both to grow as needed without immediately interfering with each other. If they grew in the same direction, they might collide more quickly, limiting the available memory for either dynamic allocation or function calls/local variables.

The heap doesn't grow indefinitely, but it can grow when more memory is needed, up to a limit. When `malloc` needs more memory, it can request more from the operating system. This is usually done through system calls (which we'll discuss later). There is a limit, but it's usually very large on modern systems.

If the heap grows too much, it could lead to heap overflow, out of memory or fragmentation.

## System Calls: sbrk() and mmap()

Now let's focus on the system calls that are typically used to request memory from the OS: `sbrk()` and `mmap()`.

```c
#include <unistd.h>
void *sbrk(int incr);
```

The `sbrk()` function takes an increment byte as an argument and changes the space allocated for the calling process. The amount of allocated space increases when `incr` is positive and decreases when `incr` is negative.
I will use `sbrk()` as my primary method to request more memory from the OS, because it's simpler and more straightforward for learning purposes. Typically, `mmap()` is more flexible and used for large allocations.

If we have to imagine the workflow in our implementation, when our malloc is first called we can use `sbrk()` to allocate a chunk of memory to manage. If our managed memory is full and we need more, we'd call `sbrk()` again. After `sbrk()` assigns the requested memory, our malloc will need to manage this space:

```c
void* request_more_memory(size_t size) {
    void* new_mem = sbrk(size);
    if (new_mem == (void*)-1) {
        // sbrk failed
        return NULL;
    }
    // Add new_mem to our free list or memory management structure
    return new_mem;
}
```

Now that we have covered all the informations needed, we can proceed with the implementation.

## tinymalloc()

Our `malloc()` implementation will be simple. We will consider a linked list of memory blocks, where each block contains metadata (size, free status and a pointer to the next block). We will use a First-Fit allocation strategy to find a suitable free block, meaning that we will traverse the list of blocks and use the first free block that's large enough for the user's request. If we find a free block that is much larger than the requested size, we will split it into two blocks. If no suitable free block is found, we will request more memory from the OS using `sbrk()`, allowing the heap to grow dynamically as needed. Let's start :-)

First of all, we have to define three constants that we will use in our code.

```c
#define INITIAL_HEAP_SIZE (1024 * 1024)
#define THRESHOLD (1024)
#define EXPANSION_SIZE (1024 * 1024)
```

When we will initialize the heap memory we will have to pass to `sbrk()` the memory requested. In this case, for learning purposes we're defining `INITIAL_HEAP_SIZE` equal to 1 MB. We will use `THRESHOLD` and `EXPANSION_SIZE` during out memory block splitting logic.

```c
struct block {
    size_t size;
    int is_free;
    struct block *next;
}
```

Our block structure will store the memory allocated, the size, a metadata indicating if the block is free (1) or not (0), and a pointer to the next block in the linked list.
