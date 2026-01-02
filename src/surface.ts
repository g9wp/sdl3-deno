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

import * as SDL from "../gen/sdl/surface.ts";
import * as IO from "../gen/sdl/iostream.ts";

import * as _s from "../gen/structs/SDL_surface.ts";
import * as _p from "@g9wp/ptr";

import { SdlError } from "./_utils.ts";
import type { SurfacePointer } from "./pointer_type.ts";

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
 */
export class Surface {
  pointer: SurfacePointer = null;

  static IMG_load: (file: string) => SurfacePointer = SDL.loadBmp;
  static IMG_loadIo: (
    src: Deno.PointerValue<"SDL_IOStream">,
    closeio: boolean,
  ) => SurfacePointer = SDL.loadBmpIo;
  static IMG_loadTypedIo: (
    src: Deno.PointerValue<"SDL_IOStream">,
    closeio: boolean,
    type: string,
  ) => SurfacePointer = SDL.loadBmpIo;

  static async enableImageLib() {
    if (SDL.loadBmp !== Surface.IMG_load) return;
    const img = await import("../gen/IMG.ts");
    Surface.IMG_load = img.load;
    Surface.IMG_loadIo = img.loadIo;
    Surface.IMG_loadTypedIo = img.loadTypedIo;
  }

  constructor(imagePath?: string, surface?: SurfacePointer) {
    if (surface !== undefined) {
      this.pointer = surface;
      return;
    }
    if (!imagePath) return;
    this.pointer = Surface.IMG_load(imagePath);
    if (!this.pointer) throw SdlError(`Failed to load image`);
  }

