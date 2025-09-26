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

/**
 * @from SDL_init:79 SDL_INIT_
 */
export enum INIT {
  AUDIO = 0x00000010, /**< `SDL_INIT_AUDIO` implies `SDL_INIT_EVENTS` */
  VIDEO = 0x00000020, /**< `SDL_INIT_VIDEO` implies `SDL_INIT_EVENTS`, should be initialized on the main thread */
  JOYSTICK = 0x00000200, /**< `SDL_INIT_JOYSTICK` implies `SDL_INIT_EVENTS` */
  HAPTIC = 0x00001000, 
  GAMEPAD = 0x00002000, /**< `SDL_INIT_GAMEPAD` implies `SDL_INIT_JOYSTICK` */
  EVENTS = 0x00004000, 
  SENSOR = 0x00008000, /**< `SDL_INIT_SENSOR` implies `SDL_INIT_EVENTS` */
  CAMERA = 0x00010000, /**< `SDL_INIT_CAMERA` implies `SDL_INIT_EVENTS` */
}



/**
 * @from SDL_init:459 SDL_PROP_APP_METADATA_
 */
export enum PROP_APP_METADATA {
  NAME_STRING = "SDL.app.metadata.name", 
  VERSION_STRING = "SDL.app.metadata.version", 
  IDENTIFIER_STRING = "SDL.app.metadata.identifier", 
  CREATOR_STRING = "SDL.app.metadata.creator", 
  COPYRIGHT_STRING = "SDL.app.metadata.copyright", 
  URL_STRING = "SDL.app.metadata.url", 
  TYPE_STRING = "SDL.app.metadata.type", 
}



/**
 * Return values for optional main callbacks.
 *
 * Returning SDL_APP_SUCCESS or SDL_APP_FAILURE from SDL_AppInit,
 * SDL_AppEvent, or SDL_AppIterate will terminate the program and report
 * success/failure to the operating system. What that means is
 * platform-dependent. On Unix, for example, on success, the process error
 * code will be zero, and on failure it will be 1. This interface doesn't
 * allow you to return specific exit codes, just whether there was an error
 * generally or not.
 *
 * Returning SDL_APP_CONTINUE from these functions will let the app continue
 * to run.
 *
 * See
 * [Main callbacks in SDL3](https://wiki.libsdl.org/SDL3/README/main-functions#main-callbacks-in-sdl3)
 * for complete details.
 *
 * @since This enum is available since SDL 3.2.0.
 *
 * @from SDL_init.h:108 SDL_APP_
 */
export enum SDL_AppResult {
  CONTINUE, /**< Value that requests that the app continue from the main callbacks. */
  SUCCESS, /**< Value that requests termination with success from the main callbacks. */
  FAILURE, /**< Value that requests termination with error from the main callbacks. */
}



