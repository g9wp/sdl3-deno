/**
 * # CategoryThread
 *
 * SDL offers cross-platform thread management functions. These are mostly
 * concerned with starting threads, setting their priority, and dealing with
 * their termination.
 *
 * In addition, there is support for Thread Local Storage (data that is unique
 * to each thread, but accessed from a single key).
 *
 * On platforms without thread support (such as Emscripten when built without
 * pthreads), these functions still exist, but things like SDL_CreateThread()
 * will report failure without doing anything.
 *
 * If you're going to work with threads, you almost certainly need to have a
 * good understanding of thread safety measures: locking and synchronization
 * mechanisms are handled by the functions in SDL_mutex.h.
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
 * Create a new thread with with the specified properties.
 *
 * These are the supported properties:
 *
 * - `SDL_PROP_THREAD_CREATE_ENTRY_FUNCTION_POINTER`: an SDL_ThreadFunction
 *   value that will be called at the start of the new thread's life.
 *   Required.
 * - `SDL_PROP_THREAD_CREATE_NAME_STRING`: the name of the new thread, which
 *   might be available to debuggers. Optional, defaults to NULL.
 * - `SDL_PROP_THREAD_CREATE_USERDATA_POINTER`: an arbitrary app-defined
 *   pointer, which is passed to the entry function on the new thread, as its
 *   only parameter. Optional, defaults to NULL.
 * - `SDL_PROP_THREAD_CREATE_STACKSIZE_NUMBER`: the size, in bytes, of the new
 *   thread's stack. Optional, defaults to 0 (system-defined default).
 *
 * SDL makes an attempt to report `SDL_PROP_THREAD_CREATE_NAME_STRING` to the
 * system, so that debuggers can display it. Not all platforms support this.
 *
 * Thread naming is a little complicated: Most systems have very small limits
 * for the string length (Haiku has 32 bytes, Linux currently has 16, Visual
 * C++ 6.0 has _nine_!), and possibly other arbitrary rules. You'll have to
 * see what happens with your system's debugger. The name should be UTF-8 (but
 * using the naming limits of C identifiers is a better bet). There are no
 * requirements for thread naming conventions, so long as the string is
 * null-terminated UTF-8, but these guidelines are helpful in choosing a name:
 *
 * https://stackoverflow.com/questions/149932/naming-conventions-for-threads
 *
 * If a system imposes requirements, SDL will try to munge the string for it
 * (truncate, etc), but the original string contents will be available from
 * SDL_GetThreadName().
 *
 * The size (in bytes) of the new stack can be specified with
 * `SDL_PROP_THREAD_CREATE_STACKSIZE_NUMBER`. Zero means "use the system
 * default" which might be wildly different between platforms. x86 Linux
 * generally defaults to eight megabytes, an embedded device might be a few
 * kilobytes instead. You generally need to specify a stack that is a multiple
 * of the system's page size (in many cases, this is 4 kilobytes, but check
 * your system documentation).
 *
 * Note that this "function" is actually a macro that calls an internal
 * function with two extra parameters not listed here; they are hidden through
 * preprocessor macros and are needed to support various C runtimes at the
 * point of the function call. Language bindings that aren't using the C
 * headers will need to deal with this.
 *
 * The actual symbol in SDL is `SDL_CreateThreadWithPropertiesRuntime`, so
 * there is no symbol clash, but trying to load an SDL shared library and look
 * for "SDL_CreateThreadWithProperties" will fail.
 *
 * Usually, apps should just call this function the same way on every platform
 * and let the macros hide the details.
 *
 * @param props the properties to use.
 * @returns an opaque pointer to the new thread object on success, NULL if the
 *          new thread could not be created; call SDL_GetError() for more
 *          information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_CreateThread
 * @sa SDL_WaitThread
 *
 * @from SDL_thread.h:281 SDL_Thread * SDL_CreateThreadWithProperties(SDL_PropertiesID props);
 */
/*SDL_CreateThreadWithProperties: {
      parameters: ["u32"],
      result: "pointer"
    },*/


