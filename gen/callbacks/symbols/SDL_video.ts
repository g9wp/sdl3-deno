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

export const symbols = {
/**
 * EGL platform attribute initialization callback.
 *
 * This is called when SDL is attempting to create an EGL context, to let the
 * app add extra attributes to its eglGetPlatformDisplay() call.
 *
 * The callback should return a pointer to an EGL attribute array terminated
 * with `EGL_NONE`. If this function returns NULL, the SDL_CreateWindow
 * process will fail gracefully.
 *
 * The returned pointer should be allocated with SDL_malloc() and will be
 * passed to SDL_free().
 *
 * The arrays returned by each callback will be appended to the existing
 * attribute arrays defined by SDL.
 *
 * @param userdata an app-controlled pointer that is passed to the callback.
 * @returns a newly-allocated array of attributes, terminated with `EGL_NONE`.
 *
 * @since This datatype is available since SDL 3.2.0.
 *
 * @sa SDL_EGL_SetAttributeCallbacks
 *
 * @from SDL_video.h:419 typedef SDL_EGLAttrib *(*SDL_EGLAttribArrayCallback)(void *userdata);
 */
SDL_EGLAttribArrayCallback: {
      parameters: ["pointer"],
      result: "pointer"
    },

} as const satisfies Deno.ForeignLibraryInterface;


/**
 * EGL platform attribute initialization callback.
 *
 * This is called when SDL is attempting to create an EGL context, to let the
 * app add extra attributes to its eglGetPlatformDisplay() call.
 *
 * The callback should return a pointer to an EGL attribute array terminated
 * with `EGL_NONE`. If this function returns NULL, the SDL_CreateWindow
 * process will fail gracefully.
 *
 * The returned pointer should be allocated with SDL_malloc() and will be
 * passed to SDL_free().
 *
 * The arrays returned by each callback will be appended to the existing
 * attribute arrays defined by SDL.
 *
 * @param userdata an app-controlled pointer that is passed to the callback.
 * @returns a newly-allocated array of attributes, terminated with `EGL_NONE`.
 *
 * @since This datatype is available since SDL 3.2.0.
 *
 * @sa SDL_EGL_SetAttributeCallbacks
 *
 * @from SDL_video.h:419 typedef SDL_EGLAttrib *(*SDL_EGLAttribArrayCallback)(void *userdata);
 */
export function EGLAttribArrayCallback(cb: (
    userdata: Deno.PointerValue, 
  ) => Deno.PointerValue) {
  return new Deno.UnsafeCallback(symbols.SDL_EGLAttribArrayCallback, cb);
}

