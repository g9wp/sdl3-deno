/**
 * # CategoryRect
 *
 * Some helper functions for managing rectangles and 2D points, in both
 * integer and floating point versions.
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
import * as _b from "../_structs/SDL_rect.ts";


/**
 * The structure that defines a point (using integers).
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @sa SDL_GetRectEnclosingPoints
 * @sa SDL_PointInRect
 *
 * @from SDL_rect.h:48
 */
export interface Point {
  x: number; /* int */
  y: number; /* int */
}

export function read_Point(dt: DataView): Point {
  const t = _b.SDL_Point.read(dt);
  return {
    x: t.x, /** int */
    y: t.y, /** int */
  };
}

export function write_Point(t: Point, dt: DataView) {
  _b.SDL_Point.write({
    x: t.x, /** int */
    y: t.y, /** int */
  }, dt);
}


/**
 * The structure that defines a point (using floating point values).
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @sa SDL_GetRectEnclosingPointsFloat
 * @sa SDL_PointInRectFloat
 *
 * @from SDL_rect.h:62
 */
export interface FPoint {
  x: number; /* float */
  y: number; /* float */
}

export function read_FPoint(dt: DataView): FPoint {
  const t = _b.SDL_FPoint.read(dt);
  return {
    x: t.x, /** float */
    y: t.y, /** float */
  };
}

export function write_FPoint(t: FPoint, dt: DataView) {
  _b.SDL_FPoint.write({
    x: t.x, /** float */
    y: t.y, /** float */
  }, dt);
}


/**
 * A rectangle, with the origin at the upper left (using integers).
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @sa SDL_RectEmpty
 * @sa SDL_RectsEqual
 * @sa SDL_HasRectIntersection
 * @sa SDL_GetRectIntersection
 * @sa SDL_GetRectAndLineIntersection
 * @sa SDL_GetRectUnion
 * @sa SDL_GetRectEnclosingPoints
 *
 * @from SDL_rect.h:82
 */
export interface Rect {
  x: number; /* int */
  y: number; /* int */
  w: number; /* int */
  h: number; /* int */
}

export function read_Rect(dt: DataView): Rect {
  const t = _b.SDL_Rect.read(dt);
  return {
    x: t.x, /** int */
    y: t.y, /** int */
    w: t.w, /** int */
    h: t.h, /** int */
  };
}

export function write_Rect(t: Rect, dt: DataView) {
  _b.SDL_Rect.write({
    x: t.x, /** int */
    y: t.y, /** int */
    w: t.w, /** int */
    h: t.h, /** int */
  }, dt);
}


/**
 * A rectangle stored using floating point values.
 *
 * The origin of the coordinate space is in the top-left, with increasing
 * values moving down and right. The properties `x` and `y` represent the
 * coordinates of the top-left corner of the rectangle.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @sa SDL_RectEmptyFloat
 * @sa SDL_RectsEqualFloat
 * @sa SDL_RectsEqualEpsilon
 * @sa SDL_HasRectIntersectionFloat
 * @sa SDL_GetRectIntersectionFloat
 * @sa SDL_GetRectAndLineIntersectionFloat
 * @sa SDL_GetRectUnionFloat
 * @sa SDL_GetRectEnclosingPointsFloat
 * @sa SDL_PointInRectFloat
 *
 * @from SDL_rect.h:108
 */
export interface FRect {
  x: number; /* float */
  y: number; /* float */
  w: number; /* float */
  h: number; /* float */
}

export function read_FRect(dt: DataView): FRect {
  const t = _b.SDL_FRect.read(dt);
  return {
    x: t.x, /** float */
    y: t.y, /** float */
    w: t.w, /** float */
    h: t.h, /** float */
  };
}

export function write_FRect(t: FRect, dt: DataView) {
  _b.SDL_FRect.write({
    x: t.x, /** float */
    y: t.y, /** float */
    w: t.w, /** float */
    h: t.h, /** float */
  }, dt);
}


