/**
 * # CategoryGamepad
 *
 * SDL provides a low-level joystick API, which just treats joysticks as an
 * arbitrary pile of buttons, axes, and hat switches. If you're planning to
 * write your own control configuration screen, this can give you a lot of
 * flexibility, but that's a lot of work, and most things that we consider
 * "joysticks" now are actually console-style gamepads. So SDL provides the
 * gamepad API on top of the lower-level joystick functionality.
 *
 * The difference between a joystick and a gamepad is that a gamepad tells you
 * _where_ a button or axis is on the device. You don't speak to gamepads in
 * terms of arbitrary numbers like "button 3" or "axis 2" but in standard
 * locations: the d-pad, the shoulder buttons, triggers, A/B/X/Y (or
 * X/O/Square/Triangle, if you will).
 *
 * One turns a joystick into a gamepad by providing a magic configuration
 * string, which tells SDL the details of a specific device: when you see this
 * specific hardware, if button 2 gets pressed, this is actually D-Pad Up,
 * etc.
 *
 * SDL has many popular controllers configured out of the box, and users can
 * add their own controller details through an environment variable if it's
 * otherwise unknown to SDL.
 *
 * In order to use these functions, SDL_Init() must have been called with the
 * SDL_INIT_GAMEPAD flag. This causes SDL to scan the system for gamepads, and
 * load appropriate drivers.
 *
 * If you would like to receive gamepad updates while the application is in
 * the background, you should set the following hint before calling
 * SDL_Init(): SDL_HINT_JOYSTICK_ALLOW_BACKGROUND_EVENTS
 *
 * Gamepads support various optional features such as rumble, color LEDs,
 * touchpad, gyro, etc. The support for these features varies depending on the
 * controller and OS support available. You can check for LED and rumble
 * capabilities at runtime by calling SDL_GetGamepadProperties() and checking
 * the various capability properties. You can check for touchpad by calling
 * SDL_GetNumGamepadTouchpads() and check for gyro and accelerometer by
 * calling SDL_GamepadHasSensor().
 *
 * By default SDL will try to use the most capable driver available, but you
 * can tune which OS drivers to use with the various joystick hints in
 * SDL_hints.h.
 *
 * Your application should always support gamepad hotplugging. On some
 * platforms like Xbox, Steam Deck, etc., this is a requirement for
 * certification. On other platforms, like macOS and Windows when using
 * Windows.Gaming.Input, controllers may not be available at startup and will
 * come in at some point after you've started processing events.
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
  SDL_GamepadType as GAMEPAD_TYPE,
  SDL_GamepadButton as GAMEPAD_BUTTON,
  SDL_GamepadButtonLabel as GAMEPAD_BUTTON_LABEL,
  SDL_GamepadAxis as GAMEPAD_AXIS,
  SDL_GamepadBindingType as GAMEPAD_BINDTYPE,
} from "../enums/SDL_gamepad.ts"

/**
 * Add support for gamepads that SDL is unaware of or change the binding of an
 * existing gamepad.
 *
 * The mapping string has the format "GUID,name,mapping", where GUID is the
 * string value from SDL_GUIDToString(), name is the human readable string for
 * the device and mappings are gamepad mappings to joystick ones. Under
 * Windows there is a reserved GUID of "xinput" that covers all XInput
 * devices. The mapping format for joystick is:
 *
 * - `bX`: a joystick button, index X
 * - `hX.Y`: hat X with value Y
 * - `aX`: axis X of the joystick
 *
 * Buttons can be used as a gamepad axes and vice versa.
 *
 * If a device with this GUID is already plugged in, SDL will generate an
 * SDL_EVENT_GAMEPAD_ADDED event.
 *
 * This string shows an example of a valid mapping for a gamepad:
 *
 * ```c
 * "341a3608000000000000504944564944,Afterglow PS3 Controller,a:b1,b:b2,y:b3,x:b0,start:b9,guide:b12,back:b8,dpup:h0.1,dpleft:h0.8,dpdown:h0.4,dpright:h0.2,leftshoulder:b4,rightshoulder:b5,leftstick:b10,rightstick:b11,leftx:a0,lefty:a1,rightx:a2,righty:a3,lefttrigger:b6,righttrigger:b7"
 * ```
 *
 * @param mapping the mapping string.
 * @returns 1 if a new mapping is added, 0 if an existing mapping is updated,
 *          -1 on failure; call SDL_GetError() for more information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_AddGamepadMappingsFromFile
 * @sa SDL_AddGamepadMappingsFromIO
 * @sa SDL_GetGamepadMapping
 * @sa SDL_GetGamepadMappingForGUID
 * @sa SDL_HINT_GAMECONTROLLERCONFIG
 * @sa SDL_HINT_GAMECONTROLLERCONFIG_FILE
 * @sa SDL_EVENT_GAMEPAD_ADDED
 *
 * @from SDL_gamepad.h:340 int SDL_AddGamepadMapping(const char *mapping);
 */
export function addGamepadMapping(mapping: string): number {
  return lib.symbols.SDL_AddGamepadMapping(_p.toCstr(mapping));
}

/**
 * Load a set of gamepad mappings from an SDL_IOStream.
 *
 * You can call this function several times, if needed, to load different
 * database files.
 *
 * If a new mapping is loaded for an already known gamepad GUID, the later
 * version will overwrite the one currently loaded.
 *
 * Any new mappings for already plugged in controllers will generate
 * SDL_EVENT_GAMEPAD_ADDED events.
 *
 * Mappings not belonging to the current platform or with no platform field
 * specified will be ignored (i.e. mappings for Linux will be ignored in
 * Windows, etc).
 *
 * This function will load the text database entirely in memory before
 * processing it, so take this into consideration if you are in a memory
 * constrained environment.
 *
 * @param src the data stream for the mappings to be added.
 * @param closeio if true, calls SDL_CloseIO() on `src` before returning, even
 *                in the case of an error.
 * @returns the number of mappings added or -1 on failure; call SDL_GetError()
 *          for more information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_AddGamepadMapping
 * @sa SDL_AddGamepadMappingsFromFile
 * @sa SDL_GetGamepadMapping
 * @sa SDL_GetGamepadMappingForGUID
 * @sa SDL_HINT_GAMECONTROLLERCONFIG
 * @sa SDL_HINT_GAMECONTROLLERCONFIG_FILE
 * @sa SDL_EVENT_GAMEPAD_ADDED
 *
 * @from SDL_gamepad.h:380 int SDL_AddGamepadMappingsFromIO(SDL_IOStream *src, bool closeio);
 */
export function addGamepadMappingsFromIo(src: Deno.PointerValue<"SDL_IOStream">, closeio: boolean): number {
  return lib.symbols.SDL_AddGamepadMappingsFromIO(src, closeio);
}

/**
 * Load a set of gamepad mappings from a file.
 *
 * You can call this function several times, if needed, to load different
 * database files.
 *
 * If a new mapping is loaded for an already known gamepad GUID, the later
 * version will overwrite the one currently loaded.
 *
 * Any new mappings for already plugged in controllers will generate
 * SDL_EVENT_GAMEPAD_ADDED events.
 *
 * Mappings not belonging to the current platform or with no platform field
 * specified will be ignored (i.e. mappings for Linux will be ignored in
 * Windows, etc).
 *
 * @param file the mappings file to load.
 * @returns the number of mappings added or -1 on failure; call SDL_GetError()
 *          for more information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_AddGamepadMapping
 * @sa SDL_AddGamepadMappingsFromIO
 * @sa SDL_GetGamepadMapping
 * @sa SDL_GetGamepadMappingForGUID
 * @sa SDL_HINT_GAMECONTROLLERCONFIG
 * @sa SDL_HINT_GAMECONTROLLERCONFIG_FILE
 * @sa SDL_EVENT_GAMEPAD_ADDED
 *
 * @from SDL_gamepad.h:414 int SDL_AddGamepadMappingsFromFile(const char *file);
 */
