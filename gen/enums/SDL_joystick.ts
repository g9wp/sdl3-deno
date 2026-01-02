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

/**
 * @from SDL_joystick:771 SDL_PROP_JOYSTICK_CAP_
 */
export enum PROP_JOYSTICK_CAP {
  MONO_LED_BOOLEAN = "SDL.joystick.cap.mono_led", 
  RGB_LED_BOOLEAN = "SDL.joystick.cap.rgb_led", 
  PLAYER_LED_BOOLEAN = "SDL.joystick.cap.player_led", 
  RUMBLE_BOOLEAN = "SDL.joystick.cap.rumble", 
  TRIGGER_RUMBLE_BOOLEAN = "SDL.joystick.cap.trigger_rumble", 
}



/**
 * @from SDL_joystick:1211 SDL_HAT_
 */
export enum HAT {
  CENTERED = 0x00, 
  UP = 0x01, 
  RIGHT = 0x02, 
  DOWN = 0x04, 
  LEFT = 0x08, 
  RIGHTUP = (RIGHT|UP), 
  RIGHTDOWN = (RIGHT|DOWN), 
  LEFTUP = (LEFT|UP), 
  LEFTDOWN = (LEFT|DOWN), 
}



/**
 * An enum of some common joystick types.
 *
 * In some cases, SDL can identify a low-level joystick as being a certain
 * type of device, and will report it through SDL_GetJoystickType (or
 * SDL_GetJoystickTypeForID).
 *
 * This is by no means a complete list of everything that can be plugged into
 * a computer.
 *
 * You may refer to
 * [XInput Controller Types](https://learn.microsoft.com/en-us/windows/win32/xinput/xinput-and-controller-subtypes)
 * table for a general understanding of each joystick type.
 *
 * @since This enum is available since SDL 3.2.0.
 *
 * @from SDL_joystick.h:123 SDL_JOYSTICK_TYPE_
 */
export enum SDL_JoystickType {
  UNKNOWN, 
  GAMEPAD, 
  WHEEL, 
  ARCADE_STICK, 
  FLIGHT_STICK, 
  DANCE_PAD, 
  GUITAR, 
  DRUM_KIT, 
  ARCADE_PAD, 
  THROTTLE, 
  COUNT, 
}



/**
 * Possible connection states for a joystick device.
 *
 * This is used by SDL_GetJoystickConnectionState to report how a device is
 * connected to the system.
 *
 * @since This enum is available since SDL 3.2.0.
 *
 * @from SDL_joystick.h:146 SDL_JOYSTICK_CONNECTION_
 */
export enum SDL_JoystickConnectionState {
  INVALID = -1, 
  UNKNOWN, 
  WIRED, 
  WIRELESS, 
}



