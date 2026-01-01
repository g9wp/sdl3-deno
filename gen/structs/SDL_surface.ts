/**
 * # CategorySurface
 *
 * SDL surfaces are buffers of pixels in system RAM. These are useful for
 * passing around and manipulating images that are not stored in GPU memory.
 *
 * SDL_Surface makes serious efforts to manage images in various formats, and
 * provides a reasonable toolbox for transforming the data, including copying
 * between surfaces, filling rectangles in the image data, etc.
 *
 * There is also a simple .bmp loader, SDL_LoadBMP(), and a simple .png
 * loader, SDL_LoadPNG(). SDL itself does not provide loaders for other file
 * formats, but there are several excellent external libraries that do,
 * including its own satellite library,
 * [SDL_image](https://wiki.libsdl.org/SDL3_image)
 * .
 *
 * In general these functions are thread-safe in that they can be called on
 * different threads with different surfaces. You should not try to modify any
 * surface from two threads simultaneously.
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
import * as _b from "../_structs/SDL_surface.ts";


/**
 * A collection of pixels used in software blitting.
 *
 * Pixels are arranged in memory in rows, with the top row first. Each row
 * occupies an amount of memory given by the pitch (sometimes known as the row
 * stride in non-SDL APIs).
 *
 * Within each row, pixels are arranged from left to right until the width is
 * reached. Each pixel occupies a number of bits appropriate for its format,
 * with most formats representing each pixel as one or more whole bytes (in
 * some indexed formats, instead multiple pixels are packed into each byte),
 * and a byte order given by the format. After encoding all pixels, any
 * remaining bytes to reach the pitch are used as padding to reach a desired
 * alignment, and have undefined contents.
 *
 * When a surface holds YUV format data, the planes are assumed to be
 * contiguous without padding between them, e.g. a 32x32 surface in NV12
 * format with a pitch of 32 would consist of 32x32 bytes of Y plane followed
 * by 32x16 bytes of UV plane.
 *
 * When a surface holds MJPG format data, pixels points at the compressed JPEG
 * image and pitch is the length of that data.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @sa SDL_CreateSurface
 * @sa SDL_DestroySurface
 *
 * @from SDL_surface.h:137
 */
export interface Surface {
  flags: number; /**< SDL_SurfaceFlags : The flags of the surface, read-only */
  format: number; /**< SDL_PixelFormat : The format of the surface, read-only */
  w: number; /**< int : The width of the surface, read-only. */
  h: number; /**< int : The height of the surface, read-only. */
  pitch: number; /**< int : The distance in bytes between rows of pixels, read-only */
  pixels: Deno.PointerValue; /**< void * : A pointer to the pixels of the surface, the pixels are writeable if non-NULL */
  refcount: number; /**< int : Application reference count, used when freeing surface */
  reserved: Deno.PointerValue; /**< void * : Reserved for internal use */
}

export function read_Surface(dt: DataView): Surface {
  const t = _b.SDL_Surface.read(dt);
  return {
    flags: t.flags, /** SDL_SurfaceFlags */
    format: t.format, /** SDL_PixelFormat */
    w: t.w, /** int */
    h: t.h, /** int */
    pitch: t.pitch, /** int */
    pixels: Deno.UnsafePointer.create(t.pixels), /** void * */
    refcount: t.refcount, /** int */
    reserved: Deno.UnsafePointer.create(t.reserved), /** void * */
  };
}

export function write_Surface(t: Surface, dt: DataView) {
  _b.SDL_Surface.write({
    flags: t.flags, /** SDL_SurfaceFlags */
    format: t.format, /** SDL_PixelFormat */
    w: t.w, /** int */
    h: t.h, /** int */
    pitch: t.pitch, /** int */
    pixels: Deno.UnsafePointer.value(t.pixels), /** void * */
    refcount: t.refcount, /** int */
    reserved: Deno.UnsafePointer.value(t.reserved), /** void * */
  }, dt);
}


