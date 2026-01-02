/**
 * # CategoryJoystick
 *
 * SDL joystick support.
 *
 * This is the lower-level joystick handling. If you want the simpler option,
 * where what each button does is well-defined, you should use the gamepad API
 * instead.
 *
 * The term "instance_id" is the current instantiation of a joystick device in
 * the system. If the joystick is removed and then re-inserted then it will
 * get a new instance_id. instance_id's are monotonically increasing
 * identifiers of a joystick plugged in.
 *
 * The term "player_index" is the number assigned to a player on a specific
 * controller. For XInput controllers this returns the XInput user index. Many
 * joysticks will not be able to supply this information.
 *
 * SDL_GUID is used as a stable 128-bit identifier for a joystick device that
 * does not change over time. It identifies class of the device (a X360 wired
 * controller for example). This identifier is platform dependent.
 *
 * In order to use these functions, SDL_Init() must have been called with the
 * SDL_INIT_JOYSTICK flag. This causes SDL to scan the system for joysticks,
 * and load appropriate drivers.
 *
 * If you would like to receive joystick updates while the application is in
 * the background, you should set the following hint before calling
 * SDL_Init(): SDL_HINT_JOYSTICK_ALLOW_BACKGROUND_EVENTS
 *
 * SDL can provide virtual joysticks as well: the app defines an imaginary
 * controller with SDL_AttachVirtualJoystick(), and then can provide inputs
 * for it via SDL_SetJoystickVirtualAxis(), SDL_SetJoystickVirtualButton(),
 * etc. As this data is supplied, it will look like a normal joystick to SDL,
 * just not backed by a hardware driver. This has been used to make unusual
 * devices, like VR headset controllers, look like normal joysticks, or
 * provide recording/playback of game inputs, etc.
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
 * Locking for atomic access to the joystick API.
 *
 * The SDL joystick functions are thread-safe, however you can lock the
 * joysticks while processing to guarantee that the joystick list won't change
 * and joystick and gamepad events will not be delivered.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_joystick.h:188 void SDL_LockJoysticks(void) SDL_ACQUIRE(SDL_joystick_lock);
 */
SDL_LockJoysticks: {
      parameters: [],
      result: "void"
    },


/**
 * Unlocking for atomic access to the joystick API.
 *
 * @threadsafety This should be called from the same thread that called
 *               SDL_LockJoysticks().
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_joystick.h:198 void SDL_UnlockJoysticks(void) SDL_RELEASE(SDL_joystick_lock);
 */
SDL_UnlockJoysticks: {
      parameters: [],
      result: "void"
    },


/**
 * Return whether a joystick is currently connected.
 *
 * @returns true if a joystick is connected, false otherwise.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetJoysticks
 *
 * @from SDL_joystick.h:211 bool SDL_HasJoystick(void);
 */
SDL_HasJoystick: {
      parameters: [],
      result: "bool"
    },


/**
 * Get a list of currently connected joysticks.
 *
 * @param count a pointer filled in with the number of joysticks returned, may
 *              be NULL.
 * @returns a 0 terminated array of joystick instance IDs or NULL on failure;
 *          call SDL_GetError() for more information. This should be freed
 *          with SDL_free() when it is no longer needed.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_HasJoystick
 * @sa SDL_OpenJoystick
 *
 * @from SDL_joystick.h:229 SDL_JoystickID * SDL_GetJoysticks(int *count);
 */
SDL_GetJoysticks: {
      parameters: ["pointer"],
      result: "pointer"
    },


/**
 * Get the implementation dependent name of a joystick.
 *
 * This can be called before any joysticks are opened.
 *
 * @param instance_id the joystick instance ID.
 * @returns the name of the selected joystick. If no name can be found, this
 *          function returns NULL; call SDL_GetError() for more information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetJoystickName
 * @sa SDL_GetJoysticks
 *
 * @from SDL_joystick.h:247 const char * SDL_GetJoystickNameForID(SDL_JoystickID instance_id);
 */
SDL_GetJoystickNameForID: {
      parameters: ["u32"],
      result: "pointer"
    },


/**
 * Get the implementation dependent path of a joystick.
 *
 * This can be called before any joysticks are opened.
 *
 * @param instance_id the joystick instance ID.
 * @returns the path of the selected joystick. If no path can be found, this
 *          function returns NULL; call SDL_GetError() for more information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetJoystickPath
 * @sa SDL_GetJoysticks
 *
 * @from SDL_joystick.h:265 const char * SDL_GetJoystickPathForID(SDL_JoystickID instance_id);
 */
SDL_GetJoystickPathForID: {
      parameters: ["u32"],
      result: "pointer"
    },


/**
 * Get the player index of a joystick.
 *
 * This can be called before any joysticks are opened.
 *
 * @param instance_id the joystick instance ID.
 * @returns the player index of a joystick, or -1 if it's not available.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetJoystickPlayerIndex
 * @sa SDL_GetJoysticks
 *
 * @from SDL_joystick.h:282 int SDL_GetJoystickPlayerIndexForID(SDL_JoystickID instance_id);
 */
SDL_GetJoystickPlayerIndexForID: {
      parameters: ["u32"],
      result: "i32"
    },


