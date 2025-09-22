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

/**
 * Pixel type.
 *
 * @since This enum is available since SDL 3.2.0.
 *
 * @from SDL_pixels.h:133 SDL_PIXELTYPE_
 */
export enum SDL_PixelType {
  UNKNOWN, 
  INDEX1, 
  INDEX4, 
  INDEX8, 
  PACKED8, 
  PACKED16, 
  PACKED32, 
  ARRAYU8, 
  ARRAYU16, 
  ARRAYU32, 
  ARRAYF16, 
  ARRAYF32, 
    /* appended at the end for compatibility with sdl2-compat:  */
  INDEX2, 
}



/**
 * Bitmap pixel order, high bit -> low bit.
 *
 * @since This enum is available since SDL 3.2.0.
 *
 * @from SDL_pixels.h:156 SDL_BITMAPORDER_
 */
export enum SDL_BitmapOrder {
  NONE, 
  _4321, 
  _1234, 
}



/**
 * Packed component order, high bit -> low bit.
 *
 * @since This enum is available since SDL 3.2.0.
 *
 * @from SDL_pixels.h:168 SDL_PACKEDORDER_
 */
export enum SDL_PackedOrder {
  NONE, 
  XRGB, 
  RGBX, 
  ARGB, 
  RGBA, 
  XBGR, 
  BGRX, 
  ABGR, 
  BGRA, 
}



/**
 * Array component order, low byte -> high byte.
 *
 * @since This enum is available since SDL 3.2.0.
 *
 * @from SDL_pixels.h:186 SDL_ARRAYORDER_
 */
export enum SDL_ArrayOrder {
  NONE, 
  RGB, 
  RGBA, 
  ARGB, 
  BGR, 
  BGRA, 
  ABGR, 
}



/**
 * Packed component layout.
 *
 * @since This enum is available since SDL 3.2.0.
 *
 * @from SDL_pixels.h:202 SDL_PACKEDLAYOUT_
 */
export enum SDL_PackedLayout {
  NONE, 
  _332, 
  _4444, 
  _1555, 
  _5551, 
  _565, 
  _8888, 
  _2101010, 
  _1010102, 
}



/**
 * Pixel format.
 *
 * SDL's pixel formats have the following naming convention:
 *
 * - Names with a list of components and a single bit count, such as RGB24 and
 *   ABGR32, define a platform-independent encoding into bytes in the order
 *   specified. For example, in RGB24 data, each pixel is encoded in 3 bytes
 *   (red, green, blue) in that order, and in ABGR32 data, each pixel is
 *   encoded in 4 bytes (alpha, blue, green, red) in that order. Use these
 *   names if the property of a format that is important to you is the order
 *   of the bytes in memory or on disk.
 * - Names with a bit count per component, such as ARGB8888 and XRGB1555, are
 *   "packed" into an appropriately-sized integer in the platform's native
 *   endianness. For example, ARGB8888 is a sequence of 32-bit integers; in
 *   each integer, the most significant bits are alpha, and the least
 *   significant bits are blue. On a little-endian CPU such as x86, the least
 *   significant bits of each integer are arranged first in memory, but on a
 *   big-endian CPU such as s390x, the most significant bits are arranged
 *   first. Use these names if the property of a format that is important to
 *   you is the meaning of each bit position within a native-endianness
 *   integer.
 * - In indexed formats such as INDEX4LSB, each pixel is represented by
 *   encoding an index into the palette into the indicated number of bits,
 *   with multiple pixels packed into each byte if appropriate. In LSB
 *   formats, the first (leftmost) pixel is stored in the least-significant
 *   bits of the byte; in MSB formats, it's stored in the most-significant
 *   bits. INDEX8 does not need LSB/MSB variants, because each pixel exactly
 *   fills one byte.
 *
 * The 32-bit byte-array encodings such as RGBA32 are aliases for the
 * appropriate 8888 encoding for the current platform. For example, RGBA32 is
 * an alias for ABGR8888 on little-endian CPUs like x86, or an alias for
 * RGBA8888 on big-endian CPUs.
 *
 * @since This enum is available since SDL 3.2.0.
 *
 * @from SDL_pixels.h:547 SDL_PIXELFORMAT_
 */
