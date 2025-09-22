/**
 * # CategoryTouch
 *
 * SDL offers touch input, on platforms that support it. It can manage
 * multiple touch devices and track multiple fingers on those devices.
 *
 * Touches are mostly dealt with through the event system, in the
 * SDL_EVENT_FINGER_DOWN, SDL_EVENT_FINGER_MOTION, and SDL_EVENT_FINGER_UP
 * events, but there are also functions to query for hardware details, etc.
 *
 * The touch system, by default, will also send virtual mouse events; this can
 * be useful for making a some desktop apps work on a phone without
 * significant changes. For apps that care about mouse and touch input
 * separately, they should ignore mouse events that have a `which` field of
 * SDL_TOUCH_MOUSEID.
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
  SDL_TouchDeviceType as TOUCH_DEVICE,
} from "../enums/SDL_touch.ts"

/**
 * Get a list of registered touch devices.
 *
 * On some platforms SDL first sees the touch device if it was actually used.
 * Therefore the returned list might be empty, although devices are available.
 * After using all devices at least once the number will be correct.
 *
 * @param count a pointer filled in with the number of devices returned, may
 *              be NULL.
 * @returns a 0 terminated array of touch device IDs or NULL on failure; call
 *          SDL_GetError() for more information. This should be freed with
 *          SDL_free() when it is no longer needed.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_touch.h:139 SDL_TouchID * SDL_GetTouchDevices(int *count);
 */
export function getTouchDevices(): { count: number; ret: Deno.PointerValue<"SDL_TouchID"> } {
  const ret = lib.symbols.SDL_GetTouchDevices(_p.i32.p0) as Deno.PointerValue<"SDL_TouchID">;
  if(!ret) throw new Error(`SDL_GetTouchDevices: ${_p.getCstr2(lib.symbols.SDL_GetError())}`);
  return { count: _p.i32.v0, ret };
}

/**
 * Get the touch device name as reported from the driver.
 *
 * @param touchID the touch device instance ID.
 * @returns touch device name, or NULL on failure; call SDL_GetError() for
 *          more information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_touch.h:150 const char * SDL_GetTouchDeviceName(SDL_TouchID touchID);
 */
export function getTouchDeviceName(touchID: bigint): string {
  return _p.getCstr2(lib.symbols.SDL_GetTouchDeviceName(touchID));
}

/**
 * Get the type of the given touch device.
 *
 * @param touchID the ID of a touch device.
 * @returns touch device type.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_touch.h:160 SDL_TouchDeviceType SDL_GetTouchDeviceType(SDL_TouchID touchID);
 */
export function getTouchDeviceType(touchID: bigint): number {
  return lib.symbols.SDL_GetTouchDeviceType(touchID);
}

/**
 * Get a list of active fingers for a given touch device.
 *
 * @param touchID the ID of a touch device.
 * @param count a pointer filled in with the number of fingers returned, can
 *              be NULL.
 * @returns a NULL terminated array of SDL_Finger pointers or NULL on failure;
 *          call SDL_GetError() for more information. This is a single
 *          allocation that should be freed with SDL_free() when it is no
 *          longer needed.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_touch.h:175 SDL_Finger ** SDL_GetTouchFingers(SDL_TouchID touchID, int *count);
 */
export function getTouchFingers(touchID: bigint): { count: number; ret: Deno.PointerValue } {
  const ret = lib.symbols.SDL_GetTouchFingers(touchID, _p.i32.p0) as Deno.PointerValue;
  if(!ret) throw new Error(`SDL_GetTouchFingers: ${_p.getCstr2(lib.symbols.SDL_GetError())}`);
  return { count: _p.i32.v0, ret };
}