export function addGamepadMappingsFromFile(file: string): number {
  return lib.symbols.SDL_AddGamepadMappingsFromFile(_p.toCstr(file));
}

/**
 * Reinitialize the SDL mapping database to its initial state.
 *
 * This will generate gamepad events as needed if device mappings change.
 *
 * @returns true on success or false on failure; call SDL_GetError() for more
 *          information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gamepad.h:426 bool SDL_ReloadGamepadMappings(void);
 */
export function reloadGamepadMappings(): boolean {
  return lib.symbols.SDL_ReloadGamepadMappings();
}

/**
 * Get the current gamepad mappings.
 *
 * @param count a pointer filled in with the number of mappings returned, can
 *              be NULL.
 * @returns an array of the mapping strings, NULL-terminated, or NULL on
 *          failure; call SDL_GetError() for more information. This is a
 *          single allocation that should be freed with SDL_free() when it is
 *          no longer needed.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gamepad.h:440 char ** SDL_GetGamepadMappings(int *count);
 */
export function getGamepadMappings(): { count: number; ret: Deno.PointerValue } {
  const ret = lib.symbols.SDL_GetGamepadMappings(_p.i32.p0) as Deno.PointerValue;
  if(!ret) throw new Error(`SDL_GetGamepadMappings: ${_p.getCstr2(lib.symbols.SDL_GetError())}`);
  return { count: _p.i32.v0, ret };
}

/**
 * Get the gamepad mapping string for a given GUID.
 *
 * @param guid a structure containing the GUID for which a mapping is desired.
 * @returns a mapping string or NULL on failure; call SDL_GetError() for more
 *          information. This should be freed with SDL_free() when it is no
 *          longer needed.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetJoystickGUIDForID
 * @sa SDL_GetJoystickGUID
 *
 * @from SDL_gamepad.h:455 char * SDL_GetGamepadMappingForGUID(SDL_GUID guid);
 */
export function getGamepadMappingForGuid(guid: Uint8Array<ArrayBuffer>): string {
  return _p.getCstr2(lib.symbols.SDL_GetGamepadMappingForGUID(guid));
}

/**
 * Get the current mapping of a gamepad.
 *
 * Details about mappings are discussed with SDL_AddGamepadMapping().
 *
 * @param gamepad the gamepad you want to get the current mapping for.
 * @returns a string that has the gamepad's mapping or NULL if no mapping is
 *          available; call SDL_GetError() for more information. This should
 *          be freed with SDL_free() when it is no longer needed.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_AddGamepadMapping
 * @sa SDL_GetGamepadMappingForID
 * @sa SDL_GetGamepadMappingForGUID
 * @sa SDL_SetGamepadMapping
 *
 * @from SDL_gamepad.h:474 char * SDL_GetGamepadMapping(SDL_Gamepad *gamepad);
 */
export function getGamepadMapping(gamepad: Deno.PointerValue<"SDL_Gamepad">): string {
  return _p.getCstr2(lib.symbols.SDL_GetGamepadMapping(gamepad));
}

/**
 * Set the current mapping of a joystick or gamepad.
 *
 * Details about mappings are discussed with SDL_AddGamepadMapping().
 *
 * @param instance_id the joystick instance ID.
 * @param mapping the mapping to use for this device, or NULL to clear the
 *                mapping.
 * @returns true on success or false on failure; call SDL_GetError() for more
 *          information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_AddGamepadMapping
 * @sa SDL_GetGamepadMapping
 *
 * @from SDL_gamepad.h:492 bool SDL_SetGamepadMapping(SDL_JoystickID instance_id, const char *mapping);
 */
export function setGamepadMapping(instance_id: number, mapping: string): boolean {
  return lib.symbols.SDL_SetGamepadMapping(instance_id, _p.toCstr(mapping));
}

/**
 * Return whether a gamepad is currently connected.
 *
 * @returns true if a gamepad is connected, false otherwise.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetGamepads
 *
 * @from SDL_gamepad.h:503 bool SDL_HasGamepad(void);
 */
export function hasGamepad(): boolean {
  return lib.symbols.SDL_HasGamepad();
}

/**
 * Get a list of currently connected gamepads.
 *
 * @param count a pointer filled in with the number of gamepads returned, may
 *              be NULL.
 * @returns a 0 terminated array of joystick instance IDs or NULL on failure;
 *          call SDL_GetError() for more information. This should be freed
 *          with SDL_free() when it is no longer needed.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_HasGamepad
 * @sa SDL_OpenGamepad
 *
 * @from SDL_gamepad.h:519 SDL_JoystickID * SDL_GetGamepads(int *count);
 */
export function getGamepads(): { count: number; ret: Deno.PointerValue<"SDL_JoystickID"> } {
  const ret = lib.symbols.SDL_GetGamepads(_p.i32.p0) as Deno.PointerValue<"SDL_JoystickID">;
  if(!ret) throw new Error(`SDL_GetGamepads: ${_p.getCstr2(lib.symbols.SDL_GetError())}`);
  return { count: _p.i32.v0, ret };
}

/**
 * Check if the given joystick is supported by the gamepad interface.
 *
 * @param instance_id the joystick instance ID.
 * @returns true if the given joystick is supported by the gamepad interface,
 *          false if it isn't or it's an invalid index.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetJoysticks
 * @sa SDL_OpenGamepad
 *
 * @from SDL_gamepad.h:533 bool SDL_IsGamepad(SDL_JoystickID instance_id);
 */
export function isGamepad(instance_id: number): boolean {
  return lib.symbols.SDL_IsGamepad(instance_id);
}

/**
 * Get the implementation dependent name of a gamepad.
 *
 * This can be called before any gamepads are opened.
 *
 * @param instance_id the joystick instance ID.
 * @returns the name of the selected gamepad. If no name can be found, this
 *          function returns NULL; call SDL_GetError() for more information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetGamepadName
 * @sa SDL_GetGamepads
 *
 * @from SDL_gamepad.h:549 const char * SDL_GetGamepadNameForID(SDL_JoystickID instance_id);
 */
export function getGamepadNameForId(instance_id: number): string {
  return _p.getCstr2(lib.symbols.SDL_GetGamepadNameForID(instance_id));
}

/**
 * Get the implementation dependent path of a gamepad.
 *
 * This can be called before any gamepads are opened.
 *
 * @param instance_id the joystick instance ID.
 * @returns the path of the selected gamepad. If no path can be found, this
 *          function returns NULL; call SDL_GetError() for more information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetGamepadPath
 * @sa SDL_GetGamepads
 *
 * @from SDL_gamepad.h:565 const char * SDL_GetGamepadPathForID(SDL_JoystickID instance_id);
 */
export function getGamepadPathForId(instance_id: number): string {
  return _p.getCstr2(lib.symbols.SDL_GetGamepadPathForID(instance_id));
}

