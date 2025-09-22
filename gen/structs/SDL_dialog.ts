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

import * as _ from "../_utils.ts";
import * as _b from "../_structs/SDL_dialog.ts";


/**
 * An entry for filters for file dialogs.
 *
 * `name` is a user-readable label for the filter (for example, "Office
 * document").
 *
 * `pattern` is a semicolon-separated list of file extensions (for example,
 * "doc;docx"). File extensions may only contain alphanumeric characters,
 * hyphens, underscores and periods. Alternatively, the whole string can be a
 * single asterisk ("*"), which serves as an "All files" filter.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @sa SDL_DialogFileCallback
 * @sa SDL_ShowOpenFileDialog
 * @sa SDL_ShowSaveFileDialog
 * @sa SDL_ShowOpenFolderDialog
 * @sa SDL_ShowFileDialogWithProperties
 *
 * @from SDL_dialog.h:69
 */
export interface DialogFileFilter {
  name: Deno.PointerValue; /* const char * */
  pattern: Deno.PointerValue; /* const char * */
}

export function read_DialogFileFilter(dt: DataView): DialogFileFilter {
  const t = _b.SDL_DialogFileFilter.read(dt);
  return {
    name: _.read_cstr_v(t.name), /** const char * */
    pattern: _.read_cstr_v(t.pattern), /** const char * */
  };
}

export function write_DialogFileFilter(t: DialogFileFilter, dt: DataView) {
  _b.SDL_DialogFileFilter.write({
    name: _.cstr_v(t.name), /** const char * */
    pattern: _.cstr_v(t.pattern), /** const char * */
  }, dt);
}


