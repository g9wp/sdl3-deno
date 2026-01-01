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

/**
 * @from SDL_render:338 SDL_PROP_RENDERER_CREATE_
 */
export enum PROP_RENDERER_CREATE {
  NAME_STRING = "SDL.renderer.create.name", 
  WINDOW_POINTER = "SDL.renderer.create.window", 
  SURFACE_POINTER = "SDL.renderer.create.surface", 
  OUTPUT_COLORSPACE_NUMBER = "SDL.renderer.create.output_colorspace", 
  PRESENT_VSYNC_NUMBER = "SDL.renderer.create.present_vsync", 
  GPU_DEVICE_POINTER = "SDL.renderer.create.gpu.device", 
  GPU_SHADERS_SPIRV_BOOLEAN = "SDL.renderer.create.gpu.shaders_spirv", 
  GPU_SHADERS_DXIL_BOOLEAN = "SDL.renderer.create.gpu.shaders_dxil", 
  GPU_SHADERS_MSL_BOOLEAN = "SDL.renderer.create.gpu.shaders_msl", 
  VULKAN_INSTANCE_POINTER = "SDL.renderer.create.vulkan.instance", 
  VULKAN_SURFACE_NUMBER = "SDL.renderer.create.vulkan.surface", 
  VULKAN_PHYSICAL_DEVICE_POINTER = "SDL.renderer.create.vulkan.physical_device", 
  VULKAN_DEVICE_POINTER = "SDL.renderer.create.vulkan.device", 
  VULKAN_GRAPHICS_QUEUE_FAMILY_INDEX_NUMBER = "SDL.renderer.create.vulkan.graphics_queue_family_index", 
  VULKAN_PRESENT_QUEUE_FAMILY_INDEX_NUMBER = "SDL.renderer.create.vulkan.present_queue_family_index", 
}



/**
 * @from SDL_render:552 SDL_PROP_RENDERER_
 */
export enum PROP_RENDERER {
  NAME_STRING = "SDL.renderer.name", 
  WINDOW_POINTER = "SDL.renderer.window", 
  SURFACE_POINTER = "SDL.renderer.surface", 
  VSYNC_NUMBER = "SDL.renderer.vsync", 
  MAX_TEXTURE_SIZE_NUMBER = "SDL.renderer.max_texture_size", 
  TEXTURE_FORMATS_POINTER = "SDL.renderer.texture_formats", 
  TEXTURE_WRAPPING_BOOLEAN = "SDL.renderer.texture_wrapping", 
  OUTPUT_COLORSPACE_NUMBER = "SDL.renderer.output_colorspace", 
  HDR_ENABLED_BOOLEAN = "SDL.renderer.HDR_enabled", 
  SDR_WHITE_POINT_FLOAT = "SDL.renderer.SDR_white_point", 
  HDR_HEADROOM_FLOAT = "SDL.renderer.HDR_headroom", 
  D3D9_DEVICE_POINTER = "SDL.renderer.d3d9.device", 
  D3D11_DEVICE_POINTER = "SDL.renderer.d3d11.device", 
  D3D11_SWAPCHAIN_POINTER = "SDL.renderer.d3d11.swap_chain", 
  D3D12_DEVICE_POINTER = "SDL.renderer.d3d12.device", 
  D3D12_SWAPCHAIN_POINTER = "SDL.renderer.d3d12.swap_chain", 
  D3D12_COMMAND_QUEUE_POINTER = "SDL.renderer.d3d12.command_queue", 
  VULKAN_INSTANCE_POINTER = "SDL.renderer.vulkan.instance", 
  VULKAN_SURFACE_NUMBER = "SDL.renderer.vulkan.surface", 
  VULKAN_PHYSICAL_DEVICE_POINTER = "SDL.renderer.vulkan.physical_device", 
  VULKAN_DEVICE_POINTER = "SDL.renderer.vulkan.device", 
  VULKAN_GRAPHICS_QUEUE_FAMILY_INDEX_NUMBER = "SDL.renderer.vulkan.graphics_queue_family_index", 
  VULKAN_PRESENT_QUEUE_FAMILY_INDEX_NUMBER = "SDL.renderer.vulkan.present_queue_family_index", 
  VULKAN_SWAPCHAIN_IMAGE_COUNT_NUMBER = "SDL.renderer.vulkan.swapchain_image_count", 
  GPU_DEVICE_POINTER = "SDL.renderer.gpu.device", 
}



