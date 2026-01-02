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

import * as _ from "../_utils.ts";
import * as _b from "../_structs/SDL_joystick.ts";


/**
 * The structure that describes a virtual joystick touchpad.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @sa SDL_VirtualJoystickDesc
 *
 * @from SDL_joystick.h:432
 */
export interface VirtualJoystickTouchpadDesc {
  nfingers: number; /**< Uint16 : the number of simultaneous fingers on this touchpad */
  padding: number[]; /* Uint16[3] */
}

export function read_VirtualJoystickTouchpadDesc(dt: DataView): VirtualJoystickTouchpadDesc {
  const t = _b.SDL_VirtualJoystickTouchpadDesc.read(dt);
  return {
    nfingers: t.nfingers, /** Uint16 */
    padding: t.padding, /** Uint16 */
  };
}

export function write_VirtualJoystickTouchpadDesc(t: VirtualJoystickTouchpadDesc, dt: DataView) {
  _b.SDL_VirtualJoystickTouchpadDesc.write({
    nfingers: t.nfingers, /** Uint16 */
    padding: t.padding, /** Uint16 */
  }, dt);
}


/**
 * The structure that describes a virtual joystick sensor.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @sa SDL_VirtualJoystickDesc
 *
 * @from SDL_joystick.h:445
 */
export interface VirtualJoystickSensorDesc {
  type: number; /**< SDL_SensorType : the type of this sensor */
  rate: number; /**< float : the update frequency of this sensor, may be 0.0f */
}

export function read_VirtualJoystickSensorDesc(dt: DataView): VirtualJoystickSensorDesc {
  const t = _b.SDL_VirtualJoystickSensorDesc.read(dt);
  return {
    type: t.type, /** SDL_SensorType */
    rate: t.rate, /** float */
  };
}

export function write_VirtualJoystickSensorDesc(t: VirtualJoystickSensorDesc, dt: DataView) {
  _b.SDL_VirtualJoystickSensorDesc.write({
    type: t.type, /** SDL_SensorType */
    rate: t.rate, /** float */
  }, dt);
}


/**
 * The structure that describes a virtual joystick.
 *
 * This structure should be initialized using SDL_INIT_INTERFACE(). All
 * elements of this structure are optional.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @sa SDL_AttachVirtualJoystick
 * @sa SDL_INIT_INTERFACE
 * @sa SDL_VirtualJoystickSensorDesc
 * @sa SDL_VirtualJoystickTouchpadDesc
 *
 * @from SDL_joystick.h:464
 */
export interface VirtualJoystickDesc {
  version: number; /**< Uint32 : the version of this interface */
  type: number; /**< Uint16 : `SDL_JoystickType` */
  padding: number; /**< Uint16 : unused */
  vendor_id: number; /**< Uint16 : the USB vendor ID of this joystick */
  product_id: number; /**< Uint16 : the USB product ID of this joystick */
  naxes: number; /**< Uint16 : the number of axes on this joystick */
  nbuttons: number; /**< Uint16 : the number of buttons on this joystick */
  nballs: number; /**< Uint16 : the number of balls on this joystick */
  nhats: number; /**< Uint16 : the number of hats on this joystick */
  ntouchpads: number; /**< Uint16 : the number of touchpads on this joystick, requires `touchpads` to point at valid descriptions */
  nsensors: number; /**< Uint16 : the number of sensors on this joystick, requires `sensors` to point at valid descriptions */
  padding2: number[]; /**< Uint16[2] : unused */
  button_mask: number; /**< Uint32 : A mask of which buttons are valid for this controller
                             e.g. (1 << SDL_GAMEPAD_BUTTON_SOUTH) */
  axis_mask: number; /**< Uint32 : A mask of which axes are valid for this controller
                             e.g. (1 << SDL_GAMEPAD_AXIS_LEFTX) */
  name: string; /**< const char * : the name of the joystick */
  touchpads: Deno.PointerValue; /**< const SDL_VirtualJoystickTouchpadDesc * : A pointer to an array of touchpad descriptions, required if `ntouchpads` is > 0 */
  sensors: Deno.PointerValue; /**< const SDL_VirtualJoystickSensorDesc * : A pointer to an array of sensor descriptions, required if `nsensors` is > 0 */
  userdata: Deno.PointerValue; /**< void * : User data pointer passed to callbacks */
  Update: Deno.PointerValue; /**< void (SDLCALL *Update)(void *userdata); : Called when the joystick state should be updated */
  SetPlayerIndex: Deno.PointerValue; /**< void (SDLCALL *SetPlayerIndex)(void *userdata, int player_index); : Called when the player index is set */
  Rumble: Deno.PointerValue; /**< bool (SDLCALL *Rumble)(void *userdata, Uint16 low_frequency_rumble, Uint16 high_frequency_rumble); : Implements SDL_RumbleJoystick() */
  RumbleTriggers: Deno.PointerValue; /**< bool (SDLCALL *RumbleTriggers)(void *userdata, Uint16 left_rumble, Uint16 right_rumble); : Implements SDL_RumbleJoystickTriggers() */
  SetLED: Deno.PointerValue; /**< bool (SDLCALL *SetLED)(void *userdata, Uint8 red, Uint8 green, Uint8 blue); : Implements SDL_SetJoystickLED() */
  SendEffect: Deno.PointerValue; /**< bool (SDLCALL *SendEffect)(void *userdata, const void *data, int size); : Implements SDL_SendJoystickEffect() */
  SetSensorsEnabled: Deno.PointerValue; /**< bool (SDLCALL *SetSensorsEnabled)(void *userdata, bool enabled); : Implements SDL_SetGamepadSensorEnabled() */
  Cleanup: Deno.PointerValue; /**< void (SDLCALL *Cleanup)(void *userdata); : Cleans up the userdata when the joystick is detached */
}