/**
 * Get the implementation-dependent GUID of a joystick.
 *
 * This can be called before any joysticks are opened.
 *
 * @param instance_id the joystick instance ID.
 * @returns the GUID of the selected joystick. If called with an invalid
 *          instance_id, this function returns a zero GUID.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetJoystickGUID
 * @sa SDL_GUIDToString
 *
 * @from SDL_joystick.h:300 SDL_GUID SDL_GetJoystickGUIDForID(SDL_JoystickID instance_id);
 */
SDL_GetJoystickGUIDForID: {
      parameters: ["u32"],
      result: {"struct":["u8","u8","u8","u8","u8","u8","u8","u8","u8","u8","u8","u8","u8","u8","u8","u8"]}
    },


/**
 * Get the USB vendor ID of a joystick, if available.
 *
 * This can be called before any joysticks are opened. If the vendor ID isn't
 * available this function returns 0.
 *
 * @param instance_id the joystick instance ID.
 * @returns the USB vendor ID of the selected joystick. If called with an
 *          invalid instance_id, this function returns 0.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetJoystickVendor
 * @sa SDL_GetJoysticks
 *
 * @from SDL_joystick.h:319 Uint16 SDL_GetJoystickVendorForID(SDL_JoystickID instance_id);
 */
SDL_GetJoystickVendorForID: {
      parameters: ["u32"],
      result: "u16"
    },


/**
 * Get the USB product ID of a joystick, if available.
 *
 * This can be called before any joysticks are opened. If the product ID isn't
 * available this function returns 0.
 *
 * @param instance_id the joystick instance ID.
 * @returns the USB product ID of the selected joystick. If called with an
 *          invalid instance_id, this function returns 0.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetJoystickProduct
 * @sa SDL_GetJoysticks
 *
 * @from SDL_joystick.h:338 Uint16 SDL_GetJoystickProductForID(SDL_JoystickID instance_id);
 */
SDL_GetJoystickProductForID: {
      parameters: ["u32"],
      result: "u16"
    },


/**
 * Get the product version of a joystick, if available.
 *
 * This can be called before any joysticks are opened. If the product version
 * isn't available this function returns 0.
 *
 * @param instance_id the joystick instance ID.
 * @returns the product version of the selected joystick. If called with an
 *          invalid instance_id, this function returns 0.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetJoystickProductVersion
 * @sa SDL_GetJoysticks
 *
 * @from SDL_joystick.h:357 Uint16 SDL_GetJoystickProductVersionForID(SDL_JoystickID instance_id);
 */
SDL_GetJoystickProductVersionForID: {
      parameters: ["u32"],
      result: "u16"
    },


/**
 * Get the type of a joystick, if available.
 *
 * This can be called before any joysticks are opened.
 *
 * @param instance_id the joystick instance ID.
 * @returns the SDL_JoystickType of the selected joystick. If called with an
 *          invalid instance_id, this function returns
 *          `SDL_JOYSTICK_TYPE_UNKNOWN`.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetJoystickType
 * @sa SDL_GetJoysticks
 *
 * @from SDL_joystick.h:376 SDL_JoystickType SDL_GetJoystickTypeForID(SDL_JoystickID instance_id);
 */
SDL_GetJoystickTypeForID: {
      parameters: ["u32"],
      result: "u32"
    },


/**
 * Open a joystick for use.
 *
 * The joystick subsystem must be initialized before a joystick can be opened
 * for use.
 *
 * @param instance_id the joystick instance ID.
 * @returns a joystick identifier or NULL on failure; call SDL_GetError() for
 *          more information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_CloseJoystick
 *
 * @from SDL_joystick.h:394 SDL_Joystick * SDL_OpenJoystick(SDL_JoystickID instance_id);
 */
SDL_OpenJoystick: {
      parameters: ["u32"],
      result: "pointer"
    },


/**
 * Get the SDL_Joystick associated with an instance ID, if it has been opened.
 *
 * @param instance_id the instance ID to get the SDL_Joystick for.
 * @returns an SDL_Joystick on success or NULL on failure or if it hasn't been
 *          opened yet; call SDL_GetError() for more information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_joystick.h:407 SDL_Joystick * SDL_GetJoystickFromID(SDL_JoystickID instance_id);
 */
SDL_GetJoystickFromID: {
      parameters: ["u32"],
      result: "pointer"
    },


/**
 * Get the SDL_Joystick associated with a player index.
 *
 * @param player_index the player index to get the SDL_Joystick for.
 * @returns an SDL_Joystick on success or NULL on failure; call SDL_GetError()
 *          for more information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetJoystickPlayerIndex
 * @sa SDL_SetJoystickPlayerIndex
 *
 * @from SDL_joystick.h:423 SDL_Joystick * SDL_GetJoystickFromPlayerIndex(int player_index);
 */
SDL_GetJoystickFromPlayerIndex: {
      parameters: ["i32"],
      result: "pointer"
    },


