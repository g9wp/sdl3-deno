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
 * @from SDL_stdinc.h:1346 SDL_MALLOC void * SDL_malloc(size_t size);
 */
SDL_malloc: {
      parameters: ["usize"],
      result: "pointer"
    },


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
 * @from SDL_stdinc.h:1371 SDL_MALLOC SDL_ALLOC_SIZE2(1, 2) void * SDL_calloc(size_t nmemb, size_t size);
 */
SDL_calloc: {
      parameters: ["usize", "usize"],
      result: "pointer"
    },


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
 * @from SDL_stdinc.h:1411 SDL_ALLOC_SIZE(2) void * SDL_realloc(void *mem, size_t size);
 */
SDL_realloc: {
      parameters: ["pointer", "usize"],
      result: "pointer"
    },


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
 * @from SDL_stdinc.h:1431 void SDL_free(void *mem);
 */
SDL_free: {
      parameters: ["pointer"],
      result: "void"
    },


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
 * @from SDL_stdinc.h:1529 void SDL_GetOriginalMemoryFunctions(SDL_malloc_func *malloc_func, SDL_calloc_func *calloc_func, SDL_realloc_func *realloc_func, SDL_free_func *free_func);
 */
SDL_GetOriginalMemoryFunctions: {
      parameters: ["pointer", "pointer", "pointer", "pointer"],
      result: "void"
    },


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
 * @from SDL_stdinc.h:1551 void SDL_GetMemoryFunctions(SDL_malloc_func *malloc_func, SDL_calloc_func *calloc_func, SDL_realloc_func *realloc_func, SDL_free_func *free_func);
 */
SDL_GetMemoryFunctions: {
      parameters: ["pointer", "pointer", "pointer", "pointer"],
      result: "void"
    },


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
 * @from SDL_stdinc.h:1582 bool SDL_SetMemoryFunctions(SDL_malloc_func malloc_func, SDL_calloc_func calloc_func, SDL_realloc_func realloc_func, SDL_free_func free_func);
 */
SDL_SetMemoryFunctions: {
      parameters: ["function", "function", "function", "function"],
      result: "bool"
    },


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
 * @from SDL_stdinc.h:1609 SDL_MALLOC void * SDL_aligned_alloc(size_t alignment, size_t size);
 */
SDL_aligned_alloc: {
      parameters: ["usize", "usize"],
      result: "pointer"
    },


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
 * @from SDL_stdinc.h:1627 void SDL_aligned_free(void *mem);
 */
SDL_aligned_free: {
      parameters: ["pointer"],
      result: "void"
    },


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
 * @from SDL_stdinc.h:1639 int SDL_GetNumAllocations(void);
 */
SDL_GetNumAllocations: {
      parameters: [],
      result: "i32"
    },


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
 * @from SDL_stdinc.h:1677 SDL_Environment * SDL_GetEnvironment(void);
 */
SDL_GetEnvironment: {
      parameters: [],
      result: "pointer"
    },


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
 * @from SDL_stdinc.h:1699 SDL_Environment * SDL_CreateEnvironment(bool populated);
 */
SDL_CreateEnvironment: {
      parameters: ["bool"],
      result: "pointer"
    },


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
 * @from SDL_stdinc.h:1719 const char * SDL_GetEnvironmentVariable(SDL_Environment *env, const char *name);
 */
SDL_GetEnvironmentVariable: {
      parameters: ["pointer", "pointer"],
      result: "pointer"
    },


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
 * @from SDL_stdinc.h:1740 char ** SDL_GetEnvironmentVariables(SDL_Environment *env);
 */
SDL_GetEnvironmentVariables: {
      parameters: ["pointer"],
      result: "pointer"
    },


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
 * @from SDL_stdinc.h:1764 bool SDL_SetEnvironmentVariable(SDL_Environment *env, const char *name, const char *value, bool overwrite);
 */
SDL_SetEnvironmentVariable: {
      parameters: ["pointer", "pointer", "pointer", "bool"],
      result: "bool"
    },


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
 * @from SDL_stdinc.h:1785 bool SDL_UnsetEnvironmentVariable(SDL_Environment *env, const char *name);
 */
SDL_UnsetEnvironmentVariable: {
      parameters: ["pointer", "pointer"],
      result: "bool"
    },


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
 * @from SDL_stdinc.h:1799 void SDL_DestroyEnvironment(SDL_Environment *env);
 */
