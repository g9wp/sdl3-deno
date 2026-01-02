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
 * If you're using SDL gamepad support in a Steam game, you must call
 * SteamAPI_InitEx() before calling SDL_Init().
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


export const symbols = {

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
 * @from SDL_gamepad.h:345 int SDL_AddGamepadMapping(const char *mapping);
 */
SDL_AddGamepadMapping: {
      parameters: ["pointer"],
      result: "i32"
    },


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
 * @from SDL_gamepad.h:385 int SDL_AddGamepadMappingsFromIO(SDL_IOStream *src, bool closeio);
 */
SDL_AddGamepadMappingsFromIO: {
      parameters: ["pointer", "bool"],
      result: "i32"
    },


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
 * @from SDL_gamepad.h:419 int SDL_AddGamepadMappingsFromFile(const char *file);
 */
SDL_AddGamepadMappingsFromFile: {
      parameters: ["pointer"],
      result: "i32"
    },


/**
 * Reinitialize the SDL mapping database to its initial state.
 *
 * This will generate gamepad events as needed if device mappings change.
 *
 * @returns true on success or false on failure; call SDL_GetError() for more
 *          information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gamepad.h:433 bool SDL_ReloadGamepadMappings(void);
 */
SDL_ReloadGamepadMappings: {
      parameters: [],
      result: "bool"
    },


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
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gamepad.h:449 char ** SDL_GetGamepadMappings(int *count);
 */
SDL_GetGamepadMappings: {
      parameters: ["pointer"],
      result: "pointer"
    },


/**
 * Get the gamepad mapping string for a given GUID.
 *
 * @param guid a structure containing the GUID for which a mapping is desired.
 * @returns a mapping string or NULL on failure; call SDL_GetError() for more
 *          information. This should be freed with SDL_free() when it is no
 *          longer needed.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetJoystickGUIDForID
 * @sa SDL_GetJoystickGUID
 *
 * @from SDL_gamepad.h:466 char * SDL_GetGamepadMappingForGUID(SDL_GUID guid);
 */
SDL_GetGamepadMappingForGUID: {
      parameters: [{"struct":["u8","u8","u8","u8","u8","u8","u8","u8","u8","u8","u8","u8","u8","u8","u8","u8"]}],
      result: "pointer"
    },


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
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_AddGamepadMapping
 * @sa SDL_GetGamepadMappingForID
 * @sa SDL_GetGamepadMappingForGUID
 * @sa SDL_SetGamepadMapping
 *
 * @from SDL_gamepad.h:487 char * SDL_GetGamepadMapping(SDL_Gamepad *gamepad);
 */
SDL_GetGamepadMapping: {
      parameters: ["pointer"],
      result: "pointer"
    },


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
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_AddGamepadMapping
 * @sa SDL_GetGamepadMapping
 *
 * @from SDL_gamepad.h:507 bool SDL_SetGamepadMapping(SDL_JoystickID instance_id, const char *mapping);
 */
SDL_SetGamepadMapping: {
      parameters: ["u32", "pointer"],
      result: "bool"
    },


/**
 * Return whether a gamepad is currently connected.
 *
 * @returns true if a gamepad is connected, false otherwise.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetGamepads
 *
 * @from SDL_gamepad.h:520 bool SDL_HasGamepad(void);
 */
SDL_HasGamepad: {
      parameters: [],
      result: "bool"
    },


/**
 * Get a list of currently connected gamepads.
 *
 * @param count a pointer filled in with the number of gamepads returned, may
 *              be NULL.
 * @returns a 0 terminated array of joystick instance IDs or NULL on failure;
 *          call SDL_GetError() for more information. This should be freed
 *          with SDL_free() when it is no longer needed.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_HasGamepad
 * @sa SDL_OpenGamepad
 *
 * @from SDL_gamepad.h:538 SDL_JoystickID * SDL_GetGamepads(int *count);
 */
SDL_GetGamepads: {
      parameters: ["pointer"],
      result: "pointer"
    },


/**
 * Check if the given joystick is supported by the gamepad interface.
 *
 * @param instance_id the joystick instance ID.
 * @returns true if the given joystick is supported by the gamepad interface,
 *          false if it isn't or it's an invalid index.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetJoysticks
 * @sa SDL_OpenGamepad
 *
 * @from SDL_gamepad.h:554 bool SDL_IsGamepad(SDL_JoystickID instance_id);
 */
SDL_IsGamepad: {
      parameters: ["u32"],
      result: "bool"
    },


/**
 * Get the implementation dependent name of a gamepad.
 *
 * This can be called before any gamepads are opened.
 *
 * @param instance_id the joystick instance ID.
 * @returns the name of the selected gamepad. If no name can be found, this
 *          function returns NULL; call SDL_GetError() for more information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetGamepadName
 * @sa SDL_GetGamepads
 *
 * @from SDL_gamepad.h:572 const char * SDL_GetGamepadNameForID(SDL_JoystickID instance_id);
 */
SDL_GetGamepadNameForID: {
      parameters: ["u32"],
      result: "pointer"
    },


/**
 * Get the implementation dependent path of a gamepad.
 *
 * This can be called before any gamepads are opened.
 *
 * @param instance_id the joystick instance ID.
 * @returns the path of the selected gamepad. If no path can be found, this
 *          function returns NULL; call SDL_GetError() for more information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetGamepadPath
 * @sa SDL_GetGamepads
 *
 * @from SDL_gamepad.h:590 const char * SDL_GetGamepadPathForID(SDL_JoystickID instance_id);
 */
SDL_GetGamepadPathForID: {
      parameters: ["u32"],
      result: "pointer"
    },


/**
 * Get the player index of a gamepad.
 *
 * This can be called before any gamepads are opened.
 *
 * @param instance_id the joystick instance ID.
 * @returns the player index of a gamepad, or -1 if it's not available.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetGamepadPlayerIndex
 * @sa SDL_GetGamepads
 *
 * @from SDL_gamepad.h:607 int SDL_GetGamepadPlayerIndexForID(SDL_JoystickID instance_id);
 */
SDL_GetGamepadPlayerIndexForID: {
      parameters: ["u32"],
      result: "i32"
    },


/**
 * Get the implementation-dependent GUID of a gamepad.
 *
 * This can be called before any gamepads are opened.
 *
 * @param instance_id the joystick instance ID.
 * @returns the GUID of the selected gamepad. If called on an invalid index,
 *          this function returns a zero GUID.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GUIDToString
 * @sa SDL_GetGamepads
 *
 * @from SDL_gamepad.h:625 SDL_GUID SDL_GetGamepadGUIDForID(SDL_JoystickID instance_id);
 */
SDL_GetGamepadGUIDForID: {
      parameters: ["u32"],
      result: {"struct":["u8","u8","u8","u8","u8","u8","u8","u8","u8","u8","u8","u8","u8","u8","u8","u8"]}
    },


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
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetGamepadVendor
 * @sa SDL_GetGamepads
 *
 * @from SDL_gamepad.h:644 Uint16 SDL_GetGamepadVendorForID(SDL_JoystickID instance_id);
 */
SDL_GetGamepadVendorForID: {
      parameters: ["u32"],
      result: "u16"
    },


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
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetGamepadProduct
 * @sa SDL_GetGamepads
 *
 * @from SDL_gamepad.h:663 Uint16 SDL_GetGamepadProductForID(SDL_JoystickID instance_id);
 */
SDL_GetGamepadProductForID: {
      parameters: ["u32"],
      result: "u16"
    },


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
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetGamepadProductVersion
 * @sa SDL_GetGamepads
 *
 * @from SDL_gamepad.h:682 Uint16 SDL_GetGamepadProductVersionForID(SDL_JoystickID instance_id);
 */
SDL_GetGamepadProductVersionForID: {
      parameters: ["u32"],
      result: "u16"
    },


/**
 * Get the type of a gamepad.
 *
 * This can be called before any gamepads are opened.
 *
 * @param instance_id the joystick instance ID.
 * @returns the gamepad type.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetGamepadType
 * @sa SDL_GetGamepads
 * @sa SDL_GetRealGamepadTypeForID
 *
 * @from SDL_gamepad.h:700 SDL_GamepadType SDL_GetGamepadTypeForID(SDL_JoystickID instance_id);
 */
SDL_GetGamepadTypeForID: {
      parameters: ["u32"],
      result: "u32"
    },


/**
 * Get the type of a gamepad, ignoring any mapping override.
 *
 * This can be called before any gamepads are opened.
 *
 * @param instance_id the joystick instance ID.
 * @returns the gamepad type.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetGamepadTypeForID
 * @sa SDL_GetGamepads
 * @sa SDL_GetRealGamepadType
 *
 * @from SDL_gamepad.h:718 SDL_GamepadType SDL_GetRealGamepadTypeForID(SDL_JoystickID instance_id);
 */
SDL_GetRealGamepadTypeForID: {
      parameters: ["u32"],
      result: "u32"
    },


/**
 * Get the mapping of a gamepad.
 *
 * This can be called before any gamepads are opened.
 *
 * @param instance_id the joystick instance ID.
 * @returns the mapping string. Returns NULL if no mapping is available. This
 *          should be freed with SDL_free() when it is no longer needed.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetGamepads
 * @sa SDL_GetGamepadMapping
 *
 * @from SDL_gamepad.h:736 char * SDL_GetGamepadMappingForID(SDL_JoystickID instance_id);
 */
SDL_GetGamepadMappingForID: {
      parameters: ["u32"],
      result: "pointer"
    },


/**
 * Open a gamepad for use.
 *
 * @param instance_id the joystick instance ID.
 * @returns a gamepad identifier or NULL if an error occurred; call
 *          SDL_GetError() for more information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_CloseGamepad
 * @sa SDL_IsGamepad
 *
 * @from SDL_gamepad.h:752 SDL_Gamepad * SDL_OpenGamepad(SDL_JoystickID instance_id);
 */
SDL_OpenGamepad: {
      parameters: ["u32"],
      result: "pointer"
    },


/**
 * Get the SDL_Gamepad associated with a joystick instance ID, if it has been
 * opened.
 *
 * @param instance_id the joystick instance ID of the gamepad.
 * @returns an SDL_Gamepad on success or NULL on failure or if it hasn't been
 *          opened yet; call SDL_GetError() for more information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gamepad.h:766 SDL_Gamepad * SDL_GetGamepadFromID(SDL_JoystickID instance_id);
 */
SDL_GetGamepadFromID: {
      parameters: ["u32"],
      result: "pointer"
    },


/**
 * Get the SDL_Gamepad associated with a player index.
 *
 * @param player_index the player index, which different from the instance ID.
 * @returns the SDL_Gamepad associated with a player index.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetGamepadPlayerIndex
 * @sa SDL_SetGamepadPlayerIndex
 *
 * @from SDL_gamepad.h:781 SDL_Gamepad * SDL_GetGamepadFromPlayerIndex(int player_index);
 */
SDL_GetGamepadFromPlayerIndex: {
      parameters: ["i32"],
      result: "pointer"
    },


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
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gamepad.h:810 SDL_PropertiesID SDL_GetGamepadProperties(SDL_Gamepad *gamepad);
 */
SDL_GetGamepadProperties: {
      parameters: ["pointer"],
      result: "u32"
    },


/**
 * Get the instance ID of an opened gamepad.
 *
 * @param gamepad a gamepad identifier previously returned by
 *                SDL_OpenGamepad().
 * @returns the instance ID of the specified gamepad on success or 0 on
 *          failure; call SDL_GetError() for more information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gamepad.h:830 SDL_JoystickID SDL_GetGamepadID(SDL_Gamepad *gamepad);
 */
SDL_GetGamepadID: {
      parameters: ["pointer"],
      result: "u32"
    },


/**
 * Get the implementation-dependent name for an opened gamepad.
 *
 * @param gamepad a gamepad identifier previously returned by
 *                SDL_OpenGamepad().
 * @returns the implementation dependent name for the gamepad, or NULL if
 *          there is no name or the identifier passed is invalid.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetGamepadNameForID
 *
 * @from SDL_gamepad.h:846 const char * SDL_GetGamepadName(SDL_Gamepad *gamepad);
 */
SDL_GetGamepadName: {
      parameters: ["pointer"],
      result: "pointer"
    },


/**
 * Get the implementation-dependent path for an opened gamepad.
 *
 * @param gamepad a gamepad identifier previously returned by
 *                SDL_OpenGamepad().
 * @returns the implementation dependent path for the gamepad, or NULL if
 *          there is no path or the identifier passed is invalid.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetGamepadPathForID
 *
 * @from SDL_gamepad.h:862 const char * SDL_GetGamepadPath(SDL_Gamepad *gamepad);
 */
SDL_GetGamepadPath: {
      parameters: ["pointer"],
      result: "pointer"
    },


/**
 * Get the type of an opened gamepad.
 *
 * @param gamepad the gamepad object to query.
 * @returns the gamepad type, or SDL_GAMEPAD_TYPE_UNKNOWN if it's not
 *          available.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetGamepadTypeForID
 *
 * @from SDL_gamepad.h:877 SDL_GamepadType SDL_GetGamepadType(SDL_Gamepad *gamepad);
 */
SDL_GetGamepadType: {
      parameters: ["pointer"],
      result: "u32"
    },


/**
 * Get the type of an opened gamepad, ignoring any mapping override.
 *
 * @param gamepad the gamepad object to query.
 * @returns the gamepad type, or SDL_GAMEPAD_TYPE_UNKNOWN if it's not
 *          available.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetRealGamepadTypeForID
 *
 * @from SDL_gamepad.h:892 SDL_GamepadType SDL_GetRealGamepadType(SDL_Gamepad *gamepad);
 */
SDL_GetRealGamepadType: {
      parameters: ["pointer"],
      result: "u32"
    },


/**
 * Get the player index of an opened gamepad.
 *
 * For XInput gamepads this returns the XInput user index.
 *
 * @param gamepad the gamepad object to query.
 * @returns the player index for gamepad, or -1 if it's not available.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_SetGamepadPlayerIndex
 *
 * @from SDL_gamepad.h:908 int SDL_GetGamepadPlayerIndex(SDL_Gamepad *gamepad);
 */
SDL_GetGamepadPlayerIndex: {
      parameters: ["pointer"],
      result: "i32"
    },


/**
 * Set the player index of an opened gamepad.
 *
 * @param gamepad the gamepad object to adjust.
 * @param player_index player index to assign to this gamepad, or -1 to clear
 *                     the player index and turn off player LEDs.
 * @returns true on success or false on failure; call SDL_GetError() for more
 *          information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetGamepadPlayerIndex
 *
 * @from SDL_gamepad.h:925 bool SDL_SetGamepadPlayerIndex(SDL_Gamepad *gamepad, int player_index);
 */
SDL_SetGamepadPlayerIndex: {
      parameters: ["pointer", "i32"],
      result: "bool"
    },


/**
 * Get the USB vendor ID of an opened gamepad, if available.
 *
 * If the vendor ID isn't available this function returns 0.
 *
 * @param gamepad the gamepad object to query.
 * @returns the USB vendor ID, or zero if unavailable.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetGamepadVendorForID
 *
 * @from SDL_gamepad.h:941 Uint16 SDL_GetGamepadVendor(SDL_Gamepad *gamepad);
 */
SDL_GetGamepadVendor: {
      parameters: ["pointer"],
      result: "u16"
    },


/**
 * Get the USB product ID of an opened gamepad, if available.
 *
 * If the product ID isn't available this function returns 0.
 *
 * @param gamepad the gamepad object to query.
 * @returns the USB product ID, or zero if unavailable.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetGamepadProductForID
 *
 * @from SDL_gamepad.h:957 Uint16 SDL_GetGamepadProduct(SDL_Gamepad *gamepad);
 */
SDL_GetGamepadProduct: {
      parameters: ["pointer"],
      result: "u16"
    },


/**
 * Get the product version of an opened gamepad, if available.
 *
 * If the product version isn't available this function returns 0.
 *
 * @param gamepad the gamepad object to query.
 * @returns the USB product version, or zero if unavailable.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetGamepadProductVersionForID
 *
 * @from SDL_gamepad.h:973 Uint16 SDL_GetGamepadProductVersion(SDL_Gamepad *gamepad);
 */
SDL_GetGamepadProductVersion: {
      parameters: ["pointer"],
      result: "u16"
    },


/**
 * Get the firmware version of an opened gamepad, if available.
 *
 * If the firmware version isn't available this function returns 0.
 *
 * @param gamepad the gamepad object to query.
 * @returns the gamepad firmware version, or zero if unavailable.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gamepad.h:987 Uint16 SDL_GetGamepadFirmwareVersion(SDL_Gamepad *gamepad);
 */
SDL_GetGamepadFirmwareVersion: {
      parameters: ["pointer"],
      result: "u16"
    },


/**
 * Get the serial number of an opened gamepad, if available.
 *
 * Returns the serial number of the gamepad, or NULL if it is not available.
 *
 * @param gamepad the gamepad object to query.
 * @returns the serial number, or NULL if unavailable.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gamepad.h:1001 const char * SDL_GetGamepadSerial(SDL_Gamepad *gamepad);
 */
SDL_GetGamepadSerial: {
      parameters: ["pointer"],
      result: "pointer"
    },


/**
 * Get the Steam Input handle of an opened gamepad, if available.
 *
 * Returns an InputHandle_t for the gamepad that can be used with Steam Input
 * API: https://partner.steamgames.com/doc/api/ISteamInput
 *
 * @param gamepad the gamepad object to query.
 * @returns the gamepad handle, or 0 if unavailable.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gamepad.h:1016 Uint64 SDL_GetGamepadSteamHandle(SDL_Gamepad *gamepad);
 */
SDL_GetGamepadSteamHandle: {
      parameters: ["pointer"],
      result: "u64"
    },


/**
 * Get the connection state of a gamepad.
 *
 * @param gamepad the gamepad object to query.
 * @returns the connection state on success or
 *          `SDL_JOYSTICK_CONNECTION_INVALID` on failure; call SDL_GetError()
 *          for more information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gamepad.h:1030 SDL_JoystickConnectionState SDL_GetGamepadConnectionState(SDL_Gamepad *gamepad);
 */
SDL_GetGamepadConnectionState: {
      parameters: ["pointer"],
      result: "u32"
    },


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
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gamepad.h:1052 SDL_PowerState SDL_GetGamepadPowerInfo(SDL_Gamepad *gamepad, int *percent);
 */
SDL_GetGamepadPowerInfo: {
      parameters: ["pointer", "pointer"],
      result: "u32"
    },


/**
 * Check if a gamepad has been opened and is currently connected.
 *
 * @param gamepad a gamepad identifier previously returned by
 *                SDL_OpenGamepad().
 * @returns true if the gamepad has been opened and is currently connected, or
 *          false if not.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gamepad.h:1066 bool SDL_GamepadConnected(SDL_Gamepad *gamepad);
 */
SDL_GamepadConnected: {
      parameters: ["pointer"],
      result: "bool"
    },


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
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gamepad.h:1088 SDL_Joystick * SDL_GetGamepadJoystick(SDL_Gamepad *gamepad);
 */
SDL_GetGamepadJoystick: {
      parameters: ["pointer"],
      result: "pointer"
    },


/**
 * Set the state of gamepad event processing.
 *
 * If gamepad events are disabled, you must call SDL_UpdateGamepads() yourself
 * and check the state of the gamepad when you want gamepad information.
 *
 * @param enabled whether to process gamepad events or not.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GamepadEventsEnabled
 * @sa SDL_UpdateGamepads
 *
 * @from SDL_gamepad.h:1105 void SDL_SetGamepadEventsEnabled(bool enabled);
 */
SDL_SetGamepadEventsEnabled: {
      parameters: ["bool"],
      result: "void"
    },


/**
 * Query the state of gamepad event processing.
 *
 * If gamepad events are disabled, you must call SDL_UpdateGamepads() yourself
 * and check the state of the gamepad when you want gamepad information.
 *
 * @returns true if gamepad events are being processed, false otherwise.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_SetGamepadEventsEnabled
 *
 * @from SDL_gamepad.h:1121 bool SDL_GamepadEventsEnabled(void);
 */
SDL_GamepadEventsEnabled: {
      parameters: [],
      result: "bool"
    },


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
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gamepad.h:1137 SDL_GamepadBinding ** SDL_GetGamepadBindings(SDL_Gamepad *gamepad, int *count);
 */
SDL_GetGamepadBindings: {
      parameters: ["pointer", "pointer"],
      result: "pointer"
    },


/**
 * Manually pump gamepad updates if not using the loop.
 *
 * This function is called automatically by the event loop if events are
 * enabled. Under such circumstances, it will not be necessary to call this
 * function.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gamepad.h:1150 void SDL_UpdateGamepads(void);
 */
SDL_UpdateGamepads: {
      parameters: [],
      result: "void"
    },


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
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetGamepadStringForType
 *
 * @from SDL_gamepad.h:1170 SDL_GamepadType SDL_GetGamepadTypeFromString(const char *str);
 */
SDL_GetGamepadTypeFromString: {
      parameters: ["pointer"],
      result: "u32"
    },


/**
 * Convert from an SDL_GamepadType enum to a string.
 *
 * @param type an enum value for a given SDL_GamepadType.
 * @returns a string for the given type, or NULL if an invalid type is
 *          specified. The string returned is of the format used by
 *          SDL_Gamepad mapping strings.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetGamepadTypeFromString
 *
 * @from SDL_gamepad.h:1186 const char * SDL_GetGamepadStringForType(SDL_GamepadType type);
 */
SDL_GetGamepadStringForType: {
      parameters: ["u32"],
      result: "pointer"
    },


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
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetGamepadStringForAxis
 *
 * @from SDL_gamepad.h:1210 SDL_GamepadAxis SDL_GetGamepadAxisFromString(const char *str);
 */
SDL_GetGamepadAxisFromString: {
      parameters: ["pointer"],
      result: "u32"
    },


/**
 * Convert from an SDL_GamepadAxis enum to a string.
 *
 * @param axis an enum value for a given SDL_GamepadAxis.
 * @returns a string for the given axis, or NULL if an invalid axis is
 *          specified. The string returned is of the format used by
 *          SDL_Gamepad mapping strings.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetGamepadAxisFromString
 *
 * @from SDL_gamepad.h:1226 const char * SDL_GetGamepadStringForAxis(SDL_GamepadAxis axis);
 */
SDL_GetGamepadStringForAxis: {
      parameters: ["u32"],
      result: "pointer"
    },


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
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GamepadHasButton
 * @sa SDL_GetGamepadAxis
 *
 * @from SDL_gamepad.h:1245 bool SDL_GamepadHasAxis(SDL_Gamepad *gamepad, SDL_GamepadAxis axis);
 */
SDL_GamepadHasAxis: {
      parameters: ["pointer", "u32"],
      result: "bool"
    },


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
 * Note that for invalid gamepads or axes, this will return 0. Zero is also a
 * valid value in normal operation; usually it means a centered axis.
 *
 * @param gamepad a gamepad.
 * @param axis an axis index (one of the SDL_GamepadAxis values).
 * @returns axis state.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GamepadHasAxis
 * @sa SDL_GetGamepadButton
 *
 * @from SDL_gamepad.h:1273 Sint16 SDL_GetGamepadAxis(SDL_Gamepad *gamepad, SDL_GamepadAxis axis);
 */
SDL_GetGamepadAxis: {
      parameters: ["pointer", "u32"],
      result: "i16"
    },


/**
 * Convert a string into an SDL_GamepadButton enum.
 *
 * This function is called internally to translate SDL_Gamepad mapping strings
 * for the underlying joystick device into the consistent SDL_Gamepad mapping.
 * You do not normally need to call this function unless you are parsing
 * SDL_Gamepad mappings in your own code.
 *
 * @param str string representing a SDL_Gamepad button.
 * @returns the SDL_GamepadButton enum corresponding to the input string, or
 *          `SDL_GAMEPAD_BUTTON_INVALID` if no match was found.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetGamepadStringForButton
 *
 * @from SDL_gamepad.h:1293 SDL_GamepadButton SDL_GetGamepadButtonFromString(const char *str);
 */
SDL_GetGamepadButtonFromString: {
      parameters: ["pointer"],
      result: "u32"
    },


/**
 * Convert from an SDL_GamepadButton enum to a string.
 *
 * @param button an enum value for a given SDL_GamepadButton.
 * @returns a string for the given button, or NULL if an invalid button is
 *          specified. The string returned is of the format used by
 *          SDL_Gamepad mapping strings.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetGamepadButtonFromString
 *
 * @from SDL_gamepad.h:1309 const char * SDL_GetGamepadStringForButton(SDL_GamepadButton button);
 */
SDL_GetGamepadStringForButton: {
      parameters: ["u32"],
      result: "pointer"
    },


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
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GamepadHasAxis
 *
 * @from SDL_gamepad.h:1327 bool SDL_GamepadHasButton(SDL_Gamepad *gamepad, SDL_GamepadButton button);
 */
SDL_GamepadHasButton: {
      parameters: ["pointer", "u32"],
      result: "bool"
    },


/**
 * Get the current state of a button on a gamepad.
 *
 * @param gamepad a gamepad.
 * @param button a button index (one of the SDL_GamepadButton values).
 * @returns true if the button is pressed, false otherwise.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GamepadHasButton
 * @sa SDL_GetGamepadAxis
 *
 * @from SDL_gamepad.h:1343 bool SDL_GetGamepadButton(SDL_Gamepad *gamepad, SDL_GamepadButton button);
 */
SDL_GetGamepadButton: {
      parameters: ["pointer", "u32"],
      result: "bool"
    },


/**
 * Get the label of a button on a gamepad.
 *
 * @param type the type of gamepad to check.
 * @param button a button index (one of the SDL_GamepadButton values).
 * @returns the SDL_GamepadButtonLabel enum corresponding to the button label.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetGamepadButtonLabel
 *
 * @from SDL_gamepad.h:1358 SDL_GamepadButtonLabel SDL_GetGamepadButtonLabelForType(SDL_GamepadType type, SDL_GamepadButton button);
 */
SDL_GetGamepadButtonLabelForType: {
      parameters: ["u32", "u32"],
      result: "u32"
    },


/**
 * Get the label of a button on a gamepad.
 *
 * @param gamepad a gamepad.
 * @param button a button index (one of the SDL_GamepadButton values).
 * @returns the SDL_GamepadButtonLabel enum corresponding to the button label.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetGamepadButtonLabelForType
 *
 * @from SDL_gamepad.h:1373 SDL_GamepadButtonLabel SDL_GetGamepadButtonLabel(SDL_Gamepad *gamepad, SDL_GamepadButton button);
 */
SDL_GetGamepadButtonLabel: {
      parameters: ["pointer", "u32"],
      result: "u32"
    },


/**
 * Get the number of touchpads on a gamepad.
 *
 * @param gamepad a gamepad.
 * @returns number of touchpads.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetNumGamepadTouchpadFingers
 *
 * @from SDL_gamepad.h:1387 int SDL_GetNumGamepadTouchpads(SDL_Gamepad *gamepad);
 */
SDL_GetNumGamepadTouchpads: {
      parameters: ["pointer"],
      result: "i32"
    },


/**
 * Get the number of supported simultaneous fingers on a touchpad on a game
 * gamepad.
 *
 * @param gamepad a gamepad.
 * @param touchpad a touchpad.
 * @returns number of supported simultaneous fingers.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetGamepadTouchpadFinger
 * @sa SDL_GetNumGamepadTouchpads
 *
 * @from SDL_gamepad.h:1404 int SDL_GetNumGamepadTouchpadFingers(SDL_Gamepad *gamepad, int touchpad);
 */
SDL_GetNumGamepadTouchpadFingers: {
      parameters: ["pointer", "i32"],
      result: "i32"
    },


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
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetNumGamepadTouchpadFingers
 *
 * @from SDL_gamepad.h:1428 bool SDL_GetGamepadTouchpadFinger(SDL_Gamepad *gamepad, int touchpad, int finger, bool *down, float *x, float *y, float *pressure);
 */
SDL_GetGamepadTouchpadFinger: {
      parameters: ["pointer", "i32", "i32", "pointer", "pointer", "pointer", "pointer"],
      result: "bool"
    },


/**
 * Return whether a gamepad has a particular sensor.
 *
 * @param gamepad the gamepad to query.
 * @param type the type of sensor to query.
 * @returns true if the sensor exists, false otherwise.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetGamepadSensorData
 * @sa SDL_GetGamepadSensorDataRate
 * @sa SDL_SetGamepadSensorEnabled
 *
 * @from SDL_gamepad.h:1445 bool SDL_GamepadHasSensor(SDL_Gamepad *gamepad, SDL_SensorType type);
 */
SDL_GamepadHasSensor: {
      parameters: ["pointer", "u32"],
      result: "bool"
    },


/**
 * Set whether data reporting for a gamepad sensor is enabled.
 *
 * @param gamepad the gamepad to update.
 * @param type the type of sensor to enable/disable.
 * @param enabled whether data reporting should be enabled.
 * @returns true on success or false on failure; call SDL_GetError() for more
 *          information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GamepadHasSensor
 * @sa SDL_GamepadSensorEnabled
 *
 * @from SDL_gamepad.h:1463 bool SDL_SetGamepadSensorEnabled(SDL_Gamepad *gamepad, SDL_SensorType type, bool enabled);
 */
SDL_SetGamepadSensorEnabled: {
      parameters: ["pointer", "u32", "bool"],
      result: "bool"
    },


/**
 * Query whether sensor data reporting is enabled for a gamepad.
 *
 * @param gamepad the gamepad to query.
 * @param type the type of sensor to query.
 * @returns true if the sensor is enabled, false otherwise.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_SetGamepadSensorEnabled
 *
 * @from SDL_gamepad.h:1478 bool SDL_GamepadSensorEnabled(SDL_Gamepad *gamepad, SDL_SensorType type);
 */
SDL_GamepadSensorEnabled: {
      parameters: ["pointer", "u32"],
      result: "bool"
    },


/**
 * Get the data rate (number of events per second) of a gamepad sensor.
 *
 * @param gamepad the gamepad to query.
 * @param type the type of sensor to query.
 * @returns the data rate, or 0.0f if the data rate is not available.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gamepad.h:1491 float SDL_GetGamepadSensorDataRate(SDL_Gamepad *gamepad, SDL_SensorType type);
 */
SDL_GetGamepadSensorDataRate: {
      parameters: ["pointer", "u32"],
      result: "f32"
    },


/**
 * Get the current state of a gamepad sensor.
 *
 * The number of values and interpretation of the data is sensor dependent.
 * See the remarks in SDL_SensorType for details for each type of sensor.
 *
 * @param gamepad the gamepad to query.
 * @param type the type of sensor to query.
 * @param data a pointer filled with the current sensor state.
 * @param num_values the number of values to write to data.
 * @returns true on success or false on failure; call SDL_GetError() for more
 *          information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gamepad.h:1510 bool SDL_GetGamepadSensorData(SDL_Gamepad *gamepad, SDL_SensorType type, float *data, int num_values);
 */
SDL_GetGamepadSensorData: {
      parameters: ["pointer", "u32", "pointer", "i32"],
      result: "bool"
    },


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
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gamepad.h:1534 bool SDL_RumbleGamepad(SDL_Gamepad *gamepad, Uint16 low_frequency_rumble, Uint16 high_frequency_rumble, Uint32 duration_ms);
 */
SDL_RumbleGamepad: {
      parameters: ["pointer", "u16", "u16", "u32"],
      result: "bool"
    },


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
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_RumbleGamepad
 *
 * @from SDL_gamepad.h:1564 bool SDL_RumbleGamepadTriggers(SDL_Gamepad *gamepad, Uint16 left_rumble, Uint16 right_rumble, Uint32 duration_ms);
 */
SDL_RumbleGamepadTriggers: {
      parameters: ["pointer", "u16", "u16", "u32"],
      result: "bool"
    },


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
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gamepad.h:1586 bool SDL_SetGamepadLED(SDL_Gamepad *gamepad, Uint8 red, Uint8 green, Uint8 blue);
 */
SDL_SetGamepadLED: {
      parameters: ["pointer", "u8", "u8", "u8"],
      result: "bool"
    },


/**
 * Send a gamepad specific effect packet.
 *
 * @param gamepad the gamepad to affect.
 * @param data the data to send to the gamepad.
 * @param size the size of the data to send to the gamepad.
 * @returns true on success or false on failure; call SDL_GetError() for more
 *          information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gamepad.h:1601 bool SDL_SendGamepadEffect(SDL_Gamepad *gamepad, const void *data, int size);
 */
SDL_SendGamepadEffect: {
      parameters: ["pointer", "pointer", "i32"],
      result: "bool"
    },


/**
 * Close a gamepad previously opened with SDL_OpenGamepad().
 *
 * @param gamepad a gamepad identifier previously returned by
 *                SDL_OpenGamepad().
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_OpenGamepad
 *
 * @from SDL_gamepad.h:1615 void SDL_CloseGamepad(SDL_Gamepad *gamepad);
 */
SDL_CloseGamepad: {
      parameters: ["pointer"],
      result: "void"
    },


/**
 * Return the sfSymbolsName for a given button on a gamepad on Apple
 * platforms.
 *
 * @param gamepad the gamepad to query.
 * @param button a button on the gamepad.
 * @returns the sfSymbolsName or NULL if the name can't be found.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetGamepadAppleSFSymbolsNameForAxis
 *
 * @from SDL_gamepad.h:1631 const char * SDL_GetGamepadAppleSFSymbolsNameForButton(SDL_Gamepad *gamepad, SDL_GamepadButton button);
 */
SDL_GetGamepadAppleSFSymbolsNameForButton: {
      parameters: ["pointer", "u32"],
      result: "pointer"
    },


/**
 * Return the sfSymbolsName for a given axis on a gamepad on Apple platforms.
 *
 * @param gamepad the gamepad to query.
 * @param axis an axis on the gamepad.
 * @returns the sfSymbolsName or NULL if the name can't be found.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetGamepadAppleSFSymbolsNameForButton
 *
 * @from SDL_gamepad.h:1646 const char * SDL_GetGamepadAppleSFSymbolsNameForAxis(SDL_Gamepad *gamepad, SDL_GamepadAxis axis);
 */
SDL_GetGamepadAppleSFSymbolsNameForAxis: {
      parameters: ["pointer", "u32"],
      result: "pointer"
    },

} as const satisfies Deno.ForeignLibraryInterface;