/**
 * Attach a new virtual joystick.
 *
 * Apps can create virtual joysticks, that exist without hardware directly
 * backing them, and have program-supplied inputs. Once attached, a virtual
 * joystick looks like any other joystick that SDL can access. These can be
 * used to make other things look like joysticks, or provide pre-recorded
 * input, etc.
 *
 * Once attached, the app can send joystick inputs to the new virtual joystick
 * using SDL_SetJoystickVirtualAxis(), etc.
 *
 * When no longer needed, the virtual joystick can be removed by calling
 * SDL_DetachVirtualJoystick().
 *
 * @param desc joystick description, initialized using SDL_INIT_INTERFACE().
 * @returns the joystick instance ID, or 0 on failure; call SDL_GetError() for
 *          more information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_DetachVirtualJoystick
 * @sa SDL_SetJoystickVirtualAxis
 * @sa SDL_SetJoystickVirtualButton
 * @sa SDL_SetJoystickVirtualBall
 * @sa SDL_SetJoystickVirtualHat
 * @sa SDL_SetJoystickVirtualTouchpad
 * @sa SDL_SetJoystickVirtualSensorData
 *
 * @from SDL_joystick.h:538 SDL_JoystickID SDL_AttachVirtualJoystick(const SDL_VirtualJoystickDesc *desc);
 */
SDL_AttachVirtualJoystick: {
      parameters: ["pointer"],
      result: "u32"
    },


/**
 * Detach a virtual joystick.
 *
 * @param instance_id the joystick instance ID, previously returned from
 *                    SDL_AttachVirtualJoystick().
 * @returns true on success or false on failure; call SDL_GetError() for more
 *          information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_AttachVirtualJoystick
 *
 * @from SDL_joystick.h:554 bool SDL_DetachVirtualJoystick(SDL_JoystickID instance_id);
 */
SDL_DetachVirtualJoystick: {
      parameters: ["u32"],
      result: "bool"
    },


/**
 * Query whether or not a joystick is virtual.
 *
 * @param instance_id the joystick instance ID.
 * @returns true if the joystick is virtual, false otherwise.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_joystick.h:566 bool SDL_IsJoystickVirtual(SDL_JoystickID instance_id);
 */
SDL_IsJoystickVirtual: {
      parameters: ["u32"],
      result: "bool"
    },


/**
 * Set the state of an axis on an opened virtual joystick.
 *
 * Please note that values set here will not be applied until the next call to
 * SDL_UpdateJoysticks, which can either be called directly, or can be called
 * indirectly through various other SDL APIs, including, but not limited to
 * the following: SDL_PollEvent, SDL_PumpEvents, SDL_WaitEventTimeout,
 * SDL_WaitEvent.
 *
 * Note that when sending trigger axes, you should scale the value to the full
 * range of Sint16. For example, a trigger at rest would have the value of
 * `SDL_JOYSTICK_AXIS_MIN`.
 *
 * @param joystick the virtual joystick on which to set state.
 * @param axis the index of the axis on the virtual joystick to update.
 * @param value the new value for the specified axis.
 * @returns true on success or false on failure; call SDL_GetError() for more
 *          information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_SetJoystickVirtualButton
 * @sa SDL_SetJoystickVirtualBall
 * @sa SDL_SetJoystickVirtualHat
 * @sa SDL_SetJoystickVirtualTouchpad
 * @sa SDL_SetJoystickVirtualSensorData
 *
 * @from SDL_joystick.h:597 bool SDL_SetJoystickVirtualAxis(SDL_Joystick *joystick, int axis, Sint16 value);
 */
SDL_SetJoystickVirtualAxis: {
      parameters: ["pointer", "i32", "i16"],
      result: "bool"
    },


/**
 * Generate ball motion on an opened virtual joystick.
 *
 * Please note that values set here will not be applied until the next call to
 * SDL_UpdateJoysticks, which can either be called directly, or can be called
 * indirectly through various other SDL APIs, including, but not limited to
 * the following: SDL_PollEvent, SDL_PumpEvents, SDL_WaitEventTimeout,
 * SDL_WaitEvent.
 *
 * @param joystick the virtual joystick on which to set state.
 * @param ball the index of the ball on the virtual joystick to update.
 * @param xrel the relative motion on the X axis.
 * @param yrel the relative motion on the Y axis.
 * @returns true on success or false on failure; call SDL_GetError() for more
 *          information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_SetJoystickVirtualAxis
 * @sa SDL_SetJoystickVirtualButton
 * @sa SDL_SetJoystickVirtualHat
 * @sa SDL_SetJoystickVirtualTouchpad
 * @sa SDL_SetJoystickVirtualSensorData
 *
 * @from SDL_joystick.h:625 bool SDL_SetJoystickVirtualBall(SDL_Joystick *joystick, int ball, Sint16 xrel, Sint16 yrel);
 */
SDL_SetJoystickVirtualBall: {
      parameters: ["pointer", "i32", "i16", "i16"],
      result: "bool"
    },


/**
 * Set the state of a button on an opened virtual joystick.
 *
 * Please note that values set here will not be applied until the next call to
 * SDL_UpdateJoysticks, which can either be called directly, or can be called
 * indirectly through various other SDL APIs, including, but not limited to
 * the following: SDL_PollEvent, SDL_PumpEvents, SDL_WaitEventTimeout,
 * SDL_WaitEvent.
 *
 * @param joystick the virtual joystick on which to set state.
 * @param button the index of the button on the virtual joystick to update.
 * @param down true if the button is pressed, false otherwise.
 * @returns true on success or false on failure; call SDL_GetError() for more
 *          information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_SetJoystickVirtualAxis
 * @sa SDL_SetJoystickVirtualBall
 * @sa SDL_SetJoystickVirtualHat
 * @sa SDL_SetJoystickVirtualTouchpad
 * @sa SDL_SetJoystickVirtualSensorData
 *
 * @from SDL_joystick.h:652 bool SDL_SetJoystickVirtualButton(SDL_Joystick *joystick, int button, bool down);
 */