/**
 * The actual entry point for SDL_CreateThreadWithProperties.
 *
 * @param props the properties to use
 * @param pfnBeginThread the C runtime's _beginthreadex (or whatnot). Can be NULL.
 * @param pfnEndThread the C runtime's _endthreadex (or whatnot). Can be NULL.
 * @returns an opaque pointer to the new thread object on success, NULL if the
 *          new thread could not be created; call SDL_GetError() for more
 *          information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_thread.h:347 SDL_Thread * SDL_CreateThreadWithPropertiesRuntime(SDL_PropertiesID props, SDL_FunctionPointer pfnBeginThread, SDL_FunctionPointer pfnEndThread);
 */
SDL_CreateThreadWithPropertiesRuntime: {
      parameters: ["u32", "function", "function"],
      result: "pointer"
    },


/**
 * Get the thread name as it was specified in SDL_CreateThread().
 *
 * @param thread the thread to query.
 * @returns a pointer to a UTF-8 string that names the specified thread, or
 *          NULL if it doesn't have a name.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_thread.h:367 const char * SDL_GetThreadName(SDL_Thread *thread);
 */
SDL_GetThreadName: {
      parameters: ["pointer"],
      result: "pointer"
    },


/**
 * Get the thread identifier for the current thread.
 *
 * This thread identifier is as reported by the underlying operating system.
 * If SDL is running on a platform that does not support threads the return
 * value will always be zero.
 *
 * This function also returns a valid thread ID when called from the main
 * thread.
 *
 * @returns the ID of the current thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetThreadID
 *
 * @from SDL_thread.h:385 SDL_ThreadID SDL_GetCurrentThreadID(void);
 */
SDL_GetCurrentThreadID: {
      parameters: [],
      result: "u64"
    },


/**
 * Get the thread identifier for the specified thread.
 *
 * This thread identifier is as reported by the underlying operating system.
 * If SDL is running on a platform that does not support threads the return
 * value will always be zero.
 *
 * @param thread the thread to query.
 * @returns the ID of the specified thread, or the ID of the current thread if
 *          `thread` is NULL.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetCurrentThreadID
 *
 * @from SDL_thread.h:402 SDL_ThreadID SDL_GetThreadID(SDL_Thread *thread);
 */
SDL_GetThreadID: {
      parameters: ["pointer"],
      result: "u64"
    },


/**
 * Set the priority for the current thread.
 *
 * Note that some platforms will not let you alter the priority (or at least,
 * promote the thread to a higher priority) at all, and some require you to be
 * an administrator account. Be prepared for this to fail.
 *
 * @param priority the SDL_ThreadPriority to set.
 * @returns true on success or false on failure; call SDL_GetError() for more
 *          information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_thread.h:417 bool SDL_SetCurrentThreadPriority(SDL_ThreadPriority priority);
 */
SDL_SetCurrentThreadPriority: {
      parameters: ["u32"],
      result: "bool"
    },


/**
 * Wait for a thread to finish.
 *
 * Threads that haven't been detached will remain until this function cleans
 * them up. Not doing so is a resource leak.
 *
 * Once a thread has been cleaned up through this function, the SDL_Thread
 * that references it becomes invalid and should not be referenced again. As
 * such, only one thread may call SDL_WaitThread() on another.
 *
 * The return code from the thread function is placed in the area pointed to
 * by `status`, if `status` is not NULL.
 *
 * You may not wait on a thread that has been used in a call to
 * SDL_DetachThread(). Use either that function or this one, but not both, or
 * behavior is undefined.
 *
 * It is safe to pass a NULL thread to this function; it is a no-op.
 *
 * Note that the thread pointer is freed by this function and is not valid
 * afterward.
 *
 * @param thread the SDL_Thread pointer that was returned from the
 *               SDL_CreateThread() call that started this thread.
 * @param status a pointer filled in with the value returned from the thread
 *               function by its 'return', or -1 if the thread has been
 *               detached or isn't valid, may be NULL.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_CreateThread
 * @sa SDL_DetachThread
 *
 * @from SDL_thread.h:452 void SDL_WaitThread(SDL_Thread *thread, int *status);
 */
