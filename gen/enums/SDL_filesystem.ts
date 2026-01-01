/**
 * # CategoryFilesystem
 *
 * SDL offers an API for examining and manipulating the system's filesystem.
 * This covers most things one would need to do with directories, except for
 * actual file I/O (which is covered by [CategoryIOStream](CategoryIOStream)
 * and [CategoryAsyncIO](CategoryAsyncIO) instead).
 *
 * There are functions to answer necessary path questions:
 *
 * - Where is my app's data? SDL_GetBasePath().
 * - Where can I safely write files? SDL_GetPrefPath().
 * - Where are paths like Downloads, Desktop, Music? SDL_GetUserFolder().
 * - What is this thing at this location? SDL_GetPathInfo().
 * - What items live in this folder? SDL_EnumerateDirectory().
 * - What items live in this folder by wildcard? SDL_GlobDirectory().
 * - What is my current working directory? SDL_GetCurrentDirectory().
 *
 * SDL also offers functions to manipulate the directory tree: renaming,
 * removing, copying files.
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
 * The type of the OS-provided default folder for a specific purpose.
 *
 * Note that the Trash folder isn't included here, because trashing files
 * usually involves extra OS-specific functionality to remember the file's
 * original location.
 *
 * The folders supported per platform are:
 *
 * |             | Windows | macOS/iOS | tvOS | Unix (XDG) | Haiku | Emscripten |
 * | ----------- | ------- | --------- | ---- | ---------- | ----- | ---------- |
 * | HOME        | X       | X         |      | X          | X     | X          |
 * | DESKTOP     | X       | X         |      | X          | X     |            |
 * | DOCUMENTS   | X       | X         |      | X          |       |            |
 * | DOWNLOADS   | Vista+  | X         |      | X          |       |            |
 * | MUSIC       | X       | X         |      | X          |       |            |
 * | PICTURES    | X       | X         |      | X          |       |            |
 * | PUBLICSHARE |         | X         |      | X          |       |            |
 * | SAVEDGAMES  | Vista+  |           |      |            |       |            |
 * | SCREENSHOTS | Vista+  |           |      |            |       |            |
 * | TEMPLATES   | X       | X         |      | X          |       |            |
 * | VIDEOS      | X       | X*        |      | X          |       |            |
 *
 * Note that on macOS/iOS, the Videos folder is called "Movies".
 *
 * @since This enum is available since SDL 3.2.0.
 *
 * @sa SDL_GetUserFolder
 *
 * @from SDL_filesystem.h:194 SDL_FOLDER_
 */
export enum SDL_Folder {
  HOME, /**< The folder which contains all of the current user's data, preferences, and documents. It usually contains most of the other folders. If a requested folder does not exist, the home folder can be considered a safe fallback to store a user's documents. */
  DESKTOP, /**< The folder of files that are displayed on the desktop. Note that the existence of a desktop folder does not guarantee that the system does show icons on its desktop; certain GNU/Linux distros with a graphical environment may not have desktop icons. */
  DOCUMENTS, /**< User document files, possibly application-specific. This is a good place to save a user's projects. */
  DOWNLOADS, /**< Standard folder for user files downloaded from the internet. */
  MUSIC, /**< Music files that can be played using a standard music player (mp3, ogg...). */
  PICTURES, /**< Image files that can be displayed using a standard viewer (png, jpg...). */
  PUBLICSHARE, /**< Files that are meant to be shared with other users on the same computer. */
  SAVEDGAMES, /**< Save files for games. */
  SCREENSHOTS, /**< Application screenshots. */
  TEMPLATES, /**< Template files to be used when the user requests the desktop environment to create a new file in a certain folder, such as "New Text File.txt".  Any file in the Templates folder can be used as a starting point for a new file. */
  VIDEOS, /**< Video files that can be played using a standard video player (mp4, webm...). */
  COUNT, /**< Total number of types in this enum, not a folder type by itself. */
}



/**
 * Types of filesystem entries.
 *
 * Note that there may be other sorts of items on a filesystem: devices,
 * symlinks, named pipes, etc. They are currently reported as
 * SDL_PATHTYPE_OTHER.
 *
 * @since This enum is available since SDL 3.2.0.
 *
 * @sa SDL_PathInfo
 *
 * @from SDL_filesystem.h:251 SDL_PATHTYPE_
 */
export enum SDL_PathType {
  NONE, /**< path does not exist */
  FILE, /**< a normal file */
  DIRECTORY, /**< a directory */
  OTHER, /**< something completely different like a device node (not a symlink, those are always followed) */
}



/**
 * Possible results from an enumeration callback.
 *
 * @since This enum is available since SDL 3.2.0.
 *
 * @sa SDL_EnumerateDirectoryCallback
 *
 * @from SDL_filesystem.h:313 SDL_ENUM_
 */
export enum SDL_EnumerationResult {
  CONTINUE, /**< Value that requests that enumeration continue. */
  SUCCESS, /**< Value that requests that enumeration stop, successfully. */
  FAILURE, /**< Value that requests that enumeration stop, as a failure. */
}



