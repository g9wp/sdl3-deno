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
 * @from SDL_filesystem:286
 */
export const SDL_GLOB_CASEINSENSITIVE = (1u << 0);

