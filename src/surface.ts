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
 * There is also a simple .bmp loader, SDL_LoadBMP(). SDL itself does not
 * provide loaders for various other file formats, but there are several
 * excellent external libraries that do, including its own satellite library,
 * SDL_image:
 *
 * https://github.com/libsdl-org/SDL_image
 *
 * @module
 */

import * as IMG from "../gen/IMG.ts";

import * as SDL from "../gen/sdl/iostream.ts";
import { destroySurface } from "../gen/sdl/surface.ts";

import { cstr, SdlError } from "./_utils.ts";
import type { SurfacePointer } from "./pointer_type.ts";


export class Surface {
  pointer: SurfacePointer = null;

  constructor(imagePath?: string, surface?: SurfacePointer) {
    if (surface !== undefined) {
      this.pointer = surface;
      return;
    }
    if (!imagePath) return;
    this.pointer = IMG.load(cstr(imagePath)) as SurfacePointer;
    if (!this.pointer) throw SdlError(`Failed to load image`);
  }

  static of(pointer: SurfacePointer): Surface {
    return new Surface(undefined, pointer);
  }

  /**
   * Load an image from a filesystem path into a software surface.
   *
   * An SDL_Surface is a buffer of pixels in memory accessible by the CPU. Use
   * this if you plan to hand the data to something else or manipulate it
   * further in code.
   *
   * There are no guarantees about what format the new SDL_Surface data will be;
   * in many cases, SDL_image will attempt to supply a surface that exactly
   * matches the provided image, but in others it might have to convert (either
   * because the image is in a format that SDL doesn't directly support or
   * because it's compressed data that could reasonably uncompress to various
   * formats and SDL_image had to pick one). You can inspect an SDL_Surface for
   * its specifics, and use SDL_ConvertSurface to then migrate to any supported
   * format.
   *
   * If the image format supports a transparent pixel, SDL will set the colorkey
   * for the surface. You can enable RLE acceleration on the surface afterwards
   * by calling: SDL_SetSurfaceColorKey(image, SDL_RLEACCEL,
   * image->format->colorkey);
   *
   * There is a separate function to read files from an SDL_IOStream, if you
   * need an i/o abstraction to provide data from anywhere instead of a simple
   * filesystem read; that function is IMG_Load_IO().
   *
   * If you are using SDL's 2D rendering API, there is an equivalent call to
   * load images directly into an SDL_Texture for use by the GPU without using a
   * software surface: call IMG_LoadTexture() instead.
   *
   * When done with the returned surface, the app should dispose of it with a
   * call to
   * [SDL_DestroySurface](https://wiki.libsdl.org/SDL3/SDL_DestroySurface)
   * ().
   *
   * @param imagePath a path on the filesystem to load an image from.
   * @returns a new SDL surface, or NULL on error.
   *
   * @since This function is available since SDL_image 3.0.0.
   *
   * @sa IMG_LoadTyped_IO
   * @sa IMG_Load_IO
   * @sa SDL_DestroySurface
   *
   * @from SDL_image.h:177 SDL_Surface * IMG_Load(const char *file);
   */
  static load(imagePath: string): Surface {
    return new Surface(imagePath);
  }

  /**
   * Load an image from an SDL data source into a software surface.
   *
   * An SDL_Surface is a buffer of pixels in memory accessible by the CPU. Use
   * this if you plan to hand the data to something else or manipulate it
   * further in code.
   *
   * There are no guarantees about what format the new SDL_Surface data will be;
   * in many cases, SDL_image will attempt to supply a surface that exactly
   * matches the provided image, but in others it might have to convert (either
   * because the image is in a format that SDL doesn't directly support or
   * because it's compressed data that could reasonably uncompress to various
   * formats and SDL_image had to pick one). You can inspect an SDL_Surface for
   * its specifics, and use SDL_ConvertSurface to then migrate to any supported
   * format.
   *
   * If the image format supports a transparent pixel, SDL will set the colorkey
   * for the surface. You can enable RLE acceleration on the surface afterwards
   * by calling: SDL_SetSurfaceColorKey(image, SDL_RLEACCEL,
   * image->format->colorkey);
   *
   * If `closeio` is true, `src` will be closed before returning, whether this
   * function succeeds or not. SDL_image reads everything it needs from `src`
   * during this call in any case.
   *
   * There is a separate function to read files from disk without having to deal
   * with SDL_IOStream: `IMG_Load("filename.jpg")` will call this function and
   * manage those details for you, determining the file type from the filename's
   * extension.
   *
   * There is also IMG_LoadTyped_IO(), which is equivalent to this function
   * except a file extension (like "BMP", "JPG", etc) can be specified, in case
   * SDL_image cannot autodetect the file format.
   *
   * If you are using SDL's 2D rendering API, there is an equivalent call to
   * load images directly into an SDL_Texture for use by the GPU without using a
   * software surface: call IMG_LoadTexture_IO() instead.
   *
   * When done with the returned surface, the app should dispose of it with a
   * call to SDL_DestroySurface().
   *
   * @param buffer data will be read from.
   * @returns a new SDL surface, or NULL on error.
   *
   * @since This function is available since SDL_image 3.0.0.
   *
   * @sa IMG_Load
   * @sa IMG_LoadTyped_IO
   * @sa SDL_DestroySurface
   *
   * @from SDL_image.h:231 SDL_Surface * IMG_Load_IO(SDL_IOStream *src, bool closeio);
   */
  static loadMem(buffer: Uint8Array): Surface {
    const io = SDL.ioFromConstMem(
      Deno.UnsafePointer.of(buffer),
      BigInt(buffer.length),
    );
    const pointer = IMG.loadIo(io, false) as SurfacePointer;
    if (!pointer) throw SdlError(`Failed to load image`);
    return Surface.of(pointer);
  }

