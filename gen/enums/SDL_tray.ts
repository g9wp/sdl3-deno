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

/**
 * @from SDL_tray:79 SDL_TRAYENTRY_
 */
export enum TRAYENTRY {
  BUTTON = 0x00000001, /**< Make the entry a simple button. Required. */
  CHECKBOX = 0x00000002, /**< Make the entry a checkbox. Required. */
  SUBMENU = 0x00000004, /**< Prepare the entry to have a submenu. Required */
  DISABLED = 0x80000000, /**< Make the entry disabled. Optional. */
  CHECKED = 0x40000000, /**< Make the entry checked. This is valid only for checkboxes. Optional. */
}



