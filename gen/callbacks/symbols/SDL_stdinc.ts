/**
 * # CategoryStdinc
 *
 * SDL provides its own implementation of some of the most important C runtime
 * functions.
 *
 * Using these functions allows an app to have access to common C
 * functionality without depending on a specific C runtime (or a C runtime at
 * all). More importantly, the SDL implementations work identically across
 * platforms, so apps can avoid surprises like snprintf() behaving differently
 * between Windows and Linux builds, or itoa() only existing on some
 * platforms.
 *
 * For many of the most common functions, like SDL_memcpy, SDL might just call
 * through to the usual C runtime behind the scenes, if it makes sense to do
 * so (if it's faster and always available/reliable on a given platform),
 * reducing library size and offering the most optimized option.
 *
 * SDL also offers other C-runtime-adjacent functionality in this header that
 * either isn't, strictly speaking, part of any C runtime standards, like
 * SDL_crc32() and SDL_reinterpret_cast, etc. It also offers a few better
 * options, like SDL_strlcpy(), which functions as a safer form of strcpy().
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
 * A callback used to implement SDL_malloc().
 *
 * SDL will always ensure that the passed `size` is greater than 0.
 *
 * @param size the size to allocate.
 * @returns a pointer to the allocated memory, or NULL if allocation failed.
 *
 * @threadsafety It should be safe to call this callback from any thread.
 *
 * @since This datatype is available since SDL 3.2.0.
 *
 * @sa SDL_malloc
 * @sa SDL_GetOriginalMemoryFunctions
 * @sa SDL_GetMemoryFunctions
 * @sa SDL_SetMemoryFunctions
 *
 * @from SDL_stdinc.h:1423 typedef void *(*SDL_malloc_func)(size_t size);
 */
SDL_malloc_func: {
      parameters: ["usize"],
      result: "pointer"
    },

/**
 * A callback used to implement SDL_calloc().
 *
 * SDL will always ensure that the passed `nmemb` and `size` are both greater
 * than 0.
 *
 * @param nmemb the number of elements in the array.
 * @param size the size of each element of the array.
 * @returns a pointer to the allocated array, or NULL if allocation failed.
 *
 * @threadsafety It should be safe to call this callback from any thread.
 *
 * @since This datatype is available since SDL 3.2.0.
 *
 * @sa SDL_calloc
 * @sa SDL_GetOriginalMemoryFunctions
 * @sa SDL_GetMemoryFunctions
 * @sa SDL_SetMemoryFunctions
 *
 * @from SDL_stdinc.h:1444 typedef void *(*SDL_calloc_func)(size_t nmemb, size_t size);
 */
SDL_calloc_func: {
      parameters: ["usize", "usize"],
      result: "pointer"
    },

/**
 * A callback used to implement SDL_realloc().
 *
 * SDL will always ensure that the passed `size` is greater than 0.
 *
 * @param mem a pointer to allocated memory to reallocate, or NULL.
 * @param size the new size of the memory.
 * @returns a pointer to the newly allocated memory, or NULL if allocation
 *          failed.
 *
 * @threadsafety It should be safe to call this callback from any thread.
 *
 * @since This datatype is available since SDL 3.2.0.
 *
 * @sa SDL_realloc
 * @sa SDL_GetOriginalMemoryFunctions
 * @sa SDL_GetMemoryFunctions
 * @sa SDL_SetMemoryFunctions
 *
 * @from SDL_stdinc.h:1465 typedef void *(*SDL_realloc_func)(void *mem, size_t size);
 */
SDL_realloc_func: {
      parameters: ["pointer", "usize"],
      result: "pointer"
    },

/**
 * A callback used to implement SDL_free().
 *
 * SDL will always ensure that the passed `mem` is a non-NULL pointer.
 *
 * @param mem a pointer to allocated memory.
 *
 * @threadsafety It should be safe to call this callback from any thread.
 *
 * @since This datatype is available since SDL 3.2.0.
 *
 * @sa SDL_free
 * @sa SDL_GetOriginalMemoryFunctions
 * @sa SDL_GetMemoryFunctions
 * @sa SDL_SetMemoryFunctions
 *
 * @from SDL_stdinc.h:1483 typedef void (*SDL_free_func)(void *mem);
 */
SDL_free_func: {
      parameters: ["pointer"],
      result: "void"
    },

