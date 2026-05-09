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

import * as _ from "@denosaurs/byte-type";


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
export const SDL_Color = new _.Struct({
  r: _.u8, /* Uint8 */
  g: _.u8, /* Uint8 */
  b: _.u8, /* Uint8 */
  a: _.u8, /* Uint8 */
});



/**
 * The bits of this structure can be directly reinterpreted as a float-packed
 * color which uses the SDL_PIXELFORMAT_RGBA128_FLOAT format
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @from SDL_pixels.h:1125
 */
export const SDL_FColor = new _.Struct({
  r: _.f32, /* float */
  g: _.f32, /* float */
  b: _.f32, /* float */
  a: _.f32, /* float */
});



/**
 * A set of indexed colors representing a palette.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @sa SDL_SetPaletteColors
 *
 * @from SDL_pixels.h:1140
 */
export const SDL_Palette = new _.Struct({
  ncolors: _.i32, /**< int : number of elements in `colors`. */
  colors: _.u64, /**< SDL_Color * : an array of colors, `ncolors` long. */
  version: _.u32, /**< Uint32 : internal use only, do not touch. */
  refcount: _.i32, /**< int : internal use only, do not touch. */
});



/**
 * Details about the format of a pixel.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @from SDL_pixels.h:1153
 */
export const SDL_PixelFormatDetails = new _.Struct({
  format: _.u32, /* SDL_PixelFormat */
  bits_per_pixel: _.u8, /* Uint8 */
  bytes_per_pixel: _.u8, /* Uint8 */
  padding: new _.ArrayType(_.u8, 2), /* Uint8[2] */
  Rmask: _.u32, /* Uint32 */
  Gmask: _.u32, /* Uint32 */
  Bmask: _.u32, /* Uint32 */
  Amask: _.u32, /* Uint32 */
  Rbits: _.u8, /* Uint8 */
  Gbits: _.u8, /* Uint8 */
  Bbits: _.u8, /* Uint8 */
  Abits: _.u8, /* Uint8 */
  Rshift: _.u8, /* Uint8 */
  Gshift: _.u8, /* Uint8 */
  Bshift: _.u8, /* Uint8 */
  Ashift: _.u8, /* Uint8 */
});



