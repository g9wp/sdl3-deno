/**
 * # CategoryBlendmode
 *
 * Blend modes decide how two colors will mix together. There are both
 * standard modes for basic needs and a means to create custom modes,
 * dictating what sort of math to do on what color components.
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

/**
 * @from SDL_blendmode:53 SDL_BLENDMODE_
 */
export enum BLENDMODE {
  NONE = 0x00000000, /**< no blending: dstRGBA = srcRGBA */
  BLEND = 0x00000001, /**< alpha blending: dstRGB = (srcRGB * srcA) + (dstRGB * (1-srcA)), dstA = srcA + (dstA * (1-srcA)) */
  BLEND_PREMULTIPLIED = 0x00000010, /**< pre-multiplied alpha blending: dstRGBA = srcRGBA + (dstRGBA * (1-srcA)) */
  ADD = 0x00000002, /**< additive blending: dstRGB = (srcRGB * srcA) + dstRGB, dstA = dstA */
  ADD_PREMULTIPLIED = 0x00000020, /**< pre-multiplied additive blending: dstRGB = srcRGB + dstRGB, dstA = dstA */
  MOD = 0x00000004, /**< color modulate: dstRGB = srcRGB * dstRGB, dstA = dstA */
  MUL = 0x00000008, /**< color multiply: dstRGB = (srcRGB * dstRGB) + (dstRGB * (1-srcA)), dstA = dstA */
  INVALID = 0x7FFFFFFF, 
}



/**
 * The blend operation used when combining source and destination pixel
 * components.
 *
 * @since This enum is available since SDL 3.2.0.
 *
 * @from SDL_blendmode.h:68 SDL_BLENDOPERATION_
 */
export enum SDL_BlendOperation {
  ADD = 0x1, /**< dst + src: supported by all renderers */
  SUBTRACT = 0x2, /**< src - dst : supported by D3D, OpenGL, OpenGLES, and Vulkan */
  REV_SUBTRACT = 0x3, /**< dst - src : supported by D3D, OpenGL, OpenGLES, and Vulkan */
  MINIMUM = 0x4, /**< min(dst, src) : supported by D3D, OpenGL, OpenGLES, and Vulkan */
  MAXIMUM = 0x5   , /**< max(dst, src) : supported by D3D, OpenGL, OpenGLES, and Vulkan */
}



/**
 * The normalized factor used to multiply pixel components.
 *
 * The blend factors are multiplied with the pixels from a drawing operation
 * (src) and the pixels from the render target (dst) before the blend
 * operation. The comma-separated factors listed above are always applied in
 * the component order red, green, blue, and alpha.
 *
 * @since This enum is available since SDL 3.2.0.
 *
 * @from SDL_blendmode.h:87 SDL_BLENDFACTOR_
 */
export enum SDL_BlendFactor {
  ZERO = 0x1, /**< 0, 0, 0, 0 */
  ONE = 0x2, /**< 1, 1, 1, 1 */
  SRC_COLOR = 0x3, /**< srcR, srcG, srcB, srcA */
  ONE_MINUS_SRC_COLOR = 0x4, /**< 1-srcR, 1-srcG, 1-srcB, 1-srcA */
  SRC_ALPHA = 0x5, /**< srcA, srcA, srcA, srcA */
  ONE_MINUS_SRC_ALPHA = 0x6, /**< 1-srcA, 1-srcA, 1-srcA, 1-srcA */
  DST_COLOR = 0x7, /**< dstR, dstG, dstB, dstA */
  ONE_MINUS_DST_COLOR = 0x8, /**< 1-dstR, 1-dstG, 1-dstB, 1-dstA */
  DST_ALPHA = 0x9, /**< dstA, dstA, dstA, dstA */
  ONE_MINUS_DST_ALPHA = 0xA   , /**< 1-dstA, 1-dstA, 1-dstA, 1-dstA */
}



