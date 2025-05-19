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

import * as _ from "../_utils.ts";
import * as _b from "../_structs/SDL_ttf.ts";
import { Rect } from "./SDL_rect.ts";


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
export interface Text {
  text: Deno.PointerValue; /**< char * : A copy of the UTF-8 string that this text object represents, useful for layout, debugging and retrieving substring text. This is updated when the text object is modified and will be freed automatically when the object is destroyed. */
  num_lines: number; /**< int : The number of lines in the text, 0 if it's empty */
  refcount: number; /**< int : Application reference count, used when freeing surface */
  internal: Deno.PointerValue; /**< TTF_TextData * : Private */
}

export function read_Text(dt: DataView): Text {
  const t = _b.TTF_Text.read(dt);
  return {
    text: Deno.UnsafePointer.create(t.text), /** char * */
    num_lines: t.num_lines, /** int */
    refcount: t.refcount, /** int */
    internal: Deno.UnsafePointer.create(t.internal), /** TTF_TextData * */
  };
}

export function write_Text(t: Text, dt: DataView) {
  _b.TTF_Text.write({
    text: Deno.UnsafePointer.value(t.text), /** char * */
    num_lines: t.num_lines, /** int */
    refcount: t.refcount, /** int */
    internal: Deno.UnsafePointer.value(t.internal), /** TTF_TextData * */
  }, dt);
}


/**
 * Draw sequence returned by TTF_GetGPUTextDrawData
 *
 * @since This struct is available since SDL_ttf 3.0.0.
 *
 * @sa TTF_GetGPUTextDrawData
 *
 * @from SDL_ttf.h:1936
 */
export interface GPUAtlasDrawSequence {
  atlas_texture: Deno.PointerValue; /**< SDL_GPUTexture * : Texture atlas that stores the glyphs */
  xy: Deno.PointerValue; /**< SDL_FPoint * : An array of vertex positions */
  uv: Deno.PointerValue; /**< SDL_FPoint * : An array of normalized texture coordinates for each vertex */
  num_vertices: number; /**< int : Number of vertices */
  indices: Deno.PointerValue; /**< int * : An array of indices into the 'vertices' arrays */
  num_indices: number; /**< int : Number of indices */
  image_type: number; /**< TTF_ImageType : The image type of this draw sequence */
  next: Deno.PointerValue; /**< struct TTF_GPUAtlasDrawSequence * : The next sequence (will be NULL in case of the last sequence) */
}

export function read_GPUAtlasDrawSequence(dt: DataView): GPUAtlasDrawSequence {
  const t = _b.TTF_GPUAtlasDrawSequence.read(dt);
  return {
    atlas_texture: Deno.UnsafePointer.create(t.atlas_texture), /** SDL_GPUTexture * */
    xy: Deno.UnsafePointer.create(t.xy), /** SDL_FPoint * */
    uv: Deno.UnsafePointer.create(t.uv), /** SDL_FPoint * */
    num_vertices: t.num_vertices, /** int */
    indices: Deno.UnsafePointer.create(t.indices), /** int * */
    num_indices: t.num_indices, /** int */
    image_type: t.image_type, /** TTF_ImageType */
    next: Deno.UnsafePointer.create(t.next), /** struct TTF_GPUAtlasDrawSequence * */
  };
}

export function write_GPUAtlasDrawSequence(t: GPUAtlasDrawSequence, dt: DataView) {
  _b.TTF_GPUAtlasDrawSequence.write({
    atlas_texture: Deno.UnsafePointer.value(t.atlas_texture), /** SDL_GPUTexture * */
    xy: Deno.UnsafePointer.value(t.xy), /** SDL_FPoint * */
    uv: Deno.UnsafePointer.value(t.uv), /** SDL_FPoint * */
    num_vertices: t.num_vertices, /** int */
    indices: Deno.UnsafePointer.value(t.indices), /** int * */
    num_indices: t.num_indices, /** int */
    image_type: t.image_type, /** TTF_ImageType */
    next: Deno.UnsafePointer.value(t.next), /** struct TTF_GPUAtlasDrawSequence * */
  }, dt);
}


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
export interface SubString {
  flags: number; /**< TTF_SubStringFlags : The flags for this substring */
  offset: number; /**< int : The byte offset from the beginning of the text */
  length: number; /**< int : The byte length starting at the offset */
  line_index: number; /**< int : The index of the line that contains this substring */
  cluster_index: number; /**< int : The internal cluster index, used for quickly iterating */
  rect: Rect; /**< SDL_Rect : The rectangle, relative to the top left of the text, containing the substring */
}

export function read_SubString(dt: DataView): SubString {
  const t = _b.TTF_SubString.read(dt);
  return {
    flags: t.flags, /** TTF_SubStringFlags */
    offset: t.offset, /** int */
    length: t.length, /** int */
    line_index: t.line_index, /** int */
    cluster_index: t.cluster_index, /** int */
    rect: t.rect, /** SDL_Rect */
  };
}

export function write_SubString(t: SubString, dt: DataView) {
  _b.TTF_SubString.write({
    flags: t.flags, /** TTF_SubStringFlags */
    offset: t.offset, /** int */
    length: t.length, /** int */
    line_index: t.line_index, /** int */
    cluster_index: t.cluster_index, /** int */
    rect: t.rect, /** SDL_Rect */
  }, dt);
}


