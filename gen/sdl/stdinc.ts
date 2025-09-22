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

import { lib } from "./lib.ts";
import * as _p from "@g9wp/ptr";


export {
  SDL_DUMMY_ENUM as DUMMY_ENUM,
} from "../enums/SDL_stdinc.ts"

/**
 * Allocate uninitialized memory.
 *
 * The allocated memory returned by this function must be freed with
 * SDL_free().
 *
 * If `size` is 0, it will be set to 1.
 *
 * If the allocation is successful, the returned pointer is guaranteed to be
 * aligned to either the *fundamental alignment* (`alignof(max_align_t)` in
 * C11 and later) or `2 * sizeof(void *)`, whichever is smaller. Use
 * SDL_aligned_alloc() if you need to allocate memory aligned to an alignment
 * greater than this guarantee.
 *
 * @param size the size to allocate.
 * @returns a pointer to the allocated memory, or NULL if allocation failed.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_free
 * @sa SDL_calloc
 * @sa SDL_realloc
 * @sa SDL_aligned_alloc
 *
 * @from SDL_stdinc.h:1319 SDL_MALLOC void * SDL_malloc(size_t size);
 */
export function malloc(size: bigint): Deno.PointerValue {
  return lib.symbols.SDL_malloc(size);
}

/**
 * Allocate a zero-initialized array.
 *
 * The memory returned by this function must be freed with SDL_free().
 *
 * If either of `nmemb` or `size` is 0, they will both be set to 1.
 *
 * If the allocation is successful, the returned pointer is guaranteed to be
 * aligned to either the *fundamental alignment* (`alignof(max_align_t)` in
 * C11 and later) or `2 * sizeof(void *)`, whichever is smaller.
 *
 * @param nmemb the number of elements in the array.
 * @param size the size of each element of the array.
 * @returns a pointer to the allocated array, or NULL if allocation failed.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_free
 * @sa SDL_malloc
 * @sa SDL_realloc
 *
 * @from SDL_stdinc.h:1344 SDL_MALLOC SDL_ALLOC_SIZE2(1, 2) void * SDL_calloc(size_t nmemb, size_t size);
 */
export function calloc(nmemb: bigint, size: bigint): Deno.PointerValue {
  return lib.symbols.SDL_calloc(nmemb, size);
}

/**
 * Change the size of allocated memory.
 *
 * The memory returned by this function must be freed with SDL_free().
 *
 * If `size` is 0, it will be set to 1. Note that this is unlike some other C
 * runtime `realloc` implementations, which may treat `realloc(mem, 0)` the
 * same way as `free(mem)`.
 *
 * If `mem` is NULL, the behavior of this function is equivalent to
 * SDL_malloc(). Otherwise, the function can have one of three possible
 * outcomes:
 *
 * - If it returns the same pointer as `mem`, it means that `mem` was resized
 *   in place without freeing.
 * - If it returns a different non-NULL pointer, it means that `mem` was freed
 *   and cannot be dereferenced anymore.
 * - If it returns NULL (indicating failure), then `mem` will remain valid and
 *   must still be freed with SDL_free().
 *
 * If the allocation is successfully resized, the returned pointer is
 * guaranteed to be aligned to either the *fundamental alignment*
 * (`alignof(max_align_t)` in C11 and later) or `2 * sizeof(void *)`,
 * whichever is smaller.
 *
 * @param mem a pointer to allocated memory to reallocate, or NULL.
 * @param size the new size of the memory.
 * @returns a pointer to the newly allocated memory, or NULL if allocation
 *          failed.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_free
 * @sa SDL_malloc
 * @sa SDL_calloc
 *
 * @from SDL_stdinc.h:1384 SDL_ALLOC_SIZE(2) void * SDL_realloc(void *mem, size_t size);
 */
export function realloc(mem: Deno.PointerValue, size: bigint): Deno.PointerValue {
  return lib.symbols.SDL_realloc(mem, size);
}

/**
 * Free allocated memory.
 *
 * The pointer is no longer valid after this call and cannot be dereferenced
 * anymore.
 *
 * If `mem` is NULL, this function does nothing.
 *
 * @param mem a pointer to allocated memory, or NULL.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_malloc
 * @sa SDL_calloc
 * @sa SDL_realloc
 *
 * @from SDL_stdinc.h:1404 void SDL_free(void *mem);
 */
export function free(mem: Deno.PointerValue): void {
  return lib.symbols.SDL_free(mem);
}

/**
 * Get the original set of SDL memory functions.
 *
 * This is what SDL_malloc and friends will use by default, if there has been
 * no call to SDL_SetMemoryFunctions. This is not necessarily using the C
 * runtime's `malloc` functions behind the scenes! Different platforms and
 * build configurations might do any number of unexpected things.
 *
 * @param malloc_func filled with malloc function.
 * @param calloc_func filled with calloc function.
 * @param realloc_func filled with realloc function.
 * @param free_func filled with free function.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_stdinc.h:1502 void SDL_GetOriginalMemoryFunctions(SDL_malloc_func *malloc_func, SDL_calloc_func *calloc_func, SDL_realloc_func *realloc_func, SDL_free_func *free_func);
 */
export function getOriginalMemoryFunctions(
    malloc_func: Deno.PointerValue<"SDL_malloc_func">,
    calloc_func: Deno.PointerValue<"SDL_calloc_func">,
    realloc_func: Deno.PointerValue<"SDL_realloc_func">,
    free_func: Deno.PointerValue<"SDL_free_func">,
): void {
  return lib.symbols.SDL_GetOriginalMemoryFunctions(malloc_func, calloc_func, realloc_func, free_func);
}

/**
 * Get the current set of SDL memory functions.
 *
 * @param malloc_func filled with malloc function.
 * @param calloc_func filled with calloc function.
 * @param realloc_func filled with realloc function.
 * @param free_func filled with free function.
 *
 * @threadsafety This does not hold a lock, so do not call this in the
 *               unlikely event of a background thread calling
 *               SDL_SetMemoryFunctions simultaneously.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_SetMemoryFunctions
 * @sa SDL_GetOriginalMemoryFunctions
 *
 * @from SDL_stdinc.h:1524 void SDL_GetMemoryFunctions(SDL_malloc_func *malloc_func, SDL_calloc_func *calloc_func, SDL_realloc_func *realloc_func, SDL_free_func *free_func);
 */
export function getMemoryFunctions(
    malloc_func: Deno.PointerValue<"SDL_malloc_func">,
    calloc_func: Deno.PointerValue<"SDL_calloc_func">,
    realloc_func: Deno.PointerValue<"SDL_realloc_func">,
    free_func: Deno.PointerValue<"SDL_free_func">,
): void {
  return lib.symbols.SDL_GetMemoryFunctions(malloc_func, calloc_func, realloc_func, free_func);
}

/**
 * Replace SDL's memory allocation functions with a custom set.
 *
 * It is not safe to call this function once any allocations have been made,
 * as future calls to SDL_free will use the new allocator, even if they came
 * from an SDL_malloc made with the old one!
 *
 * If used, usually this needs to be the first call made into the SDL library,
 * if not the very first thing done at program startup time.
 *
 * @param malloc_func custom malloc function.
 * @param calloc_func custom calloc function.
 * @param realloc_func custom realloc function.
 * @param free_func custom free function.
 * @returns true on success or false on failure; call SDL_GetError() for more
 *          information.
 *
 * @threadsafety It is safe to call this function from any thread, but one
 *               should not replace the memory functions once any allocations
 *               are made!
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetMemoryFunctions
 * @sa SDL_GetOriginalMemoryFunctions
 *
 * @from SDL_stdinc.h:1555 bool SDL_SetMemoryFunctions(SDL_malloc_func malloc_func, SDL_calloc_func calloc_func, SDL_realloc_func realloc_func, SDL_free_func free_func);
 */
export function setMemoryFunctions(
    malloc_func: Deno.PointerValue,
    calloc_func: Deno.PointerValue,
    realloc_func: Deno.PointerValue,
    free_func: Deno.PointerValue,
): boolean {
  return lib.symbols.SDL_SetMemoryFunctions(malloc_func, calloc_func, realloc_func, free_func);
}

/**
 * Allocate memory aligned to a specific alignment.
 *
 * The memory returned by this function must be freed with SDL_aligned_free(),
 * _not_ SDL_free().
 *
 * If `alignment` is less than the size of `void *`, it will be increased to
 * match that.
 *
 * The returned memory address will be a multiple of the alignment value, and
 * the size of the memory allocated will be a multiple of the alignment value.
 *
 * @param alignment the alignment of the memory.
 * @param size the size to allocate.
 * @returns a pointer to the aligned memory, or NULL if allocation failed.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_aligned_free
 *
 * @from SDL_stdinc.h:1582 SDL_MALLOC void * SDL_aligned_alloc(size_t alignment, size_t size);
 */
export function alignedAlloc(alignment: bigint, size: bigint): Deno.PointerValue {
  return lib.symbols.SDL_aligned_alloc(alignment, size);
}

/**
 * Free memory allocated by SDL_aligned_alloc().
 *
 * The pointer is no longer valid after this call and cannot be dereferenced
 * anymore.
 *
 * If `mem` is NULL, this function does nothing.
 *
 * @param mem a pointer previously returned by SDL_aligned_alloc(), or NULL.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_aligned_alloc
 *
 * @from SDL_stdinc.h:1600 void SDL_aligned_free(void *mem);
 */
export function alignedFree(mem: Deno.PointerValue): void {
  return lib.symbols.SDL_aligned_free(mem);
}

/**
 * Get the number of outstanding (unfreed) allocations.
 *
 * @returns the number of allocations or -1 if allocation counting is
 *          disabled.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_stdinc.h:1612 int SDL_GetNumAllocations(void);
 */
export function getNumAllocations(): number {
  return lib.symbols.SDL_GetNumAllocations();
}

/**
 * Get the process environment.
 *
 * This is initialized at application start and is not affected by setenv()
 * and unsetenv() calls after that point. Use SDL_SetEnvironmentVariable() and
 * SDL_UnsetEnvironmentVariable() if you want to modify this environment, or
 * SDL_setenv_unsafe() or SDL_unsetenv_unsafe() if you want changes to persist
 * in the C runtime environment after SDL_Quit().
 *
 * @returns a pointer to the environment for the process or NULL on failure;
 *          call SDL_GetError() for more information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetEnvironmentVariable
 * @sa SDL_GetEnvironmentVariables
 * @sa SDL_SetEnvironmentVariable
 * @sa SDL_UnsetEnvironmentVariable
 *
 * @from SDL_stdinc.h:1650 SDL_Environment * SDL_GetEnvironment(void);
 */
export function getEnvironment(): Deno.PointerValue<"SDL_Environment"> {
  return lib.symbols.SDL_GetEnvironment() as Deno.PointerValue<"SDL_Environment">;
}

/**
 * Create a set of environment variables
 *
 * @param populated true to initialize it from the C runtime environment,
 *                  false to create an empty environment.
 * @returns a pointer to the new environment or NULL on failure; call
 *          SDL_GetError() for more information.
 *
 * @threadsafety If `populated` is false, it is safe to call this function
 *               from any thread, otherwise it is safe if no other threads are
 *               calling setenv() or unsetenv()
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetEnvironmentVariable
 * @sa SDL_GetEnvironmentVariables
 * @sa SDL_SetEnvironmentVariable
 * @sa SDL_UnsetEnvironmentVariable
 * @sa SDL_DestroyEnvironment
 *
 * @from SDL_stdinc.h:1672 SDL_Environment * SDL_CreateEnvironment(bool populated);
 */
export function createEnvironment(populated: boolean): Deno.PointerValue<"SDL_Environment"> {
  return lib.symbols.SDL_CreateEnvironment(populated) as Deno.PointerValue<"SDL_Environment">;
}

/**
 * Get the value of a variable in the environment.
 *
 * @param env the environment to query.
 * @param name the name of the variable to get.
 * @returns a pointer to the value of the variable or NULL if it can't be
 *          found.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetEnvironment
 * @sa SDL_CreateEnvironment
 * @sa SDL_GetEnvironmentVariables
 * @sa SDL_SetEnvironmentVariable
 * @sa SDL_UnsetEnvironmentVariable
 *
 * @from SDL_stdinc.h:1692 const char * SDL_GetEnvironmentVariable(SDL_Environment *env, const char *name);
 */
export function getEnvironmentVariable(env: Deno.PointerValue<"SDL_Environment">, name: string): string {
  return _p.getCstr2(lib.symbols.SDL_GetEnvironmentVariable(env, _p.toCstr(name)));
}

/**
 * Get all variables in the environment.
 *
 * @param env the environment to query.
 * @returns a NULL terminated array of pointers to environment variables in
 *          the form "variable=value" or NULL on failure; call SDL_GetError()
 *          for more information. This is a single allocation that should be
 *          freed with SDL_free() when it is no longer needed.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetEnvironment
 * @sa SDL_CreateEnvironment
 * @sa SDL_GetEnvironmentVariables
 * @sa SDL_SetEnvironmentVariable
 * @sa SDL_UnsetEnvironmentVariable
 *
 * @from SDL_stdinc.h:1713 char ** SDL_GetEnvironmentVariables(SDL_Environment *env);
 */
export function getEnvironmentVariables(env: Deno.PointerValue<"SDL_Environment">): Deno.PointerValue {
  return lib.symbols.SDL_GetEnvironmentVariables(env);
}

/**
 * Set the value of a variable in the environment.
 *
 * @param env the environment to modify.
 * @param name the name of the variable to set.
 * @param value the value of the variable to set.
 * @param overwrite true to overwrite the variable if it exists, false to
 *                  return success without setting the variable if it already
 *                  exists.
 * @returns true on success or false on failure; call SDL_GetError() for more
 *          information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetEnvironment
 * @sa SDL_CreateEnvironment
 * @sa SDL_GetEnvironmentVariable
 * @sa SDL_GetEnvironmentVariables
 * @sa SDL_UnsetEnvironmentVariable
 *
 * @from SDL_stdinc.h:1737 bool SDL_SetEnvironmentVariable(SDL_Environment *env, const char *name, const char *value, bool overwrite);
 */
export function setEnvironmentVariable(
    env: Deno.PointerValue<"SDL_Environment">,
    name: string,
    value: string,
    overwrite: boolean,
): boolean {
  return lib.symbols.SDL_SetEnvironmentVariable(env, _p.toCstr(name), _p.toCstr(value), overwrite);
}

/**
 * Clear a variable from the environment.
 *
 * @param env the environment to modify.
 * @param name the name of the variable to unset.
 * @returns true on success or false on failure; call SDL_GetError() for more
 *          information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetEnvironment
 * @sa SDL_CreateEnvironment
 * @sa SDL_GetEnvironmentVariable
 * @sa SDL_GetEnvironmentVariables
 * @sa SDL_SetEnvironmentVariable
 * @sa SDL_UnsetEnvironmentVariable
 *
 * @from SDL_stdinc.h:1758 bool SDL_UnsetEnvironmentVariable(SDL_Environment *env, const char *name);
 */
export function unsetEnvironmentVariable(env: Deno.PointerValue<"SDL_Environment">, name: string): boolean {
  return lib.symbols.SDL_UnsetEnvironmentVariable(env, _p.toCstr(name));
}

/**
 * Destroy a set of environment variables.
 *
 * @param env the environment to destroy.
 *
 * @threadsafety It is safe to call this function from any thread, as long as
 *               the environment is no longer in use.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_CreateEnvironment
 *
 * @from SDL_stdinc.h:1772 void SDL_DestroyEnvironment(SDL_Environment *env);
 */
export function destroyEnvironment(env: Deno.PointerValue<"SDL_Environment">): void {
  return lib.symbols.SDL_DestroyEnvironment(env);
}

/**
 * Get the value of a variable in the environment.
 *
 * This function uses SDL's cached copy of the environment and is thread-safe.
 *
 * @param name the name of the variable to get.
 * @returns a pointer to the value of the variable or NULL if it can't be
 *          found.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_stdinc.h:1787 const char * SDL_getenv(const char *name);
 */
export function getenv(name: string): string {
  return _p.getCstr2(lib.symbols.SDL_getenv(_p.toCstr(name)));
}

/**
 * Get the value of a variable in the environment.
 *
 * This function bypasses SDL's cached copy of the environment and is not
 * thread-safe.
 *
 * @param name the name of the variable to get.
 * @returns a pointer to the value of the variable or NULL if it can't be
 *          found.
 *
 * @threadsafety This function is not thread safe, consider using SDL_getenv()
 *               instead.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_getenv
 *
 * @from SDL_stdinc.h:1806 const char * SDL_getenv_unsafe(const char *name);
 */
export function getenvUnsafe(name: string): string {
  return _p.getCstr2(lib.symbols.SDL_getenv_unsafe(_p.toCstr(name)));
}

/**
 * Set the value of a variable in the environment.
 *
 * @param name the name of the variable to set.
 * @param value the value of the variable to set.
 * @param overwrite 1 to overwrite the variable if it exists, 0 to return
 *                  success without setting the variable if it already exists.
 * @returns 0 on success, -1 on error.
 *
 * @threadsafety This function is not thread safe, consider using
 *               SDL_SetEnvironmentVariable() instead.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_SetEnvironmentVariable
 *
 * @from SDL_stdinc.h:1824 int SDL_setenv_unsafe(const char *name, const char *value, int overwrite);
 */
export function setenvUnsafe(name: string, value: string, overwrite: number): number {
  return lib.symbols.SDL_setenv_unsafe(_p.toCstr(name), _p.toCstr(value), overwrite);
}

/**
 * Clear a variable from the environment.
 *
 * @param name the name of the variable to unset.
 * @returns 0 on success, -1 on error.
 *
 * @threadsafety This function is not thread safe, consider using
 *               SDL_UnsetEnvironmentVariable() instead.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_UnsetEnvironmentVariable
 *
 * @from SDL_stdinc.h:1839 int SDL_unsetenv_unsafe(const char *name);
 */
export function unsetenvUnsafe(name: string): number {
  return lib.symbols.SDL_unsetenv_unsafe(_p.toCstr(name));
}

