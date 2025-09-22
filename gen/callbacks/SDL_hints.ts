/**
 * # CategoryHints
 *
 * This file contains functions to set and get configuration hints, as well as
 * listing each of them alphabetically.
 *
 * The convention for naming hints is SDL_HINT_X, where "SDL_X" is the
 * environment variable that can be used to override the default.
 *
 * In general these hints are just that - they may or may not be supported or
 * applicable on any given platform, but they provide a way for an application
 * or user to give the library a hint as to how they would like the library to
 * work.
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

export const callbacks = {
/**
 * A callback used to send notifications of hint value changes.
 *
 * This is called an initial time during SDL_AddHintCallback with the hint's
 * current value, and then again each time the hint's value changes.
 *
 * @param userdata what was passed as `userdata` to SDL_AddHintCallback().
 * @param name what was passed as `name` to SDL_AddHintCallback().
 * @param oldValue the previous hint value.
 * @param newValue the new value hint is to be set to.
 *
 * @threadsafety This callback is fired from whatever thread is setting a new
 *               hint value. SDL holds a lock on the hint subsystem when
 *               calling this callback.
 *
 * @since This datatype is available since SDL 3.2.0.
 *
 * @sa SDL_AddHintCallback
 *
 * @from SDL_hints.h:4438 typedef void(*SDL_HintCallback)(void *userdata, const char *name, const char *oldValue, const char *newValue);
 */
SDL_HintCallback: {
      parameters: ["pointer", "pointer", "pointer", "pointer"],
      result: "void"
    },

} as const;


/**
 * A callback used to send notifications of hint value changes.
 *
 * This is called an initial time during SDL_AddHintCallback with the hint's
 * current value, and then again each time the hint's value changes.
 *
 * @param userdata what was passed as `userdata` to SDL_AddHintCallback().
 * @param name what was passed as `name` to SDL_AddHintCallback().
 * @param oldValue the previous hint value.
 * @param newValue the new value hint is to be set to.
 *
 * @threadsafety This callback is fired from whatever thread is setting a new
 *               hint value. SDL holds a lock on the hint subsystem when
 *               calling this callback.
 *
 * @since This datatype is available since SDL 3.2.0.
 *
 * @sa SDL_AddHintCallback
 *
 * @from SDL_hints.h:4438 typedef void(*SDL_HintCallback)(void *userdata, const char *name, const char *oldValue, const char *newValue);
 */
export function HintCallback(cb: (
    userdata: Deno.PointerValue, 
    name: Deno.PointerValue, 
    oldValue: Deno.PointerValue, 
    newValue: Deno.PointerValue, 
  ) => void) {
  return new Deno.UnsafeCallback(callbacks.SDL_HintCallback, cb);
}

