/**
 * # CategoryDialog
 *
 * File dialog support.
 *
 * SDL offers file dialogs, to let users select files with native GUI
 * interfaces. There are "open" dialogs, "save" dialogs, and folder selection
 * dialogs. The app can control some details, such as filtering to specific
 * files, or whether multiple files can be selected by the user.
 *
 * Note that launching a file dialog is a non-blocking operation; control
 * returns to the app immediately, and a callback is called later (possibly in
 * another thread) when the user makes a choice.
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
  PROP_FILE_DIALOG as PROP_FILE_DIALOG,
  SDL_FileDialogType as FILEDIALOG,
} from "../enums/SDL_dialog.ts"

/**
 * Displays a dialog that lets the user select a file on their filesystem.
 *
 * This is an asynchronous function; it will return immediately, and the
 * result will be passed to the callback.
 *
 * The callback will be invoked with a null-terminated list of files the user
 * chose. The list will be empty if the user canceled the dialog, and it will
 * be NULL if an error occurred.
 *
 * Note that the callback may be called from a different thread than the one
 * the function was invoked on.
 *
 * Depending on the platform, the user may be allowed to input paths that
 * don't yet exist.
 *
 * On Linux, dialogs may require XDG Portals, which requires DBus, which
 * requires an event-handling loop. Apps that do not use SDL to handle events
 * should add a call to SDL_PumpEvents in their main loop.
 *
 * @param callback a function pointer to be invoked when the user selects a
 *                 file and accepts, or cancels the dialog, or an error
 *                 occurs.
 * @param userdata an optional pointer to pass extra data to the callback when
 *                 it will be invoked.
 * @param window the window that the dialog should be modal for, may be NULL.
 *               Not all platforms support this option.
 * @param filters a list of filters, may be NULL. Not all platforms support
 *                this option, and platforms that do support it may allow the
 *                user to ignore the filters. If non-NULL, it must remain
 *                valid at least until the callback is invoked.
 * @param nfilters the number of filters. Ignored if filters is NULL.
 * @param default_location the default folder or file to start the dialog at,
 *                         may be NULL. Not all platforms support this option.
 * @param allow_many if non-zero, the user will be allowed to select multiple
 *                   entries. Not all platforms support this option.
 *
 * @threadsafety This function should be called only from the main thread. The
 *               callback may be invoked from the same thread or from a
 *               different one, depending on the OS's constraints.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_DialogFileCallback
 * @sa SDL_DialogFileFilter
 * @sa SDL_ShowSaveFileDialog
 * @sa SDL_ShowOpenFolderDialog
 * @sa SDL_ShowFileDialogWithProperties
 *
 * @from SDL_dialog.h:163 void SDL_ShowOpenFileDialog(SDL_DialogFileCallback callback, void *userdata, SDL_Window *window, const SDL_DialogFileFilter *filters, int nfilters, const char *default_location, bool allow_many);
 */
export function showOpenFileDialog(
    callback: Deno.PointerValue,
    userdata: Deno.PointerValue,
    window: Deno.PointerValue<"SDL_Window">,
    filters: Deno.PointerValue<"SDL_DialogFileFilter">,
    nfilters: number,
    default_location: string,
    allow_many: boolean,
): void {
  return lib.symbols.SDL_ShowOpenFileDialog(callback, userdata, window, filters, nfilters, _p.toCstr(default_location), allow_many);
}

/**
 * Displays a dialog that lets the user choose a new or existing file on their
 * filesystem.
 *
 * This is an asynchronous function; it will return immediately, and the
 * result will be passed to the callback.
 *
 * The callback will be invoked with a null-terminated list of files the user
 * chose. The list will be empty if the user canceled the dialog, and it will
 * be NULL if an error occurred.
 *
 * Note that the callback may be called from a different thread than the one
 * the function was invoked on.
 *
 * The chosen file may or may not already exist.
 *
 * On Linux, dialogs may require XDG Portals, which requires DBus, which
 * requires an event-handling loop. Apps that do not use SDL to handle events
 * should add a call to SDL_PumpEvents in their main loop.
 *
 * @param callback a function pointer to be invoked when the user selects a
 *                 file and accepts, or cancels the dialog, or an error
 *                 occurs.
 * @param userdata an optional pointer to pass extra data to the callback when
 *                 it will be invoked.
 * @param window the window that the dialog should be modal for, may be NULL.
 *               Not all platforms support this option.
 * @param filters a list of filters, may be NULL. Not all platforms support
 *                this option, and platforms that do support it may allow the
 *                user to ignore the filters. If non-NULL, it must remain
 *                valid at least until the callback is invoked.
 * @param nfilters the number of filters. Ignored if filters is NULL.
 * @param default_location the default folder or file to start the dialog at,
 *                         may be NULL. Not all platforms support this option.
 *
 * @threadsafety This function should be called only from the main thread. The
 *               callback may be invoked from the same thread or from a
 *               different one, depending on the OS's constraints.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_DialogFileCallback
 * @sa SDL_DialogFileFilter
 * @sa SDL_ShowOpenFileDialog
 * @sa SDL_ShowOpenFolderDialog
 * @sa SDL_ShowFileDialogWithProperties
 *
 * @from SDL_dialog.h:212 void SDL_ShowSaveFileDialog(SDL_DialogFileCallback callback, void *userdata, SDL_Window *window, const SDL_DialogFileFilter *filters, int nfilters, const char *default_location);
 */
