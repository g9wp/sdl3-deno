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

import { lib } from "./lib.ts";
import * as _p from "@g9wp/ptr";


/**
 * Determine whether two rectangles intersect.
 *
 * If either pointer is NULL the function will return false.
 *
 * @param A an SDL_Rect structure representing the first rectangle.
 * @param B an SDL_Rect structure representing the second rectangle.
 * @returns true if there is an intersection, false otherwise.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetRectIntersection
 *
 * @from SDL_rect.h:226 bool SDL_HasRectIntersection(const SDL_Rect *A, const SDL_Rect *B);
 */
export function hasRectIntersection(A: { x: number; y: number; w: number; h: number; } | null, B: { x: number; y: number; w: number; h: number; } | null): boolean {
  if (A) _p.i32.arr.set([A.x, A.y, A.w, A.h], 0);
  if (B) _p.i32.arr.set([B.x, B.y, B.w, B.h], 4);
  return lib.symbols.SDL_HasRectIntersection(A ? _p.i32.p0 : null, B ? _p.i32.p4 : null);
}

/**
 * Calculate the intersection of two rectangles.
 *
 * If `result` is NULL then this function will return false.
 *
 * @param A an SDL_Rect structure representing the first rectangle.
 * @param B an SDL_Rect structure representing the second rectangle.
 * @param result an SDL_Rect structure filled in with the intersection of
 *               rectangles `A` and `B`.
 * @returns true if there is an intersection, false otherwise.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_HasRectIntersection
 *
 * @from SDL_rect.h:243 bool SDL_GetRectIntersection(const SDL_Rect *A, const SDL_Rect *B, SDL_Rect *result);
 */
export function getRectIntersection(A: { x: number; y: number; w: number; h: number; } | null, B: { x: number; y: number; w: number; h: number; } | null): { x: number; y: number; w: number; h: number; } | null {
  if (A) _p.i32.arr.set([A.x, A.y, A.w, A.h], 0);
  if (B) _p.i32.arr.set([B.x, B.y, B.w, B.h], 4);
  if(!lib.symbols.SDL_GetRectIntersection(A ? _p.i32.p0 : null, B ? _p.i32.p4 : null, _p.i32.p(8)))
    throw new Error(`SDL_GetRectIntersection: ${_p.getCstr2(lib.symbols.SDL_GetError())}`);
  return { x: _p.i32.v(8), y: _p.i32.v(9), w: _p.i32.v(10), h: _p.i32.v(11), };
}

/**
 * Calculate the union of two rectangles.
 *
 * @param A an SDL_Rect structure representing the first rectangle.
 * @param B an SDL_Rect structure representing the second rectangle.
 * @param result an SDL_Rect structure filled in with the union of rectangles
 *               `A` and `B`.
 * @returns true on success or false on failure; call SDL_GetError() for more
 *          information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_rect.h:257 bool SDL_GetRectUnion(const SDL_Rect *A, const SDL_Rect *B, SDL_Rect *result);
 */
export function getRectUnion(A: { x: number; y: number; w: number; h: number; } | null, B: { x: number; y: number; w: number; h: number; } | null): { x: number; y: number; w: number; h: number; } | null {
  if (A) _p.i32.arr.set([A.x, A.y, A.w, A.h], 0);
  if (B) _p.i32.arr.set([B.x, B.y, B.w, B.h], 4);
  if(!lib.symbols.SDL_GetRectUnion(A ? _p.i32.p0 : null, B ? _p.i32.p4 : null, _p.i32.p(8)))
    throw new Error(`SDL_GetRectUnion: ${_p.getCstr2(lib.symbols.SDL_GetError())}`);
  return { x: _p.i32.v(8), y: _p.i32.v(9), w: _p.i32.v(10), h: _p.i32.v(11), };
}

/**
 * Calculate a minimal rectangle enclosing a set of points.
 *
 * If `clip` is not NULL then only points inside of the clipping rectangle are
 * considered.
 *
 * @param points an array of SDL_Point structures representing points to be
 *               enclosed.
 * @param count the number of structures in the `points` array.
 * @param clip an SDL_Rect used for clipping or NULL to enclose all points.
 * @param result an SDL_Rect structure filled in with the minimal enclosing
 *               rectangle.
 * @returns true if any points were enclosed or false if all the points were
 *          outside of the clipping rectangle.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_rect.h:276 bool SDL_GetRectEnclosingPoints(const SDL_Point *points, int count, const SDL_Rect *clip, SDL_Rect *result);
 */
export function getRectEnclosingPoints(points: { x: number; y: number; } | null, count: number, clip: { x: number; y: number; w: number; h: number; } | null): { x: number; y: number; w: number; h: number; } | null {
  if (points) _p.i32.arr.set([points.x, points.y], 0);
  if (clip) _p.i32.arr.set([clip.x, clip.y, clip.w, clip.h], 2);
  if(!lib.symbols.SDL_GetRectEnclosingPoints(points ? _p.i32.p0 : null, count, clip ? _p.i32.p2 : null, _p.i32.p6))
    throw new Error(`SDL_GetRectEnclosingPoints: ${_p.getCstr2(lib.symbols.SDL_GetError())}`);
  return { x: _p.i32.v6, y: _p.i32.v7, w: _p.i32.v(8), h: _p.i32.v(9), };
}

