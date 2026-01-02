/**
 * # CategoryRender
 *
 * Header file for SDL 2D rendering functions.
 *
 * This API supports the following features:
 *
 * - single pixel points
 * - single pixel lines
 * - filled rectangles
 * - texture images
 * - 2D polygons
 *
 * The primitives may be drawn in opaque, blended, or additive modes.
 *
 * The texture images may be drawn in opaque, blended, or additive modes. They
 * can have an additional color tint or alpha modulation applied to them, and
 * may also be stretched with linear interpolation.
 *
 * This API is designed to accelerate simple 2D operations. You may want more
 * functionality such as 3D polygons and particle effects, and in that case
 * you should use SDL's OpenGL/Direct3D support, the SDL3 GPU API, or one of
 * the many good 3D engines.
 *
 * These functions must be called from the main thread. See this bug for
 * details: https://github.com/libsdl-org/SDL/issues/986
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
import * as _b from "../_structs/SDL_render.ts";
import { FPoint } from "./SDL_rect.ts";
import { FColor } from "./SDL_pixels.ts";


/**
 * Vertex structure.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @from SDL_render.h:88
 */
export interface Vertex {
  position: { x: number; y: number; }; /**< SDL_FPoint : Vertex position, in SDL_Renderer coordinates  */
  color: { r: number; g: number; b: number; a: number; }; /**< SDL_FColor : Vertex color */
  tex_coord: { x: number; y: number; }; /**< SDL_FPoint : Normalized texture coordinates, if needed */
}

export function read_Vertex(dt: DataView): Vertex {
  const t = _b.SDL_Vertex.read(dt);
  return {
    position: t.position, /** SDL_FPoint */
    color: t.color, /** SDL_FColor */
    tex_coord: t.tex_coord, /** SDL_FPoint */
  };
}

export function write_Vertex(t: Vertex, dt: DataView) {
  _b.SDL_Vertex.write({
    position: t.position, /** SDL_FPoint */
    color: t.color, /** SDL_FColor */
    tex_coord: t.tex_coord, /** SDL_FPoint */
  }, dt);
}


/**
 * An efficient driver-specific representation of pixel data
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @sa SDL_CreateTexture
 * @sa SDL_CreateTextureFromSurface
 * @sa SDL_CreateTextureWithProperties
 * @sa SDL_DestroyTexture
 *
 * @from SDL_render.h:159
 */
export interface Texture {
  format: number; /**< SDL_PixelFormat : The format of the texture, read-only */
  w: number; /**< int : The width of the texture, read-only. */
  h: number; /**< int : The height of the texture, read-only. */
  refcount: number; /**< int : Application reference count, used when freeing texture */
}

export function read_Texture(dt: DataView): Texture {
  const t = _b.SDL_Texture.read(dt);
  return {
    format: t.format, /** SDL_PixelFormat */
    w: t.w, /** int */
    h: t.h, /** int */
    refcount: t.refcount, /** int */
  };
}

export function write_Texture(t: Texture, dt: DataView) {
  _b.SDL_Texture.write({
    format: t.format, /** SDL_PixelFormat */
    w: t.w, /** int */
    h: t.h, /** int */
    refcount: t.refcount, /** int */
  }, dt);
}


/**
 * A structure specifying the parameters of a GPU render state.
 *
 * @since This struct is available since SDL 3.4.0.
 *
 * @sa SDL_CreateGPURenderState
 *
 * @from SDL_render.h:2920
 */
export interface GPURenderStateCreateInfo {
  fragment_shader: Deno.PointerValue; /**< SDL_GPUShader * : The fragment shader to use when this render state is active */
  num_sampler_bindings: number; /**< Sint32 : The number of additional fragment samplers to bind when this render state is active */
  sampler_bindings: Deno.PointerValue; /**< const SDL_GPUTextureSamplerBinding * : Additional fragment samplers to bind when this render state is active */
  num_storage_textures: number; /**< Sint32 : The number of storage textures to bind when this render state is active */
  storage_textures: Deno.PointerValue; /**< SDL_GPUTexture *const * : Storage textures to bind when this render state is active */
  num_storage_buffers: number; /**< Sint32 : The number of storage buffers to bind when this render state is active */
  storage_buffers: Deno.PointerValue; /**< SDL_GPUBuffer *const * : Storage buffers to bind when this render state is active */
  props: number; /**< SDL_PropertiesID : A properties ID for extensions. Should be 0 if no extensions are needed. */
}

export function read_GPURenderStateCreateInfo(dt: DataView): GPURenderStateCreateInfo {
  const t = _b.SDL_GPURenderStateCreateInfo.read(dt);
  return {
    fragment_shader: Deno.UnsafePointer.create(t.fragment_shader), /** SDL_GPUShader * */
    num_sampler_bindings: t.num_sampler_bindings, /** Sint32 */
    sampler_bindings: Deno.UnsafePointer.create(t.sampler_bindings), /** const SDL_GPUTextureSamplerBinding * */
    num_storage_textures: t.num_storage_textures, /** Sint32 */
    storage_textures: Deno.UnsafePointer.create(t.storage_textures), /** SDL_GPUTexture *const * */
    num_storage_buffers: t.num_storage_buffers, /** Sint32 */
    storage_buffers: Deno.UnsafePointer.create(t.storage_buffers), /** SDL_GPUBuffer *const * */
    props: t.props, /** SDL_PropertiesID */
  };
}

export function write_GPURenderStateCreateInfo(t: GPURenderStateCreateInfo, dt: DataView) {
  _b.SDL_GPURenderStateCreateInfo.write({
    fragment_shader: Deno.UnsafePointer.value(t.fragment_shader), /** SDL_GPUShader * */
    num_sampler_bindings: t.num_sampler_bindings, /** Sint32 */
    sampler_bindings: Deno.UnsafePointer.value(t.sampler_bindings), /** const SDL_GPUTextureSamplerBinding * */
    num_storage_textures: t.num_storage_textures, /** Sint32 */
    storage_textures: Deno.UnsafePointer.value(t.storage_textures), /** SDL_GPUTexture *const * */
    num_storage_buffers: t.num_storage_buffers, /** Sint32 */
    storage_buffers: Deno.UnsafePointer.value(t.storage_buffers), /** SDL_GPUBuffer *const * */
    props: t.props, /** SDL_PropertiesID */
  }, dt);
}