export function showSaveFileDialog(
    callback: Deno.PointerValue,
    userdata: Deno.PointerValue,
    window: Deno.PointerValue<"SDL_Window">,
    filters: Deno.PointerValue<"SDL_DialogFileFilter">,
    nfilters: number,
    default_location: string,
): void {
  return lib.symbols.SDL_ShowSaveFileDialog(callback, userdata, window, filters, nfilters, _p.toCstr(default_location));
}

/**
 * Displays a dialog that lets the user select a folder on their filesystem.
 *
 * This is an asynchronous function; it will return immediately, and the
 * result will be passed to the callback.
 *
 * The callback will be invoked with a null-terminated list of files the user
 * chose. The list will be empty if the user canceled the dialog, and it will
 * be NULL if an error occurred.
 *
 * Note that the callback may be called from a different thread than the one
 * the function was invoked on.
 *
 * Depending on the platform, the user may be allowed to input paths that
 * don't yet exist.
 *
 * On Linux, dialogs may require XDG Portals, which requires DBus, which
 * requires an event-handling loop. Apps that do not use SDL to handle events
 * should add a call to SDL_PumpEvents in their main loop.
 *
 * @param callback a function pointer to be invoked when the user selects a
 *                 file and accepts, or cancels the dialog, or an error
 *                 occurs.
 * @param userdata an optional pointer to pass extra data to the callback when
 *                 it will be invoked.
 * @param window the window that the dialog should be modal for, may be NULL.
 *               Not all platforms support this option.
 * @param default_location the default folder or file to start the dialog at,
 *                         may be NULL. Not all platforms support this option.
 * @param allow_many if non-zero, the user will be allowed to select multiple
 *                   entries. Not all platforms support this option.
 *
 * @threadsafety This function should be called only from the main thread. The
 *               callback may be invoked from the same thread or from a
 *               different one, depending on the OS's constraints.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_DialogFileCallback
 * @sa SDL_ShowOpenFileDialog
 * @sa SDL_ShowSaveFileDialog
 * @sa SDL_ShowFileDialogWithProperties
 *
 * @from SDL_dialog.h:257 void SDL_ShowOpenFolderDialog(SDL_DialogFileCallback callback, void *userdata, SDL_Window *window, const char *default_location, bool allow_many);
 */
export function showOpenFolderDialog(
    callback: Deno.PointerValue,
    userdata: Deno.PointerValue,
    window: Deno.PointerValue<"SDL_Window">,
    default_location: string,
    allow_many: boolean,
): void {
  return lib.symbols.SDL_ShowOpenFolderDialog(callback, userdata, window, _p.toCstr(default_location), allow_many);
}

/**
 * Create and launch a file dialog with the specified properties.
 *
 * These are the supported properties:
 *
 * - `SDL_PROP_FILE_DIALOG_FILTERS_POINTER`: a pointer to a list of
 *   SDL_DialogFileFilter structs, which will be used as filters for
 *   file-based selections. Ignored if the dialog is an "Open Folder" dialog.
 *   If non-NULL, the array of filters must remain valid at least until the
 *   callback is invoked.
 * - `SDL_PROP_FILE_DIALOG_NFILTERS_NUMBER`: the number of filters in the
 *   array of filters, if it exists.
 * - `SDL_PROP_FILE_DIALOG_WINDOW_POINTER`: the window that the dialog should
 *   be modal for.
 * - `SDL_PROP_FILE_DIALOG_LOCATION_STRING`: the default folder or file to
 *   start the dialog at.
 * - `SDL_PROP_FILE_DIALOG_MANY_BOOLEAN`: true to allow the user to select
 *   more than one entry.
 * - `SDL_PROP_FILE_DIALOG_TITLE_STRING`: the title for the dialog.
 * - `SDL_PROP_FILE_DIALOG_ACCEPT_STRING`: the label that the accept button
 *   should have.
 * - `SDL_PROP_FILE_DIALOG_CANCEL_STRING`: the label that the cancel button
 *   should have.
 *
 * Note that each platform may or may not support any of the properties.
 *
 * @param type the type of file dialog.
 * @param callback a function pointer to be invoked when the user selects a
 *                 file and accepts, or cancels the dialog, or an error
 *                 occurs.
 * @param userdata an optional pointer to pass extra data to the callback when
 *                 it will be invoked.
 * @param props the properties to use.
 *
 * @threadsafety This function should be called only from the main thread. The
 *               callback may be invoked from the same thread or from a
 *               different one, depending on the OS's constraints.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_FileDialogType
 * @sa SDL_DialogFileCallback
 * @sa SDL_DialogFileFilter
 * @sa SDL_ShowOpenFileDialog
 * @sa SDL_ShowSaveFileDialog
 * @sa SDL_ShowOpenFolderDialog
 *
 * @from SDL_dialog.h:323 void SDL_ShowFileDialogWithProperties(SDL_FileDialogType type, SDL_DialogFileCallback callback, void *userdata, SDL_PropertiesID props);
 */
export function showFileDialogWithProperties(
    type: number,
    callback: Deno.PointerValue,
    userdata: Deno.PointerValue,
    props: number,
): void {
  return lib.symbols.SDL_ShowFileDialogWithProperties(type, callback, userdata, props);
}

