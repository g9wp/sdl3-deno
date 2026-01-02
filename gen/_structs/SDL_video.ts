/**
 * # CategoryVideo
 *
 * SDL's video subsystem is largely interested in abstracting window
 * management from the underlying operating system. You can create windows,
 * manage them in various ways, set them fullscreen, and get events when
 * interesting things happen with them, such as the mouse or keyboard
 * interacting with a window.
 *
 * The video subsystem is also interested in abstracting away some
 * platform-specific differences in OpenGL: context creation, swapping
 * buffers, etc. This may be crucial to your app, but also you are not
 * required to use OpenGL at all. In fact, SDL can provide rendering to those
 * windows as well, either with an easy-to-use
 * [2D API](https://wiki.libsdl.org/SDL3/CategoryRender)
 * or with a more-powerful
 * [GPU API](https://wiki.libsdl.org/SDL3/CategoryGPU)
 * . Of course, it can simply get out of your way and give you the window
 * handles you need to use Vulkan, Direct3D, Metal, or whatever else you like
 * directly, too.
 *
 * The video subsystem covers a lot of functionality, out of necessity, so it
 * is worth perusing the list of functions just to see what's available, but
 * most apps can get by with simply creating a window and listening for
 * events, so start with SDL_CreateWindow() and SDL_PollEvent().
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

import * as _ from "@denosaurs/byte-type";


/**
 * The structure that defines a display mode.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @sa SDL_GetFullscreenDisplayModes
 * @sa SDL_GetDesktopDisplayMode
 * @sa SDL_GetCurrentDisplayMode
 * @sa SDL_SetWindowFullscreenMode
 * @sa SDL_GetWindowFullscreenMode
 *
 * @from SDL_video.h:138
 */
export const SDL_DisplayMode = new _.Struct({
  displayID: _.u32, /**< SDL_DisplayID : the display this mode is associated with */
  format: _.u32, /**< SDL_PixelFormat : pixel format */
  w: _.i32, /**< int : width */
  h: _.i32, /**< int : height */
  pixel_density: _.f32, /**< float : scale converting size to pixels (e.g. a 1920x1080 mode with 2.0 scale would have 3840x2160 pixels) */
  refresh_rate: _.f32, /**< float : refresh rate (or 0.0f for unspecified) */
  refresh_rate_numerator: _.i32, /**< int : precise refresh rate numerator (or 0 for unspecified) */
  refresh_rate_denominator: _.i32, /**< int : precise refresh rate denominator */
  internal: _.u64, /**< SDL_DisplayModeData * : Private */
});



