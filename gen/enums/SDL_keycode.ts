/**
 * # CategoryKeycode
 *
 * Defines constants which identify keyboard keys and modifiers.
 *
 * Please refer to the Best Keyboard Practices document for details on what
 * this information means and how best to use it.
 *
 * https://wiki.libsdl.org/SDL3/BestKeyboardPractices
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
 * @from SDL_keycode:60 SDLK_
 */
export enum SDLK {
  EXTENDED_MASK = (1 << 29), 
  SCANCODE_MASK = (1 << 30), 
}



/**
 * @from SDL_keycode:327 SDL_KMOD_
 */
export enum KMOD {
  NONE = 0x0000, /**< no modifier is applicable. */
  LSHIFT = 0x0001, /**< the left Shift key is down. */
  RSHIFT = 0x0002, /**< the right Shift key is down. */
  LEVEL5 = 0x0004, /**< the Level 5 Shift key is down. */
  LCTRL = 0x0040, /**< the left Ctrl (Control) key is down. */
  RCTRL = 0x0080, /**< the right Ctrl (Control) key is down. */
  LALT = 0x0100, /**< the left Alt key is down. */
  RALT = 0x0200, /**< the right Alt key is down. */
  LGUI = 0x0400, /**< the left GUI key (often the Windows key) is down. */
  RGUI = 0x0800, /**< the right GUI key (often the Windows key) is down. */
  NUM = 0x1000, /**< the Num Lock key (may be located on an extended keypad) is down. */
  CAPS = 0x2000, /**< the Caps Lock key is down. */
  MODE = 0x4000, /**< the !AltGr key is down. */
  SCROLL = 0x8000, /**< the Scroll Lock key is down. */
  CTRL = (LCTRL | RCTRL), /**< Any Ctrl key is down. */
  SHIFT = (LSHIFT | RSHIFT), /**< Any Shift key is down. */
  ALT = (LALT | RALT), /**< Any Alt key is down. */
  GUI = (LGUI | RGUI), /**< Any GUI key is down. */
}