export enum SDL_PixelFormat {
  UNKNOWN = 0, 
  INDEX1LSB = 0x11100100, 
        /* SDL_DEFINE_PIXELFORMAT(SDL_PIXELTYPE_INDEX1, SDL_BITMAPORDER_4321, 0, 1, 0), */
  INDEX1MSB = 0x11200100, 
        /* SDL_DEFINE_PIXELFORMAT(SDL_PIXELTYPE_INDEX1, SDL_BITMAPORDER_1234, 0, 1, 0), */
  INDEX2LSB = 0x1c100200, 
        /* SDL_DEFINE_PIXELFORMAT(SDL_PIXELTYPE_INDEX2, SDL_BITMAPORDER_4321, 0, 2, 0), */
  INDEX2MSB = 0x1c200200, 
        /* SDL_DEFINE_PIXELFORMAT(SDL_PIXELTYPE_INDEX2, SDL_BITMAPORDER_1234, 0, 2, 0), */
  INDEX4LSB = 0x12100400, 
        /* SDL_DEFINE_PIXELFORMAT(SDL_PIXELTYPE_INDEX4, SDL_BITMAPORDER_4321, 0, 4, 0), */
  INDEX4MSB = 0x12200400, 
        /* SDL_DEFINE_PIXELFORMAT(SDL_PIXELTYPE_INDEX4, SDL_BITMAPORDER_1234, 0, 4, 0), */
  INDEX8 = 0x13000801, 
        /* SDL_DEFINE_PIXELFORMAT(SDL_PIXELTYPE_INDEX8, 0, 0, 8, 1), */
  RGB332 = 0x14110801, 
        /* SDL_DEFINE_PIXELFORMAT(SDL_PIXELTYPE_PACKED8, SDL_PACKEDORDER_XRGB, SDL_PACKEDLAYOUT_332, 8, 1), */
  XRGB4444 = 0x15120c02, 
        /* SDL_DEFINE_PIXELFORMAT(SDL_PIXELTYPE_PACKED16, SDL_PACKEDORDER_XRGB, SDL_PACKEDLAYOUT_4444, 12, 2), */
  XBGR4444 = 0x15520c02, 
        /* SDL_DEFINE_PIXELFORMAT(SDL_PIXELTYPE_PACKED16, SDL_PACKEDORDER_XBGR, SDL_PACKEDLAYOUT_4444, 12, 2), */
  XRGB1555 = 0x15130f02, 
        /* SDL_DEFINE_PIXELFORMAT(SDL_PIXELTYPE_PACKED16, SDL_PACKEDORDER_XRGB, SDL_PACKEDLAYOUT_1555, 15, 2), */
  XBGR1555 = 0x15530f02, 
        /* SDL_DEFINE_PIXELFORMAT(SDL_PIXELTYPE_PACKED16, SDL_PACKEDORDER_XBGR, SDL_PACKEDLAYOUT_1555, 15, 2), */
  ARGB4444 = 0x15321002, 
        /* SDL_DEFINE_PIXELFORMAT(SDL_PIXELTYPE_PACKED16, SDL_PACKEDORDER_ARGB, SDL_PACKEDLAYOUT_4444, 16, 2), */
  RGBA4444 = 0x15421002, 
        /* SDL_DEFINE_PIXELFORMAT(SDL_PIXELTYPE_PACKED16, SDL_PACKEDORDER_RGBA, SDL_PACKEDLAYOUT_4444, 16, 2), */
  ABGR4444 = 0x15721002, 
        /* SDL_DEFINE_PIXELFORMAT(SDL_PIXELTYPE_PACKED16, SDL_PACKEDORDER_ABGR, SDL_PACKEDLAYOUT_4444, 16, 2), */
  BGRA4444 = 0x15821002, 
        /* SDL_DEFINE_PIXELFORMAT(SDL_PIXELTYPE_PACKED16, SDL_PACKEDORDER_BGRA, SDL_PACKEDLAYOUT_4444, 16, 2), */
  ARGB1555 = 0x15331002, 
        /* SDL_DEFINE_PIXELFORMAT(SDL_PIXELTYPE_PACKED16, SDL_PACKEDORDER_ARGB, SDL_PACKEDLAYOUT_1555, 16, 2), */
  RGBA5551 = 0x15441002, 
        /* SDL_DEFINE_PIXELFORMAT(SDL_PIXELTYPE_PACKED16, SDL_PACKEDORDER_RGBA, SDL_PACKEDLAYOUT_5551, 16, 2), */
  ABGR1555 = 0x15731002, 
        /* SDL_DEFINE_PIXELFORMAT(SDL_PIXELTYPE_PACKED16, SDL_PACKEDORDER_ABGR, SDL_PACKEDLAYOUT_1555, 16, 2), */
  BGRA5551 = 0x15841002, 
        /* SDL_DEFINE_PIXELFORMAT(SDL_PIXELTYPE_PACKED16, SDL_PACKEDORDER_BGRA, SDL_PACKEDLAYOUT_5551, 16, 2), */
  RGB565 = 0x15151002, 
        /* SDL_DEFINE_PIXELFORMAT(SDL_PIXELTYPE_PACKED16, SDL_PACKEDORDER_XRGB, SDL_PACKEDLAYOUT_565, 16, 2), */
  BGR565 = 0x15551002, 
        /* SDL_DEFINE_PIXELFORMAT(SDL_PIXELTYPE_PACKED16, SDL_PACKEDORDER_XBGR, SDL_PACKEDLAYOUT_565, 16, 2), */
  RGB24 = 0x17101803, 
        /* SDL_DEFINE_PIXELFORMAT(SDL_PIXELTYPE_ARRAYU8, SDL_ARRAYORDER_RGB, 0, 24, 3), */
  BGR24 = 0x17401803, 
        /* SDL_DEFINE_PIXELFORMAT(SDL_PIXELTYPE_ARRAYU8, SDL_ARRAYORDER_BGR, 0, 24, 3), */
  XRGB8888 = 0x16161804, 
        /* SDL_DEFINE_PIXELFORMAT(SDL_PIXELTYPE_PACKED32, SDL_PACKEDORDER_XRGB, SDL_PACKEDLAYOUT_8888, 24, 4), */
  RGBX8888 = 0x16261804, 
        /* SDL_DEFINE_PIXELFORMAT(SDL_PIXELTYPE_PACKED32, SDL_PACKEDORDER_RGBX, SDL_PACKEDLAYOUT_8888, 24, 4), */
  XBGR8888 = 0x16561804, 
        /* SDL_DEFINE_PIXELFORMAT(SDL_PIXELTYPE_PACKED32, SDL_PACKEDORDER_XBGR, SDL_PACKEDLAYOUT_8888, 24, 4), */
  BGRX8888 = 0x16661804, 
        /* SDL_DEFINE_PIXELFORMAT(SDL_PIXELTYPE_PACKED32, SDL_PACKEDORDER_BGRX, SDL_PACKEDLAYOUT_8888, 24, 4), */
  ARGB8888 = 0x16362004, 
        /* SDL_DEFINE_PIXELFORMAT(SDL_PIXELTYPE_PACKED32, SDL_PACKEDORDER_ARGB, SDL_PACKEDLAYOUT_8888, 32, 4), */
  RGBA8888 = 0x16462004, 
        /* SDL_DEFINE_PIXELFORMAT(SDL_PIXELTYPE_PACKED32, SDL_PACKEDORDER_RGBA, SDL_PACKEDLAYOUT_8888, 32, 4), */
  ABGR8888 = 0x16762004, 
        /* SDL_DEFINE_PIXELFORMAT(SDL_PIXELTYPE_PACKED32, SDL_PACKEDORDER_ABGR, SDL_PACKEDLAYOUT_8888, 32, 4), */
  BGRA8888 = 0x16862004, 
        /* SDL_DEFINE_PIXELFORMAT(SDL_PIXELTYPE_PACKED32, SDL_PACKEDORDER_BGRA, SDL_PACKEDLAYOUT_8888, 32, 4), */
  XRGB2101010 = 0x16172004, 
        /* SDL_DEFINE_PIXELFORMAT(SDL_PIXELTYPE_PACKED32, SDL_PACKEDORDER_XRGB, SDL_PACKEDLAYOUT_2101010, 32, 4), */
  XBGR2101010 = 0x16572004, 
        /* SDL_DEFINE_PIXELFORMAT(SDL_PIXELTYPE_PACKED32, SDL_PACKEDORDER_XBGR, SDL_PACKEDLAYOUT_2101010, 32, 4), */
  ARGB2101010 = 0x16372004, 
        /* SDL_DEFINE_PIXELFORMAT(SDL_PIXELTYPE_PACKED32, SDL_PACKEDORDER_ARGB, SDL_PACKEDLAYOUT_2101010, 32, 4), */
  ABGR2101010 = 0x16772004, 
        /* SDL_DEFINE_PIXELFORMAT(SDL_PIXELTYPE_PACKED32, SDL_PACKEDORDER_ABGR, SDL_PACKEDLAYOUT_2101010, 32, 4), */
  RGB48 = 0x18103006, 
        /* SDL_DEFINE_PIXELFORMAT(SDL_PIXELTYPE_ARRAYU16, SDL_ARRAYORDER_RGB, 0, 48, 6), */
  BGR48 = 0x18403006, 
        /* SDL_DEFINE_PIXELFORMAT(SDL_PIXELTYPE_ARRAYU16, SDL_ARRAYORDER_BGR, 0, 48, 6), */
  RGBA64 = 0x18204008, 
        /* SDL_DEFINE_PIXELFORMAT(SDL_PIXELTYPE_ARRAYU16, SDL_ARRAYORDER_RGBA, 0, 64, 8), */
  ARGB64 = 0x18304008, 
        /* SDL_DEFINE_PIXELFORMAT(SDL_PIXELTYPE_ARRAYU16, SDL_ARRAYORDER_ARGB, 0, 64, 8), */
  BGRA64 = 0x18504008, 
        /* SDL_DEFINE_PIXELFORMAT(SDL_PIXELTYPE_ARRAYU16, SDL_ARRAYORDER_BGRA, 0, 64, 8), */
  ABGR64 = 0x18604008, 
        /* SDL_DEFINE_PIXELFORMAT(SDL_PIXELTYPE_ARRAYU16, SDL_ARRAYORDER_ABGR, 0, 64, 8), */
  RGB48_FLOAT = 0x1a103006, 
        /* SDL_DEFINE_PIXELFORMAT(SDL_PIXELTYPE_ARRAYF16, SDL_ARRAYORDER_RGB, 0, 48, 6), */
  BGR48_FLOAT = 0x1a403006, 
        /* SDL_DEFINE_PIXELFORMAT(SDL_PIXELTYPE_ARRAYF16, SDL_ARRAYORDER_BGR, 0, 48, 6), */
  RGBA64_FLOAT = 0x1a204008, 
        /* SDL_DEFINE_PIXELFORMAT(SDL_PIXELTYPE_ARRAYF16, SDL_ARRAYORDER_RGBA, 0, 64, 8), */
  ARGB64_FLOAT = 0x1a304008, 
        /* SDL_DEFINE_PIXELFORMAT(SDL_PIXELTYPE_ARRAYF16, SDL_ARRAYORDER_ARGB, 0, 64, 8), */
  BGRA64_FLOAT = 0x1a504008, 
        /* SDL_DEFINE_PIXELFORMAT(SDL_PIXELTYPE_ARRAYF16, SDL_ARRAYORDER_BGRA, 0, 64, 8), */
  ABGR64_FLOAT = 0x1a604008, 
        /* SDL_DEFINE_PIXELFORMAT(SDL_PIXELTYPE_ARRAYF16, SDL_ARRAYORDER_ABGR, 0, 64, 8), */
  RGB96_FLOAT = 0x1b10600c, 
        /* SDL_DEFINE_PIXELFORMAT(SDL_PIXELTYPE_ARRAYF32, SDL_ARRAYORDER_RGB, 0, 96, 12), */
  BGR96_FLOAT = 0x1b40600c, 
        /* SDL_DEFINE_PIXELFORMAT(SDL_PIXELTYPE_ARRAYF32, SDL_ARRAYORDER_BGR, 0, 96, 12), */
  RGBA128_FLOAT = 0x1b208010, 
        /* SDL_DEFINE_PIXELFORMAT(SDL_PIXELTYPE_ARRAYF32, SDL_ARRAYORDER_RGBA, 0, 128, 16), */
  ARGB128_FLOAT = 0x1b308010, 
        /* SDL_DEFINE_PIXELFORMAT(SDL_PIXELTYPE_ARRAYF32, SDL_ARRAYORDER_ARGB, 0, 128, 16), */
  BGRA128_FLOAT = 0x1b508010, 
        /* SDL_DEFINE_PIXELFORMAT(SDL_PIXELTYPE_ARRAYF32, SDL_ARRAYORDER_BGRA, 0, 128, 16), */
  ABGR128_FLOAT = 0x1b608010, 
        /* SDL_DEFINE_PIXELFORMAT(SDL_PIXELTYPE_ARRAYF32, SDL_ARRAYORDER_ABGR, 0, 128, 16), */
  YV12 = 0x32315659, /**< Planar mode: Y + V + U  (3 planes) */
        /* SDL_DEFINE_PIXELFOURCC('Y', 'V', '1', '2'), */
  IYUV = 0x56555949, /**< Planar mode: Y + U + V  (3 planes) */
        /* SDL_DEFINE_PIXELFOURCC('I', 'Y', 'U', 'V'), */
  YUY2 = 0x32595559, /**< Packed mode: Y0+U0+Y1+V0 (1 plane) */
        /* SDL_DEFINE_PIXELFOURCC('Y', 'U', 'Y', '2'), */
  UYVY = 0x59565955, /**< Packed mode: U0+Y0+V0+Y1 (1 plane) */
        /* SDL_DEFINE_PIXELFOURCC('U', 'Y', 'V', 'Y'), */
  YVYU = 0x55595659, /**< Packed mode: Y0+V0+Y1+U0 (1 plane) */
        /* SDL_DEFINE_PIXELFOURCC('Y', 'V', 'Y', 'U'), */
  NV12 = 0x3231564e, /**< Planar mode: Y + U/V interleaved  (2 planes) */
        /* SDL_DEFINE_PIXELFOURCC('N', 'V', '1', '2'), */
  NV21 = 0x3132564e, /**< Planar mode: Y + V/U interleaved  (2 planes) */
        /* SDL_DEFINE_PIXELFOURCC('N', 'V', '2', '1'), */
  P010 = 0x30313050, /**< Planar mode: Y + U/V interleaved  (2 planes) */
        /* SDL_DEFINE_PIXELFOURCC('P', '0', '1', '0'), */
  EXTERNAL_OES = 0x2053454f, /**< Android video texture format */
        /* SDL_DEFINE_PIXELFOURCC('O', 'E', 'S', ' ') */
  MJPG = 0x47504a4d, /**< Motion JPEG */
        /* SDL_DEFINE_PIXELFOURCC('M', 'J', 'P', 'G') */
    /* Aliases for RGBA byte arrays of color data, for the current platform */
  /*SDL_PIXELFORMAT_RGBA32 = SDL_PIXELFORMAT_RGBA8888,*/ 
  /*SDL_PIXELFORMAT_ARGB32 = SDL_PIXELFORMAT_ARGB8888,*/ 
  /*SDL_PIXELFORMAT_BGRA32 = SDL_PIXELFORMAT_BGRA8888,*/ 
  /*SDL_PIXELFORMAT_ABGR32 = SDL_PIXELFORMAT_ABGR8888,*/ 
  /*SDL_PIXELFORMAT_RGBX32 = SDL_PIXELFORMAT_RGBX8888,*/ 
  /*SDL_PIXELFORMAT_XRGB32 = SDL_PIXELFORMAT_XRGB8888,*/ 
  /*SDL_PIXELFORMAT_BGRX32 = SDL_PIXELFORMAT_BGRX8888,*/ 
  /*SDL_PIXELFORMAT_XBGR32 = SDL_PIXELFORMAT_XBGR8888,*/ 
  /*SDL_PIXELFORMAT_RGBA32 = SDL_PIXELFORMAT_ABGR8888,*/ 
  /*SDL_PIXELFORMAT_ARGB32 = SDL_PIXELFORMAT_BGRA8888,*/ 
  /*SDL_PIXELFORMAT_BGRA32 = SDL_PIXELFORMAT_ARGB8888,*/ 
  /*SDL_PIXELFORMAT_ABGR32 = SDL_PIXELFORMAT_RGBA8888,*/ 
  /*SDL_PIXELFORMAT_RGBX32 = SDL_PIXELFORMAT_XBGR8888,*/ 
  /*SDL_PIXELFORMAT_XRGB32 = SDL_PIXELFORMAT_BGRX8888,*/ 
  /*SDL_PIXELFORMAT_BGRX32 = SDL_PIXELFORMAT_XRGB8888,*/ 
  /*SDL_PIXELFORMAT_XBGR32 = SDL_PIXELFORMAT_RGBX8888,*/ 
}