/**
 * Sort an array.
 *
 * For example:
 *
 * ```c
 * typedef struct {
 *     int key;
 *     const char *string;
 * } data;
 *
 * int SDLCALL compare(const void *a, const void *b)
 * {
 *     const data *A = (const data *)a;
 *     const data *B = (const data *)b;
 *
 *     if (A->n < B->n) {
 *         return -1;
 *     } else if (B->n < A->n) {
 *         return 1;
 *     } else {
 *         return 0;
 *     }
 * }
 *
 * data values[] = {
 *     { 3, "third" }, { 1, "first" }, { 2, "second" }
 * };
 *
 * SDL_qsort(values, SDL_arraysize(values), sizeof(values[0]), compare);
 * ```
 *
 * @param base a pointer to the start of the array.
 * @param nmemb the number of elements in the array.
 * @param size the size of the elements in the array.
 * @param compare a function used to compare elements in the array.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_bsearch
 * @sa SDL_qsort_r
 *
 * @from SDL_stdinc.h:1901 void SDL_qsort(void *base, size_t nmemb, size_t size, SDL_CompareCallback compare);
 */
export function qsort(
    base: Deno.PointerValue,
    nmemb: bigint,
    size: bigint,
    compare: Deno.PointerValue,
): void {
  return lib.symbols.SDL_qsort(base, nmemb, size, compare);
}

/**
 * Perform a binary search on a previously sorted array.
 *
 * For example:
 *
 * ```c
 * typedef struct {
 *     int key;
 *     const char *string;
 * } data;
 *
 * int SDLCALL compare(const void *a, const void *b)
 * {
 *     const data *A = (const data *)a;
 *     const data *B = (const data *)b;
 *
 *     if (A->n < B->n) {
 *         return -1;
 *     } else if (B->n < A->n) {
 *         return 1;
 *     } else {
 *         return 0;
 *     }
 * }
 *
 * data values[] = {
 *     { 1, "first" }, { 2, "second" }, { 3, "third" }
 * };
 * data key = { 2, NULL };
 *
 * data *result = SDL_bsearch(&key, values, SDL_arraysize(values), sizeof(values[0]), compare);
 * ```
 *
 * @param key a pointer to a key equal to the element being searched for.
 * @param base a pointer to the start of the array.
 * @param nmemb the number of elements in the array.
 * @param size the size of the elements in the array.
 * @param compare a function used to compare elements in the array.
 * @returns a pointer to the matching element in the array, or NULL if not
 *          found.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_bsearch_r
 * @sa SDL_qsort
 *
 * @from SDL_stdinc.h:1951 void * SDL_bsearch(const void *key, const void *base, size_t nmemb, size_t size, SDL_CompareCallback compare);
 */
export function bsearch(
    key: Deno.PointerValue,
    base: Deno.PointerValue,
    nmemb: bigint,
    size: bigint,
    compare: Deno.PointerValue,
): Deno.PointerValue {
  return lib.symbols.SDL_bsearch(key, base, nmemb, size, compare);
}

/**
 * Sort an array, passing a userdata pointer to the compare function.
 *
 * For example:
 *
 * ```c
 * typedef enum {
 *     sort_increasing,
 *     sort_decreasing,
 * } sort_method;
 *
 * typedef struct {
 *     int key;
 *     const char *string;
 * } data;
 *
 * int SDLCALL compare(const void *userdata, const void *a, const void *b)
 * {
 *     sort_method method = (sort_method)(uintptr_t)userdata;
 *     const data *A = (const data *)a;
 *     const data *B = (const data *)b;
 *
 *     if (A->key < B->key) {
 *         return (method == sort_increasing) ? -1 : 1;
 *     } else if (B->key < A->key) {
 *         return (method == sort_increasing) ? 1 : -1;
 *     } else {
 *         return 0;
 *     }
 * }
 *
 * data values[] = {
 *     { 3, "third" }, { 1, "first" }, { 2, "second" }
 * };
 *
 * SDL_qsort_r(values, SDL_arraysize(values), sizeof(values[0]), compare, (const void *)(uintptr_t)sort_increasing);
 * ```
 *
 * @param base a pointer to the start of the array.
 * @param nmemb the number of elements in the array.
 * @param size the size of the elements in the array.
 * @param compare a function used to compare elements in the array.
 * @param userdata a pointer to pass to the compare function.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_bsearch_r
 * @sa SDL_qsort
 *
 * @from SDL_stdinc.h:2021 void SDL_qsort_r(void *base, size_t nmemb, size_t size, SDL_CompareCallback_r compare, void *userdata);
 */
export function qsortR(
    base: Deno.PointerValue,
    nmemb: bigint,
    size: bigint,
    compare: Deno.PointerValue,
    userdata: Deno.PointerValue,
): void {
  return lib.symbols.SDL_qsort_r(base, nmemb, size, compare, userdata);
}

/**
 * Perform a binary search on a previously sorted array, passing a userdata
 * pointer to the compare function.
 *
 * For example:
 *
 * ```c
 * typedef enum {
 *     sort_increasing,
 *     sort_decreasing,
 * } sort_method;
 *
 * typedef struct {
 *     int key;
 *     const char *string;
 * } data;
 *
 * int SDLCALL compare(const void *userdata, const void *a, const void *b)
 * {
 *     sort_method method = (sort_method)(uintptr_t)userdata;
 *     const data *A = (const data *)a;
 *     const data *B = (const data *)b;
 *
 *     if (A->key < B->key) {
 *         return (method == sort_increasing) ? -1 : 1;
 *     } else if (B->key < A->key) {
 *         return (method == sort_increasing) ? 1 : -1;
 *     } else {
 *         return 0;
 *     }
 * }
 *
 * data values[] = {
 *     { 1, "first" }, { 2, "second" }, { 3, "third" }
 * };
 * data key = { 2, NULL };
 *
 * data *result = SDL_bsearch_r(&key, values, SDL_arraysize(values), sizeof(values[0]), compare, (const void *)(uintptr_t)sort_increasing);
 * ```
 *
 * @param key a pointer to a key equal to the element being searched for.
 * @param base a pointer to the start of the array.
 * @param nmemb the number of elements in the array.
 * @param size the size of the elements in the array.
 * @param compare a function used to compare elements in the array.
 * @param userdata a pointer to pass to the compare function.
 * @returns a pointer to the matching element in the array, or NULL if not
 *          found.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_bsearch
 * @sa SDL_qsort_r
 *
 * @from SDL_stdinc.h:2079 void * SDL_bsearch_r(const void *key, const void *base, size_t nmemb, size_t size, SDL_CompareCallback_r compare, void *userdata);
 */
export function bsearchR(
    key: Deno.PointerValue,
    base: Deno.PointerValue,
    nmemb: bigint,
    size: bigint,
    compare: Deno.PointerValue,
    userdata: Deno.PointerValue,
): Deno.PointerValue {
  return lib.symbols.SDL_bsearch_r(key, base, nmemb, size, compare, userdata);
}

/**
 * Compute the absolute value of `x`.
 *
 * @param x an integer value.
 * @returns the absolute value of x.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_stdinc.h:2091 int SDL_abs(int x);
 */
export function abs(x: number): number {
  return lib.symbols.SDL_abs(x);
}

/**
 * Query if a character is alphabetic (a letter).
 *
 * **WARNING**: Regardless of system locale, this will only treat ASCII values
 * for English 'a-z' and 'A-Z' as true.
 *
 * @param x character value to check.
 * @returns non-zero if x falls within the character class, zero otherwise.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_stdinc.h:2166 int SDL_isalpha(int x);
 */
export function isalpha(x: number): number {
  return lib.symbols.SDL_isalpha(x);
}

/**
 * Query if a character is alphabetic (a letter) or a number.
 *
 * **WARNING**: Regardless of system locale, this will only treat ASCII values
 * for English 'a-z', 'A-Z', and '0-9' as true.
 *
 * @param x character value to check.
 * @returns non-zero if x falls within the character class, zero otherwise.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_stdinc.h:2181 int SDL_isalnum(int x);
 */
export function isalnum(x: number): number {
  return lib.symbols.SDL_isalnum(x);
}

/**
 * Report if a character is blank (a space or tab).
 *
 * **WARNING**: Regardless of system locale, this will only treat ASCII values
 * 0x20 (space) or 0x9 (tab) as true.
 *
 * @param x character value to check.
 * @returns non-zero if x falls within the character class, zero otherwise.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_stdinc.h:2196 int SDL_isblank(int x);
 */
export function isblank(x: number): number {
  return lib.symbols.SDL_isblank(x);
}

/**
 * Report if a character is a control character.
 *
 * **WARNING**: Regardless of system locale, this will only treat ASCII values
 * 0 through 0x1F, and 0x7F, as true.
 *
 * @param x character value to check.
 * @returns non-zero if x falls within the character class, zero otherwise.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_stdinc.h:2211 int SDL_iscntrl(int x);
 */
export function iscntrl(x: number): number {
  return lib.symbols.SDL_iscntrl(x);
}

/**
 * Report if a character is a numeric digit.
 *
 * **WARNING**: Regardless of system locale, this will only treat ASCII values
 * '0' (0x30) through '9' (0x39), as true.
 *
 * @param x character value to check.
 * @returns non-zero if x falls within the character class, zero otherwise.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_stdinc.h:2226 int SDL_isdigit(int x);
 */
export function isdigit(x: number): number {
  return lib.symbols.SDL_isdigit(x);
}

/**
 * Report if a character is a hexadecimal digit.
 *
 * **WARNING**: Regardless of system locale, this will only treat ASCII values
 * 'A' through 'F', 'a' through 'f', and '0' through '9', as true.
 *
 * @param x character value to check.
 * @returns non-zero if x falls within the character class, zero otherwise.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_stdinc.h:2241 int SDL_isxdigit(int x);
 */
export function isxdigit(x: number): number {
  return lib.symbols.SDL_isxdigit(x);
}

/**
 * Report if a character is a punctuation mark.
 *
 * **WARNING**: Regardless of system locale, this is equivalent to
 * `((SDL_isgraph(x)) && (!SDL_isalnum(x)))`.
 *
 * @param x character value to check.
 * @returns non-zero if x falls within the character class, zero otherwise.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_isgraph
 * @sa SDL_isalnum
 *
 * @from SDL_stdinc.h:2259 int SDL_ispunct(int x);
 */
export function ispunct(x: number): number {
  return lib.symbols.SDL_ispunct(x);
}

/**
 * Report if a character is whitespace.
 *
 * **WARNING**: Regardless of system locale, this will only treat the
 * following ASCII values as true:
 *
 * - space (0x20)
 * - tab (0x09)
 * - newline (0x0A)
 * - vertical tab (0x0B)
 * - form feed (0x0C)
 * - return (0x0D)
 *
 * @param x character value to check.
 * @returns non-zero if x falls within the character class, zero otherwise.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_stdinc.h:2281 int SDL_isspace(int x);
 */
export function isspace(x: number): number {
  return lib.symbols.SDL_isspace(x);
}

/**
 * Report if a character is upper case.
 *
 * **WARNING**: Regardless of system locale, this will only treat ASCII values
 * 'A' through 'Z' as true.
 *
 * @param x character value to check.
 * @returns non-zero if x falls within the character class, zero otherwise.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_stdinc.h:2296 int SDL_isupper(int x);
 */
export function isupper(x: number): number {
  return lib.symbols.SDL_isupper(x);
}

/**
 * Report if a character is lower case.
 *
 * **WARNING**: Regardless of system locale, this will only treat ASCII values
 * 'a' through 'z' as true.
 *
 * @param x character value to check.
 * @returns non-zero if x falls within the character class, zero otherwise.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_stdinc.h:2311 int SDL_islower(int x);
 */
export function islower(x: number): number {
  return lib.symbols.SDL_islower(x);
}

/**
 * Report if a character is "printable".
 *
 * Be advised that "printable" has a definition that goes back to text
 * terminals from the dawn of computing, making this a sort of special case
 * function that is not suitable for Unicode (or most any) text management.
 *
 * **WARNING**: Regardless of system locale, this will only treat ASCII values
 * ' ' (0x20) through '~' (0x7E) as true.
 *
 * @param x character value to check.
 * @returns non-zero if x falls within the character class, zero otherwise.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_stdinc.h:2330 int SDL_isprint(int x);
 */
export function isprint(x: number): number {
  return lib.symbols.SDL_isprint(x);
}

/**
 * Report if a character is any "printable" except space.
 *
 * Be advised that "printable" has a definition that goes back to text
 * terminals from the dawn of computing, making this a sort of special case
 * function that is not suitable for Unicode (or most any) text management.
 *
 * **WARNING**: Regardless of system locale, this is equivalent to
 * `(SDL_isprint(x)) && ((x) != ' ')`.
 *
 * @param x character value to check.
 * @returns non-zero if x falls within the character class, zero otherwise.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_isprint
 *
 * @from SDL_stdinc.h:2351 int SDL_isgraph(int x);
 */
export function isgraph(x: number): number {
  return lib.symbols.SDL_isgraph(x);
}

/**
 * Convert low-ASCII English letters to uppercase.
 *
 * **WARNING**: Regardless of system locale, this will only convert ASCII
 * values 'a' through 'z' to uppercase.
 *
 * This function returns the uppercase equivalent of `x`. If a character
 * cannot be converted, or is already uppercase, this function returns `x`.
 *
 * @param x character value to check.
 * @returns capitalized version of x, or x if no conversion available.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_stdinc.h:2369 int SDL_toupper(int x);
 */
export function toupper(x: number): number {
  return lib.symbols.SDL_toupper(x);
}

/**
 * Convert low-ASCII English letters to lowercase.
 *
 * **WARNING**: Regardless of system locale, this will only convert ASCII
 * values 'A' through 'Z' to lowercase.
 *
 * This function returns the lowercase equivalent of `x`. If a character
 * cannot be converted, or is already lowercase, this function returns `x`.
 *
 * @param x character value to check.
 * @returns lowercase version of x, or x if no conversion available.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_stdinc.h:2387 int SDL_tolower(int x);
 */
export function tolower(x: number): number {
  return lib.symbols.SDL_tolower(x);
}

/**
 * Calculate a CRC-16 value.
 *
 * https://en.wikipedia.org/wiki/Cyclic_redundancy_check
 *
 * This function can be called multiple times, to stream data to be
 * checksummed in blocks. Each call must provide the previous CRC-16 return
 * value to be updated with the next block. The first call to this function
 * for a set of blocks should pass in a zero CRC value.
 *
 * @param crc the current checksum for this data set, or 0 for a new data set.
 * @param data a new block of data to add to the checksum.
 * @param len the size, in bytes, of the new block of data.
 * @returns a CRC-16 checksum value of all blocks in the data set.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_stdinc.h:2408 Uint16 SDL_crc16(Uint16 crc, const void *data, size_t len);
 */
export function crc16(crc: number, data: Deno.PointerValue, len: bigint): number {
  return lib.symbols.SDL_crc16(crc, data, len);
}

/**
 * Calculate a CRC-32 value.
 *
 * https://en.wikipedia.org/wiki/Cyclic_redundancy_check
 *
 * This function can be called multiple times, to stream data to be
 * checksummed in blocks. Each call must provide the previous CRC-32 return
 * value to be updated with the next block. The first call to this function
 * for a set of blocks should pass in a zero CRC value.
 *
 * @param crc the current checksum for this data set, or 0 for a new data set.
 * @param data a new block of data to add to the checksum.
 * @param len the size, in bytes, of the new block of data.
 * @returns a CRC-32 checksum value of all blocks in the data set.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_stdinc.h:2429 Uint32 SDL_crc32(Uint32 crc, const void *data, size_t len);
 */
export function crc32(crc: number, data: Deno.PointerValue, len: bigint): number {
  return lib.symbols.SDL_crc32(crc, data, len);
}

/**
 * Calculate a 32-bit MurmurHash3 value for a block of data.
 *
 * https://en.wikipedia.org/wiki/MurmurHash
 *
 * A seed may be specified, which changes the final results consistently, but
 * this does not work like SDL_crc16 and SDL_crc32: you can't feed a previous
 * result from this function back into itself as the next seed value to
 * calculate a hash in chunks; it won't produce the same hash as it would if
 * the same data was provided in a single call.
 *
 * If you aren't sure what to provide for a seed, zero is fine. Murmur3 is not
 * cryptographically secure, so it shouldn't be used for hashing top-secret
 * data.
 *
 * @param data the data to be hashed.
 * @param len the size of data, in bytes.
 * @param seed a value that alters the final hash value.
 * @returns a Murmur3 32-bit hash value.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_stdinc.h:2455 Uint32 SDL_murmur3_32(const void *data, size_t len, Uint32 seed);
 */
export function murmur332(data: Deno.PointerValue, len: bigint, seed: number): number {
  return lib.symbols.SDL_murmur3_32(data, len, seed);
}

/**
 * Copy non-overlapping memory.
 *
 * The memory regions must not overlap. If they do, use SDL_memmove() instead.
 *
 * @param dst The destination memory region. Must not be NULL, and must not
 *            overlap with `src`.
 * @param src The source memory region. Must not be NULL, and must not overlap
 *            with `dst`.
 * @param len The length in bytes of both `dst` and `src`.
 * @returns `dst`.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_memmove
 *
 * @from SDL_stdinc.h:2475 void * SDL_memcpy(SDL_OUT_BYTECAP(len) void *dst, SDL_IN_BYTECAP(len) const void *src, size_t len);
 */
export function memcpy(dst: Deno.PointerValue, src: Deno.PointerValue, len: bigint): Deno.PointerValue {
  return lib.symbols.SDL_memcpy(dst, src, len);
}

/**
 * Copy memory ranges that might overlap.
 *
 * It is okay for the memory regions to overlap. If you are confident that the
 * regions never overlap, using SDL_memcpy() may improve performance.
 *
 * @param dst The destination memory region. Must not be NULL.
 * @param src The source memory region. Must not be NULL.
 * @param len The length in bytes of both `dst` and `src`.
 * @returns `dst`.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_memcpy
 *
 * @from SDL_stdinc.h:2531 void * SDL_memmove(SDL_OUT_BYTECAP(len) void *dst, SDL_IN_BYTECAP(len) const void *src, size_t len);
 */
export function memmove(dst: Deno.PointerValue, src: Deno.PointerValue, len: bigint): Deno.PointerValue {
  return lib.symbols.SDL_memmove(dst, src, len);
}