SDL_DestroyEnvironment: {
      parameters: ["pointer"],
      result: "void"
    },


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
 * @from SDL_stdinc.h:1814 const char * SDL_getenv(const char *name);
 */
SDL_getenv: {
      parameters: ["pointer"],
      result: "pointer"
    },


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
 * @from SDL_stdinc.h:1833 const char * SDL_getenv_unsafe(const char *name);
 */
SDL_getenv_unsafe: {
      parameters: ["pointer"],
      result: "pointer"
    },


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
 * @from SDL_stdinc.h:1851 int SDL_setenv_unsafe(const char *name, const char *value, int overwrite);
 */
SDL_setenv_unsafe: {
      parameters: ["pointer", "pointer", "i32"],
      result: "i32"
    },


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
 * @from SDL_stdinc.h:1866 int SDL_unsetenv_unsafe(const char *name);
 */
SDL_unsetenv_unsafe: {
      parameters: ["pointer"],
      result: "i32"
    },


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
 * @from SDL_stdinc.h:1928 void SDL_qsort(void *base, size_t nmemb, size_t size, SDL_CompareCallback compare);
 */
SDL_qsort: {
      parameters: ["pointer", "usize", "usize", "function"],
      result: "void"
    },


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
 * @from SDL_stdinc.h:1978 void * SDL_bsearch(const void *key, const void *base, size_t nmemb, size_t size, SDL_CompareCallback compare);
 */
SDL_bsearch: {
      parameters: ["pointer", "pointer", "usize", "usize", "function"],
      result: "pointer"
    },


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
 * @from SDL_stdinc.h:2048 void SDL_qsort_r(void *base, size_t nmemb, size_t size, SDL_CompareCallback_r compare, void *userdata);
 */
SDL_qsort_r: {
      parameters: ["pointer", "usize", "usize", "function", "pointer"],
      result: "void"
    },


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
 * @from SDL_stdinc.h:2106 void * SDL_bsearch_r(const void *key, const void *base, size_t nmemb, size_t size, SDL_CompareCallback_r compare, void *userdata);
 */
SDL_bsearch_r: {
      parameters: ["pointer", "pointer", "usize", "usize", "function", "pointer"],
      result: "pointer"
    },


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
 * @from SDL_stdinc.h:2118 int SDL_abs(int x);
 */
SDL_abs: {
      parameters: ["i32"],
      result: "i32"
    },


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
 * @from SDL_stdinc.h:2193 int SDL_isalpha(int x);
 */
SDL_isalpha: {
      parameters: ["i32"],
      result: "i32"
    },


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
 * @from SDL_stdinc.h:2208 int SDL_isalnum(int x);
 */
SDL_isalnum: {
      parameters: ["i32"],
      result: "i32"
    },


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
 * @from SDL_stdinc.h:2223 int SDL_isblank(int x);
 */
SDL_isblank: {
      parameters: ["i32"],
      result: "i32"
    },


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
 * @from SDL_stdinc.h:2238 int SDL_iscntrl(int x);
 */
SDL_iscntrl: {
      parameters: ["i32"],
      result: "i32"
    },


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
 * @from SDL_stdinc.h:2253 int SDL_isdigit(int x);
 */
SDL_isdigit: {
      parameters: ["i32"],
      result: "i32"
    },


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
 * @from SDL_stdinc.h:2268 int SDL_isxdigit(int x);
 */
SDL_isxdigit: {
      parameters: ["i32"],
      result: "i32"
    },


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
 * @from SDL_stdinc.h:2286 int SDL_ispunct(int x);
 */
SDL_ispunct: {
      parameters: ["i32"],
      result: "i32"
    },


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
 * @from SDL_stdinc.h:2308 int SDL_isspace(int x);
 */
SDL_isspace: {
      parameters: ["i32"],
      result: "i32"
    },


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
 * @from SDL_stdinc.h:2323 int SDL_isupper(int x);
 */
SDL_isupper: {
      parameters: ["i32"],
      result: "i32"
    },


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
 * @from SDL_stdinc.h:2338 int SDL_islower(int x);
 */
SDL_islower: {
      parameters: ["i32"],
      result: "i32"
    },


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
 * @from SDL_stdinc.h:2357 int SDL_isprint(int x);
 */
