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

import * as _ from "@denosaurs/byte-type";
import { SDL_Rect } from "./SDL_rect.ts";


/**
 * Text created with TTF_CreateText()
 *
 * @since This struct is available since SDL_ttf 3.0.0.
 *
 * @sa TTF_CreateText
 * @sa TTF_GetTextProperties
 * @sa TTF_DestroyText
 *
 * @from SDL_ttf.h:1722
 */
export const TTF_Text = new _.Struct({
  text: _.u64, /**< char * : A copy of the UTF-8 string that this text object represents, useful for layout, debugging and retrieving substring text. This is updated when the text object is modified and will be freed automatically when the object is destroyed. */
  num_lines: _.i32, /**< int : The number of lines in the text, 0 if it's empty */
  refcount: _.i32, /**< int : Application reference count, used when freeing surface */
  internal: _.u64, /**< TTF_TextData * : Private */
});



/**
 * Draw sequence returned by TTF_GetGPUTextDrawData
 *
 * @since This struct is available since SDL_ttf 3.0.0.
 *
 * @sa TTF_GetGPUTextDrawData
 *
 * @from SDL_ttf.h:1936
 */
export const TTF_GPUAtlasDrawSequence = new _.Struct({
  atlas_texture: _.u64, /**< SDL_GPUTexture * : Texture atlas that stores the glyphs */
  xy: _.u64, /**< SDL_FPoint * : An array of vertex positions */
  uv: _.u64, /**< SDL_FPoint * : An array of normalized texture coordinates for each vertex */
  num_vertices: _.i32, /**< int : Number of vertices */
  indices: _.u64, /**< int * : An array of indices into the 'vertices' arrays */
  num_indices: _.i32, /**< int : Number of indices */
  image_type: _.u32, /**< TTF_ImageType : The image type of this draw sequence */
  next: _.u64, /**< struct TTF_GPUAtlasDrawSequence * : The next sequence (will be NULL in case of the last sequence) */
});



/**
 * The representation of a substring within text.
 *
 * @since This struct is available since SDL_ttf 3.0.0.
 *
 * @sa TTF_GetNextTextSubString
 * @sa TTF_GetPreviousTextSubString
 * @sa TTF_GetTextSubString
 * @sa TTF_GetTextSubStringForLine
 * @sa TTF_GetTextSubStringForPoint
 * @sa TTF_GetTextSubStringsForRange
 *
 * @from SDL_ttf.h:2587
 */
export const TTF_SubString = new _.Struct({
  flags: _.u32, /**< TTF_SubStringFlags : The flags for this substring */
  offset: _.i32, /**< int : The byte offset from the beginning of the text */
  length: _.i32, /**< int : The byte length starting at the offset */
  line_index: _.i32, /**< int : The index of the line that contains this substring */
  cluster_index: _.i32, /**< int : The internal cluster index, used for quickly iterating */
  rect: SDL_Rect, /**< SDL_Rect : The rectangle, relative to the top left of the text, containing the substring */
});



