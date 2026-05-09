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


export const symbols = {

/**
 * Gets the current preferred date and time format for the system locale.
 *
 * This might be a "slow" call that has to query the operating system. It's
 * best to ask for this once and save the results. However, the preferred
 * formats can change, usually because the user has changed a system
 * preference outside of your program.
 *
 * @param dateFormat a pointer to the SDL_DateFormat to hold the returned date
 *                   format, may be NULL.
 * @param timeFormat a pointer to the SDL_TimeFormat to hold the returned time
 *                   format, may be NULL.
 * @returns true on success or false on failure; call SDL_GetError() for more
 *          information.
 *
 * @threadsafety This function is not thread safe.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_time.h:112 bool SDL_GetDateTimeLocalePreferences(SDL_DateFormat *dateFormat, SDL_TimeFormat *timeFormat);
 */
SDL_GetDateTimeLocalePreferences: {
      parameters: ["pointer", "pointer"],
      result: "bool"
    },


/**
 * Gets the current value of the system realtime clock in nanoseconds since
 * Jan 1, 1970 in Universal Coordinated Time (UTC).
 *
 * @param ticks the SDL_Time to hold the returned tick count.
 * @returns true on success or false on failure; call SDL_GetError() for more
 *          information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_time.h:126 bool SDL_GetCurrentTime(SDL_Time *ticks);
 */
SDL_GetCurrentTime: {
      parameters: ["pointer"],
      result: "bool"
    },


/**
 * Converts an SDL_Time in nanoseconds since the epoch to a calendar time in
 * the SDL_DateTime format.
 *
 * @param ticks the SDL_Time to be converted.
 * @param dt the resulting SDL_DateTime.
 * @param localTime the resulting SDL_DateTime will be expressed in local time
 *                  if true, otherwise it will be in Universal Coordinated
 *                  Time (UTC).
 * @returns true on success or false on failure; call SDL_GetError() for more
 *          information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_time.h:144 bool SDL_TimeToDateTime(SDL_Time ticks, SDL_DateTime *dt, bool localTime);
 */
SDL_TimeToDateTime: {
      parameters: ["i64", "pointer", "bool"],
      result: "bool"
    },


/**
 * Converts a calendar time to an SDL_Time in nanoseconds since the epoch.
 *
 * This function ignores the day_of_week member of the SDL_DateTime struct, so
 * it may remain unset.
 *
 * @param dt the source SDL_DateTime.
 * @param ticks the resulting SDL_Time.
 * @returns true on success or false on failure; call SDL_GetError() for more
 *          information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_time.h:161 bool SDL_DateTimeToTime(const SDL_DateTime *dt, SDL_Time *ticks);
 */
SDL_DateTimeToTime: {
      parameters: ["pointer", "pointer"],
      result: "bool"
    },


/**
 * Converts an SDL time into a Windows FILETIME (100-nanosecond intervals
 * since January 1, 1601).
 *
 * This function fills in the two 32-bit values of the FILETIME structure.
 *
 * @param ticks the time to convert.
 * @param dwLowDateTime a pointer filled in with the low portion of the
 *                      Windows FILETIME value.
 * @param dwHighDateTime a pointer filled in with the high portion of the
 *                       Windows FILETIME value.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_time.h:179 void SDL_TimeToWindows(SDL_Time ticks, Uint32 *dwLowDateTime, Uint32 *dwHighDateTime);
 */
SDL_TimeToWindows: {
      parameters: ["i64", "pointer", "pointer"],
      result: "void"
    },


/**
 * Converts a Windows FILETIME (100-nanosecond intervals since January 1,
 * 1601) to an SDL time.
 *
 * This function takes the two 32-bit values of the FILETIME structure as
 * parameters.
 *
 * @param dwLowDateTime the low portion of the Windows FILETIME value.
 * @param dwHighDateTime the high portion of the Windows FILETIME value.
 * @returns the converted SDL time.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_time.h:196 SDL_Time SDL_TimeFromWindows(Uint32 dwLowDateTime, Uint32 dwHighDateTime);
 */
SDL_TimeFromWindows: {
      parameters: ["u32", "u32"],
      result: "i64"
    },


/**
 * Get the number of days in a month for a given year.
 *
 * @param year the year.
 * @param month the month [1-12].
 * @returns the number of days in the requested month or -1 on failure; call
 *          SDL_GetError() for more information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_time.h:210 int SDL_GetDaysInMonth(int year, int month);
 */
SDL_GetDaysInMonth: {
      parameters: ["i32", "i32"],
      result: "i32"
    },


/**
 * Get the day of year for a calendar date.
 *
 * @param year the year component of the date.
 * @param month the month component of the date.
 * @param day the day component of the date.
 * @returns the day of year [0-365] if the date is valid or -1 on failure;
 *          call SDL_GetError() for more information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_time.h:225 int SDL_GetDayOfYear(int year, int month, int day);
 */
SDL_GetDayOfYear: {
      parameters: ["i32", "i32", "i32"],
      result: "i32"
    },


/**
 * Get the day of week for a calendar date.
 *
 * @param year the year component of the date.
 * @param month the month component of the date.
 * @param day the day component of the date.
 * @returns a value between 0 and 6 (0 being Sunday) if the date is valid or
 *          -1 on failure; call SDL_GetError() for more information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_time.h:240 int SDL_GetDayOfWeek(int year, int month, int day);
 */
SDL_GetDayOfWeek: {
      parameters: ["i32", "i32", "i32"],
      result: "i32"
    },

} as const satisfies Deno.ForeignLibraryInterface;
