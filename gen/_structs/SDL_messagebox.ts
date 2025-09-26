/**
 * # CategoryMessagebox
 *
 * SDL offers a simple message box API, which is useful for simple alerts,
 * such as informing the user when something fatal happens at startup without
 * the need to build a UI for it (or informing the user _before_ your UI is
 * ready).
 *
 * These message boxes are native system dialogs where possible.
 *
 * There is both a customizable function (SDL_ShowMessageBox()) that offers
 * lots of options for what to display and reports on what choice the user
 * made, and also a much-simplified version (SDL_ShowSimpleMessageBox()),
 * merely takes a text message and title, and waits until the user presses a
 * single "OK" UI button. Often, this is all that is necessary.
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

import * as _ from "@denosaurs/byte-type";


/**
 * Individual button data.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @from SDL_messagebox.h:81
 */
export const SDL_MessageBoxButtonData = new _.Struct({
  flags: _.u32, /* SDL_MessageBoxButtonFlags */
  buttonID: _.i32, /**< int : User defined button id (value returned via SDL_ShowMessageBox) */
  text: _.u64, /**< const char * : The UTF-8 button text */
});



/**
 * RGB value used in a message box color scheme
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @from SDL_messagebox.h:93
 */
export const SDL_MessageBoxColor = new _.Struct({
  r: _.u8, /* Uint8 */
  g: _.u8, /* Uint8 */
  b: _.u8, /* Uint8 */
});



/**
 * A set of colors to use for message box dialogs
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @from SDL_messagebox.h:117
 */
export const SDL_MessageBoxColorScheme = new _.Struct({
  colors: new _.ArrayType(SDL_MessageBoxColor, 5), /* SDL_MessageBoxColor[SDL_MESSAGEBOX_COLOR_COUNT] */
});



/**
 * MessageBox structure containing title, text, window, etc.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @from SDL_messagebox.h:127
 */
export const SDL_MessageBoxData = new _.Struct({
  flags: _.u32, /* SDL_MessageBoxFlags */
  window: _.u64, /**< SDL_Window * : Parent window, can be NULL */
  title: _.u64, /**< const char * : UTF-8 title */
  message: _.u64, /**< const char * : UTF-8 message text */
  numbuttons: _.i32, /* int */
  buttons: _.u64, /* const SDL_MessageBoxButtonData * */
  colorScheme: _.u64, /**< const SDL_MessageBoxColorScheme * : SDL_MessageBoxColorScheme, can be NULL to use system settings */
});