SDL_SetJoystickVirtualButton: {
      parameters: ["pointer", "i32", "bool"],
      result: "bool"
    },


/**
 * Set the state of a hat on an opened virtual joystick.
 *
 * Please note that values set here will not be applied until the next call to
 * SDL_UpdateJoysticks, which can either be called directly, or can be called
 * indirectly through various other SDL APIs, including, but not limited to
 * the following: SDL_PollEvent, SDL_PumpEvents, SDL_WaitEventTimeout,
 * SDL_WaitEvent.
 *
 * @param joystick the virtual joystick on which to set state.
 * @param hat the index of the hat on the virtual joystick to update.
 * @param value the new value for the specified hat.
 * @returns true on success or false on failure; call SDL_GetError() for more
 *          information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_SetJoystickVirtualAxis
 * @sa SDL_SetJoystickVirtualButton
 * @sa SDL_SetJoystickVirtualBall
 * @sa SDL_SetJoystickVirtualTouchpad
 * @sa SDL_SetJoystickVirtualSensorData
 *
 * @from SDL_joystick.h:679 bool SDL_SetJoystickVirtualHat(SDL_Joystick *joystick, int hat, Uint8 value);
 */
SDL_SetJoystickVirtualHat: {
      parameters: ["pointer", "i32", "u8"],
      result: "bool"
    },


/**
 * Set touchpad finger state on an opened virtual joystick.
 *
 * Please note that values set here will not be applied until the next call to
 * SDL_UpdateJoysticks, which can either be called directly, or can be called
 * indirectly through various other SDL APIs, including, but not limited to
 * the following: SDL_PollEvent, SDL_PumpEvents, SDL_WaitEventTimeout,
 * SDL_WaitEvent.
 *
 * @param joystick the virtual joystick on which to set state.
 * @param touchpad the index of the touchpad on the virtual joystick to
 *                 update.
 * @param finger the index of the finger on the touchpad to set.
 * @param down true if the finger is pressed, false if the finger is released.
 * @param x the x coordinate of the finger on the touchpad, normalized 0 to 1,
 *          with the origin in the upper left.
 * @param y the y coordinate of the finger on the touchpad, normalized 0 to 1,
 *          with the origin in the upper left.
 * @param pressure the pressure of the finger.
 * @returns true on success or false on failure; call SDL_GetError() for more
 *          information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_SetJoystickVirtualAxis
 * @sa SDL_SetJoystickVirtualButton
 * @sa SDL_SetJoystickVirtualBall
 * @sa SDL_SetJoystickVirtualHat
 * @sa SDL_SetJoystickVirtualSensorData
 *
 * @from SDL_joystick.h:713 bool SDL_SetJoystickVirtualTouchpad(SDL_Joystick *joystick, int touchpad, int finger, bool down, float x, float y, float pressure);
 */
SDL_SetJoystickVirtualTouchpad: {
      parameters: ["pointer", "i32", "i32", "bool", "f32", "f32", "f32"],
      result: "bool"
    },


/**
 * Send a sensor update for an opened virtual joystick.
 *
 * Please note that values set here will not be applied until the next call to
 * SDL_UpdateJoysticks, which can either be called directly, or can be called
 * indirectly through various other SDL APIs, including, but not limited to
 * the following: SDL_PollEvent, SDL_PumpEvents, SDL_WaitEventTimeout,
 * SDL_WaitEvent.
 *
 * @param joystick the virtual joystick on which to set state.
 * @param type the type of the sensor on the virtual joystick to update.
 * @param sensor_timestamp a 64-bit timestamp in nanoseconds associated with
 *                         the sensor reading.
 * @param data the data associated with the sensor reading.
 * @param num_values the number of values pointed to by `data`.
 * @returns true on success or false on failure; call SDL_GetError() for more
 *          information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_SetJoystickVirtualAxis
 * @sa SDL_SetJoystickVirtualButton
 * @sa SDL_SetJoystickVirtualBall
 * @sa SDL_SetJoystickVirtualHat
 * @sa SDL_SetJoystickVirtualTouchpad
 *
 * @from SDL_joystick.h:743 bool SDL_SendJoystickVirtualSensorData(SDL_Joystick *joystick, SDL_SensorType type, Uint64 sensor_timestamp, const float *data, int num_values);
 */
SDL_SendJoystickVirtualSensorData: {
      parameters: ["pointer", "u32", "u64", "pointer", "i32"],
      result: "bool"
    },


/**
 * Get the properties associated with a joystick.
 *
 * The following read-only properties are provided by SDL:
 *
 * - `SDL_PROP_JOYSTICK_CAP_MONO_LED_BOOLEAN`: true if this joystick has an
 *   LED that has adjustable brightness
 * - `SDL_PROP_JOYSTICK_CAP_RGB_LED_BOOLEAN`: true if this joystick has an LED
 *   that has adjustable color
 * - `SDL_PROP_JOYSTICK_CAP_PLAYER_LED_BOOLEAN`: true if this joystick has a
 *   player LED
 * - `SDL_PROP_JOYSTICK_CAP_RUMBLE_BOOLEAN`: true if this joystick has
 *   left/right rumble
 * - `SDL_PROP_JOYSTICK_CAP_TRIGGER_RUMBLE_BOOLEAN`: true if this joystick has
 *   simple trigger rumble
 *
 * @param joystick the SDL_Joystick obtained from SDL_OpenJoystick().
 * @returns a valid property ID on success or 0 on failure; call
 *          SDL_GetError() for more information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_joystick.h:769 SDL_PropertiesID SDL_GetJoystickProperties(SDL_Joystick *joystick);
 */
