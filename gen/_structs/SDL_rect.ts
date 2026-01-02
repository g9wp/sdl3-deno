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

import * as _ from "@denosaurs/byte-type";


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
export const SDL_Point = new _.Struct({
  x: _.i32, /* int */
  y: _.i32, /* int */
});



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
export const SDL_FPoint = new _.Struct({
  x: _.f32, /* float */
  y: _.f32, /* float */
});



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
export const SDL_Rect = new _.Struct({
  x: _.i32, /* int */
  y: _.i32, /* int */
  w: _.i32, /* int */
  h: _.i32, /* int */
});



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
export const SDL_FRect = new _.Struct({
  x: _.f32, /* float */
  y: _.f32, /* float */
  w: _.f32, /* float */
  h: _.f32, /* float */
});