/**
 * Get the player index of a gamepad.
 *
 * This can be called before any gamepads are opened.
 *
 * @param instance_id the joystick instance ID.
 * @returns the player index of a gamepad, or -1 if it's not available.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetGamepadPlayerIndex
 * @sa SDL_GetGamepads
 *
 * @from SDL_gamepad.h:580 int SDL_GetGamepadPlayerIndexForID(SDL_JoystickID instance_id);
 */
export function getGamepadPlayerIndexForId(instance_id: number): number {
  return lib.symbols.SDL_GetGamepadPlayerIndexForID(instance_id);
}

/**
 * Get the implementation-dependent GUID of a gamepad.
 *
 * This can be called before any gamepads are opened.
 *
 * @param instance_id the joystick instance ID.
 * @returns the GUID of the selected gamepad. If called on an invalid index,
 *          this function returns a zero GUID.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GUIDToString
 * @sa SDL_GetGamepads
 *
 * @from SDL_gamepad.h:596 SDL_GUID SDL_GetGamepadGUIDForID(SDL_JoystickID instance_id);
 */
export function getGamepadGuidForId(instance_id: number): Uint8Array<ArrayBuffer> {
  return lib.symbols.SDL_GetGamepadGUIDForID(instance_id);
}

/**
 * Get the USB vendor ID of a gamepad, if available.
 *
 * This can be called before any gamepads are opened. If the vendor ID isn't
 * available this function returns 0.
 *
 * @param instance_id the joystick instance ID.
 * @returns the USB vendor ID of the selected gamepad. If called on an invalid
 *          index, this function returns zero.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetGamepadVendor
 * @sa SDL_GetGamepads
 *
 * @from SDL_gamepad.h:613 Uint16 SDL_GetGamepadVendorForID(SDL_JoystickID instance_id);
 */
export function getGamepadVendorForId(instance_id: number): number {
  return lib.symbols.SDL_GetGamepadVendorForID(instance_id);
}

/**
 * Get the USB product ID of a gamepad, if available.
 *
 * This can be called before any gamepads are opened. If the product ID isn't
 * available this function returns 0.
 *
 * @param instance_id the joystick instance ID.
 * @returns the USB product ID of the selected gamepad. If called on an
 *          invalid index, this function returns zero.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetGamepadProduct
 * @sa SDL_GetGamepads
 *
 * @from SDL_gamepad.h:630 Uint16 SDL_GetGamepadProductForID(SDL_JoystickID instance_id);
 */
export function getGamepadProductForId(instance_id: number): number {
  return lib.symbols.SDL_GetGamepadProductForID(instance_id);
}

/**
 * Get the product version of a gamepad, if available.
 *
 * This can be called before any gamepads are opened. If the product version
 * isn't available this function returns 0.
 *
 * @param instance_id the joystick instance ID.
 * @returns the product version of the selected gamepad. If called on an
 *          invalid index, this function returns zero.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetGamepadProductVersion
 * @sa SDL_GetGamepads
 *
 * @from SDL_gamepad.h:647 Uint16 SDL_GetGamepadProductVersionForID(SDL_JoystickID instance_id);
 */
export function getGamepadProductVersionForId(instance_id: number): number {
  return lib.symbols.SDL_GetGamepadProductVersionForID(instance_id);
}

/**
 * Get the type of a gamepad.
 *
 * This can be called before any gamepads are opened.
 *
 * @param instance_id the joystick instance ID.
 * @returns the gamepad type.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetGamepadType
 * @sa SDL_GetGamepads
 * @sa SDL_GetRealGamepadTypeForID
 *
 * @from SDL_gamepad.h:663 SDL_GamepadType SDL_GetGamepadTypeForID(SDL_JoystickID instance_id);
 */
export function getGamepadTypeForId(instance_id: number): number {
  return lib.symbols.SDL_GetGamepadTypeForID(instance_id);
}

/**
 * Get the type of a gamepad, ignoring any mapping override.
 *
 * This can be called before any gamepads are opened.
 *
 * @param instance_id the joystick instance ID.
 * @returns the gamepad type.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetGamepadTypeForID
 * @sa SDL_GetGamepads
 * @sa SDL_GetRealGamepadType
 *
 * @from SDL_gamepad.h:679 SDL_GamepadType SDL_GetRealGamepadTypeForID(SDL_JoystickID instance_id);
 */
export function getRealGamepadTypeForId(instance_id: number): number {
  return lib.symbols.SDL_GetRealGamepadTypeForID(instance_id);
}

/**
 * Get the mapping of a gamepad.
 *
 * This can be called before any gamepads are opened.
 *
 * @param instance_id the joystick instance ID.
 * @returns the mapping string. Returns NULL if no mapping is available. This
 *          should be freed with SDL_free() when it is no longer needed.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetGamepads
 * @sa SDL_GetGamepadMapping
 *
 * @from SDL_gamepad.h:695 char * SDL_GetGamepadMappingForID(SDL_JoystickID instance_id);
 */
export function getGamepadMappingForId(instance_id: number): string {
  return _p.getCstr2(lib.symbols.SDL_GetGamepadMappingForID(instance_id));
}

/**
 * Open a gamepad for use.
 *
 * @param instance_id the joystick instance ID.
 * @returns a gamepad identifier or NULL if an error occurred; call
 *          SDL_GetError() for more information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_CloseGamepad
 * @sa SDL_IsGamepad
 *
 * @from SDL_gamepad.h:709 SDL_Gamepad * SDL_OpenGamepad(SDL_JoystickID instance_id);
 */
export function openGamepad(instance_id: number): Deno.PointerValue<"SDL_Gamepad"> {
  return lib.symbols.SDL_OpenGamepad(instance_id) as Deno.PointerValue<"SDL_Gamepad">;
}

/**
 * Get the SDL_Gamepad associated with a joystick instance ID, if it has been
 * opened.
 *
 * @param instance_id the joystick instance ID of the gamepad.
 * @returns an SDL_Gamepad on success or NULL on failure or if it hasn't been
 *          opened yet; call SDL_GetError() for more information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gamepad.h:721 SDL_Gamepad * SDL_GetGamepadFromID(SDL_JoystickID instance_id);
 */
export function getGamepadFromId(instance_id: number): Deno.PointerValue<"SDL_Gamepad"> {
  return lib.symbols.SDL_GetGamepadFromID(instance_id) as Deno.PointerValue<"SDL_Gamepad">;
}

/**
 * Get the SDL_Gamepad associated with a player index.
 *
 * @param player_index the player index, which different from the instance ID.
 * @returns the SDL_Gamepad associated with a player index.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetGamepadPlayerIndex
 * @sa SDL_SetGamepadPlayerIndex
 *
 * @from SDL_gamepad.h:734 SDL_Gamepad * SDL_GetGamepadFromPlayerIndex(int player_index);
 */
export function getGamepadFromPlayerIndex(player_index: number): Deno.PointerValue<"SDL_Gamepad"> {
  return lib.symbols.SDL_GetGamepadFromPlayerIndex(player_index) as Deno.PointerValue<"SDL_Gamepad">;
}