SDL_WaitThread: {
      parameters: ["pointer", "pointer"],
      result: "void"
    },


/**
 * Get the current state of a thread.
 *
 * @param thread the thread to query.
 * @returns the current state of a thread, or SDL_THREAD_UNKNOWN if the thread
 *          isn't valid.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_ThreadState
 *
 * @from SDL_thread.h:465 SDL_ThreadState SDL_GetThreadState(SDL_Thread *thread);
 */
SDL_GetThreadState: {
      parameters: ["pointer"],
      result: "u32"
    },


/**
 * Let a thread clean up on exit without intervention.
 *
 * A thread may be "detached" to signify that it should not remain until
 * another thread has called SDL_WaitThread() on it. Detaching a thread is
 * useful for long-running threads that nothing needs to synchronize with or
 * further manage. When a detached thread is done, it simply goes away.
 *
 * There is no way to recover the return code of a detached thread. If you
 * need this, don't detach the thread and instead use SDL_WaitThread().
 *
 * Once a thread is detached, you should usually assume the SDL_Thread isn't
 * safe to reference again, as it will become invalid immediately upon the
 * detached thread's exit, instead of remaining until someone has called
 * SDL_WaitThread() to finally clean it up. As such, don't detach the same
 * thread more than once.
 *
 * If a thread has already exited when passed to SDL_DetachThread(), it will
 * stop waiting for a call to SDL_WaitThread() and clean up immediately. It is
 * not safe to detach a thread that might be used with SDL_WaitThread().
 *
 * You may not call SDL_WaitThread() on a thread that has been detached. Use
 * either that function or this one, but not both, or behavior is undefined.
 *
 * It is safe to pass NULL to this function; it is a no-op.
 *
 * @param thread the SDL_Thread pointer that was returned from the
 *               SDL_CreateThread() call that started this thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_CreateThread
 * @sa SDL_WaitThread
 *
 * @from SDL_thread.h:501 void SDL_DetachThread(SDL_Thread *thread);
 */
SDL_DetachThread: {
      parameters: ["pointer"],
      result: "void"
    },


/**
 * Get the current thread's value associated with a thread local storage ID.
 *
 * @param id a pointer to the thread local storage ID, may not be NULL.
 * @returns the value associated with the ID for the current thread or NULL if
 *          no value has been set; call SDL_GetError() for more information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_SetTLS
 *
 * @from SDL_thread.h:516 void * SDL_GetTLS(SDL_TLSID *id);
 */
SDL_GetTLS: {
      parameters: ["pointer"],
      result: "pointer"
    },


/**
 * Set the current thread's value associated with a thread local storage ID.
 *
 * If the thread local storage ID is not initialized (the value is 0), a new
 * ID will be created in a thread-safe way, so all calls using a pointer to
 * the same ID will refer to the same local storage.
 *
 * Note that replacing a value from a previous call to this function on the
 * same thread does _not_ call the previous value's destructor!
 *
 * `destructor` can be NULL; it is assumed that `value` does not need to be
 * cleaned up if so.
 *
 * @param id a pointer to the thread local storage ID, may not be NULL.
 * @param value the value to associate with the ID for the current thread.
 * @param destructor a function called when the thread exits, to free the
 *                   value, may be NULL.
 * @returns true on success or false on failure; call SDL_GetError() for more
 *          information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetTLS
 *
 * @from SDL_thread.h:557 bool SDL_SetTLS(SDL_TLSID *id, const void *value, SDL_TLSDestructorCallback destructor);
 */
SDL_SetTLS: {
      parameters: ["pointer", "pointer", "function"],
      result: "bool"
    },


/**
 * Cleanup all TLS data for this thread.
 *
 * If you are creating your threads outside of SDL and then calling SDL
 * functions, you should call this function before your thread exits, to
 * properly clean up SDL memory.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_thread.h:570 void SDL_CleanupTLS(void);
 */
SDL_CleanupTLS: {
      parameters: [],
      result: "void"
    },

} as const satisfies Deno.ForeignLibraryInterface;
