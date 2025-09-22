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

import { lib } from "./lib.ts";
import * as _p from "@g9wp/ptr";


export {
  MESSAGEBOX as MESSAGEBOX,
  MESSAGEBOX_BUTTON as MESSAGEBOX_BUTTON,
  SDL_MessageBoxColorType as MESSAGEBOX_COLOR,
} from "../enums/SDL_messagebox.ts"

/**
 * Create a modal message box.
 *
 * If your needs aren't complex, it might be easier to use
 * SDL_ShowSimpleMessageBox.
 *
 * This function should be called on the thread that created the parent
 * window, or on the main thread if the messagebox has no parent. It will
 * block execution of that thread until the user clicks a button or closes the
 * messagebox.
 *
 * This function may be called at any time, even before SDL_Init(). This makes
 * it useful for reporting errors like a failure to create a renderer or
 * OpenGL context.
 *
 * On X11, SDL rolls its own dialog box with X11 primitives instead of a
 * formal toolkit like GTK+ or Qt.
 *
 * Note that if SDL_Init() would fail because there isn't any available video
 * target, this function is likely to fail for the same reasons. If this is a
 * concern, check the return value from this function and fall back to writing
 * to stderr if you can.
 *
 * @param messageboxdata the SDL_MessageBoxData structure with title, text and
 *                       other options.
 * @param buttonid the pointer to which user id of hit button should be
 *                 copied.
 * @returns true on success or false on failure; call SDL_GetError() for more
 *          information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_ShowSimpleMessageBox
 *
 * @from SDL_messagebox.h:174 bool SDL_ShowMessageBox(const SDL_MessageBoxData *messageboxdata, int *buttonid);
 */
export function showMessageBox(messageboxdata: Deno.PointerValue<"SDL_MessageBoxData">): number {
  if(!lib.symbols.SDL_ShowMessageBox(messageboxdata, _p.i32.p0))
    throw new Error(`SDL_ShowMessageBox: ${_p.getCstr2(lib.symbols.SDL_GetError())}`);
  return _p.i32.v0;
}

/**
 * Display a simple modal message box.
 *
 * If your needs aren't complex, this function is preferred over
 * SDL_ShowMessageBox.
 *
 * `flags` may be any of the following:
 *
 * - `SDL_MESSAGEBOX_ERROR`: error dialog
 * - `SDL_MESSAGEBOX_WARNING`: warning dialog
 * - `SDL_MESSAGEBOX_INFORMATION`: informational dialog
 *
 * This function should be called on the thread that created the parent
 * window, or on the main thread if the messagebox has no parent. It will
 * block execution of that thread until the user clicks a button or closes the
 * messagebox.
 *
 * This function may be called at any time, even before SDL_Init(). This makes
 * it useful for reporting errors like a failure to create a renderer or
 * OpenGL context.
 *
 * On X11, SDL rolls its own dialog box with X11 primitives instead of a
 * formal toolkit like GTK+ or Qt.
 *
 * Note that if SDL_Init() would fail because there isn't any available video
 * target, this function is likely to fail for the same reasons. If this is a
 * concern, check the return value from this function and fall back to writing
 * to stderr if you can.
 *
 * @param flags an SDL_MessageBoxFlags value.
 * @param title UTF-8 title text.
 * @param message UTF-8 message text.
 * @param window the parent window, or NULL for no parent.
 * @returns true on success or false on failure; call SDL_GetError() for more
 *          information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_ShowMessageBox
 *
 * @from SDL_messagebox.h:216 bool SDL_ShowSimpleMessageBox(SDL_MessageBoxFlags flags, const char *title, const char *message, SDL_Window *window);
 */
export function showSimpleMessageBox(
    flags: number,
    title: string,
    message: string,
    window: Deno.PointerValue<"SDL_Window">,
): boolean {
  return lib.symbols.SDL_ShowSimpleMessageBox(flags, _p.toCstr(title), _p.toCstr(message), window);
}