/**
 * Calculate the intersection of a rectangle and line segment.
 *
 * This function is used to clip a line segment to a rectangle. A line segment
 * contained entirely within the rectangle or that does not intersect will
 * remain unchanged. A line segment that crosses the rectangle at either or
 * both ends will be clipped to the boundary of the rectangle and the new
 * coordinates saved in `X1`, `Y1`, `X2`, and/or `Y2` as necessary.
 *
 * @param rect an SDL_Rect structure representing the rectangle to intersect.
 * @param X1 a pointer to the starting X-coordinate of the line.
 * @param Y1 a pointer to the starting Y-coordinate of the line.
 * @param X2 a pointer to the ending X-coordinate of the line.
 * @param Y2 a pointer to the ending Y-coordinate of the line.
 * @returns true if there is an intersection, false otherwise.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_rect.h:296 bool SDL_GetRectAndLineIntersection(const SDL_Rect *rect, int *X1, int *Y1, int *X2, int *Y2);
 */
export function getRectAndLineIntersection(
    rect: { x: number; y: number; w: number; h: number; } | null,
    X1: number,
    Y1: number,
    X2: number,
    Y2: number,
): { X1: number; Y1: number; X2: number; Y2: number } {
  if (rect) _p.i32.arr.set([rect.x, rect.y, rect.w, rect.h], 0);
  _p.i32.arr[4] = X1;
  _p.i32.arr[5] = Y1;
  _p.i32.arr[6] = X2;
  _p.i32.arr[7] = Y2;
  if(!lib.symbols.SDL_GetRectAndLineIntersection(rect ? _p.i32.p0 : null, _p.i32.p4, _p.i32.p5, _p.i32.p6, _p.i32.p7))
    throw new Error(`SDL_GetRectAndLineIntersection: ${_p.getCstr2(lib.symbols.SDL_GetError())}`);
  return { X1: _p.i32.v4, Y1: _p.i32.v5, X2: _p.i32.v6, Y2: _p.i32.v7 };
}

/**
 * Determine whether two rectangles intersect with float precision.
 *
 * If either pointer is NULL the function will return false.
 *
 * @param A an SDL_FRect structure representing the first rectangle.
 * @param B an SDL_FRect structure representing the second rectangle.
 * @returns true if there is an intersection, false otherwise.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetRectIntersection
 *
 * @from SDL_rect.h:429 bool SDL_HasRectIntersectionFloat(const SDL_FRect *A, const SDL_FRect *B);
 */
export function hasRectIntersectionFloat(A: { x: number; y: number; w: number; h: number; } | null, B: { x: number; y: number; w: number; h: number; } | null): boolean {
  if (A) _p.f32.arr.set([A.x, A.y, A.w, A.h], 0);
  if (B) _p.f32.arr.set([B.x, B.y, B.w, B.h], 4);
  return lib.symbols.SDL_HasRectIntersectionFloat(A ? _p.f32.p0 : null, B ? _p.f32.p4 : null);
}

/**
 * Calculate the intersection of two rectangles with float precision.
 *
 * If `result` is NULL then this function will return false.
 *
 * @param A an SDL_FRect structure representing the first rectangle.
 * @param B an SDL_FRect structure representing the second rectangle.
 * @param result an SDL_FRect structure filled in with the intersection of
 *               rectangles `A` and `B`.
 * @returns true if there is an intersection, false otherwise.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_HasRectIntersectionFloat
 *
 * @from SDL_rect.h:446 bool SDL_GetRectIntersectionFloat(const SDL_FRect *A, const SDL_FRect *B, SDL_FRect *result);
 */
export function getRectIntersectionFloat(A: { x: number; y: number; w: number; h: number; } | null, B: { x: number; y: number; w: number; h: number; } | null): { x: number; y: number; w: number; h: number; } | null {
  if (A) _p.f32.arr.set([A.x, A.y, A.w, A.h], 0);
  if (B) _p.f32.arr.set([B.x, B.y, B.w, B.h], 4);
  if(!lib.symbols.SDL_GetRectIntersectionFloat(A ? _p.f32.p0 : null, B ? _p.f32.p4 : null, _p.f32.p(8)))
    throw new Error(`SDL_GetRectIntersectionFloat: ${_p.getCstr2(lib.symbols.SDL_GetError())}`);
  return { x: _p.f32.v(8), y: _p.f32.v(9), w: _p.f32.v(10), h: _p.f32.v(11), };
}

