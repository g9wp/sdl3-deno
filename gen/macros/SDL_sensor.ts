/**
 * # CategorySensor
 *
 * SDL sensor management.
 *
 * These APIs grant access to gyros and accelerometers on various platforms.
 *
 * In order to use these functions, SDL_Init() must have been called with the
 * SDL_INIT_SENSOR flag. This causes SDL to scan the system for sensors, and
 * load appropriate drivers.
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
 * A constant to represent standard gravity for accelerometer sensors.
 *
 * The accelerometer returns the current acceleration in SI meters per second
 * squared. This measurement includes the force of gravity, so a device at
 * rest will have an value of SDL_STANDARD_GRAVITY away from the center of the
 * earth, which is a positive Y value.
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @from SDL_sensor.h:75
 */
export const SDL_STANDARD_GRAVITY = 9.80665;

