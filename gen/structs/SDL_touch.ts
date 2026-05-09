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
  Copyright (C) 1997-2026 Sam Lantinga <slouken@libsdl.org>

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
import * as _b from "../_structs/SDL_touch.ts";


/**
 * Data about a single finger in a multitouch event.
 *
 * Each touch event is a collection of fingers that are simultaneously in
 * contact with the touch device (so a "touch" can be a "multitouch," in
 * reality), and this struct reports details of the specific fingers.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @sa SDL_GetTouchFingers
 *
 * @from SDL_touch.h:101
 */
export interface Finger {
  id: bigint; /**< SDL_FingerID : the finger ID */
  x: number; /**< float : the x-axis location of the touch event, normalized (0...1) */
  y: number; /**< float : the y-axis location of the touch event, normalized (0...1) */
  pressure: number; /**< float : the quantity of pressure applied, normalized (0...1) */
}

export function read_Finger(dt: DataView): Finger {
  const t = _b.SDL_Finger.read(dt);
  return {
    id: t.id, /** SDL_FingerID */
    x: t.x, /** float */
    y: t.y, /** float */
    pressure: t.pressure, /** float */
  };
}

export function write_Finger(t: Finger, dt: DataView) {
  _b.SDL_Finger.write({
    id: t.id, /** SDL_FingerID */
    x: t.x, /** float */
    y: t.y, /** float */
    pressure: t.pressure, /** float */
  }, dt);
}


