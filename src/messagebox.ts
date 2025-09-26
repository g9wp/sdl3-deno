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

import * as _ from "../gen/structs/SDL_messagebox.ts";
import * as SDL from "../gen/sdl/messagebox.ts";

import { cstr } from "./_utils.ts";
import * as _p from '@g9wp/ptr';
import type { WindowPointer } from "./pointer_type.ts";

/** informational dialog  */
export function info(title: string, message: string): void {
  simple({ title, message, type: "info" });
}

/** warning dialog */
export function warn(title: string, message: string): void {
  simple({ title, message, type: "warn" });
}

/** error dialog */
export function error(
  title: string,
  message: string,
): void {
  simple({ title, message, type: "error" });
}

export type MsgBoxFlag = MsgBoxFlagType | MsgBoxFlagBtnDirection;
export type MsgBoxFlagType = "info" | "warn" | "error";
export type MsgBoxFlagBtnDirection = "left" | "right";

function msgBoxFlag(f: MsgBoxFlag): number {
  switch (f) {
    case "info":
      return SDL.MESSAGEBOX.INFORMATION;
    case "warn":
      return SDL.MESSAGEBOX.WARNING;
    case "error":
      return SDL.MESSAGEBOX.ERROR;
    case "left":
      return SDL.MESSAGEBOX.BUTTONS_RIGHT_TO_LEFT;
    case "right":
      return SDL.MESSAGEBOX.BUTTONS_LEFT_TO_RIGHT;
    default:
      return 0;
  }
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
export function simple(
  { title, message, window, flags, type, direction }: MsgBoxOptionSimple,
): void {
  let f = 0;
  if (flags) {
    for (const flag of flags) {
      f |= msgBoxFlag(flag);
    }
  }
  if (type) f |= msgBoxFlag(type);
  if (direction) f |= msgBoxFlag(direction);
  SDL.showSimpleMessageBox(
    f,
    title,
    message,
    window ?? null,
  );
}

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
export function show(opt: MsgBoxOption): number | undefined {
  const {
    type,
    direction,
    flags,
    window,
    title,
    message,
    buttons,
    colorScheme,
  } = opt;

  const btnFlag = (f: ButtonFlags | undefined) => {
    switch (f) {
      case "return":
        return SDL.MESSAGEBOX_BUTTON.RETURNKEY_DEFAULT;
      case "escape":
        return SDL.MESSAGEBOX_BUTTON.ESCAPEKEY_DEFAULT;
      default:
        return 0;
    }
  };

  const buttonBuf = new Uint32Array(4 * buttons.length);
  buttons.forEach((button, i) =>
    _.write_MessageBoxButtonData({
      flags: btnFlag(button.flags),
      buttonID: button.id,
      text: cstr(button.text),
    }, new DataView(buttonBuf.buffer, 4 * 4 * i))
  );

  let f = 0;
  if (flags) {
    for (const flag of flags) {
      f |= msgBoxFlag(flag);
    }
  }
  if (type) f |= msgBoxFlag(type);
  if (direction) f |= msgBoxFlag(direction);

  const buf = new BigUint64Array(7);

  _.write_MessageBoxData({
    flags: f,
    window: window ?? null,
    title,
    message,
    numbuttons: buttons.length,
    buttons: Deno.UnsafePointer.of(
      buttonBuf,
    ), /* const SDL_MessageBoxButtonData * */
    colorScheme: colorScheme ?? null, // TODO
  }, new DataView(buf.buffer));

  try {
    return SDL.showMessageBox(Deno.UnsafePointer.of(buf) as Deno.PointerValue<"SDL_MessageBoxData">);
  } catch {
    return undefined;
  }
}

export interface MsgBoxOptionSimple {
  type?: MsgBoxFlagType;
  direction?: MsgBoxFlagBtnDirection;
  flags?: MsgBoxFlag[]; /* SDL_MessageBoxFlags */
  window?: WindowPointer; /**< SDL_Window * : Parent window, can be NULL */
  title: string; /**< const char * : UTF-8 title */
  message: string; /**< const char * : UTF-8 message text */
}

/**
 * MessageBox structure containing title, text, window, etc.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @from SDL_messagebox.h:127
 */
export interface MsgBoxOption extends MsgBoxOptionSimple {
  //numbuttons: _.i32, /* int */
  buttons: ButtonOption[]; /* const SDL_MessageBoxButtonData * */
  colorScheme?: Deno.PointerValue<
    "SDL_MessageBoxColorScheme"
  >; /**< const SDL_MessageBoxColorScheme * : SDL_MessageBoxColorScheme, can be NULL to use system settings */
}

/**
 * Individual button data.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @from SDL_messagebox.h:81
 */
export interface ButtonOption {
  flags?: ButtonFlags; /* SDL_MessageBoxButtonFlags */
  id:
    number; /**< int : User defined button id (value returned via SDL_ShowMessageBox) */
  text: string; /**< const char * : The UTF-8 button text */
}

/**
 * Marks the default button when return/escape is hit
 *
 * @from SDL_messagebox.h:73 SDL_MESSAGEBOX_BUTTON_
 */
export type ButtonFlags = "return" | "escape";