/**
 * @from SDL_render:807 SDL_PROP_TEXTURE_CREATE_
 */
export enum PROP_TEXTURE_CREATE {
  COLORSPACE_NUMBER = "SDL.texture.create.colorspace", 
  FORMAT_NUMBER = "SDL.texture.create.format", 
  ACCESS_NUMBER = "SDL.texture.create.access", 
  WIDTH_NUMBER = "SDL.texture.create.width", 
  HEIGHT_NUMBER = "SDL.texture.create.height", 
  PALETTE_POINTER = "SDL.texture.create.palette", 
  SDR_WHITE_POINT_FLOAT = "SDL.texture.create.SDR_white_point", 
  HDR_HEADROOM_FLOAT = "SDL.texture.create.HDR_headroom", 
  D3D11_TEXTURE_POINTER = "SDL.texture.create.d3d11.texture", 
  D3D11_TEXTURE_U_POINTER = "SDL.texture.create.d3d11.texture_u", 
  D3D11_TEXTURE_V_POINTER = "SDL.texture.create.d3d11.texture_v", 
  D3D12_TEXTURE_POINTER = "SDL.texture.create.d3d12.texture", 
  D3D12_TEXTURE_U_POINTER = "SDL.texture.create.d3d12.texture_u", 
  D3D12_TEXTURE_V_POINTER = "SDL.texture.create.d3d12.texture_v", 
  METAL_PIXELBUFFER_POINTER = "SDL.texture.create.metal.pixelbuffer", 
  OPENGL_TEXTURE_NUMBER = "SDL.texture.create.opengl.texture", 
  OPENGL_TEXTURE_UV_NUMBER = "SDL.texture.create.opengl.texture_uv", 
  OPENGL_TEXTURE_U_NUMBER = "SDL.texture.create.opengl.texture_u", 
  OPENGL_TEXTURE_V_NUMBER = "SDL.texture.create.opengl.texture_v", 
  OPENGLES2_TEXTURE_NUMBER = "SDL.texture.create.opengles2.texture", 
  OPENGLES2_TEXTURE_UV_NUMBER = "SDL.texture.create.opengles2.texture_uv", 
  OPENGLES2_TEXTURE_U_NUMBER = "SDL.texture.create.opengles2.texture_u", 
  OPENGLES2_TEXTURE_V_NUMBER = "SDL.texture.create.opengles2.texture_v", 
  VULKAN_TEXTURE_NUMBER = "SDL.texture.create.vulkan.texture", 
  VULKAN_LAYOUT_NUMBER = "SDL.texture.create.vulkan.layout", 
  GPU_TEXTURE_POINTER = "SDL.texture.create.gpu.texture", 
  GPU_TEXTURE_UV_POINTER = "SDL.texture.create.gpu.texture_uv", 
  GPU_TEXTURE_U_POINTER = "SDL.texture.create.gpu.texture_u", 
  GPU_TEXTURE_V_POINTER = "SDL.texture.create.gpu.texture_v", 
}



/**
 * @from SDL_render:936 SDL_PROP_TEXTURE_
 */