/**
 * Initialize all bytes of buffer of memory to a specific value.
 *
 * This function will set `len` bytes, pointed to by `dst`, to the value
 * specified in `c`.
 *
 * Despite `c` being an `int` instead of a `char`, this only operates on
 * bytes; `c` must be a value between 0 and 255, inclusive.
 *
 * @param dst the destination memory region. Must not be NULL.
 * @param c the byte value to set.
 * @param len the length, in bytes, to set in `dst`.
 * @returns `dst`.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_stdinc.h:2559 void * SDL_memset(SDL_OUT_BYTECAP(len) void *dst, int c, size_t len);
 */
export function memset(dst: Deno.PointerValue, c: number, len: bigint): Deno.PointerValue {
  return lib.symbols.SDL_memset(dst, c, len);
}

/**
 * Initialize all 32-bit words of buffer of memory to a specific value.
 *
 * This function will set a buffer of `dwords` Uint32 values, pointed to by
 * `dst`, to the value specified in `val`.
 *
 * Unlike SDL_memset, this sets 32-bit values, not bytes, so it's not limited
 * to a range of 0-255.
 *
 * @param dst the destination memory region. Must not be NULL.
 * @param val the Uint32 value to set.
 * @param dwords the number of Uint32 values to set in `dst`.
 * @returns `dst`.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_stdinc.h:2579 void * SDL_memset4(void *dst, Uint32 val, size_t dwords);
 */
export function memset4(dst: Deno.PointerValue, val: number, dwords: bigint): Deno.PointerValue {
  return lib.symbols.SDL_memset4(dst, val, dwords);
}

/**
 * Compare two buffers of memory.
 *
 * @param s1 the first buffer to compare. NULL is not permitted!
 * @param s2 the second buffer to compare. NULL is not permitted!
 * @param len the number of bytes to compare between the buffers.
 * @returns less than zero if s1 is "less than" s2, greater than zero if s1 is
 *          "greater than" s2, and zero if the buffers match exactly for `len`
 *          bytes.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_stdinc.h:2661 int SDL_memcmp(const void *s1, const void *s2, size_t len);
 */
export function memcmp(s1: Deno.PointerValue, s2: Deno.PointerValue, len: bigint): number {
  return lib.symbols.SDL_memcmp(s1, s2, len);
}

/**
 * This works exactly like wcslen() but doesn't require access to a C runtime.
 *
 * Counts the number of wchar_t values in `wstr`, excluding the null
 * terminator.
 *
 * Like SDL_strlen only counts bytes and not codepoints in a UTF-8 string,
 * this counts wchar_t values in a string, even if the string's encoding is of
 * variable width, like UTF-16.
 *
 * Also be aware that wchar_t is different sizes on different platforms (4
 * bytes on Linux, 2 on Windows, etc).
 *
 * @param wstr The null-terminated wide string to read. Must not be NULL.
 * @returns the length (in wchar_t values, excluding the null terminator) of
 *          `wstr`.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_wcsnlen
 * @sa SDL_utf8strlen
 * @sa SDL_utf8strnlen
 *
 * @from SDL_stdinc.h:2688 size_t SDL_wcslen(const wchar_t *wstr);
 */
export function wcslen(wstr: wchar_t): wchar_t {
  _p.i16.arr[0] = wstr;
  if(!lib.symbols.SDL_wcslen(_p.i16.p0))
    throw new Error(`SDL_wcslen: ${_p.getCstr2(lib.symbols.SDL_GetError())}`);
  return _p.i16.v0;
}

/**
 * This works exactly like wcsnlen() but doesn't require access to a C
 * runtime.
 *
 * Counts up to a maximum of `maxlen` wchar_t values in `wstr`, excluding the
 * null terminator.
 *
 * Like SDL_strnlen only counts bytes and not codepoints in a UTF-8 string,
 * this counts wchar_t values in a string, even if the string's encoding is of
 * variable width, like UTF-16.
 *
 * Also be aware that wchar_t is different sizes on different platforms (4
 * bytes on Linux, 2 on Windows, etc).
 *
 * Also, `maxlen` is a count of wide characters, not bytes!
 *
 * @param wstr The null-terminated wide string to read. Must not be NULL.
 * @param maxlen The maximum amount of wide characters to count.
 * @returns the length (in wide characters, excluding the null terminator) of
 *          `wstr` but never more than `maxlen`.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_wcslen
 * @sa SDL_utf8strlen
 * @sa SDL_utf8strnlen
 *
 * @from SDL_stdinc.h:2719 size_t SDL_wcsnlen(const wchar_t *wstr, size_t maxlen);
 */
export function wcsnlen(wstr: wchar_t, maxlen: bigint): wchar_t {
  _p.i16.arr[0] = wstr;
  if(!lib.symbols.SDL_wcsnlen(_p.i16.p0, maxlen))
    throw new Error(`SDL_wcsnlen: ${_p.getCstr2(lib.symbols.SDL_GetError())}`);
  return _p.i16.v0;
}

/**
 * Copy a wide string.
 *
 * This function copies `maxlen` - 1 wide characters from `src` to `dst`, then
 * appends a null terminator.
 *
 * `src` and `dst` must not overlap.
 *
 * If `maxlen` is 0, no wide characters are copied and no null terminator is
 * written.
 *
 * @param dst The destination buffer. Must not be NULL, and must not overlap
 *            with `src`.
 * @param src The null-terminated wide string to copy. Must not be NULL, and
 *            must not overlap with `dst`.
 * @param maxlen The length (in wide characters) of the destination buffer.
 * @returns the length (in wide characters, excluding the null terminator) of
 *          `src`.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_wcslcat
 *
 * @from SDL_stdinc.h:2746 size_t SDL_wcslcpy(SDL_OUT_Z_CAP(maxlen) wchar_t *dst, const wchar_t *src, size_t maxlen);
 */
export function wcslcpy(src: wchar_t, maxlen: bigint): { dst: wchar_t; src: wchar_t } {
  _p.i16.arr[1] = src;
  if(!lib.symbols.SDL_wcslcpy(_p.i16.p0, _p.i16.p1, maxlen))
    throw new Error(`SDL_wcslcpy: ${_p.getCstr2(lib.symbols.SDL_GetError())}`);
  return { dst: _p.i16.v0, src: _p.i16.v1 };
}

/**
 * Concatenate wide strings.
 *
 * This function appends up to `maxlen` - SDL_wcslen(dst) - 1 wide characters
 * from `src` to the end of the wide string in `dst`, then appends a null
 * terminator.
 *
 * `src` and `dst` must not overlap.
 *
 * If `maxlen` - SDL_wcslen(dst) - 1 is less than or equal to 0, then `dst` is
 * unmodified.
 *
 * @param dst The destination buffer already containing the first
 *            null-terminated wide string. Must not be NULL and must not
 *            overlap with `src`.
 * @param src The second null-terminated wide string. Must not be NULL, and
 *            must not overlap with `dst`.
 * @param maxlen The length (in wide characters) of the destination buffer.
 * @returns the length (in wide characters, excluding the null terminator) of
 *          the string in `dst` plus the length of `src`.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_wcslcpy
 *
 * @from SDL_stdinc.h:2775 size_t SDL_wcslcat(SDL_INOUT_Z_CAP(maxlen) wchar_t *dst, const wchar_t *src, size_t maxlen);
 */
export function wcslcat(src: wchar_t, maxlen: bigint): { dst: wchar_t; src: wchar_t } {
  _p.i16.arr[1] = src;
  if(!lib.symbols.SDL_wcslcat(_p.i16.p0, _p.i16.p1, maxlen))
    throw new Error(`SDL_wcslcat: ${_p.getCstr2(lib.symbols.SDL_GetError())}`);
  return { dst: _p.i16.v0, src: _p.i16.v1 };
}

/**
 * Allocate a copy of a wide string.
 *
 * This allocates enough space for a null-terminated copy of `wstr`, using
 * SDL_malloc, and then makes a copy of the string into this space.
 *
 * The returned string is owned by the caller, and should be passed to
 * SDL_free when no longer needed.
 *
 * @param wstr the string to copy.
 * @returns a pointer to the newly-allocated wide string.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_stdinc.h:2793 wchar_t * SDL_wcsdup(const wchar_t *wstr);
 */
export function wcsdup(wstr: wchar_t): { wstr: wchar_t; ret: Deno.PointerValue } {
  _p.i16.arr[0] = wstr;
  const ret = lib.symbols.SDL_wcsdup(_p.i16.p0) as Deno.PointerValue;
  if(!ret) throw new Error(`SDL_wcsdup: ${_p.getCstr2(lib.symbols.SDL_GetError())}`);
  return { wstr: _p.i16.v0, ret };
}

/**
 * Search a wide string for the first instance of a specific substring.
 *
 * The search ends once it finds the requested substring, or a null terminator
 * byte to end the string.
 *
 * Note that this looks for strings of _wide characters_, not _codepoints_, so
 * it's legal to search for malformed and incomplete UTF-16 sequences.
 *
 * @param haystack the wide string to search. Must not be NULL.
 * @param needle the wide string to search for. Must not be NULL.
 * @returns a pointer to the first instance of `needle` in the string, or NULL
 *          if not found.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_stdinc.h:2813 wchar_t * SDL_wcsstr(const wchar_t *haystack, const wchar_t *needle);
 */
export function wcsstr(haystack: wchar_t, needle: wchar_t): { haystack: wchar_t; needle: wchar_t; ret: Deno.PointerValue } {
  _p.i16.arr[0] = haystack;
  _p.i16.arr[1] = needle;
  const ret = lib.symbols.SDL_wcsstr(_p.i16.p0, _p.i16.p1) as Deno.PointerValue;
  if(!ret) throw new Error(`SDL_wcsstr: ${_p.getCstr2(lib.symbols.SDL_GetError())}`);
  return { haystack: _p.i16.v0, needle: _p.i16.v1, ret };
}

/**
 * Search a wide string, up to n wide chars, for the first instance of a
 * specific substring.
 *
 * The search ends once it finds the requested substring, or a null terminator
 * value to end the string, or `maxlen` wide character have been examined. It
 * is possible to use this function on a wide string without a null
 * terminator.
 *
 * Note that this looks for strings of _wide characters_, not _codepoints_, so
 * it's legal to search for malformed and incomplete UTF-16 sequences.
 *
 * @param haystack the wide string to search. Must not be NULL.
 * @param needle the wide string to search for. Must not be NULL.
 * @param maxlen the maximum number of wide characters to search in
 *               `haystack`.
 * @returns a pointer to the first instance of `needle` in the string, or NULL
 *          if not found.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_stdinc.h:2838 wchar_t * SDL_wcsnstr(const wchar_t *haystack, const wchar_t *needle, size_t maxlen);
 */
export function wcsnstr(haystack: wchar_t, needle: wchar_t, maxlen: bigint): { haystack: wchar_t; needle: wchar_t; ret: Deno.PointerValue } {
  _p.i16.arr[0] = haystack;
  _p.i16.arr[1] = needle;
  const ret = lib.symbols.SDL_wcsnstr(_p.i16.p0, _p.i16.p1, maxlen) as Deno.PointerValue;
  if(!ret) throw new Error(`SDL_wcsnstr: ${_p.getCstr2(lib.symbols.SDL_GetError())}`);
  return { haystack: _p.i16.v0, needle: _p.i16.v1, ret };
}

/**
 * Compare two null-terminated wide strings.
 *
 * This only compares wchar_t values until it hits a null-terminating
 * character; it does not care if the string is well-formed UTF-16 (or UTF-32,
 * depending on your platform's wchar_t size), or uses valid Unicode values.
 *
 * @param str1 the first string to compare. NULL is not permitted!
 * @param str2 the second string to compare. NULL is not permitted!
 * @returns less than zero if str1 is "less than" str2, greater than zero if
 *          str1 is "greater than" str2, and zero if the strings match
 *          exactly.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_stdinc.h:2857 int SDL_wcscmp(const wchar_t *str1, const wchar_t *str2);
 */
export function wcscmp(str1: wchar_t, str2: wchar_t): { str1: wchar_t; str2: wchar_t } {
  _p.i16.arr[0] = str1;
  _p.i16.arr[1] = str2;
  if(!lib.symbols.SDL_wcscmp(_p.i16.p0, _p.i16.p1))
    throw new Error(`SDL_wcscmp: ${_p.getCstr2(lib.symbols.SDL_GetError())}`);
  return { str1: _p.i16.v0, str2: _p.i16.v1 };
}

/**
 * Compare two wide strings up to a number of wchar_t values.
 *
 * This only compares wchar_t values; it does not care if the string is
 * well-formed UTF-16 (or UTF-32, depending on your platform's wchar_t size),
 * or uses valid Unicode values.
 *
 * Note that while this function is intended to be used with UTF-16 (or
 * UTF-32, depending on your platform's definition of wchar_t), it is
 * comparing raw wchar_t values and not Unicode codepoints: `maxlen` specifies
 * a wchar_t limit! If the limit lands in the middle of a multi-wchar UTF-16
 * sequence, it will only compare a portion of the final character.
 *
 * `maxlen` specifies a maximum number of wchar_t to compare; if the strings
 * match to this number of wide chars (or both have matched to a
 * null-terminator character before this count), they will be considered
 * equal.
 *
 * @param str1 the first string to compare. NULL is not permitted!
 * @param str2 the second string to compare. NULL is not permitted!
 * @param maxlen the maximum number of wchar_t to compare.
 * @returns less than zero if str1 is "less than" str2, greater than zero if
 *          str1 is "greater than" str2, and zero if the strings match
 *          exactly.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_stdinc.h:2888 int SDL_wcsncmp(const wchar_t *str1, const wchar_t *str2, size_t maxlen);
 */
export function wcsncmp(str1: wchar_t, str2: wchar_t, maxlen: bigint): { str1: wchar_t; str2: wchar_t } {
  _p.i16.arr[0] = str1;
  _p.i16.arr[1] = str2;
  if(!lib.symbols.SDL_wcsncmp(_p.i16.p0, _p.i16.p1, maxlen))
    throw new Error(`SDL_wcsncmp: ${_p.getCstr2(lib.symbols.SDL_GetError())}`);
  return { str1: _p.i16.v0, str2: _p.i16.v1 };
}

/**
 * Compare two null-terminated wide strings, case-insensitively.
 *
 * This will work with Unicode strings, using a technique called
 * "case-folding" to handle the vast majority of case-sensitive human
 * languages regardless of system locale. It can deal with expanding values: a
 * German Eszett character can compare against two ASCII 's' chars and be
 * considered a match, for example. A notable exception: it does not handle
 * the Turkish 'i' character; human language is complicated!
 *
 * Depending on your platform, "wchar_t" might be 2 bytes, and expected to be
 * UTF-16 encoded (like Windows), or 4 bytes in UTF-32 format. Since this
 * handles Unicode, it expects the string to be well-formed and not a
 * null-terminated string of arbitrary bytes. Characters that are not valid
 * UTF-16 (or UTF-32) are treated as Unicode character U+FFFD (REPLACEMENT
 * CHARACTER), which is to say two strings of random bits may turn out to
 * match if they convert to the same amount of replacement characters.
 *
 * @param str1 the first string to compare. NULL is not permitted!
 * @param str2 the second string to compare. NULL is not permitted!
 * @returns less than zero if str1 is "less than" str2, greater than zero if
 *          str1 is "greater than" str2, and zero if the strings match
 *          exactly.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_stdinc.h:2918 int SDL_wcscasecmp(const wchar_t *str1, const wchar_t *str2);
 */
export function wcscasecmp(str1: wchar_t, str2: wchar_t): { str1: wchar_t; str2: wchar_t } {
  _p.i16.arr[0] = str1;
  _p.i16.arr[1] = str2;
  if(!lib.symbols.SDL_wcscasecmp(_p.i16.p0, _p.i16.p1))
    throw new Error(`SDL_wcscasecmp: ${_p.getCstr2(lib.symbols.SDL_GetError())}`);
  return { str1: _p.i16.v0, str2: _p.i16.v1 };
}

/**
 * Compare two wide strings, case-insensitively, up to a number of wchar_t.
 *
 * This will work with Unicode strings, using a technique called
 * "case-folding" to handle the vast majority of case-sensitive human
 * languages regardless of system locale. It can deal with expanding values: a
 * German Eszett character can compare against two ASCII 's' chars and be
 * considered a match, for example. A notable exception: it does not handle
 * the Turkish 'i' character; human language is complicated!
 *
 * Depending on your platform, "wchar_t" might be 2 bytes, and expected to be
 * UTF-16 encoded (like Windows), or 4 bytes in UTF-32 format. Since this
 * handles Unicode, it expects the string to be well-formed and not a
 * null-terminated string of arbitrary bytes. Characters that are not valid
 * UTF-16 (or UTF-32) are treated as Unicode character U+FFFD (REPLACEMENT
 * CHARACTER), which is to say two strings of random bits may turn out to
 * match if they convert to the same amount of replacement characters.
 *
 * Note that while this function might deal with variable-sized characters,
 * `maxlen` specifies a _wchar_ limit! If the limit lands in the middle of a
 * multi-byte UTF-16 sequence, it may convert a portion of the final character
 * to one or more Unicode character U+FFFD (REPLACEMENT CHARACTER) so as not
 * to overflow a buffer.
 *
 * `maxlen` specifies a maximum number of wchar_t values to compare; if the
 * strings match to this number of wchar_t (or both have matched to a
 * null-terminator character before this number of bytes), they will be
 * considered equal.
 *
 * @param str1 the first string to compare. NULL is not permitted!
 * @param str2 the second string to compare. NULL is not permitted!
 * @param maxlen the maximum number of wchar_t values to compare.
 * @returns less than zero if str1 is "less than" str2, greater than zero if
 *          str1 is "greater than" str2, and zero if the strings match
 *          exactly.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_stdinc.h:2960 int SDL_wcsncasecmp(const wchar_t *str1, const wchar_t *str2, size_t maxlen);
 */
export function wcsncasecmp(str1: wchar_t, str2: wchar_t, maxlen: bigint): { str1: wchar_t; str2: wchar_t } {
  _p.i16.arr[0] = str1;
  _p.i16.arr[1] = str2;
  if(!lib.symbols.SDL_wcsncasecmp(_p.i16.p0, _p.i16.p1, maxlen))
    throw new Error(`SDL_wcsncasecmp: ${_p.getCstr2(lib.symbols.SDL_GetError())}`);
  return { str1: _p.i16.v0, str2: _p.i16.v1 };
}

