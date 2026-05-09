/**
 * # CategoryTime
 *
 * SDL realtime clock and date/time routines.
 *
 * There are two data types that are used in this category: SDL_Time, which
 * represents the nanoseconds since a specific moment (an "epoch"), and
 * SDL_DateTime, which breaks time down into human-understandable components:
 * years, months, days, hours, etc.
 *
 * Much of the functionality is involved in converting those two types to
 * other useful forms.
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

import * as _ from "@denosaurs/byte-type";


/**
 * A structure holding a calendar date and time broken down into its
 * components.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @from SDL_time.h:53
 */
export const SDL_DateTime = new _.Struct({
  year: _.i32, /**< int : Year */
  month: _.i32, /**< int : Month [01-12] */
  day: _.i32, /**< int : Day of the month [01-31] */
  hour: _.i32, /**< int : Hour [0-23] */
  minute: _.i32, /**< int : Minute [0-59] */
  second: _.i32, /**< int : Seconds [0-60] */
  nanosecond: _.i32, /**< int : Nanoseconds [0-999999999] */
  day_of_week: _.i32, /**< int : Day of the week [0-6] (0 being Sunday) */
  utc_offset: _.i32, /**< int : Seconds east of UTC */
});