/**
 * A callback used with SDL sorting and binary search functions.
 *
 * @param a a pointer to the first element being compared.
 * @param b a pointer to the second element being compared.
 * @returns -1 if `a` should be sorted before `b`, 1 if `b` should be sorted
 *          before `a`, 0 if they are equal. If two elements are equal, their
 *          order in the sorted array is undefined.
 *
 * @since This callback is available since SDL 3.2.0.
 *
 * @sa SDL_bsearch
 * @sa SDL_qsort
 *
 * @from SDL_stdinc.h:1855 typedef int (*SDL_CompareCallback)(const void *a, const void *b);
 */
SDL_CompareCallback: {
      parameters: ["pointer", "pointer"],
      result: "i32"
    },

/**
 * A callback used with SDL sorting and binary search functions.
 *
 * @param userdata the `userdata` pointer passed to the sort function.
 * @param a a pointer to the first element being compared.
 * @param b a pointer to the second element being compared.
 * @returns -1 if `a` should be sorted before `b`, 1 if `b` should be sorted
 *          before `a`, 0 if they are equal. If two elements are equal, their
 *          order in the sorted array is undefined.
 *
 * @since This callback is available since SDL 3.2.0.
 *
 * @sa SDL_qsort_r
 * @sa SDL_bsearch_r
 *
 * @from SDL_stdinc.h:1968 typedef int (*SDL_CompareCallback_r)(void *userdata, const void *a, const void *b);
 */
SDL_CompareCallback_r: {
      parameters: ["pointer", "pointer", "pointer"],
      result: "i32"
    },

/**
 * A generic function pointer.
 *
 * In theory, generic function pointers should use this, instead of `void *`,
 * since some platforms could treat code addresses differently than data
 * addresses. Although in current times no popular platforms make this
 * distinction, it is more correct and portable to use the correct type for a
 * generic pointer.
 *
 * If for some reason you need to force this typedef to be an actual `void *`,
 * perhaps to work around a compiler or existing code, you can define
 * `SDL_FUNCTION_POINTER_IS_VOID_POINTER` before including any SDL headers.
 *
 * @since This datatype is available since SDL 3.2.0.
 *
 * @from SDL_stdinc.h:6123 typedef void (*SDL_FunctionPointer)(void);
 */
SDL_FunctionPointer: {
      parameters: [],
      result: "void"
    },

} as const satisfies Deno.ForeignLibraryInterface;


/**
 * A callback used to implement SDL_malloc().
 *
 * SDL will always ensure that the passed `size` is greater than 0.
 *
 * @param size the size to allocate.
 * @returns a pointer to the allocated memory, or NULL if allocation failed.
 *
 * @threadsafety It should be safe to call this callback from any thread.
 *
 * @since This datatype is available since SDL 3.2.0.
 *
 * @sa SDL_malloc
 * @sa SDL_GetOriginalMemoryFunctions
 * @sa SDL_GetMemoryFunctions
 * @sa SDL_SetMemoryFunctions
 *
 * @from SDL_stdinc.h:1423 typedef void *(*SDL_malloc_func)(size_t size);
 */
export function malloc_func(cb: (
    size: bigint, 
  ) => Deno.PointerValue) {
  return new Deno.UnsafeCallback(symbols.SDL_malloc_func, cb);
}

/**
 * A callback used to implement SDL_calloc().
 *
 * SDL will always ensure that the passed `nmemb` and `size` are both greater
 * than 0.
 *
 * @param nmemb the number of elements in the array.
 * @param size the size of each element of the array.
 * @returns a pointer to the allocated array, or NULL if allocation failed.
 *
 * @threadsafety It should be safe to call this callback from any thread.
 *
 * @since This datatype is available since SDL 3.2.0.
 *
 * @sa SDL_calloc
 * @sa SDL_GetOriginalMemoryFunctions
 * @sa SDL_GetMemoryFunctions
 * @sa SDL_SetMemoryFunctions
 *
 * @from SDL_stdinc.h:1444 typedef void *(*SDL_calloc_func)(size_t nmemb, size_t size);
 */
export function calloc_func(cb: (
    nmemb: bigint, 
    size: bigint, 
  ) => Deno.PointerValue) {
  return new Deno.UnsafeCallback(symbols.SDL_calloc_func, cb);
}