SDL_isprint: {
      parameters: ["i32"],
      result: "i32"
    },


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
 * @from SDL_stdinc.h:2378 int SDL_isgraph(int x);
 */
SDL_isgraph: {
      parameters: ["i32"],
      result: "i32"
    },


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
 * @from SDL_stdinc.h:2396 int SDL_toupper(int x);
 */
SDL_toupper: {
      parameters: ["i32"],
      result: "i32"
    },


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
 * @from SDL_stdinc.h:2414 int SDL_tolower(int x);
 */
SDL_tolower: {
      parameters: ["i32"],
      result: "i32"
    },


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
 * @from SDL_stdinc.h:2435 Uint16 SDL_crc16(Uint16 crc, const void *data, size_t len);
 */
SDL_crc16: {
      parameters: ["u16", "pointer", "usize"],
      result: "u16"
    },


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
 * @from SDL_stdinc.h:2456 Uint32 SDL_crc32(Uint32 crc, const void *data, size_t len);
 */
SDL_crc32: {
      parameters: ["u32", "pointer", "usize"],
      result: "u32"
    },


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
 * @from SDL_stdinc.h:2482 Uint32 SDL_murmur3_32(const void *data, size_t len, Uint32 seed);
 */
SDL_murmur3_32: {
      parameters: ["pointer", "usize", "u32"],
      result: "u32"
    },


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
 * @from SDL_stdinc.h:2502 void * SDL_memcpy(SDL_OUT_BYTECAP(len) void *dst, SDL_IN_BYTECAP(len) const void *src, size_t len);
 */
SDL_memcpy: {
      parameters: ["pointer", "pointer", "usize"],
      result: "pointer"
    },


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
 * @from SDL_stdinc.h:2558 void * SDL_memmove(SDL_OUT_BYTECAP(len) void *dst, SDL_IN_BYTECAP(len) const void *src, size_t len);
 */
SDL_memmove: {
      parameters: ["pointer", "pointer", "usize"],
      result: "pointer"
    },


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
 * @from SDL_stdinc.h:2586 void * SDL_memset(SDL_OUT_BYTECAP(len) void *dst, int c, size_t len);
 */
SDL_memset: {
      parameters: ["pointer", "i32", "usize"],
      result: "pointer"
    },


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
 * @from SDL_stdinc.h:2606 void * SDL_memset4(void *dst, Uint32 val, size_t dwords);
 */
SDL_memset4: {
      parameters: ["pointer", "u32", "usize"],
      result: "pointer"
    },


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
 * @from SDL_stdinc.h:2688 int SDL_memcmp(const void *s1, const void *s2, size_t len);
 */
SDL_memcmp: {
      parameters: ["pointer", "pointer", "usize"],
      result: "i32"
    },


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
 * @from SDL_stdinc.h:2715 size_t SDL_wcslen(const wchar_t *wstr);
 */
SDL_wcslen: {
      parameters: ["pointer"],
      result: "usize"
    },


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
 * @from SDL_stdinc.h:2746 size_t SDL_wcsnlen(const wchar_t *wstr, size_t maxlen);
 */
SDL_wcsnlen: {
      parameters: ["pointer", "usize"],
      result: "usize"
    },


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
 * @from SDL_stdinc.h:2773 size_t SDL_wcslcpy(SDL_OUT_Z_CAP(maxlen) wchar_t *dst, const wchar_t *src, size_t maxlen);
 */
SDL_wcslcpy: {
      parameters: ["pointer", "pointer", "usize"],
      result: "usize"
    },


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
 * @from SDL_stdinc.h:2802 size_t SDL_wcslcat(SDL_INOUT_Z_CAP(maxlen) wchar_t *dst, const wchar_t *src, size_t maxlen);
 */
SDL_wcslcat: {
      parameters: ["pointer", "pointer", "usize"],
      result: "usize"
    },


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
 * @from SDL_stdinc.h:2820 wchar_t * SDL_wcsdup(const wchar_t *wstr);
 */
SDL_wcsdup: {
      parameters: ["pointer"],
      result: "pointer"
    },


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
 * @from SDL_stdinc.h:2840 wchar_t * SDL_wcsstr(const wchar_t *haystack, const wchar_t *needle);
 */
