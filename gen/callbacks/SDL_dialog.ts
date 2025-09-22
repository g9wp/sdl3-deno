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

export const callbacks = {
/**
 * Callback used by file dialog functions.
 *
 * The specific usage is described in each function.
 *
 * If `filelist` is:
 *
 * - NULL, an error occurred. Details can be obtained with SDL_GetError().
 * - A pointer to NULL, the user either didn't choose any file or canceled the
 *   dialog.
 * - A pointer to non-`NULL`, the user chose one or more files. The argument
 *   is a null-terminated array of pointers to UTF-8 encoded strings, each
 *   containing a path.
 *
 * The filelist argument should not be freed; it will automatically be freed
 * when the callback returns.
 *
 * The filter argument is the index of the filter that was selected, or -1 if
 * no filter was selected or if the platform or method doesn't support
 * fetching the selected filter.
 *
 * In Android, the `filelist` are `content://` URIs. They should be opened
 * using SDL_IOFromFile() with appropriate modes. This applies both to open
 * and save file dialog.
 *
 * @param userdata an app-provided pointer, for the callback's use.
 * @param filelist the file(s) chosen by the user.
 * @param filter index of the selected filter.
 *
 * @since This datatype is available since SDL 3.2.0.
 *
 * @sa SDL_DialogFileFilter
 * @sa SDL_ShowOpenFileDialog
 * @sa SDL_ShowSaveFileDialog
 * @sa SDL_ShowOpenFolderDialog
 * @sa SDL_ShowFileDialogWithProperties
 *
 * @from SDL_dialog.h:112 typedef void (*SDL_DialogFileCallback)(void *userdata, const char * const *filelist, int filter);
 */
SDL_DialogFileCallback: {
      parameters: ["pointer", "pointer", "i32"],
      result: "void"
    },

} as const;


/**
 * Callback used by file dialog functions.
 *
 * The specific usage is described in each function.
 *
 * If `filelist` is:
 *
 * - NULL, an error occurred. Details can be obtained with SDL_GetError().
 * - A pointer to NULL, the user either didn't choose any file or canceled the
 *   dialog.
 * - A pointer to non-`NULL`, the user chose one or more files. The argument
 *   is a null-terminated array of pointers to UTF-8 encoded strings, each
 *   containing a path.
 *
 * The filelist argument should not be freed; it will automatically be freed
 * when the callback returns.
 *
 * The filter argument is the index of the filter that was selected, or -1 if
 * no filter was selected or if the platform or method doesn't support
 * fetching the selected filter.
 *
 * In Android, the `filelist` are `content://` URIs. They should be opened
 * using SDL_IOFromFile() with appropriate modes. This applies both to open
 * and save file dialog.
 *
 * @param userdata an app-provided pointer, for the callback's use.
 * @param filelist the file(s) chosen by the user.
 * @param filter index of the selected filter.
 *
 * @since This datatype is available since SDL 3.2.0.
 *
 * @sa SDL_DialogFileFilter
 * @sa SDL_ShowOpenFileDialog
 * @sa SDL_ShowSaveFileDialog
 * @sa SDL_ShowOpenFolderDialog
 * @sa SDL_ShowFileDialogWithProperties
 *
 * @from SDL_dialog.h:112 typedef void (*SDL_DialogFileCallback)(void *userdata, const char * const *filelist, int filter);
 */
export function DialogFileCallback(cb: (
    userdata: Deno.PointerValue, 
    filelist: Deno.PointerValue, 
    filter: number, 
  ) => void) {
  return new Deno.UnsafeCallback(callbacks.SDL_DialogFileCallback, cb);
}

