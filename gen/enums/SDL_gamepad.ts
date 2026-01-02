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

/**
 * Standard gamepad types.
 *
 * This type does not necessarily map to first-party controllers from
 * Microsoft/Sony/Nintendo; in many cases, third-party controllers can report
 * as these, either because they were designed for a specific console, or they
 * simply most closely match that console's controllers (does it have A/B/X/Y
 * buttons or X/O/Square/Triangle? Does it have a touchpad? etc).
 *
 * @from SDL_gamepad.h:110 SDL_GAMEPAD_TYPE_
 */
export enum SDL_GamepadType {
  UNKNOWN = 0, 
  STANDARD, 
  XBOX360, 
  XBOXONE, 
  PS3, 
  PS4, 
  PS5, 
  NINTENDO_SWITCH_PRO, 
  NINTENDO_SWITCH_JOYCON_LEFT, 
  NINTENDO_SWITCH_JOYCON_RIGHT, 
  NINTENDO_SWITCH_JOYCON_PAIR, 
  GAMECUBE, 
  COUNT, 
}



/**
 * The list of buttons available on a gamepad
 *
 * For controllers that use a diamond pattern for the face buttons, the
 * south/east/west/north buttons below correspond to the locations in the
 * diamond pattern. For Xbox controllers, this would be A/B/X/Y, for Nintendo
 * Switch controllers, this would be B/A/Y/X, for GameCube controllers this
 * would be A/X/B/Y, for PlayStation controllers this would be
 * Cross/Circle/Square/Triangle.
 *
 * For controllers that don't use a diamond pattern for the face buttons, the
 * south/east/west/north buttons indicate the buttons labeled A, B, C, D, or
 * 1, 2, 3, 4, or for controllers that aren't labeled, they are the primary,
 * secondary, etc. buttons.
 *
 * The activate action is often the south button and the cancel action is
 * often the east button, but in some regions this is reversed, so your game
 * should allow remapping actions based on user preferences.
 *
 * You can query the labels for the face buttons using
 * SDL_GetGamepadButtonLabel()
 *
 * @since This enum is available since SDL 3.2.0.
 *
 * @from SDL_gamepad.h:151 SDL_GAMEPAD_BUTTON_
 */
export enum SDL_GamepadButton {
  INVALID = -1, 
  SOUTH, /**< Bottom face button (e.g. Xbox A button) */
  EAST, /**< Right face button (e.g. Xbox B button) */
  WEST, /**< Left face button (e.g. Xbox X button) */
  NORTH, /**< Top face button (e.g. Xbox Y button) */
  BACK, 
  GUIDE, 
  START, 
  LEFT_STICK, 
  RIGHT_STICK, 
  LEFT_SHOULDER, 
  RIGHT_SHOULDER, 
  DPAD_UP, 
  DPAD_DOWN, 
  DPAD_LEFT, 
  DPAD_RIGHT, 
  MISC1, /**< Additional button (e.g. Xbox Series X share button, PS5 microphone button, Nintendo Switch Pro capture button, Amazon Luna microphone button, Google Stadia capture button) */
  RIGHT_PADDLE1, /**< Upper or primary paddle, under your right hand (e.g. Xbox Elite paddle P1, DualSense Edge RB button, Right Joy-Con SR button) */
  LEFT_PADDLE1, /**< Upper or primary paddle, under your left hand (e.g. Xbox Elite paddle P3, DualSense Edge LB button, Left Joy-Con SL button) */
  RIGHT_PADDLE2, /**< Lower or secondary paddle, under your right hand (e.g. Xbox Elite paddle P2, DualSense Edge right Fn button, Right Joy-Con SL button) */
  LEFT_PADDLE2, /**< Lower or secondary paddle, under your left hand (e.g. Xbox Elite paddle P4, DualSense Edge left Fn button, Left Joy-Con SR button) */
  TOUCHPAD, /**< PS4/PS5 touchpad button */
  MISC2, /**< Additional button */
  MISC3, /**< Additional button (e.g. Nintendo GameCube left trigger click) */
  MISC4, /**< Additional button (e.g. Nintendo GameCube right trigger click) */
  MISC5, /**< Additional button */
  MISC6, /**< Additional button */
  COUNT, 
}



/**
 * The set of gamepad button labels
 *
 * This isn't a complete set, just the face buttons to make it easy to show
 * button prompts.
 *
 * For a complete set, you should look at the button and gamepad type and have
 * a set of symbols that work well with your art style.
 *
 * @since This enum is available since SDL 3.2.0.
 *
 * @from SDL_gamepad.h:194 SDL_GAMEPAD_BUTTON_LABEL_
 */
export enum SDL_GamepadButtonLabel {
  UNKNOWN, 
  A, 
  B, 
  X, 
  Y, 
  CROSS, 
  CIRCLE, 
  SQUARE, 
  TRIANGLE, 
}



/**
 * The list of axes available on a gamepad
 *
 * Thumbstick axis values range from SDL_JOYSTICK_AXIS_MIN to
 * SDL_JOYSTICK_AXIS_MAX, and are centered within ~8000 of zero, though
 * advanced UI will allow users to set or autodetect the dead zone, which
 * varies between gamepads.
 *
 * Trigger axis values range from 0 (released) to SDL_JOYSTICK_AXIS_MAX (fully
 * pressed) when reported by SDL_GetGamepadAxis(). Note that this is not the
 * same range that will be reported by the lower-level SDL_GetJoystickAxis().
 *
 * @since This enum is available since SDL 3.2.0.
 *
 * @from SDL_gamepad.h:221 SDL_GAMEPAD_AXIS_
 */
export enum SDL_GamepadAxis {
  INVALID = -1, 
  LEFTX, 
  LEFTY, 
  RIGHTX, 
  RIGHTY, 
  LEFT_TRIGGER, 
  RIGHT_TRIGGER, 
  COUNT, 
}



/**
 * Types of gamepad control bindings.
 *
 * A gamepad is a collection of bindings that map arbitrary joystick buttons,
 * axes and hat switches to specific positions on a generic console-style
 * gamepad. This enum is used as part of SDL_GamepadBinding to specify those
 * mappings.
 *
 * @since This enum is available since SDL 3.2.0.
 *
 * @from SDL_gamepad.h:243 SDL_GAMEPAD_BINDTYPE_
 */
export enum SDL_GamepadBindingType {
  NONE = 0, 
  BUTTON, 
  AXIS, 
  HAT, 
}



