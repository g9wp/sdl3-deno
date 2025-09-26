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

import * as _ from "../_utils.ts";
import * as _b from "../_structs/SDL_messagebox.ts";


/**
 * Individual button data.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @from SDL_messagebox.h:81
 */
export interface MessageBoxButtonData {
  flags: number; /* SDL_MessageBoxButtonFlags */
  buttonID: number; /**< int : User defined button id (value returned via SDL_ShowMessageBox) */
  text: Deno.PointerValue; /**< const char * : The UTF-8 button text */
}

export function read_MessageBoxButtonData(dt: DataView): MessageBoxButtonData {
  const t = _b.SDL_MessageBoxButtonData.read(dt);
  return {
    flags: t.flags, /** SDL_MessageBoxButtonFlags */
    buttonID: t.buttonID, /** int */
    text: _.read_cstr_v(t.text), /** const char * */
  };
}

export function write_MessageBoxButtonData(t: MessageBoxButtonData, dt: DataView) {
  _b.SDL_MessageBoxButtonData.write({
    flags: t.flags, /** SDL_MessageBoxButtonFlags */
    buttonID: t.buttonID, /** int */
    text: _.cstr_v(t.text), /** const char * */
  }, dt);
}


/**
 * RGB value used in a message box color scheme
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @from SDL_messagebox.h:93
 */
export interface MessageBoxColor {
  r: number; /* Uint8 */
  g: number; /* Uint8 */
  b: number; /* Uint8 */
}

export function read_MessageBoxColor(dt: DataView): MessageBoxColor {
  const t = _b.SDL_MessageBoxColor.read(dt);
  return {
    r: t.r, /** Uint8 */
    g: t.g, /** Uint8 */
    b: t.b, /** Uint8 */
  };
}

export function write_MessageBoxColor(t: MessageBoxColor, dt: DataView) {
  _b.SDL_MessageBoxColor.write({
    r: t.r, /** Uint8 */
    g: t.g, /** Uint8 */
    b: t.b, /** Uint8 */
  }, dt);
}


/**
 * A set of colors to use for message box dialogs
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @from SDL_messagebox.h:117
 */
export interface MessageBoxColorScheme {
  colors: MessageBoxColor[]; /* SDL_MessageBoxColor[SDL_MESSAGEBOX_COLOR_COUNT] */
}

export function read_MessageBoxColorScheme(dt: DataView): MessageBoxColorScheme {
  const t = _b.SDL_MessageBoxColorScheme.read(dt);
  return {
    colors: t.colors, /** SDL_MessageBoxColor */
  };
}

export function write_MessageBoxColorScheme(t: MessageBoxColorScheme, dt: DataView) {
  _b.SDL_MessageBoxColorScheme.write({
    colors: t.colors, /** SDL_MessageBoxColor */
  }, dt);
}


/**
 * MessageBox structure containing title, text, window, etc.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @from SDL_messagebox.h:127
 */
export interface MessageBoxData {
  flags: number; /* SDL_MessageBoxFlags */
  window: Deno.PointerValue; /**< SDL_Window * : Parent window, can be NULL */
  title: string; /**< const char * : UTF-8 title */
  message: string; /**< const char * : UTF-8 message text */
  numbuttons: number; /* int */
  buttons: Deno.PointerValue; /* const SDL_MessageBoxButtonData * */
  colorScheme: Deno.PointerValue; /**< const SDL_MessageBoxColorScheme * : SDL_MessageBoxColorScheme, can be NULL to use system settings */
}

export function read_MessageBoxData(dt: DataView): MessageBoxData {
  const t = _b.SDL_MessageBoxData.read(dt);
  return {
    flags: t.flags, /** SDL_MessageBoxFlags */
    window: Deno.UnsafePointer.create(t.window), /** SDL_Window * */
    title: _.read_cstr_v(t.title), /** const char * */
    message: _.read_cstr_v(t.message), /** const char * */
    numbuttons: t.numbuttons, /** int */
    buttons: Deno.UnsafePointer.create(t.buttons), /** const SDL_MessageBoxButtonData * */
    colorScheme: Deno.UnsafePointer.create(t.colorScheme), /** const SDL_MessageBoxColorScheme * */
  };
}

export function write_MessageBoxData(t: MessageBoxData, dt: DataView) {
  _b.SDL_MessageBoxData.write({
    flags: t.flags, /** SDL_MessageBoxFlags */
    window: Deno.UnsafePointer.value(t.window), /** SDL_Window * */
    title: _.cstr_v(t.title), /** const char * */
    message: _.cstr_v(t.message), /** const char * */
    numbuttons: t.numbuttons, /** int */
    buttons: Deno.UnsafePointer.value(t.buttons), /** const SDL_MessageBoxButtonData * */
    colorScheme: Deno.UnsafePointer.value(t.colorScheme), /** const SDL_MessageBoxColorScheme * */
  }, dt);
}