SDL_wcsstr: {
      parameters: ["pointer", "pointer"],
      result: "pointer"
    },


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
 * @from SDL_stdinc.h:2865 wchar_t * SDL_wcsnstr(const wchar_t *haystack, const wchar_t *needle, size_t maxlen);
 */
SDL_wcsnstr: {
      parameters: ["pointer", "pointer", "usize"],
      result: "pointer"
    },


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
 * @from SDL_stdinc.h:2884 int SDL_wcscmp(const wchar_t *str1, const wchar_t *str2);
 */
SDL_wcscmp: {
      parameters: ["pointer", "pointer"],
      result: "i32"
    },


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
 * @from SDL_stdinc.h:2915 int SDL_wcsncmp(const wchar_t *str1, const wchar_t *str2, size_t maxlen);
 */
SDL_wcsncmp: {
      parameters: ["pointer", "pointer", "usize"],
      result: "i32"
    },


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
 * @from SDL_stdinc.h:2945 int SDL_wcscasecmp(const wchar_t *str1, const wchar_t *str2);
 */
SDL_wcscasecmp: {
      parameters: ["pointer", "pointer"],
      result: "i32"
    },


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
 * @from SDL_stdinc.h:2987 int SDL_wcsncasecmp(const wchar_t *str1, const wchar_t *str2, size_t maxlen);
 */
SDL_wcsncasecmp: {
      parameters: ["pointer", "pointer", "usize"],
      result: "i32"
    },


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
 * @from SDL_stdinc.h:3014 long SDL_wcstol(const wchar_t *str, wchar_t **endp, int base);
 */
SDL_wcstol: {
      parameters: ["pointer", "pointer", "i32"],
      result: "i64"
    },


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
 * @from SDL_stdinc.h:3034 size_t SDL_strlen(const char *str);
 */
SDL_strlen: {
      parameters: ["pointer"],
      result: "usize"
    },


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
 * @from SDL_stdinc.h:3058 size_t SDL_strnlen(const char *str, size_t maxlen);
 */
SDL_strnlen: {
      parameters: ["pointer", "usize"],
      result: "usize"
    },


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
 * @from SDL_stdinc.h:3087 size_t SDL_strlcpy(SDL_OUT_Z_CAP(maxlen) char *dst, const char *src, size_t maxlen);
 */
SDL_strlcpy: {
      parameters: ["pointer", "pointer", "usize"],
      result: "usize"
    },


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
 * @from SDL_stdinc.h:3115 size_t SDL_utf8strlcpy(SDL_OUT_Z_CAP(dst_bytes) char *dst, const char *src, size_t dst_bytes);
 */
SDL_utf8strlcpy: {
      parameters: ["pointer", "pointer", "usize"],
      result: "usize"
    },


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
 * @from SDL_stdinc.h:3143 size_t SDL_strlcat(SDL_INOUT_Z_CAP(maxlen) char *dst, const char *src, size_t maxlen);
 */
SDL_strlcat: {
      parameters: ["pointer", "pointer", "usize"],
      result: "usize"
    },


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
 * @from SDL_stdinc.h:3161 SDL_MALLOC char * SDL_strdup(const char *str);
 */
SDL_strdup: {
      parameters: ["pointer"],
      result: "pointer"
    },


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
 * @from SDL_stdinc.h:3186 SDL_MALLOC char * SDL_strndup(const char *str, size_t maxlen);
 */
SDL_strndup: {
      parameters: ["pointer", "usize"],
      result: "pointer"
    },


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
 * @from SDL_stdinc.h:3207 char * SDL_strrev(char *str);
 */
SDL_strrev: {
      parameters: ["pointer"],
      result: "pointer"
    },


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
 * @from SDL_stdinc.h:3228 char * SDL_strupr(char *str);
 */
SDL_strupr: {
      parameters: ["pointer"],
      result: "pointer"
    },


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
 * @from SDL_stdinc.h:3249 char * SDL_strlwr(char *str);
 */
SDL_strlwr: {
      parameters: ["pointer"],
      result: "pointer"
    },


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
 * @from SDL_stdinc.h:3269 char * SDL_strchr(const char *str, int c);
 */
SDL_strchr: {
      parameters: ["pointer", "i32"],
      result: "pointer"
    },


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
 * @from SDL_stdinc.h:3288 char * SDL_strrchr(const char *str, int c);
 */