  /**
   * Load an image from an SDL data source into a software surface.
   *
   * An SDL_Surface is a buffer of pixels in memory accessible by the CPU. Use
   * this if you plan to hand the data to something else or manipulate it
   * further in code.
   *
   * There are no guarantees about what format the new SDL_Surface data will be;
   * in many cases, SDL_image will attempt to supply a surface that exactly
   * matches the provided image, but in others it might have to convert (either
   * because the image is in a format that SDL doesn't directly support or
   * because it's compressed data that could reasonably uncompress to various
   * formats and SDL_image had to pick one). You can inspect an SDL_Surface for
   * its specifics, and use SDL_ConvertSurface to then migrate to any supported
   * format.
   *
   * If the image format supports a transparent pixel, SDL will set the colorkey
   * for the surface. You can enable RLE acceleration on the surface afterwards
   * by calling: SDL_SetSurfaceColorKey(image, SDL_RLEACCEL,
   * image->format->colorkey);
   *
   * If `closeio` is true, `src` will be closed before returning, whether this
   * function succeeds or not. SDL_image reads everything it needs from `src`
   * during this call in any case.
   *
   * Even though this function accepts a file type, SDL_image may still try
   * other decoders that are capable of detecting file type from the contents of
   * the image data, but may rely on the caller-provided type string for formats
   * that it cannot autodetect. If `type` is NULL, SDL_image will rely solely on
   * its ability to guess the format.
   *
   * There is a separate function to read files from disk without having to deal
   * with SDL_IOStream: `IMG_Load("filename.jpg")` will call this function and
   * manage those details for you, determining the file type from the filename's
   * extension.
   *
   * There is also IMG_Load_IO(), which is equivalent to this function except
   * that it will rely on SDL_image to determine what type of data it is
   * loading, much like passing a NULL for type.
   *
   * If you are using SDL's 2D rendering API, there is an equivalent call to
   * load images directly into an SDL_Texture for use by the GPU without using a
   * software surface: call IMG_LoadTextureTyped_IO() instead.
   *
   * When done with the returned surface, the app should dispose of it with a
   * call to SDL_DestroySurface().
   *
   * @param buffer data will be read from.
   * @param fmt_hint a filename extension that represent this data ("BMP", "GIF",
   *             "PNG", etc).
   * @returns a new SDL surface, or NULL on error.
   *
   * @since This function is available since SDL_image 3.0.0.
   *
   * @sa IMG_Load
   * @sa IMG_Load_IO
   * @sa SDL_DestroySurface
   *
   * @from SDL_image.h:132 SDL_Surface * IMG_LoadTyped_IO(SDL_IOStream *src, bool closeio, const char *type);
   */
  static loadMemTyped(buffer: Uint8Array, fmt_hint: string): Surface {
    const io = SDL.ioFromConstMem(
      Deno.UnsafePointer.of(buffer),
      BigInt(buffer.length),
    );
    const pointer = IMG.loadTypedIo(
      io,
      false,
      cstr(fmt_hint),
    ) as SurfacePointer;
    if (!pointer) throw SdlError(`Failed to load image`);
    return Surface.of(pointer);
  }
  /**
   * Free a surface.
   *
   * It is safe to pass NULL to this function.
   *
   * @threadsafety No other thread should be using the surface when it is freed.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_CreateSurface
   * @sa SDL_CreateSurfaceFrom
   *
   * @from SDL_surface.h:212 void SDL_DestroySurface(SDL_Surface *surface);
   */
  destroy() {
    if (!this.pointer) return;
    destroySurface(this.pointer);
    this.pointer = null;
  }
}