SDL_GetJoystickProperties: {
      parameters: ["pointer"],
      result: "u32"
    },


/**
 * Get the implementation dependent name of a joystick.
 *
 * @param joystick the SDL_Joystick obtained from SDL_OpenJoystick().
 * @returns the name of the selected joystick. If no name can be found, this
 *          function returns NULL; call SDL_GetError() for more information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetJoystickNameForID
 *
 * @from SDL_joystick.h:790 const char * SDL_GetJoystickName(SDL_Joystick *joystick);
 */
SDL_GetJoystickName: {
      parameters: ["pointer"],
      result: "pointer"
    },


/**
 * Get the implementation dependent path of a joystick.
 *
 * @param joystick the SDL_Joystick obtained from SDL_OpenJoystick().
 * @returns the path of the selected joystick. If no path can be found, this
 *          function returns NULL; call SDL_GetError() for more information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetJoystickPathForID
 *
 * @from SDL_joystick.h:805 const char * SDL_GetJoystickPath(SDL_Joystick *joystick);
 */
SDL_GetJoystickPath: {
      parameters: ["pointer"],
      result: "pointer"
    },


/**
 * Get the player index of an opened joystick.
 *
 * For XInput controllers this returns the XInput user index. Many joysticks
 * will not be able to supply this information.
 *
 * @param joystick the SDL_Joystick obtained from SDL_OpenJoystick().
 * @returns the player index, or -1 if it's not available.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_SetJoystickPlayerIndex
 *
 * @from SDL_joystick.h:822 int SDL_GetJoystickPlayerIndex(SDL_Joystick *joystick);
 */
SDL_GetJoystickPlayerIndex: {
      parameters: ["pointer"],
      result: "i32"
    },


/**
 * Set the player index of an opened joystick.
 *
 * @param joystick the SDL_Joystick obtained from SDL_OpenJoystick().
 * @param player_index player index to assign to this joystick, or -1 to clear
 *                     the player index and turn off player LEDs.
 * @returns true on success or false on failure; call SDL_GetError() for more
 *          information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetJoystickPlayerIndex
 *
 * @from SDL_joystick.h:839 bool SDL_SetJoystickPlayerIndex(SDL_Joystick *joystick, int player_index);
 */
SDL_SetJoystickPlayerIndex: {
      parameters: ["pointer", "i32"],
      result: "bool"
    },


/**
 * Get the implementation-dependent GUID for the joystick.
 *
 * This function requires an open joystick.
 *
 * @param joystick the SDL_Joystick obtained from SDL_OpenJoystick().
 * @returns the GUID of the given joystick. If called on an invalid index,
 *          this function returns a zero GUID; call SDL_GetError() for more
 *          information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetJoystickGUIDForID
 * @sa SDL_GUIDToString
 *
 * @from SDL_joystick.h:858 SDL_GUID SDL_GetJoystickGUID(SDL_Joystick *joystick);
 */
SDL_GetJoystickGUID: {
      parameters: ["pointer"],
      result: {"struct":["u8","u8","u8","u8","u8","u8","u8","u8","u8","u8","u8","u8","u8","u8","u8","u8"]}
    },


/**
 * Get the USB vendor ID of an opened joystick, if available.
 *
 * If the vendor ID isn't available this function returns 0.
 *
 * @param joystick the SDL_Joystick obtained from SDL_OpenJoystick().
 * @returns the USB vendor ID of the selected joystick, or 0 if unavailable.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetJoystickVendorForID
 *
 * @from SDL_joystick.h:874 Uint16 SDL_GetJoystickVendor(SDL_Joystick *joystick);
 */
SDL_GetJoystickVendor: {
      parameters: ["pointer"],
      result: "u16"
    },


/**
 * Get the USB product ID of an opened joystick, if available.
 *
 * If the product ID isn't available this function returns 0.
 *
 * @param joystick the SDL_Joystick obtained from SDL_OpenJoystick().
 * @returns the USB product ID of the selected joystick, or 0 if unavailable.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetJoystickProductForID
 *
 * @from SDL_joystick.h:890 Uint16 SDL_GetJoystickProduct(SDL_Joystick *joystick);
 */
SDL_GetJoystickProduct: {
      parameters: ["pointer"],
      result: "u16"
    },


/**
 * Get the product version of an opened joystick, if available.
 *
 * If the product version isn't available this function returns 0.
 *
 * @param joystick the SDL_Joystick obtained from SDL_OpenJoystick().
 * @returns the product version of the selected joystick, or 0 if unavailable.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetJoystickProductVersionForID
 *
 * @from SDL_joystick.h:906 Uint16 SDL_GetJoystickProductVersion(SDL_Joystick *joystick);
 */
SDL_GetJoystickProductVersion: {
      parameters: ["pointer"],
      result: "u16"
    },


/**
 * Get the firmware version of an opened joystick, if available.
 *
 * If the firmware version isn't available this function returns 0.
 *
 * @param joystick the SDL_Joystick obtained from SDL_OpenJoystick().
 * @returns the firmware version of the selected joystick, or 0 if
 *          unavailable.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_joystick.h:921 Uint16 SDL_GetJoystickFirmwareVersion(SDL_Joystick *joystick);
 */