/**
 * Parse a `long` from a wide string.
 *
 * If `str` starts with whitespace, then those whitespace characters are
 * skipped before attempting to parse the number.
 *
 * If the parsed number does not fit inside a `long`, the result is clamped to
 * the minimum and maximum representable `long` values.
 *
 * @param str The null-terminated wide string to read. Must not be NULL.
 * @param endp If not NULL, the address of the first invalid wide character
 *             (i.e. the next character after the parsed number) will be
 *             written to this pointer.
 * @param base The base of the integer to read. Supported values are 0 and 2
 *             to 36 inclusive. If 0, the base will be inferred from the
 *             number's prefix (0x for hexadecimal, 0 for octal, decimal
 *             otherwise).
 * @returns the parsed `long`, or 0 if no number could be parsed.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_strtol
 *
 * @from SDL_stdinc.h:2987 long SDL_wcstol(const wchar_t *str, wchar_t **endp, int base);
 */
export function wcstol(str: wchar_t, endp: Deno.PointerValue, base: number): wchar_t {
  _p.i16.arr[0] = str;
  if(!lib.symbols.SDL_wcstol(_p.i16.p0, endp, base))
    throw new Error(`SDL_wcstol: ${_p.getCstr2(lib.symbols.SDL_GetError())}`);
  return _p.i16.v0;
}

/**
 * This works exactly like strlen() but doesn't require access to a C runtime.
 *
 * Counts the bytes in `str`, excluding the null terminator.
 *
 * If you need the length of a UTF-8 string, consider using SDL_utf8strlen().
 *
 * @param str The null-terminated string to read. Must not be NULL.
 * @returns the length (in bytes, excluding the null terminator) of `src`.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_strnlen
 * @sa SDL_utf8strlen
 * @sa SDL_utf8strnlen
 *
 * @from SDL_stdinc.h:3007 size_t SDL_strlen(const char *str);
 */
export function strlen(str: string): bigint {
  return lib.symbols.SDL_strlen(_p.toCstr(str));
}

/**
 * This works exactly like strnlen() but doesn't require access to a C
 * runtime.
 *
 * Counts up to a maximum of `maxlen` bytes in `str`, excluding the null
 * terminator.
 *
 * If you need the length of a UTF-8 string, consider using SDL_utf8strnlen().
 *
 * @param str The null-terminated string to read. Must not be NULL.
 * @param maxlen The maximum amount of bytes to count.
 * @returns the length (in bytes, excluding the null terminator) of `src` but
 *          never more than `maxlen`.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_strlen
 * @sa SDL_utf8strlen
 * @sa SDL_utf8strnlen
 *
 * @from SDL_stdinc.h:3031 size_t SDL_strnlen(const char *str, size_t maxlen);
 */
export function strnlen(str: string, maxlen: bigint): bigint {
  return lib.symbols.SDL_strnlen(_p.toCstr(str), maxlen);
}

/**
 * Copy a string.
 *
 * This function copies up to `maxlen` - 1 characters from `src` to `dst`,
 * then appends a null terminator.
 *
 * If `maxlen` is 0, no characters are copied and no null terminator is
 * written.
 *
 * If you want to copy an UTF-8 string but need to ensure that multi-byte
 * sequences are not truncated, consider using SDL_utf8strlcpy().
 *
 * @param dst The destination buffer. Must not be NULL, and must not overlap
 *            with `src`.
 * @param src The null-terminated string to copy. Must not be NULL, and must
 *            not overlap with `dst`.
 * @param maxlen The length (in characters) of the destination buffer.
 * @returns the length (in characters, excluding the null terminator) of
 *          `src`.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_strlcat
 * @sa SDL_utf8strlcpy
 *
 * @from SDL_stdinc.h:3060 size_t SDL_strlcpy(SDL_OUT_Z_CAP(maxlen) char *dst, const char *src, size_t maxlen);
 */
export function strlcpy(src: string, maxlen: bigint): string {
  if(!lib.symbols.SDL_strlcpy(_p.cstr.p0, _p.toCstr(src), maxlen))
    throw new Error(`SDL_strlcpy: ${_p.getCstr2(lib.symbols.SDL_GetError())}`);
  return _p.cstr.v0;
}

/**
 * Copy an UTF-8 string.
 *
 * This function copies up to `dst_bytes` - 1 bytes from `src` to `dst` while
 * also ensuring that the string written to `dst` does not end in a truncated
 * multi-byte sequence. Finally, it appends a null terminator.
 *
 * `src` and `dst` must not overlap.
 *
 * Note that unlike SDL_strlcpy(), this function returns the number of bytes
 * written, not the length of `src`.
 *
 * @param dst The destination buffer. Must not be NULL, and must not overlap
 *            with `src`.
 * @param src The null-terminated UTF-8 string to copy. Must not be NULL, and
 *            must not overlap with `dst`.
 * @param dst_bytes The length (in bytes) of the destination buffer. Must not
 *                  be 0.
 * @returns the number of bytes written, excluding the null terminator.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_strlcpy
 *
 * @from SDL_stdinc.h:3088 size_t SDL_utf8strlcpy(SDL_OUT_Z_CAP(dst_bytes) char *dst, const char *src, size_t dst_bytes);
 */
export function utf8Strlcpy(src: string, dst_bytes: bigint): string {
  if(!lib.symbols.SDL_utf8strlcpy(_p.cstr.p0, _p.toCstr(src), dst_bytes))
    throw new Error(`SDL_utf8strlcpy: ${_p.getCstr2(lib.symbols.SDL_GetError())}`);
  return _p.cstr.v0;
}

/**
 * Concatenate strings.
 *
 * This function appends up to `maxlen` - SDL_strlen(dst) - 1 characters from
 * `src` to the end of the string in `dst`, then appends a null terminator.
 *
 * `src` and `dst` must not overlap.
 *
 * If `maxlen` - SDL_strlen(dst) - 1 is less than or equal to 0, then `dst` is
 * unmodified.
 *
 * @param dst The destination buffer already containing the first
 *            null-terminated string. Must not be NULL and must not overlap
 *            with `src`.
 * @param src The second null-terminated string. Must not be NULL, and must
 *            not overlap with `dst`.
 * @param maxlen The length (in characters) of the destination buffer.
 * @returns the length (in characters, excluding the null terminator) of the
 *          string in `dst` plus the length of `src`.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_strlcpy
 *
 * @from SDL_stdinc.h:3116 size_t SDL_strlcat(SDL_INOUT_Z_CAP(maxlen) char *dst, const char *src, size_t maxlen);
 */
export function strlcat(src: string, maxlen: bigint): string {
  if(!lib.symbols.SDL_strlcat(_p.cstr.p0, _p.toCstr(src), maxlen))
    throw new Error(`SDL_strlcat: ${_p.getCstr2(lib.symbols.SDL_GetError())}`);
  return _p.cstr.v0;
}

/**
 * Allocate a copy of a string.
 *
 * This allocates enough space for a null-terminated copy of `str`, using
 * SDL_malloc, and then makes a copy of the string into this space.
 *
 * The returned string is owned by the caller, and should be passed to
 * SDL_free when no longer needed.
 *
 * @param str the string to copy.
 * @returns a pointer to the newly-allocated string.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_stdinc.h:3134 SDL_MALLOC char * SDL_strdup(const char *str);
 */
export function strdup(str: string): string {
  return _p.getCstr2(lib.symbols.SDL_strdup(_p.toCstr(str)));
}

/**
 * Allocate a copy of a string, up to n characters.
 *
 * This allocates enough space for a null-terminated copy of `str`, up to
 * `maxlen` bytes, using SDL_malloc, and then makes a copy of the string into
 * this space.
 *
 * If the string is longer than `maxlen` bytes, the returned string will be
 * `maxlen` bytes long, plus a null-terminator character that isn't included
 * in the count.
 *
 * The returned string is owned by the caller, and should be passed to
 * SDL_free when no longer needed.
 *
 * @param str the string to copy.
 * @param maxlen the maximum length of the copied string, not counting the
 *               null-terminator character.
 * @returns a pointer to the newly-allocated string.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_stdinc.h:3159 SDL_MALLOC char * SDL_strndup(const char *str, size_t maxlen);
 */
export function strndup(str: string, maxlen: bigint): string {
  return _p.getCstr2(lib.symbols.SDL_strndup(_p.toCstr(str), maxlen));
}

/**
 * Reverse a string's contents.
 *
 * This reverses a null-terminated string in-place. Only the content of the
 * string is reversed; the null-terminator character remains at the end of the
 * reversed string.
 *
 * **WARNING**: This function reverses the _bytes_ of the string, not the
 * codepoints. If `str` is a UTF-8 string with Unicode codepoints > 127, this
 * will ruin the string data. You should only use this function on strings
 * that are completely comprised of low ASCII characters.
 *
 * @param str the string to reverse.
 * @returns `str`.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_stdinc.h:3180 char * SDL_strrev(char *str);
 */
export function strrev(): { str: string; ret: string } {
  const ret = lib.symbols.SDL_strrev(_p.cstr.p0) as string;
  if(!ret) throw new Error(`SDL_strrev: ${_p.getCstr2(lib.symbols.SDL_GetError())}`);
  return { str: _p.cstr.v0, ret };
}

/**
 * Convert a string to uppercase.
 *
 * **WARNING**: Regardless of system locale, this will only convert ASCII
 * values 'A' through 'Z' to uppercase.
 *
 * This function operates on a null-terminated string of bytes--even if it is
 * malformed UTF-8!--and converts ASCII characters 'a' through 'z' to their
 * uppercase equivalents in-place, returning the original `str` pointer.
 *
 * @param str the string to convert in-place. Can not be NULL.
 * @returns the `str` pointer passed into this function.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_strlwr
 *
 * @from SDL_stdinc.h:3201 char * SDL_strupr(char *str);
 */
export function strupr(): { str: string; ret: string } {
  const ret = lib.symbols.SDL_strupr(_p.cstr.p0) as string;
  if(!ret) throw new Error(`SDL_strupr: ${_p.getCstr2(lib.symbols.SDL_GetError())}`);
  return { str: _p.cstr.v0, ret };
}

/**
 * Convert a string to lowercase.
 *
 * **WARNING**: Regardless of system locale, this will only convert ASCII
 * values 'A' through 'Z' to lowercase.
 *
 * This function operates on a null-terminated string of bytes--even if it is
 * malformed UTF-8!--and converts ASCII characters 'A' through 'Z' to their
 * lowercase equivalents in-place, returning the original `str` pointer.
 *
 * @param str the string to convert in-place. Can not be NULL.
 * @returns the `str` pointer passed into this function.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_strupr
 *
 * @from SDL_stdinc.h:3222 char * SDL_strlwr(char *str);
 */
export function strlwr(): { str: string; ret: string } {
  const ret = lib.symbols.SDL_strlwr(_p.cstr.p0) as string;
  if(!ret) throw new Error(`SDL_strlwr: ${_p.getCstr2(lib.symbols.SDL_GetError())}`);
  return { str: _p.cstr.v0, ret };
}

/**
 * Search a string for the first instance of a specific byte.
 *
 * The search ends once it finds the requested byte value, or a null
 * terminator byte to end the string.
 *
 * Note that this looks for _bytes_, not _characters_, so you cannot match
 * against a Unicode codepoint > 255, regardless of character encoding.
 *
 * @param str the string to search. Must not be NULL.
 * @param c the byte value to search for.
 * @returns a pointer to the first instance of `c` in the string, or NULL if
 *          not found.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_stdinc.h:3242 char * SDL_strchr(const char *str, int c);
 */
export function strchr(str: string, c: number): string {
  return _p.getCstr2(lib.symbols.SDL_strchr(_p.toCstr(str), c));
}

/**
 * Search a string for the last instance of a specific byte.
 *
 * The search must go until it finds a null terminator byte to end the string.
 *
 * Note that this looks for _bytes_, not _characters_, so you cannot match
 * against a Unicode codepoint > 255, regardless of character encoding.
 *
 * @param str the string to search. Must not be NULL.
 * @param c the byte value to search for.
 * @returns a pointer to the last instance of `c` in the string, or NULL if
 *          not found.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_stdinc.h:3261 char * SDL_strrchr(const char *str, int c);
 */
export function strrchr(str: string, c: number): string {
  return _p.getCstr2(lib.symbols.SDL_strrchr(_p.toCstr(str), c));
}

/**
 * Search a string for the first instance of a specific substring.
 *
 * The search ends once it finds the requested substring, or a null terminator
 * byte to end the string.
 *
 * Note that this looks for strings of _bytes_, not _characters_, so it's
 * legal to search for malformed and incomplete UTF-8 sequences.
 *
 * @param haystack the string to search. Must not be NULL.
 * @param needle the string to search for. Must not be NULL.
 * @returns a pointer to the first instance of `needle` in the string, or NULL
 *          if not found.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_stdinc.h:3281 char * SDL_strstr(const char *haystack, const char *needle);
 */
export function strstr(haystack: string, needle: string): string {
  return _p.getCstr2(lib.symbols.SDL_strstr(_p.toCstr(haystack), _p.toCstr(needle)));
}

/**
 * Search a string, up to n bytes, for the first instance of a specific
 * substring.
 *
 * The search ends once it finds the requested substring, or a null terminator
 * byte to end the string, or `maxlen` bytes have been examined. It is
 * possible to use this function on a string without a null terminator.
 *
 * Note that this looks for strings of _bytes_, not _characters_, so it's
 * legal to search for malformed and incomplete UTF-8 sequences.
 *
 * @param haystack the string to search. Must not be NULL.
 * @param needle the string to search for. Must not be NULL.
 * @param maxlen the maximum number of bytes to search in `haystack`.
 * @returns a pointer to the first instance of `needle` in the string, or NULL
 *          if not found.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_stdinc.h:3304 char * SDL_strnstr(const char *haystack, const char *needle, size_t maxlen);
 */
export function strnstr(haystack: string, needle: string, maxlen: bigint): string {
  return _p.getCstr2(lib.symbols.SDL_strnstr(_p.toCstr(haystack), _p.toCstr(needle), maxlen));
}

/**
 * Search a UTF-8 string for the first instance of a specific substring,
 * case-insensitively.
 *
 * This will work with Unicode strings, using a technique called
 * "case-folding" to handle the vast majority of case-sensitive human
 * languages regardless of system locale. It can deal with expanding values: a
 * German Eszett character can compare against two ASCII 's' chars and be
 * considered a match, for example. A notable exception: it does not handle
 * the Turkish 'i' character; human language is complicated!
 *
 * Since this handles Unicode, it expects the strings to be well-formed UTF-8
 * and not a null-terminated string of arbitrary bytes. Bytes that are not
 * valid UTF-8 are treated as Unicode character U+FFFD (REPLACEMENT
 * CHARACTER), which is to say two strings of random bits may turn out to
 * match if they convert to the same amount of replacement characters.
 *
 * @param haystack the string to search. Must not be NULL.
 * @param needle the string to search for. Must not be NULL.
 * @returns a pointer to the first instance of `needle` in the string, or NULL
 *          if not found.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_stdinc.h:3332 char * SDL_strcasestr(const char *haystack, const char *needle);
 */
export function strcasestr(haystack: string, needle: string): string {
  return _p.getCstr2(lib.symbols.SDL_strcasestr(_p.toCstr(haystack), _p.toCstr(needle)));
}

/**
 * This works exactly like strtok_r() but doesn't require access to a C
 * runtime.
 *
 * Break a string up into a series of tokens.
 *
 * To start tokenizing a new string, `str` should be the non-NULL address of
 * the string to start tokenizing. Future calls to get the next token from the
 * same string should specify a NULL.
 *
 * Note that this function will overwrite pieces of `str` with null chars to
 * split it into tokens. This function cannot be used with const/read-only
 * strings!
 *
 * `saveptr` just needs to point to a `char *` that can be overwritten; SDL
 * will use this to save tokenizing state between calls. It is initialized if
 * `str` is non-NULL, and used to resume tokenizing when `str` is NULL.
 *
 * @param str the string to tokenize, or NULL to continue tokenizing.
 * @param delim the delimiter string that separates tokens.
 * @param saveptr pointer to a char *, used for ongoing state.
 * @returns A pointer to the next token, or NULL if no tokens remain.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_stdinc.h:3361 char * SDL_strtok_r(char *str, const char *delim, char **saveptr);
 */
export function strtokR(delim: string): { str: string; saveptr: string; ret: string } {
  const ret = lib.symbols.SDL_strtok_r(_p.cstr.p0, _p.toCstr(delim), _p.ptr.p0) as string;
  if(!ret) throw new Error(`SDL_strtok_r: ${_p.getCstr2(lib.symbols.SDL_GetError())}`);
  return { str: _p.cstr.v0, saveptr: _p.ptr.v0, ret };
}

/**
 * Count the number of codepoints in a UTF-8 string.
 *
 * Counts the _codepoints_, not _bytes_, in `str`, excluding the null
 * terminator.
 *
 * If you need to count the bytes in a string instead, consider using
 * SDL_strlen().
 *
 * Since this handles Unicode, it expects the strings to be well-formed UTF-8
 * and not a null-terminated string of arbitrary bytes. Bytes that are not
 * valid UTF-8 are treated as Unicode character U+FFFD (REPLACEMENT
 * CHARACTER), so a malformed or incomplete UTF-8 sequence might increase the
 * count by several replacement characters.
 *
 * @param str The null-terminated UTF-8 string to read. Must not be NULL.
 * @returns The length (in codepoints, excluding the null terminator) of
 *          `src`.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_utf8strnlen
 * @sa SDL_strlen
 *
 * @from SDL_stdinc.h:3389 size_t SDL_utf8strlen(const char *str);
 */
export function utf8Strlen(str: string): bigint {
  return lib.symbols.SDL_utf8strlen(_p.toCstr(str));
}