/**
 * A callback used to implement SDL_realloc().
 *
 * SDL will always ensure that the passed `size` is greater than 0.
 *
 * @param mem a pointer to allocated memory to reallocate, or NULL.
 * @param size the new size of the memory.
 * @returns a pointer to the newly allocated memory, or NULL if allocation
 *          failed.
 *
 * @threadsafety It should be safe to call this callback from any thread.
 *
 * @since This datatype is available since SDL 3.2.0.
 *
 * @sa SDL_realloc
 * @sa SDL_GetOriginalMemoryFunctions
 * @sa SDL_GetMemoryFunctions
 * @sa SDL_SetMemoryFunctions
 *
 * @from SDL_stdinc.h:1465 typedef void *(*SDL_realloc_func)(void *mem, size_t size);
 */
export function realloc_func(cb: (
    mem: Deno.PointerValue, 
    size: bigint, 
  ) => Deno.PointerValue) {
  return new Deno.UnsafeCallback(symbols.SDL_realloc_func, cb);
}

/**
 * A callback used to implement SDL_free().
 *
 * SDL will always ensure that the passed `mem` is a non-NULL pointer.
 *
 * @param mem a pointer to allocated memory.
 *
 * @threadsafety It should be safe to call this callback from any thread.
 *
 * @since This datatype is available since SDL 3.2.0.
 *
 * @sa SDL_free
 * @sa SDL_GetOriginalMemoryFunctions
 * @sa SDL_GetMemoryFunctions
 * @sa SDL_SetMemoryFunctions
 *
 * @from SDL_stdinc.h:1483 typedef void (*SDL_free_func)(void *mem);
 */
export function free_func(cb: (
    mem: Deno.PointerValue, 
  ) => void) {
  return new Deno.UnsafeCallback(symbols.SDL_free_func, cb);
}

/**
 * A callback used with SDL sorting and binary search functions.
 *
 * @param a a pointer to the first element being compared.
 * @param b a pointer to the second element being compared.
 * @returns -1 if `a` should be sorted before `b`, 1 if `b` should be sorted
 *          before `a`, 0 if they are equal. If two elements are equal, their
 *          order in the sorted array is undefined.
 *
 * @since This callback is available since SDL 3.2.0.
 *
 * @sa SDL_bsearch
 * @sa SDL_qsort
 *
 * @from SDL_stdinc.h:1855 typedef int (*SDL_CompareCallback)(const void *a, const void *b);
 */
export function CompareCallback(cb: (
    a: Deno.PointerValue, 
    b: Deno.PointerValue, 
  ) => number) {
  return new Deno.UnsafeCallback(symbols.SDL_CompareCallback, cb);
}

/**
 * A callback used with SDL sorting and binary search functions.
 *
 * @param userdata the `userdata` pointer passed to the sort function.
 * @param a a pointer to the first element being compared.
 * @param b a pointer to the second element being compared.
 * @returns -1 if `a` should be sorted before `b`, 1 if `b` should be sorted
 *          before `a`, 0 if they are equal. If two elements are equal, their
 *          order in the sorted array is undefined.
 *
 * @since This callback is available since SDL 3.2.0.
 *
 * @sa SDL_qsort_r
 * @sa SDL_bsearch_r
 *
 * @from SDL_stdinc.h:1968 typedef int (*SDL_CompareCallback_r)(void *userdata, const void *a, const void *b);
 */
export function CompareCallback_r(cb: (
    userdata: Deno.PointerValue, 
    a: Deno.PointerValue, 
    b: Deno.PointerValue, 
  ) => number) {
  return new Deno.UnsafeCallback(symbols.SDL_CompareCallback_r, cb);
}

/**
 * A generic function pointer.
 *
 * In theory, generic function pointers should use this, instead of `void *`,
 * since some platforms could treat code addresses differently than data
 * addresses. Although in current times no popular platforms make this
 * distinction, it is more correct and portable to use the correct type for a
 * generic pointer.
 *
 * If for some reason you need to force this typedef to be an actual `void *`,
 * perhaps to work around a compiler or existing code, you can define
 * `SDL_FUNCTION_POINTER_IS_VOID_POINTER` before including any SDL headers.
 *
 * @since This datatype is available since SDL 3.2.0.
 *
 * @from SDL_stdinc.h:6123 typedef void (*SDL_FunctionPointer)(void);
 */
export function FunctionPointer(cb: (
  ) => void) {
  return new Deno.UnsafeCallback(symbols.SDL_FunctionPointer, cb);
}

