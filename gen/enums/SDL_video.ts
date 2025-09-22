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
 * @from SDL_video:188 SDL_WINDOW_
 */
export enum WINDOW {
  FULLSCREEN = (0x0000000000000001), /**< window is in fullscreen mode */
  OPENGL = (0x0000000000000002), /**< window usable with OpenGL context */
  OCCLUDED = (0x0000000000000004), /**< window is occluded */
  HIDDEN = (0x0000000000000008), /**< window is neither mapped onto the desktop nor shown in the taskbar/dock/window list; SDL_ShowWindow() is required for it to become visible */
  BORDERLESS = (0x0000000000000010), /**< no window decoration */
  RESIZABLE = (0x0000000000000020), /**< window can be resized */
  MINIMIZED = (0x0000000000000040), /**< window is minimized */
  MAXIMIZED = (0x0000000000000080), /**< window is maximized */
  MOUSE_GRABBED = (0x0000000000000100), /**< window has grabbed mouse input */
  INPUT_FOCUS = (0x0000000000000200), /**< window has input focus */
  MOUSE_FOCUS = (0x0000000000000400), /**< window has mouse focus */
  EXTERNAL = (0x0000000000000800), /**< window not created by SDL */
  MODAL = (0x0000000000001000), /**< window is modal */
  HIGH_PIXEL_DENSITY = (0x0000000000002000), /**< window uses high pixel density back buffer if possible */
  MOUSE_CAPTURE = (0x0000000000004000), /**< window has mouse captured (unrelated to MOUSE_GRABBED) */
  MOUSE_RELATIVE_MODE = (0x0000000000008000), /**< window has relative mode enabled */
  ALWAYS_ON_TOP = (0x0000000000010000), /**< window should always be above others */
  UTILITY = (0x0000000000020000), /**< window should be treated as a utility window, not showing in the task bar and window list */
  TOOLTIP = (0x0000000000040000), /**< window should be treated as a tooltip and does not get mouse or keyboard focus, requires a parent window */
  POPUP_MENU = (0x0000000000080000), /**< window should be treated as a popup menu, requires a parent window */
  KEYBOARD_GRABBED = (0x0000000000100000), /**< window has grabbed keyboard input */
  VULKAN = (0x0000000010000000), /**< window usable for Vulkan surface */
  METAL = (0x0000000020000000), /**< window usable for Metal view */
  TRANSPARENT = (0x0000000040000000), /**< window with transparent buffer */
  NOT_FOCUSABLE = (0x0000000080000000), /**< window should not be focusable */
}



/**
 * @from SDL_video:465 SDL_GL_CONTEXT_PROFILE_
 */
export enum GL_CONTEXT_PROFILE {
  CORE = 0x0001, /**< OpenGL Core Profile context */
  COMPATIBILITY = 0x0002, /**< OpenGL Compatibility Profile context */
  ES = 0x0004, /**< GLX_CONTEXT_ES2_PROFILE_BIT_EXT */
}



/**
 * @from SDL_video:477 SDL_GL_CONTEXT_
 */
export enum GL_CONTEXT {
  DEBUG_FLAG = 0x0001, 
  FORWARD_COMPATIBLE_FLAG = 0x0002, 
  ROBUST_ACCESS_FLAG = 0x0004, 
  RESET_ISOLATION_FLAG = 0x0008, 
}



/**
 * @from SDL_video:491 SDL_GL_CONTEXT_RELEASE_BEHAVIOR_
 */
export enum GL_CONTEXT_RELEASE_BEHAVIOR {
  NONE = 0x0000, 
  FLUSH = 0x0001, 
}



/**
 * @from SDL_video:502 SDL_GL_CONTEXT_RESET_
 */
export enum GL_CONTEXT_RESET {
  NO_NOTIFICATION = 0x0000, 
  LOSE_CONTEXT = 0x0001, 
}



/**
 * @from SDL_video:629 SDL_PROP_DISPLAY_
 */
export enum PROP_DISPLAY {
  HDR_ENABLED_BOOLEAN = "SDL.display.HDR_enabled", 
  KMSDRM_PANEL_ORIENTATION_NUMBER = "SDL.display.KMSDRM.panel_orientation", 
}



/**
 * @from SDL_video:1333 SDL_PROP_WINDOW_CREATE_
 */
