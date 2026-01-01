/**
 * # CategoryPixels
 *
 * SDL offers facilities for pixel management.
 *
 * Largely these facilities deal with pixel _format_: what does this set of
 * bits represent?
 *
 * If you mostly want to think of a pixel as some combination of red, green,
 * blue, and maybe alpha intensities, this is all pretty straightforward, and
 * in many cases, is enough information to build a perfectly fine game.
 *
 * However, the actual definition of a pixel is more complex than that:
 *
 * Pixels are a representation of a color in a particular color space.
 *
 * The first characteristic of a color space is the color type. SDL
 * understands two different color types, RGB and YCbCr, or in SDL also
 * referred to as YUV.
 *
 * RGB colors consist of red, green, and blue channels of color that are added
 * together to represent the colors we see on the screen.
 *
 * https://en.wikipedia.org/wiki/RGB_color_model
 *
 * YCbCr colors represent colors as a Y luma brightness component and red and
 * blue chroma color offsets. This color representation takes advantage of the
 * fact that the human eye is more sensitive to brightness than the color in
 * an image. The Cb and Cr components are often compressed and have lower
 * resolution than the luma component.
 *
 * https://en.wikipedia.org/wiki/YCbCr
 *
 * When the color information in YCbCr is compressed, the Y pixels are left at
 * full resolution and each Cr and Cb pixel represents an average of the color
 * information in a block of Y pixels. The chroma location determines where in
 * that block of pixels the color information is coming from.
 *
 * The color range defines how much of the pixel to use when converting a
 * pixel into a color on the display. When the full color range is used, the
 * entire numeric range of the pixel bits is significant. When narrow color
 * range is used, for historical reasons, the pixel uses only a portion of the
 * numeric range to represent colors.
 *
 * The color primaries and white point are a definition of the colors in the
 * color space relative to the standard XYZ color space.
 *
 * https://en.wikipedia.org/wiki/CIE_1931_color_space
 *
 * The transfer characteristic, or opto-electrical transfer function (OETF),
 * is the way a color is converted from mathematically linear space into a
 * non-linear output signals.
 *
 * https://en.wikipedia.org/wiki/Rec._709#Transfer_characteristics
 *
 * The matrix coefficients are used to convert between YCbCr and RGB colors.
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

import { lib } from "./lib.ts";
import * as _p from "@g9wp/ptr";


export {
  SDL_PixelType as PIXELTYPE,
  SDL_BitmapOrder as BITMAPORDER,
  SDL_PackedOrder as PACKEDORDER,
  SDL_ArrayOrder as ARRAYORDER,
  SDL_PackedLayout as PACKEDLAYOUT,
  SDL_PixelFormat as PIXELFORMAT,
  SDL_ColorType as COLOR_TYPE,
  SDL_ColorRange as COLOR_RANGE,
  SDL_ColorPrimaries as COLOR_PRIMARIES,
  SDL_TransferCharacteristics as TRANSFER_CHARACTERISTICS,
  SDL_MatrixCoefficients as MATRIX_COEFFICIENTS,
  SDL_ChromaLocation as CHROMA_LOCATION,
  SDL_Colorspace as COLORSPACE,
} from "../enums/SDL_pixels.ts"

/**
 * Get the human readable name of a pixel format.
 *
 * @param format the pixel format to query.
 * @returns the human readable name of the specified pixel format or
 *          "SDL_PIXELFORMAT_UNKNOWN" if the format isn't recognized.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_pixels.h:1184 const char * SDL_GetPixelFormatName(SDL_PixelFormat format);
 */
export function getPixelFormatName(format: number): string {
  return _p.getCstr2(lib.symbols.SDL_GetPixelFormatName(format));
}

/**
 * Convert one of the enumerated pixel formats to a bpp value and RGBA masks.
 *
 * @param format one of the SDL_PixelFormat values.
 * @param bpp a bits per pixel value; usually 15, 16, or 32.
 * @param Rmask a pointer filled in with the red mask for the format.
 * @param Gmask a pointer filled in with the green mask for the format.
 * @param Bmask a pointer filled in with the blue mask for the format.
 * @param Amask a pointer filled in with the alpha mask for the format.
 * @returns true on success or false on failure; call SDL_GetError() for more
 *          information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetPixelFormatForMasks
 *
 * @from SDL_pixels.h:1204 bool SDL_GetMasksForPixelFormat(SDL_PixelFormat format, int *bpp, Uint32 *Rmask, Uint32 *Gmask, Uint32 *Bmask, Uint32 *Amask);
 */
