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
  Copyright (C) 1997-2026 Sam Lantinga <slouken@libsdl.org>

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
import * as _b from "../_structs/SDL_pixels.ts";


/**
 * A structure that represents a color as RGBA components.
 *
 * The bits of this structure can be directly reinterpreted as an
 * integer-packed color which uses the SDL_PIXELFORMAT_RGBA32 format
 * (SDL_PIXELFORMAT_ABGR8888 on little-endian systems and
 * SDL_PIXELFORMAT_RGBA8888 on big-endian systems).
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @from SDL_pixels.h:1111
 */
export interface Color {
  r: number; /* Uint8 */
  g: number; /* Uint8 */
  b: number; /* Uint8 */
  a: number; /* Uint8 */
}

export function read_Color(dt: DataView): Color {
  const t = _b.SDL_Color.read(dt);
  return {
    r: t.r, /** Uint8 */
    g: t.g, /** Uint8 */
    b: t.b, /** Uint8 */
    a: t.a, /** Uint8 */
  };
}

export function write_Color(t: Color, dt: DataView) {
  _b.SDL_Color.write({
    r: t.r, /** Uint8 */
    g: t.g, /** Uint8 */
    b: t.b, /** Uint8 */
    a: t.a, /** Uint8 */
  }, dt);
}


/**
 * The bits of this structure can be directly reinterpreted as a float-packed
 * color which uses the SDL_PIXELFORMAT_RGBA128_FLOAT format
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @from SDL_pixels.h:1125
 */
export interface FColor {
  r: number; /* float */
  g: number; /* float */
  b: number; /* float */
  a: number; /* float */
}

export function read_FColor(dt: DataView): FColor {
  const t = _b.SDL_FColor.read(dt);
  return {
    r: t.r, /** float */
    g: t.g, /** float */
    b: t.b, /** float */
    a: t.a, /** float */
  };
}

export function write_FColor(t: FColor, dt: DataView) {
  _b.SDL_FColor.write({
    r: t.r, /** float */
    g: t.g, /** float */
    b: t.b, /** float */
    a: t.a, /** float */
  }, dt);
}


/**
 * A set of indexed colors representing a palette.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @sa SDL_SetPaletteColors
 *
 * @from SDL_pixels.h:1140
 */
export interface Palette {
  ncolors: number; /**< int : number of elements in `colors`. */
  colors: Deno.PointerValue; /**< SDL_Color * : an array of colors, `ncolors` long. */
  version: number; /**< Uint32 : internal use only, do not touch. */
  refcount: number; /**< int : internal use only, do not touch. */
}

export function read_Palette(dt: DataView): Palette {
  const t = _b.SDL_Palette.read(dt);
  return {
    ncolors: t.ncolors, /** int */
    colors: Deno.UnsafePointer.create(t.colors), /** SDL_Color * */
    version: t.version, /** Uint32 */
    refcount: t.refcount, /** int */
  };
}

export function write_Palette(t: Palette, dt: DataView) {
  _b.SDL_Palette.write({
    ncolors: t.ncolors, /** int */
    colors: Deno.UnsafePointer.value(t.colors), /** SDL_Color * */
    version: t.version, /** Uint32 */
    refcount: t.refcount, /** int */
  }, dt);
}


/**
 * Details about the format of a pixel.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @from SDL_pixels.h:1153
 */
export interface PixelFormatDetails {
  format: number; /* SDL_PixelFormat */
  bits_per_pixel: number; /* Uint8 */
  bytes_per_pixel: number; /* Uint8 */
  padding: number[]; /* Uint8[2] */
  Rmask: number; /* Uint32 */
  Gmask: number; /* Uint32 */
  Bmask: number; /* Uint32 */
  Amask: number; /* Uint32 */
  Rbits: number; /* Uint8 */
  Gbits: number; /* Uint8 */
  Bbits: number; /* Uint8 */
  Abits: number; /* Uint8 */
  Rshift: number; /* Uint8 */
  Gshift: number; /* Uint8 */
  Bshift: number; /* Uint8 */
  Ashift: number; /* Uint8 */
}

export function read_PixelFormatDetails(dt: DataView): PixelFormatDetails {
  const t = _b.SDL_PixelFormatDetails.read(dt);
  return {
    format: t.format, /** SDL_PixelFormat */
    bits_per_pixel: t.bits_per_pixel, /** Uint8 */
    bytes_per_pixel: t.bytes_per_pixel, /** Uint8 */
    padding: t.padding, /** Uint8 */
    Rmask: t.Rmask, /** Uint32 */
    Gmask: t.Gmask, /** Uint32 */
    Bmask: t.Bmask, /** Uint32 */
    Amask: t.Amask, /** Uint32 */
    Rbits: t.Rbits, /** Uint8 */
    Gbits: t.Gbits, /** Uint8 */
    Bbits: t.Bbits, /** Uint8 */
    Abits: t.Abits, /** Uint8 */
    Rshift: t.Rshift, /** Uint8 */
    Gshift: t.Gshift, /** Uint8 */
    Bshift: t.Bshift, /** Uint8 */
    Ashift: t.Ashift, /** Uint8 */
  };
}

export function write_PixelFormatDetails(t: PixelFormatDetails, dt: DataView) {
  _b.SDL_PixelFormatDetails.write({
    format: t.format, /** SDL_PixelFormat */
    bits_per_pixel: t.bits_per_pixel, /** Uint8 */
    bytes_per_pixel: t.bytes_per_pixel, /** Uint8 */
    padding: t.padding, /** Uint8 */
    Rmask: t.Rmask, /** Uint32 */
    Gmask: t.Gmask, /** Uint32 */
    Bmask: t.Bmask, /** Uint32 */
    Amask: t.Amask, /** Uint32 */
    Rbits: t.Rbits, /** Uint8 */
    Gbits: t.Gbits, /** Uint8 */
    Bbits: t.Bbits, /** Uint8 */
    Abits: t.Abits, /** Uint8 */
    Rshift: t.Rshift, /** Uint8 */
    Gshift: t.Gshift, /** Uint8 */
    Bshift: t.Bshift, /** Uint8 */
    Ashift: t.Ashift, /** Uint8 */
  }, dt);
}