export enum PROP_WINDOW_CREATE {
  ALWAYS_ON_TOP_BOOLEAN = "SDL.window.create.always_on_top", 
  BORDERLESS_BOOLEAN = "SDL.window.create.borderless", 
  CONSTRAIN_POPUP_BOOLEAN = "SDL.window.create.constrain_popup", 
  FOCUSABLE_BOOLEAN = "SDL.window.create.focusable", 
  EXTERNAL_GRAPHICS_CONTEXT_BOOLEAN = "SDL.window.create.external_graphics_context", 
  FLAGS_NUMBER = "SDL.window.create.flags", 
  FULLSCREEN_BOOLEAN = "SDL.window.create.fullscreen", 
  HEIGHT_NUMBER = "SDL.window.create.height", 
  HIDDEN_BOOLEAN = "SDL.window.create.hidden", 
  HIGH_PIXEL_DENSITY_BOOLEAN = "SDL.window.create.high_pixel_density", 
  MAXIMIZED_BOOLEAN = "SDL.window.create.maximized", 
  MENU_BOOLEAN = "SDL.window.create.menu", 
  METAL_BOOLEAN = "SDL.window.create.metal", 
  MINIMIZED_BOOLEAN = "SDL.window.create.minimized", 
  MODAL_BOOLEAN = "SDL.window.create.modal", 
  MOUSE_GRABBED_BOOLEAN = "SDL.window.create.mouse_grabbed", 
  OPENGL_BOOLEAN = "SDL.window.create.opengl", 
  PARENT_POINTER = "SDL.window.create.parent", 
  RESIZABLE_BOOLEAN = "SDL.window.create.resizable", 
  TITLE_STRING = "SDL.window.create.title", 
  TRANSPARENT_BOOLEAN = "SDL.window.create.transparent", 
  TOOLTIP_BOOLEAN = "SDL.window.create.tooltip", 
  UTILITY_BOOLEAN = "SDL.window.create.utility", 
  VULKAN_BOOLEAN = "SDL.window.create.vulkan", 
  WIDTH_NUMBER = "SDL.window.create.width", 
  X_NUMBER = "SDL.window.create.x", 
  Y_NUMBER = "SDL.window.create.y", 
  COCOA_WINDOW_POINTER = "SDL.window.create.cocoa.window", 
  COCOA_VIEW_POINTER = "SDL.window.create.cocoa.view", 
  WAYLAND_SURFACE_ROLE_CUSTOM_BOOLEAN = "SDL.window.create.wayland.surface_role_custom", 
  WAYLAND_CREATE_EGL_WINDOW_BOOLEAN = "SDL.window.create.wayland.create_egl_window", 
  WAYLAND_WL_SURFACE_POINTER = "SDL.window.create.wayland.wl_surface", 
  WIN32_HWND_POINTER = "SDL.window.create.win32.hwnd", 
  WIN32_PIXEL_FORMAT_HWND_POINTER = "SDL.window.create.win32.pixel_format_hwnd", 
  X11_WINDOW_NUMBER = "SDL.window.create.x11.window", 
}



/**
 * @from SDL_video:1542 SDL_PROP_WINDOW_
 */
