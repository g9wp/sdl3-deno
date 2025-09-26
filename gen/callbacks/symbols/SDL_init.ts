/**
 * # CategoryInit
 *
 * All SDL programs need to initialize the library before starting to work
 * with it.
 *
 * Almost everything can simply call SDL_Init() near startup, with a handful
 * of flags to specify subsystems to touch. These are here to make sure SDL
 * does not even attempt to touch low-level pieces of the operating system
 * that you don't intend to use. For example, you might be using SDL for video
 * and input but chose an external library for audio, and in this case you
 * would just need to leave off the `SDL_INIT_AUDIO` flag to make sure that
 * external library has complete control.
 *
 * Most apps, when terminating, should call SDL_Quit(). This will clean up
 * (nearly) everything that SDL might have allocated, and crucially, it'll
 * make sure that the display's resolution is back to what the user expects if
 * you had previously changed it for your game.
 *
 * SDL3 apps are strongly encouraged to call SDL_SetAppMetadata() at startup
 * to fill in details about the program. This is completely optional, but it
 * helps in small ways (we can provide an About dialog box for the macOS menu,
 * we can name the app in the system's audio mixer, etc). Those that want to
 * provide a _lot_ of information should look at the more-detailed
 * SDL_SetAppMetadataProperty().
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
 * Function pointer typedef for SDL_AppInit.
 *
 * These are used by SDL_EnterAppMainCallbacks. This mechanism operates behind
 * the scenes for apps using the optional main callbacks. Apps that want to
 * use this should just implement SDL_AppInit directly.
 *
 * @param appstate a place where the app can optionally store a pointer for
 *                 future use.
 * @param argc the standard ANSI C main's argc; number of elements in `argv`.
 * @param argv the standard ANSI C main's argv; array of command line
 *             arguments.
 * @returns SDL_APP_FAILURE to terminate with an error, SDL_APP_SUCCESS to
 *          terminate with success, SDL_APP_CONTINUE to continue.
 *
 * @since This datatype is available since SDL 3.2.0.
 *
 * @from SDL_init.h:132 typedef SDL_AppResult (*SDL_AppInit_func)(void **appstate, int argc, char *argv[]);
 */
SDL_AppInit_func: {
      parameters: ["pointer", "i32", "pointer"],
      result: "u32"
    },

/**
 * Function pointer typedef for SDL_AppIterate.
 *
 * These are used by SDL_EnterAppMainCallbacks. This mechanism operates behind
 * the scenes for apps using the optional main callbacks. Apps that want to
 * use this should just implement SDL_AppIterate directly.
 *
 * @param appstate an optional pointer, provided by the app in SDL_AppInit.
 * @returns SDL_APP_FAILURE to terminate with an error, SDL_APP_SUCCESS to
 *          terminate with success, SDL_APP_CONTINUE to continue.
 *
 * @since This datatype is available since SDL 3.2.0.
 *
 * @from SDL_init.h:147 typedef SDL_AppResult (*SDL_AppIterate_func)(void *appstate);
 */
SDL_AppIterate_func: {
      parameters: ["pointer"],
      result: "u32"
    },

/**
 * Function pointer typedef for SDL_AppEvent.
 *
 * These are used by SDL_EnterAppMainCallbacks. This mechanism operates behind
 * the scenes for apps using the optional main callbacks. Apps that want to
 * use this should just implement SDL_AppEvent directly.
 *
 * @param appstate an optional pointer, provided by the app in SDL_AppInit.
 * @param event the new event for the app to examine.
 * @returns SDL_APP_FAILURE to terminate with an error, SDL_APP_SUCCESS to
 *          terminate with success, SDL_APP_CONTINUE to continue.
 *
 * @since This datatype is available since SDL 3.2.0.
 *
 * @from SDL_init.h:163 typedef SDL_AppResult (*SDL_AppEvent_func)(void *appstate, SDL_Event *event);
 */
SDL_AppEvent_func: {
      parameters: ["pointer", "pointer"],
      result: "u32"
    },

/**
 * Function pointer typedef for SDL_AppQuit.
 *
 * These are used by SDL_EnterAppMainCallbacks. This mechanism operates behind
 * the scenes for apps using the optional main callbacks. Apps that want to
 * use this should just implement SDL_AppEvent directly.
 *
 * @param appstate an optional pointer, provided by the app in SDL_AppInit.
 * @param result the result code that terminated the app (success or failure).
 *
 * @since This datatype is available since SDL 3.2.0.
 *
 * @from SDL_init.h:177 typedef void (*SDL_AppQuit_func)(void *appstate, SDL_AppResult result);
 */
SDL_AppQuit_func: {
      parameters: ["pointer", "u32"],
      result: "void"
    },

