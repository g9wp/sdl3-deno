/**
 * # CategoryVersion
 *
 * Functionality to query the current SDL version, both as headers the app was
 * compiled against, and a library the app is linked to.
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
 * The current major version of SDL headers.
 *
 * If this were SDL version 3.2.1, this value would be 3.
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @from SDL_version.h:46
 */
export const SDL_MAJOR_VERSION = 3;

/**
 * The current minor version of the SDL headers.
 *
 * If this were SDL version 3.2.1, this value would be 2.
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @from SDL_version.h:55
 */
export const SDL_MINOR_VERSION = 4;

/**
 * The current micro (or patchlevel) version of the SDL headers.
 *
 * If this were SDL version 3.2.1, this value would be 1.
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @from SDL_version.h:64
 */
export const SDL_MICRO_VERSION = 0;