/**
 * Count the number of codepoints in a UTF-8 string, up to n bytes.
 *
 * Counts the _codepoints_, not _bytes_, in `str`, excluding the null
 * terminator.
 *
 * If you need to count the bytes in a string instead, consider using
 * SDL_strnlen().
 *
 * The counting stops at `bytes` bytes (not codepoints!). This seems
 * counterintuitive, but makes it easy to express the total size of the
 * string's buffer.
 *
 * Since this handles Unicode, it expects the strings to be well-formed UTF-8
 * and not a null-terminated string of arbitrary bytes. Bytes that are not
 * valid UTF-8 are treated as Unicode character U+FFFD (REPLACEMENT
 * CHARACTER), so a malformed or incomplete UTF-8 sequence might increase the
 * count by several replacement characters.
 *
 * @param str The null-terminated UTF-8 string to read. Must not be NULL.
 * @param bytes The maximum amount of bytes to count.
 * @returns The length (in codepoints, excluding the null terminator) of `src`
 *          but never more than `maxlen`.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_utf8strlen
 * @sa SDL_strnlen
 *
 * @from SDL_stdinc.h:3422 size_t SDL_utf8strnlen(const char *str, size_t bytes);
 */
export function utf8Strnlen(str: string, bytes: bigint): bigint {
  return lib.symbols.SDL_utf8strnlen(_p.toCstr(str), bytes);
}

/**
 * Convert an integer into a string.
 *
 * This requires a radix to specified for string format. Specifying 10
 * produces a decimal number, 16 hexadecimal, etc. Must be in the range of 2
 * to 36.
 *
 * Note that this function will overflow a buffer if `str` is not large enough
 * to hold the output! It may be safer to use SDL_snprintf to clamp output, or
 * SDL_asprintf to allocate a buffer. Otherwise, it doesn't hurt to allocate
 * much more space than you expect to use (and don't forget possible negative
 * signs, null terminator bytes, etc).
 *
 * @param value the integer to convert.
 * @param str the buffer to write the string into.
 * @param radix the radix to use for string generation.
 * @returns `str`.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_uitoa
 * @sa SDL_ltoa
 * @sa SDL_lltoa
 *
 * @from SDL_stdinc.h:3450 char * SDL_itoa(int value, char *str, int radix);
 */
export function itoa(value: number, radix: number): { str: string; ret: string } {
  const ret = lib.symbols.SDL_itoa(value, _p.cstr.p0, radix) as string;
  if(!ret) throw new Error(`SDL_itoa: ${_p.getCstr2(lib.symbols.SDL_GetError())}`);
  return { str: _p.cstr.v0, ret };
}

/**
 * Convert an unsigned integer into a string.
 *
 * This requires a radix to specified for string format. Specifying 10
 * produces a decimal number, 16 hexadecimal, etc. Must be in the range of 2
 * to 36.
 *
 * Note that this function will overflow a buffer if `str` is not large enough
 * to hold the output! It may be safer to use SDL_snprintf to clamp output, or
 * SDL_asprintf to allocate a buffer. Otherwise, it doesn't hurt to allocate
 * much more space than you expect to use (and don't forget null terminator
 * bytes, etc).
 *
 * @param value the unsigned integer to convert.
 * @param str the buffer to write the string into.
 * @param radix the radix to use for string generation.
 * @returns `str`.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_itoa
 * @sa SDL_ultoa
 * @sa SDL_ulltoa
 *
 * @from SDL_stdinc.h:3478 char * SDL_uitoa(unsigned int value, char *str, int radix);
 */
export function uitoa(value: number, radix: number): { str: string; ret: string } {
  const ret = lib.symbols.SDL_uitoa(value, _p.cstr.p0, radix) as string;
  if(!ret) throw new Error(`SDL_uitoa: ${_p.getCstr2(lib.symbols.SDL_GetError())}`);
  return { str: _p.cstr.v0, ret };
}

/**
 * Convert a long integer into a string.
 *
 * This requires a radix to specified for string format. Specifying 10
 * produces a decimal number, 16 hexadecimal, etc. Must be in the range of 2
 * to 36.
 *
 * Note that this function will overflow a buffer if `str` is not large enough
 * to hold the output! It may be safer to use SDL_snprintf to clamp output, or
 * SDL_asprintf to allocate a buffer. Otherwise, it doesn't hurt to allocate
 * much more space than you expect to use (and don't forget possible negative
 * signs, null terminator bytes, etc).
 *
 * @param value the long integer to convert.
 * @param str the buffer to write the string into.
 * @param radix the radix to use for string generation.
 * @returns `str`.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_ultoa
 * @sa SDL_itoa
 * @sa SDL_lltoa
 *
 * @from SDL_stdinc.h:3506 char * SDL_ltoa(long value, char *str, int radix);
 */
export function ltoa(value: bigint, radix: number): { str: string; ret: string } {
  const ret = lib.symbols.SDL_ltoa(value, _p.cstr.p0, radix) as string;
  if(!ret) throw new Error(`SDL_ltoa: ${_p.getCstr2(lib.symbols.SDL_GetError())}`);
  return { str: _p.cstr.v0, ret };
}

/**
 * Convert an unsigned long integer into a string.
 *
 * This requires a radix to specified for string format. Specifying 10
 * produces a decimal number, 16 hexadecimal, etc. Must be in the range of 2
 * to 36.
 *
 * Note that this function will overflow a buffer if `str` is not large enough
 * to hold the output! It may be safer to use SDL_snprintf to clamp output, or
 * SDL_asprintf to allocate a buffer. Otherwise, it doesn't hurt to allocate
 * much more space than you expect to use (and don't forget null terminator
 * bytes, etc).
 *
 * @param value the unsigned long integer to convert.
 * @param str the buffer to write the string into.
 * @param radix the radix to use for string generation.
 * @returns `str`.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_ltoa
 * @sa SDL_uitoa
 * @sa SDL_ulltoa
 *
 * @from SDL_stdinc.h:3534 char * SDL_ultoa(unsigned long value, char *str, int radix);
 */
export function ultoa(value: bigint, radix: number): { str: string; ret: string } {
  const ret = lib.symbols.SDL_ultoa(value, _p.cstr.p0, radix) as string;
  if(!ret) throw new Error(`SDL_ultoa: ${_p.getCstr2(lib.symbols.SDL_GetError())}`);
  return { str: _p.cstr.v0, ret };
}

/**
 * Convert a long long integer into a string.
 *
 * This requires a radix to specified for string format. Specifying 10
 * produces a decimal number, 16 hexadecimal, etc. Must be in the range of 2
 * to 36.
 *
 * Note that this function will overflow a buffer if `str` is not large enough
 * to hold the output! It may be safer to use SDL_snprintf to clamp output, or
 * SDL_asprintf to allocate a buffer. Otherwise, it doesn't hurt to allocate
 * much more space than you expect to use (and don't forget possible negative
 * signs, null terminator bytes, etc).
 *
 * @param value the long long integer to convert.
 * @param str the buffer to write the string into.
 * @param radix the radix to use for string generation.
 * @returns `str`.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_ulltoa
 * @sa SDL_itoa
 * @sa SDL_ltoa
 *
 * @from SDL_stdinc.h:3564 char * SDL_lltoa(long long value, char *str, int radix);
 */
export function lltoa(value: bigint, radix: number): { str: string; ret: string } {
  const ret = lib.symbols.SDL_lltoa(value, _p.cstr.p0, radix) as string;
  if(!ret) throw new Error(`SDL_lltoa: ${_p.getCstr2(lib.symbols.SDL_GetError())}`);
  return { str: _p.cstr.v0, ret };
}

/**
 * Convert an unsigned long long integer into a string.
 *
 * This requires a radix to specified for string format. Specifying 10
 * produces a decimal number, 16 hexadecimal, etc. Must be in the range of 2
 * to 36.
 *
 * Note that this function will overflow a buffer if `str` is not large enough
 * to hold the output! It may be safer to use SDL_snprintf to clamp output, or
 * SDL_asprintf to allocate a buffer. Otherwise, it doesn't hurt to allocate
 * much more space than you expect to use (and don't forget null terminator
 * bytes, etc).
 *
 * @param value the unsigned long long integer to convert.
 * @param str the buffer to write the string into.
 * @param radix the radix to use for string generation.
 * @returns `str`.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_lltoa
 * @sa SDL_uitoa
 * @sa SDL_ultoa
 *
 * @from SDL_stdinc.h:3592 char * SDL_ulltoa(unsigned long long value, char *str, int radix);
 */
export function ulltoa(value: bigint, radix: number): { str: string; ret: string } {
  const ret = lib.symbols.SDL_ulltoa(value, _p.cstr.p0, radix) as string;
  if(!ret) throw new Error(`SDL_ulltoa: ${_p.getCstr2(lib.symbols.SDL_GetError())}`);
  return { str: _p.cstr.v0, ret };
}

/**
 * Parse an `int` from a string.
 *
 * The result of calling `SDL_atoi(str)` is equivalent to
 * `(int)SDL_strtol(str, NULL, 10)`.
 *
 * @param str The null-terminated string to read. Must not be NULL.
 * @returns the parsed `int`.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_atof
 * @sa SDL_strtol
 * @sa SDL_strtoul
 * @sa SDL_strtoll
 * @sa SDL_strtoull
 * @sa SDL_strtod
 * @sa SDL_itoa
 *
 * @from SDL_stdinc.h:3616 int SDL_atoi(const char *str);
 */
export function atoi(str: string): number {
  return lib.symbols.SDL_atoi(_p.toCstr(str));
}

/**
 * Parse a `double` from a string.
 *
 * The result of calling `SDL_atof(str)` is equivalent to `SDL_strtod(str,
 * NULL)`.
 *
 * @param str The null-terminated string to read. Must not be NULL.
 * @returns the parsed `double`.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_atoi
 * @sa SDL_strtol
 * @sa SDL_strtoul
 * @sa SDL_strtoll
 * @sa SDL_strtoull
 * @sa SDL_strtod
 *
 * @from SDL_stdinc.h:3638 double SDL_atof(const char *str);
 */
export function atof(str: string): number {
  return lib.symbols.SDL_atof(_p.toCstr(str));
}

/**
 * Parse a `long` from a string.
 *
 * If `str` starts with whitespace, then those whitespace characters are
 * skipped before attempting to parse the number.
 *
 * If the parsed number does not fit inside a `long`, the result is clamped to
 * the minimum and maximum representable `long` values.
 *
 * @param str The null-terminated string to read. Must not be NULL.
 * @param endp If not NULL, the address of the first invalid character (i.e.
 *             the next character after the parsed number) will be written to
 *             this pointer.
 * @param base The base of the integer to read. Supported values are 0 and 2
 *             to 36 inclusive. If 0, the base will be inferred from the
 *             number's prefix (0x for hexadecimal, 0 for octal, decimal
 *             otherwise).
 * @returns the parsed `long`, or 0 if no number could be parsed.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_atoi
 * @sa SDL_atof
 * @sa SDL_strtoul
 * @sa SDL_strtoll
 * @sa SDL_strtoull
 * @sa SDL_strtod
 * @sa SDL_ltoa
 * @sa SDL_wcstol
 *
 * @from SDL_stdinc.h:3672 long SDL_strtol(const char *str, char **endp, int base);
 */
export function strtol(str: string, base: number): string {
  if(!lib.symbols.SDL_strtol(_p.toCstr(str), _p.ptr.p0, base))
    throw new Error(`SDL_strtol: ${_p.getCstr2(lib.symbols.SDL_GetError())}`);
  return _p.ptr.v0;
}

/**
 * Parse an `unsigned long` from a string.
 *
 * If `str` starts with whitespace, then those whitespace characters are
 * skipped before attempting to parse the number.
 *
 * If the parsed number does not fit inside an `unsigned long`, the result is
 * clamped to the maximum representable `unsigned long` value.
 *
 * @param str The null-terminated string to read. Must not be NULL.
 * @param endp If not NULL, the address of the first invalid character (i.e.
 *             the next character after the parsed number) will be written to
 *             this pointer.
 * @param base The base of the integer to read. Supported values are 0 and 2
 *             to 36 inclusive. If 0, the base will be inferred from the
 *             number's prefix (0x for hexadecimal, 0 for octal, decimal
 *             otherwise).
 * @returns the parsed `unsigned long`, or 0 if no number could be parsed.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_atoi
 * @sa SDL_atof
 * @sa SDL_strtol
 * @sa SDL_strtoll
 * @sa SDL_strtoull
 * @sa SDL_strtod
 * @sa SDL_ultoa
 *
 * @from SDL_stdinc.h:3705 unsigned long SDL_strtoul(const char *str, char **endp, int base);
 */
export function strtoul(str: string, base: number): string {
  if(!lib.symbols.SDL_strtoul(_p.toCstr(str), _p.ptr.p0, base))
    throw new Error(`SDL_strtoul: ${_p.getCstr2(lib.symbols.SDL_GetError())}`);
  return _p.ptr.v0;
}

/**
 * Parse a `long long` from a string.
 *
 * If `str` starts with whitespace, then those whitespace characters are
 * skipped before attempting to parse the number.
 *
 * If the parsed number does not fit inside a `long long`, the result is
 * clamped to the minimum and maximum representable `long long` values.
 *
 * @param str The null-terminated string to read. Must not be NULL.
 * @param endp If not NULL, the address of the first invalid character (i.e.
 *             the next character after the parsed number) will be written to
 *             this pointer.
 * @param base The base of the integer to read. Supported values are 0 and 2
 *             to 36 inclusive. If 0, the base will be inferred from the
 *             number's prefix (0x for hexadecimal, 0 for octal, decimal
 *             otherwise).
 * @returns the parsed `long long`, or 0 if no number could be parsed.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_atoi
 * @sa SDL_atof
 * @sa SDL_strtol
 * @sa SDL_strtoul
 * @sa SDL_strtoull
 * @sa SDL_strtod
 * @sa SDL_lltoa
 *
 * @from SDL_stdinc.h:3740 long long SDL_strtoll(const char *str, char **endp, int base);
 */
export function strtoll(str: string, base: number): string {
  if(!lib.symbols.SDL_strtoll(_p.toCstr(str), _p.ptr.p0, base))
    throw new Error(`SDL_strtoll: ${_p.getCstr2(lib.symbols.SDL_GetError())}`);
  return _p.ptr.v0;
}

/**
 * Parse an `unsigned long long` from a string.
 *
 * If `str` starts with whitespace, then those whitespace characters are
 * skipped before attempting to parse the number.
 *
 * If the parsed number does not fit inside an `unsigned long long`, the
 * result is clamped to the maximum representable `unsigned long long` value.
 *
 * @param str The null-terminated string to read. Must not be NULL.
 * @param endp If not NULL, the address of the first invalid character (i.e.
 *             the next character after the parsed number) will be written to
 *             this pointer.
 * @param base The base of the integer to read. Supported values are 0 and 2
 *             to 36 inclusive. If 0, the base will be inferred from the
 *             number's prefix (0x for hexadecimal, 0 for octal, decimal
 *             otherwise).
 * @returns the parsed `unsigned long long`, or 0 if no number could be
 *          parsed.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_atoi
 * @sa SDL_atof
 * @sa SDL_strtol
 * @sa SDL_strtoll
 * @sa SDL_strtoul
 * @sa SDL_strtod
 * @sa SDL_ulltoa
 *
 * @from SDL_stdinc.h:3774 unsigned long long SDL_strtoull(const char *str, char **endp, int base);
 */
export function strtoull(str: string, base: number): string {
  if(!lib.symbols.SDL_strtoull(_p.toCstr(str), _p.ptr.p0, base))
    throw new Error(`SDL_strtoull: ${_p.getCstr2(lib.symbols.SDL_GetError())}`);
  return _p.ptr.v0;
}

/**
 * Parse a `double` from a string.
 *
 * This function makes fewer guarantees than the C runtime `strtod`:
 *
 * - Only decimal notation is guaranteed to be supported. The handling of
 *   scientific and hexadecimal notation is unspecified.
 * - Whether or not INF and NAN can be parsed is unspecified.
 * - The precision of the result is unspecified.
 *
 * @param str the null-terminated string to read. Must not be NULL.
 * @param endp if not NULL, the address of the first invalid character (i.e.
 *             the next character after the parsed number) will be written to
 *             this pointer.
 * @returns the parsed `double`, or 0 if no number could be parsed.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_atoi
 * @sa SDL_atof
 * @sa SDL_strtol
 * @sa SDL_strtoll
 * @sa SDL_strtoul
 * @sa SDL_strtoull
 *
 * @from SDL_stdinc.h:3804 double SDL_strtod(const char *str, char **endp);
 */
export function strtod(str: string): string {
  if(!lib.symbols.SDL_strtod(_p.toCstr(str), _p.ptr.p0))
    throw new Error(`SDL_strtod: ${_p.getCstr2(lib.symbols.SDL_GetError())}`);
  return _p.ptr.v0;
}

/**
 * Compare two null-terminated UTF-8 strings.
 *
 * Due to the nature of UTF-8 encoding, this will work with Unicode strings,
 * since effectively this function just compares bytes until it hits a
 * null-terminating character. Also due to the nature of UTF-8, this can be
 * used with SDL_qsort() to put strings in (roughly) alphabetical order.
 *
 * @param str1 the first string to compare. NULL is not permitted!
 * @param str2 the second string to compare. NULL is not permitted!
 * @returns less than zero if str1 is "less than" str2, greater than zero if
 *          str1 is "greater than" str2, and zero if the strings match
 *          exactly.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_stdinc.h:3824 int SDL_strcmp(const char *str1, const char *str2);
 */
export function strcmp(str1: string, str2: string): number {
  return lib.symbols.SDL_strcmp(_p.toCstr(str1), _p.toCstr(str2));
}

/**
 * Compare two UTF-8 strings up to a number of bytes.
 *
 * Due to the nature of UTF-8 encoding, this will work with Unicode strings,
 * since effectively this function just compares bytes until it hits a
 * null-terminating character. Also due to the nature of UTF-8, this can be
 * used with SDL_qsort() to put strings in (roughly) alphabetical order.
 *
 * Note that while this function is intended to be used with UTF-8, it is
 * doing a bytewise comparison, and `maxlen` specifies a _byte_ limit! If the
 * limit lands in the middle of a multi-byte UTF-8 sequence, it will only
 * compare a portion of the final character.
 *
 * `maxlen` specifies a maximum number of bytes to compare; if the strings
 * match to this number of bytes (or both have matched to a null-terminator
 * character before this number of bytes), they will be considered equal.
 *
 * @param str1 the first string to compare. NULL is not permitted!
 * @param str2 the second string to compare. NULL is not permitted!
 * @param maxlen the maximum number of _bytes_ to compare.
 * @returns less than zero if str1 is "less than" str2, greater than zero if
 *          str1 is "greater than" str2, and zero if the strings match
 *          exactly.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_stdinc.h:3854 int SDL_strncmp(const char *str1, const char *str2, size_t maxlen);
 */
