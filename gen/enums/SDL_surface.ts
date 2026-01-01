/**
 * # CategorySurface
 *
 * SDL surfaces are buffers of pixels in system RAM. These are useful for
 * passing around and manipulating images that are not stored in GPU memory.
 *
 * SDL_Surface makes serious efforts to manage images in various formats, and
 * provides a reasonable toolbox for transforming the data, including copying
 * between surfaces, filling rectangles in the image data, etc.
 *
 * There is also a simple .bmp loader, SDL_LoadBMP(), and a simple .png
 * loader, SDL_LoadPNG(). SDL itself does not provide loaders for other file
 * formats, but there are several excellent external libraries that do,
 * including its own satellite library,
 * [SDL_image](https://wiki.libsdl.org/SDL3_image)
 * .
 *
 * In general these functions are thread-safe in that they can be called on
 * different threads with different surfaces. You should not try to modify any
 * surface from two threads simultaneously.
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
 * @from SDL_surface:69 SDL_SURFACE_
 */
export enum SURFACE {
  PREALLOCATED = 0x00000001, /**< Surface uses preallocated pixel memory */
  LOCK_NEEDED = 0x00000002, /**< Surface needs to be locked to access pixels */
  LOCKED = 0x00000004, /**< Surface is currently locked */
  SIMD_ALIGNED = 0x00000008, /**< Surface uses pixel memory allocated with SDL_aligned_alloc() */
}



/**
 * @from SDL_surface:260 SDL_PROP_SURFACE_
 */
export enum PROP_SURFACE {
  SDR_WHITE_POINT_FLOAT = "SDL.surface.SDR_white_point", 
  HDR_HEADROOM_FLOAT = "SDL.surface.HDR_headroom", 
  TONEMAP_OPERATOR_STRING = "SDL.surface.tonemap", 
  HOTSPOT_X_NUMBER = "SDL.surface.hotspot.x", 
  HOTSPOT_Y_NUMBER = "SDL.surface.hotspot.y", 
  ROTATION_FLOAT = "SDL.surface.rotation", 
}



/**
 * The scaling mode.
 *
 * @since This enum is available since SDL 3.2.0.
 *
 * @from SDL_surface.h:86 SDL_SCALEMODE_
 */
export enum SDL_ScaleMode {
  INVALID = -1, 
  NEAREST, /**< nearest pixel sampling */
  LINEAR, /**< linear filtering */
  PIXELART, /**< nearest pixel sampling with improved scaling for pixel art, available since SDL 3.4.0 */
}



/**
 * The flip mode.
 *
 * @since This enum is available since SDL 3.2.0.
 *
 * @from SDL_surface.h:99 SDL_FLIP_
 */
export enum SDL_FlipMode {
  NONE, /**< Do not flip */
  HORIZONTAL, /**< flip horizontally */
  VERTICAL, /**< flip vertically */
  HORIZONTAL_AND_VERTICAL = (HORIZONTAL | VERTICAL)    , /**< flip horizontally and vertically (not a diagonal flip) */
}