/**
 * Get the properties associated with an opened gamepad.
 *
 * These properties are shared with the underlying joystick object.
 *
 * The following read-only properties are provided by SDL:
 *
 * - `SDL_PROP_GAMEPAD_CAP_MONO_LED_BOOLEAN`: true if this gamepad has an LED
 *   that has adjustable brightness
 * - `SDL_PROP_GAMEPAD_CAP_RGB_LED_BOOLEAN`: true if this gamepad has an LED
 *   that has adjustable color
 * - `SDL_PROP_GAMEPAD_CAP_PLAYER_LED_BOOLEAN`: true if this gamepad has a
 *   player LED
 * - `SDL_PROP_GAMEPAD_CAP_RUMBLE_BOOLEAN`: true if this gamepad has
 *   left/right rumble
 * - `SDL_PROP_GAMEPAD_CAP_TRIGGER_RUMBLE_BOOLEAN`: true if this gamepad has
 *   simple trigger rumble
 *
 * @param gamepad a gamepad identifier previously returned by
 *                SDL_OpenGamepad().
 * @returns a valid property ID on success or 0 on failure; call
 *          SDL_GetError() for more information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gamepad.h:761 SDL_PropertiesID SDL_GetGamepadProperties(SDL_Gamepad *gamepad);
 */
export function getGamepadProperties(gamepad: Deno.PointerValue<"SDL_Gamepad">): number {
  return lib.symbols.SDL_GetGamepadProperties(gamepad);
}

/**
 * Get the instance ID of an opened gamepad.
 *
 * @param gamepad a gamepad identifier previously returned by
 *                SDL_OpenGamepad().
 * @returns the instance ID of the specified gamepad on success or 0 on
 *          failure; call SDL_GetError() for more information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gamepad.h:779 SDL_JoystickID SDL_GetGamepadID(SDL_Gamepad *gamepad);
 */
export function getGamepadId(gamepad: Deno.PointerValue<"SDL_Gamepad">): number {
  return lib.symbols.SDL_GetGamepadID(gamepad);
}

/**
 * Get the implementation-dependent name for an opened gamepad.
 *
 * @param gamepad a gamepad identifier previously returned by
 *                SDL_OpenGamepad().
 * @returns the implementation dependent name for the gamepad, or NULL if
 *          there is no name or the identifier passed is invalid.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetGamepadNameForID
 *
 * @from SDL_gamepad.h:793 const char * SDL_GetGamepadName(SDL_Gamepad *gamepad);
 */
export function getGamepadName(gamepad: Deno.PointerValue<"SDL_Gamepad">): string {
  return _p.getCstr2(lib.symbols.SDL_GetGamepadName(gamepad));
}

/**
 * Get the implementation-dependent path for an opened gamepad.
 *
 * @param gamepad a gamepad identifier previously returned by
 *                SDL_OpenGamepad().
 * @returns the implementation dependent path for the gamepad, or NULL if
 *          there is no path or the identifier passed is invalid.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetGamepadPathForID
 *
 * @from SDL_gamepad.h:807 const char * SDL_GetGamepadPath(SDL_Gamepad *gamepad);
 */
export function getGamepadPath(gamepad: Deno.PointerValue<"SDL_Gamepad">): string {
  return _p.getCstr2(lib.symbols.SDL_GetGamepadPath(gamepad));
}

/**
 * Get the type of an opened gamepad.
 *
 * @param gamepad the gamepad object to query.
 * @returns the gamepad type, or SDL_GAMEPAD_TYPE_UNKNOWN if it's not
 *          available.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetGamepadTypeForID
 *
 * @from SDL_gamepad.h:820 SDL_GamepadType SDL_GetGamepadType(SDL_Gamepad *gamepad);
 */
export function getGamepadType(gamepad: Deno.PointerValue<"SDL_Gamepad">): number {
  return lib.symbols.SDL_GetGamepadType(gamepad);
}

/**
 * Get the type of an opened gamepad, ignoring any mapping override.
 *
 * @param gamepad the gamepad object to query.
 * @returns the gamepad type, or SDL_GAMEPAD_TYPE_UNKNOWN if it's not
 *          available.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetRealGamepadTypeForID
 *
 * @from SDL_gamepad.h:833 SDL_GamepadType SDL_GetRealGamepadType(SDL_Gamepad *gamepad);
 */
export function getRealGamepadType(gamepad: Deno.PointerValue<"SDL_Gamepad">): number {
  return lib.symbols.SDL_GetRealGamepadType(gamepad);
}

/**
 * Get the player index of an opened gamepad.
 *
 * For XInput gamepads this returns the XInput user index.
 *
 * @param gamepad the gamepad object to query.
 * @returns the player index for gamepad, or -1 if it's not available.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_SetGamepadPlayerIndex
 *
 * @from SDL_gamepad.h:847 int SDL_GetGamepadPlayerIndex(SDL_Gamepad *gamepad);
 */
export function getGamepadPlayerIndex(gamepad: Deno.PointerValue<"SDL_Gamepad">): number {
  return lib.symbols.SDL_GetGamepadPlayerIndex(gamepad);
}

/**
 * Set the player index of an opened gamepad.
 *
 * @param gamepad the gamepad object to adjust.
 * @param player_index player index to assign to this gamepad, or -1 to clear
 *                     the player index and turn off player LEDs.
 * @returns true on success or false on failure; call SDL_GetError() for more
 *          information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetGamepadPlayerIndex
 *
 * @from SDL_gamepad.h:862 bool SDL_SetGamepadPlayerIndex(SDL_Gamepad *gamepad, int player_index);
 */
export function setGamepadPlayerIndex(gamepad: Deno.PointerValue<"SDL_Gamepad">, player_index: number): boolean {
  return lib.symbols.SDL_SetGamepadPlayerIndex(gamepad, player_index);
}

/**
 * Get the USB vendor ID of an opened gamepad, if available.
 *
 * If the vendor ID isn't available this function returns 0.
 *
 * @param gamepad the gamepad object to query.
 * @returns the USB vendor ID, or zero if unavailable.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetGamepadVendorForID
 *
 * @from SDL_gamepad.h:876 Uint16 SDL_GetGamepadVendor(SDL_Gamepad *gamepad);
 */
export function getGamepadVendor(gamepad: Deno.PointerValue<"SDL_Gamepad">): number {
  return lib.symbols.SDL_GetGamepadVendor(gamepad);
}

/**
 * Get the USB product ID of an opened gamepad, if available.
 *
 * If the product ID isn't available this function returns 0.
 *
 * @param gamepad the gamepad object to query.
 * @returns the USB product ID, or zero if unavailable.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetGamepadProductForID
 *
 * @from SDL_gamepad.h:890 Uint16 SDL_GetGamepadProduct(SDL_Gamepad *gamepad);
 */
export function getGamepadProduct(gamepad: Deno.PointerValue<"SDL_Gamepad">): number {
  return lib.symbols.SDL_GetGamepadProduct(gamepad);
}

/**
 * Get the product version of an opened gamepad, if available.
 *
 * If the product version isn't available this function returns 0.
 *
 * @param gamepad the gamepad object to query.
 * @returns the USB product version, or zero if unavailable.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetGamepadProductVersionForID
 *
 * @from SDL_gamepad.h:904 Uint16 SDL_GetGamepadProductVersion(SDL_Gamepad *gamepad);
 */
export function getGamepadProductVersion(gamepad: Deno.PointerValue<"SDL_Gamepad">): number {
  return lib.symbols.SDL_GetGamepadProductVersion(gamepad);
}

/**
 * Get the firmware version of an opened gamepad, if available.
 *
 * If the firmware version isn't available this function returns 0.
 *
 * @param gamepad the gamepad object to query.
 * @returns the gamepad firmware version, or zero if unavailable.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gamepad.h:916 Uint16 SDL_GetGamepadFirmwareVersion(SDL_Gamepad *gamepad);
 */
