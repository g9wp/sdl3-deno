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

import { symbols } from './symbols/SDL_filesystem.ts';
/**
 * Callback for directory enumeration.
 *
 * Enumeration of directory entries will continue until either all entries
 * have been provided to the callback, or the callback has requested a stop
 * through its return value.
 *
 * Returning SDL_ENUM_CONTINUE will let enumeration proceed, calling the
 * callback with further entries. SDL_ENUM_SUCCESS and SDL_ENUM_FAILURE will
 * terminate the enumeration early, and dictate the return value of the
 * enumeration function itself.
 *
 * `dirname` is guaranteed to end with a path separator ('\\' on Windows, '/'
 * on most other platforms).
 *
 * @param userdata an app-controlled pointer that is passed to the callback.
 * @param dirname the directory that is being enumerated.
 * @param fname the next entry in the enumeration.
 * @returns how the enumeration should proceed.
 *
 * @since This datatype is available since SDL 3.2.0.
 *
 * @sa SDL_EnumerateDirectory
 *
 * @from SDL_filesystem.h:344 typedef SDL_EnumerationResult (*SDL_EnumerateDirectoryCallback)(void *userdata, const char *dirname, const char *fname);
 */
export function EnumerateDirectoryCallback(cb: (
    userdata: Deno.PointerValue, 
    dirname: Deno.PointerValue, 
    fname: Deno.PointerValue, 
  ) => number) {
  return new Deno.UnsafeCallback(symbols.SDL_EnumerateDirectoryCallback, cb);
}