SDL_strrchr: {
      parameters: ["pointer", "i32"],
      result: "pointer"
    },


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
 * @from SDL_stdinc.h:3308 char * SDL_strstr(const char *haystack, const char *needle);
 */
SDL_strstr: {
      parameters: ["pointer", "pointer"],
      result: "pointer"
    },


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
 * @from SDL_stdinc.h:3331 char * SDL_strnstr(const char *haystack, const char *needle, size_t maxlen);
 */
SDL_strnstr: {
      parameters: ["pointer", "pointer", "usize"],
      result: "pointer"
    },


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
 * @from SDL_stdinc.h:3359 char * SDL_strcasestr(const char *haystack, const char *needle);
 */
SDL_strcasestr: {
      parameters: ["pointer", "pointer"],
      result: "pointer"
    },


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
 * @from SDL_stdinc.h:3388 char * SDL_strtok_r(char *str, const char *delim, char **saveptr);
 */
SDL_strtok_r: {
      parameters: ["pointer", "pointer", "pointer"],
      result: "pointer"
    },


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
 * @from SDL_stdinc.h:3416 size_t SDL_utf8strlen(const char *str);
 */
SDL_utf8strlen: {
      parameters: ["pointer"],
      result: "usize"
    },


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
 * @from SDL_stdinc.h:3449 size_t SDL_utf8strnlen(const char *str, size_t bytes);
 */
SDL_utf8strnlen: {
      parameters: ["pointer", "usize"],
      result: "usize"
    },


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
 * @from SDL_stdinc.h:3477 char * SDL_itoa(int value, char *str, int radix);
 */
SDL_itoa: {
      parameters: ["i32", "pointer", "i32"],
      result: "pointer"
    },


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
 * @from SDL_stdinc.h:3505 char * SDL_uitoa(unsigned int value, char *str, int radix);
 */
SDL_uitoa: {
      parameters: ["i32", "pointer", "i32"],
      result: "pointer"
    },


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
 * @from SDL_stdinc.h:3533 char * SDL_ltoa(long value, char *str, int radix);
 */
SDL_ltoa: {
      parameters: ["i64", "pointer", "i32"],
      result: "pointer"
    },


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
 * @from SDL_stdinc.h:3561 char * SDL_ultoa(unsigned long value, char *str, int radix);
 */
SDL_ultoa: {
      parameters: ["i64", "pointer", "i32"],
      result: "pointer"
    },


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
 * @from SDL_stdinc.h:3591 char * SDL_lltoa(long long value, char *str, int radix);
 */
SDL_lltoa: {
      parameters: ["i64", "pointer", "i32"],
      result: "pointer"
    },


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
 * @from SDL_stdinc.h:3619 char * SDL_ulltoa(unsigned long long value, char *str, int radix);
 */
SDL_ulltoa: {
      parameters: ["i64", "pointer", "i32"],
      result: "pointer"
    },


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
 * @from SDL_stdinc.h:3643 int SDL_atoi(const char *str);
 */
SDL_atoi: {
      parameters: ["pointer"],
      result: "i32"
    },


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
 * @from SDL_stdinc.h:3665 double SDL_atof(const char *str);
 */
SDL_atof: {
      parameters: ["pointer"],
      result: "f64"
    },


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
 * @from SDL_stdinc.h:3699 long SDL_strtol(const char *str, char **endp, int base);
 */
SDL_strtol: {
      parameters: ["pointer", "pointer", "i32"],
      result: "i64"
    },


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
 * @from SDL_stdinc.h:3732 unsigned long SDL_strtoul(const char *str, char **endp, int base);
 */
SDL_strtoul: {
      parameters: ["pointer", "pointer", "i32"],
      result: "u64"
    },


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
 * @from SDL_stdinc.h:3767 long long SDL_strtoll(const char *str, char **endp, int base);
 */
SDL_strtoll: {
      parameters: ["pointer", "pointer", "i32"],
      result: "i64"
    },


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
 * @from SDL_stdinc.h:3801 unsigned long long SDL_strtoull(const char *str, char **endp, int base);
 */
SDL_strtoull: {
      parameters: ["pointer", "pointer", "i32"],
      result: "u64"
    },


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
 * @from SDL_stdinc.h:3831 double SDL_strtod(const char *str, char **endp);
 */