export function getMasksForPixelFormat(format: number): { bpp: number; Rmask: number; Gmask: number; Bmask: number; Amask: number } {
  if(!lib.symbols.SDL_GetMasksForPixelFormat(format, _p.i32.p0, _p.u32.p0, _p.u32.p1, _p.u32.p2, _p.u32.p3))
    throw new Error(`SDL_GetMasksForPixelFormat: ${_p.getCstr2(lib.symbols.SDL_GetError())}`);
  return { bpp: _p.i32.v0, Rmask: _p.u32.v0, Gmask: _p.u32.v1, Bmask: _p.u32.v2, Amask: _p.u32.v3 };
}

/**
 * Convert a bpp value and RGBA masks to an enumerated pixel format.
 *
 * This will return `SDL_PIXELFORMAT_UNKNOWN` if the conversion wasn't
 * possible.
 *
 * @param bpp a bits per pixel value; usually 15, 16, or 32.
 * @param Rmask the red mask for the format.
 * @param Gmask the green mask for the format.
 * @param Bmask the blue mask for the format.
 * @param Amask the alpha mask for the format.
 * @returns the SDL_PixelFormat value corresponding to the format masks, or
 *          SDL_PIXELFORMAT_UNKNOWN if there isn't a match.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetMasksForPixelFormat
 *
 * @from SDL_pixels.h:1226 SDL_PixelFormat SDL_GetPixelFormatForMasks(int bpp, Uint32 Rmask, Uint32 Gmask, Uint32 Bmask, Uint32 Amask);
 */
export function getPixelFormatForMasks(
    bpp: number,
    Rmask: number,
    Gmask: number,
    Bmask: number,
    Amask: number,
): number {
  return lib.symbols.SDL_GetPixelFormatForMasks(bpp, Rmask, Gmask, Bmask, Amask);
}

/**
 * Create an SDL_PixelFormatDetails structure corresponding to a pixel format.
 *
 * Returned structure may come from a shared global cache (i.e. not newly
 * allocated), and hence should not be modified, especially the palette. Weird
 * errors such as `Blit combination not supported` may occur.
 *
 * @param format one of the SDL_PixelFormat values.
 * @returns a pointer to a SDL_PixelFormatDetails structure or NULL on
 *          failure; call SDL_GetError() for more information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_pixels.h:1243 const SDL_PixelFormatDetails * SDL_GetPixelFormatDetails(SDL_PixelFormat format);
 */
export function getPixelFormatDetails(format: number): Deno.PointerValue<"SDL_PixelFormatDetails"> {
  return lib.symbols.SDL_GetPixelFormatDetails(format) as Deno.PointerValue<"SDL_PixelFormatDetails">;
}

/**
 * Create a palette structure with the specified number of color entries.
 *
 * The palette entries are initialized to white.
 *
 * @param ncolors represents the number of color entries in the color palette.
 * @returns a new SDL_Palette structure on success or NULL on failure (e.g. if
 *          there wasn't enough memory); call SDL_GetError() for more
 *          information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_DestroyPalette
 * @sa SDL_SetPaletteColors
 * @sa SDL_SetSurfacePalette
 *
 * @from SDL_pixels.h:1263 SDL_Palette * SDL_CreatePalette(int ncolors);
 */
export function createPalette(ncolors: number): Deno.PointerValue<"SDL_Palette"> {
  return lib.symbols.SDL_CreatePalette(ncolors) as Deno.PointerValue<"SDL_Palette">;
}

/**
 * Set a range of colors in a palette.
 *
 * @param palette the SDL_Palette structure to modify.
 * @param colors an array of SDL_Color structures to copy into the palette.
 * @param firstcolor the index of the first palette entry to modify.
 * @param ncolors the number of entries to modify.
 * @returns true on success or false on failure; call SDL_GetError() for more
 *          information.
 *
 * @threadsafety It is safe to call this function from any thread, as long as
 *               the palette is not modified or destroyed in another thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_pixels.h:1280 bool SDL_SetPaletteColors(SDL_Palette *palette, const SDL_Color *colors, int firstcolor, int ncolors);
 */
