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

import * as _ from "../_utils.ts";
import * as _b from "../_structs/SDL_gamepad.ts";
import * as _e from "../enums/SDL_gamepad.ts";

/**
 * A mapping between one joystick input to a gamepad control.
 *
 * A gamepad has a collection of several bindings, to say, for example, when
 * joystick button number 5 is pressed, that should be treated like the
 * gamepad's "start" button.
 *
 * SDL has these bindings built-in for many popular controllers, and can add
 * more with a simple text string. Those strings are parsed into a collection
 * of these structs to make it easier to operate on the data.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @sa SDL_GetGamepadBindings
 *
 * @from SDL_gamepad.h:261
 */
export interface GamepadBinding {
  input: GamepadBindingInput;
  output: GamepadBindingOutput;
}

export type GamepadBindingInput = GamepadBindingOutput | GamepadBindingHat;
export type GamepadBindingOutput = GamepadBindingButton | GamepadBindingAxis;

interface GamepadBindingType {
  type: _e.SDL_GamepadBindingType; /** SDL_GamepadBindingType */
}
interface GamepadBindingButton extends GamepadBindingType {
  type: _e.SDL_GamepadBindingType.BUTTON;
  button: number; /* int */
}
interface GamepadBindingAxis extends GamepadBindingType {
  type: _e.SDL_GamepadBindingType.AXIS;
  axis: _e.SDL_GamepadAxis; /* SDL_GamepadAxis */
  axis_min: number; /* int */
  axis_max: number; /* int */
}
interface GamepadBindingHat extends GamepadBindingType {
  type: _e.SDL_GamepadBindingType.HAT;
  hat: number; /* int */
  hat_mask: number; /* int */
}

export function read_GamepadBinding(dt: DataView): GamepadBinding {
  const t = _b.SDL_GamepadBinding.read(dt);
  const input: any = {};
  input.type = t.input_type; /** SDL_GamepadBindingType */
  switch (t.input_type) {
    case _e.SDL_GamepadBindingType.BUTTON:
      input.button = t.input[0]; /** int */
      break;
    case _e.SDL_GamepadBindingType.AXIS:
      input.axis = t.input[0]; /** int */
      input.axis_min = t.input[1]; /** int */
      input.axis_max = t.input[2]; /** int */
      break;
    case _e.SDL_GamepadBindingType.HAT:
      input.hat = t.input[0]; /** int */
      input.hat_mask = t.input[1]; /** int */
      break;
    default:
      throw new Error("Unknown input type");
  }
  const output: any = {};
  output.type = t.output_type; /** SDL_GamepadBindingType */
  switch (t.output_type) {
    case _e.SDL_GamepadBindingType.BUTTON:
      output.button = t.output[0]; /** int */
      break;
    case _e.SDL_GamepadBindingType.AXIS:
      output.axis = t.output[0]; /** int */
      output.axis_min = t.output[1]; /** int */
      output.axis_max = t.output[2]; /** int */
      break;
    default:
      throw new Error("Unknown output type");
  }

  return {
    input: input as GamepadBindingInput,
    output: output as GamepadBindingOutput,
  } as GamepadBinding;
}

export function write_GamepadBinding(t: GamepadBinding, dt: DataView) {
  function writeInput(input: GamepadBindingInput): number[] {
    const r = [0, 0, 0];
    switch (input.type) {
      case _e.SDL_GamepadBindingType.BUTTON:
        r[0] = input.button; /** int */
        break;
      case _e.SDL_GamepadBindingType.AXIS:
        r[0] = input.axis; /** int */
        r[1] = input.axis_min; /** int */
        r[2] = input.axis_max; /** int */
        break;
      case _e.SDL_GamepadBindingType.HAT:
        r[0] = input.hat; /** int */
        r[1] = input.hat_mask; /** int */
        break;
    }
    return r;
  }
  _b.SDL_GamepadBinding.write({
    input_type: t.input.type, /** SDL_GamepadBindingType */
    input: writeInput(t.input),
    output_type: t.output.type, /** SDL_GamepadBindingType */
    output: writeInput(t.output),
  }, dt);
}