export function read_VirtualJoystickDesc(dt: DataView): VirtualJoystickDesc {
  const t = _b.SDL_VirtualJoystickDesc.read(dt);
  return {
    version: t.version, /** Uint32 */
    type: t.type, /** Uint16 */
    padding: t.padding, /** Uint16 */
    vendor_id: t.vendor_id, /** Uint16 */
    product_id: t.product_id, /** Uint16 */
    naxes: t.naxes, /** Uint16 */
    nbuttons: t.nbuttons, /** Uint16 */
    nballs: t.nballs, /** Uint16 */
    nhats: t.nhats, /** Uint16 */
    ntouchpads: t.ntouchpads, /** Uint16 */
    nsensors: t.nsensors, /** Uint16 */
    padding2: t.padding2, /** Uint16 */
    button_mask: t.button_mask, /** Uint32 */
    axis_mask: t.axis_mask, /** Uint32 */
    name: _.read_cstr_v(t.name), /** const char * */
    touchpads: Deno.UnsafePointer.create(t.touchpads), /** const SDL_VirtualJoystickTouchpadDesc * */
    sensors: Deno.UnsafePointer.create(t.sensors), /** const SDL_VirtualJoystickSensorDesc * */
    userdata: Deno.UnsafePointer.create(t.userdata), /** void * */
    Update: Deno.UnsafePointer.create(t.Update), /** void (SDLCALL *Update)(void *userdata); */
    SetPlayerIndex: Deno.UnsafePointer.create(t.SetPlayerIndex), /** void (SDLCALL *SetPlayerIndex)(void *userdata, int player_index); */
    Rumble: Deno.UnsafePointer.create(t.Rumble), /** bool (SDLCALL *Rumble)(void *userdata, Uint16 low_frequency_rumble, Uint16 high_frequency_rumble); */
    RumbleTriggers: Deno.UnsafePointer.create(t.RumbleTriggers), /** bool (SDLCALL *RumbleTriggers)(void *userdata, Uint16 left_rumble, Uint16 right_rumble); */
    SetLED: Deno.UnsafePointer.create(t.SetLED), /** bool (SDLCALL *SetLED)(void *userdata, Uint8 red, Uint8 green, Uint8 blue); */
    SendEffect: Deno.UnsafePointer.create(t.SendEffect), /** bool (SDLCALL *SendEffect)(void *userdata, const void *data, int size); */
    SetSensorsEnabled: Deno.UnsafePointer.create(t.SetSensorsEnabled), /** bool (SDLCALL *SetSensorsEnabled)(void *userdata, bool enabled); */
    Cleanup: Deno.UnsafePointer.create(t.Cleanup), /** void (SDLCALL *Cleanup)(void *userdata); */
  };
}

export function write_VirtualJoystickDesc(t: VirtualJoystickDesc, dt: DataView) {
  _b.SDL_VirtualJoystickDesc.write({
    version: t.version, /** Uint32 */
    type: t.type, /** Uint16 */
    padding: t.padding, /** Uint16 */
    vendor_id: t.vendor_id, /** Uint16 */
    product_id: t.product_id, /** Uint16 */
    naxes: t.naxes, /** Uint16 */
    nbuttons: t.nbuttons, /** Uint16 */
    nballs: t.nballs, /** Uint16 */
    nhats: t.nhats, /** Uint16 */
    ntouchpads: t.ntouchpads, /** Uint16 */
    nsensors: t.nsensors, /** Uint16 */
    padding2: t.padding2, /** Uint16 */
    button_mask: t.button_mask, /** Uint32 */
    axis_mask: t.axis_mask, /** Uint32 */
    name: _.cstr_v(t.name), /** const char * */
    touchpads: Deno.UnsafePointer.value(t.touchpads), /** const SDL_VirtualJoystickTouchpadDesc * */
    sensors: Deno.UnsafePointer.value(t.sensors), /** const SDL_VirtualJoystickSensorDesc * */
    userdata: Deno.UnsafePointer.value(t.userdata), /** void * */
    Update: Deno.UnsafePointer.value(t.Update), /** void (SDLCALL *Update)(void *userdata); */
    SetPlayerIndex: Deno.UnsafePointer.value(t.SetPlayerIndex), /** void (SDLCALL *SetPlayerIndex)(void *userdata, int player_index); */
    Rumble: Deno.UnsafePointer.value(t.Rumble), /** bool (SDLCALL *Rumble)(void *userdata, Uint16 low_frequency_rumble, Uint16 high_frequency_rumble); */
    RumbleTriggers: Deno.UnsafePointer.value(t.RumbleTriggers), /** bool (SDLCALL *RumbleTriggers)(void *userdata, Uint16 left_rumble, Uint16 right_rumble); */
    SetLED: Deno.UnsafePointer.value(t.SetLED), /** bool (SDLCALL *SetLED)(void *userdata, Uint8 red, Uint8 green, Uint8 blue); */
    SendEffect: Deno.UnsafePointer.value(t.SendEffect), /** bool (SDLCALL *SendEffect)(void *userdata, const void *data, int size); */
    SetSensorsEnabled: Deno.UnsafePointer.value(t.SetSensorsEnabled), /** bool (SDLCALL *SetSensorsEnabled)(void *userdata, bool enabled); */
    Cleanup: Deno.UnsafePointer.value(t.Cleanup), /** void (SDLCALL *Cleanup)(void *userdata); */
  }, dt);
}
