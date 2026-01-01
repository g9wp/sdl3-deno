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

/**
 * @from SDL_thread:283 SDL_PROP_THREAD_CREATE_
 */
export enum PROP_THREAD_CREATE {
  ENTRY_FUNCTION_POINTER = "SDL.thread.create.entry_function", 
  NAME_STRING = "SDL.thread.create.name", 
  USERDATA_POINTER = "SDL.thread.create.userdata", 
  STACKSIZE_NUMBER = "SDL.thread.create.stacksize", 
}



/**
 * The SDL thread priority.
 *
 * SDL will make system changes as necessary in order to apply the thread
 * priority. Code which attempts to control thread state related to priority
 * should be aware that calling SDL_SetCurrentThreadPriority may alter such
 * state. SDL_HINT_THREAD_PRIORITY_POLICY can be used to control aspects of
 * this behavior.
 *
 * @since This enum is available since SDL 3.2.0.
 *
 * @from SDL_thread.h:110 SDL_THREAD_PRIORITY_
 */
export enum SDL_ThreadPriority {
  LOW, 
  NORMAL, 
  HIGH, 
  TIME_CRITICAL, 
}



/**
 * The SDL thread state.
 *
 * The current state of a thread can be checked by calling SDL_GetThreadState.
 *
 * @since This enum is available since SDL 3.2.0.
 *
 * @sa SDL_GetThreadState
 *
 * @from SDL_thread.h:126 SDL_THREAD_
 */
export enum SDL_ThreadState {
  UNKNOWN, /**< The thread is not valid */
  ALIVE, /**< The thread is currently running */
  DETACHED, /**< The thread is detached and can't be waited on */
  COMPLETE, /**< The thread has finished and should be cleaned up with SDL_WaitThread() */
}