/**
 * Callback run on the main thread.
 *
 * @param userdata an app-controlled pointer that is passed to the callback.
 *
 * @since This datatype is available since SDL 3.2.0.
 *
 * @sa SDL_RunOnMainThread
 *
 * @from SDL_init.h:330 typedef void (*SDL_MainThreadCallback)(void *userdata);
 */
SDL_MainThreadCallback: {
      parameters: ["pointer"],
      result: "void"
    },

} as const satisfies Deno.ForeignLibraryInterface;


/**
 * Function pointer typedef for SDL_AppInit.
 *
 * These are used by SDL_EnterAppMainCallbacks. This mechanism operates behind
 * the scenes for apps using the optional main callbacks. Apps that want to
 * use this should just implement SDL_AppInit directly.
 *
 * @param appstate a place where the app can optionally store a pointer for
 *                 future use.
 * @param argc the standard ANSI C main's argc; number of elements in `argv`.
 * @param argv the standard ANSI C main's argv; array of command line
 *             arguments.
 * @returns SDL_APP_FAILURE to terminate with an error, SDL_APP_SUCCESS to
 *          terminate with success, SDL_APP_CONTINUE to continue.
 *
 * @since This datatype is available since SDL 3.2.0.
 *
 * @from SDL_init.h:132 typedef SDL_AppResult (*SDL_AppInit_func)(void **appstate, int argc, char *argv[]);
 */
export function AppInit_func(cb: (
    appstate: Deno.PointerValue, 
    argc: number, 
    argv: Deno.PointerValue, 
  ) => number) {
  return new Deno.UnsafeCallback(symbols.SDL_AppInit_func, cb);
}

/**
 * Function pointer typedef for SDL_AppIterate.
 *
 * These are used by SDL_EnterAppMainCallbacks. This mechanism operates behind
 * the scenes for apps using the optional main callbacks. Apps that want to
 * use this should just implement SDL_AppIterate directly.
 *
 * @param appstate an optional pointer, provided by the app in SDL_AppInit.
 * @returns SDL_APP_FAILURE to terminate with an error, SDL_APP_SUCCESS to
 *          terminate with success, SDL_APP_CONTINUE to continue.
 *
 * @since This datatype is available since SDL 3.2.0.
 *
 * @from SDL_init.h:147 typedef SDL_AppResult (*SDL_AppIterate_func)(void *appstate);
 */
export function AppIterate_func(cb: (
    appstate: Deno.PointerValue, 
  ) => number) {
  return new Deno.UnsafeCallback(symbols.SDL_AppIterate_func, cb);
}

/**
 * Function pointer typedef for SDL_AppEvent.
 *
 * These are used by SDL_EnterAppMainCallbacks. This mechanism operates behind
 * the scenes for apps using the optional main callbacks. Apps that want to
 * use this should just implement SDL_AppEvent directly.
 *
 * @param appstate an optional pointer, provided by the app in SDL_AppInit.
 * @param event the new event for the app to examine.
 * @returns SDL_APP_FAILURE to terminate with an error, SDL_APP_SUCCESS to
 *          terminate with success, SDL_APP_CONTINUE to continue.
 *
 * @since This datatype is available since SDL 3.2.0.
 *
 * @from SDL_init.h:163 typedef SDL_AppResult (*SDL_AppEvent_func)(void *appstate, SDL_Event *event);
 */
export function AppEvent_func(cb: (
    appstate: Deno.PointerValue, 
    event: Deno.PointerValue, 
  ) => number) {
  return new Deno.UnsafeCallback(symbols.SDL_AppEvent_func, cb);
}

/**
 * Function pointer typedef for SDL_AppQuit.
 *
 * These are used by SDL_EnterAppMainCallbacks. This mechanism operates behind
 * the scenes for apps using the optional main callbacks. Apps that want to
 * use this should just implement SDL_AppEvent directly.
 *
 * @param appstate an optional pointer, provided by the app in SDL_AppInit.
 * @param result the result code that terminated the app (success or failure).
 *
 * @since This datatype is available since SDL 3.2.0.
 *
 * @from SDL_init.h:177 typedef void (*SDL_AppQuit_func)(void *appstate, SDL_AppResult result);
 */
export function AppQuit_func(cb: (
    appstate: Deno.PointerValue, 
    result: number, 
  ) => void) {
  return new Deno.UnsafeCallback(symbols.SDL_AppQuit_func, cb);
}

/**
 * Callback run on the main thread.
 *
 * @param userdata an app-controlled pointer that is passed to the callback.
 *
 * @since This datatype is available since SDL 3.2.0.
 *
 * @sa SDL_RunOnMainThread
 *
 * @from SDL_init.h:330 typedef void (*SDL_MainThreadCallback)(void *userdata);
 */
export function MainThreadCallback(cb: (
    userdata: Deno.PointerValue, 
  ) => void) {
  return new Deno.UnsafeCallback(symbols.SDL_MainThreadCallback, cb);
}

