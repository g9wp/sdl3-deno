/**
 * # CategoryGUID
 *
 * A GUID is a 128-bit value that represents something that is uniquely
 * identifiable by this value: "globally unique."
 *
 * SDL provides functions to convert a GUID to/from a string.
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
 * Get an ASCII string representation for a given SDL_GUID.
 *
 * @param guid the SDL_GUID you wish to convert to string.
 * @param pszGUID buffer in which to write the ASCII string.
 * @param cbGUID the size of pszGUID, should be at least 33 bytes.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_StringToGUID
 *
 * @from SDL_guid.h:79 void SDL_GUIDToString(SDL_GUID guid, char *pszGUID, int cbGUID);
 */
export function guidToString(guid: Uint8Array<ArrayBuffer>, cbGUID: number): string {
  lib.symbols.SDL_GUIDToString(guid, _p.cstr.p0, cbGUID);
  return _p.cstr.v0;
}

/**
 * Convert a GUID string into a SDL_GUID structure.
 *
 * Performs no error checking. If this function is given a string containing
 * an invalid GUID, the function will silently succeed, but the GUID generated
 * will not be useful.
 *
 * @param pchGUID string containing an ASCII representation of a GUID.
 * @returns a SDL_GUID structure.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GUIDToString
 *
 * @from SDL_guid.h:97 SDL_GUID SDL_StringToGUID(const char *pchGUID);
 */
export function stringToGuid(pchGUID: string): Uint8Array<ArrayBuffer> {
  return lib.symbols.SDL_StringToGUID(_p.toCstr(pchGUID));
}

