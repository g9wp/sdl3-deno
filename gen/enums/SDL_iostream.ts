/**
 * # CategoryIOStream
 *
 * SDL provides an abstract interface for reading and writing data streams. It
 * offers implementations for files, memory, etc, and the app can provide
 * their own implementations, too.
 *
 * SDL_IOStream is not related to the standard C++ iostream class, other than
 * both are abstract interfaces to read/write data.
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
 * @from SDL_iostream:279 SDL_PROP_IOSTREAM_
 */
export enum PROP_IOSTREAM {
  WINDOWS_HANDLE_POINTER = "SDL.iostream.windows.handle", 
  STDIO_FILE_POINTER = "SDL.iostream.stdio.file", 
  FILE_DESCRIPTOR_NUMBER = "SDL.iostream.file_descriptor", 
  ANDROID_AASSET_POINTER = "SDL.iostream.android.aasset", 
}



/**
 * @from SDL_iostream:331 SDL_PROP_IOSTREAM_MEMORY_
 */
export enum PROP_IOSTREAM_MEMORY {
  POINTER = "SDL.iostream.memory.base", 
  SIZE_NUMBER = "SDL.iostream.memory.size", 
  FREE_FUNC_POINTER = "SDL.iostream.memory.free", 
}



/**
 * @from SDL_iostream:412 SDL_PROP_IOSTREAM_DYNAMIC_
 */
export enum PROP_IOSTREAM_DYNAMIC {
  MEMORY_POINTER = "SDL.iostream.dynamic.memory", 
  CHUNKSIZE_NUMBER = "SDL.iostream.dynamic.chunksize", 
}



/**
 * SDL_IOStream status, set by a read or write operation.
 *
 * @since This enum is available since SDL 3.2.0.
 *
 * @from SDL_iostream.h:52 SDL_IO_STATUS_
 */
export enum SDL_IOStatus {
  READY, /**< Everything is ready (no errors and not EOF). */
  ERROR, /**< Read or write I/O error */
  EOF, /**< End of file */
  NOT_READY, /**< Non blocking I/O, not ready */
  READONLY, /**< Tried to write a read-only buffer */
  WRITEONLY, /**< Tried to read a write-only buffer */
}



/**
 * Possible `whence` values for SDL_IOStream seeking.
 *
 * These map to the same "whence" concept that `fseek` or `lseek` use in the
 * standard C runtime.
 *
 * @since This enum is available since SDL 3.2.0.
 *
 * @from SDL_iostream.h:70 SDL_IO_SEEK_
 */
export enum SDL_IOWhence {
  SET, /**< Seek from the beginning of data */
  CUR, /**< Seek relative to current read point */
  END, /**< Seek relative to the end of data */
}



