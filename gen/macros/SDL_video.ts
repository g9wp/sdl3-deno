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

/**
 * The pointer to the global `wl_display` object used by the Wayland video
 * backend.
 *
 * Can be set before the video subsystem is initialized to import an external
 * `wl_display` object from an application or toolkit for use in SDL, or read
 * after initialization to export the `wl_display` used by the Wayland video
 * backend. Setting this property after the video subsystem has been
 * initialized has no effect, and reading it when the video subsystem is
 * uninitialized will either return the user provided value, if one was set
 * prior to initialization, or NULL. See docs/README-wayland.md for more
 * information.
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @from SDL_video.h:102
 */
export const SDL_PROP_GLOBAL_VIDEO_WAYLAND_WL_DISPLAY_POINTER = "SDL.video.wayland.wl_display";

/**
 * A magic value used with SDL_WINDOWPOS_UNDEFINED.
 *
 * Generally this macro isn't used directly, but rather through
 * SDL_WINDOWPOS_UNDEFINED or SDL_WINDOWPOS_UNDEFINED_DISPLAY.
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @sa SDL_SetWindowPosition
 *
 * @from SDL_video.h:234
 */
export const SDL_WINDOWPOS_UNDEFINED_MASK = 0x1FFF0000;

/**
 * Used to indicate that you don't care what the window position/display is.
 *
 * This always uses the primary display.
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @sa SDL_SetWindowPosition
 *
 * @from SDL_video.h:259
 */
// export const SDL_WINDOWPOS_UNDEFINED = SDL_WINDOWPOS_UNDEFINED_DISPLAY(0);

/**
 * A magic value used with SDL_WINDOWPOS_CENTERED.
 *
 * Generally this macro isn't used directly, but rather through
 * SDL_WINDOWPOS_CENTERED or SDL_WINDOWPOS_CENTERED_DISPLAY.
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @sa SDL_SetWindowPosition
 *
 * @from SDL_video.h:282
 */
export const SDL_WINDOWPOS_CENTERED_MASK = 0x2FFF0000;

/**
 * Used to indicate that the window position should be centered.
 *
 * This always uses the primary display.
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @sa SDL_SetWindowPosition
 *
 * @from SDL_video.h:307
 */
// export const SDL_WINDOWPOS_CENTERED = SDL_WINDOWPOS_CENTERED_DISPLAY(0);
