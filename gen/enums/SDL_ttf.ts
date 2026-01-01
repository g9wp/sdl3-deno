/**
 * # CategorySDLTTF
 *
 * Header file for SDL_ttf library
 *
 * This library is a wrapper around the excellent FreeType 2.0 library,
 * available at: https://www.freetype.org/
 *
 * @module
 */

/*
  SDL_ttf:  A companion library to SDL for working with TrueType (tm) fonts
  Copyright (C) 2001-2025 Sam Lantinga <slouken@libsdl.org>

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
 * @from SDL_ttf:46 SDL_TTF_
 */
export enum TTF {
  MAJOR_VERSION = 3, /**
 * Printable format: "%d.%d.%d", MAJOR, MINOR, MICRO
 */
  MINOR_VERSION = 2, 
  MICRO_VERSION = 2, 
}



/**
 * @from SDL_ttf:226 TTF_PROP_FONT_CREATE_
 */
export enum PROP_FONT_CREATE {
  FILENAME_STRING = "SDL_ttf.font.create.filename", 
  IOSTREAM_POINTER = "SDL_ttf.font.create.iostream", 
  IOSTREAM_OFFSET_NUMBER = "SDL_ttf.font.create.iostream.offset", 
  IOSTREAM_AUTOCLOSE_BOOLEAN = "SDL_ttf.font.create.iostream.autoclose", 
  SIZE_FLOAT = "SDL_ttf.font.create.size", 
  FACE_NUMBER = "SDL_ttf.font.create.face", 
  HORIZONTAL_DPI_NUMBER = "SDL_ttf.font.create.hdpi", 
  VERTICAL_DPI_NUMBER = "SDL_ttf.font.create.vdpi", 
  EXISTING_FONT = "SDL_ttf.font.create.existing_font", 
}



/**
 * @from SDL_ttf:281 TTF_PROP_FONT_OUTLINE_
 */
export enum PROP_FONT_OUTLINE {
  LINE_CAP_NUMBER = "SDL_ttf.font.outline.line_cap", 
  LINE_JOIN_NUMBER = "SDL_ttf.font.outline.line_join", 
  MITER_LIMIT_NUMBER = "SDL_ttf.font.outline.miter_limit", 
}



/**
 * @from SDL_ttf:454 TTF_STYLE_
 */
export enum STYLE {
  NORMAL = 0x00, /**< No special style */
  BOLD = 0x01, /**< Bold style */
  ITALIC = 0x02, /**< Italic style */
  UNDERLINE = 0x04, /**< Underlined text */
  STRIKETHROUGH = 0x08, /**< Strikethrough text */
}



/**
 * @from SDL_ttf:682 TTF_FONT_WEIGHT_
 */
export enum FONT_WEIGHT {
  THIN = 100, /**< Thin (100) named font weight value */
  EXTRA_LIGHT = 200, /**< ExtraLight (200) named font weight value */
  LIGHT = 300, /**< Light (300) named font weight value */
  NORMAL = 400, /**< Normal (400) named font weight value */
  MEDIUM = 500, /**< Medium (500) named font weight value */
  SEMI_BOLD = 600, /**< SemiBold (600) named font weight value */
  BOLD = 700, /**< Bold (700) named font weight value */
  EXTRA_BOLD = 800, /**< ExtraBold (800) named font weight value */
  BLACK = 900, /**< Black (900) named font weight value */
  EXTRA_BLACK = 950, /**< ExtraBlack (950) named font weight value */
}



/**
 * @from SDL_ttf:1835 TTF_PROP_RENDERER_TEXT_ENGINE_
 */
export enum PROP_RENDERER_TEXT_ENGINE {
  RENDERER = "SDL_ttf.renderer_text_engine.create.renderer", 
  ATLAS_TEXTURE_SIZE = "SDL_ttf.renderer_text_engine.create.atlas_texture_size", 
}



/**
 * @from SDL_ttf:1926 TTF_PROP_GPU_TEXT_ENGINE_
 */
export enum PROP_GPU_TEXT_ENGINE {
  DEVICE = "SDL_ttf.gpu_text_engine.create.device", 
  ATLAS_TEXTURE_SIZE = "SDL_ttf.gpu_text_engine.create.atlas_texture_size", 
}



/**
 * @from SDL_ttf:2569 TTF_SUBSTRING_
 */
export enum SUBSTRING {
  DIRECTION_MASK = 0x000000FF, /**< The mask for the flow direction for this substring */
  TEXT_START = 0x00000100, /**< This substring contains the beginning of the text */
  LINE_START = 0x00000200, /**< This substring contains the beginning of line `line_index` */
  LINE_END = 0x00000400, /**< This substring contains the end of line `line_index` */
  TEXT_END = 0x00000800, /**< This substring contains the end of the text */
}



/**
 * Hinting flags for TTF (TrueType Fonts)
 *
 * This enum specifies the level of hinting to be applied to the font
 * rendering. The hinting level determines how much the font's outlines are
 * adjusted for better alignment on the pixel grid.
 *
 * @since This enum is available since SDL_ttf 3.0.0.
 *
 * @sa TTF_SetFontHinting
 * @sa TTF_GetFontHinting
 *
 * @from SDL_ttf.h:558 TTF_HINTING_
 */
export enum TTF_HintingFlags {
  INVALID = -1, 
  NORMAL, /**< Normal hinting applies standard grid-fitting. */
  LIGHT, /**< Light hinting applies subtle adjustments to improve rendering. */
  MONO, /**< Monochrome hinting adjusts the font for better rendering at lower resolutions. */
  NONE, /**< No hinting, the font is rendered without any grid-fitting. */
  LIGHT_SUBPIXEL, /**< Light hinting with subpixel rendering for more precise font edges. */
}



/**
 * The horizontal alignment used when rendering wrapped text.
 *
 * @since This enum is available since SDL_ttf 3.0.0.
 *
 * @from SDL_ttf.h:698 TTF_HORIZONTAL_ALIGN_
 */
export enum TTF_HorizontalAlignment {
  INVALID = -1, 
  LEFT, 
  CENTER, 
  RIGHT, 
}



/**
 * Direction flags
 *
 * The values here are chosen to match
 * [hb_direction_t](https://harfbuzz.github.io/harfbuzz-hb-common.html#hb-direction-t)
 * .
 *
 * @since This enum is available since SDL_ttf 3.0.0.
 *
 * @sa TTF_SetFontDirection
 *
 * @from SDL_ttf.h:927 TTF_DIRECTION_
 */
export enum TTF_Direction {
  INVALID = 0, 
  LTR = 4, /**< Left to Right */
  RTL, /**< Right to Left */
  TTB, /**< Top to Bottom */
  BTT, /**< Bottom to Top */
}



/**
 * The type of data in a glyph image
 *
 * @since This enum is available since SDL_ttf 3.0.0.
 *
 * @from SDL_ttf.h:1099 TTF_IMAGE_
 */
export enum TTF_ImageType {
  INVALID, 
  ALPHA, /**< The color channels are white */
  COLOR, /**< The color channels have image data */
  SDF, /**< The alpha channel has signed distance field information */
}



/**
 * The winding order of the vertices returned by TTF_GetGPUTextDrawData
 *
 * @since This enum is available since SDL_ttf 3.0.0.
 *
 * @from SDL_ttf.h:2001 TTF_GPU_TEXTENGINE_WINDING_
 */
export enum TTF_GPUTextEngineWinding {
  INVALID = -1, 
  CLOCKWISE, 
  COUNTER_CLOCKWISE, 
}