export function strncmp(str1: string, str2: string, maxlen: bigint): number {
  return lib.symbols.SDL_strncmp(_p.toCstr(str1), _p.toCstr(str2), maxlen);
}

/**
 * Compare two null-terminated UTF-8 strings, case-insensitively.
 *
 * This will work with Unicode strings, using a technique called
 * "case-folding" to handle the vast majority of case-sensitive human
 * languages regardless of system locale. It can deal with expanding values: a
 * German Eszett character can compare against two ASCII 's' chars and be
 * considered a match, for example. A notable exception: it does not handle
 * the Turkish 'i' character; human language is complicated!
 *
 * Since this handles Unicode, it expects the string to be well-formed UTF-8
 * and not a null-terminated string of arbitrary bytes. Bytes that are not
 * valid UTF-8 are treated as Unicode character U+FFFD (REPLACEMENT
 * CHARACTER), which is to say two strings of random bits may turn out to
 * match if they convert to the same amount of replacement characters.
 *
 * @param str1 the first string to compare. NULL is not permitted!
 * @param str2 the second string to compare. NULL is not permitted!
 * @returns less than zero if str1 is "less than" str2, greater than zero if
 *          str1 is "greater than" str2, and zero if the strings match
 *          exactly.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_stdinc.h:3882 int SDL_strcasecmp(const char *str1, const char *str2);
 */
export function strcasecmp(str1: string, str2: string): number {
  return lib.symbols.SDL_strcasecmp(_p.toCstr(str1), _p.toCstr(str2));
}

/**
 * Compare two UTF-8 strings, case-insensitively, up to a number of bytes.
 *
 * This will work with Unicode strings, using a technique called
 * "case-folding" to handle the vast majority of case-sensitive human
 * languages regardless of system locale. It can deal with expanding values: a
 * German Eszett character can compare against two ASCII 's' chars and be
 * considered a match, for example. A notable exception: it does not handle
 * the Turkish 'i' character; human language is complicated!
 *
 * Since this handles Unicode, it expects the string to be well-formed UTF-8
 * and not a null-terminated string of arbitrary bytes. Bytes that are not
 * valid UTF-8 are treated as Unicode character U+FFFD (REPLACEMENT
 * CHARACTER), which is to say two strings of random bits may turn out to
 * match if they convert to the same amount of replacement characters.
 *
 * Note that while this function is intended to be used with UTF-8, `maxlen`
 * specifies a _byte_ limit! If the limit lands in the middle of a multi-byte
 * UTF-8 sequence, it may convert a portion of the final character to one or
 * more Unicode character U+FFFD (REPLACEMENT CHARACTER) so as not to overflow
 * a buffer.
 *
 * `maxlen` specifies a maximum number of bytes to compare; if the strings
 * match to this number of bytes (or both have matched to a null-terminator
 * character before this number of bytes), they will be considered equal.
 *
 * @param str1 the first string to compare. NULL is not permitted!
 * @param str2 the second string to compare. NULL is not permitted!
 * @param maxlen the maximum number of bytes to compare.
 * @returns less than zero if str1 is "less than" str2, greater than zero if
 *          str1 is "greater than" str2, and zero if the strings match
 *          exactly.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_stdinc.h:3922 int SDL_strncasecmp(const char *str1, const char *str2, size_t maxlen);
 */
export function strncasecmp(str1: string, str2: string, maxlen: bigint): number {
  return lib.symbols.SDL_strncasecmp(_p.toCstr(str1), _p.toCstr(str2), maxlen);
}

/**
 * Searches a string for the first occurrence of any character contained in a
 * breakset, and returns a pointer from the string to that character.
 *
 * @param str The null-terminated string to be searched. Must not be NULL, and
 *            must not overlap with `breakset`.
 * @param breakset A null-terminated string containing the list of characters
 *                 to look for. Must not be NULL, and must not overlap with
 *                 `str`.
 * @returns A pointer to the location, in str, of the first occurrence of a
 *          character present in the breakset, or NULL if none is found.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_stdinc.h:3940 char * SDL_strpbrk(const char *str, const char *breakset);
 */
export function strpbrk(str: string, breakset: string): string {
  return _p.getCstr2(lib.symbols.SDL_strpbrk(_p.toCstr(str), _p.toCstr(breakset)));
}

/**
 * Decode a UTF-8 string, one Unicode codepoint at a time.
 *
 * This will return the first Unicode codepoint in the UTF-8 encoded string in
 * `*pstr`, and then advance `*pstr` past any consumed bytes before returning.
 *
 * It will not access more than `*pslen` bytes from the string. `*pslen` will
 * be adjusted, as well, subtracting the number of bytes consumed.
 *
 * `pslen` is allowed to be NULL, in which case the string _must_ be
 * NULL-terminated, as the function will blindly read until it sees the NULL
 * char.
 *
 * if `*pslen` is zero, it assumes the end of string is reached and returns a
 * zero codepoint regardless of the contents of the string buffer.
 *
 * If the resulting codepoint is zero (a NULL terminator), or `*pslen` is
 * zero, it will not advance `*pstr` or `*pslen` at all.
 *
 * Generally this function is called in a loop until it returns zero,
 * adjusting its parameters each iteration.
 *
 * If an invalid UTF-8 sequence is encountered, this function returns
 * SDL_INVALID_UNICODE_CODEPOINT and advances the string/length by one byte
 * (which is to say, a multibyte sequence might produce several
 * SDL_INVALID_UNICODE_CODEPOINT returns before it syncs to the next valid
 * UTF-8 sequence).
 *
 * Several things can generate invalid UTF-8 sequences, including overlong
 * encodings, the use of UTF-16 surrogate values, and truncated data. Please
 * refer to
 * [RFC3629](https://www.ietf.org/rfc/rfc3629.txt)
 * for details.
 *
 * @param pstr a pointer to a UTF-8 string pointer to be read and adjusted.
 * @param pslen a pointer to the number of bytes in the string, to be read and
 *              adjusted. NULL is allowed.
 * @returns the first Unicode codepoint in the string.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_stdinc.h:4000 Uint32 SDL_StepUTF8(const char **pstr, size_t *pslen);
 */
export function stepUtf8(pstr: Deno.PointerValue): bigint {
  if(!lib.symbols.SDL_StepUTF8(pstr, _p.u64.p0))
    throw new Error(`SDL_StepUTF8: ${_p.getCstr2(lib.symbols.SDL_GetError())}`);
  return _p.u64.v0;
}

/**
 * Decode a UTF-8 string in reverse, one Unicode codepoint at a time.
 *
 * This will go to the start of the previous Unicode codepoint in the string,
 * move `*pstr` to that location and return that codepoint.
 *
 * If `*pstr` is already at the start of the string), it will not advance
 * `*pstr` at all.
 *
 * Generally this function is called in a loop until it returns zero,
 * adjusting its parameter each iteration.
 *
 * If an invalid UTF-8 sequence is encountered, this function returns
 * SDL_INVALID_UNICODE_CODEPOINT.
 *
 * Several things can generate invalid UTF-8 sequences, including overlong
 * encodings, the use of UTF-16 surrogate values, and truncated data. Please
 * refer to
 * [RFC3629](https://www.ietf.org/rfc/rfc3629.txt)
 * for details.
 *
 * @param start a pointer to the beginning of the UTF-8 string.
 * @param pstr a pointer to a UTF-8 string pointer to be read and adjusted.
 * @returns the previous Unicode codepoint in the string.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_stdinc.h:4031 Uint32 SDL_StepBackUTF8(const char *start, const char **pstr);
 */
export function stepBackUtf8(start: string, pstr: Deno.PointerValue): number {
  return lib.symbols.SDL_StepBackUTF8(_p.toCstr(start), pstr);
}

/**
 * Convert a single Unicode codepoint to UTF-8.
 *
 * The buffer pointed to by `dst` must be at least 4 bytes long, as this
 * function may generate between 1 and 4 bytes of output.
 *
 * This function returns the first byte _after_ the newly-written UTF-8
 * sequence, which is useful for encoding multiple codepoints in a loop, or
 * knowing where to write a NULL-terminator character to end the string (in
 * either case, plan to have a buffer of _more_ than 4 bytes!).
 *
 * If `codepoint` is an invalid value (outside the Unicode range, or a UTF-16
 * surrogate value, etc), this will use U+FFFD (REPLACEMENT CHARACTER) for the
 * codepoint instead, and not set an error.
 *
 * If `dst` is NULL, this returns NULL immediately without writing to the
 * pointer and without setting an error.
 *
 * @param codepoint a Unicode codepoint to convert to UTF-8.
 * @param dst the location to write the encoded UTF-8. Must point to at least
 *            4 bytes!
 * @returns the first byte past the newly-written UTF-8 sequence.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_stdinc.h:4060 char * SDL_UCS4ToUTF8(Uint32 codepoint, char *dst);
 */
export function ucs4ToUtf8(codepoint: number): { dst: string; ret: string } {
  const ret = lib.symbols.SDL_UCS4ToUTF8(codepoint, _p.cstr.p0) as string;
  if(!ret) throw new Error(`SDL_UCS4ToUTF8: ${_p.getCstr2(lib.symbols.SDL_GetError())}`);
  return { dst: _p.cstr.v0, ret };
}

/**
 * Seeds the pseudo-random number generator.
 *
 * Reusing the seed number will cause SDL_rand() to repeat the same stream of
 * 'random' numbers.
 *
 * @param seed the value to use as a random number seed, or 0 to use
 *             SDL_GetPerformanceCounter().
 *
 * @threadsafety This should be called on the same thread that calls
 *               SDL_rand()
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_rand
 * @sa SDL_rand_bits
 * @sa SDL_randf
 *
 * @from SDL_stdinc.h:4272 void SDL_srand(Uint64 seed);
 */
export function srand(seed: bigint): void {
  return lib.symbols.SDL_srand(seed);
}

/**
 * Generate a pseudo-random number less than n for positive n
 *
 * The method used is faster and of better quality than `rand() % n`. Odds are
 * roughly 99.9% even for n = 1 million. Evenness is better for smaller n, and
 * much worse as n gets bigger.
 *
 * Example: to simulate a d6 use `SDL_rand(6) + 1` The +1 converts 0..5 to
 * 1..6
 *
 * If you want to generate a pseudo-random number in the full range of Sint32,
 * you should use: (Sint32)SDL_rand_bits()
 *
 * If you want reproducible output, be sure to initialize with SDL_srand()
 * first.
 *
 * There are no guarantees as to the quality of the random sequence produced,
 * and this should not be used for security (cryptography, passwords) or where
 * money is on the line (loot-boxes, casinos). There are many random number
 * libraries available with different characteristics and you should pick one
 * of those to meet any serious needs.
 *
 * @param n the number of possible outcomes. n must be positive.
 * @returns a random value in the range of [0 .. n-1].
 *
 * @threadsafety All calls should be made from a single thread
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_srand
 * @sa SDL_randf
 *
 * @from SDL_stdinc.h:4306 Sint32 SDL_rand(Sint32 n);
 */
export function rand(n: number): number {
  return lib.symbols.SDL_rand(n);
}

/**
 * Generate a uniform pseudo-random floating point number less than 1.0
 *
 * If you want reproducible output, be sure to initialize with SDL_srand()
 * first.
 *
 * There are no guarantees as to the quality of the random sequence produced,
 * and this should not be used for security (cryptography, passwords) or where
 * money is on the line (loot-boxes, casinos). There are many random number
 * libraries available with different characteristics and you should pick one
 * of those to meet any serious needs.
 *
 * @returns a random value in the range of [0.0, 1.0).
 *
 * @threadsafety All calls should be made from a single thread
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_srand
 * @sa SDL_rand
 *
 * @from SDL_stdinc.h:4329 float SDL_randf(void);
 */
export function randf(): number {
  return lib.symbols.SDL_randf();
}

/**
 * Generate 32 pseudo-random bits.
 *
 * You likely want to use SDL_rand() to get a psuedo-random number instead.
 *
 * There are no guarantees as to the quality of the random sequence produced,
 * and this should not be used for security (cryptography, passwords) or where
 * money is on the line (loot-boxes, casinos). There are many random number
 * libraries available with different characteristics and you should pick one
 * of those to meet any serious needs.
 *
 * @returns a random value in the range of [0-SDL_MAX_UINT32].
 *
 * @threadsafety All calls should be made from a single thread
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_rand
 * @sa SDL_randf
 * @sa SDL_srand
 *
 * @from SDL_stdinc.h:4352 Uint32 SDL_rand_bits(void);
 */
export function randBits(): number {
  return lib.symbols.SDL_rand_bits();
}

/**
 * Generate a pseudo-random number less than n for positive n
 *
 * The method used is faster and of better quality than `rand() % n`. Odds are
 * roughly 99.9% even for n = 1 million. Evenness is better for smaller n, and
 * much worse as n gets bigger.
 *
 * Example: to simulate a d6 use `SDL_rand_r(state, 6) + 1` The +1 converts
 * 0..5 to 1..6
 *
 * If you want to generate a pseudo-random number in the full range of Sint32,
 * you should use: (Sint32)SDL_rand_bits_r(state)
 *
 * There are no guarantees as to the quality of the random sequence produced,
 * and this should not be used for security (cryptography, passwords) or where
 * money is on the line (loot-boxes, casinos). There are many random number
 * libraries available with different characteristics and you should pick one
 * of those to meet any serious needs.
 *
 * @param state a pointer to the current random number state, this may not be
 *              NULL.
 * @param n the number of possible outcomes. n must be positive.
 * @returns a random value in the range of [0 .. n-1].
 *
 * @threadsafety This function is thread-safe, as long as the state pointer
 *               isn't shared between threads.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_rand
 * @sa SDL_rand_bits_r
 * @sa SDL_randf_r
 *
 * @from SDL_stdinc.h:4387 Sint32 SDL_rand_r(Uint64 *state, Sint32 n);
 */
export function randR(n: number): bigint {
  if(!lib.symbols.SDL_rand_r(_p.u64.p0, n))
    throw new Error(`SDL_rand_r: ${_p.getCstr2(lib.symbols.SDL_GetError())}`);
  return _p.u64.v0;
}

/**
 * Generate a uniform pseudo-random floating point number less than 1.0
 *
 * If you want reproducible output, be sure to initialize with SDL_srand()
 * first.
 *
 * There are no guarantees as to the quality of the random sequence produced,
 * and this should not be used for security (cryptography, passwords) or where
 * money is on the line (loot-boxes, casinos). There are many random number
 * libraries available with different characteristics and you should pick one
 * of those to meet any serious needs.
 *
 * @param state a pointer to the current random number state, this may not be
 *              NULL.
 * @returns a random value in the range of [0.0, 1.0).
 *
 * @threadsafety This function is thread-safe, as long as the state pointer
 *               isn't shared between threads.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_rand_bits_r
 * @sa SDL_rand_r
 * @sa SDL_randf
 *
 * @from SDL_stdinc.h:4414 float SDL_randf_r(Uint64 *state);
 */
export function randfR(): bigint {
  if(!lib.symbols.SDL_randf_r(_p.u64.p0))
    throw new Error(`SDL_randf_r: ${_p.getCstr2(lib.symbols.SDL_GetError())}`);
  return _p.u64.v0;
}

/**
 * Generate 32 pseudo-random bits.
 *
 * You likely want to use SDL_rand_r() to get a psuedo-random number instead.
 *
 * There are no guarantees as to the quality of the random sequence produced,
 * and this should not be used for security (cryptography, passwords) or where
 * money is on the line (loot-boxes, casinos). There are many random number
 * libraries available with different characteristics and you should pick one
 * of those to meet any serious needs.
 *
 * @param state a pointer to the current random number state, this may not be
 *              NULL.
 * @returns a random value in the range of [0-SDL_MAX_UINT32].
 *
 * @threadsafety This function is thread-safe, as long as the state pointer
 *               isn't shared between threads.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_rand_r
 * @sa SDL_randf_r
 *
 * @from SDL_stdinc.h:4439 Uint32 SDL_rand_bits_r(Uint64 *state);
 */
export function randBitsR(): bigint {
  if(!lib.symbols.SDL_rand_bits_r(_p.u64.p0))
    throw new Error(`SDL_rand_bits_r: ${_p.getCstr2(lib.symbols.SDL_GetError())}`);
  return _p.u64.v0;
}

/**
 * Compute the arc cosine of `x`.
 *
 * The definition of `y = acos(x)` is `x = cos(y)`.
 *
 * Domain: `-1 <= x <= 1`
 *
 * Range: `0 <= y <= Pi`
 *
 * This function operates on double-precision floating point values, use
 * SDL_acosf for single-precision floats.
 *
 * This function may use a different approximation across different versions,
 * platforms and configurations. i.e, it can return a different value given
 * the same input on different machines or operating systems, or if SDL is
 * updated.
 *
 * @param x floating point value.
 * @returns arc cosine of `x`, in radians.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_acosf
 * @sa SDL_asin
 * @sa SDL_cos
 *
 * @from SDL_stdinc.h:4493 double SDL_acos(double x);
 */
export function acos(x: number): number {
  return lib.symbols.SDL_acos(x);
}

/**
 * Compute the arc cosine of `x`.
 *
 * The definition of `y = acos(x)` is `x = cos(y)`.
 *
 * Domain: `-1 <= x <= 1`
 *
 * Range: `0 <= y <= Pi`
 *
 * This function operates on single-precision floating point values, use
 * SDL_acos for double-precision floats.
 *
 * This function may use a different approximation across different versions,
 * platforms and configurations. i.e, it can return a different value given
 * the same input on different machines or operating systems, or if SDL is
 * updated.
 *
 * @param x floating point value.
 * @returns arc cosine of `x`, in radians.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_acos
 * @sa SDL_asinf
 * @sa SDL_cosf
 *
 * @from SDL_stdinc.h:4523 float SDL_acosf(float x);
 */
export function acosf(x: number): number {
  return lib.symbols.SDL_acosf(x);
}

