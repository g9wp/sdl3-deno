/**
 * This module provides bindings and utilities for initializing and managing the SDL3 library within a Deno environment.
 * It exposes the `SdlContext` class, which encapsulates the lifecycle of the SDL library, including initialization,
 * subsystem management, and cleanup. Additionally, it re-exports common SDL constants such as `INIT` for convenience.
 *
 * Primary Exports:
 * - `SdlContext`: A class for managing SDL initialization and lifecycle.
 * - `INIT`: Constants for subsystem initialization flags.
 *
 * Usage:
 * To use this module, create an instance of `SdlContext` with the desired initialization flags. The context ensures
 * proper initialization and cleanup of SDL subsystems. Use the provided methods to manage subsystems dynamically.
 *
 * Example:
 * ```ts
 * const sdl = new SdlContext(SdlContext.INIT.VIDEO | SdlContext.INIT.AUDIO);
 * // Use SDL functionality
 * sdl.quit();
 * ```
 * @module
 */

import * as SDL from "../gen/sdl/init.ts";
import { SdlError } from "./_utils.ts";

export { INIT } from "../gen/sdl/init.ts";

/**
 * The `SdlContext` class manages the initialization and lifecycle of the SDL library.
 * It ensures that SDL is initialized only once and provides methods for managing subsystems.
 * The class also supports automatic cleanup using the `Symbol.dispose` method.
 */
export class SdlContext {
  static #inited: boolean = false;

  /**
   * Initialize the SDL library.
   *
   * SDL_Init() simply forwards to calling SDL_InitSubSystem(). Therefore, the
   * two may be used interchangeably. Though for readability of your code
   * SDL_InitSubSystem() might be preferred.
   *
   * The file I/O (for example: SDL_IOFromFile) and threading (SDL_CreateThread)
   * subsystems are initialized by default. Message boxes
   * (SDL_ShowSimpleMessageBox) also attempt to work without initializing the
   * video subsystem, in hopes of being useful in showing an error dialog when
   * SDL_Init fails. You must specifically initialize other subsystems if you
   * use them in your application.
   *
   * Logging (such as SDL_Log) works without initialization, too.
   *
   * `flags` may be any of the following OR'd together:
   *
   * - `SDL_INIT_AUDIO`: audio subsystem; automatically initializes the events
   *   subsystem
   * - `SDL_INIT_VIDEO`: video subsystem; automatically initializes the events
   *   subsystem, should be initialized on the main thread.
   * - `SDL_INIT_JOYSTICK`: joystick subsystem; automatically initializes the
   *   events subsystem
   * - `SDL_INIT_HAPTIC`: haptic (force feedback) subsystem
   * - `SDL_INIT_GAMEPAD`: gamepad subsystem; automatically initializes the
   *   joystick subsystem
   * - `SDL_INIT_EVENTS`: events subsystem
   * - `SDL_INIT_SENSOR`: sensor subsystem; automatically initializes the events
   *   subsystem
   * - `SDL_INIT_CAMERA`: camera subsystem; automatically initializes the events
   *   subsystem
   *
   * Subsystem initialization is ref-counted, you must call SDL_QuitSubSystem()
   * for each SDL_InitSubSystem() to correctly shutdown a subsystem manually (or
   * call SDL_Quit() to force shutdown). If a subsystem is already loaded then
   * this call will increase the ref-count and return.
   *
   * Consider reporting some basic metadata about your application before
   * calling SDL_Init, using either SDL_SetAppMetadata() or
   * SDL_SetAppMetadataProperty().
   *
   * @param flags subsystem initialization flags.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_SetAppMetadata
   * @sa SDL_SetAppMetadataProperty
   * @sa SDL_InitSubSystem
   * @sa SDL_Quit
   * @sa SDL_SetMainReady
   * @sa SDL_WasInit
   *
   * @from SDL_init.h:235 bool SDL_Init(SDL_InitFlags flags);
   */
  constructor(flags?: number) {
    if (SdlContext.#inited) throw new Error("only one SdlContext allowed");
    SdlContext.#inited = true;
    flags ??= SDL.INIT.VIDEO | SDL.INIT.EVENTS;
    if (!SDL.init(flags)) throw SdlError("SDL init failed");
  }

  static init(flags?: number): SdlContext {
    return new SdlContext(flags);
  }

  initSubSystem(flags: number): boolean {
    return SDL.initSubSystem(flags);
  }
  quitSubSytem(flags: number) {
    SDL.quitSubSystem(flags);
  }

  /**
   * Get a mask of the specified subsystems which are currently initialized.
   *
   * @param flags any of the flags used by SDL_Init(); see SDL_Init for details.
   * @returns a mask of all initialized subsystems if `flags` is 0, otherwise it
   *          returns the initialization status of the specified subsystems.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_Init
   * @sa SDL_InitSubSystem
   *
   * @from SDL_init.h:281 SDL_InitFlags SDL_WasInit(SDL_InitFlags flags);
   */
  wasInit(flags: number = 0): number {
    return SDL.wasInit(flags);
  }

  /**
   * Clean up all initialized subsystems.
   *
   * You should call this function even if you have already shutdown each
   * initialized subsystem with SDL_QuitSubSystem(). It is safe to call this
   * function even in the case of errors in initialization.
   *
   * You can use this function with atexit() to ensure that it is run when your
   * application is shutdown, but it is not wise to do this from a library or
   * other dynamically loaded code.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_Init
   * @sa SDL_QuitSubSystem
   *
   * @from SDL_init.h:299 void SDL_Quit(void);
   */
  quit() {
    if (!SdlContext.#inited) return;
    SDL.quit();
    SdlContext.#inited = false;
  }

  [Symbol.dispose]() {
    this.quit();
  }
}