export function setPaletteColors(
    palette: Deno.PointerValue<"SDL_Palette">,
    colors: { r: number; g: number; b: number; a: number; } | null,
    firstcolor: number,
    ncolors: number,
): boolean {
  if (colors) _p.u8.arr.set([colors.r, colors.g, colors.b, colors.a], 0);
  return lib.symbols.SDL_SetPaletteColors(palette, colors ? _p.u8.p0 : null, firstcolor, ncolors);
}

/**
 * Free a palette created with SDL_CreatePalette().
 *
 * @param palette the SDL_Palette structure to be freed.
 *
 * @threadsafety It is safe to call this function from any thread, as long as
 *               the palette is not modified or destroyed in another thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_CreatePalette
 *
 * @from SDL_pixels.h:1294 void SDL_DestroyPalette(SDL_Palette *palette);
 */
export function destroyPalette(palette: Deno.PointerValue<"SDL_Palette">): void {
  return lib.symbols.SDL_DestroyPalette(palette);
}

/**
 * Map an RGB triple to an opaque pixel value for a given pixel format.
 *
 * This function maps the RGB color value to the specified pixel format and
 * returns the pixel value best approximating the given RGB color value for
 * the given pixel format.
 *
 * If the format has a palette (8-bit) the index of the closest matching color
 * in the palette will be returned.
 *
 * If the specified pixel format has an alpha component it will be returned as
 * all 1 bits (fully opaque).
 *
 * If the pixel format bpp (color depth) is less than 32-bpp then the unused
 * upper bits of the return value can safely be ignored (e.g., with a 16-bpp
 * format the return value can be assigned to a Uint16, and similarly a Uint8
 * for an 8-bpp format).
 *
 * @param format a pointer to SDL_PixelFormatDetails describing the pixel
 *               format.
 * @param palette an optional palette for indexed formats, may be NULL.
 * @param r the red component of the pixel in the range 0-255.
 * @param g the green component of the pixel in the range 0-255.
 * @param b the blue component of the pixel in the range 0-255.
 * @returns a pixel value.
 *
 * @threadsafety It is safe to call this function from any thread, as long as
 *               the palette is not modified.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetPixelFormatDetails
 * @sa SDL_GetRGB
 * @sa SDL_MapRGBA
 * @sa SDL_MapSurfaceRGB
 *
 * @from SDL_pixels.h:1332 Uint32 SDL_MapRGB(const SDL_PixelFormatDetails *format, const SDL_Palette *palette, Uint8 r, Uint8 g, Uint8 b);
 */
export function mapRgb(
    format: Deno.PointerValue<"SDL_PixelFormatDetails">,
    palette: Deno.PointerValue<"SDL_Palette">,
    r: number,
    g: number,
    b: number,
): number {
  return lib.symbols.SDL_MapRGB(format, palette, r, g, b);
}

/**
 * Map an RGBA quadruple to a pixel value for a given pixel format.
 *
 * This function maps the RGBA color value to the specified pixel format and
 * returns the pixel value best approximating the given RGBA color value for
 * the given pixel format.
 *
 * If the specified pixel format has no alpha component the alpha value will
 * be ignored (as it will be in formats with a palette).
 *
 * If the format has a palette (8-bit) the index of the closest matching color
 * in the palette will be returned.
 *
 * If the pixel format bpp (color depth) is less than 32-bpp then the unused
 * upper bits of the return value can safely be ignored (e.g., with a 16-bpp
 * format the return value can be assigned to a Uint16, and similarly a Uint8
 * for an 8-bpp format).
 *
 * @param format a pointer to SDL_PixelFormatDetails describing the pixel
 *               format.
 * @param palette an optional palette for indexed formats, may be NULL.
 * @param r the red component of the pixel in the range 0-255.
 * @param g the green component of the pixel in the range 0-255.
 * @param b the blue component of the pixel in the range 0-255.
 * @param a the alpha component of the pixel in the range 0-255.
 * @returns a pixel value.
 *
 * @threadsafety It is safe to call this function from any thread, as long as
 *               the palette is not modified.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetPixelFormatDetails
 * @sa SDL_GetRGBA
 * @sa SDL_MapRGB
 * @sa SDL_MapSurfaceRGBA
 *
 * @from SDL_pixels.h:1371 Uint32 SDL_MapRGBA(const SDL_PixelFormatDetails *format, const SDL_Palette *palette, Uint8 r, Uint8 g, Uint8 b, Uint8 a);
 */