/**
 * Compute the arc sine of `x`.
 *
 * The definition of `y = asin(x)` is `x = sin(y)`.
 *
 * Domain: `-1 <= x <= 1`
 *
 * Range: `-Pi/2 <= y <= Pi/2`
 *
 * This function operates on double-precision floating point values, use
 * SDL_asinf for single-precision floats.
 *
 * This function may use a different approximation across different versions,
 * platforms and configurations. i.e, it can return a different value given
 * the same input on different machines or operating systems, or if SDL is
 * updated.
 *
 * @param x floating point value.
 * @returns arc sine of `x`, in radians.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_asinf
 * @sa SDL_acos
 * @sa SDL_sin
 *
 * @from SDL_stdinc.h:4553 double SDL_asin(double x);
 */
export function asin(x: number): number {
  return lib.symbols.SDL_asin(x);
}

/**
 * Compute the arc sine of `x`.
 *
 * The definition of `y = asin(x)` is `x = sin(y)`.
 *
 * Domain: `-1 <= x <= 1`
 *
 * Range: `-Pi/2 <= y <= Pi/2`
 *
 * This function operates on single-precision floating point values, use
 * SDL_asin for double-precision floats.
 *
 * This function may use a different approximation across different versions,
 * platforms and configurations. i.e, it can return a different value given
 * the same input on different machines or operating systems, or if SDL is
 * updated.
 *
 * @param x floating point value.
 * @returns arc sine of `x`, in radians.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_asin
 * @sa SDL_acosf
 * @sa SDL_sinf
 *
 * @from SDL_stdinc.h:4583 float SDL_asinf(float x);
 */
export function asinf(x: number): number {
  return lib.symbols.SDL_asinf(x);
}

/**
 * Compute the arc tangent of `x`.
 *
 * The definition of `y = atan(x)` is `x = tan(y)`.
 *
 * Domain: `-INF <= x <= INF`
 *
 * Range: `-Pi/2 <= y <= Pi/2`
 *
 * This function operates on double-precision floating point values, use
 * SDL_atanf for single-precision floats.
 *
 * To calculate the arc tangent of y / x, use SDL_atan2.
 *
 * This function may use a different approximation across different versions,
 * platforms and configurations. i.e, it can return a different value given
 * the same input on different machines or operating systems, or if SDL is
 * updated.
 *
 * @param x floating point value.
 * @returns arc tangent of of `x` in radians, or 0 if `x = 0`.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_atanf
 * @sa SDL_atan2
 * @sa SDL_tan
 *
 * @from SDL_stdinc.h:4615 double SDL_atan(double x);
 */
export function atan(x: number): number {
  return lib.symbols.SDL_atan(x);
}

/**
 * Compute the arc tangent of `x`.
 *
 * The definition of `y = atan(x)` is `x = tan(y)`.
 *
 * Domain: `-INF <= x <= INF`
 *
 * Range: `-Pi/2 <= y <= Pi/2`
 *
 * This function operates on single-precision floating point values, use
 * SDL_atan for dboule-precision floats.
 *
 * To calculate the arc tangent of y / x, use SDL_atan2f.
 *
 * This function may use a different approximation across different versions,
 * platforms and configurations. i.e, it can return a different value given
 * the same input on different machines or operating systems, or if SDL is
 * updated.
 *
 * @param x floating point value.
 * @returns arc tangent of of `x` in radians, or 0 if `x = 0`.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_atan
 * @sa SDL_atan2f
 * @sa SDL_tanf
 *
 * @from SDL_stdinc.h:4647 float SDL_atanf(float x);
 */
export function atanf(x: number): number {
  return lib.symbols.SDL_atanf(x);
}

/**
 * Compute the arc tangent of `y / x`, using the signs of x and y to adjust
 * the result's quadrant.
 *
 * The definition of `z = atan2(x, y)` is `y = x tan(z)`, where the quadrant
 * of z is determined based on the signs of x and y.
 *
 * Domain: `-INF <= x <= INF`, `-INF <= y <= INF`
 *
 * Range: `-Pi <= y <= Pi`
 *
 * This function operates on double-precision floating point values, use
 * SDL_atan2f for single-precision floats.
 *
 * To calculate the arc tangent of a single value, use SDL_atan.
 *
 * This function may use a different approximation across different versions,
 * platforms and configurations. i.e, it can return a different value given
 * the same input on different machines or operating systems, or if SDL is
 * updated.
 *
 * @param y floating point value of the numerator (y coordinate).
 * @param x floating point value of the denominator (x coordinate).
 * @returns arc tangent of of `y / x` in radians, or, if `x = 0`, either
 *          `-Pi/2`, `0`, or `Pi/2`, depending on the value of `y`.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_atan2f
 * @sa SDL_atan
 * @sa SDL_tan
 *
 * @from SDL_stdinc.h:4683 double SDL_atan2(double y, double x);
 */
export function atan2(y: number, x: number): number {
  return lib.symbols.SDL_atan2(y, x);
}

/**
 * Compute the arc tangent of `y / x`, using the signs of x and y to adjust
 * the result's quadrant.
 *
 * The definition of `z = atan2(x, y)` is `y = x tan(z)`, where the quadrant
 * of z is determined based on the signs of x and y.
 *
 * Domain: `-INF <= x <= INF`, `-INF <= y <= INF`
 *
 * Range: `-Pi <= y <= Pi`
 *
 * This function operates on single-precision floating point values, use
 * SDL_atan2 for double-precision floats.
 *
 * To calculate the arc tangent of a single value, use SDL_atanf.
 *
 * This function may use a different approximation across different versions,
 * platforms and configurations. i.e, it can return a different value given
 * the same input on different machines or operating systems, or if SDL is
 * updated.
 *
 * @param y floating point value of the numerator (y coordinate).
 * @param x floating point value of the denominator (x coordinate).
 * @returns arc tangent of of `y / x` in radians, or, if `x = 0`, either
 *          `-Pi/2`, `0`, or `Pi/2`, depending on the value of `y`.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_atan2
 * @sa SDL_atan
 * @sa SDL_tan
 *
 * @from SDL_stdinc.h:4719 float SDL_atan2f(float y, float x);
 */
export function atan2F(y: number, x: number): number {
  return lib.symbols.SDL_atan2f(y, x);
}

/**
 * Compute the ceiling of `x`.
 *
 * The ceiling of `x` is the smallest integer `y` such that `y > x`, i.e `x`
 * rounded up to the nearest integer.
 *
 * Domain: `-INF <= x <= INF`
 *
 * Range: `-INF <= y <= INF`, y integer
 *
 * This function operates on double-precision floating point values, use
 * SDL_ceilf for single-precision floats.
 *
 * @param x floating point value.
 * @returns the ceiling of `x`.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_ceilf
 * @sa SDL_floor
 * @sa SDL_trunc
 * @sa SDL_round
 * @sa SDL_lround
 *
 * @from SDL_stdinc.h:4747 double SDL_ceil(double x);
 */
export function ceil(x: number): number {
  return lib.symbols.SDL_ceil(x);
}

/**
 * Compute the ceiling of `x`.
 *
 * The ceiling of `x` is the smallest integer `y` such that `y > x`, i.e `x`
 * rounded up to the nearest integer.
 *
 * Domain: `-INF <= x <= INF`
 *
 * Range: `-INF <= y <= INF`, y integer
 *
 * This function operates on single-precision floating point values, use
 * SDL_ceil for double-precision floats.
 *
 * @param x floating point value.
 * @returns the ceiling of `x`.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_ceil
 * @sa SDL_floorf
 * @sa SDL_truncf
 * @sa SDL_roundf
 * @sa SDL_lroundf
 *
 * @from SDL_stdinc.h:4775 float SDL_ceilf(float x);
 */
export function ceilf(x: number): number {
  return lib.symbols.SDL_ceilf(x);
}

/**
 * Copy the sign of one floating-point value to another.
 *
 * The definition of copysign is that ``copysign(x, y) = abs(x) * sign(y)``.
 *
 * Domain: `-INF <= x <= INF`, ``-INF <= y <= f``
 *
 * Range: `-INF <= z <= INF`
 *
 * This function operates on double-precision floating point values, use
 * SDL_copysignf for single-precision floats.
 *
 * @param x floating point value to use as the magnitude.
 * @param y floating point value to use as the sign.
 * @returns the floating point value with the sign of y and the magnitude of
 *          x.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_copysignf
 * @sa SDL_fabs
 *
 * @from SDL_stdinc.h:4801 double SDL_copysign(double x, double y);
 */
export function copysign(x: number, y: number): number {
  return lib.symbols.SDL_copysign(x, y);
}

/**
 * Copy the sign of one floating-point value to another.
 *
 * The definition of copysign is that ``copysign(x, y) = abs(x) * sign(y)``.
 *
 * Domain: `-INF <= x <= INF`, ``-INF <= y <= f``
 *
 * Range: `-INF <= z <= INF`
 *
 * This function operates on single-precision floating point values, use
 * SDL_copysign for double-precision floats.
 *
 * @param x floating point value to use as the magnitude.
 * @param y floating point value to use as the sign.
 * @returns the floating point value with the sign of y and the magnitude of
 *          x.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_copysign
 * @sa SDL_fabsf
 *
 * @from SDL_stdinc.h:4827 float SDL_copysignf(float x, float y);
 */
export function copysignf(x: number, y: number): number {
  return lib.symbols.SDL_copysignf(x, y);
}

/**
 * Compute the cosine of `x`.
 *
 * Domain: `-INF <= x <= INF`
 *
 * Range: `-1 <= y <= 1`
 *
 * This function operates on double-precision floating point values, use
 * SDL_cosf for single-precision floats.
 *
 * This function may use a different approximation across different versions,
 * platforms and configurations. i.e, it can return a different value given
 * the same input on different machines or operating systems, or if SDL is
 * updated.
 *
 * @param x floating point value, in radians.
 * @returns cosine of `x`.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_cosf
 * @sa SDL_acos
 * @sa SDL_sin
 *
 * @from SDL_stdinc.h:4855 double SDL_cos(double x);
 */
export function cos(x: number): number {
  return lib.symbols.SDL_cos(x);
}

/**
 * Compute the cosine of `x`.
 *
 * Domain: `-INF <= x <= INF`
 *
 * Range: `-1 <= y <= 1`
 *
 * This function operates on single-precision floating point values, use
 * SDL_cos for double-precision floats.
 *
 * This function may use a different approximation across different versions,
 * platforms and configurations. i.e, it can return a different value given
 * the same input on different machines or operating systems, or if SDL is
 * updated.
 *
 * @param x floating point value, in radians.
 * @returns cosine of `x`.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_cos
 * @sa SDL_acosf
 * @sa SDL_sinf
 *
 * @from SDL_stdinc.h:4883 float SDL_cosf(float x);
 */
export function cosf(x: number): number {
  return lib.symbols.SDL_cosf(x);
}

/**
 * Compute the exponential of `x`.
 *
 * The definition of `y = exp(x)` is `y = e^x`, where `e` is the base of the
 * natural logarithm. The inverse is the natural logarithm, SDL_log.
 *
 * Domain: `-INF <= x <= INF`
 *
 * Range: `0 <= y <= INF`
 *
 * The output will overflow if `exp(x)` is too large to be represented.
 *
 * This function operates on double-precision floating point values, use
 * SDL_expf for single-precision floats.
 *
 * This function may use a different approximation across different versions,
 * platforms and configurations. i.e, it can return a different value given
 * the same input on different machines or operating systems, or if SDL is
 * updated.
 *
 * @param x floating point value.
 * @returns value of `e^x`.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_expf
 * @sa SDL_log
 *
 * @from SDL_stdinc.h:4915 double SDL_exp(double x);
 */
export function exp(x: number): number {
  return lib.symbols.SDL_exp(x);
}

/**
 * Compute the exponential of `x`.
 *
 * The definition of `y = exp(x)` is `y = e^x`, where `e` is the base of the
 * natural logarithm. The inverse is the natural logarithm, SDL_logf.
 *
 * Domain: `-INF <= x <= INF`
 *
 * Range: `0 <= y <= INF`
 *
 * The output will overflow if `exp(x)` is too large to be represented.
 *
 * This function operates on single-precision floating point values, use
 * SDL_exp for double-precision floats.
 *
 * This function may use a different approximation across different versions,
 * platforms and configurations. i.e, it can return a different value given
 * the same input on different machines or operating systems, or if SDL is
 * updated.
 *
 * @param x floating point value.
 * @returns value of `e^x`.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_exp
 * @sa SDL_logf
 *
 * @from SDL_stdinc.h:4947 float SDL_expf(float x);
 */
export function expf(x: number): number {
  return lib.symbols.SDL_expf(x);
}

/**
 * Compute the absolute value of `x`
 *
 * Domain: `-INF <= x <= INF`
 *
 * Range: `0 <= y <= INF`
 *
 * This function operates on double-precision floating point values, use
 * SDL_fabsf for single-precision floats.
 *
 * @param x floating point value to use as the magnitude.
 * @returns the absolute value of `x`.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_fabsf
 *
 * @from SDL_stdinc.h:4968 double SDL_fabs(double x);
 */
export function fabs(x: number): number {
  return lib.symbols.SDL_fabs(x);
}

/**
 * Compute the absolute value of `x`
 *
 * Domain: `-INF <= x <= INF`
 *
 * Range: `0 <= y <= INF`
 *
 * This function operates on single-precision floating point values, use
 * SDL_fabs for double-precision floats.
 *
 * @param x floating point value to use as the magnitude.
 * @returns the absolute value of `x`.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_fabs
 *
 * @from SDL_stdinc.h:4989 float SDL_fabsf(float x);
 */
export function fabsf(x: number): number {
  return lib.symbols.SDL_fabsf(x);
}

/**
 * Compute the floor of `x`.
 *
 * The floor of `x` is the largest integer `y` such that `y > x`, i.e `x`
 * rounded down to the nearest integer.
 *
 * Domain: `-INF <= x <= INF`
 *
 * Range: `-INF <= y <= INF`, y integer
 *
 * This function operates on double-precision floating point values, use
 * SDL_floorf for single-precision floats.
 *
 * @param x floating point value.
 * @returns the floor of `x`.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_floorf
 * @sa SDL_ceil
 * @sa SDL_trunc
 * @sa SDL_round
 * @sa SDL_lround
 *
 * @from SDL_stdinc.h:5017 double SDL_floor(double x);
 */
export function floor(x: number): number {
  return lib.symbols.SDL_floor(x);
}

/**
 * Compute the floor of `x`.
 *
 * The floor of `x` is the largest integer `y` such that `y > x`, i.e `x`
 * rounded down to the nearest integer.
 *
 * Domain: `-INF <= x <= INF`
 *
 * Range: `-INF <= y <= INF`, y integer
 *
 * This function operates on single-precision floating point values, use
 * SDL_floor for double-precision floats.
 *
 * @param x floating point value.
 * @returns the floor of `x`.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_floor
 * @sa SDL_ceilf
 * @sa SDL_truncf
 * @sa SDL_roundf
 * @sa SDL_lroundf
 *
 * @from SDL_stdinc.h:5045 float SDL_floorf(float x);
 */
export function floorf(x: number): number {
  return lib.symbols.SDL_floorf(x);
}

/**
 * Truncate `x` to an integer.
 *
 * Rounds `x` to the next closest integer to 0. This is equivalent to removing
 * the fractional part of `x`, leaving only the integer part.
 *
 * Domain: `-INF <= x <= INF`
 *
 * Range: `-INF <= y <= INF`, y integer
 *
 * This function operates on double-precision floating point values, use
 * SDL_truncf for single-precision floats.
 *
 * @param x floating point value.
 * @returns `x` truncated to an integer.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_truncf
 * @sa SDL_fmod
 * @sa SDL_ceil
 * @sa SDL_floor
 * @sa SDL_round
 * @sa SDL_lround
 *
 * @from SDL_stdinc.h:5074 double SDL_trunc(double x);
 */
export function trunc(x: number): number {
  return lib.symbols.SDL_trunc(x);
}

/**
 * Truncate `x` to an integer.
 *
 * Rounds `x` to the next closest integer to 0. This is equivalent to removing
 * the fractional part of `x`, leaving only the integer part.
 *
 * Domain: `-INF <= x <= INF`
 *
 * Range: `-INF <= y <= INF`, y integer
 *
 * This function operates on single-precision floating point values, use
 * SDL_trunc for double-precision floats.
 *
 * @param x floating point value.
 * @returns `x` truncated to an integer.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_trunc
 * @sa SDL_fmodf
 * @sa SDL_ceilf
 * @sa SDL_floorf
 * @sa SDL_roundf
 * @sa SDL_lroundf
 *
 * @from SDL_stdinc.h:5103 float SDL_truncf(float x);
 */
export function truncf(x: number): number {
  return lib.symbols.SDL_truncf(x);
}

/**
 * Return the floating-point remainder of `x / y`
 *
 * Divides `x` by `y`, and returns the remainder.
 *
 * Domain: `-INF <= x <= INF`, `-INF <= y <= INF`, `y != 0`
 *
 * Range: `-y <= z <= y`
 *
 * This function operates on double-precision floating point values, use
 * SDL_fmodf for single-precision floats.
 *
 * @param x the numerator.
 * @param y the denominator. Must not be 0.
 * @returns the remainder of `x / y`.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_fmodf
 * @sa SDL_modf
 * @sa SDL_trunc
 * @sa SDL_ceil
 * @sa SDL_floor
 * @sa SDL_round
 * @sa SDL_lround
 *
 * @from SDL_stdinc.h:5133 double SDL_fmod(double x, double y);
 */
export function fmod(x: number, y: number): number {
  return lib.symbols.SDL_fmod(x, y);
}

/**
 * Return the floating-point remainder of `x / y`
 *
 * Divides `x` by `y`, and returns the remainder.
 *
 * Domain: `-INF <= x <= INF`, `-INF <= y <= INF`, `y != 0`
 *
 * Range: `-y <= z <= y`
 *
 * This function operates on single-precision floating point values, use
 * SDL_fmod for double-precision floats.
 *
 * @param x the numerator.
 * @param y the denominator. Must not be 0.
 * @returns the remainder of `x / y`.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_fmod
 * @sa SDL_truncf
 * @sa SDL_modff
 * @sa SDL_ceilf
 * @sa SDL_floorf
 * @sa SDL_roundf
 * @sa SDL_lroundf
 *
 * @from SDL_stdinc.h:5163 float SDL_fmodf(float x, float y);
 */
