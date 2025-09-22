/**
 * # CategoryTray
 *
 * SDL offers a way to add items to the "system tray" (more correctly called
 * the "notification area" on Windows). On platforms that offer this concept,
 * an SDL app can add a tray icon, submenus, checkboxes, and clickable
 * entries, and register a callback that is fired when the user clicks on
 * these pieces.
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

export const callbacks = {
/**
 * A callback that is invoked when a tray entry is selected.
 *
 * @param userdata an optional pointer to pass extra data to the callback when
 *                 it will be invoked.
 * @param entry the tray entry that was selected.
 *
 * @since This datatype is available since SDL 3.2.0.
 *
 * @sa SDL_SetTrayEntryCallback
 *
 * @from SDL_tray.h:96 typedef void (*SDL_TrayCallback)(void *userdata, SDL_TrayEntry *entry);
 */
SDL_TrayCallback: {
      parameters: ["pointer", "pointer"],
      result: "void"
    },

} as const;


/**
 * A callback that is invoked when a tray entry is selected.
 *
 * @param userdata an optional pointer to pass extra data to the callback when
 *                 it will be invoked.
 * @param entry the tray entry that was selected.
 *
 * @since This datatype is available since SDL 3.2.0.
 *
 * @sa SDL_SetTrayEntryCallback
 *
 * @from SDL_tray.h:96 typedef void (*SDL_TrayCallback)(void *userdata, SDL_TrayEntry *entry);
 */
export function TrayCallback(cb: (
    userdata: Deno.PointerValue, 
    entry: Deno.PointerValue, 
  ) => void) {
  return new Deno.UnsafeCallback(callbacks.SDL_TrayCallback, cb);
}

