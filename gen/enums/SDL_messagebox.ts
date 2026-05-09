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
 * @from SDL_messagebox:60 SDL_MESSAGEBOX_
 */
export enum MESSAGEBOX {
  ERROR = 0x00000010, /**< error dialog */
  WARNING = 0x00000020, /**< warning dialog */
  INFORMATION = 0x00000040, /**< informational dialog */
  BUTTONS_LEFT_TO_RIGHT = 0x00000080, /**< buttons placed left to right */
  BUTTONS_RIGHT_TO_LEFT = 0x00000100, /**< buttons placed right to left */
}



/**
 * @from SDL_messagebox:73 SDL_MESSAGEBOX_BUTTON_
 */
export enum MESSAGEBOX_BUTTON {
  RETURNKEY_DEFAULT = 0x00000001, /**< Marks the default button when return is hit */
  ESCAPEKEY_DEFAULT = 0x00000002, /**< Marks the default button when escape is hit */
}



/**
 * An enumeration of indices inside the colors array of
 * SDL_MessageBoxColorScheme.
 *
 * @from SDL_messagebox.h:102 SDL_MESSAGEBOX_COLOR_
 */
export enum SDL_MessageBoxColorType {
  BACKGROUND, 
  TEXT, 
  BUTTON_BORDER, 
  BUTTON_BACKGROUND, 
  BUTTON_SELECTED, 
  COUNT, /**< Size of the colors array of SDL_MessageBoxColorScheme. */
}