/**
 * Colorspace color type.
 *
 * @since This enum is available since SDL 3.2.0.
 *
 * @from SDL_pixels.h:708 SDL_COLOR_TYPE_
 */
export enum SDL_ColorType {
  UNKNOWN = 0, 
  RGB = 1, 
  YCBCR = 2, 
}



/**
 * Colorspace color range, as described by
 * https://www.itu.int/rec/R-REC-BT.2100-2-201807-I/en
 *
 * @since This enum is available since SDL 3.2.0.
 *
 * @from SDL_pixels.h:721 SDL_COLOR_RANGE_
 */
export enum SDL_ColorRange {
  UNKNOWN = 0, 
  LIMITED = 1, /**< Narrow range, e.g. 16-235 for 8-bit RGB and luma, and 16-240 for 8-bit chroma */
  FULL = 2    , /**< Full range, e.g. 0-255 for 8-bit RGB and luma, and 1-255 for 8-bit chroma */
}



/**
 * Colorspace color primaries, as described by
 * https://www.itu.int/rec/T-REC-H.273-201612-S/en
 *
 * @since This enum is available since SDL 3.2.0.
 *
 * @from SDL_pixels.h:734 SDL_COLOR_PRIMARIES_
 */
export enum SDL_ColorPrimaries {
  UNKNOWN = 0, 
  BT709 = 1, /**< ITU-R BT.709-6 */
  UNSPECIFIED = 2, 
  BT470M = 4, /**< ITU-R BT.470-6 System M */
  BT470BG = 5, /**< ITU-R BT.470-6 System B, G / ITU-R BT.601-7 625 */
  BT601 = 6, /**< ITU-R BT.601-7 525, SMPTE 170M */
  SMPTE240 = 7, /**< SMPTE 240M, functionally the same as SDL_COLOR_PRIMARIES_BT601 */
  GENERIC_FILM = 8, /**< Generic film (color filters using Illuminant C) */
  BT2020 = 9, /**< ITU-R BT.2020-2 / ITU-R BT.2100-0 */
  XYZ = 10, /**< SMPTE ST 428-1 */
  SMPTE431 = 11, /**< SMPTE RP 431-2 */
  SMPTE432 = 12, /**< SMPTE EG 432-1 / DCI P3 */
  EBU3213 = 22, /**< EBU Tech. 3213-E */
  CUSTOM = 31, 
}