SDL_GetJoystickFirmwareVersion: {
      parameters: ["pointer"],
      result: "u16"
    },


/**
 * Get the serial number of an opened joystick, if available.
 *
 * Returns the serial number of the joystick, or NULL if it is not available.
 *
 * @param joystick the SDL_Joystick obtained from SDL_OpenJoystick().
 * @returns the serial number of the selected joystick, or NULL if
 *          unavailable.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_joystick.h:936 const char * SDL_GetJoystickSerial(SDL_Joystick *joystick);
 */
SDL_GetJoystickSerial: {
      parameters: ["pointer"],
      result: "pointer"
    },


/**
 * Get the type of an opened joystick.
 *
 * @param joystick the SDL_Joystick obtained from SDL_OpenJoystick().
 * @returns the SDL_JoystickType of the selected joystick.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetJoystickTypeForID
 *
 * @from SDL_joystick.h:950 SDL_JoystickType SDL_GetJoystickType(SDL_Joystick *joystick);
 */
SDL_GetJoystickType: {
      parameters: ["pointer"],
      result: "u32"
    },


/**
 * Get the device information encoded in a SDL_GUID structure.
 *
 * @param guid the SDL_GUID you wish to get info about.
 * @param vendor a pointer filled in with the device VID, or 0 if not
 *               available.
 * @param product a pointer filled in with the device PID, or 0 if not
 *                available.
 * @param version a pointer filled in with the device version, or 0 if not
 *                available.
 * @param crc16 a pointer filled in with a CRC used to distinguish different
 *              products with the same VID/PID, or 0 if not available.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetJoystickGUIDForID
 *
 * @from SDL_joystick.h:971 void SDL_GetJoystickGUIDInfo(SDL_GUID guid, Uint16 *vendor, Uint16 *product, Uint16 *version, Uint16 *crc16);
 */
SDL_GetJoystickGUIDInfo: {
      parameters: [{"struct":["u8","u8","u8","u8","u8","u8","u8","u8","u8","u8","u8","u8","u8","u8","u8","u8"]}, "pointer", "pointer", "pointer", "pointer"],
      result: "void"
    },


/**
 * Get the status of a specified joystick.
 *
 * @param joystick the joystick to query.
 * @returns true if the joystick has been opened, false if it has not; call
 *          SDL_GetError() for more information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_joystick.h:984 bool SDL_JoystickConnected(SDL_Joystick *joystick);
 */
SDL_JoystickConnected: {
      parameters: ["pointer"],
      result: "bool"
    },


/**
 * Get the instance ID of an opened joystick.
 *
 * @param joystick an SDL_Joystick structure containing joystick information.
 * @returns the instance ID of the specified joystick on success or 0 on
 *          failure; call SDL_GetError() for more information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_joystick.h:997 SDL_JoystickID SDL_GetJoystickID(SDL_Joystick *joystick);
 */
SDL_GetJoystickID: {
      parameters: ["pointer"],
      result: "u32"
    },


/**
 * Get the number of general axis controls on a joystick.
 *
 * Often, the directional pad on a game controller will either look like 4
 * separate buttons or a POV hat, and not axes, but all of this is up to the
 * device and platform.
 *
 * @param joystick an SDL_Joystick structure containing joystick information.
 * @returns the number of axis controls/number of axes on success or -1 on
 *          failure; call SDL_GetError() for more information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetJoystickAxis
 * @sa SDL_GetNumJoystickBalls
 * @sa SDL_GetNumJoystickButtons
 * @sa SDL_GetNumJoystickHats
 *
 * @from SDL_joystick.h:1019 int SDL_GetNumJoystickAxes(SDL_Joystick *joystick);
 */
SDL_GetNumJoystickAxes: {
      parameters: ["pointer"],
      result: "i32"
    },


/**
 * Get the number of trackballs on a joystick.
 *
 * Joystick trackballs have only relative motion events associated with them
 * and their state cannot be polled.
 *
 * Most joysticks do not have trackballs.
 *
 * @param joystick an SDL_Joystick structure containing joystick information.
 * @returns the number of trackballs on success or -1 on failure; call
 *          SDL_GetError() for more information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetJoystickBall
 * @sa SDL_GetNumJoystickAxes
 * @sa SDL_GetNumJoystickButtons
 * @sa SDL_GetNumJoystickHats
 *
 * @from SDL_joystick.h:1042 int SDL_GetNumJoystickBalls(SDL_Joystick *joystick);
 */
SDL_GetNumJoystickBalls: {
      parameters: ["pointer"],
      result: "i32"
    },


/**
 * Get the number of POV hats on a joystick.
 *
 * @param joystick an SDL_Joystick structure containing joystick information.
 * @returns the number of POV hats on success or -1 on failure; call
 *          SDL_GetError() for more information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetJoystickHat
 * @sa SDL_GetNumJoystickAxes
 * @sa SDL_GetNumJoystickBalls
 * @sa SDL_GetNumJoystickButtons
 *
 * @from SDL_joystick.h:1060 int SDL_GetNumJoystickHats(SDL_Joystick *joystick);
 */
SDL_GetNumJoystickHats: {
      parameters: ["pointer"],
      result: "i32"
    },


