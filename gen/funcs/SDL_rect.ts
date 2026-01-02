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


export const symbols = {

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
SDL_HasRectIntersection: {
      parameters: ["pointer", "pointer"],
      result: "bool"
    },


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
SDL_GetRectIntersection: {
      parameters: ["pointer", "pointer", "pointer"],
      result: "bool"
    },


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
SDL_GetRectUnion: {
      parameters: ["pointer", "pointer", "pointer"],
      result: "bool"
    },


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
SDL_GetRectEnclosingPoints: {
      parameters: ["pointer", "i32", "pointer", "pointer"],
      result: "bool"
    },


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
SDL_GetRectAndLineIntersection: {
      parameters: ["pointer", "pointer", "pointer", "pointer", "pointer"],
      result: "bool"
    },


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
SDL_HasRectIntersectionFloat: {
      parameters: ["pointer", "pointer"],
      result: "bool"
    },


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
SDL_GetRectIntersectionFloat: {
      parameters: ["pointer", "pointer", "pointer"],
      result: "bool"
    },


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
SDL_GetRectUnionFloat: {
      parameters: ["pointer", "pointer", "pointer"],
      result: "bool"
    },


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
SDL_GetRectEnclosingPointsFloat: {
      parameters: ["pointer", "i32", "pointer", "pointer"],
      result: "bool"
    },


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
SDL_GetRectAndLineIntersectionFloat: {
      parameters: ["pointer", "pointer", "pointer", "pointer", "pointer"],
      result: "bool"
    },

} as const satisfies Deno.ForeignLibraryInterface;