export function getGamepadFirmwareVersion(gamepad: Deno.PointerValue<"SDL_Gamepad">): number {
  return lib.symbols.SDL_GetGamepadFirmwareVersion(gamepad);
}

/**
 * Get the serial number of an opened gamepad, if available.
 *
 * Returns the serial number of the gamepad, or NULL if it is not available.
 *
 * @param gamepad the gamepad object to query.
 * @returns the serial number, or NULL if unavailable.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gamepad.h:928 const char * SDL_GetGamepadSerial(SDL_Gamepad *gamepad);
 */
export function getGamepadSerial(gamepad: Deno.PointerValue<"SDL_Gamepad">): string {
  return _p.getCstr2(lib.symbols.SDL_GetGamepadSerial(gamepad));
}

/**
 * Get the Steam Input handle of an opened gamepad, if available.
 *
 * Returns an InputHandle_t for the gamepad that can be used with Steam Input
 * API: https://partner.steamgames.com/doc/api/ISteamInput
 *
 * @param gamepad the gamepad object to query.
 * @returns the gamepad handle, or 0 if unavailable.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gamepad.h:941 Uint64 SDL_GetGamepadSteamHandle(SDL_Gamepad *gamepad);
 */
export function getGamepadSteamHandle(gamepad: Deno.PointerValue<"SDL_Gamepad">): bigint {
  return lib.symbols.SDL_GetGamepadSteamHandle(gamepad);
}

/**
 * Get the connection state of a gamepad.
 *
 * @param gamepad the gamepad object to query.
 * @returns the connection state on success or
 *          `SDL_JOYSTICK_CONNECTION_INVALID` on failure; call SDL_GetError()
 *          for more information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gamepad.h:953 SDL_JoystickConnectionState SDL_GetGamepadConnectionState(SDL_Gamepad *gamepad);
 */
export function getGamepadConnectionState(gamepad: Deno.PointerValue<"SDL_Gamepad">): number {
  return lib.symbols.SDL_GetGamepadConnectionState(gamepad);
}

/**
 * Get the battery state of a gamepad.
 *
 * You should never take a battery status as absolute truth. Batteries
 * (especially failing batteries) are delicate hardware, and the values
 * reported here are best estimates based on what that hardware reports. It's
 * not uncommon for older batteries to lose stored power much faster than it
 * reports, or completely drain when reporting it has 20 percent left, etc.
 *
 * @param gamepad the gamepad object to query.
 * @param percent a pointer filled in with the percentage of battery life
 *                left, between 0 and 100, or NULL to ignore. This will be
 *                filled in with -1 we can't determine a value or there is no
 *                battery.
 * @returns the current battery state.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gamepad.h:973 SDL_PowerState SDL_GetGamepadPowerInfo(SDL_Gamepad *gamepad, int *percent);
 */
export function getGamepadPowerInfo(gamepad: Deno.PointerValue<"SDL_Gamepad">): number {
  if(!lib.symbols.SDL_GetGamepadPowerInfo(gamepad, _p.i32.p0))
    throw new Error(`SDL_GetGamepadPowerInfo: ${_p.getCstr2(lib.symbols.SDL_GetError())}`);
  return _p.i32.v0;
}

/**
 * Check if a gamepad has been opened and is currently connected.
 *
 * @param gamepad a gamepad identifier previously returned by
 *                SDL_OpenGamepad().
 * @returns true if the gamepad has been opened and is currently connected, or
 *          false if not.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gamepad.h:985 bool SDL_GamepadConnected(SDL_Gamepad *gamepad);
 */
export function gamepadConnected(gamepad: Deno.PointerValue<"SDL_Gamepad">): boolean {
  return lib.symbols.SDL_GamepadConnected(gamepad);
}

/**
 * Get the underlying joystick from a gamepad.
 *
 * This function will give you a SDL_Joystick object, which allows you to use
 * the SDL_Joystick functions with a SDL_Gamepad object. This would be useful
 * for getting a joystick's position at any given time, even if it hasn't
 * moved (moving it would produce an event, which would have the axis' value).
 *
 * The pointer returned is owned by the SDL_Gamepad. You should not call
 * SDL_CloseJoystick() on it, for example, since doing so will likely cause
 * SDL to crash.
 *
 * @param gamepad the gamepad object that you want to get a joystick from.
 * @returns an SDL_Joystick object, or NULL on failure; call SDL_GetError()
 *          for more information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gamepad.h:1005 SDL_Joystick * SDL_GetGamepadJoystick(SDL_Gamepad *gamepad);
 */
export function getGamepadJoystick(gamepad: Deno.PointerValue<"SDL_Gamepad">): Deno.PointerValue<"SDL_Joystick"> {
  return lib.symbols.SDL_GetGamepadJoystick(gamepad) as Deno.PointerValue<"SDL_Joystick">;
}

/**
 * Set the state of gamepad event processing.
 *
 * If gamepad events are disabled, you must call SDL_UpdateGamepads() yourself
 * and check the state of the gamepad when you want gamepad information.
 *
 * @param enabled whether to process gamepad events or not.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GamepadEventsEnabled
 * @sa SDL_UpdateGamepads
 *
 * @from SDL_gamepad.h:1020 void SDL_SetGamepadEventsEnabled(bool enabled);
 */
export function setGamepadEventsEnabled(enabled: boolean): void {
  return lib.symbols.SDL_SetGamepadEventsEnabled(enabled);
}

/**
 * Query the state of gamepad event processing.
 *
 * If gamepad events are disabled, you must call SDL_UpdateGamepads() yourself
 * and check the state of the gamepad when you want gamepad information.
 *
 * @returns true if gamepad events are being processed, false otherwise.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_SetGamepadEventsEnabled
 *
 * @from SDL_gamepad.h:1034 bool SDL_GamepadEventsEnabled(void);
 */
export function gamepadEventsEnabled(): boolean {
  return lib.symbols.SDL_GamepadEventsEnabled();
}

/**
 * Get the SDL joystick layer bindings for a gamepad.
 *
 * @param gamepad a gamepad.
 * @param count a pointer filled in with the number of bindings returned.
 * @returns a NULL terminated array of pointers to bindings or NULL on
 *          failure; call SDL_GetError() for more information. This is a
 *          single allocation that should be freed with SDL_free() when it is
 *          no longer needed.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gamepad.h:1048 SDL_GamepadBinding ** SDL_GetGamepadBindings(SDL_Gamepad *gamepad, int *count);
 */
export function getGamepadBindings(gamepad: Deno.PointerValue<"SDL_Gamepad">): { count: number; ret: Deno.PointerValue } {
  const ret = lib.symbols.SDL_GetGamepadBindings(gamepad, _p.i32.p0) as Deno.PointerValue;
  if(!ret) throw new Error(`SDL_GetGamepadBindings: ${_p.getCstr2(lib.symbols.SDL_GetError())}`);
  return { count: _p.i32.v0, ret };
}

/**
 * Manually pump gamepad updates if not using the loop.
 *
 * This function is called automatically by the event loop if events are
 * enabled. Under such circumstances, it will not be necessary to call this
 * function.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gamepad.h:1059 void SDL_UpdateGamepads(void);
 */
export function updateGamepads(): void {
  return lib.symbols.SDL_UpdateGamepads();
}

