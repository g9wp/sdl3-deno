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
 * An SDL_GUID is a 128-bit identifier for an input device that identifies
 * that device across runs of SDL programs on the same platform.
 *
 * If the device is detached and then re-attached to a different port, or if
 * the base system is rebooted, the device should still report the same GUID.
 *
 * GUIDs are as precise as possible but are not guaranteed to distinguish
 * physically distinct but equivalent devices. For example, two game
 * controllers from the same vendor with the same product ID and revision may
 * have the same GUID.
 *
 * GUIDs may be platform-dependent (i.e., the same device may report different
 * GUIDs on different operating systems).
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @from SDL_guid.h:60
 */
export const SDL_GUID = new _.Struct({
  data: new _.ArrayType(_.u8, 16), /* Uint8[16] */
});



