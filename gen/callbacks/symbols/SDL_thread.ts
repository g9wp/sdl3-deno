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
 * good understanding of [CategoryMutex](CategoryMutex) as well.
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
 * The callback used to cleanup data passed to SDL_SetTLS.
 *
 * This is called when a thread exits, to allow an app to free any resources.
 *
 * @param value a pointer previously handed to SDL_SetTLS.
 *
 * @since This datatype is available since SDL 3.2.0.
 *
 * @sa SDL_SetTLS
 *
 * @from SDL_thread.h:528 typedef void (*SDL_TLSDestructorCallback)(void *value);
 */
SDL_TLSDestructorCallback: {
      parameters: ["pointer"],
      result: "void"
    },

} as const satisfies Deno.ForeignLibraryInterface;


/**
 * The callback used to cleanup data passed to SDL_SetTLS.
 *
 * This is called when a thread exits, to allow an app to free any resources.
 *
 * @param value a pointer previously handed to SDL_SetTLS.
 *
 * @since This datatype is available since SDL 3.2.0.
 *
 * @sa SDL_SetTLS
 *
 * @from SDL_thread.h:528 typedef void (*SDL_TLSDestructorCallback)(void *value);
 */
export function TLSDestructorCallback(cb: (
    value: Deno.PointerValue, 
  ) => void) {
  return new Deno.UnsafeCallback(symbols.SDL_TLSDestructorCallback, cb);
}