/**
 * Calculate the union of two rectangles with float precision.
 *
 * @param A an SDL_FRect structure representing the first rectangle.
 * @param B an SDL_FRect structure representing the second rectangle.
 * @param result an SDL_FRect structure filled in with the union of rectangles
 *               `A` and `B`.
 * @returns true on success or false on failure; call SDL_GetError() for more
 *          information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_rect.h:460 bool SDL_GetRectUnionFloat(const SDL_FRect *A, const SDL_FRect *B, SDL_FRect *result);
 */
export function getRectUnionFloat(A: { x: number; y: number; w: number; h: number; } | null, B: { x: number; y: number; w: number; h: number; } | null): { x: number; y: number; w: number; h: number; } | null {
  if (A) _p.f32.arr.set([A.x, A.y, A.w, A.h], 0);
  if (B) _p.f32.arr.set([B.x, B.y, B.w, B.h], 4);
  if(!lib.symbols.SDL_GetRectUnionFloat(A ? _p.f32.p0 : null, B ? _p.f32.p4 : null, _p.f32.p(8)))
    throw new Error(`SDL_GetRectUnionFloat: ${_p.getCstr2(lib.symbols.SDL_GetError())}`);
  return { x: _p.f32.v(8), y: _p.f32.v(9), w: _p.f32.v(10), h: _p.f32.v(11), };
}

/**
 * Calculate a minimal rectangle enclosing a set of points with float
 * precision.
 *
 * If `clip` is not NULL then only points inside of the clipping rectangle are
 * considered.
 *
 * @param points an array of SDL_FPoint structures representing points to be
 *               enclosed.
 * @param count the number of structures in the `points` array.
 * @param clip an SDL_FRect used for clipping or NULL to enclose all points.
 * @param result an SDL_FRect structure filled in with the minimal enclosing
 *               rectangle.
 * @returns true if any points were enclosed or false if all the points were
 *          outside of the clipping rectangle.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_rect.h:480 bool SDL_GetRectEnclosingPointsFloat(const SDL_FPoint *points, int count, const SDL_FRect *clip, SDL_FRect *result);
 */
export function getRectEnclosingPointsFloat(points: { x: number; y: number; } | null, count: number, clip: { x: number; y: number; w: number; h: number; } | null): { x: number; y: number; w: number; h: number; } | null {
  if (points) _p.f32.arr.set([points.x, points.y], 0);
  if (clip) _p.f32.arr.set([clip.x, clip.y, clip.w, clip.h], 2);
  if(!lib.symbols.SDL_GetRectEnclosingPointsFloat(points ? _p.f32.p0 : null, count, clip ? _p.f32.p2 : null, _p.f32.p6))
    throw new Error(`SDL_GetRectEnclosingPointsFloat: ${_p.getCstr2(lib.symbols.SDL_GetError())}`);
  return { x: _p.f32.v6, y: _p.f32.v7, w: _p.f32.v(8), h: _p.f32.v(9), };
}

/**
 * Calculate the intersection of a rectangle and line segment with float
 * precision.
 *
 * This function is used to clip a line segment to a rectangle. A line segment
 * contained entirely within the rectangle or that does not intersect will
 * remain unchanged. A line segment that crosses the rectangle at either or
 * both ends will be clipped to the boundary of the rectangle and the new
 * coordinates saved in `X1`, `Y1`, `X2`, and/or `Y2` as necessary.
 *
 * @param rect an SDL_FRect structure representing the rectangle to intersect.
 * @param X1 a pointer to the starting X-coordinate of the line.
 * @param Y1 a pointer to the starting Y-coordinate of the line.
 * @param X2 a pointer to the ending X-coordinate of the line.
 * @param Y2 a pointer to the ending Y-coordinate of the line.
 * @returns true if there is an intersection, false otherwise.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_rect.h:501 bool SDL_GetRectAndLineIntersectionFloat(const SDL_FRect *rect, float *X1, float *Y1, float *X2, float *Y2);
 */
export function getRectAndLineIntersectionFloat(
    rect: { x: number; y: number; w: number; h: number; } | null,
    X1: number,
    Y1: number,
    X2: number,
    Y2: number,
): { X1: number; Y1: number; X2: number; Y2: number } {
  if (rect) _p.f32.arr.set([rect.x, rect.y, rect.w, rect.h], 0);
  _p.f32.arr[4] = X1;
  _p.f32.arr[5] = Y1;
  _p.f32.arr[6] = X2;
  _p.f32.arr[7] = Y2;
  if(!lib.symbols.SDL_GetRectAndLineIntersectionFloat(rect ? _p.f32.p0 : null, _p.f32.p4, _p.f32.p5, _p.f32.p6, _p.f32.p7))
    throw new Error(`SDL_GetRectAndLineIntersectionFloat: ${_p.getCstr2(lib.symbols.SDL_GetError())}`);
  return { X1: _p.f32.v4, Y1: _p.f32.v5, X2: _p.f32.v6, Y2: _p.f32.v7 };
}

