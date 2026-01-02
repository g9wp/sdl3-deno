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

import * as _ from "../_utils.ts";
import * as _b from "../_structs/SDL_iostream.ts";


/**
 * The function pointers that drive an SDL_IOStream.
 *
 * Applications can provide this struct to SDL_OpenIO() to create their own
 * implementation of SDL_IOStream. This is not necessarily required, as SDL
 * already offers several common types of I/O streams, via functions like
 * SDL_IOFromFile() and SDL_IOFromMem().
 *
 * This structure should be initialized using SDL_INIT_INTERFACE()
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @sa SDL_INIT_INTERFACE
 *
 * @from SDL_iostream.h:91
 */
export interface IOStreamInterface {
    /* The version of this interface */
  version: number; /* Uint32 */
    /**
     *  Return the number of bytes in this SDL_IOStream
     *
     *  \return the total size of the data stream, or -1 on error.
     */
  size: Deno.PointerValue; /*     Sint64 (SDLCALL *size)(void *userdata); */
    /**
     *  Seek to `offset` relative to `whence`, one of stdio's whence values:
     *  SDL_IO_SEEK_SET, SDL_IO_SEEK_CUR, SDL_IO_SEEK_END
     *
     *  \return the final offset in the data stream, or -1 on error.
     */
  seek: Deno.PointerValue; /*     Sint64 (SDLCALL *seek)(void *userdata, Sint64 offset, SDL_IOWhence whence); */
    /**
     *  Read up to `size` bytes from the data stream to the area pointed
     *  at by `ptr`. `size` will always be > 0.
     *
     *  On an incomplete read, you should set `*status` to a value from the
     *  SDL_IOStatus enum. You do not have to explicitly set this on
     *  a complete, successful read.
     *
     *  \return the number of bytes read
     */
  read: Deno.PointerValue; /*     size_t (SDLCALL *read)(void *userdata, void *ptr, size_t size, SDL_IOStatus *status); */
    /**
     *  Write exactly `size` bytes from the area pointed at by `ptr`
     *  to data stream. `size` will always be > 0.
     *
     *  On an incomplete write, you should set `*status` to a value from the
     *  SDL_IOStatus enum. You do not have to explicitly set this on
     *  a complete, successful write.
     *
     *  \return the number of bytes written
     */
  write: Deno.PointerValue; /*     size_t (SDLCALL *write)(void *userdata, const void *ptr, size_t size, SDL_IOStatus *status); */
    /**
     *  If the stream is buffering, make sure the data is written out.
     *
     *  On failure, you should set `*status` to a value from the
     *  SDL_IOStatus enum. You do not have to explicitly set this on
     *  a successful flush.
     *
     *  \return true if successful or false on write error when flushing data.
     */
  flush: Deno.PointerValue; /*     bool (SDLCALL *flush)(void *userdata, SDL_IOStatus *status); */
    /**
     *  Close and free any allocated resources.
     *
     *  This does not guarantee file writes will sync to physical media; they
     *  can be in the system's file cache, waiting to go to disk.
     *
     *  The SDL_IOStream is still destroyed even if this fails, so clean up anything
     *  even if flushing buffers, etc, returns an error.
     *
     *  \return true if successful or false on write error when flushing data.
     */
  close: Deno.PointerValue; /*     bool (SDLCALL *close)(void *userdata); */
}

