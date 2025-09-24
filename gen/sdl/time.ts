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
  SDL_DateFormat as DATE_FORMAT,
  SDL_TimeFormat as TIME_FORMAT,
} from "../enums/SDL_time.ts"

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
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_time.h:110 bool SDL_GetDateTimeLocalePreferences(SDL_DateFormat *dateFormat, SDL_TimeFormat *timeFormat);
 */
export function getDateTimeLocalePreferences(): { dateFormat: number; timeFormat: number } {
  if(!lib.symbols.SDL_GetDateTimeLocalePreferences(_p.u32.p0, _p.u32.p1))
    throw new Error(`SDL_GetDateTimeLocalePreferences: ${_p.getCstr2(lib.symbols.SDL_GetError())}`);
  return { dateFormat: _p.u32.v0, timeFormat: _p.u32.v1 };
}

/**
 * Gets the current value of the system realtime clock in nanoseconds since
 * Jan 1, 1970 in Universal Coordinated Time (UTC).
 *
 * @param ticks the SDL_Time to hold the returned tick count.
 * @returns true on success or false on failure; call SDL_GetError() for more
 *          information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_time.h:122 bool SDL_GetCurrentTime(SDL_Time *ticks);
 */
export function getCurrentTime(): bigint {
  if(!lib.symbols.SDL_GetCurrentTime(_p.i64.p0))
    throw new Error(`SDL_GetCurrentTime: ${_p.getCstr2(lib.symbols.SDL_GetError())}`);
  return _p.i64.v0;
}

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
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_time.h:138 bool SDL_TimeToDateTime(SDL_Time ticks, SDL_DateTime *dt, bool localTime);
 */
export function timeToDateTime(ticks: bigint, dt: Deno.PointerValue<"SDL_DateTime">, localTime: boolean): boolean {
  return lib.symbols.SDL_TimeToDateTime(ticks, dt, localTime);
}

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
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_time.h:153 bool SDL_DateTimeToTime(const SDL_DateTime *dt, SDL_Time *ticks);
 */
export function dateTimeToTime(dt: Deno.PointerValue<"SDL_DateTime">): bigint {
  if(!lib.symbols.SDL_DateTimeToTime(dt, _p.i64.p0))
    throw new Error(`SDL_DateTimeToTime: ${_p.getCstr2(lib.symbols.SDL_GetError())}`);
  return _p.i64.v0;
}

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
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_time.h:169 void SDL_TimeToWindows(SDL_Time ticks, Uint32 *dwLowDateTime, Uint32 *dwHighDateTime);
 */
export function timeToWindows(ticks: bigint): { dwLowDateTime: number; dwHighDateTime: number } {
  lib.symbols.SDL_TimeToWindows(ticks, _p.u32.p0, _p.u32.p1);
  return {dwLowDateTime: _p.u32.v0, dwHighDateTime: _p.u32.v1};
}

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
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_time.h:184 SDL_Time SDL_TimeFromWindows(Uint32 dwLowDateTime, Uint32 dwHighDateTime);
 */
export function timeFromWindows(dwLowDateTime: number, dwHighDateTime: number): bigint {
  return lib.symbols.SDL_TimeFromWindows(dwLowDateTime, dwHighDateTime);
}

/**
 * Get the number of days in a month for a given year.
 *
 * @param year the year.
 * @param month the month [1-12].
 * @returns the number of days in the requested month or -1 on failure; call
 *          SDL_GetError() for more information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_time.h:196 int SDL_GetDaysInMonth(int year, int month);
 */
export function getDaysInMonth(year: number, month: number): number {
  return lib.symbols.SDL_GetDaysInMonth(year, month);
}

/**
 * Get the day of year for a calendar date.
 *
 * @param year the year component of the date.
 * @param month the month component of the date.
 * @param day the day component of the date.
 * @returns the day of year [0-365] if the date is valid or -1 on failure;
 *          call SDL_GetError() for more information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_time.h:209 int SDL_GetDayOfYear(int year, int month, int day);
 */
export function getDayOfYear(year: number, month: number, day: number): number {
  return lib.symbols.SDL_GetDayOfYear(year, month, day);
}

/**
 * Get the day of week for a calendar date.
 *
 * @param year the year component of the date.
 * @param month the month component of the date.
 * @param day the day component of the date.
 * @returns a value between 0 and 6 (0 being Sunday) if the date is valid or
 *          -1 on failure; call SDL_GetError() for more information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_time.h:222 int SDL_GetDayOfWeek(int year, int month, int day);
 */
export function getDayOfWeek(year: number, month: number, day: number): number {
  return lib.symbols.SDL_GetDayOfWeek(year, month, day);
}