export enum PROP_WINDOW {
  SHAPE_POINTER = "SDL.window.shape", 
  HDR_ENABLED_BOOLEAN = "SDL.window.HDR_enabled", 
  SDR_WHITE_LEVEL_FLOAT = "SDL.window.SDR_white_level", 
  HDR_HEADROOM_FLOAT = "SDL.window.HDR_headroom", 
  ANDROID_WINDOW_POINTER = "SDL.window.android.window", 
  ANDROID_SURFACE_POINTER = "SDL.window.android.surface", 
  UIKIT_WINDOW_POINTER = "SDL.window.uikit.window", 
  UIKIT_METAL_VIEW_TAG_NUMBER = "SDL.window.uikit.metal_view_tag", 
  UIKIT_OPENGL_FRAMEBUFFER_NUMBER = "SDL.window.uikit.opengl.framebuffer", 
  UIKIT_OPENGL_RENDERBUFFER_NUMBER = "SDL.window.uikit.opengl.renderbuffer", 
  UIKIT_OPENGL_RESOLVE_FRAMEBUFFER_NUMBER = "SDL.window.uikit.opengl.resolve_framebuffer", 
  KMSDRM_DEVICE_INDEX_NUMBER = "SDL.window.kmsdrm.dev_index", 
  KMSDRM_DRM_FD_NUMBER = "SDL.window.kmsdrm.drm_fd", 
  KMSDRM_GBM_DEVICE_POINTER = "SDL.window.kmsdrm.gbm_dev", 
  COCOA_WINDOW_POINTER = "SDL.window.cocoa.window", 
  COCOA_METAL_VIEW_TAG_NUMBER = "SDL.window.cocoa.metal_view_tag", 
  OPENVR_OVERLAY_ID = "SDL.window.openvr.overlay_id", 
  VIVANTE_DISPLAY_POINTER = "SDL.window.vivante.display", 
  VIVANTE_WINDOW_POINTER = "SDL.window.vivante.window", 
  VIVANTE_SURFACE_POINTER = "SDL.window.vivante.surface", 
  WIN32_HWND_POINTER = "SDL.window.win32.hwnd", 
  WIN32_HDC_POINTER = "SDL.window.win32.hdc", 
  WIN32_INSTANCE_POINTER = "SDL.window.win32.instance", 
  WAYLAND_DISPLAY_POINTER = "SDL.window.wayland.display", 
  WAYLAND_SURFACE_POINTER = "SDL.window.wayland.surface", 
  WAYLAND_VIEWPORT_POINTER = "SDL.window.wayland.viewport", 
  WAYLAND_EGL_WINDOW_POINTER = "SDL.window.wayland.egl_window", 
  WAYLAND_XDG_SURFACE_POINTER = "SDL.window.wayland.xdg_surface", 
  WAYLAND_XDG_TOPLEVEL_POINTER = "SDL.window.wayland.xdg_toplevel", 
  WAYLAND_XDG_TOPLEVEL_EXPORT_HANDLE_STRING = "SDL.window.wayland.xdg_toplevel_export_handle", 
  WAYLAND_XDG_POPUP_POINTER = "SDL.window.wayland.xdg_popup", 
  WAYLAND_XDG_POSITIONER_POINTER = "SDL.window.wayland.xdg_positioner", 
  X11_DISPLAY_POINTER = "SDL.window.x11.display", 
  X11_SCREEN_NUMBER = "SDL.window.x11.screen", 
  X11_WINDOW_NUMBER = "SDL.window.x11.window", 
}



/**
 * @from SDL_video:2337 SDL_WINDOW_SURFACE_VSYNC_
 */
export enum WINDOW_SURFACE_VSYNC {
  DISABLED = 0, 
  ADAPTIVE = (-1), 
}



/**
 * System theme.
 *
 * @since This enum is available since SDL 3.2.0.
 *
 * @from SDL_video.h:107 SDL_SYSTEM_THEME_
 */
export enum SDL_SystemTheme {
  UNKNOWN, /**< Unknown system theme */
  LIGHT, /**< Light colored system theme */
  DARK, /**< Dark colored system theme */
}



/**
 * Display orientation values; the way a display is rotated.
 *
 * @since This enum is available since SDL 3.2.0.
 *
 * @from SDL_video.h:156 SDL_ORIENTATION_
 */
export enum SDL_DisplayOrientation {
  UNKNOWN, /**< The display orientation can't be determined */
  LANDSCAPE, /**< The display is in landscape mode, with the right side up, relative to portrait mode */
  LANDSCAPE_FLIPPED, /**< The display is in landscape mode, with the left side up, relative to portrait mode */
  PORTRAIT, /**< The display is in portrait mode */
  PORTRAIT_FLIPPED, /**< The display is in portrait mode, upside down */
}



/**
 * Window flash operation.
 *
 * @since This enum is available since SDL 3.2.0.
 *
 * @from SDL_video.h:302 SDL_FLASH_
 */
export enum SDL_FlashOperation {
  CANCEL, /**< Cancel any window flash state */
  BRIEFLY, /**< Flash the window briefly to get attention */
  UNTIL_FOCUSED, /**< Flash the window until it gets focus */
}



/**
 * An enumeration of OpenGL configuration attributes.
 *
 * While you can set most OpenGL attributes normally, the attributes listed
 * above must be known before SDL creates the window that will be used with
 * the OpenGL context. These attributes are set and read with
 * SDL_GL_SetAttribute() and SDL_GL_GetAttribute().
 *
 * In some cases, these attributes are minimum requests; the GL does not
 * promise to give you exactly what you asked for. It's possible to ask for a
 * 16-bit depth buffer and get a 24-bit one instead, for example, or to ask
 * for no stencil buffer and still have one available. Context creation should
 * fail if the GL can't provide your requested attributes at a minimum, but
 * you should check to see exactly what you got.
 *
 * @since This enum is available since SDL 3.2.0.
 *
 * @from SDL_video.h:426 SDL_GL_
 */