  get detail(): _s.Surface {
    return _s.read_Surface(_p.UnsafeDataView(this.pointer!));
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
   * @param file a path on the filesystem to load an image from.
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
   * @param src an SDL_IOStream that data will be read from.
   * @param closeio true to close/free the SDL_IOStream before returning, false
   *                to leave it open.
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
  static loadMem(buffer: Uint8Array<ArrayBuffer>): Surface {
    const io = IO.ioFromConstMem(
      Deno.UnsafePointer.of(buffer),
      BigInt(buffer.length),
    );
    const pointer = Surface.IMG_loadIo(io, false);
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
   * @param src an SDL_IOStream that data will be read from.
   * @param closeio true to close/free the SDL_IOStream before returning, false
   *                to leave it open.
   * @param type a filename extension that represent this data ("BMP", "GIF",
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
  static loadMemTyped(
    buffer: Uint8Array<ArrayBuffer>,
    type: string,
  ): Surface {
    const io = IO.ioFromConstMem(
      Deno.UnsafePointer.of(buffer),
      BigInt(buffer.length),
    );
    const pointer = Surface.IMG_loadTypedIo(io, false, type);
    if (!pointer) throw SdlError(`Failed to load image`);
    return Surface.of(pointer);
  }
  /**
   * Free a surface.
   *
   * It is safe to pass NULL to this function.
   *
   * @param surface the SDL_Surface to free.
   *
   * @threadsafety No other thread should be using the surface when it is freed.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_CreateSurface
   * @sa SDL_CreateSurfaceFrom
   *
   * @from SDL_surface.h:218 void SDL_DestroySurface(SDL_Surface *surface);
   */
  destroy() {
    if (!this.pointer) return;
    SDL.destroySurface(this.pointer);
    this.pointer = null;
  }

  [Symbol.dispose]() {
    this.destroy();
  }

  /**
   * Allocate a new surface with a specific pixel format.
   *
   * The pixels of the new surface are initialized to zero.
   *
   * @param width the width of the surface.
   * @param height the height of the surface.
   * @param format the SDL_PixelFormat for the new surface's pixel format.
   * @returns the new SDL_Surface structure that is created or NULL on failure;
   *          call SDL_GetError() for more information.
   *
   * @threadsafety It is safe to call this function from any thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_CreateSurfaceFrom
   * @sa SDL_DestroySurface
   *
   * @from SDL_surface.h:172 SDL_Surface * SDL_CreateSurface(int width, int height, SDL_PixelFormat format);
   */
  create(
    width: number,
    height: number,
    format: number,
  ): Deno.PointerValue<"SDL_Surface"> {
    return SDL.createSurface(width, height, format) as Deno.PointerValue<
      "SDL_Surface"
    >;
  }

  /**
   * Allocate a new surface with a specific pixel format and existing pixel
   * data.
   *
   * No copy is made of the pixel data. Pixel data is not managed automatically;
   * you must free the surface before you free the pixel data.
   *
   * Pitch is the offset in bytes from one row of pixels to the next, e.g.
   * `width*4` for `SDL_PIXELFORMAT_RGBA8888`.
   *
   * You may pass NULL for pixels and 0 for pitch to create a surface that you
   * will fill in with valid values later.
   *
   * @param width the width of the surface.
   * @param height the height of the surface.
   * @param format the SDL_PixelFormat for the new surface's pixel format.
   * @param pixels a pointer to existing pixel data.
   * @param pitch the number of bytes between each row, including padding.
   * @returns the new SDL_Surface structure that is created or NULL on failure;
   *          call SDL_GetError() for more information.
   *
   * @threadsafety It is safe to call this function from any thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_CreateSurface
   * @sa SDL_DestroySurface
   *
   * @from SDL_surface.h:202 SDL_Surface * SDL_CreateSurfaceFrom(int width, int height, SDL_PixelFormat format, void *pixels, int pitch);
   */
  static createFrom(
    width: number,
    height: number,
    format: number,
    pixels: Deno.PointerValue,
    pitch: number,
  ): Surface {
    return Surface.of(
      SDL.createSurfaceFrom(width, height, format, pixels, pitch),
    );
  }

  /**
   * Get the properties associated with a surface.
   *
   * The following properties are understood by SDL:
   *
   * - `SDL_PROP_SURFACE_SDR_WHITE_POINT_FLOAT`: for HDR10 and floating point
   *   surfaces, this defines the value of 100% diffuse white, with higher
   *   values being displayed in the High Dynamic Range headroom. This defaults
   *   to 203 for HDR10 surfaces and 1.0 for floating point surfaces.
   * - `SDL_PROP_SURFACE_HDR_HEADROOM_FLOAT`: for HDR10 and floating point
   *   surfaces, this defines the maximum dynamic range used by the content, in
   *   terms of the SDR white point. This defaults to 0.0, which disables tone
   *   mapping.
   * - `SDL_PROP_SURFACE_TONEMAP_OPERATOR_STRING`: the tone mapping operator
   *   used when compressing from a surface with high dynamic range to another
   *   with lower dynamic range. Currently this supports "chrome", which uses
   *   the same tone mapping that Chrome uses for HDR content, the form "*=N",
   *   where N is a floating point scale factor applied in linear space, and
   *   "none", which disables tone mapping. This defaults to "chrome".
   * - `SDL_PROP_SURFACE_HOTSPOT_X_NUMBER`: the hotspot pixel offset from the
   *   left edge of the image, if this surface is being used as a cursor.
   * - `SDL_PROP_SURFACE_HOTSPOT_Y_NUMBER`: the hotspot pixel offset from the
   *   top edge of the image, if this surface is being used as a cursor.
   * - `SDL_PROP_SURFACE_ROTATION_FLOAT`: the number of degrees a surface's data
   *   is meant to be rotated clockwise to make the image right-side up. Default
   *   0. This is used by the camera API, if a mobile device is oriented
   *   differently than what its camera provides (i.e. - the camera always
   *   provides portrait images but the phone is being held in landscape
   *   orientation). Since SDL 3.4.0.
   *
   * @param surface the SDL_Surface structure to query.
   * @returns a valid property ID on success or 0 on failure; call
   *          SDL_GetError() for more information.
   *
   * @threadsafety It is safe to call this function from any thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @from SDL_surface.h:258 SDL_PropertiesID SDL_GetSurfaceProperties(SDL_Surface *surface);
   */
  get properties(): number {
    return SDL.getSurfaceProperties(this.pointer);
  }

  /**
   * Set the colorspace used by a surface.
   *
   * Setting the colorspace doesn't change the pixels, only how they are
   * interpreted in color operations.
   *
   * @param surface the SDL_Surface structure to update.
   * @param colorspace an SDL_Colorspace value describing the surface
   *                   colorspace.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function can be called on different threads with
   *               different surfaces.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_GetSurfaceColorspace
   *
   * @from SDL_surface.h:286 bool SDL_SetSurfaceColorspace(SDL_Surface *surface, SDL_Colorspace colorspace);
   */
  setColorspace(colorspace: number): boolean {
    return SDL.setSurfaceColorspace(this.pointer, colorspace);
  }

  /**
   * Get the colorspace used by a surface.
   *
   * The colorspace defaults to SDL_COLORSPACE_SRGB_LINEAR for floating point
   * formats, SDL_COLORSPACE_HDR10 for 10-bit formats, SDL_COLORSPACE_SRGB for
   * other RGB surfaces and SDL_COLORSPACE_BT709_FULL for YUV textures.
   *
   * @param surface the SDL_Surface structure to query.
   * @returns the colorspace used by the surface, or SDL_COLORSPACE_UNKNOWN if
   *          the surface is NULL.
   *
   * @threadsafety This function can be called on different threads with
   *               different surfaces.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_SetSurfaceColorspace
   *
   * @from SDL_surface.h:306 SDL_Colorspace SDL_GetSurfaceColorspace(SDL_Surface *surface);
   */
  get colorspace(): number {
    return SDL.getSurfaceColorspace(this.pointer);
  }

  /**
   * Create a palette and associate it with a surface.
   *
   * This function creates a palette compatible with the provided surface. The
   * palette is then returned for you to modify, and the surface will
   * automatically use the new palette in future operations. You do not need to
   * destroy the returned palette, it will be freed when the reference count
   * reaches 0, usually when the surface is destroyed.
   *
   * Bitmap surfaces (with format SDL_PIXELFORMAT_INDEX1LSB or
   * SDL_PIXELFORMAT_INDEX1MSB) will have the palette initialized with 0 as
   * white and 1 as black. Other surfaces will get a palette initialized with
   * white in every entry.
   *
   * If this function is called for a surface that already has a palette, a new
   * palette will be created to replace it.
   *
   * @param surface the SDL_Surface structure to update.
   * @returns a new SDL_Palette structure on success or NULL on failure (e.g. if
   *          the surface didn't have an index format); call SDL_GetError() for
   *          more information.
   *
   * @threadsafety This function can be called on different threads with
   *               different surfaces.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_SetPaletteColors
   *
   * @from SDL_surface.h:337 SDL_Palette * SDL_CreateSurfacePalette(SDL_Surface *surface);
   */
  createPalette(): Deno.PointerValue<"SDL_Palette"> {
    return SDL.createSurfacePalette(this.pointer) as Deno.PointerValue<
      "SDL_Palette"
    >;
  }

  /**
   * Set the palette used by a surface.
   *
   * Setting the palette keeps an internal reference to the palette, which can
   * be safely destroyed afterwards.
   *
   * A single palette can be shared with many surfaces.
   *
   * @param surface the SDL_Surface structure to update.
   * @param palette the SDL_Palette structure to use.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function can be called on different threads with
   *               different surfaces.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_CreatePalette
   * @sa SDL_GetSurfacePalette
   *
   * @from SDL_surface.h:360 bool SDL_SetSurfacePalette(SDL_Surface *surface, SDL_Palette *palette);
   */
  setPalette(palette: Deno.PointerValue<"SDL_Palette">): boolean {
    return SDL.setSurfacePalette(this.pointer, palette);
  }

  /**
   * Get the palette used by a surface.
   *
   * @param surface the SDL_Surface structure to query.
   * @returns a pointer to the palette used by the surface, or NULL if there is
   *          no palette used.
   *
   * @threadsafety It is safe to call this function from any thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_SetSurfacePalette
   *
   * @from SDL_surface.h:375 SDL_Palette * SDL_GetSurfacePalette(SDL_Surface *surface);
   */
  get palette(): Deno.PointerValue<"SDL_Palette"> {
    return SDL.getSurfacePalette(this.pointer) as Deno.PointerValue<
      "SDL_Palette"
    >;
  }

  /**
   * Add an alternate version of a surface.
   *
   * This function adds an alternate version of this surface, usually used for
   * content with high DPI representations like cursors or icons. The size,
   * format, and content do not need to match the original surface, and these
   * alternate versions will not be updated when the original surface changes.
   *
   * This function adds a reference to the alternate version, so you should call
   * SDL_DestroySurface() on the image after this call.
   *
   * @param surface the SDL_Surface structure to update.
   * @param image a pointer to an alternate SDL_Surface to associate with this
   *              surface.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function can be called on different threads with
   *               different surfaces.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_RemoveSurfaceAlternateImages
   * @sa SDL_GetSurfaceImages
   * @sa SDL_SurfaceHasAlternateImages
   *
   * @from SDL_surface.h:403 bool SDL_AddSurfaceAlternateImage(SDL_Surface *surface, SDL_Surface *image);
   */
  addAlternateImage(image: Deno.PointerValue<"SDL_Surface">): boolean {
    return SDL.addSurfaceAlternateImage(this.pointer, image);
  }

  /**
   * Return whether a surface has alternate versions available.
   *
   * @param surface the SDL_Surface structure to query.
   * @returns true if alternate versions are available or false otherwise.
   *
   * @threadsafety It is safe to call this function from any thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_AddSurfaceAlternateImage
   * @sa SDL_RemoveSurfaceAlternateImages
   * @sa SDL_GetSurfaceImages
   *
   * @from SDL_surface.h:419 bool SDL_SurfaceHasAlternateImages(SDL_Surface *surface);
   */
  HasAlternateImages(): boolean {
    return SDL.surfaceHasAlternateImages(this.pointer);
  }

  /**
   * Get an array including all versions of a surface.
   *
   * This returns all versions of a surface, with the surface being queried as
   * the first element in the returned array.
   *
   * Freeing the array of surfaces does not affect the surfaces in the array.
   * They are still referenced by the surface being queried and will be cleaned
   * up normally.
   *
   * @param surface the SDL_Surface structure to query.
   * @param count a pointer filled in with the number of surface pointers
   *              returned, may be NULL.
   * @returns a NULL terminated array of SDL_Surface pointers or NULL on
   *          failure; call SDL_GetError() for more information. This should be
   *          freed with SDL_free() when it is no longer needed.
   *
   * @threadsafety This function can be called on different threads with
   *               different surfaces.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_AddSurfaceAlternateImage
   * @sa SDL_RemoveSurfaceAlternateImages
   * @sa SDL_SurfaceHasAlternateImages
   *
   * @from SDL_surface.h:447 SDL_Surface ** SDL_GetSurfaceImages(SDL_Surface *surface, int *count);
   */
  get images(): Surface[] {
    const { ret } = SDL.getSurfaceImages(this.pointer);
    return _p.getPtrArr(ret!).map((p) =>
      Surface.of(p as Deno.PointerValue<"SDL_Surface">)
    );
  }

  /**
   * Remove all alternate versions of a surface.
   *
   * This function removes a reference from all the alternative versions,
   * destroying them if this is the last reference to them.
   *
   * @param surface the SDL_Surface structure to update.
   *
   * @threadsafety This function can be called on different threads with
   *               different surfaces.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_AddSurfaceAlternateImage
   * @sa SDL_GetSurfaceImages
   * @sa SDL_SurfaceHasAlternateImages
   *
   * @from SDL_surface.h:466 void SDL_RemoveSurfaceAlternateImages(SDL_Surface *surface);
   */
  removeAlternateImages(): void {
    return SDL.removeSurfaceAlternateImages(this.pointer);
  }

  /**
   * Set up a surface for directly accessing the pixels.
   *
   * Between calls to SDL_LockSurface() / SDL_UnlockSurface(), you can write to
   * and read from `surface->pixels`, using the pixel format stored in
   * `surface->format`. Once you are done accessing the surface, you should use
   * SDL_UnlockSurface() to release it.
   *
   * Not all surfaces require locking. If `SDL_MUSTLOCK(surface)` evaluates to
   * 0, then you can read and write to the surface at any time, and the pixel
   * format of the surface will not change.
   *
   * @param surface the SDL_Surface structure to be locked.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function can be called on different threads with
   *               different surfaces. The locking referred to by this function
   *               is making the pixels available for direct access, not
   *               thread-safe locking.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_MUSTLOCK
   * @sa SDL_UnlockSurface
   *
   * @from SDL_surface.h:494 bool SDL_LockSurface(SDL_Surface *surface);
   */
  lock(): boolean {
    return SDL.lockSurface(this.pointer);
  }

  /**
   * Release a surface after directly accessing the pixels.
   *
   * @param surface the SDL_Surface structure to be unlocked.
   *
   * @threadsafety This function is not thread safe. The locking referred to by
   *               this function is making the pixels available for direct
   *               access, not thread-safe locking.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_LockSurface
   *
   * @from SDL_surface.h:509 void SDL_UnlockSurface(SDL_Surface *surface);
   */
  unlock(): void {
    return SDL.unlockSurface(this.pointer);
  }

  /**
   * Load a BMP image from a seekable SDL data stream.
   *
   * The new surface should be freed with SDL_DestroySurface(). Not doing so
   * will result in a memory leak.
   *
   * @param src the data stream for the surface.
   * @param closeio if true, calls SDL_CloseIO() on `src` before returning, even
   *                in the case of an error.
   * @returns a pointer to a new SDL_Surface structure or NULL on failure; call
   *          SDL_GetError() for more information.
   *
   * @threadsafety It is safe to call this function from any thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_DestroySurface
   * @sa SDL_LoadBMP
   * @sa SDL_SaveBMP_IO
   *
   * @from SDL_surface.h:571 SDL_Surface * SDL_LoadBMP_IO(SDL_IOStream *src, bool closeio);
   */
  static loadBmpIo(
    src: Deno.PointerValue<"SDL_IOStream">,
    closeio: boolean,
  ): Surface {
    return Surface.of(SDL.loadBmpIo(src, closeio));
  }

  /**
   * Load a BMP image from a file.
   *
   * The new surface should be freed with SDL_DestroySurface(). Not doing so
   * will result in a memory leak.
   *
   * @param file the BMP file to load.
   * @returns a pointer to a new SDL_Surface structure or NULL on failure; call
   *          SDL_GetError() for more information.
   *
   * @threadsafety It is safe to call this function from any thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_DestroySurface
   * @sa SDL_LoadBMP_IO
   * @sa SDL_SaveBMP
   *
   * @from SDL_surface.h:591 SDL_Surface * SDL_LoadBMP(const char *file);
   */
  static loadBmp(file: string): Surface {
    return Surface.of(SDL.loadBmp(file));
  }

  /**
   * Save a surface to a seekable SDL data stream in BMP format.
   *
   * Surfaces with a 24-bit, 32-bit and paletted 8-bit format get saved in the
   * BMP directly. Other RGB formats with 8-bit or higher get converted to a
   * 24-bit surface or, if they have an alpha mask or a colorkey, to a 32-bit
   * surface before they are saved. YUV and paletted 1-bit and 4-bit formats are
   * not supported.
   *
   * @param surface the SDL_Surface structure containing the image to be saved.
   * @param dst a data stream to save to.
   * @param closeio if true, calls SDL_CloseIO() on `dst` before returning, even
   *                in the case of an error.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function can be called on different threads with
   *               different surfaces.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_LoadBMP_IO
   * @sa SDL_SaveBMP
   *
   * @from SDL_surface.h:617 bool SDL_SaveBMP_IO(SDL_Surface *surface, SDL_IOStream *dst, bool closeio);
   */
  saveBmpIo(dst: Deno.PointerValue<"SDL_IOStream">, closeio: boolean): boolean {
    return SDL.saveBmpIo(this.pointer, dst, closeio);
  }

  /**
   * Save a surface to a file in BMP format.
   *
   * Surfaces with a 24-bit, 32-bit and paletted 8-bit format get saved in the
   * BMP directly. Other RGB formats with 8-bit or higher get converted to a
   * 24-bit surface or, if they have an alpha mask or a colorkey, to a 32-bit
   * surface before they are saved. YUV and paletted 1-bit and 4-bit formats are
   * not supported.
   *
   * @param surface the SDL_Surface structure containing the image to be saved.
   * @param file a file to save to.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function can be called on different threads with
   *               different surfaces.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_LoadBMP
   * @sa SDL_SaveBMP_IO
   *
   * @from SDL_surface.h:641 bool SDL_SaveBMP(SDL_Surface *surface, const char *file);
   */
  saveBmp(file: string): boolean {
    return SDL.saveBmp(this.pointer, file);
  }

  /**
   * Set the RLE acceleration hint for a surface.
   *
   * If RLE is enabled, color key and alpha blending blits are much faster, but
   * the surface must be locked before directly accessing the pixels.
   *
   * @param surface the SDL_Surface structure to optimize.
   * @param enabled true to enable RLE acceleration, false to disable it.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function can be called on different threads with
   *               different surfaces.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_BlitSurface
   * @sa SDL_LockSurface
   * @sa SDL_UnlockSurface
   *
   * @from SDL_surface.h:751 bool SDL_SetSurfaceRLE(SDL_Surface *surface, bool enabled);
   */
  setRle(enabled: boolean): boolean {
    return SDL.setSurfaceRle(this.pointer, enabled);
  }

  /**
   * Returns whether the surface is RLE enabled.
   *
   * It is safe to pass a NULL `surface` here; it will return false.
   *
   * @param surface the SDL_Surface structure to query.
   * @returns true if the surface is RLE enabled, false otherwise.
   *
   * @threadsafety It is safe to call this function from any thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_SetSurfaceRLE
   *
   * @from SDL_surface.h:767 bool SDL_SurfaceHasRLE(SDL_Surface *surface);
   */
  hasRle(): boolean {
    return SDL.surfaceHasRle(this.pointer);
  }

  /**
   * Set the color key (transparent pixel) in a surface.
   *
   * The color key defines a pixel value that will be treated as transparent in
   * a blit. For example, one can use this to specify that cyan pixels should be
   * considered transparent, and therefore not rendered.
   *
   * It is a pixel of the format used by the surface, as generated by
   * SDL_MapRGB().
   *
   * @param surface the SDL_Surface structure to update.
   * @param enabled true to enable color key, false to disable color key.
   * @param key the transparent pixel.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function can be called on different threads with
   *               different surfaces.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_GetSurfaceColorKey
   * @sa SDL_SetSurfaceRLE
   * @sa SDL_SurfaceHasColorKey
   *
   * @from SDL_surface.h:794 bool SDL_SetSurfaceColorKey(SDL_Surface *surface, bool enabled, Uint32 key);
   */
  setColorKey(enabled: boolean, key: number): boolean {
    return SDL.setSurfaceColorKey(this.pointer, enabled, key);
  }

  /**
   * Returns whether the surface has a color key.
   *
   * It is safe to pass a NULL `surface` here; it will return false.
   *
   * @param surface the SDL_Surface structure to query.
   * @returns true if the surface has a color key, false otherwise.
   *
   * @threadsafety It is safe to call this function from any thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_SetSurfaceColorKey
   * @sa SDL_GetSurfaceColorKey
   *
   * @from SDL_surface.h:811 bool SDL_SurfaceHasColorKey(SDL_Surface *surface);
   */
  hasColorKey(): boolean {
    return SDL.surfaceHasColorKey(this.pointer);
  }

  /**
   * Get the color key (transparent pixel) for a surface.
   *
   * The color key is a pixel of the format used by the surface, as generated by
   * SDL_MapRGB().
   *
   * If the surface doesn't have color key enabled this function returns false.
   *
   * @param surface the SDL_Surface structure to query.
   * @param key a pointer filled in with the transparent pixel.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety It is safe to call this function from any thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_SetSurfaceColorKey
   * @sa SDL_SurfaceHasColorKey
   *
   * @from SDL_surface.h:833 bool SDL_GetSurfaceColorKey(SDL_Surface *surface, Uint32 *key);
   */
  get colorKey(): number {
    return SDL.getSurfaceColorKey(this.pointer);
  }

  /**
   * Set an additional color value multiplied into blit operations.
   *
   * When this surface is blitted, during the blit operation each source color
   * channel is modulated by the appropriate color value according to the
   * following formula:
   *
   * `srcC = srcC * (color / 255)`
   *
   * @param surface the SDL_Surface structure to update.
   * @param r the red color value multiplied into blit operations.
   * @param g the green color value multiplied into blit operations.
   * @param b the blue color value multiplied into blit operations.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function can be called on different threads with
   *               different surfaces.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_GetSurfaceColorMod
   * @sa SDL_SetSurfaceAlphaMod
   *
   * @from SDL_surface.h:859 bool SDL_SetSurfaceColorMod(SDL_Surface *surface, Uint8 r, Uint8 g, Uint8 b);
   */
  setColorMod(
    r: number,
    g: number,
    b: number,
  ): boolean {
    return SDL.setSurfaceColorMod(this.pointer, r, g, b);
  }

  /**
   * Get the additional color value multiplied into blit operations.
   *
   * @param surface the SDL_Surface structure to query.
   * @param r a pointer filled in with the current red color value.
   * @param g a pointer filled in with the current green color value.
   * @param b a pointer filled in with the current blue color value.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function can be called on different threads with
   *               different surfaces.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_GetSurfaceAlphaMod
   * @sa SDL_SetSurfaceColorMod
   *
   * @from SDL_surface.h:880 bool SDL_GetSurfaceColorMod(SDL_Surface *surface, Uint8 *r, Uint8 *g, Uint8 *b);
   */
  get colorMod(): { r: number; g: number; b: number } {
    return SDL.getSurfaceColorMod(this.pointer);
  }

  /**
   * Set an additional alpha value used in blit operations.
   *
   * When this surface is blitted, during the blit operation the source alpha
   * value is modulated by this alpha value according to the following formula:
   *
   * `srcA = srcA * (alpha / 255)`
   *
   * @param surface the SDL_Surface structure to update.
   * @param alpha the alpha value multiplied into blit operations.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function can be called on different threads with
   *               different surfaces.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_GetSurfaceAlphaMod
   * @sa SDL_SetSurfaceColorMod
   *
   * @from SDL_surface.h:903 bool SDL_SetSurfaceAlphaMod(SDL_Surface *surface, Uint8 alpha);
   */
  setAlphaMod(alpha: number): boolean {
    return SDL.setSurfaceAlphaMod(this.pointer, alpha);
  }

  /**
   * Get the additional alpha value used in blit operations.
   *
   * @param surface the SDL_Surface structure to query.
   * @param alpha a pointer filled in with the current alpha value.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety It is safe to call this function from any thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_GetSurfaceColorMod
   * @sa SDL_SetSurfaceAlphaMod
   *
   * @from SDL_surface.h:920 bool SDL_GetSurfaceAlphaMod(SDL_Surface *surface, Uint8 *alpha);
   */
  get alphaMod(): number {
    return SDL.getSurfaceAlphaMod(this.pointer);
  }

  /**
   * Set the blend mode used for blit operations.
   *
   * To copy a surface to another surface (or texture) without blending with the
   * existing data, the blendmode of the SOURCE surface should be set to
   * `SDL_BLENDMODE_NONE`.
   *
   * @param surface the SDL_Surface structure to update.
   * @param blendMode the SDL_BlendMode to use for blit blending.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function can be called on different threads with
   *               different surfaces.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_GetSurfaceBlendMode
   *
   * @from SDL_surface.h:941 bool SDL_SetSurfaceBlendMode(SDL_Surface *surface, SDL_BlendMode blendMode);
   */
  setBlendMode(blendMode: number): boolean {
    return SDL.setSurfaceBlendMode(this.pointer, blendMode);
  }

  /**
   * Get the blend mode used for blit operations.
   *
   * @param surface the SDL_Surface structure to query.
   * @param blendMode a pointer filled in with the current SDL_BlendMode.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety It is safe to call this function from any thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_SetSurfaceBlendMode
   *
   * @from SDL_surface.h:957 bool SDL_GetSurfaceBlendMode(SDL_Surface *surface, SDL_BlendMode *blendMode);
   */
  get blendMode(): number {
    return SDL.getSurfaceBlendMode(this.pointer);
  }

  /**
   * Set the clipping rectangle for a surface.
   *
   * When `surface` is the destination of a blit, only the area within the clip
   * rectangle is drawn into.
   *
   * Note that blits are automatically clipped to the edges of the source and
   * destination surfaces.
   *
   * @param surface the SDL_Surface structure to be clipped.
   * @param rect the SDL_Rect structure representing the clipping rectangle, or
   *             NULL to disable clipping.
   * @returns true if the rectangle intersects the surface, otherwise false and
   *          blits will be completely clipped.
   *
   * @threadsafety This function can be called on different threads with
   *               different surfaces.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_GetSurfaceClipRect
   *
   * @from SDL_surface.h:981 bool SDL_SetSurfaceClipRect(SDL_Surface *surface, const SDL_Rect *rect);
   */
  setClipRect(
    rect: { x: number; y: number; w: number; h: number } | null,
  ): boolean {
    return SDL.setSurfaceClipRect(this.pointer, rect);
  }

  /**
   * Get the clipping rectangle for a surface.
   *
   * When `surface` is the destination of a blit, only the area within the clip
   * rectangle is drawn into.
   *
   * @param surface the SDL_Surface structure representing the surface to be
   *                clipped.
   * @param rect an SDL_Rect structure filled in with the clipping rectangle for
   *             the surface.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function can be called on different threads with
   *               different surfaces.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_SetSurfaceClipRect
   *
   * @from SDL_surface.h:1003 bool SDL_GetSurfaceClipRect(SDL_Surface *surface, SDL_Rect *rect);
   */
  getClipRect(): { x: number; y: number; w: number; h: number } | null {
    return SDL.getSurfaceClipRect(this.pointer);
  }

  /**
   * Flip a surface vertically or horizontally.
   *
   * @param surface the surface to flip.
   * @param flip the direction to flip.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function can be called on different threads with
   *               different surfaces.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @from SDL_surface.h:1018 bool SDL_FlipSurface(SDL_Surface *surface, SDL_FlipMode flip);
   */
  flip(flip: number): boolean {
    return SDL.flipSurface(this.pointer, flip);
  }

  /**
   * Creates a new surface identical to the existing surface.
   *
   * If the original surface has alternate images, the new surface will have a
   * reference to them as well.
   *
   * The returned surface should be freed with SDL_DestroySurface().
   *
   * @param surface the surface to duplicate.
   * @returns a copy of the surface or NULL on failure; call SDL_GetError() for
   *          more information.
   *
   * @threadsafety This function can be called on different threads with
   *               different surfaces.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_DestroySurface
   *
   * @from SDL_surface.h:1068 SDL_Surface * SDL_DuplicateSurface(SDL_Surface *surface);
   */
  duplicate(): Surface {
    return Surface.of(SDL.duplicateSurface(this.pointer));
  }

  /**
   * Creates a new surface identical to the existing surface, scaled to the
   * desired size.
   *
   * The returned surface should be freed with SDL_DestroySurface().
   *
   * @param surface the surface to duplicate and scale.
   * @param width the width of the new surface.
   * @param height the height of the new surface.
   * @param scaleMode the SDL_ScaleMode to be used.
   * @returns a copy of the surface or NULL on failure; call SDL_GetError() for
   *          more information.
   *
   * @threadsafety This function can be called on different threads with
   *               different surfaces.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_DestroySurface
   *
   * @from SDL_surface.h:1090 SDL_Surface * SDL_ScaleSurface(SDL_Surface *surface, int width, int height, SDL_ScaleMode scaleMode);
   */
  scale(
    width: number,
    height: number,
    scaleMode: number,
  ): Surface {
    return Surface.of(SDL.scaleSurface(this.pointer, width, height, scaleMode));
  }

  /**
   * Copy an existing surface to a new surface of the specified format.
   *
   * This function is used to optimize images for faster *repeat* blitting. This
   * is accomplished by converting the original and storing the result as a new
   * surface. The new, optimized surface can then be used as the source for
   * future blits, making them faster.
   *
   * If you are converting to an indexed surface and want to map colors to a
   * palette, you can use SDL_ConvertSurfaceAndColorspace() instead.
   *
   * If the original surface has alternate images, the new surface will have a
   * reference to them as well.
   *
   * @param surface the existing SDL_Surface structure to convert.
   * @param format the new pixel format.
   * @returns the new SDL_Surface structure that is created or NULL on failure;
   *          call SDL_GetError() for more information.
   *
   * @threadsafety This function can be called on different threads with
   *               different surfaces.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_ConvertSurfaceAndColorspace
   * @sa SDL_DestroySurface
   *
   * @from SDL_surface.h:1119 SDL_Surface * SDL_ConvertSurface(SDL_Surface *surface, SDL_PixelFormat format);
   */
  convert(format: number): Surface {
    return Surface.of(SDL.convertSurface(this.pointer, format));
  }

  /**
   * Copy an existing surface to a new surface of the specified format and
   * colorspace.
   *
   * This function converts an existing surface to a new format and colorspace
   * and returns the new surface. This will perform any pixel format and
   * colorspace conversion needed.
   *
   * If the original surface has alternate images, the new surface will have a
   * reference to them as well.
   *
   * @param surface the existing SDL_Surface structure to convert.
   * @param format the new pixel format.
   * @param palette an optional palette to use for indexed formats, may be NULL.
   * @param colorspace the new colorspace.
   * @param props an SDL_PropertiesID with additional color properties, or 0.
   * @returns the new SDL_Surface structure that is created or NULL on failure;
   *          call SDL_GetError() for more information.
   *
   * @threadsafety This function can be called on different threads with
   *               different surfaces.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_ConvertSurface
   * @sa SDL_DestroySurface
   *
   * @from SDL_surface.h:1148 SDL_Surface * SDL_ConvertSurfaceAndColorspace(SDL_Surface *surface, SDL_PixelFormat format, SDL_Palette *palette, SDL_Colorspace colorspace, SDL_PropertiesID props);
   */
  convertAndColorspace(
    format: number,
    palette: Deno.PointerValue<"SDL_Palette">,
    colorspace: number,
    props: number,
  ): Surface {
    return Surface.of(
      SDL.convertSurfaceAndColorspace(
        this.pointer,
        format,
        palette,
        colorspace,
        props,
      ),
    );
  }

  /**
   * Copy a block of pixels of one format to another format.
   *
   * @param width the width of the block to copy, in pixels.
   * @param height the height of the block to copy, in pixels.
   * @param src_format an SDL_PixelFormat value of the `src` pixels format.
   * @param src a pointer to the source pixels.
   * @param src_pitch the pitch of the source pixels, in bytes.
   * @param dst_format an SDL_PixelFormat value of the `dst` pixels format.
   * @param dst a pointer to be filled in with new pixel data.
   * @param dst_pitch the pitch of the destination pixels, in bytes.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety The same destination pixels should not be used from two
   *               threads at once. It is safe to use the same source pixels
   *               from multiple threads.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_ConvertPixelsAndColorspace
   *
   * @from SDL_surface.h:1172 bool SDL_ConvertPixels(int width, int height, SDL_PixelFormat src_format, const void *src, int src_pitch, SDL_PixelFormat dst_format, void *dst, int dst_pitch);
   */
  static convertPixels(
    width: number,
    height: number,
    src_format: number,
    src: Deno.PointerValue,
    src_pitch: number,
    dst_format: number,
    dst: Deno.PointerValue,
    dst_pitch: number,
  ): boolean {
    return SDL.convertPixels(
      width,
      height,
      src_format,
      src,
      src_pitch,
      dst_format,
      dst,
      dst_pitch,
    );
  }

  /**
   * Copy a block of pixels of one format and colorspace to another format and
   * colorspace.
   *
   * @param width the width of the block to copy, in pixels.
   * @param height the height of the block to copy, in pixels.
   * @param src_format an SDL_PixelFormat value of the `src` pixels format.
   * @param src_colorspace an SDL_Colorspace value describing the colorspace of
   *                       the `src` pixels.
   * @param src_properties an SDL_PropertiesID with additional source color
   *                       properties, or 0.
   * @param src a pointer to the source pixels.
   * @param src_pitch the pitch of the source pixels, in bytes.
   * @param dst_format an SDL_PixelFormat value of the `dst` pixels format.
   * @param dst_colorspace an SDL_Colorspace value describing the colorspace of
   *                       the `dst` pixels.
   * @param dst_properties an SDL_PropertiesID with additional destination color
   *                       properties, or 0.
   * @param dst a pointer to be filled in with new pixel data.
   * @param dst_pitch the pitch of the destination pixels, in bytes.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety The same destination pixels should not be used from two
   *               threads at once. It is safe to use the same source pixels
   *               from multiple threads.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_ConvertPixels
   *
   * @from SDL_surface.h:1205 bool SDL_ConvertPixelsAndColorspace(int width, int height, SDL_PixelFormat src_format, SDL_Colorspace src_colorspace, SDL_PropertiesID src_properties, const void *src, int src_pitch, SDL_PixelFormat dst_format, SDL_Colorspace dst_colorspace, SDL_PropertiesID dst_properties, void *dst, int dst_pitch);
   */
  static convertPixelsAndColorspace(
    width: number,
    height: number,
    src_format: number,
    src_colorspace: number,
    src_properties: number,
    src: Deno.PointerValue,
    src_pitch: number,
    dst_format: number,
    dst_colorspace: number,
    dst_properties: number,
    dst: Deno.PointerValue,
    dst_pitch: number,
  ): boolean {
    return SDL.convertPixelsAndColorspace(
      width,
      height,
      src_format,
      src_colorspace,
      src_properties,
      src,
      src_pitch,
      dst_format,
      dst_colorspace,
      dst_properties,
      dst,
      dst_pitch,
    );
  }

  /**
   * Premultiply the alpha on a block of pixels.
   *
   * This is safe to use with src == dst, but not for other overlapping areas.
   *
   * @param width the width of the block to convert, in pixels.
   * @param height the height of the block to convert, in pixels.
   * @param src_format an SDL_PixelFormat value of the `src` pixels format.
   * @param src a pointer to the source pixels.
   * @param src_pitch the pitch of the source pixels, in bytes.
   * @param dst_format an SDL_PixelFormat value of the `dst` pixels format.
   * @param dst a pointer to be filled in with premultiplied pixel data.
   * @param dst_pitch the pitch of the destination pixels, in bytes.
   * @param linear true to convert from sRGB to linear space for the alpha
   *               multiplication, false to do multiplication in sRGB space.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety The same destination pixels should not be used from two
   *               threads at once. It is safe to use the same source pixels
   *               from multiple threads.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @from SDL_surface.h:1231 bool SDL_PremultiplyAlpha(int width, int height, SDL_PixelFormat src_format, const void *src, int src_pitch, SDL_PixelFormat dst_format, void *dst, int dst_pitch, bool linear);
   */
  static premultiplyAlpha(
    width: number,
    height: number,
    src_format: number,
    src: Deno.PointerValue,
    src_pitch: number,
    dst_format: number,
    dst: Deno.PointerValue,
    dst_pitch: number,
    linear: boolean,
  ): boolean {
    return SDL.premultiplyAlpha(
      width,
      height,
      src_format,
      src,
      src_pitch,
      dst_format,
      dst,
      dst_pitch,
      linear,
    );
  }

  /**
   * Premultiply the alpha in a surface.
   *
   * This is safe to use with src == dst, but not for other overlapping areas.
   *
   * @param surface the surface to modify.
   * @param linear true to convert from sRGB to linear space for the alpha
   *               multiplication, false to do multiplication in sRGB space.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function can be called on different threads with
   *               different surfaces.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @from SDL_surface.h:1249 bool SDL_PremultiplySurfaceAlpha(SDL_Surface *surface, bool linear);
   */
  premultiplyAlpha(linear: boolean): boolean {
    return SDL.premultiplySurfaceAlpha(this.pointer, linear);
  }

  /**
   * Clear a surface with a specific color, with floating point precision.
   *
   * This function handles all surface formats, and ignores any clip rectangle.
   *
   * If the surface is YUV, the color is assumed to be in the sRGB colorspace,
   * otherwise the color is assumed to be in the colorspace of the surface.
   *
   * @param surface the SDL_Surface to clear.
   * @param r the red component of the pixel, normally in the range 0-1.
   * @param g the green component of the pixel, normally in the range 0-1.
   * @param b the blue component of the pixel, normally in the range 0-1.
   * @param a the alpha component of the pixel, normally in the range 0-1.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function can be called on different threads with
   *               different surfaces.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @from SDL_surface.h:1272 bool SDL_ClearSurface(SDL_Surface *surface, float r, float g, float b, float a);
   */
  clear(
    r: number,
    g: number,
    b: number,
    a: number,
  ): boolean {
    return SDL.clearSurface(this.pointer, r, g, b, a);
  }

  /**
   * Perform a fast fill of a rectangle with a specific color.
   *
   * `color` should be a pixel of the format used by the surface, and can be
   * generated by SDL_MapRGB() or SDL_MapRGBA(). If the color value contains an
   * alpha component then the destination is simply filled with that alpha
   * information, no blending takes place.
   *
   * If there is a clip rectangle set on the destination (set via
   * SDL_SetSurfaceClipRect()), then this function will fill based on the
   * intersection of the clip rectangle and `rect`.
   *
   * @param dst the SDL_Surface structure that is the drawing target.
   * @param rect the SDL_Rect structure representing the rectangle to fill, or
   *             NULL to fill the entire surface.
   * @param color the color to fill with.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function can be called on different threads with
   *               different surfaces.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_FillSurfaceRects
   *
   * @from SDL_surface.h:1300 bool SDL_FillSurfaceRect(SDL_Surface *dst, const SDL_Rect *rect, Uint32 color);
   */
  fillRect(
    rect: { x: number; y: number; w: number; h: number } | null,
    color: number,
  ): boolean {
    return SDL.fillSurfaceRect(this.pointer, rect, color);
  }

  /**
   * Perform a fast fill of a set of rectangles with a specific color.
   *
   * `color` should be a pixel of the format used by the surface, and can be
   * generated by SDL_MapRGB() or SDL_MapRGBA(). If the color value contains an
   * alpha component then the destination is simply filled with that alpha
   * information, no blending takes place.
   *
   * If there is a clip rectangle set on the destination (set via
   * SDL_SetSurfaceClipRect()), then this function will fill based on the
   * intersection of the clip rectangle and `rect`.
   *
   * @param dst the SDL_Surface structure that is the drawing target.
   * @param rects an array of SDL_Rects representing the rectangles to fill.
   * @param count the number of rectangles in the array.
   * @param color the color to fill with.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function can be called on different threads with
   *               different surfaces.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_FillSurfaceRect
   *
   * @from SDL_surface.h:1328 bool SDL_FillSurfaceRects(SDL_Surface *dst, const SDL_Rect *rects, int count, Uint32 color);
   */
  fillRects(
    rects: { x: number; y: number; w: number; h: number } | null,
    count: number,
    color: number,
  ): boolean {
    return SDL.fillSurfaceRects(this.pointer, rects, count, color);
  }

  /**
   * Performs a fast blit from the source surface to the destination surface
   * with clipping.
   *
   * If either `srcrect` or `dstrect` are NULL, the entire surface (`src` or
   * `dst`) is copied while ensuring clipping to `dst->clip_rect`.
   *
   * The blit function should not be called on a locked surface.
   *
   * The blit semantics for surfaces with and without blending and colorkey are
   * defined as follows:
   *
   * ```
   *    RGBA->RGB:
   *      Source surface blend mode set to SDL_BLENDMODE_BLEND:
   *       alpha-blend (using the source alpha-channel and per-surface alpha)
   *       SDL_SRCCOLORKEY ignored.
   *     Source surface blend mode set to SDL_BLENDMODE_NONE:
   *       copy RGB.
   *       if SDL_SRCCOLORKEY set, only copy the pixels that do not match the
   *       RGB values of the source color key, ignoring alpha in the
   *       comparison.
   *
   *   RGB->RGBA:
   *     Source surface blend mode set to SDL_BLENDMODE_BLEND:
   *       alpha-blend (using the source per-surface alpha)
   *     Source surface blend mode set to SDL_BLENDMODE_NONE:
   *       copy RGB, set destination alpha to source per-surface alpha value.
   *     both:
   *       if SDL_SRCCOLORKEY set, only copy the pixels that do not match the
   *       source color key.
   *
   *   RGBA->RGBA:
   *     Source surface blend mode set to SDL_BLENDMODE_BLEND:
   *       alpha-blend (using the source alpha-channel and per-surface alpha)
   *       SDL_SRCCOLORKEY ignored.
   *     Source surface blend mode set to SDL_BLENDMODE_NONE:
   *       copy all of RGBA to the destination.
   *       if SDL_SRCCOLORKEY set, only copy the pixels that do not match the
   *       RGB values of the source color key, ignoring alpha in the
   *       comparison.
   *
   *   RGB->RGB:
   *     Source surface blend mode set to SDL_BLENDMODE_BLEND:
   *       alpha-blend (using the source per-surface alpha)
   *     Source surface blend mode set to SDL_BLENDMODE_NONE:
   *       copy RGB.
   *     both:
   *       if SDL_SRCCOLORKEY set, only copy the pixels that do not match the
   *       source color key.
   * ```
   *
   * @param src the SDL_Surface structure to be copied from.
   * @param srcrect the SDL_Rect structure representing the rectangle to be
   *                copied, or NULL to copy the entire surface.
   * @param dst the SDL_Surface structure that is the blit target.
   * @param dstrect the SDL_Rect structure representing the x and y position in
   *                the destination surface, or NULL for (0,0). The width and
   *                height are ignored, and are copied from `srcrect`. If you
   *                want a specific width and height, you should use
   *                SDL_BlitSurfaceScaled().
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety Only one thread should be using the `src` and `dst` surfaces
   *               at any given time.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_BlitSurfaceScaled
   *
   * @from SDL_surface.h:1401 bool SDL_BlitSurface(SDL_Surface *src, const SDL_Rect *srcrect, SDL_Surface *dst, const SDL_Rect *dstrect);
   */
  blit(
    srcrect: { x: number; y: number; w: number; h: number } | null,
    dst: Deno.PointerValue<"SDL_Surface">,
    dstrect: { x: number; y: number; w: number; h: number } | null,
  ): boolean {
    return SDL.blitSurface(this.pointer, srcrect, dst, dstrect);
  }

  /**
   * Perform low-level surface blitting only.
   *
   * This is a semi-private blit function and it performs low-level surface
   * blitting, assuming the input rectangles have already been clipped.
   *
   * @param src the SDL_Surface structure to be copied from.
   * @param srcrect the SDL_Rect structure representing the rectangle to be
   *                copied, may not be NULL.
   * @param dst the SDL_Surface structure that is the blit target.
   * @param dstrect the SDL_Rect structure representing the target rectangle in
   *                the destination surface, may not be NULL.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety Only one thread should be using the `src` and `dst` surfaces
   *               at any given time.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_BlitSurface
   *
   * @from SDL_surface.h:1425 bool SDL_BlitSurfaceUnchecked(SDL_Surface *src, const SDL_Rect *srcrect, SDL_Surface *dst, const SDL_Rect *dstrect);
   */
  blitUnchecked(
    srcrect: { x: number; y: number; w: number; h: number } | null,
    dst: Deno.PointerValue<"SDL_Surface">,
    dstrect: { x: number; y: number; w: number; h: number } | null,
  ): boolean {
    return SDL.blitSurfaceUnchecked(this.pointer, srcrect, dst, dstrect);
  }

  /**
   * Perform a scaled blit to a destination surface, which may be of a different
   * format.
   *
   * @param src the SDL_Surface structure to be copied from.
   * @param srcrect the SDL_Rect structure representing the rectangle to be
   *                copied, or NULL to copy the entire surface.
   * @param dst the SDL_Surface structure that is the blit target.
   * @param dstrect the SDL_Rect structure representing the target rectangle in
   *                the destination surface, or NULL to fill the entire
   *                destination surface.
   * @param scaleMode the SDL_ScaleMode to be used.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety Only one thread should be using the `src` and `dst` surfaces
   *               at any given time.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_BlitSurface
   *
   * @from SDL_surface.h:1449 bool SDL_BlitSurfaceScaled(SDL_Surface *src, const SDL_Rect *srcrect, SDL_Surface *dst, const SDL_Rect *dstrect, SDL_ScaleMode scaleMode);
   */
  blitScaled(
    srcrect: { x: number; y: number; w: number; h: number } | null,
    dst: Deno.PointerValue<"SDL_Surface">,
    dstrect: { x: number; y: number; w: number; h: number } | null,
    scaleMode: number,
  ): boolean {
    return SDL.blitSurfaceScaled(
      this.pointer,
      srcrect,
      dst,
      dstrect,
      scaleMode,
    );
  }

  /**
   * Perform low-level surface scaled blitting only.
   *
   * This is a semi-private function and it performs low-level surface blitting,
   * assuming the input rectangles have already been clipped.
   *
   * @param src the SDL_Surface structure to be copied from.
   * @param srcrect the SDL_Rect structure representing the rectangle to be
   *                copied, may not be NULL.
   * @param dst the SDL_Surface structure that is the blit target.
   * @param dstrect the SDL_Rect structure representing the target rectangle in
   *                the destination surface, may not be NULL.
   * @param scaleMode the SDL_ScaleMode to be used.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety Only one thread should be using the `src` and `dst` surfaces
   *               at any given time.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_BlitSurfaceScaled
   *
   * @from SDL_surface.h:1474 bool SDL_BlitSurfaceUncheckedScaled(SDL_Surface *src, const SDL_Rect *srcrect, SDL_Surface *dst, const SDL_Rect *dstrect, SDL_ScaleMode scaleMode);
   */
  blitUncheckedScaled(
    srcrect: { x: number; y: number; w: number; h: number } | null,
    dst: Deno.PointerValue<"SDL_Surface">,
    dstrect: { x: number; y: number; w: number; h: number } | null,
    scaleMode: number,
  ): boolean {
    return SDL.blitSurfaceUncheckedScaled(
      this.pointer,
      srcrect,
      dst,
      dstrect,
      scaleMode,
    );
  }

  /**
   * Perform a stretched pixel copy from one surface to another.
   *
   * @param src the SDL_Surface structure to be copied from.
   * @param srcrect the SDL_Rect structure representing the rectangle to be
   *                copied, or NULL to copy the entire surface.
   * @param dst the SDL_Surface structure that is the blit target.
   * @param dstrect the SDL_Rect structure representing the target rectangle in
   *                the destination surface, or NULL to fill the entire
   *                destination surface.
   * @param scaleMode the SDL_ScaleMode to be used.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety Only one thread should be using the `src` and `dst` surfaces
   *               at any given time.
   *
   * @since This function is available since SDL 3.4.0.
   *
   * @sa SDL_BlitSurfaceScaled
   *
   * @from SDL_surface.h:1497 bool SDL_StretchSurface(SDL_Surface *src, const SDL_Rect *srcrect, SDL_Surface *dst, const SDL_Rect *dstrect, SDL_ScaleMode scaleMode);
   */
  stretch(
    srcrect: { x: number; y: number; w: number; h: number } | null,
    dst: Deno.PointerValue<"SDL_Surface">,
    dstrect: { x: number; y: number; w: number; h: number } | null,
    scaleMode: number,
  ): boolean {
    return SDL.stretchSurface(this.pointer, srcrect, dst, dstrect, scaleMode);
  }

  /**
   * Perform a tiled blit to a destination surface, which may be of a different
   * format.
   *
   * The pixels in `srcrect` will be repeated as many times as needed to
   * completely fill `dstrect`.
   *
   * @param src the SDL_Surface structure to be copied from.
   * @param srcrect the SDL_Rect structure representing the rectangle to be
   *                copied, or NULL to copy the entire surface.
   * @param dst the SDL_Surface structure that is the blit target.
   * @param dstrect the SDL_Rect structure representing the target rectangle in
   *                the destination surface, or NULL to fill the entire surface.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety Only one thread should be using the `src` and `dst` surfaces
   *               at any given time.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_BlitSurface
   *
   * @from SDL_surface.h:1522 bool SDL_BlitSurfaceTiled(SDL_Surface *src, const SDL_Rect *srcrect, SDL_Surface *dst, const SDL_Rect *dstrect);
   */
  blitTiled(
    srcrect: { x: number; y: number; w: number; h: number } | null,
    dst: Deno.PointerValue<"SDL_Surface">,
    dstrect: { x: number; y: number; w: number; h: number } | null,
  ): boolean {
    return SDL.blitSurfaceTiled(this.pointer, srcrect, dst, dstrect);
  }

  /**
   * Perform a scaled and tiled blit to a destination surface, which may be of a
   * different format.
   *
   * The pixels in `srcrect` will be scaled and repeated as many times as needed
   * to completely fill `dstrect`.
   *
   * @param src the SDL_Surface structure to be copied from.
   * @param srcrect the SDL_Rect structure representing the rectangle to be
   *                copied, or NULL to copy the entire surface.
   * @param scale the scale used to transform srcrect into the destination
   *              rectangle, e.g. a 32x32 texture with a scale of 2 would fill
   *              64x64 tiles.
   * @param scaleMode scale algorithm to be used.
   * @param dst the SDL_Surface structure that is the blit target.
   * @param dstrect the SDL_Rect structure representing the target rectangle in
   *                the destination surface, or NULL to fill the entire surface.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety Only one thread should be using the `src` and `dst` surfaces
   *               at any given time.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_BlitSurface
   *
   * @from SDL_surface.h:1551 bool SDL_BlitSurfaceTiledWithScale(SDL_Surface *src, const SDL_Rect *srcrect, float scale, SDL_ScaleMode scaleMode, SDL_Surface *dst, const SDL_Rect *dstrect);
   */
  blitTiledWithScale(
    srcrect: { x: number; y: number; w: number; h: number } | null,
    scale: number,
    scaleMode: number,
    dst: Deno.PointerValue<"SDL_Surface">,
    dstrect: { x: number; y: number; w: number; h: number } | null,
  ): boolean {
    return SDL.blitSurfaceTiledWithScale(
      this.pointer,
      srcrect,
      scale,
      scaleMode,
      dst,
      dstrect,
    );
  }

  /**
   * Perform a scaled blit using the 9-grid algorithm to a destination surface,
   * which may be of a different format.
   *
   * The pixels in the source surface are split into a 3x3 grid, using the
   * different corner sizes for each corner, and the sides and center making up
   * the remaining pixels. The corners are then scaled using `scale` and fit
   * into the corners of the destination rectangle. The sides and center are
   * then stretched into place to cover the remaining destination rectangle.
   *
   * @param src the SDL_Surface structure to be copied from.
   * @param srcrect the SDL_Rect structure representing the rectangle to be used
   *                for the 9-grid, or NULL to use the entire surface.
   * @param left_width the width, in pixels, of the left corners in `srcrect`.
   * @param right_width the width, in pixels, of the right corners in `srcrect`.
   * @param top_height the height, in pixels, of the top corners in `srcrect`.
   * @param bottom_height the height, in pixels, of the bottom corners in
   *                      `srcrect`.
   * @param scale the scale used to transform the corner of `srcrect` into the
   *              corner of `dstrect`, or 0.0f for an unscaled blit.
   * @param scaleMode scale algorithm to be used.
   * @param dst the SDL_Surface structure that is the blit target.
   * @param dstrect the SDL_Rect structure representing the target rectangle in
   *                the destination surface, or NULL to fill the entire surface.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety Only one thread should be using the `src` and `dst` surfaces
   *               at any given time.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_BlitSurface
   *
   * @from SDL_surface.h:1587 bool SDL_BlitSurface9Grid(SDL_Surface *src, const SDL_Rect *srcrect, int left_width, int right_width, int top_height, int bottom_height, float scale, SDL_ScaleMode scaleMode, SDL_Surface *dst, const SDL_Rect *dstrect);
   */
  blit9Grid(
    srcrect: { x: number; y: number; w: number; h: number } | null,
    left_width: number,
    right_width: number,
    top_height: number,
    bottom_height: number,
    scale: number,
    scaleMode: number,
    dst: Deno.PointerValue<"SDL_Surface">,
    dstrect: { x: number; y: number; w: number; h: number } | null,
  ): boolean {
    return SDL.blitSurface9Grid(
      this.pointer,
      srcrect,
      left_width,
      right_width,
      top_height,
      bottom_height,
      scale,
      scaleMode,
      dst,
      dstrect,
    );
  }

  /**
   * Map an RGB triple to an opaque pixel value for a surface.
   *
   * This function maps the RGB color value to the specified pixel format and
   * returns the pixel value best approximating the given RGB color value for
   * the given pixel format.
   *
   * If the surface has a palette, the index of the closest matching color in
   * the palette will be returned.
   *
   * If the surface pixel format has an alpha component it will be returned as
   * all 1 bits (fully opaque).
   *
   * If the pixel format bpp (color depth) is less than 32-bpp then the unused
   * upper bits of the return value can safely be ignored (e.g., with a 16-bpp
   * format the return value can be assigned to a Uint16, and similarly a Uint8
   * for an 8-bpp format).
   *
   * @param surface the surface to use for the pixel format and palette.
   * @param r the red component of the pixel in the range 0-255.
   * @param g the green component of the pixel in the range 0-255.
   * @param b the blue component of the pixel in the range 0-255.
   * @returns a pixel value.
   *
   * @threadsafety This function can be called on different threads with
   *               different surfaces.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_MapSurfaceRGBA
   *
   * @from SDL_surface.h:1620 Uint32 SDL_MapSurfaceRGB(SDL_Surface *surface, Uint8 r, Uint8 g, Uint8 b);
   */
  mapRgb(
    r: number,
    g: number,
    b: number,
  ): number {
    return SDL.mapSurfaceRgb(this.pointer, r, g, b);
  }

  /**
   * Map an RGBA quadruple to a pixel value for a surface.
   *
   * This function maps the RGBA color value to the specified pixel format and
   * returns the pixel value best approximating the given RGBA color value for
   * the given pixel format.
   *
   * If the surface pixel format has no alpha component the alpha value will be
   * ignored (as it will be in formats with a palette).
   *
   * If the surface has a palette, the index of the closest matching color in
   * the palette will be returned.
   *
   * If the pixel format bpp (color depth) is less than 32-bpp then the unused
   * upper bits of the return value can safely be ignored (e.g., with a 16-bpp
   * format the return value can be assigned to a Uint16, and similarly a Uint8
   * for an 8-bpp format).
   *
   * @param surface the surface to use for the pixel format and palette.
   * @param r the red component of the pixel in the range 0-255.
   * @param g the green component of the pixel in the range 0-255.
   * @param b the blue component of the pixel in the range 0-255.
   * @param a the alpha component of the pixel in the range 0-255.
   * @returns a pixel value.
   *
   * @threadsafety This function can be called on different threads with
   *               different surfaces.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_MapSurfaceRGB
   *
   * @from SDL_surface.h:1654 Uint32 SDL_MapSurfaceRGBA(SDL_Surface *surface, Uint8 r, Uint8 g, Uint8 b, Uint8 a);
   */
  mapRgba(
    r: number,
    g: number,
    b: number,
    a: number,
  ): number {
    return SDL.mapSurfaceRgba(this.pointer, r, g, b, a);
  }

  /**
   * Retrieves a single pixel from a surface.
   *
   * This function prioritizes correctness over speed: it is suitable for unit
   * tests, but is not intended for use in a game engine.
   *
   * Like SDL_GetRGBA, this uses the entire 0..255 range when converting color
   * components from pixel formats with less than 8 bits per RGB component.
   *
   * @param surface the surface to read.
   * @param x the horizontal coordinate, 0 <= x < width.
   * @param y the vertical coordinate, 0 <= y < height.
   * @param r a pointer filled in with the red channel, 0-255, or NULL to ignore
   *          this channel.
   * @param g a pointer filled in with the green channel, 0-255, or NULL to
   *          ignore this channel.
   * @param b a pointer filled in with the blue channel, 0-255, or NULL to
   *          ignore this channel.
   * @param a a pointer filled in with the alpha channel, 0-255, or NULL to
   *          ignore this channel.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function can be called on different threads with
   *               different surfaces.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @from SDL_surface.h:1684 bool SDL_ReadSurfacePixel(SDL_Surface *surface, int x, int y, Uint8 *r, Uint8 *g, Uint8 *b, Uint8 *a);
   */
  readPixel(
    x: number,
    y: number,
  ): { r: number; g: number; b: number; a: number } {
    return SDL.readSurfacePixel(this.pointer, x, y);
  }

  /**
   * Retrieves a single pixel from a surface.
   *
   * This function prioritizes correctness over speed: it is suitable for unit
   * tests, but is not intended for use in a game engine.
   *
   * @param surface the surface to read.
   * @param x the horizontal coordinate, 0 <= x < width.
   * @param y the vertical coordinate, 0 <= y < height.
   * @param r a pointer filled in with the red channel, normally in the range
   *          0-1, or NULL to ignore this channel.
   * @param g a pointer filled in with the green channel, normally in the range
   *          0-1, or NULL to ignore this channel.
   * @param b a pointer filled in with the blue channel, normally in the range
   *          0-1, or NULL to ignore this channel.
   * @param a a pointer filled in with the alpha channel, normally in the range
   *          0-1, or NULL to ignore this channel.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function can be called on different threads with
   *               different surfaces.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @from SDL_surface.h:1711 bool SDL_ReadSurfacePixelFloat(SDL_Surface *surface, int x, int y, float *r, float *g, float *b, float *a);
   */
  readPixelFloat(
    x: number,
    y: number,
  ): { r: number; g: number; b: number; a: number } {
    return SDL.readSurfacePixelFloat(this.pointer, x, y);
  }

  /**
   * Writes a single pixel to a surface.
   *
   * This function prioritizes correctness over speed: it is suitable for unit
   * tests, but is not intended for use in a game engine.
   *
   * Like SDL_MapRGBA, this uses the entire 0..255 range when converting color
   * components from pixel formats with less than 8 bits per RGB component.
   *
   * @param surface the surface to write.
   * @param x the horizontal coordinate, 0 <= x < width.
   * @param y the vertical coordinate, 0 <= y < height.
   * @param r the red channel value, 0-255.
   * @param g the green channel value, 0-255.
   * @param b the blue channel value, 0-255.
   * @param a the alpha channel value, 0-255.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function can be called on different threads with
   *               different surfaces.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @from SDL_surface.h:1737 bool SDL_WriteSurfacePixel(SDL_Surface *surface, int x, int y, Uint8 r, Uint8 g, Uint8 b, Uint8 a);
   */
  writePixel(
    x: number,
    y: number,
    r: number,
    g: number,
    b: number,
    a: number,
  ): boolean {
    return SDL.writeSurfacePixel(this.pointer, x, y, r, g, b, a);
  }

  /**
   * Writes a single pixel to a surface.
   *
   * This function prioritizes correctness over speed: it is suitable for unit
   * tests, but is not intended for use in a game engine.
   *
   * @param surface the surface to write.
   * @param x the horizontal coordinate, 0 <= x < width.
   * @param y the vertical coordinate, 0 <= y < height.
   * @param r the red channel value, normally in the range 0-1.
   * @param g the green channel value, normally in the range 0-1.
   * @param b the blue channel value, normally in the range 0-1.
   * @param a the alpha channel value, normally in the range 0-1.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function can be called on different threads with
   *               different surfaces.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @from SDL_surface.h:1760 bool SDL_WriteSurfacePixelFloat(SDL_Surface *surface, int x, int y, float r, float g, float b, float a);
   */
  writePixelFloat(
    x: number,
    y: number,
    r: number,
    g: number,
    b: number,
    a: number,
  ): boolean {
    return SDL.writeSurfacePixelFloat(this.pointer, x, y, r, g, b, a);
  }
}

import config from "./user_config_loader.ts";
import { exists } from "@std/fs";

if (await exists(config.SDL3_image)) {
  await Surface.enableImageLib();
}