/**
 * Colorspace transfer characteristics.
 *
 * These are as described by https://www.itu.int/rec/T-REC-H.273-201612-S/en
 *
 * @since This enum is available since SDL 3.2.0.
 *
 * @from SDL_pixels.h:759 SDL_TRANSFER_CHARACTERISTICS_
 */
export enum SDL_TransferCharacteristics {
  UNKNOWN = 0, 
  BT709 = 1, /**< Rec. ITU-R BT.709-6 / ITU-R BT1361 */
  UNSPECIFIED = 2, 
  GAMMA22 = 4, /**< ITU-R BT.470-6 System M / ITU-R BT1700 625 PAL & SECAM */
  GAMMA28 = 5, /**< ITU-R BT.470-6 System B, G */
  BT601 = 6, /**< SMPTE ST 170M / ITU-R BT.601-7 525 or 625 */
  SMPTE240 = 7, /**< SMPTE ST 240M */
  LINEAR = 8, 
  LOG100 = 9, 
  LOG100_SQRT10 = 10, 
  IEC61966 = 11, /**< IEC 61966-2-4 */
  BT1361 = 12, /**< ITU-R BT1361 Extended Colour Gamut */
  SRGB = 13, /**< IEC 61966-2-1 (sRGB or sYCC) */
  BT2020_10BIT = 14, /**< ITU-R BT2020 for 10-bit system */
  BT2020_12BIT = 15, /**< ITU-R BT2020 for 12-bit system */
  PQ = 16, /**< SMPTE ST 2084 for 10-, 12-, 14- and 16-bit systems */
  SMPTE428 = 17, /**< SMPTE ST 428-1 */
  HLG = 18, /**< ARIB STD-B67, known as "hybrid log-gamma" (HLG) */
  CUSTOM = 31, 
}



