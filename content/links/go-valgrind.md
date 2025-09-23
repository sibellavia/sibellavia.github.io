---
title: "Go has added Valgrind support"
date: 2025-09-23T15:28:00+02:00
draft: false
link: "https://go-review.googlesource.com/c/go/+/674077"
tags: ["golang", "valgrind"]
---

> Instead of adding the Valgrind headers to the tree, and using cgo to
call the various Valgrind client request macros, we just add an assembly
function which emits the necessary instructions to trigger client
requests.

This is super interesting. Let's have a quick look at the code:

```go
// Copyright 2025 The Go Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.
//go:build valgrind && linux
#include "textflag.h"
// Instead of using cgo and using the Valgrind macros, we just emit the special client request
// assembly ourselves. The client request mechanism is basically the same across all architectures,
// with the notable difference being the special preamble that lets Valgrind know we want to do
// a client request.
//
// The form of the VALGRIND_DO_CLIENT_REQUEST macro assembly can be found in the valgrind/valgrind.h
// header file [0].
//
// [0] https://sourceware.org/git/?p=valgrind.git;a=blob;f=include/valgrind.h.in;h=f1710924aa7372e7b7e2abfbf7366a2286e33d2d;hb=HEAD
// func valgrindClientRequest(uintptr, uintptr, uintptr, uintptr, uintptr, uintptr) (ret uintptr)
TEXT runtime·valgrindClientRequest(SB), NOSPLIT, $0-56
	// Load the address of the first of the (contiguous) arguments into AX.
	LEAQ args+0(FP), AX
	// Zero DX, since some requests may not populate it.
	XORL DX, DX
	// Emit the special preabmle.
	ROLQ $3, DI; ROLQ $13, DI
	ROLQ $61, DI; ROLQ $51, DI
	// "Execute" the client request.
	XCHGQ BX, BX
	// Copy the result out of DX.
	MOVQ DX, ret+48(FP)
	RET
```

This is the amd64 assembly for the Valgrind client request. This asm emits the exact instruction sequence that Valgrind's macro `VALGRIND_DO_CLIENT_REQUEST` would have produced in C, just without cgo. 

On arm64, the same idea is implemented with different registers and the AArch64 "marker" Valgrind looks for. 

It's nice because they do everything on the language itself, even when relying on assembly. Some reasons I could imagine they do it this way: to avoid cgo and keep the runtime pure-Go, but most importantly control. 

Really interesting for me that Go team decided to follow this route. Also, I'm not a fan of cgo. 

