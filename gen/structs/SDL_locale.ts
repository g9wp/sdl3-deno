/**
 * # CategoryLocale
 *
 * SDL locale services.
 *
 * This provides a way to get a list of preferred locales (language plus
 * country) for the user. There is exactly one function:
 * SDL_GetPreferredLocales(), which handles all the heavy lifting, and offers
 * documentation on all the strange ways humans might have configured their
 * language settings.
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

import * as _ from "../_utils.ts";
import * as _b from "../_structs/SDL_locale.ts";


/**
 * A struct to provide locale data.
 *
 * Locale data is split into a spoken language, like English, and an optional
 * country, like Canada. The language will be in ISO-639 format (so English
 * would be "en"), and the country, if not NULL, will be an ISO-3166 country
 * code (so Canada would be "CA").
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetPreferredLocales
 *
 * @from SDL_locale.h:59
 */
export interface Locale {
  language: Deno.PointerValue; /**< const char * : A language name, like "en" for English. */
  country: Deno.PointerValue; /**< const char * : A country, like "US" for America. Can be NULL. */
}

export function read_Locale(dt: DataView): Locale {
  const t = _b.SDL_Locale.read(dt);
  return {
    language: _.read_cstr_v(t.language), /** const char * */
    country: _.read_cstr_v(t.country), /** const char * */
  };
}

export function write_Locale(t: Locale, dt: DataView) {
  _b.SDL_Locale.write({
    language: _.cstr_v(t.language), /** const char * */
    country: _.cstr_v(t.country), /** const char * */
  }, dt);
}


