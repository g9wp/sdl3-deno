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
 * @from SDL_thread:296
 */
export const SDL_BeginThreadFunction = _beginthreadex;

/**
 * @from SDL_thread:299
 */
export const SDL_EndThreadFunction = _endthreadex;

/**
 * @from SDL_thread:307
 */
export const SDL_BeginThreadFunction = NULL;

/**
 * @from SDL_thread:313
 */
export const SDL_EndThreadFunction = NULL;