/**
 * Colorspace matrix coefficients.
 *
 * These are as described by https://www.itu.int/rec/T-REC-H.273-201612-S/en
 *
 * @since This enum is available since SDL 3.2.0.
 *
 * @from SDL_pixels.h:789 SDL_MATRIX_COEFFICIENTS_
 */
export enum SDL_MatrixCoefficients {
  IDENTITY = 0, 
  BT709 = 1, /**< ITU-R BT.709-6 */
  UNSPECIFIED = 2, 
  FCC = 4, /**< US FCC Title 47 */
  BT470BG = 5, /**< ITU-R BT.470-6 System B, G / ITU-R BT.601-7 625, functionally the same as SDL_MATRIX_COEFFICIENTS_BT601 */
  BT601 = 6, /**< ITU-R BT.601-7 525 */
  SMPTE240 = 7, /**< SMPTE 240M */
  YCGCO = 8, 
  BT2020_NCL = 9, /**< ITU-R BT.2020-2 non-constant luminance */
  BT2020_CL = 10, /**< ITU-R BT.2020-2 constant luminance */
  SMPTE2085 = 11, /**< SMPTE ST 2085 */
  CHROMA_DERIVED_NCL = 12, 
  CHROMA_DERIVED_CL = 13, 
  ICTCP = 14, /**< ITU-R BT.2100-0 ICTCP */
  CUSTOM = 31, 
}



