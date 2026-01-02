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

/**
 * Try to lock a spin lock by setting it to a non-zero value.
 *
 * ***Please note that spinlocks are dangerous if you don't know what you're
 * doing. Please be careful using any sort of spinlock!***
 *
 * @param lock a pointer to a lock variable.
 * @returns true if the lock succeeded, false if the lock is already held.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_LockSpinlock
 * @sa SDL_UnlockSpinlock
 *
 * @from SDL_atomic.h:99 bool SDL_TryLockSpinlock(SDL_SpinLock *lock);
 */
SDL_TryLockSpinlock: {
      parameters: ["pointer"],
      result: "bool"
    },


/**
 * Lock a spin lock by setting it to a non-zero value.
 *
 * ***Please note that spinlocks are dangerous if you don't know what you're
 * doing. Please be careful using any sort of spinlock!***
 *
 * @param lock a pointer to a lock variable.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_TryLockSpinlock
 * @sa SDL_UnlockSpinlock
 *
 * @from SDL_atomic.h:116 void SDL_LockSpinlock(SDL_SpinLock *lock);
 */
SDL_LockSpinlock: {
      parameters: ["pointer"],
      result: "void"
    },


/**
 * Unlock a spin lock by setting it to 0.
 *
 * Always returns immediately.
 *
 * ***Please note that spinlocks are dangerous if you don't know what you're
 * doing. Please be careful using any sort of spinlock!***
 *
 * @param lock a pointer to a lock variable.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_LockSpinlock
 * @sa SDL_TryLockSpinlock
 *
 * @from SDL_atomic.h:135 void SDL_UnlockSpinlock(SDL_SpinLock *lock);
 */
SDL_UnlockSpinlock: {
      parameters: ["pointer"],
      result: "void"
    },


/**
 * Insert a memory release barrier (function version).
 *
 * Please refer to SDL_MemoryBarrierRelease for details. This is a function
 * version, which might be useful if you need to use this functionality from a
 * scripting language, etc. Also, some of the macro versions call this
 * function behind the scenes, where more heavy lifting can happen inside of
 * SDL. Generally, though, an app written in C/C++/etc should use the macro
 * version, as it will be more efficient.
 *
 * @threadsafety Obviously this function is safe to use from any thread at any
 *               time, but if you find yourself needing this, you are probably
 *               dealing with some very sensitive code; be careful!
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_MemoryBarrierRelease
 *
 * @from SDL_atomic.h:191 void SDL_MemoryBarrierReleaseFunction(void);
 */
SDL_MemoryBarrierReleaseFunction: {
      parameters: [],
      result: "void"
    },


/**
 * Insert a memory acquire barrier (function version).
 *
 * Please refer to SDL_MemoryBarrierRelease for details. This is a function
 * version, which might be useful if you need to use this functionality from a
 * scripting language, etc. Also, some of the macro versions call this
 * function behind the scenes, where more heavy lifting can happen inside of
 * SDL. Generally, though, an app written in C/C++/etc should use the macro
 * version, as it will be more efficient.
 *
 * @threadsafety Obviously this function is safe to use from any thread at any
 *               time, but if you find yourself needing this, you are probably
 *               dealing with some very sensitive code; be careful!
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_MemoryBarrierAcquire
 *
 * @from SDL_atomic.h:211 void SDL_MemoryBarrierAcquireFunction(void);
 */
SDL_MemoryBarrierAcquireFunction: {
      parameters: [],
      result: "void"
    },


/**
 * Set an atomic variable to a new value if it is currently an old value.
 *
 * ***Note: If you don't know what this function is for, you shouldn't use
 * it!***
 *
 * @param a a pointer to an SDL_AtomicInt variable to be modified.
 * @param oldval the old value.
 * @param newval the new value.
 * @returns true if the atomic variable was set, false otherwise.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetAtomicInt
 * @sa SDL_SetAtomicInt
 *
 * @from SDL_atomic.h:414 bool SDL_CompareAndSwapAtomicInt(SDL_AtomicInt *a, int oldval, int newval);
 */
SDL_CompareAndSwapAtomicInt: {
      parameters: ["pointer", "i32", "i32"],
      result: "bool"
    },


/**
 * Set an atomic variable to a value.
 *
 * This function also acts as a full memory barrier.
 *
 * ***Note: If you don't know what this function is for, you shouldn't use
 * it!***
 *
 * @param a a pointer to an SDL_AtomicInt variable to be modified.
 * @param v the desired value.
 * @returns the previous value of the atomic variable.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetAtomicInt
 *
 * @from SDL_atomic.h:434 int SDL_SetAtomicInt(SDL_AtomicInt *a, int v);
 */
SDL_SetAtomicInt: {
      parameters: ["pointer", "i32"],
      result: "i32"
    },


/**
 * Get the value of an atomic variable.
 *
 * ***Note: If you don't know what this function is for, you shouldn't use
 * it!***
 *
 * @param a a pointer to an SDL_AtomicInt variable.
 * @returns the current value of an atomic variable.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_SetAtomicInt
 *
 * @from SDL_atomic.h:451 int SDL_GetAtomicInt(SDL_AtomicInt *a);
 */
