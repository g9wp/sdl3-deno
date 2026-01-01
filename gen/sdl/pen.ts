/**
 * # CategoryPen
 *
 * SDL pen event handling.
 *
 * SDL provides an API for pressure-sensitive pen (stylus and/or eraser)
 * handling, e.g., for input and drawing tablets or suitably equipped mobile /
 * tablet devices.
 *
 * To get started with pens, simply handle pen events:
 *
 * - SDL_EVENT_PEN_PROXIMITY_IN, SDL_EVENT_PEN_PROXIMITY_OUT
 *   (SDL_PenProximityEvent)
 * - SDL_EVENT_PEN_DOWN, SDL_EVENT_PEN_UP (SDL_PenTouchEvent)
 * - SDL_EVENT_PEN_MOTION (SDL_PenMotionEvent)
 * - SDL_EVENT_PEN_BUTTON_DOWN, SDL_EVENT_PEN_BUTTON_UP (SDL_PenButtonEvent)
 * - SDL_EVENT_PEN_AXIS (SDL_PenAxisEvent)
 *
 * Pens may provide more than simple touch input; they might have other axes,
 * such as pressure, tilt, rotation, etc.
 *
 * When a pen starts providing input, SDL will assign it a unique SDL_PenID,
 * which will remain for the life of the process, as long as the pen stays
 * connected. A pen leaving proximity (being taken far enough away from the
 * digitizer tablet that it no longer reponds) and then coming back should
 * fire proximity events, but the SDL_PenID should remain consistent.
 * Unplugging the digitizer and reconnecting may cause future input to have a
 * new SDL_PenID, as SDL may not know that this is the same hardware.
 *
 * Please note that various platforms vary wildly in how (and how well) they
 * support pen input. If your pen supports some piece of functionality but SDL
 * doesn't seem to, it might actually be the operating system's fault. For
 * example, some platforms can manage multiple devices at the same time, but
 * others will make any connected pens look like a single logical device, much
 * how all USB mice connected to a computer will move the same system cursor.
 * cursor. Other platforms might not support pen buttons, or the distance
 * axis, etc. Very few platforms can even report _what_ functionality the pen
 * supports in the first place, so best practices is to either build UI to let
 * the user configure their pens, or be prepared to handle new functionality
 * for a pen the first time an event is reported.
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
  PEN_INPUT as PEN_INPUT,
  SDL_PenAxis as PEN_AXIS,
  SDL_PenDeviceType as PEN_DEVICE_TYPE,
} from "../enums/SDL_pen.ts"

/**
 * Get the device type of the given pen.
 *
 * Many platforms do not supply this information, so an app must always be
 * prepared to get an SDL_PEN_DEVICE_TYPE_UNKNOWN result.
 *
 * @param instance_id the pen instance ID.
 * @returns the device type of the given pen, or SDL_PEN_DEVICE_TYPE_INVALID
 *          on failure; call SDL_GetError() for more information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.4.0.
 *
 * @from SDL_pen.h:188 SDL_PenDeviceType SDL_GetPenDeviceType(SDL_PenID instance_id);
 */
export function getPenDeviceType(instance_id: number): number {
  return lib.symbols.SDL_GetPenDeviceType(instance_id);
}