SDL_strtod: {
      parameters: ["pointer", "pointer"],
      result: "f64"
    },


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
 * @from SDL_stdinc.h:3851 int SDL_strcmp(const char *str1, const char *str2);
 */
SDL_strcmp: {
      parameters: ["pointer", "pointer"],
      result: "i32"
    },


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
 * @from SDL_stdinc.h:3881 int SDL_strncmp(const char *str1, const char *str2, size_t maxlen);
 */
SDL_strncmp: {
      parameters: ["pointer", "pointer", "usize"],
      result: "i32"
    },


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
 * @from SDL_stdinc.h:3909 int SDL_strcasecmp(const char *str1, const char *str2);
 */
SDL_strcasecmp: {
      parameters: ["pointer", "pointer"],
      result: "i32"
    },


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
 * @from SDL_stdinc.h:3949 int SDL_strncasecmp(const char *str1, const char *str2, size_t maxlen);
 */
SDL_strncasecmp: {
      parameters: ["pointer", "pointer", "usize"],
      result: "i32"
    },


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
 * @from SDL_stdinc.h:3967 char * SDL_strpbrk(const char *str, const char *breakset);
 */
SDL_strpbrk: {
      parameters: ["pointer", "pointer"],
      result: "pointer"
    },


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
 * @from SDL_stdinc.h:4027 Uint32 SDL_StepUTF8(const char **pstr, size_t *pslen);
 */
SDL_StepUTF8: {
      parameters: ["pointer", "pointer"],
      result: "u32"
    },


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
 * @from SDL_stdinc.h:4058 Uint32 SDL_StepBackUTF8(const char *start, const char **pstr);
 */
SDL_StepBackUTF8: {
      parameters: ["pointer", "pointer"],
      result: "u32"
    },


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
 * @from SDL_stdinc.h:4087 char * SDL_UCS4ToUTF8(Uint32 codepoint, char *dst);
 */
SDL_UCS4ToUTF8: {
      parameters: ["u32", "pointer"],
      result: "pointer"
    },


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
 * @from SDL_stdinc.h:4299 void SDL_srand(Uint64 seed);
 */
SDL_srand: {
      parameters: ["u64"],
      result: "void"
    },


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
 * @from SDL_stdinc.h:4333 Sint32 SDL_rand(Sint32 n);
 */
SDL_rand: {
      parameters: ["i32"],
      result: "i32"
    },


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
 * @from SDL_stdinc.h:4356 float SDL_randf(void);
 */
SDL_randf: {
      parameters: [],
      result: "f32"
    },


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
 * @from SDL_stdinc.h:4379 Uint32 SDL_rand_bits(void);
 */
SDL_rand_bits: {
      parameters: [],
      result: "u32"
    },


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
 * @from SDL_stdinc.h:4414 Sint32 SDL_rand_r(Uint64 *state, Sint32 n);
 */
SDL_rand_r: {
      parameters: ["pointer", "i32"],
      result: "i32"
    },


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
 * @from SDL_stdinc.h:4441 float SDL_randf_r(Uint64 *state);
 */
SDL_randf_r: {
      parameters: ["pointer"],
      result: "f32"
    },


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
 * @from SDL_stdinc.h:4466 Uint32 SDL_rand_bits_r(Uint64 *state);
 */
SDL_rand_bits_r: {
      parameters: ["pointer"],
      result: "u32"
    },


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
 * @from SDL_stdinc.h:4520 double SDL_acos(double x);
 */
SDL_acos: {
      parameters: ["f64"],
      result: "f64"
    },


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
 * @from SDL_stdinc.h:4550 float SDL_acosf(float x);
 */
SDL_acosf: {
      parameters: ["f32"],
      result: "f32"
    },


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
 * @from SDL_stdinc.h:4580 double SDL_asin(double x);
 */
SDL_asin: {
      parameters: ["f64"],
      result: "f64"
    },


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
 * @from SDL_stdinc.h:4610 float SDL_asinf(float x);
 */
SDL_asinf: {
      parameters: ["f32"],
      result: "f32"
    },


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
 * @from SDL_stdinc.h:4642 double SDL_atan(double x);
 */
SDL_atan: {
      parameters: ["f64"],
      result: "f64"
    },


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
 * @from SDL_stdinc.h:4674 float SDL_atanf(float x);
 */
