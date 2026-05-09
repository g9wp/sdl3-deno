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

/**
 * The preferred date format of the current system locale.
 *
 * @since This enum is available since SDL 3.2.0.
 *
 * @sa SDL_GetDateTimeLocalePreferences
 *
 * @from SDL_time.h:73 SDL_DATE_FORMAT_
 */
export enum SDL_DateFormat {
  YYYYMMDD = 0, /**< Year/Month/Day */
  DDMMYYYY = 1, /**< Day/Month/Year */
  MMDDYYYY = 2  , /**< Month/Day/Year */
}



/**
 * The preferred time format of the current system locale.
 *
 * @since This enum is available since SDL 3.2.0.
 *
 * @sa SDL_GetDateTimeLocalePreferences
 *
 * @from SDL_time.h:87 SDL_TIME_FORMAT_
 */
export enum SDL_TimeFormat {
  _24HR = 0, /**< 24 hour time */
  _12HR = 1  , /**< 12 hour time */
}