/**
 * Convert a string into SDL_GamepadType enum.
 *
 * This function is called internally to translate SDL_Gamepad mapping strings
 * for the underlying joystick device into the consistent SDL_Gamepad mapping.
 * You do not normally need to call this function unless you are parsing
 * SDL_Gamepad mappings in your own code.
 *
 * @param str string representing a SDL_GamepadType type.
 * @returns the SDL_GamepadType enum corresponding to the input string, or
 *          `SDL_GAMEPAD_TYPE_UNKNOWN` if no match was found.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetGamepadStringForType
 *
 * @from SDL_gamepad.h:1077 SDL_GamepadType SDL_GetGamepadTypeFromString(const char *str);
 */
export function getGamepadTypeFromString(str: string): number {
  return lib.symbols.SDL_GetGamepadTypeFromString(_p.toCstr(str));
}

/**
 * Convert from an SDL_GamepadType enum to a string.
 *
 * @param type an enum value for a given SDL_GamepadType.
 * @returns a string for the given type, or NULL if an invalid type is
 *          specified. The string returned is of the format used by
 *          SDL_Gamepad mapping strings.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetGamepadTypeFromString
 *
 * @from SDL_gamepad.h:1091 const char * SDL_GetGamepadStringForType(SDL_GamepadType type);
 */
export function getGamepadStringForType(type: number): string {
  return _p.getCstr2(lib.symbols.SDL_GetGamepadStringForType(type));
}

/**
 * Convert a string into SDL_GamepadAxis enum.
 *
 * This function is called internally to translate SDL_Gamepad mapping strings
 * for the underlying joystick device into the consistent SDL_Gamepad mapping.
 * You do not normally need to call this function unless you are parsing
 * SDL_Gamepad mappings in your own code.
 *
 * Note specially that "righttrigger" and "lefttrigger" map to
 * `SDL_GAMEPAD_AXIS_RIGHT_TRIGGER` and `SDL_GAMEPAD_AXIS_LEFT_TRIGGER`,
 * respectively.
 *
 * @param str string representing a SDL_Gamepad axis.
 * @returns the SDL_GamepadAxis enum corresponding to the input string, or
 *          `SDL_GAMEPAD_AXIS_INVALID` if no match was found.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetGamepadStringForAxis
 *
 * @from SDL_gamepad.h:1113 SDL_GamepadAxis SDL_GetGamepadAxisFromString(const char *str);
 */
export function getGamepadAxisFromString(str: string): number {
  return lib.symbols.SDL_GetGamepadAxisFromString(_p.toCstr(str));
}

/**
 * Convert from an SDL_GamepadAxis enum to a string.
 *
 * @param axis an enum value for a given SDL_GamepadAxis.
 * @returns a string for the given axis, or NULL if an invalid axis is
 *          specified. The string returned is of the format used by
 *          SDL_Gamepad mapping strings.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetGamepadAxisFromString
 *
 * @from SDL_gamepad.h:1127 const char * SDL_GetGamepadStringForAxis(SDL_GamepadAxis axis);
 */
export function getGamepadStringForAxis(axis: number): string {
  return _p.getCstr2(lib.symbols.SDL_GetGamepadStringForAxis(axis));
}

/**
 * Query whether a gamepad has a given axis.
 *
 * This merely reports whether the gamepad's mapping defined this axis, as
 * that is all the information SDL has about the physical device.
 *
 * @param gamepad a gamepad.
 * @param axis an axis enum value (an SDL_GamepadAxis value).
 * @returns true if the gamepad has this axis, false otherwise.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GamepadHasButton
 * @sa SDL_GetGamepadAxis
 *
 * @from SDL_gamepad.h:1144 bool SDL_GamepadHasAxis(SDL_Gamepad *gamepad, SDL_GamepadAxis axis);
 */
export function gamepadHasAxis(gamepad: Deno.PointerValue<"SDL_Gamepad">, axis: number): boolean {
  return lib.symbols.SDL_GamepadHasAxis(gamepad, axis);
}

/**
 * Get the current state of an axis control on a gamepad.
 *
 * The axis indices start at index 0.
 *
 * For thumbsticks, the state is a value ranging from -32768 (up/left) to
 * 32767 (down/right).
 *
 * Triggers range from 0 when released to 32767 when fully pressed, and never
 * return a negative value. Note that this differs from the value reported by
 * the lower-level SDL_GetJoystickAxis(), which normally uses the full range.
 *
 * @param gamepad a gamepad.
 * @param axis an axis index (one of the SDL_GamepadAxis values).
 * @returns axis state (including 0) on success or 0 (also) on failure; call
 *          SDL_GetError() for more information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GamepadHasAxis
 * @sa SDL_GetGamepadButton
 *
 * @from SDL_gamepad.h:1168 Sint16 SDL_GetGamepadAxis(SDL_Gamepad *gamepad, SDL_GamepadAxis axis);
 */
export function getGamepadAxis(gamepad: Deno.PointerValue<"SDL_Gamepad">, axis: number): number {
  return lib.symbols.SDL_GetGamepadAxis(gamepad, axis);
}

/**
 * Convert a string into an SDL_GamepadButton enum.
 *
 * This function is called internally to translate SDL_Gamepad mapping strings
 * for the underlying joystick device into the consistent SDL_Gamepad mapping.
 * You do not normally need to call this function unless you are parsing
 * SDL_Gamepad mappings in your own code.
 *
 * @param str string representing a SDL_Gamepad axis.
 * @returns the SDL_GamepadButton enum corresponding to the input string, or
 *          `SDL_GAMEPAD_BUTTON_INVALID` if no match was found.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetGamepadStringForButton
 *
 * @from SDL_gamepad.h:1186 SDL_GamepadButton SDL_GetGamepadButtonFromString(const char *str);
 */
export function getGamepadButtonFromString(str: string): number {
  return lib.symbols.SDL_GetGamepadButtonFromString(_p.toCstr(str));
}

/**
 * Convert from an SDL_GamepadButton enum to a string.
 *
 * @param button an enum value for a given SDL_GamepadButton.
 * @returns a string for the given button, or NULL if an invalid button is
 *          specified. The string returned is of the format used by
 *          SDL_Gamepad mapping strings.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetGamepadButtonFromString
 *
 * @from SDL_gamepad.h:1200 const char * SDL_GetGamepadStringForButton(SDL_GamepadButton button);
 */
export function getGamepadStringForButton(button: number): string {
  return _p.getCstr2(lib.symbols.SDL_GetGamepadStringForButton(button));
}

/**
 * Query whether a gamepad has a given button.
 *
 * This merely reports whether the gamepad's mapping defined this button, as
 * that is all the information SDL has about the physical device.
 *
 * @param gamepad a gamepad.
 * @param button a button enum value (an SDL_GamepadButton value).
 * @returns true if the gamepad has this button, false otherwise.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GamepadHasAxis
 *
 * @from SDL_gamepad.h:1216 bool SDL_GamepadHasButton(SDL_Gamepad *gamepad, SDL_GamepadButton button);
 */
export function gamepadHasButton(gamepad: Deno.PointerValue<"SDL_Gamepad">, button: number): boolean {
  return lib.symbols.SDL_GamepadHasButton(gamepad, button);
}

