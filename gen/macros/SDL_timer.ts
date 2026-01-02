/**
 * # CategoryTimer
 *
 * SDL provides time management functionality. It is useful for dealing with
 * (usually) small durations of time.
 *
 * This is not to be confused with _calendar time_ management, which is
 * provided by [CategoryTime](CategoryTime).
 *
 * This category covers measuring time elapsed (SDL_GetTicks(),
 * SDL_GetPerformanceCounter()), putting a thread to sleep for a certain
 * amount of time (SDL_Delay(), SDL_DelayNS(), SDL_DelayPrecise()), and firing
 * a callback function after a certain amount of time has elapsed
 * (SDL_AddTimer(), etc).
 *
 * There are also useful macros to convert between time units, like
 * SDL_SECONDS_TO_NS() and such.
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

/**
 * Number of milliseconds in a second.
 *
 * This is always 1000.
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @from SDL_timer.h:61
 */
export const SDL_MS_PER_SECOND = 1000;

/**
 * Number of microseconds in a second.
 *
 * This is always 1000000.
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @from SDL_timer.h:70
 */
export const SDL_US_PER_SECOND = 1000000;

/**
 * Number of nanoseconds in a second.
 *
 * This is always 1000000000.
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @from SDL_timer.h:79
 */
export const SDL_NS_PER_SECOND = 1000000000;

/**
 * Number of nanoseconds in a millisecond.
 *
 * This is always 1000000.
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @from SDL_timer.h:88
 */
export const SDL_NS_PER_MS = 1000000;

/**
 * Number of nanoseconds in a microsecond.
 *
 * This is always 1000.
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @from SDL_timer.h:97
 */
export const SDL_NS_PER_US = 1000;

