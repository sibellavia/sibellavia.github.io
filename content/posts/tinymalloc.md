---
title: tinymalloc.c, my memory allocator
date: 2024-08-18
---

## introduction

I love C. I love low-level engineering, and I love memory management. during my summer break, I wanted to have some fun re-implementing malloc() from scratch. it's a classic university project.
however, as I was working on it, I realized I could do more and had a lot of fun experimenting with alternatives, studying papers, and looking at other memory allocator implementations.

[that's how tinymalloc was born.](https://github.com/sibellavia/tinymalloc)

## key features of tinymalloc

in the beginning, tinymalloc provided a simple linked-list with while loops calling sbrk().
over time, the design changed profoundly and I made specific technical choices.

[![my X post with tinymalloc benchmark](/images/tinymalloc.c/benchmark.png)](https://x.com/sibellavia/status/1822283610805662053)

- multi-arena design. i really liked it in jemalloc, and I wanted to integrate it in my implementation. tinymalloc uses a multi-arena approach where memory is divided into separate arenas. each thread is typically assigned its own arena for small and medium allocations.
- bitmap-based allocation. after dismissing the linked-list approach I implemented an allocator that uses a bitmap to keep track of free and occupied memory blocks. I wanted an approach that could offer a good balance between allocation speed and memory overhead.
- allocation size ranges. tinymalloc categorizes allocations into three ranges: small, medium and large:
  - small allocations (<=64bytes) use a fast-path allocation strategy
  - medium allocations use a standard bitmap search
  - large allocations (>= 4096 bytes) are handled separately, potentially using a different arena to avoid fragmentation of smaller allocation spaces.
- dynamic heap extension. when the existing heap space is exhausted, tinymalloc can dynamically extend the heap. this should allow the allocator to adapt to growing memory needs without requiring a fixed initial allocation.
- thread-local optimization. hoping of having implemented it correctly lol. btw, tinymalloc uses a thread-local storage to remember each thread's assigned arena. I wanted it to reduce the overhead of arena selection of subsequent allocations from the same thread.

## core components

let's examine the fundamental building blocks. the allocator is built around a few key structures and global variables that manage the memory allocation process.

### BitmapAllocator struct

the very core of tinymalloc's allocation strategy is the BitmapAllocator structure:

```c
typedef struct {
  void *heap;
  size_t heap_size;
  uint64_t *bitmap;
  size_t bitmap_size;
} BitmapAllocator;
```

- _heap_ is a pointer to the heap memory
- _heap_size_ self-explaining
- _bitmap_ is a pointer to the bitmap used for tracking allocations
- _bitmap_size_ is the size of the bitmap

### Arena struct

represents a single allocation arena:

```c
typedef struct {
  BitmapAllocator allocator;
  pthread_mutex_t mutex;
  size_t allocated_blocks;
} Arena;
```

each arena contains:

- a _BitmapAllocator_ for managing its heap
- a mutex for thread-safe ops
- a count of _allocated_blocks_ for load balancing

### Global variables

tinymalloc uses several global variables to manage its state:

```c
static Arena *arenas = NULL; // the array of arenas
static int num_arenas = 0; // number of arenas
static bool arenas_initialized = false; // whether the arenas have been initialized
static int next_arena_index = 0; // the index for the next arena to be assigned
pthread_mutex_t malloc_mutex = PTHREAD_MUTEX_INITIALIZER; // mutex
static pthread_mutex_t arena_index_mutex = PTHREAD_MUTEX_INITIALIZER; // mutex
```

### Constants

several constants define the behavior off the allocator:

```c
#define HEAP_SIZE 1048576 // 1 MB
#define BLOCK_SIZE 16     // 16 bytes per block
#define BITMAP_SIZE (HEAP_SIZE / BLOCK_SIZE / 64)
#define SMALL_ALLOCATION_THRESHOLD (4 * BLOCK_SIZE)   // 64 bytes
#define LARGE_ALLOCATION_THRESHOLD (256 * BLOCK_SIZE) // 4096 bytes
```

so the BitmapAllocator manages individual heaps, while the Arena structure provides a layer of abstraction for multi-threaded use. the global variables and constants offer a guide to the overall behavior and limits of the allocator.

## allocation process

the allocation process in tinymalloc involves several steps.

we start with an initialization check. _initialize_if_needed_ function is called at the start of tinymalloc:

```c
static bool initialize_if_needed() {
  if (!arenas_initialized) {
    if (!init_memory()) {
      return false;
    }
    arenas_initialized = true;
  }
  return true;
}
```

this sets up arenas if they haven't been initialized.

the _select_arena_ function chooses an arena for the allocation. it assigns each thread its own arena for small and medium allocations, and select the least used arena for large allocation. if no free blocks are found, _extend_heap_ is called, increases the size of the heap and bitmap.

the tinymalloc function coordinates these steps:

```c
void *tinymalloc(size_t size) {
  if (size == 0)
    return NULL;

  pthread_mutex_lock(&malloc_mutex);

  if (!initialize_if_needed()) {
    pthread_mutex_unlock(&malloc_mutex);
    return NULL;
  }

  void *result = allocate_memory(size);

  pthread_mutex_unlock(&malloc_mutex);
  return result;
}
```

the entire process manages memory allocation across multiple threads.

## deallocation process

the deallocation process in tinymalloc involves locating the correct arena for a given pointer and freeing the associated blocks. the _tinyfree_ function coordinates the deallocation:

```c
void tinyfree(void *ptr) {
  if (ptr == NULL)
    return;

  pthread_mutex_lock(&malloc_mutex);

  Arena *arena = find_arena_for_pointer(ptr);

  if (arena == NULL) {
    pthread_mutex_unlock(&malloc_mutex);
    return; // invalid pointer
  }

  if (arena != NULL) {
    deallocate_memory(arena, ptr);
  }

  pthread_mutex_unlock(&malloc_mutex);
}
```

## potential improvements and contributing

I wrote tinymalloc entirely for fun. there are indeed some ares that could be improved.

the first I can identify is the global mutex for all allocations. it can become a bottleneck especially under high concurrency.

the second flaw is that the current arena selection mechanism for large allocations iterates through all arenas. highly inefficient as the number of arenas increases.

also, having a fixed _HEAP_SIZE_ is slop. it may not be optimal for all use cases and it might be too small for some applications, or wasteful for others.

memory fragmentation. the big monster. the current allocation strategy doesn't do much to prevent or mitigate fragmentation. which could lead to inefficient memory use over time.

and more.

but! these issues provide a good starting point for improving the tinymalloc implementation :-)
this is why I invite you to contribute to the code.

[the tinymalloc repository is on github](https://github.com/sibellavia/tinymalloc) and the indications to contribute are really essential (bcos I want to remember that the project is just for fun!):

- use 2 spaces for indentation
- add inline comments where possible
- write unit tests for new features
- always check for buffer overflows and memory leaks

## resources

[![my X post with tinymalloc resources](/images/tinymalloc.c/resources.png)](https://x.com/sibellavia/status/1823836940153839974)

[I wrote a post on X](https://x.com/sibellavia/status/1823836940153839974) listing all the resources I studied that inspired me for tinymalloc. you can take a look.

thank you for reading this far! if you liked this blog post, [consider following me on X.](https://x.com/sibellavia)