/**
 * Get the current state of a button on a gamepad.
 *
 * @param gamepad a gamepad.
 * @param button a button index (one of the SDL_GamepadButton values).
 * @returns true if the button is pressed, false otherwise.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GamepadHasButton
 * @sa SDL_GetGamepadAxis
 *
 * @from SDL_gamepad.h:1230 bool SDL_GetGamepadButton(SDL_Gamepad *gamepad, SDL_GamepadButton button);
 */
export function getGamepadButton(gamepad: Deno.PointerValue<"SDL_Gamepad">, button: number): boolean {
  return lib.symbols.SDL_GetGamepadButton(gamepad, button);
}

/**
 * Get the label of a button on a gamepad.
 *
 * @param type the type of gamepad to check.
 * @param button a button index (one of the SDL_GamepadButton values).
 * @returns the SDL_GamepadButtonLabel enum corresponding to the button label.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetGamepadButtonLabel
 *
 * @from SDL_gamepad.h:1243 SDL_GamepadButtonLabel SDL_GetGamepadButtonLabelForType(SDL_GamepadType type, SDL_GamepadButton button);
 */
export function getGamepadButtonLabelForType(type: number, button: number): number {
  return lib.symbols.SDL_GetGamepadButtonLabelForType(type, button);
}

/**
 * Get the label of a button on a gamepad.
 *
 * @param gamepad a gamepad.
 * @param button a button index (one of the SDL_GamepadButton values).
 * @returns the SDL_GamepadButtonLabel enum corresponding to the button label.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetGamepadButtonLabelForType
 *
 * @from SDL_gamepad.h:1256 SDL_GamepadButtonLabel SDL_GetGamepadButtonLabel(SDL_Gamepad *gamepad, SDL_GamepadButton button);
 */
export function getGamepadButtonLabel(gamepad: Deno.PointerValue<"SDL_Gamepad">, button: number): number {
  return lib.symbols.SDL_GetGamepadButtonLabel(gamepad, button);
}

/**
 * Get the number of touchpads on a gamepad.
 *
 * @param gamepad a gamepad.
 * @returns number of touchpads.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetNumGamepadTouchpadFingers
 *
 * @from SDL_gamepad.h:1268 int SDL_GetNumGamepadTouchpads(SDL_Gamepad *gamepad);
 */
export function getNumGamepadTouchpads(gamepad: Deno.PointerValue<"SDL_Gamepad">): number {
  return lib.symbols.SDL_GetNumGamepadTouchpads(gamepad);
}

/**
 * Get the number of supported simultaneous fingers on a touchpad on a game
 * gamepad.
 *
 * @param gamepad a gamepad.
 * @param touchpad a touchpad.
 * @returns number of supported simultaneous fingers.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetGamepadTouchpadFinger
 * @sa SDL_GetNumGamepadTouchpads
 *
 * @from SDL_gamepad.h:1283 int SDL_GetNumGamepadTouchpadFingers(SDL_Gamepad *gamepad, int touchpad);
 */
export function getNumGamepadTouchpadFingers(gamepad: Deno.PointerValue<"SDL_Gamepad">, touchpad: number): number {
  return lib.symbols.SDL_GetNumGamepadTouchpadFingers(gamepad, touchpad);
}

/**
 * Get the current state of a finger on a touchpad on a gamepad.
 *
 * @param gamepad a gamepad.
 * @param touchpad a touchpad.
 * @param finger a finger.
 * @param down a pointer filled with true if the finger is down, false
 *             otherwise, may be NULL.
 * @param x a pointer filled with the x position, normalized 0 to 1, with the
 *          origin in the upper left, may be NULL.
 * @param y a pointer filled with the y position, normalized 0 to 1, with the
 *          origin in the upper left, may be NULL.
 * @param pressure a pointer filled with pressure value, may be NULL.
 * @returns true on success or false on failure; call SDL_GetError() for more
 *          information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetNumGamepadTouchpadFingers
 *
 * @from SDL_gamepad.h:1305 bool SDL_GetGamepadTouchpadFinger(SDL_Gamepad *gamepad, int touchpad, int finger, bool *down, float *x, float *y, float *pressure);
 */
export function getGamepadTouchpadFinger(gamepad: Deno.PointerValue<"SDL_Gamepad">, touchpad: number, finger: number): { down: boolean; x: number; y: number; pressure: number } {
  if(!lib.symbols.SDL_GetGamepadTouchpadFinger(gamepad, touchpad, finger, _p.i8.p0, _p.f32.p0, _p.f32.p1, _p.f32.p2))
    throw new Error(`SDL_GetGamepadTouchpadFinger: ${_p.getCstr2(lib.symbols.SDL_GetError())}`);
  return { down: !!_p.i8.v0, x: _p.f32.v0, y: _p.f32.v1, pressure: _p.f32.v2 };
}

/**
 * Return whether a gamepad has a particular sensor.
 *
 * @param gamepad the gamepad to query.
 * @param type the type of sensor to query.
 * @returns true if the sensor exists, false otherwise.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetGamepadSensorData
 * @sa SDL_GetGamepadSensorDataRate
 * @sa SDL_SetGamepadSensorEnabled
 *
 * @from SDL_gamepad.h:1320 bool SDL_GamepadHasSensor(SDL_Gamepad *gamepad, SDL_SensorType type);
 */
export function gamepadHasSensor(gamepad: Deno.PointerValue<"SDL_Gamepad">, type: number): boolean {
  return lib.symbols.SDL_GamepadHasSensor(gamepad, type);
}

/**
 * Set whether data reporting for a gamepad sensor is enabled.
 *
 * @param gamepad the gamepad to update.
 * @param type the type of sensor to enable/disable.
 * @param enabled whether data reporting should be enabled.
 * @returns true on success or false on failure; call SDL_GetError() for more
 *          information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GamepadHasSensor
 * @sa SDL_GamepadSensorEnabled
 *
 * @from SDL_gamepad.h:1336 bool SDL_SetGamepadSensorEnabled(SDL_Gamepad *gamepad, SDL_SensorType type, bool enabled);
 */
export function setGamepadSensorEnabled(gamepad: Deno.PointerValue<"SDL_Gamepad">, type: number, enabled: boolean): boolean {
  return lib.symbols.SDL_SetGamepadSensorEnabled(gamepad, type, enabled);
}

/**
 * Query whether sensor data reporting is enabled for a gamepad.
 *
 * @param gamepad the gamepad to query.
 * @param type the type of sensor to query.
 * @returns true if the sensor is enabled, false otherwise.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_SetGamepadSensorEnabled
 *
 * @from SDL_gamepad.h:1349 bool SDL_GamepadSensorEnabled(SDL_Gamepad *gamepad, SDL_SensorType type);
 */
export function gamepadSensorEnabled(gamepad: Deno.PointerValue<"SDL_Gamepad">, type: number): boolean {
  return lib.symbols.SDL_GamepadSensorEnabled(gamepad, type);
}

/**
 * Get the data rate (number of events per second) of a gamepad sensor.
 *
 * @param gamepad the gamepad to query.
 * @param type the type of sensor to query.
 * @returns the data rate, or 0.0f if the data rate is not available.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gamepad.h:1360 float SDL_GetGamepadSensorDataRate(SDL_Gamepad *gamepad, SDL_SensorType type);
 */
export function getGamepadSensorDataRate(gamepad: Deno.PointerValue<"SDL_Gamepad">, type: number): number {
  return lib.symbols.SDL_GetGamepadSensorDataRate(gamepad, type);
}