/**
 * Colorspace chroma sample location.
 *
 * @since This enum is available since SDL 3.2.0.
 *
 * @from SDL_pixels.h:813 SDL_CHROMA_LOCATION_
 */
export enum SDL_ChromaLocation {
  NONE = 0, /**< RGB, no chroma sampling */
  LEFT = 1, /**< In MPEG-2, MPEG-4, and AVC, Cb and Cr are taken on midpoint of the left-edge of the 2x2 square. In other words, they have the same horizontal location as the top-left pixel, but is shifted one-half pixel down vertically. */
  CENTER = 2, /**< In JPEG/JFIF, H.261, and MPEG-1, Cb and Cr are taken at the center of the 2x2 square. In other words, they are offset one-half pixel to the right and one-half pixel down compared to the top-left pixel. */
  TOPLEFT = 3 , /**< In HEVC for BT.2020 and BT.2100 content (in particular on Blu-rays), Cb and Cr are sampled at the same location as the group's top-left Y pixel ("co-sited", "co-located"). */
}



/**
 * Colorspace definitions.
 *
 * Since similar colorspaces may vary in their details (matrix, transfer
 * function, etc.), this is not an exhaustive list, but rather a
 * representative sample of the kinds of colorspaces supported in SDL.
 *
 * @since This enum is available since SDL 3.2.0.
 *
 * @sa SDL_ColorPrimaries
 * @sa SDL_ColorRange
 * @sa SDL_ColorType
 * @sa SDL_MatrixCoefficients
 * @sa SDL_TransferCharacteristics
 *
 * @from SDL_pixels.h:1010 SDL_COLORSPACE_
 */