export enum PROP_TEXTURE {
  COLORSPACE_NUMBER = "SDL.texture.colorspace", 
  FORMAT_NUMBER = "SDL.texture.format", 
  ACCESS_NUMBER = "SDL.texture.access", 
  WIDTH_NUMBER = "SDL.texture.width", 
  HEIGHT_NUMBER = "SDL.texture.height", 
  SDR_WHITE_POINT_FLOAT = "SDL.texture.SDR_white_point", 
  HDR_HEADROOM_FLOAT = "SDL.texture.HDR_headroom", 
  D3D11_TEXTURE_POINTER = "SDL.texture.d3d11.texture", 
  D3D11_TEXTURE_U_POINTER = "SDL.texture.d3d11.texture_u", 
  D3D11_TEXTURE_V_POINTER = "SDL.texture.d3d11.texture_v", 
  D3D12_TEXTURE_POINTER = "SDL.texture.d3d12.texture", 
  D3D12_TEXTURE_U_POINTER = "SDL.texture.d3d12.texture_u", 
  D3D12_TEXTURE_V_POINTER = "SDL.texture.d3d12.texture_v", 
  OPENGL_TEXTURE_NUMBER = "SDL.texture.opengl.texture", 
  OPENGL_TEXTURE_UV_NUMBER = "SDL.texture.opengl.texture_uv", 
  OPENGL_TEXTURE_U_NUMBER = "SDL.texture.opengl.texture_u", 
  OPENGL_TEXTURE_V_NUMBER = "SDL.texture.opengl.texture_v", 
  OPENGL_TEXTURE_TARGET_NUMBER = "SDL.texture.opengl.target", 
  OPENGL_TEX_W_FLOAT = "SDL.texture.opengl.tex_w", 
  OPENGL_TEX_H_FLOAT = "SDL.texture.opengl.tex_h", 
  OPENGLES2_TEXTURE_NUMBER = "SDL.texture.opengles2.texture", 
  OPENGLES2_TEXTURE_UV_NUMBER = "SDL.texture.opengles2.texture_uv", 
  OPENGLES2_TEXTURE_U_NUMBER = "SDL.texture.opengles2.texture_u", 
  OPENGLES2_TEXTURE_V_NUMBER = "SDL.texture.opengles2.texture_v", 
  OPENGLES2_TEXTURE_TARGET_NUMBER = "SDL.texture.opengles2.target", 
  VULKAN_TEXTURE_NUMBER = "SDL.texture.vulkan.texture", 
  GPU_TEXTURE_POINTER = "SDL.texture.gpu.texture", 
  GPU_TEXTURE_UV_POINTER = "SDL.texture.gpu.texture_uv", 
  GPU_TEXTURE_U_POINTER = "SDL.texture.gpu.texture_u", 
  GPU_TEXTURE_V_POINTER = "SDL.texture.gpu.texture_v", 
}



/**
 * @from SDL_render:2777 SDL_RENDERER_VSYNC_
 */
export enum RENDERER_VSYNC {
  DISABLED = 0, 
  ADAPTIVE = (-1), 
}



/**
 * The access pattern allowed for a texture.
 *
 * @since This enum is available since SDL 3.2.0.
 *
 * @from SDL_render.h:100 SDL_TEXTUREACCESS_
 */
export enum SDL_TextureAccess {
  STATIC, /**< Changes rarely, not lockable */
  STREAMING, /**< Changes frequently, lockable */
  TARGET, /**< Texture can be used as a render target */
}



/**
 * The addressing mode for a texture when used in SDL_RenderGeometry().
 *
 * This affects how texture coordinates are interpreted outside of [0, 1]
 *
 * Texture wrapping is always supported for power of two texture sizes, and is
 * supported for other texture sizes if
 * SDL_PROP_RENDERER_TEXTURE_WRAPPING_BOOLEAN is set to true.
 *
 * @since This enum is available since SDL 3.4.0.
 *
 * @from SDL_render.h:118 SDL_TEXTURE_ADDRESS_
 */
export enum SDL_TextureAddressMode {
  INVALID = -1, 
  AUTO, /**< Wrapping is enabled if texture coordinates are outside [0, 1], this is the default */
  CLAMP, /**< Texture coordinates are clamped to the [0, 1] range */
  WRAP, /**< The texture is repeated (tiled) */
}



/**
 * How the logical size is mapped to the output.
 *
 * @since This enum is available since SDL 3.2.0.
 *
 * @from SDL_render.h:131 SDL_LOGICAL_PRESENTATION_
 */
export enum SDL_RendererLogicalPresentation {
  DISABLED, /**< There is no logical size in effect */
  STRETCH, /**< The rendered content is stretched to the output resolution */
  LETTERBOX, /**< The rendered content is fit to the largest dimension and the other dimension is letterboxed with the clear color */
  OVERSCAN, /**< The rendered content is fit to the smallest dimension and the other dimension extends beyond the output bounds */
  INTEGER_SCALE, /**< The rendered content is scaled up by integer multiples to fit the output resolution */
}