export function read_IOStreamInterface(dt: DataView): IOStreamInterface {
  const t = _b.SDL_IOStreamInterface.read(dt);
  return {
    /* The version of this interface */
    version: t.version, /** Uint32 */
    /**
     *  Return the number of bytes in this SDL_IOStream
     *
     *  \return the total size of the data stream, or -1 on error.
     */
    size: Deno.UnsafePointer.create(t.size), /**     Sint64 (SDLCALL *size)(void *userdata); */
    /**
     *  Seek to `offset` relative to `whence`, one of stdio's whence values:
     *  SDL_IO_SEEK_SET, SDL_IO_SEEK_CUR, SDL_IO_SEEK_END
     *
     *  \return the final offset in the data stream, or -1 on error.
     */
    seek: Deno.UnsafePointer.create(t.seek), /**     Sint64 (SDLCALL *seek)(void *userdata, Sint64 offset, SDL_IOWhence whence); */
    /**
     *  Read up to `size` bytes from the data stream to the area pointed
     *  at by `ptr`. `size` will always be > 0.
     *
     *  On an incomplete read, you should set `*status` to a value from the
     *  SDL_IOStatus enum. You do not have to explicitly set this on
     *  a complete, successful read.
     *
     *  \return the number of bytes read
     */
    read: Deno.UnsafePointer.create(t.read), /**     size_t (SDLCALL *read)(void *userdata, void *ptr, size_t size, SDL_IOStatus *status); */
    /**
     *  Write exactly `size` bytes from the area pointed at by `ptr`
     *  to data stream. `size` will always be > 0.
     *
     *  On an incomplete write, you should set `*status` to a value from the
     *  SDL_IOStatus enum. You do not have to explicitly set this on
     *  a complete, successful write.
     *
     *  \return the number of bytes written
     */
    write: Deno.UnsafePointer.create(t.write), /**     size_t (SDLCALL *write)(void *userdata, const void *ptr, size_t size, SDL_IOStatus *status); */
    /**
     *  If the stream is buffering, make sure the data is written out.
     *
     *  On failure, you should set `*status` to a value from the
     *  SDL_IOStatus enum. You do not have to explicitly set this on
     *  a successful flush.
     *
     *  \return true if successful or false on write error when flushing data.
     */
    flush: Deno.UnsafePointer.create(t.flush), /**     bool (SDLCALL *flush)(void *userdata, SDL_IOStatus *status); */
    /**
     *  Close and free any allocated resources.
     *
     *  This does not guarantee file writes will sync to physical media; they
     *  can be in the system's file cache, waiting to go to disk.
     *
     *  The SDL_IOStream is still destroyed even if this fails, so clean up anything
     *  even if flushing buffers, etc, returns an error.
     *
     *  \return true if successful or false on write error when flushing data.
     */
    close: Deno.UnsafePointer.create(t.close), /**     bool (SDLCALL *close)(void *userdata); */
  };
}

export function write_IOStreamInterface(t: IOStreamInterface, dt: DataView) {
  _b.SDL_IOStreamInterface.write({
    /* The version of this interface */
    version: t.version, /** Uint32 */
    /**
     *  Return the number of bytes in this SDL_IOStream
     *
     *  \return the total size of the data stream, or -1 on error.
     */
    size: Deno.UnsafePointer.value(t.size), /**     Sint64 (SDLCALL *size)(void *userdata); */
    /**
     *  Seek to `offset` relative to `whence`, one of stdio's whence values:
     *  SDL_IO_SEEK_SET, SDL_IO_SEEK_CUR, SDL_IO_SEEK_END
     *
     *  \return the final offset in the data stream, or -1 on error.
     */
    seek: Deno.UnsafePointer.value(t.seek), /**     Sint64 (SDLCALL *seek)(void *userdata, Sint64 offset, SDL_IOWhence whence); */
    /**
     *  Read up to `size` bytes from the data stream to the area pointed
     *  at by `ptr`. `size` will always be > 0.
     *
     *  On an incomplete read, you should set `*status` to a value from the
     *  SDL_IOStatus enum. You do not have to explicitly set this on
     *  a complete, successful read.
     *
     *  \return the number of bytes read
     */
    read: Deno.UnsafePointer.value(t.read), /**     size_t (SDLCALL *read)(void *userdata, void *ptr, size_t size, SDL_IOStatus *status); */
    /**
     *  Write exactly `size` bytes from the area pointed at by `ptr`
     *  to data stream. `size` will always be > 0.
     *
     *  On an incomplete write, you should set `*status` to a value from the
     *  SDL_IOStatus enum. You do not have to explicitly set this on
     *  a complete, successful write.
     *
     *  \return the number of bytes written
     */
    write: Deno.UnsafePointer.value(t.write), /**     size_t (SDLCALL *write)(void *userdata, const void *ptr, size_t size, SDL_IOStatus *status); */
    /**
     *  If the stream is buffering, make sure the data is written out.
     *
     *  On failure, you should set `*status` to a value from the
     *  SDL_IOStatus enum. You do not have to explicitly set this on
     *  a successful flush.
     *
     *  \return true if successful or false on write error when flushing data.
     */
    flush: Deno.UnsafePointer.value(t.flush), /**     bool (SDLCALL *flush)(void *userdata, SDL_IOStatus *status); */
    /**
     *  Close and free any allocated resources.
     *
     *  This does not guarantee file writes will sync to physical media; they
     *  can be in the system's file cache, waiting to go to disk.
     *
     *  The SDL_IOStream is still destroyed even if this fails, so clean up anything
     *  even if flushing buffers, etc, returns an error.
     *
     *  \return true if successful or false on write error when flushing data.
     */
    close: Deno.UnsafePointer.value(t.close), /**     bool (SDLCALL *close)(void *userdata); */
  }, dt);
}


