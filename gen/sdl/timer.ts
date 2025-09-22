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
 * a callback function after a certain amount of time has elasped
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

import { lib } from "./lib.ts";
import * as _p from "@g9wp/ptr";


/**
 * Get the number of milliseconds since SDL library initialization.
 *
 * @returns an unsigned 64-bit value representing the number of milliseconds
 *          since the SDL library initialized.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_timer.h:196 Uint64 SDL_GetTicks(void);
 */
export function getTicks(): bigint {
  return lib.symbols.SDL_GetTicks();
}

/**
 * Get the number of nanoseconds since SDL library initialization.
 *
 * @returns an unsigned 64-bit value representing the number of nanoseconds
 *          since the SDL library initialized.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_timer.h:208 Uint64 SDL_GetTicksNS(void);
 */
export function getTicksNs(): bigint {
  return lib.symbols.SDL_GetTicksNS();
}

/**
 * Get the current value of the high resolution counter.
 *
 * This function is typically used for profiling.
 *
 * The counter values are only meaningful relative to each other. Differences
 * between values can be converted to times by using
 * SDL_GetPerformanceFrequency().
 *
 * @returns the current counter value.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetPerformanceFrequency
 *
 * @from SDL_timer.h:227 Uint64 SDL_GetPerformanceCounter(void);
 */
export function getPerformanceCounter(): bigint {
  return lib.symbols.SDL_GetPerformanceCounter();
}

/**
 * Get the count per second of the high resolution counter.
 *
 * @returns a platform-specific count per second.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetPerformanceCounter
 *
 * @from SDL_timer.h:240 Uint64 SDL_GetPerformanceFrequency(void);
 */
export function getPerformanceFrequency(): bigint {
  return lib.symbols.SDL_GetPerformanceFrequency();
}

/**
 * Wait a specified number of milliseconds before returning.
 *
 * This function waits a specified number of milliseconds before returning. It
 * waits at least the specified time, but possibly longer due to OS
 * scheduling.
 *
 * @param ms the number of milliseconds to delay.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_DelayNS
 * @sa SDL_DelayPrecise
 *
 * @from SDL_timer.h:258 void SDL_Delay(Uint32 ms);
 */
export function delay(ms: number): void {
  return lib.symbols.SDL_Delay(ms);
}

/**
 * Wait a specified number of nanoseconds before returning.
 *
 * This function waits a specified number of nanoseconds before returning. It
 * waits at least the specified time, but possibly longer due to OS
 * scheduling.
 *
 * @param ns the number of nanoseconds to delay.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_Delay
 * @sa SDL_DelayPrecise
 *
 * @from SDL_timer.h:276 void SDL_DelayNS(Uint64 ns);
 */
export function delayNs(ns: bigint): void {
  return lib.symbols.SDL_DelayNS(ns);
}

/**
 * Wait a specified number of nanoseconds before returning.
 *
 * This function waits a specified number of nanoseconds before returning. It
 * will attempt to wait as close to the requested time as possible, busy
 * waiting if necessary, but could return later due to OS scheduling.
 *
 * @param ns the number of nanoseconds to delay.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_Delay
 * @sa SDL_DelayNS
 *
 * @from SDL_timer.h:294 void SDL_DelayPrecise(Uint64 ns);
 */
export function delayPrecise(ns: bigint): void {
  return lib.symbols.SDL_DelayPrecise(ns);
}

/**
 * Call a callback function at a future time.
 *
 * The callback function is passed the current timer interval and the user
 * supplied parameter from the SDL_AddTimer() call and should return the next
 * timer interval. If the value returned from the callback is 0, the timer is
 * canceled and will be removed.
 *
 * The callback is run on a separate thread, and for short timeouts can
 * potentially be called before this function returns.
 *
 * Timers take into account the amount of time it took to execute the
 * callback. For example, if the callback took 250 ms to execute and returned
 * 1000 (ms), the timer would only wait another 750 ms before its next
 * iteration.
 *
 * Timing may be inexact due to OS scheduling. Be sure to note the current
 * time with SDL_GetTicksNS() or SDL_GetPerformanceCounter() in case your
 * callback needs to adjust for variances.
 *
 * @param interval the timer delay, in milliseconds, passed to `callback`.
 * @param callback the SDL_TimerCallback function to call when the specified
 *                 `interval` elapses.
 * @param userdata a pointer that is passed to `callback`.
 * @returns a timer ID or 0 on failure; call SDL_GetError() for more
 *          information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_AddTimerNS
 * @sa SDL_RemoveTimer
 *
 * @from SDL_timer.h:363 SDL_TimerID SDL_AddTimer(Uint32 interval, SDL_TimerCallback callback, void *userdata);
 */
export function addTimer(interval: number, callback: Deno.PointerValue, userdata: Deno.PointerValue): number {
  return lib.symbols.SDL_AddTimer(interval, callback, userdata);
}

/**
 * Call a callback function at a future time.
 *
 * The callback function is passed the current timer interval and the user
 * supplied parameter from the SDL_AddTimerNS() call and should return the
 * next timer interval. If the value returned from the callback is 0, the
 * timer is canceled and will be removed.
 *
 * The callback is run on a separate thread, and for short timeouts can
 * potentially be called before this function returns.
 *
 * Timers take into account the amount of time it took to execute the
 * callback. For example, if the callback took 250 ns to execute and returned
 * 1000 (ns), the timer would only wait another 750 ns before its next
 * iteration.
 *
 * Timing may be inexact due to OS scheduling. Be sure to note the current
 * time with SDL_GetTicksNS() or SDL_GetPerformanceCounter() in case your
 * callback needs to adjust for variances.
 *
 * @param interval the timer delay, in nanoseconds, passed to `callback`.
 * @param callback the SDL_TimerCallback function to call when the specified
 *                 `interval` elapses.
 * @param userdata a pointer that is passed to `callback`.
 * @returns a timer ID or 0 on failure; call SDL_GetError() for more
 *          information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_AddTimer
 * @sa SDL_RemoveTimer
 *
 * @from SDL_timer.h:425 SDL_TimerID SDL_AddTimerNS(Uint64 interval, SDL_NSTimerCallback callback, void *userdata);
 */
export function addTimerNs(interval: bigint, callback: Deno.PointerValue, userdata: Deno.PointerValue): number {
  return lib.symbols.SDL_AddTimerNS(interval, callback, userdata);
}

/**
 * Remove a timer created with SDL_AddTimer().
 *
 * @param id the ID of the timer to remove.
 * @returns true on success or false on failure; call SDL_GetError() for more
 *          information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_AddTimer
 *
 * @from SDL_timer.h:440 bool SDL_RemoveTimer(SDL_TimerID id);
 */
export function removeTimer(id: number): boolean {
  return lib.symbols.SDL_RemoveTimer(id);
}