/**
 * Get the number of buttons on a joystick.
 *
 * @param joystick an SDL_Joystick structure containing joystick information.
 * @returns the number of buttons on success or -1 on failure; call
 *          SDL_GetError() for more information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetJoystickButton
 * @sa SDL_GetNumJoystickAxes
 * @sa SDL_GetNumJoystickBalls
 * @sa SDL_GetNumJoystickHats
 *
 * @from SDL_joystick.h:1078 int SDL_GetNumJoystickButtons(SDL_Joystick *joystick);
 */
SDL_GetNumJoystickButtons: {
      parameters: ["pointer"],
      result: "i32"
    },


/**
 * Set the state of joystick event processing.
 *
 * If joystick events are disabled, you must call SDL_UpdateJoysticks()
 * yourself and check the state of the joystick when you want joystick
 * information.
 *
 * @param enabled whether to process joystick events or not.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_JoystickEventsEnabled
 * @sa SDL_UpdateJoysticks
 *
 * @from SDL_joystick.h:1096 void SDL_SetJoystickEventsEnabled(bool enabled);
 */
SDL_SetJoystickEventsEnabled: {
      parameters: ["bool"],
      result: "void"
    },


/**
 * Query the state of joystick event processing.
 *
 * If joystick events are disabled, you must call SDL_UpdateJoysticks()
 * yourself and check the state of the joystick when you want joystick
 * information.
 *
 * @returns true if joystick events are being processed, false otherwise.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_SetJoystickEventsEnabled
 *
 * @from SDL_joystick.h:1113 bool SDL_JoystickEventsEnabled(void);
 */
SDL_JoystickEventsEnabled: {
      parameters: [],
      result: "bool"
    },


/**
 * Update the current state of the open joysticks.
 *
 * This is called automatically by the event loop if any joystick events are
 * enabled.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_joystick.h:1125 void SDL_UpdateJoysticks(void);
 */
SDL_UpdateJoysticks: {
      parameters: [],
      result: "void"
    },


/**
 * Get the current state of an axis control on a joystick.
 *
 * SDL makes no promises about what part of the joystick any given axis refers
 * to. Your game should have some sort of configuration UI to let users
 * specify what each axis should be bound to. Alternately, SDL's higher-level
 * Game Controller API makes a great effort to apply order to this lower-level
 * interface, so you know that a specific axis is the "left thumb stick," etc.
 *
 * The value returned by SDL_GetJoystickAxis() is a signed integer (-32768 to
 * 32767) representing the current position of the axis. It may be necessary
 * to impose certain tolerances on these values to account for jitter.
 *
 * @param joystick an SDL_Joystick structure containing joystick information.
 * @param axis the axis to query; the axis indices start at index 0.
 * @returns a 16-bit signed integer representing the current position of the
 *          axis or 0 on failure; call SDL_GetError() for more information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetNumJoystickAxes
 *
 * @from SDL_joystick.h:1151 Sint16 SDL_GetJoystickAxis(SDL_Joystick *joystick, int axis);
 */
SDL_GetJoystickAxis: {
      parameters: ["pointer", "i32"],
      result: "i16"
    },


/**
 * Get the initial state of an axis control on a joystick.
 *
 * The state is a value ranging from -32768 to 32767.
 *
 * The axis indices start at index 0.
 *
 * @param joystick an SDL_Joystick structure containing joystick information.
 * @param axis the axis to query; the axis indices start at index 0.
 * @param state upon return, the initial value is supplied here.
 * @returns true if this axis has any initial value, or false if not.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_joystick.h:1169 bool SDL_GetJoystickAxisInitialState(SDL_Joystick *joystick, int axis, Sint16 *state);
 */
SDL_GetJoystickAxisInitialState: {
      parameters: ["pointer", "i32", "pointer"],
      result: "bool"
    },


/**
 * Get the ball axis change since the last poll.
 *
 * Trackballs can only return relative motion since the last call to
 * SDL_GetJoystickBall(), these motion deltas are placed into `dx` and `dy`.
 *
 * Most joysticks do not have trackballs.
 *
 * @param joystick the SDL_Joystick to query.
 * @param ball the ball index to query; ball indices start at index 0.
 * @param dx stores the difference in the x axis position since the last poll.
 * @param dy stores the difference in the y axis position since the last poll.
 * @returns true on success or false on failure; call SDL_GetError() for more
 *          information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetNumJoystickBalls
 *
 * @from SDL_joystick.h:1192 bool SDL_GetJoystickBall(SDL_Joystick *joystick, int ball, int *dx, int *dy);
 */
SDL_GetJoystickBall: {
      parameters: ["pointer", "i32", "pointer", "pointer"],
      result: "bool"
    },


/**
 * Get the current state of a POV hat on a joystick.
 *
 * The returned value will be one of the `SDL_HAT_*` values.
 *
 * @param joystick an SDL_Joystick structure containing joystick information.
 * @param hat the hat index to get the state from; indices start at index 0.
 * @returns the current hat position.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetNumJoystickHats
 *
 * @from SDL_joystick.h:1209 Uint8 SDL_GetJoystickHat(SDL_Joystick *joystick, int hat);
 */
SDL_GetJoystickHat: {
      parameters: ["pointer", "i32"],
      result: "u8"
    },