export function mapRgba(
    format: Deno.PointerValue<"SDL_PixelFormatDetails">,
    palette: Deno.PointerValue<"SDL_Palette">,
    r: number,
    g: number,
    b: number,
    a: number,
): number {
  return lib.symbols.SDL_MapRGBA(format, palette, r, g, b, a);
}

/**
 * Get RGB values from a pixel in the specified format.
 *
 * This function uses the entire 8-bit [0..255] range when converting color
 * components from pixel formats with less than 8-bits per RGB component
 * (e.g., a completely white pixel in 16-bit RGB565 format would return [0xff,
 * 0xff, 0xff] not [0xf8, 0xfc, 0xf8]).
 *
 * @param pixelvalue a pixel value.
 * @param format a pointer to SDL_PixelFormatDetails describing the pixel
 *               format.
 * @param palette an optional palette for indexed formats, may be NULL.
 * @param r a pointer filled in with the red component, may be NULL.
 * @param g a pointer filled in with the green component, may be NULL.
 * @param b a pointer filled in with the blue component, may be NULL.
 *
 * @threadsafety It is safe to call this function from any thread, as long as
 *               the palette is not modified.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetPixelFormatDetails
 * @sa SDL_GetRGBA
 * @sa SDL_MapRGB
 * @sa SDL_MapRGBA
 *
 * @from SDL_pixels.h:1399 void SDL_GetRGB(Uint32 pixelvalue, const SDL_PixelFormatDetails *format, const SDL_Palette *palette, Uint8 *r, Uint8 *g, Uint8 *b);
 */
export function getRgb(pixelvalue: number, format: Deno.PointerValue<"SDL_PixelFormatDetails">, palette: Deno.PointerValue<"SDL_Palette">): { r: number; g: number; b: number } {
  lib.symbols.SDL_GetRGB(pixelvalue, format, palette, _p.u8.p0, _p.u8.p1, _p.u8.p2);
  return {r: _p.u8.v0, g: _p.u8.v1, b: _p.u8.v2};
}

/**
 * Get RGBA values from a pixel in the specified format.
 *
 * This function uses the entire 8-bit [0..255] range when converting color
 * components from pixel formats with less than 8-bits per RGB component
 * (e.g., a completely white pixel in 16-bit RGB565 format would return [0xff,
 * 0xff, 0xff] not [0xf8, 0xfc, 0xf8]).
 *
 * If the surface has no alpha component, the alpha will be returned as 0xff
 * (100% opaque).
 *
 * @param pixelvalue a pixel value.
 * @param format a pointer to SDL_PixelFormatDetails describing the pixel
 *               format.
 * @param palette an optional palette for indexed formats, may be NULL.
 * @param r a pointer filled in with the red component, may be NULL.
 * @param g a pointer filled in with the green component, may be NULL.
 * @param b a pointer filled in with the blue component, may be NULL.
 * @param a a pointer filled in with the alpha component, may be NULL.
 *
 * @threadsafety It is safe to call this function from any thread, as long as
 *               the palette is not modified.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetPixelFormatDetails
 * @sa SDL_GetRGB
 * @sa SDL_MapRGB
 * @sa SDL_MapRGBA
 *
 * @from SDL_pixels.h:1431 void SDL_GetRGBA(Uint32 pixelvalue, const SDL_PixelFormatDetails *format, const SDL_Palette *palette, Uint8 *r, Uint8 *g, Uint8 *b, Uint8 *a);
 */
export function getRgba(pixelvalue: number, format: Deno.PointerValue<"SDL_PixelFormatDetails">, palette: Deno.PointerValue<"SDL_Palette">): { r: number; g: number; b: number; a: number } {
  lib.symbols.SDL_GetRGBA(pixelvalue, format, palette, _p.u8.p0, _p.u8.p1, _p.u8.p2, _p.u8.p3);
  return {r: _p.u8.v0, g: _p.u8.v1, b: _p.u8.v2, a: _p.u8.v3};
}