export enum SDL_GLAttr {
  RED_SIZE, /**< the minimum number of bits for the red channel of the color buffer; defaults to 8. */
  GREEN_SIZE, /**< the minimum number of bits for the green channel of the color buffer; defaults to 8. */
  BLUE_SIZE, /**< the minimum number of bits for the blue channel of the color buffer; defaults to 8. */
  ALPHA_SIZE, /**< the minimum number of bits for the alpha channel of the color buffer; defaults to 8. */
  BUFFER_SIZE, /**< the minimum number of bits for frame buffer size; defaults to 0. */
  DOUBLEBUFFER, /**< whether the output is single or double buffered; defaults to double buffering on. */
  DEPTH_SIZE, /**< the minimum number of bits in the depth buffer; defaults to 16. */
  STENCIL_SIZE, /**< the minimum number of bits in the stencil buffer; defaults to 0. */
  ACCUM_RED_SIZE, /**< the minimum number of bits for the red channel of the accumulation buffer; defaults to 0. */
  ACCUM_GREEN_SIZE, /**< the minimum number of bits for the green channel of the accumulation buffer; defaults to 0. */
  ACCUM_BLUE_SIZE, /**< the minimum number of bits for the blue channel of the accumulation buffer; defaults to 0. */
  ACCUM_ALPHA_SIZE, /**< the minimum number of bits for the alpha channel of the accumulation buffer; defaults to 0. */
  STEREO, /**< whether the output is stereo 3D; defaults to off. */
  MULTISAMPLEBUFFERS, /**< the number of buffers used for multisample anti-aliasing; defaults to 0. */
  MULTISAMPLESAMPLES, /**< the number of samples used around the current pixel used for multisample anti-aliasing. */
  ACCELERATED_VISUAL, /**< set to 1 to require hardware acceleration, set to 0 to force software rendering; defaults to allow either. */
  RETAINED_BACKING, /**< not used (deprecated). */
  CONTEXT_MAJOR_VERSION, /**< OpenGL context major version. */
  CONTEXT_MINOR_VERSION, /**< OpenGL context minor version. */
  CONTEXT_FLAGS, /**< some combination of 0 or more of elements of the SDL_GLContextFlag enumeration; defaults to 0. */
  CONTEXT_PROFILE_MASK, /**< type of GL context (Core, Compatibility, ES). See SDL_GLProfile; default value depends on platform. */
  SHARE_WITH_CURRENT_CONTEXT, /**< OpenGL context sharing; defaults to 0. */
  FRAMEBUFFER_SRGB_CAPABLE, /**< requests sRGB capable visual; defaults to 0. */
  CONTEXT_RELEASE_BEHAVIOR, /**< sets context the release behavior. See SDL_GLContextReleaseFlag; defaults to FLUSH. */
  CONTEXT_RESET_NOTIFICATION, /**< set context reset notification. See SDL_GLContextResetNotification; defaults to NO_NOTIFICATION. */
  CONTEXT_NO_ERROR, 
  FLOATBUFFERS, 
  EGL_PLATFORM, 
}



/**
 * Possible return values from the SDL_HitTest callback.
 *
 * @threadsafety This function should only be called on the main thread.
 *
 * @since This enum is available since SDL 3.2.0.
 *
 * @sa SDL_HitTest
 *
 * @from SDL_video.h:2703 SDL_HITTEST_
 */
export enum SDL_HitTestResult {
  NORMAL, /**< Region is normal. No special properties. */
  DRAGGABLE, /**< Region can drag entire window. */
  RESIZE_TOPLEFT, /**< Region is the resizable top-left corner border. */
  RESIZE_TOP, /**< Region is the resizable top border. */
  RESIZE_TOPRIGHT, /**< Region is the resizable top-right corner border. */
  RESIZE_RIGHT, /**< Region is the resizable right border. */
  RESIZE_BOTTOMRIGHT, /**< Region is the resizable bottom-right corner border. */
  RESIZE_BOTTOM, /**< Region is the resizable bottom border. */
  RESIZE_BOTTOMLEFT, /**< Region is the resizable bottom-left corner border. */
  RESIZE_LEFT, /**< Region is the resizable left border. */
}