SDL_GetAtomicInt: {
      parameters: ["pointer"],
      result: "i32"
    },


/**
 * Add to an atomic variable.
 *
 * This function also acts as a full memory barrier.
 *
 * ***Note: If you don't know what this function is for, you shouldn't use
 * it!***
 *
 * @param a a pointer to an SDL_AtomicInt variable to be modified.
 * @param v the desired value to add.
 * @returns the previous value of the atomic variable.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_AtomicDecRef
 * @sa SDL_AtomicIncRef
 *
 * @from SDL_atomic.h:472 int SDL_AddAtomicInt(SDL_AtomicInt *a, int v);
 */
SDL_AddAtomicInt: {
      parameters: ["pointer", "i32"],
      result: "i32"
    },


/**
 * Set an atomic variable to a new value if it is currently an old value.
 *
 * ***Note: If you don't know what this function is for, you shouldn't use
 * it!***
 *
 * @param a a pointer to an SDL_AtomicU32 variable to be modified.
 * @param oldval the old value.
 * @param newval the new value.
 * @returns true if the atomic variable was set, false otherwise.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetAtomicU32
 * @sa SDL_SetAtomicU32
 *
 * @from SDL_atomic.h:559 bool SDL_CompareAndSwapAtomicU32(SDL_AtomicU32 *a, Uint32 oldval, Uint32 newval);
 */
SDL_CompareAndSwapAtomicU32: {
      parameters: ["pointer", "u32", "u32"],
      result: "bool"
    },


/**
 * Set an atomic variable to a value.
 *
 * This function also acts as a full memory barrier.
 *
 * ***Note: If you don't know what this function is for, you shouldn't use
 * it!***
 *
 * @param a a pointer to an SDL_AtomicU32 variable to be modified.
 * @param v the desired value.
 * @returns the previous value of the atomic variable.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetAtomicU32
 *
 * @from SDL_atomic.h:579 Uint32 SDL_SetAtomicU32(SDL_AtomicU32 *a, Uint32 v);
 */
SDL_SetAtomicU32: {
      parameters: ["pointer", "u32"],
      result: "u32"
    },


/**
 * Get the value of an atomic variable.
 *
 * ***Note: If you don't know what this function is for, you shouldn't use
 * it!***
 *
 * @param a a pointer to an SDL_AtomicU32 variable.
 * @returns the current value of an atomic variable.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_SetAtomicU32
 *
 * @from SDL_atomic.h:596 Uint32 SDL_GetAtomicU32(SDL_AtomicU32 *a);
 */
SDL_GetAtomicU32: {
      parameters: ["pointer"],
      result: "u32"
    },


/**
 * Add to an atomic variable.
 *
 * This function also acts as a full memory barrier.
 *
 * ***Note: If you don't know what this function is for, you shouldn't use
 * it!***
 *
 * @param a a pointer to an SDL_AtomicU32 variable to be modified.
 * @param v the desired value to add or subtract.
 * @returns the previous value of the atomic variable.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.4.0.
 *
 * @from SDL_atomic.h:614 Uint32 SDL_AddAtomicU32(SDL_AtomicU32 *a, int v);
 */
SDL_AddAtomicU32: {
      parameters: ["pointer", "i32"],
      result: "u32"
    },


/**
 * Set a pointer to a new value if it is currently an old value.
 *
 * ***Note: If you don't know what this function is for, you shouldn't use
 * it!***
 *
 * @param a a pointer to a pointer.
 * @param oldval the old pointer value.
 * @param newval the new pointer value.
 * @returns true if the pointer was set, false otherwise.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_CompareAndSwapAtomicInt
 * @sa SDL_GetAtomicPointer
 * @sa SDL_SetAtomicPointer
 *
 * @from SDL_atomic.h:635 bool SDL_CompareAndSwapAtomicPointer(void **a, void *oldval, void *newval);
 */
SDL_CompareAndSwapAtomicPointer: {
      parameters: ["pointer", "pointer", "pointer"],
      result: "bool"
    },


/**
 * Set a pointer to a value atomically.
 *
 * ***Note: If you don't know what this function is for, you shouldn't use
 * it!***
 *
 * @param a a pointer to a pointer.
 * @param v the desired pointer value.
 * @returns the previous value of the pointer.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_CompareAndSwapAtomicPointer
 * @sa SDL_GetAtomicPointer
 *
 * @from SDL_atomic.h:654 void * SDL_SetAtomicPointer(void **a, void *v);
 */
SDL_SetAtomicPointer: {
      parameters: ["pointer", "pointer"],
      result: "pointer"
    },


/**
 * Get the value of a pointer atomically.
 *
 * ***Note: If you don't know what this function is for, you shouldn't use
 * it!***
 *
 * @param a a pointer to a pointer.
 * @returns the current value of a pointer.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_CompareAndSwapAtomicPointer
 * @sa SDL_SetAtomicPointer
 *
 * @from SDL_atomic.h:672 void * SDL_GetAtomicPointer(void **a);
 */
SDL_GetAtomicPointer: {
      parameters: ["pointer"],
      result: "pointer"
    },

} as const satisfies Deno.ForeignLibraryInterface;