/**
 * Get the current state of a button on a joystick.
 *
 * @param joystick an SDL_Joystick structure containing joystick information.
 * @param button the button index to get the state from; indices start at
 *               index 0.
 * @returns true if the button is pressed, false otherwise.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetNumJoystickButtons
 *
 * @from SDL_joystick.h:1235 bool SDL_GetJoystickButton(SDL_Joystick *joystick, int button);
 */
SDL_GetJoystickButton: {
      parameters: ["pointer", "i32"],
      result: "bool"
    },


/**
 * Start a rumble effect.
 *
 * Each call to this function cancels any previous rumble effect, and calling
 * it with 0 intensity stops any rumbling.
 *
 * This function requires you to process SDL events or call
 * SDL_UpdateJoysticks() to update rumble state.
 *
 * @param joystick the joystick to vibrate.
 * @param low_frequency_rumble the intensity of the low frequency (left)
 *                             rumble motor, from 0 to 0xFFFF.
 * @param high_frequency_rumble the intensity of the high frequency (right)
 *                              rumble motor, from 0 to 0xFFFF.
 * @param duration_ms the duration of the rumble effect, in milliseconds.
 * @returns true, or false if rumble isn't supported on this joystick.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_joystick.h:1258 bool SDL_RumbleJoystick(SDL_Joystick *joystick, Uint16 low_frequency_rumble, Uint16 high_frequency_rumble, Uint32 duration_ms);
 */
SDL_RumbleJoystick: {
      parameters: ["pointer", "u16", "u16", "u32"],
      result: "bool"
    },


/**
 * Start a rumble effect in the joystick's triggers.
 *
 * Each call to this function cancels any previous trigger rumble effect, and
 * calling it with 0 intensity stops any rumbling.
 *
 * Note that this is rumbling of the _triggers_ and not the game controller as
 * a whole. This is currently only supported on Xbox One controllers. If you
 * want the (more common) whole-controller rumble, use SDL_RumbleJoystick()
 * instead.
 *
 * This function requires you to process SDL events or call
 * SDL_UpdateJoysticks() to update rumble state.
 *
 * @param joystick the joystick to vibrate.
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
 * @sa SDL_RumbleJoystick
 *
 * @from SDL_joystick.h:1289 bool SDL_RumbleJoystickTriggers(SDL_Joystick *joystick, Uint16 left_rumble, Uint16 right_rumble, Uint32 duration_ms);
 */
SDL_RumbleJoystickTriggers: {
      parameters: ["pointer", "u16", "u16", "u32"],
      result: "bool"
    },


/**
 * Update a joystick's LED color.
 *
 * An example of a joystick LED is the light on the back of a PlayStation 4's
 * DualShock 4 controller.
 *
 * For joysticks with a single color LED, the maximum of the RGB values will
 * be used as the LED brightness.
 *
 * @param joystick the joystick to update.
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
 * @from SDL_joystick.h:1311 bool SDL_SetJoystickLED(SDL_Joystick *joystick, Uint8 red, Uint8 green, Uint8 blue);
 */
SDL_SetJoystickLED: {
      parameters: ["pointer", "u8", "u8", "u8"],
      result: "bool"
    },


/**
 * Send a joystick specific effect packet.
 *
 * @param joystick the joystick to affect.
 * @param data the data to send to the joystick.
 * @param size the size of the data to send to the joystick.
 * @returns true on success or false on failure; call SDL_GetError() for more
 *          information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_joystick.h:1326 bool SDL_SendJoystickEffect(SDL_Joystick *joystick, const void *data, int size);
 */
SDL_SendJoystickEffect: {
      parameters: ["pointer", "pointer", "i32"],
      result: "bool"
    },


/**
 * Close a joystick previously opened with SDL_OpenJoystick().
 *
 * @param joystick the joystick device to close.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_OpenJoystick
 *
 * @from SDL_joystick.h:1339 void SDL_CloseJoystick(SDL_Joystick *joystick);
 */
SDL_CloseJoystick: {
      parameters: ["pointer"],
      result: "void"
    },


/**
 * Get the connection state of a joystick.
 *
 * @param joystick the joystick to query.
 * @returns the connection state on success or
 *          `SDL_JOYSTICK_CONNECTION_INVALID` on failure; call SDL_GetError()
 *          for more information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_joystick.h:1353 SDL_JoystickConnectionState SDL_GetJoystickConnectionState(SDL_Joystick *joystick);
 */
SDL_GetJoystickConnectionState: {
      parameters: ["pointer"],
      result: "u32"
    },


/**
 * Get the battery state of a joystick.
 *
 * You should never take a battery status as absolute truth. Batteries
 * (especially failing batteries) are delicate hardware, and the values
 * reported here are best estimates based on what that hardware reports. It's
 * not uncommon for older batteries to lose stored power much faster than it
 * reports, or completely drain when reporting it has 20 percent left, etc.
 *
 * @param joystick the joystick to query.
 * @param percent a pointer filled in with the percentage of battery life
 *                left, between 0 and 100, or NULL to ignore. This will be
 *                filled in with -1 we can't determine a value or there is no
 *                battery.
 * @returns the current battery state or `SDL_POWERSTATE_ERROR` on failure;
 *          call SDL_GetError() for more information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_joystick.h:1376 SDL_PowerState SDL_GetJoystickPowerInfo(SDL_Joystick *joystick, int *percent);
 */
SDL_GetJoystickPowerInfo: {
      parameters: ["pointer", "pointer"],
      result: "u32"
    },

} as const satisfies Deno.ForeignLibraryInterface;
