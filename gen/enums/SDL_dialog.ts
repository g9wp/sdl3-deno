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

/**
 * @from SDL_dialog:327 SDL_PROP_FILE_DIALOG_
 */
export enum PROP_FILE_DIALOG {
  FILTERS_POINTER = "SDL.filedialog.filters", 
  NFILTERS_NUMBER = "SDL.filedialog.nfilters", 
  WINDOW_POINTER = "SDL.filedialog.window", 
  LOCATION_STRING = "SDL.filedialog.location", 
  MANY_BOOLEAN = "SDL.filedialog.many", 
  TITLE_STRING = "SDL.filedialog.title", 
  ACCEPT_STRING = "SDL.filedialog.accept", 
  CANCEL_STRING = "SDL.filedialog.cancel", 
}



/**
 * Various types of file dialogs.
 *
 * This is used by SDL_ShowFileDialogWithProperties() to decide what kind of
 * dialog to present to the user.
 *
 * @since This enum is available since SDL 3.2.0.
 *
 * @sa SDL_ShowFileDialogWithProperties
 *
 * @from SDL_dialog.h:271 SDL_FILEDIALOG_
 */
export enum SDL_FileDialogType {
  OPENFILE, 
  SAVEFILE, 
  OPENFOLDER, 
}