export enum SDL_Colorspace {
  UNKNOWN = 0, 
    /* sRGB is a gamma corrected colorspace, and the default colorspace for SDL rendering and 8-bit RGB surfaces */
  SRGB = 0x120005a0, /**< Equivalent to DXGI_COLOR_SPACE_RGB_FULL_G22_NONE_P709 */
        /* SDL_DEFINE_COLORSPACE(SDL_COLOR_TYPE_RGB,
                                 SDL_COLOR_RANGE_FULL,
                                 SDL_COLOR_PRIMARIES_BT709,
                                 SDL_TRANSFER_CHARACTERISTICS_SRGB,
                                 SDL_MATRIX_COEFFICIENTS_IDENTITY,
                                 SDL_CHROMA_LOCATION_NONE), */
    /* This is a linear colorspace and the default colorspace for floating point surfaces. On Windows this is the scRGB colorspace, and on Apple platforms this is kCGColorSpaceExtendedLinearSRGB for EDR content */
  SRGB_LINEAR = 0x12000500, /**< Equivalent to DXGI_COLOR_SPACE_RGB_FULL_G10_NONE_P709  */
        /* SDL_DEFINE_COLORSPACE(SDL_COLOR_TYPE_RGB,
                                 SDL_COLOR_RANGE_FULL,
                                 SDL_COLOR_PRIMARIES_BT709,
                                 SDL_TRANSFER_CHARACTERISTICS_LINEAR,
                                 SDL_MATRIX_COEFFICIENTS_IDENTITY,
                                 SDL_CHROMA_LOCATION_NONE), */
    /* HDR10 is a non-linear HDR colorspace and the default colorspace for 10-bit surfaces */
  HDR10 = 0x12002600, /**< Equivalent to DXGI_COLOR_SPACE_RGB_FULL_G2084_NONE_P2020  */
        /* SDL_DEFINE_COLORSPACE(SDL_COLOR_TYPE_RGB,
                                 SDL_COLOR_RANGE_FULL,
                                 SDL_COLOR_PRIMARIES_BT2020,
                                 SDL_TRANSFER_CHARACTERISTICS_PQ,
                                 SDL_MATRIX_COEFFICIENTS_IDENTITY,
                                 SDL_CHROMA_LOCATION_NONE), */
  JPEG = 0x220004c6, /**< Equivalent to DXGI_COLOR_SPACE_YCBCR_FULL_G22_NONE_P709_X601 */
        /* SDL_DEFINE_COLORSPACE(SDL_COLOR_TYPE_YCBCR,
                                 SDL_COLOR_RANGE_FULL,
                                 SDL_COLOR_PRIMARIES_BT709,
                                 SDL_TRANSFER_CHARACTERISTICS_BT601,
                                 SDL_MATRIX_COEFFICIENTS_BT601,
                                 SDL_CHROMA_LOCATION_NONE), */
  BT601_LIMITED = 0x211018c6, /**< Equivalent to DXGI_COLOR_SPACE_YCBCR_STUDIO_G22_LEFT_P601 */
        /* SDL_DEFINE_COLORSPACE(SDL_COLOR_TYPE_YCBCR,
                                 SDL_COLOR_RANGE_LIMITED,
                                 SDL_COLOR_PRIMARIES_BT601,
                                 SDL_TRANSFER_CHARACTERISTICS_BT601,
                                 SDL_MATRIX_COEFFICIENTS_BT601,
                                 SDL_CHROMA_LOCATION_LEFT), */
  BT601_FULL = 0x221018c6, /**< Equivalent to DXGI_COLOR_SPACE_YCBCR_STUDIO_G22_LEFT_P601 */
        /* SDL_DEFINE_COLORSPACE(SDL_COLOR_TYPE_YCBCR,
                                 SDL_COLOR_RANGE_FULL,
                                 SDL_COLOR_PRIMARIES_BT601,
                                 SDL_TRANSFER_CHARACTERISTICS_BT601,
                                 SDL_MATRIX_COEFFICIENTS_BT601,
                                 SDL_CHROMA_LOCATION_LEFT), */
  BT709_LIMITED = 0x21100421, /**< Equivalent to DXGI_COLOR_SPACE_YCBCR_STUDIO_G22_LEFT_P709 */
        /* SDL_DEFINE_COLORSPACE(SDL_COLOR_TYPE_YCBCR,
                                 SDL_COLOR_RANGE_LIMITED,
                                 SDL_COLOR_PRIMARIES_BT709,
                                 SDL_TRANSFER_CHARACTERISTICS_BT709,
                                 SDL_MATRIX_COEFFICIENTS_BT709,
                                 SDL_CHROMA_LOCATION_LEFT), */
  BT709_FULL = 0x22100421, /**< Equivalent to DXGI_COLOR_SPACE_YCBCR_STUDIO_G22_LEFT_P709 */
        /* SDL_DEFINE_COLORSPACE(SDL_COLOR_TYPE_YCBCR,
                                 SDL_COLOR_RANGE_FULL,
                                 SDL_COLOR_PRIMARIES_BT709,
                                 SDL_TRANSFER_CHARACTERISTICS_BT709,
                                 SDL_MATRIX_COEFFICIENTS_BT709,
                                 SDL_CHROMA_LOCATION_LEFT), */
  BT2020_LIMITED = 0x21102609, /**< Equivalent to DXGI_COLOR_SPACE_YCBCR_STUDIO_G22_LEFT_P2020 */
        /* SDL_DEFINE_COLORSPACE(SDL_COLOR_TYPE_YCBCR,
                                 SDL_COLOR_RANGE_LIMITED,
                                 SDL_COLOR_PRIMARIES_BT2020,
                                 SDL_TRANSFER_CHARACTERISTICS_PQ,
                                 SDL_MATRIX_COEFFICIENTS_BT2020_NCL,
                                 SDL_CHROMA_LOCATION_LEFT), */
  BT2020_FULL = 0x22102609, /**< Equivalent to DXGI_COLOR_SPACE_YCBCR_FULL_G22_LEFT_P2020 */
        /* SDL_DEFINE_COLORSPACE(SDL_COLOR_TYPE_YCBCR,
                                 SDL_COLOR_RANGE_FULL,
                                 SDL_COLOR_PRIMARIES_BT2020,
                                 SDL_TRANSFER_CHARACTERISTICS_PQ,
                                 SDL_MATRIX_COEFFICIENTS_BT2020_NCL,
                                 SDL_CHROMA_LOCATION_LEFT), */
  RGB_DEFAULT = SRGB, /**< The default colorspace for RGB surfaces if no colorspace is specified */
  YUV_DEFAULT = JPEG  , /**< The default colorspace for YUV surfaces if no colorspace is specified */
}