export function fmodf(x: number, y: number): number {
  return lib.symbols.SDL_fmodf(x, y);
}

/**
 * Return whether the value is infinity.
 *
 * @param x double-precision floating point value.
 * @returns non-zero if the value is infinity, 0 otherwise.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_isinff
 *
 * @from SDL_stdinc.h:5177 int SDL_isinf(double x);
 */
export function isinf(x: number): number {
  return lib.symbols.SDL_isinf(x);
}

/**
 * Return whether the value is infinity.
 *
 * @param x floating point value.
 * @returns non-zero if the value is infinity, 0 otherwise.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_isinf
 *
 * @from SDL_stdinc.h:5191 int SDL_isinff(float x);
 */
export function isinff(x: number): number {
  return lib.symbols.SDL_isinff(x);
}

/**
 * Return whether the value is NaN.
 *
 * @param x double-precision floating point value.
 * @returns non-zero if the value is NaN, 0 otherwise.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_isnanf
 *
 * @from SDL_stdinc.h:5205 int SDL_isnan(double x);
 */
export function isnan(x: number): number {
  return lib.symbols.SDL_isnan(x);
}

/**
 * Return whether the value is NaN.
 *
 * @param x floating point value.
 * @returns non-zero if the value is NaN, 0 otherwise.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_isnan
 *
 * @from SDL_stdinc.h:5219 int SDL_isnanf(float x);
 */
export function isnanf(x: number): number {
  return lib.symbols.SDL_isnanf(x);
}

/**
 * Compute the natural logarithm of `x`.
 *
 * Domain: `0 < x <= INF`
 *
 * Range: `-INF <= y <= INF`
 *
 * It is an error for `x` to be less than or equal to 0.
 *
 * This function operates on double-precision floating point values, use
 * SDL_logf for single-precision floats.
 *
 * This function may use a different approximation across different versions,
 * platforms and configurations. i.e, it can return a different value given
 * the same input on different machines or operating systems, or if SDL is
 * updated.
 *
 * @param x floating point value. Must be greater than 0.
 * @returns the natural logarithm of `x`.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_logf
 * @sa SDL_log10
 * @sa SDL_exp
 *
 * @from SDL_stdinc.h:5249 double SDL_log(double x);
 */
export function log(x: number): number {
  return lib.symbols.SDL_log(x);
}

/**
 * Compute the natural logarithm of `x`.
 *
 * Domain: `0 < x <= INF`
 *
 * Range: `-INF <= y <= INF`
 *
 * It is an error for `x` to be less than or equal to 0.
 *
 * This function operates on single-precision floating point values, use
 * SDL_log for double-precision floats.
 *
 * This function may use a different approximation across different versions,
 * platforms and configurations. i.e, it can return a different value given
 * the same input on different machines or operating systems, or if SDL is
 * updated.
 *
 * @param x floating point value. Must be greater than 0.
 * @returns the natural logarithm of `x`.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_log
 * @sa SDL_expf
 *
 * @from SDL_stdinc.h:5278 float SDL_logf(float x);
 */
export function logf(x: number): number {
  return lib.symbols.SDL_logf(x);
}

/**
 * Compute the base-10 logarithm of `x`.
 *
 * Domain: `0 < x <= INF`
 *
 * Range: `-INF <= y <= INF`
 *
 * It is an error for `x` to be less than or equal to 0.
 *
 * This function operates on double-precision floating point values, use
 * SDL_log10f for single-precision floats.
 *
 * This function may use a different approximation across different versions,
 * platforms and configurations. i.e, it can return a different value given
 * the same input on different machines or operating systems, or if SDL is
 * updated.
 *
 * @param x floating point value. Must be greater than 0.
 * @returns the logarithm of `x`.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_log10f
 * @sa SDL_log
 * @sa SDL_pow
 *
 * @from SDL_stdinc.h:5308 double SDL_log10(double x);
 */
export function log10(x: number): number {
  return lib.symbols.SDL_log10(x);
}

/**
 * Compute the base-10 logarithm of `x`.
 *
 * Domain: `0 < x <= INF`
 *
 * Range: `-INF <= y <= INF`
 *
 * It is an error for `x` to be less than or equal to 0.
 *
 * This function operates on single-precision floating point values, use
 * SDL_log10 for double-precision floats.
 *
 * This function may use a different approximation across different versions,
 * platforms and configurations. i.e, it can return a different value given
 * the same input on different machines or operating systems, or if SDL is
 * updated.
 *
 * @param x floating point value. Must be greater than 0.
 * @returns the logarithm of `x`.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_log10
 * @sa SDL_logf
 * @sa SDL_powf
 *
 * @from SDL_stdinc.h:5338 float SDL_log10f(float x);
 */
export function log10F(x: number): number {
  return lib.symbols.SDL_log10f(x);
}

/**
 * Split `x` into integer and fractional parts
 *
 * This function operates on double-precision floating point values, use
 * SDL_modff for single-precision floats.
 *
 * @param x floating point value.
 * @param y output pointer to store the integer part of `x`.
 * @returns the fractional part of `x`.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_modff
 * @sa SDL_trunc
 * @sa SDL_fmod
 *
 * @from SDL_stdinc.h:5358 double SDL_modf(double x, double *y);
 */
export function modf(x: number): number {
  if(!lib.symbols.SDL_modf(x, _p.f64.p0))
    throw new Error(`SDL_modf: ${_p.getCstr2(lib.symbols.SDL_GetError())}`);
  return _p.f64.v0;
}

/**
 * Split `x` into integer and fractional parts
 *
 * This function operates on single-precision floating point values, use
 * SDL_modf for double-precision floats.
 *
 * @param x floating point value.
 * @param y output pointer to store the integer part of `x`.
 * @returns the fractional part of `x`.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_modf
 * @sa SDL_truncf
 * @sa SDL_fmodf
 *
 * @from SDL_stdinc.h:5378 float SDL_modff(float x, float *y);
 */
export function modff(x: number): number {
  if(!lib.symbols.SDL_modff(x, _p.f32.p0))
    throw new Error(`SDL_modff: ${_p.getCstr2(lib.symbols.SDL_GetError())}`);
  return _p.f32.v0;
}

/**
 * Raise `x` to the power `y`
 *
 * Domain: `-INF <= x <= INF`, `-INF <= y <= INF`
 *
 * Range: `-INF <= z <= INF`
 *
 * If `y` is the base of the natural logarithm (e), consider using SDL_exp
 * instead.
 *
 * This function operates on double-precision floating point values, use
 * SDL_powf for single-precision floats.
 *
 * This function may use a different approximation across different versions,
 * platforms and configurations. i.e, it can return a different value given
 * the same input on different machines or operating systems, or if SDL is
 * updated.
 *
 * @param x the base.
 * @param y the exponent.
 * @returns `x` raised to the power `y`.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_powf
 * @sa SDL_exp
 * @sa SDL_log
 *
 * @from SDL_stdinc.h:5410 double SDL_pow(double x, double y);
 */
export function pow(x: number, y: number): number {
  return lib.symbols.SDL_pow(x, y);
}

/**
 * Raise `x` to the power `y`
 *
 * Domain: `-INF <= x <= INF`, `-INF <= y <= INF`
 *
 * Range: `-INF <= z <= INF`
 *
 * If `y` is the base of the natural logarithm (e), consider using SDL_exp
 * instead.
 *
 * This function operates on single-precision floating point values, use
 * SDL_pow for double-precision floats.
 *
 * This function may use a different approximation across different versions,
 * platforms and configurations. i.e, it can return a different value given
 * the same input on different machines or operating systems, or if SDL is
 * updated.
 *
 * @param x the base.
 * @param y the exponent.
 * @returns `x` raised to the power `y`.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_pow
 * @sa SDL_expf
 * @sa SDL_logf
 *
 * @from SDL_stdinc.h:5442 float SDL_powf(float x, float y);
 */
export function powf(x: number, y: number): number {
  return lib.symbols.SDL_powf(x, y);
}

/**
 * Round `x` to the nearest integer.
 *
 * Rounds `x` to the nearest integer. Values halfway between integers will be
 * rounded away from zero.
 *
 * Domain: `-INF <= x <= INF`
 *
 * Range: `-INF <= y <= INF`, y integer
 *
 * This function operates on double-precision floating point values, use
 * SDL_roundf for single-precision floats. To get the result as an integer
 * type, use SDL_lround.
 *
 * @param x floating point value.
 * @returns the nearest integer to `x`.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_roundf
 * @sa SDL_lround
 * @sa SDL_floor
 * @sa SDL_ceil
 * @sa SDL_trunc
 *
 * @from SDL_stdinc.h:5471 double SDL_round(double x);
 */
export function round(x: number): number {
  return lib.symbols.SDL_round(x);
}

/**
 * Round `x` to the nearest integer.
 *
 * Rounds `x` to the nearest integer. Values halfway between integers will be
 * rounded away from zero.
 *
 * Domain: `-INF <= x <= INF`
 *
 * Range: `-INF <= y <= INF`, y integer
 *
 * This function operates on single-precision floating point values, use
 * SDL_round for double-precision floats. To get the result as an integer
 * type, use SDL_lroundf.
 *
 * @param x floating point value.
 * @returns the nearest integer to `x`.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_round
 * @sa SDL_lroundf
 * @sa SDL_floorf
 * @sa SDL_ceilf
 * @sa SDL_truncf
 *
 * @from SDL_stdinc.h:5500 float SDL_roundf(float x);
 */
export function roundf(x: number): number {
  return lib.symbols.SDL_roundf(x);
}

/**
 * Round `x` to the nearest integer representable as a long
 *
 * Rounds `x` to the nearest integer. Values halfway between integers will be
 * rounded away from zero.
 *
 * Domain: `-INF <= x <= INF`
 *
 * Range: `MIN_LONG <= y <= MAX_LONG`
 *
 * This function operates on double-precision floating point values, use
 * SDL_lroundf for single-precision floats. To get the result as a
 * floating-point type, use SDL_round.
 *
 * @param x floating point value.
 * @returns the nearest integer to `x`.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_lroundf
 * @sa SDL_round
 * @sa SDL_floor
 * @sa SDL_ceil
 * @sa SDL_trunc
 *
 * @from SDL_stdinc.h:5529 long SDL_lround(double x);
 */
export function lround(x: number): bigint {
  return lib.symbols.SDL_lround(x);
}

/**
 * Round `x` to the nearest integer representable as a long
 *
 * Rounds `x` to the nearest integer. Values halfway between integers will be
 * rounded away from zero.
 *
 * Domain: `-INF <= x <= INF`
 *
 * Range: `MIN_LONG <= y <= MAX_LONG`
 *
 * This function operates on single-precision floating point values, use
 * SDL_lround for double-precision floats. To get the result as a
 * floating-point type, use SDL_roundf.
 *
 * @param x floating point value.
 * @returns the nearest integer to `x`.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_lround
 * @sa SDL_roundf
 * @sa SDL_floorf
 * @sa SDL_ceilf
 * @sa SDL_truncf
 *
 * @from SDL_stdinc.h:5558 long SDL_lroundf(float x);
 */
export function lroundf(x: number): bigint {
  return lib.symbols.SDL_lroundf(x);
}

/**
 * Scale `x` by an integer power of two.
 *
 * Multiplies `x` by the `n`th power of the floating point radix (always 2).
 *
 * Domain: `-INF <= x <= INF`, `n` integer
 *
 * Range: `-INF <= y <= INF`
 *
 * This function operates on double-precision floating point values, use
 * SDL_scalbnf for single-precision floats.
 *
 * @param x floating point value to be scaled.
 * @param n integer exponent.
 * @returns `x * 2^n`.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_scalbnf
 * @sa SDL_pow
 *
 * @from SDL_stdinc.h:5583 double SDL_scalbn(double x, int n);
 */
export function scalbn(x: number, n: number): number {
  return lib.symbols.SDL_scalbn(x, n);
}

/**
 * Scale `x` by an integer power of two.
 *
 * Multiplies `x` by the `n`th power of the floating point radix (always 2).
 *
 * Domain: `-INF <= x <= INF`, `n` integer
 *
 * Range: `-INF <= y <= INF`
 *
 * This function operates on single-precision floating point values, use
 * SDL_scalbn for double-precision floats.
 *
 * @param x floating point value to be scaled.
 * @param n integer exponent.
 * @returns `x * 2^n`.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_scalbn
 * @sa SDL_powf
 *
 * @from SDL_stdinc.h:5608 float SDL_scalbnf(float x, int n);
 */
export function scalbnf(x: number, n: number): number {
  return lib.symbols.SDL_scalbnf(x, n);
}

/**
 * Compute the sine of `x`.
 *
 * Domain: `-INF <= x <= INF`
 *
 * Range: `-1 <= y <= 1`
 *
 * This function operates on double-precision floating point values, use
 * SDL_sinf for single-precision floats.
 *
 * This function may use a different approximation across different versions,
 * platforms and configurations. i.e, it can return a different value given
 * the same input on different machines or operating systems, or if SDL is
 * updated.
 *
 * @param x floating point value, in radians.
 * @returns sine of `x`.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_sinf
 * @sa SDL_asin
 * @sa SDL_cos
 *
 * @from SDL_stdinc.h:5636 double SDL_sin(double x);
 */
export function sin(x: number): number {
  return lib.symbols.SDL_sin(x);
}

/**
 * Compute the sine of `x`.
 *
 * Domain: `-INF <= x <= INF`
 *
 * Range: `-1 <= y <= 1`
 *
 * This function operates on single-precision floating point values, use
 * SDL_sin for double-precision floats.
 *
 * This function may use a different approximation across different versions,
 * platforms and configurations. i.e, it can return a different value given
 * the same input on different machines or operating systems, or if SDL is
 * updated.
 *
 * @param x floating point value, in radians.
 * @returns sine of `x`.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_sin
 * @sa SDL_asinf
 * @sa SDL_cosf
 *
 * @from SDL_stdinc.h:5664 float SDL_sinf(float x);
 */
export function sinf(x: number): number {
  return lib.symbols.SDL_sinf(x);
}

/**
 * Compute the square root of `x`.
 *
 * Domain: `0 <= x <= INF`
 *
 * Range: `0 <= y <= INF`
 *
 * This function operates on double-precision floating point values, use
 * SDL_sqrtf for single-precision floats.
 *
 * This function may use a different approximation across different versions,
 * platforms and configurations. i.e, it can return a different value given
 * the same input on different machines or operating systems, or if SDL is
 * updated.
 *
 * @param x floating point value. Must be greater than or equal to 0.
 * @returns square root of `x`.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_sqrtf
 *
 * @from SDL_stdinc.h:5690 double SDL_sqrt(double x);
 */
export function sqrt(x: number): number {
  return lib.symbols.SDL_sqrt(x);
}

/**
 * Compute the square root of `x`.
 *
 * Domain: `0 <= x <= INF`
 *
 * Range: `0 <= y <= INF`
 *
 * This function operates on single-precision floating point values, use
 * SDL_sqrt for double-precision floats.
 *
 * This function may use a different approximation across different versions,
 * platforms and configurations. i.e, it can return a different value given
 * the same input on different machines or operating systems, or if SDL is
 * updated.
 *
 * @param x floating point value. Must be greater than or equal to 0.
 * @returns square root of `x`.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_sqrt
 *
 * @from SDL_stdinc.h:5716 float SDL_sqrtf(float x);
 */
export function sqrtf(x: number): number {
  return lib.symbols.SDL_sqrtf(x);
}

/**
 * Compute the tangent of `x`.
 *
 * Domain: `-INF <= x <= INF`
 *
 * Range: `-INF <= y <= INF`
 *
 * This function operates on double-precision floating point values, use
 * SDL_tanf for single-precision floats.
 *
 * This function may use a different approximation across different versions,
 * platforms and configurations. i.e, it can return a different value given
 * the same input on different machines or operating systems, or if SDL is
 * updated.
 *
 * @param x floating point value, in radians.
 * @returns tangent of `x`.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_tanf
 * @sa SDL_sin
 * @sa SDL_cos
 * @sa SDL_atan
 * @sa SDL_atan2
 *
 * @from SDL_stdinc.h:5746 double SDL_tan(double x);
 */
export function tan(x: number): number {
  return lib.symbols.SDL_tan(x);
}

/**
 * Compute the tangent of `x`.
 *
 * Domain: `-INF <= x <= INF`
 *
 * Range: `-INF <= y <= INF`
 *
 * This function operates on single-precision floating point values, use
 * SDL_tan for double-precision floats.
 *
 * This function may use a different approximation across different versions,
 * platforms and configurations. i.e, it can return a different value given
 * the same input on different machines or operating systems, or if SDL is
 * updated.
 *
 * @param x floating point value, in radians.
 * @returns tangent of `x`.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_tan
 * @sa SDL_sinf
 * @sa SDL_cosf
 * @sa SDL_atanf
 * @sa SDL_atan2f
 *
 * @from SDL_stdinc.h:5776 float SDL_tanf(float x);
 */
export function tanf(x: number): number {
  return lib.symbols.SDL_tanf(x);
}

/**
 * Helper function to convert a string's encoding in one call.
 *
 * This function converts a buffer or string between encodings in one pass.
 *
 * The string does not need to be NULL-terminated; this function operates on
 * the number of bytes specified in `inbytesleft` whether there is a NULL
 * character anywhere in the buffer.
 *
 * The returned string is owned by the caller, and should be passed to
 * SDL_free when no longer needed.
 *
 * @param tocode the character encoding of the output string. Examples are
 *               "UTF-8", "UCS-4", etc.
 * @param fromcode the character encoding of data in `inbuf`.
 * @param inbuf the string to convert to a different encoding.
 * @param inbytesleft the size of the input string _in bytes_.
 * @returns a new string, converted to the new encoding, or NULL on error.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_iconv_open
 * @sa SDL_iconv_close
 * @sa SDL_iconv
 *
 * @from SDL_stdinc.h:5890 char * SDL_iconv_string(const char *tocode, const char *fromcode, const char *inbuf, size_t inbytesleft);
 */
export function iconvString(
    tocode: string,
    fromcode: string,
    inbuf: string,
    inbytesleft: bigint,
): string {
  return _p.getCstr2(lib.symbols.SDL_iconv_string(_p.toCstr(tocode), _p.toCstr(fromcode), _p.toCstr(inbuf), inbytesleft));
}