/**
 * Get the current state of a gamepad sensor.
 *
 * The number of values and interpretation of the data is sensor dependent.
 * See SDL_sensor.h for the details for each type of sensor.
 *
 * @param gamepad the gamepad to query.
 * @param type the type of sensor to query.
 * @param data a pointer filled with the current sensor state.
 * @param num_values the number of values to write to data.
 * @returns true on success or false on failure; call SDL_GetError() for more
 *          information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gamepad.h:1377 bool SDL_GetGamepadSensorData(SDL_Gamepad *gamepad, SDL_SensorType type, float *data, int num_values);
 */
export function getGamepadSensorData(gamepad: Deno.PointerValue<"SDL_Gamepad">, type: number, num_values: number): number {
  if(!lib.symbols.SDL_GetGamepadSensorData(gamepad, type, _p.f32.p0, num_values))
    throw new Error(`SDL_GetGamepadSensorData: ${_p.getCstr2(lib.symbols.SDL_GetError())}`);
  return _p.f32.v0;
}

/**
 * Start a rumble effect on a gamepad.
 *
 * Each call to this function cancels any previous rumble effect, and calling
 * it with 0 intensity stops any rumbling.
 *
 * This function requires you to process SDL events or call
 * SDL_UpdateJoysticks() to update rumble state.
 *
 * @param gamepad the gamepad to vibrate.
 * @param low_frequency_rumble the intensity of the low frequency (left)
 *                             rumble motor, from 0 to 0xFFFF.
 * @param high_frequency_rumble the intensity of the high frequency (right)
 *                              rumble motor, from 0 to 0xFFFF.
 * @param duration_ms the duration of the rumble effect, in milliseconds.
 * @returns true on success or false on failure; call SDL_GetError() for more
 *          information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gamepad.h:1399 bool SDL_RumbleGamepad(SDL_Gamepad *gamepad, Uint16 low_frequency_rumble, Uint16 high_frequency_rumble, Uint32 duration_ms);
 */
export function rumbleGamepad(
    gamepad: Deno.PointerValue<"SDL_Gamepad">,
    low_frequency_rumble: number,
    high_frequency_rumble: number,
    duration_ms: number,
): boolean {
  return lib.symbols.SDL_RumbleGamepad(gamepad, low_frequency_rumble, high_frequency_rumble, duration_ms);
}

/**
 * Start a rumble effect in the gamepad's triggers.
 *
 * Each call to this function cancels any previous trigger rumble effect, and
 * calling it with 0 intensity stops any rumbling.
 *
 * Note that this is rumbling of the _triggers_ and not the gamepad as a
 * whole. This is currently only supported on Xbox One gamepads. If you want
 * the (more common) whole-gamepad rumble, use SDL_RumbleGamepad() instead.
 *
 * This function requires you to process SDL events or call
 * SDL_UpdateJoysticks() to update rumble state.
 *
 * @param gamepad the gamepad to vibrate.
 * @param left_rumble the intensity of the left trigger rumble motor, from 0
 *                    to 0xFFFF.
 * @param right_rumble the intensity of the right trigger rumble motor, from 0
 *                     to 0xFFFF.
 * @param duration_ms the duration of the rumble effect, in milliseconds.
 * @returns true on success or false on failure; call SDL_GetError() for more
 *          information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_RumbleGamepad
 *
 * @from SDL_gamepad.h:1427 bool SDL_RumbleGamepadTriggers(SDL_Gamepad *gamepad, Uint16 left_rumble, Uint16 right_rumble, Uint32 duration_ms);
 */
export function rumbleGamepadTriggers(
    gamepad: Deno.PointerValue<"SDL_Gamepad">,
    left_rumble: number,
    right_rumble: number,
    duration_ms: number,
): boolean {
  return lib.symbols.SDL_RumbleGamepadTriggers(gamepad, left_rumble, right_rumble, duration_ms);
}

/**
 * Update a gamepad's LED color.
 *
 * An example of a joystick LED is the light on the back of a PlayStation 4's
 * DualShock 4 controller.
 *
 * For gamepads with a single color LED, the maximum of the RGB values will be
 * used as the LED brightness.
 *
 * @param gamepad the gamepad to update.
 * @param red the intensity of the red LED.
 * @param green the intensity of the green LED.
 * @param blue the intensity of the blue LED.
 * @returns true on success or false on failure; call SDL_GetError() for more
 *          information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gamepad.h:1447 bool SDL_SetGamepadLED(SDL_Gamepad *gamepad, Uint8 red, Uint8 green, Uint8 blue);
 */
export function setGamepadLed(
    gamepad: Deno.PointerValue<"SDL_Gamepad">,
    red: number,
    green: number,
    blue: number,
): boolean {
  return lib.symbols.SDL_SetGamepadLED(gamepad, red, green, blue);
}

/**
 * Send a gamepad specific effect packet.
 *
 * @param gamepad the gamepad to affect.
 * @param data the data to send to the gamepad.
 * @param size the size of the data to send to the gamepad.
 * @returns true on success or false on failure; call SDL_GetError() for more
 *          information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gamepad.h:1460 bool SDL_SendGamepadEffect(SDL_Gamepad *gamepad, const void *data, int size);
 */
export function sendGamepadEffect(gamepad: Deno.PointerValue<"SDL_Gamepad">, data: Deno.PointerValue, size: number): boolean {
  return lib.symbols.SDL_SendGamepadEffect(gamepad, data, size);
}

/**
 * Close a gamepad previously opened with SDL_OpenGamepad().
 *
 * @param gamepad a gamepad identifier previously returned by
 *                SDL_OpenGamepad().
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_OpenGamepad
 *
 * @from SDL_gamepad.h:1472 void SDL_CloseGamepad(SDL_Gamepad *gamepad);
 */
export function closeGamepad(gamepad: Deno.PointerValue<"SDL_Gamepad">): void {
  return lib.symbols.SDL_CloseGamepad(gamepad);
}

/**
 * Return the sfSymbolsName for a given button on a gamepad on Apple
 * platforms.
 *
 * @param gamepad the gamepad to query.
 * @param button a button on the gamepad.
 * @returns the sfSymbolsName or NULL if the name can't be found.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetGamepadAppleSFSymbolsNameForAxis
 *
 * @from SDL_gamepad.h:1486 const char * SDL_GetGamepadAppleSFSymbolsNameForButton(SDL_Gamepad *gamepad, SDL_GamepadButton button);
 */
export function getGamepadAppleSfSymbolsNameForButton(gamepad: Deno.PointerValue<"SDL_Gamepad">, button: number): string {
  return _p.getCstr2(lib.symbols.SDL_GetGamepadAppleSFSymbolsNameForButton(gamepad, button));
}

/**
 * Return the sfSymbolsName for a given axis on a gamepad on Apple platforms.
 *
 * @param gamepad the gamepad to query.
 * @param axis an axis on the gamepad.
 * @returns the sfSymbolsName or NULL if the name can't be found.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetGamepadAppleSFSymbolsNameForButton
 *
 * @from SDL_gamepad.h:1499 const char * SDL_GetGamepadAppleSFSymbolsNameForAxis(SDL_Gamepad *gamepad, SDL_GamepadAxis axis);
 */
export function getGamepadAppleSfSymbolsNameForAxis(gamepad: Deno.PointerValue<"SDL_Gamepad">, axis: number): string {
  return _p.getCstr2(lib.symbols.SDL_GetGamepadAppleSFSymbolsNameForAxis(gamepad, axis));
}