SDL_atanf: {
      parameters: ["f32"],
      result: "f32"
    },


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
 * @from SDL_stdinc.h:4710 double SDL_atan2(double y, double x);
 */
SDL_atan2: {
      parameters: ["f64", "f64"],
      result: "f64"
    },


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
 * @from SDL_stdinc.h:4746 float SDL_atan2f(float y, float x);
 */
SDL_atan2f: {
      parameters: ["f32", "f32"],
      result: "f32"
    },


/**
 * Compute the ceiling of `x`.
 *
 * The ceiling of `x` is the smallest integer `y` such that `y >= x`, i.e `x`
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
 * @from SDL_stdinc.h:4774 double SDL_ceil(double x);
 */
SDL_ceil: {
      parameters: ["f64"],
      result: "f64"
    },


/**
 * Compute the ceiling of `x`.
 *
 * The ceiling of `x` is the smallest integer `y` such that `y >= x`, i.e `x`
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
 * @from SDL_stdinc.h:4802 float SDL_ceilf(float x);
 */
SDL_ceilf: {
      parameters: ["f32"],
      result: "f32"
    },


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
 * @from SDL_stdinc.h:4828 double SDL_copysign(double x, double y);
 */
SDL_copysign: {
      parameters: ["f64", "f64"],
      result: "f64"
    },


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
 * @from SDL_stdinc.h:4854 float SDL_copysignf(float x, float y);
 */
SDL_copysignf: {
      parameters: ["f32", "f32"],
      result: "f32"
    },


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
 * @from SDL_stdinc.h:4882 double SDL_cos(double x);
 */
SDL_cos: {
      parameters: ["f64"],
      result: "f64"
    },


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
 * @from SDL_stdinc.h:4910 float SDL_cosf(float x);
 */
SDL_cosf: {
      parameters: ["f32"],
      result: "f32"
    },


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
 * @from SDL_stdinc.h:4942 double SDL_exp(double x);
 */
SDL_exp: {
      parameters: ["f64"],
      result: "f64"
    },


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
 * @from SDL_stdinc.h:4974 float SDL_expf(float x);
 */
SDL_expf: {
      parameters: ["f32"],
      result: "f32"
    },


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
 * @from SDL_stdinc.h:4995 double SDL_fabs(double x);
 */
SDL_fabs: {
      parameters: ["f64"],
      result: "f64"
    },


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
 * @from SDL_stdinc.h:5016 float SDL_fabsf(float x);
 */
SDL_fabsf: {
      parameters: ["f32"],
      result: "f32"
    },


/**
 * Compute the floor of `x`.
 *
 * The floor of `x` is the largest integer `y` such that `y <= x`, i.e `x`
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
 * @from SDL_stdinc.h:5044 double SDL_floor(double x);
 */
SDL_floor: {
      parameters: ["f64"],
      result: "f64"
    },


/**
 * Compute the floor of `x`.
 *
 * The floor of `x` is the largest integer `y` such that `y <= x`, i.e `x`
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
 * @from SDL_stdinc.h:5072 float SDL_floorf(float x);
 */
SDL_floorf: {
      parameters: ["f32"],
      result: "f32"
    },


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
 * @from SDL_stdinc.h:5101 double SDL_trunc(double x);
 */
SDL_trunc: {
      parameters: ["f64"],
      result: "f64"
    },


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
 * @from SDL_stdinc.h:5130 float SDL_truncf(float x);
 */
SDL_truncf: {
      parameters: ["f32"],
      result: "f32"
    },


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
 * @from SDL_stdinc.h:5160 double SDL_fmod(double x, double y);
 */
SDL_fmod: {
      parameters: ["f64", "f64"],
      result: "f64"
    },


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
 * @from SDL_stdinc.h:5190 float SDL_fmodf(float x, float y);
 */
SDL_fmodf: {
      parameters: ["f32", "f32"],
      result: "f32"
    },


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
 * @from SDL_stdinc.h:5204 int SDL_isinf(double x);
 */
SDL_isinf: {
      parameters: ["f64"],
      result: "i32"
    },


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
 * @from SDL_stdinc.h:5218 int SDL_isinff(float x);
 */
