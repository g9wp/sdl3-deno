/**
 * # CategoryAtomic
 *
 * Atomic operations.
 *
 * IMPORTANT: If you are not an expert in concurrent lockless programming, you
 * should not be using any functions in this file. You should be protecting
 * your data structures with full mutexes instead.
 *
 * ***Seriously, here be dragons!***
 *
 * You can find out a little more about lockless programming and the subtle
 * issues that can arise here:
 * https://learn.microsoft.com/en-us/windows/win32/dxtecharts/lockless-programming
 *
 * There's also lots of good information here:
 *
 * - https://www.1024cores.net/home/lock-free-algorithms
 * - https://preshing.com/
 *
 * These operations may or may not actually be implemented using processor
 * specific atomic operations. When possible they are implemented as true
 * processor specific atomic operations. When that is not possible the are
 * implemented using locks that *do* use the available atomic operations.
 *
 * All of the atomic operations that modify memory are full memory barriers.
 *
 * @module
 */

/*
  Simple DirectMedia Layer
  Copyright (C) 1997-2025 Sam Lantinga <slouken@libsdl.org>

  This software is provided 'as-is', without any express or implied
  warranty.  In no event will the authors be held liable for any damages
  arising from the use of this software.

  Permission is granted to anyone to use this software for any purpose,
  including commercial applications, and to alter it and redistribute it
  freely, subject to the following restrictions:

  1. The origin of this software must not be misrepresented; you must not
     claim that you wrote the original software. If you use this software
     in a product, an acknowledgment in the product documentation would be
     appreciated but is not required.
  2. Altered source versions must be plainly marked as such, and must not be
     misrepresented as being the original software.
  3. This notice may not be removed or altered from any source distribution.
*/

export const symbols = {
/* Information from:
   https://chromium.googlesource.com/chromium/chromium/+/trunk/base/atomicops_internals_arm_gcc.h#19

   The Linux kernel provides a helper function which provides the right code for a memory barrier,
   hard-coded at address 0xffff0fa0
*/
SDL_KernelMemoryBarrierFunc: {
      parameters: [],
      result: "void"
    },

} as const satisfies Deno.ForeignLibraryInterface;


/* Information from:
   https://chromium.googlesource.com/chromium/chromium/+/trunk/base/atomicops_internals_arm_gcc.h#19

   The Linux kernel provides a helper function which provides the right code for a memory barrier,
   hard-coded at address 0xffff0fa0
*/
export function KernelMemoryBarrierFunc(cb: (
  ) => void) {
  return new Deno.UnsafeCallback(symbols.SDL_KernelMemoryBarrierFunc, cb);
}