SDL_isinff: {
      parameters: ["f32"],
      result: "i32"
    },


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
 * @from SDL_stdinc.h:5232 int SDL_isnan(double x);
 */
SDL_isnan: {
      parameters: ["f64"],
      result: "i32"
    },


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
 * @from SDL_stdinc.h:5246 int SDL_isnanf(float x);
 */
SDL_isnanf: {
      parameters: ["f32"],
      result: "i32"
    },


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
 * @from SDL_stdinc.h:5276 double SDL_log(double x);
 */
SDL_log: {
      parameters: ["f64"],
      result: "f64"
    },


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
 * @from SDL_stdinc.h:5305 float SDL_logf(float x);
 */
SDL_logf: {
      parameters: ["f32"],
      result: "f32"
    },


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
 * @from SDL_stdinc.h:5335 double SDL_log10(double x);
 */
SDL_log10: {
      parameters: ["f64"],
      result: "f64"
    },


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
 * @from SDL_stdinc.h:5365 float SDL_log10f(float x);
 */
SDL_log10f: {
      parameters: ["f32"],
      result: "f32"
    },


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
 * @from SDL_stdinc.h:5385 double SDL_modf(double x, double *y);
 */
SDL_modf: {
      parameters: ["f64", "pointer"],
      result: "f64"
    },


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
 * @from SDL_stdinc.h:5405 float SDL_modff(float x, float *y);
 */
SDL_modff: {
      parameters: ["f32", "pointer"],
      result: "f32"
    },


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
 * @from SDL_stdinc.h:5437 double SDL_pow(double x, double y);
 */
SDL_pow: {
      parameters: ["f64", "f64"],
      result: "f64"
    },


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
 * @from SDL_stdinc.h:5469 float SDL_powf(float x, float y);
 */
SDL_powf: {
      parameters: ["f32", "f32"],
      result: "f32"
    },


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
 * @from SDL_stdinc.h:5498 double SDL_round(double x);
 */
SDL_round: {
      parameters: ["f64"],
      result: "f64"
    },


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
 * @from SDL_stdinc.h:5527 float SDL_roundf(float x);
 */
SDL_roundf: {
      parameters: ["f32"],
      result: "f32"
    },


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
 * @from SDL_stdinc.h:5556 long SDL_lround(double x);
 */
SDL_lround: {
      parameters: ["f64"],
      result: "i64"
    },


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
 * @from SDL_stdinc.h:5585 long SDL_lroundf(float x);
 */
SDL_lroundf: {
      parameters: ["f32"],
      result: "i64"
    },


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
 * @from SDL_stdinc.h:5610 double SDL_scalbn(double x, int n);
 */
SDL_scalbn: {
      parameters: ["f64", "i32"],
      result: "f64"
    },


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
 * @from SDL_stdinc.h:5635 float SDL_scalbnf(float x, int n);
 */
SDL_scalbnf: {
      parameters: ["f32", "i32"],
      result: "f32"
    },


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
 * @from SDL_stdinc.h:5663 double SDL_sin(double x);
 */
SDL_sin: {
      parameters: ["f64"],
      result: "f64"
    },


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
 * @from SDL_stdinc.h:5691 float SDL_sinf(float x);
 */
SDL_sinf: {
      parameters: ["f32"],
      result: "f32"
    },


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
 * @from SDL_stdinc.h:5717 double SDL_sqrt(double x);
 */
SDL_sqrt: {
      parameters: ["f64"],
      result: "f64"
    },


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
 * @from SDL_stdinc.h:5743 float SDL_sqrtf(float x);
 */
SDL_sqrtf: {
      parameters: ["f32"],
      result: "f32"
    },


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
 * @from SDL_stdinc.h:5773 double SDL_tan(double x);
 */
SDL_tan: {
      parameters: ["f64"],
      result: "f64"
    },


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
 * @from SDL_stdinc.h:5803 float SDL_tanf(float x);
 */
SDL_tanf: {
      parameters: ["f32"],
      result: "f32"
    },


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
 * @from SDL_stdinc.h:5917 char * SDL_iconv_string(const char *tocode, const char *fromcode, const char *inbuf, size_t inbytesleft);
 */
SDL_iconv_string: {
      parameters: ["pointer", "pointer", "pointer", "usize"],
      result: "pointer"
    },

} as const satisfies Deno.ForeignLibraryInterface;
