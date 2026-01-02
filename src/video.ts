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

import * as _p from "@g9wp/ptr";
import * as SDL from "../gen/sdl/video.ts";
import { free } from "../gen/sdl/stdinc.ts";
import type * as _r from "../gen/structs/SDL_rect.ts";
import * as _ from "../gen/structs/SDL_video.ts";
import type { Size } from "./rect.ts";
import { SDL_DisplayOrientation as DisplayOrientation } from "../gen/enums/SDL_video.ts";
export { DisplayOrientation };
import { SdlError } from "./_utils.ts";

import type { SurfacePointer, WindowPointer } from "./pointer_type.ts";
type DisplayModePointer = Deno.PointerObject<"SDL_DisplayMode">;

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
 */
export class DisplayModePtr {
  constructor(public pointer: DisplayModePointer) {}

  get detail(): _.DisplayMode {
    return _.read_DisplayMode(_p.UnsafeDataView(this.pointer));
  }
}

/**
 * The VideoDriver class provides static methods to interact with SDL's video drivers.
 *
 * This includes functionality to:
 * - Get the number of available video drivers
 * - Get names of specific video drivers
 * - Get the name of the currently initialized video driver
 *
 * Video drivers are low-level system interfaces that handle window creation and management.
 *
 * @since SDL 3.2.0
 */
export class VideoDriver {
  /**
   * Get the number of video drivers compiled into SDL.
   *
   * @returns the number of built in video drivers.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_GetVideoDriver
   *
   * @from SDL_video.h:562 int SDL_GetNumVideoDrivers(void);
   */
  static getNum(): number {
    return SDL.getNumVideoDrivers();
  }

  /**
   * Get the name of a built in video driver.
   *
   * The video drivers are presented in the order in which they are normally
   * checked during initialization.
   *
   * The names of drivers are all simple, low-ASCII identifiers, like "cocoa",
   * "x11" or "windows". These never have Unicode characters, and are not meant
   * to be proper names.
   *
   * @param index the index of a video driver.
   * @returns the name of the video driver with the given **index**, or NULL if
   *          index is out of bounds.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_GetNumVideoDrivers
   *
   * @from SDL_video.h:584 const char * SDL_GetVideoDriver(int index);
   */
  static get(index: number): string {
    return SDL.getVideoDriver(index);
  }

  /**
   * Get the name of the currently initialized video driver.
   *
   * The names of drivers are all simple, low-ASCII identifiers, like "cocoa",
   * "x11" or "windows". These never have Unicode characters, and are not meant
   * to be proper names.
   *
   * @returns the name of the current video driver or NULL if no driver has been
   *          initialized.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_GetNumVideoDrivers
   * @sa SDL_GetVideoDriver
   *
   * @from SDL_video.h:603 const char * SDL_GetCurrentVideoDriver(void);
   */
  static get current(): string {
    return SDL.getCurrentVideoDriver();
  }
}
/**
 * Get the current system theme.
 *
 * @returns the current system theme, light, dark, or unknown.
 *
 * @threadsafety This function should only be called on the main thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_video.h:614 SDL_SystemTheme SDL_GetSystemTheme(void);
 */
export function systemTheme(): SDL.SYSTEM_THEME {
  return SDL.getSystemTheme() as SDL.SYSTEM_THEME;
}

/**
 * The Display class represents a connected display device.
 *
 * This provides functionality to:
 * - Get display properties and information
 * - Query display modes and resolutions
 * - Get display bounds and usable area
 * - Get display orientation and scaling
 *
 * Each display has a unique ID that remains constant while connected.
 * Displays can be enumerated and queried using static methods.
 *
 * @since SDL 3.2.0
 */
export class Display {
  /**
   * This is a unique ID for a display for the time it is connected to the
   * system, and is never reused for the lifetime of the application.
   *
   * If the display is disconnected and reconnected, it will get a new ID.
   *
   * The value 0 is an invalid ID.
   *
   * @since This datatype is available since SDL 3.2.0.
   *
   * @from SDL_video.h:74 typedef Uint32 SDL_DisplayID;
   */
  id: number = 0;

  constructor(id: number) {
    this.id = id;
  }

  /**
   * Get a list of currently connected displays.
   *
   * @param count a pointer filled in with the number of displays returned, may
   *              be NULL.
   * @returns a 0 terminated array of display instance IDs or NULL on failure;
   *          call SDL_GetError() for more information. This should be freed
   *          with SDL_free() when it is no longer needed.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @from SDL_video.h:629 SDL_DisplayID * SDL_GetDisplays(int *count);
   */
  static get list(): Display[] {
    const { ret: displays } = SDL.getDisplays();
    if (!displays) throw SdlError("getDisplays");
    const p = _p.Cursor.Unsafe(displays);
    const r = [];
    while (true) {
      const id = p.i32;
      if (id === 0) break;
      r.push(new Display(id));
    }
    free(displays);
    return r;
  }

  static tryFrom(id: number): Display {
    if (id === 0) throw Error("invalid display id");
    return new Display(id);
  }

  /**
   * Return the primary display.
   *
   * @returns the instance ID of the primary display on success or 0 on failure;
   *          call SDL_GetError() for more information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_GetDisplays
   *
   * @from SDL_video.h:643 SDL_DisplayID SDL_GetPrimaryDisplay(void);
   */
  static get primary(): Display {
    return Display.tryFrom(SDL.getPrimaryDisplay());
  }

  /**
   * Get the properties associated with a display.
   *
   * The following read-only properties are provided by SDL:
   *
   * - `SDL_PROP_DISPLAY_HDR_ENABLED_BOOLEAN`: true if the display has HDR
   *   headroom above the SDR white point. This is for informational and
   *   diagnostic purposes only, as not all platforms provide this information
   *   at the display level.
   *
   * On KMS/DRM:
   *
   * - `SDL_PROP_DISPLAY_KMSDRM_PANEL_ORIENTATION_NUMBER`: the "panel
   *   orientation" property for the display in degrees of clockwise rotation.
   *   Note that this is provided only as a hint, and the application is
   *   responsible for any coordinate transformations needed to conform to the
   *   requested display orientation.
   *
   * On Wayland:
   *
   * - `SDL_PROP_DISPLAY_WAYLAND_WL_OUTPUT_POINTER`: the wl_output associated
   *   with the display
   *
   * On Windows:
   *
   * - `SDL_PROP_DISPLAY_WINDOWS_HMONITOR_POINTER`: the monitor handle
   *   (HMONITOR) associated with the display
   *
   * @param displayID the instance ID of the display to query.
   * @returns a valid property ID on success or 0 on failure; call
   *          SDL_GetError() for more information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @from SDL_video.h:681 SDL_PropertiesID SDL_GetDisplayProperties(SDL_DisplayID displayID);
   */
  get properties(): number {
    const id = SDL.getDisplayProperties(this.id);
    if (id === 0) throw SdlError("getDisplayProperties");
    return id;
  }
  /**
   * Get the name of a display in UTF-8 encoding.
   *
   * @param displayID the instance ID of the display to query.
   * @returns the name of a display or NULL on failure; call SDL_GetError() for
   *          more information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_GetDisplays
   *
   * @from SDL_video.h:701 const char * SDL_GetDisplayName(SDL_DisplayID displayID);
   */
  get name(): string {
    const r = SDL.getDisplayName(this.id);
    if (!r) throw SdlError("getDisplayName");
    return r;
  }

  /**
   * Get the desktop area represented by a display.
   *
   * The primary display is often located at (0,0), but may be placed at a
   * different location depending on monitor layout.
   *
   * @param displayID the instance ID of the display to query.
   * @param rect the SDL_Rect structure filled in with the display bounds.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_GetDisplayUsableBounds
   * @sa SDL_GetDisplays
   *
   * @from SDL_video.h:721 bool SDL_GetDisplayBounds(SDL_DisplayID displayID, SDL_Rect *rect);
   */
  get bounds(): _r.Rect {
    return SDL.getDisplayBounds(this.id)!;
  }

  /**
   * Get the usable desktop area represented by a display, in screen
   * coordinates.
   *
   * This is the same area as SDL_GetDisplayBounds() reports, but with portions
   * reserved by the system removed. For example, on Apple's macOS, this
   * subtracts the area occupied by the menu bar and dock.
   *
   * Setting a window to be fullscreen generally bypasses these unusable areas,
   * so these are good guidelines for the maximum space available to a
   * non-fullscreen window.
   *
   * @param displayID the instance ID of the display to query.
   * @param rect the SDL_Rect structure filled in with the display bounds.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_GetDisplayBounds
   * @sa SDL_GetDisplays
   *
   * @from SDL_video.h:747 bool SDL_GetDisplayUsableBounds(SDL_DisplayID displayID, SDL_Rect *rect);
   */

  get usableBounds(): _r.Rect {
    return SDL.getDisplayUsableBounds(this.id)!;
  }

  /**
   * Get the orientation of a display when it is unrotated.
   *
   * @param displayID the instance ID of the display to query.
   * @returns the SDL_DisplayOrientation enum value of the display, or
   *          `SDL_ORIENTATION_UNKNOWN` if it isn't available.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_GetDisplays
   *
   * @from SDL_video.h:762 SDL_DisplayOrientation SDL_GetNaturalDisplayOrientation(SDL_DisplayID displayID);
   */
  get naturalOrientation(): DisplayOrientation {
    return SDL.getNaturalDisplayOrientation(this.id);
  }
  /**
   * Get the orientation of a display.
   *
   * @param displayID the instance ID of the display to query.
   * @returns the SDL_DisplayOrientation enum value of the display, or
   *          `SDL_ORIENTATION_UNKNOWN` if it isn't available.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_GetDisplays
   *
   * @from SDL_video.h:777 SDL_DisplayOrientation SDL_GetCurrentDisplayOrientation(SDL_DisplayID displayID);
   */
  get currentOrientation(): DisplayOrientation {
    return SDL.getNaturalDisplayOrientation(this.id);
  }

  /**
   * Get the content scale of a display.
   *
   * The content scale is the expected scale for content based on the DPI
   * settings of the display. For example, a 4K display might have a 2.0 (200%)
   * display scale, which means that the user expects UI elements to be twice as
   * big on this display, to aid in readability.
   *
   * After window creation, SDL_GetWindowDisplayScale() should be used to query
   * the content scale factor for individual windows instead of querying the
   * display for a window and calling this function, as the per-window content
   * scale factor may differ from the base value of the display it is on,
   * particularly on high-DPI and/or multi-monitor desktop configurations.
   *
   * @param displayID the instance ID of the display to query.
   * @returns the content scale of the display, or 0.0f on failure; call
   *          SDL_GetError() for more information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_GetWindowDisplayScale
   * @sa SDL_GetDisplays
   *
   * @from SDL_video.h:804 float SDL_GetDisplayContentScale(SDL_DisplayID displayID);
   */
  get contentScale(): number {
    return SDL.getDisplayContentScale(this.id);
  }

  /**
   * Get a list of fullscreen display modes available on a display.
   *
   * The display modes are sorted in this priority:
   *
   * - w -> largest to smallest
   * - h -> largest to smallest
   * - bits per pixel -> more colors to fewer colors
   * - packed pixel layout -> largest to smallest
   * - refresh rate -> highest to lowest
   * - pixel density -> lowest to highest
   *
   * @param displayID the instance ID of the display to query.
   * @param count a pointer filled in with the number of display modes returned,
   *              may be NULL.
   * @returns a NULL terminated array of display mode pointers or NULL on
   *          failure; call SDL_GetError() for more information. This is a
   *          single allocation that should be freed with SDL_free() when it is
   *          no longer needed.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_GetDisplays
   *
   * @from SDL_video.h:832 SDL_DisplayMode ** SDL_GetFullscreenDisplayModes(SDL_DisplayID displayID, int *count);
   */
  fullscreenDisplayModes(): _.DisplayMode[] {
    const { ret: modes } = SDL.getFullscreenDisplayModes(this.id);
    if (!modes) throw SdlError("getFullscreenDisplayModes");
    const r = _p.getPtrArr(modes).map((p) =>
      _.read_DisplayMode(_p.UnsafeDataView(p!))
    );
    free(modes);
    return r;
  }

  /**
   * Get the closest match to the requested display mode.
   *
   * The available display modes are scanned and `closest` is filled in with the
   * closest mode matching the requested mode and returned. The mode format and
   * refresh rate default to the desktop mode if they are set to 0. The modes
   * are scanned with size being first priority, format being second priority,
   * and finally checking the refresh rate. If all the available modes are too
   * small, then false is returned.
   *
   * @param displayID the instance ID of the display to query.
   * @param w the width in pixels of the desired display mode.
   * @param h the height in pixels of the desired display mode.
   * @param refresh_rate the refresh rate of the desired display mode, or 0.0f
   *                     for the desktop refresh rate.
   * @param include_high_density_modes boolean to include high density modes in
   *                                   the search.
   * @param closest a pointer filled in with the closest display mode equal to
   *                or larger than the desired mode.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_GetDisplays
   * @sa SDL_GetFullscreenDisplayModes
   *
   * @from SDL_video.h:863 bool SDL_GetClosestFullscreenDisplayMode(SDL_DisplayID displayID, int w, int h, float refresh_rate, bool include_high_density_modes, SDL_DisplayMode *closest);
   */
  closestFullscreenDisplayMode(
    w: number,
    h: number,
    refresh_rate: number,
    include_high_density_modes: boolean,
  ): _.DisplayMode {
    if (
      !SDL.getClosestFullscreenDisplayMode(
        this.id,
        w,
        h,
        refresh_rate,
        include_high_density_modes,
        _p.u64.p0 as Deno.PointerValue<"SDL_DisplayMode">,
      )
    ) throw SdlError("getClosestFullscreenDisplayMode");
    return _.read_DisplayMode(_p.u64.dataView);
  }

  /**
   * Get information about the desktop's display mode.
   *
   * There's a difference between this function and SDL_GetCurrentDisplayMode()
   * when SDL runs fullscreen and has changed the resolution. In that case this
   * function will return the previous native display mode, and not the current
   * display mode.
   *
   * @param displayID the instance ID of the display to query.
   * @returns a pointer to the desktop display mode or NULL on failure; call
   *          SDL_GetError() for more information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_GetCurrentDisplayMode
   * @sa SDL_GetDisplays
   *
   * @from SDL_video.h:884 const SDL_DisplayMode * SDL_GetDesktopDisplayMode(SDL_DisplayID displayID);
   */
  get desktopDisplayMode(): DisplayModePtr {
    const r = SDL.getDesktopDisplayMode(this.id);
    if (!r) throw SdlError("getDesktopDisplayMode");
    return new DisplayModePtr(r);
  }

  /**
   * Get information about the current display mode.
   *
   * There's a difference between this function and SDL_GetDesktopDisplayMode()
   * when SDL runs fullscreen and has changed the resolution. In that case this
   * function will return the current display mode, and not the previous native
   * display mode.
   *
   * @param displayID the instance ID of the display to query.
   * @returns a pointer to the desktop display mode or NULL on failure; call
   *          SDL_GetError() for more information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_GetDesktopDisplayMode
   * @sa SDL_GetDisplays
   *
   * @from SDL_video.h:905 const SDL_DisplayMode * SDL_GetCurrentDisplayMode(SDL_DisplayID displayID);
   */
  get currentDisplayMode(): DisplayModePtr {
    const r = SDL.getDesktopDisplayMode(this.id);
    if (!r) throw SdlError("getDesktopDisplayMode");
    return new DisplayModePtr(r);
  }

  /**
   * Get the display containing a point.
   *
   * @param point the point to query.
   * @returns the instance ID of the display containing the point or 0 on
   *          failure; call SDL_GetError() for more information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_GetDisplayBounds
   * @sa SDL_GetDisplays
   *
   * @from SDL_video.h:921 SDL_DisplayID SDL_GetDisplayForPoint(const SDL_Point *point);
   */
  static forPoint(point: _r.Point): Display {
    const r = SDL.getDisplayForPoint(point);
    if (r === 0) throw SdlError("getDisplayForPoint");
    return new Display(r);
  }

  /**
   * Get the display primarily containing a rect.
   *
   * @param rect the rect to query.
   * @returns the instance ID of the display entirely containing the rect or
   *          closest to the center of the rect on success or 0 on failure; call
   *          SDL_GetError() for more information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_GetDisplayBounds
   * @sa SDL_GetDisplays
   *
   * @from SDL_video.h:938 SDL_DisplayID SDL_GetDisplayForRect(const SDL_Rect *rect);
   */
  static forRect(rect: _r.Rect): Display {
    const r = SDL.getDisplayForRect(rect);
    return new Display(r);
  }
}

/**
 * The struct used as an opaque handle to a window.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @sa SDL_CreateWindow
 */
export class Window {
  constructor(public pointer: WindowPointer) {
  }

  /**
   * Get the display associated with a window.
   *
   * @param window the window to query.
   * @returns the instance ID of the display containing the center of the window
   *          on success or 0 on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_GetDisplayBounds
   * @sa SDL_GetDisplays
   *
   * @from SDL_video.h:955 SDL_DisplayID SDL_GetDisplayForWindow(SDL_Window *window);
   */
  get display(): Display {
    const r = SDL.getDisplayForWindow(this.pointer);
    if (r === 0) throw SdlError("getDisplayForWindow");
    return new Display(r);
  }

  /**
   * Get the pixel density of a window.
   *
   * This is a ratio of pixel size to window size. For example, if the window is
   * 1920x1080 and it has a high density back buffer of 3840x2160 pixels, it
   * would have a pixel density of 2.0.
   *
   * @param window the window to query.
   * @returns the pixel density or 0.0f on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_GetWindowDisplayScale
   *
   * @from SDL_video.h:974 float SDL_GetWindowPixelDensity(SDL_Window *window);
   */
  get pixelDensity(): number {
    return SDL.getWindowPixelDensity(this.pointer);
  }

  /**
   * Get the content display scale relative to a window's pixel size.
   *
   * This is a combination of the window pixel density and the display content
   * scale, and is the expected scale for displaying content in this window. For
   * example, if a 3840x2160 window had a display scale of 2.0, the user expects
   * the content to take twice as many pixels and be the same physical size as
   * if it were being displayed in a 1920x1080 window with a display scale of
   * 1.0.
   *
   * Conceptually this value corresponds to the scale display setting, and is
   * updated when that setting is changed, or the window moves to a display with
   * a different scale setting.
   *
   * @param window the window to query.
   * @returns the display scale, or 0.0f on failure; call SDL_GetError() for
   *          more information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @from SDL_video.h:998 float SDL_GetWindowDisplayScale(SDL_Window *window);
   */
  get displayScale(): number {
    return SDL.getWindowDisplayScale(this.pointer);
  }

  /**
   * Set the display mode to use when a window is visible and fullscreen.
   *
   * This only affects the display mode used when the window is fullscreen. To
   * change the window size when the window is not fullscreen, use
   * SDL_SetWindowSize().
   *
   * If the window is currently in the fullscreen state, this request is
   * asynchronous on some windowing systems and the new mode dimensions may not
   * be applied immediately upon the return of this function. If an immediate
   * change is required, call SDL_SyncWindow() to block until the changes have
   * taken effect.
   *
   * When the new mode takes effect, an SDL_EVENT_WINDOW_RESIZED and/or an
   * SDL_EVENT_WINDOW_PIXEL_SIZE_CHANGED event will be emitted with the new mode
   * dimensions.
   *
   * @param window the window to affect.
   * @param mode a pointer to the display mode to use, which can be NULL for
   *             borderless fullscreen desktop mode, or one of the fullscreen
   *             modes returned by SDL_GetFullscreenDisplayModes() to set an
   *             exclusive fullscreen mode.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_GetWindowFullscreenMode
   * @sa SDL_SetWindowFullscreen
   * @sa SDL_SyncWindow
   *
   * @from SDL_video.h:1033 bool SDL_SetWindowFullscreenMode(SDL_Window *window, const SDL_DisplayMode *mode);
   */
  setFullscreenMode(mode: DisplayModePtr): boolean {
    return SDL.setWindowFullscreenMode(this.pointer, mode.pointer);
  }

  /**
   * Query the display mode to use when a window is visible at fullscreen.
   *
   * @param window the window to query.
   * @returns a pointer to the exclusive fullscreen mode to use or NULL for
   *          borderless fullscreen desktop mode.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_SetWindowFullscreenMode
   * @sa SDL_SetWindowFullscreen
   *
   * @from SDL_video.h:1049 const SDL_DisplayMode * SDL_GetWindowFullscreenMode(SDL_Window *window);
   */
  get fullscreenMode(): DisplayModePtr {
    const r = SDL.getWindowFullscreenMode(this.pointer);
    if (!r) throw SdlError("getWindowFullscreenMode");
    return new DisplayModePtr(r);
  }

  /**
   * Get the raw ICC profile data for the screen the window is currently on.
   *
   * @param window the window to query.
   * @param size the size of the ICC profile.
   * @returns the raw ICC profile data on success or NULL on failure; call
   *          SDL_GetError() for more information. This should be freed with
   *          SDL_free() when it is no longer needed.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @from SDL_video.h:1064 void * SDL_GetWindowICCProfile(SDL_Window *window, size_t *size);
   */
  get IccProfile(): { data: Deno.PointerObject; size: bigint } {
    const { ret: r, size } = SDL.getWindowIccProfile(this.pointer);
    if (!r) throw SdlError("getWindowIccProfile");
    return { data: r, size };
  }

  /**
   * Get the pixel format associated with the window.
   *
   * @param window the window to query.
   * @returns the pixel format of the window on success or
   *          SDL_PIXELFORMAT_UNKNOWN on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @from SDL_video.h:1078 SDL_PixelFormat SDL_GetWindowPixelFormat(SDL_Window *window);
   */
  get pixelFormat(): number {
    return SDL.getWindowPixelFormat(this.pointer);
  }

  /**
   * Get a list of valid windows.
   *
   * @param count a pointer filled in with the number of windows returned, may
   *              be NULL.
   * @returns a NULL terminated array of SDL_Window pointers or NULL on failure;
   *          call SDL_GetError() for more information. This is a single
   *          allocation that should be freed with SDL_free() when it is no
   *          longer needed.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @from SDL_video.h:1094 SDL_Window ** SDL_GetWindows(int *count);
   */
  static get list(): Window[] {
    const { ret: windows } = SDL.getWindows();
    if (!windows) throw SdlError("getWindows");
    const r = _p.getPtrArr(windows).map((p) => new Window(p as WindowPointer));
    free(windows);
    return r;
  }

  /**
   * Create a window with the specified dimensions and flags.
   *
   * The window size is a request and may be different than expected based on
   * the desktop layout and window manager policies. Your application should be
   * prepared to handle a window of any size.
   *
   * `flags` may be any of the following OR'd together:
   *
   * - `SDL_WINDOW_FULLSCREEN`: fullscreen window at desktop resolution
   * - `SDL_WINDOW_OPENGL`: window usable with an OpenGL context
   * - `SDL_WINDOW_HIDDEN`: window is not visible
   * - `SDL_WINDOW_BORDERLESS`: no window decoration
   * - `SDL_WINDOW_RESIZABLE`: window can be resized
   * - `SDL_WINDOW_MINIMIZED`: window is minimized
   * - `SDL_WINDOW_MAXIMIZED`: window is maximized
   * - `SDL_WINDOW_MOUSE_GRABBED`: window has grabbed mouse focus
   * - `SDL_WINDOW_INPUT_FOCUS`: window has input focus
   * - `SDL_WINDOW_MOUSE_FOCUS`: window has mouse focus
   * - `SDL_WINDOW_EXTERNAL`: window not created by SDL
   * - `SDL_WINDOW_MODAL`: window is modal
   * - `SDL_WINDOW_HIGH_PIXEL_DENSITY`: window uses high pixel density back
   *   buffer if possible
   * - `SDL_WINDOW_MOUSE_CAPTURE`: window has mouse captured (unrelated to
   *   MOUSE_GRABBED)
   * - `SDL_WINDOW_ALWAYS_ON_TOP`: window should always be above others
   * - `SDL_WINDOW_UTILITY`: window should be treated as a utility window, not
   *   showing in the task bar and window list
   * - `SDL_WINDOW_TOOLTIP`: window should be treated as a tooltip and does not
   *   get mouse or keyboard focus, requires a parent window
   * - `SDL_WINDOW_POPUP_MENU`: window should be treated as a popup menu,
   *   requires a parent window
   * - `SDL_WINDOW_KEYBOARD_GRABBED`: window has grabbed keyboard input
   * - `SDL_WINDOW_VULKAN`: window usable with a Vulkan instance
   * - `SDL_WINDOW_METAL`: window usable with a Metal instance
   * - `SDL_WINDOW_TRANSPARENT`: window with transparent buffer
   * - `SDL_WINDOW_NOT_FOCUSABLE`: window should not be focusable
   *
   * The SDL_Window will be shown if SDL_WINDOW_HIDDEN is not set. If hidden at
   * creation time, SDL_ShowWindow() can be used to show it later.
   *
   * On Apple's macOS, you **must** set the NSHighResolutionCapable Info.plist
   * property to YES, otherwise you will not receive a High-DPI OpenGL canvas.
   *
   * The window pixel size may differ from its window coordinate size if the
   * window is on a high pixel density display. Use SDL_GetWindowSize() to query
   * the client area's size in window coordinates, and
   * SDL_GetWindowSizeInPixels() or SDL_GetRenderOutputSize() to query the
   * drawable size in pixels. Note that the drawable size can vary after the
   * window is created and should be queried again if you get an
   * SDL_EVENT_WINDOW_PIXEL_SIZE_CHANGED event.
   *
   * If the window is created with any of the SDL_WINDOW_OPENGL or
   * SDL_WINDOW_VULKAN flags, then the corresponding LoadLibrary function
   * (SDL_GL_LoadLibrary or SDL_Vulkan_LoadLibrary) is called and the
   * corresponding UnloadLibrary function is called by SDL_DestroyWindow().
   *
   * If SDL_WINDOW_VULKAN is specified and there isn't a working Vulkan driver,
   * SDL_CreateWindow() will fail, because SDL_Vulkan_LoadLibrary() will fail.
   *
   * If SDL_WINDOW_METAL is specified on an OS that does not support Metal,
   * SDL_CreateWindow() will fail.
   *
   * If you intend to use this window with an SDL_Renderer, you should use
   * SDL_CreateWindowAndRenderer() instead of this function, to avoid window
   * flicker.
   *
   * On non-Apple devices, SDL requires you to either not link to the Vulkan
   * loader or link to a dynamic library version. This limitation may be removed
   * in a future version of SDL.
   *
   * @param title the title of the window, in UTF-8 encoding.
   * @param w the width of the window.
   * @param h the height of the window.
   * @param flags 0, or one or more SDL_WindowFlags OR'd together.
   * @returns the window that was created or NULL on failure; call
   *          SDL_GetError() for more information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_CreateWindowAndRenderer
   * @sa SDL_CreatePopupWindow
   * @sa SDL_CreateWindowWithProperties
   * @sa SDL_DestroyWindow
   *
   * @from SDL_video.h:1183 SDL_Window * SDL_CreateWindow(const char *title, int w, int h, SDL_WindowFlags flags);
   */
  static create(
    title: string,
    w: number,
    h: number,
    flags: bigint,
  ): Window {
    const r = SDL.createWindow(title, w, h, flags);
    if (!r) throw SdlError("createWindow");
    return new Window(r);
  }

  /**
   * Create a child popup window of the specified parent window.
   *
   * The window size is a request and may be different than expected based on
   * the desktop layout and window manager policies. Your application should be
   * prepared to handle a window of any size.
   *
   * The flags parameter **must** contain at least one of the following:
   *
   * - `SDL_WINDOW_TOOLTIP`: The popup window is a tooltip and will not pass any
   *   input events.
   * - `SDL_WINDOW_POPUP_MENU`: The popup window is a popup menu. The topmost
   *   popup menu will implicitly gain the keyboard focus.
   *
   * The following flags are not relevant to popup window creation and will be
   * ignored:
   *
   * - `SDL_WINDOW_MINIMIZED`
   * - `SDL_WINDOW_MAXIMIZED`
   * - `SDL_WINDOW_FULLSCREEN`
   * - `SDL_WINDOW_BORDERLESS`
   *
   * The following flags are incompatible with popup window creation and will
   * cause it to fail:
   *
   * - `SDL_WINDOW_UTILITY`
   * - `SDL_WINDOW_MODAL`
   *
   * The parent parameter **must** be non-null and a valid window. The parent of
   * a popup window can be either a regular, toplevel window, or another popup
   * window.
   *
   * Popup windows cannot be minimized, maximized, made fullscreen, raised,
   * flash, be made a modal window, be the parent of a toplevel window, or grab
   * the mouse and/or keyboard. Attempts to do so will fail.
   *
   * Popup windows implicitly do not have a border/decorations and do not appear
   * on the taskbar/dock or in lists of windows such as alt-tab menus.
   *
   * By default, popup window positions will automatically be constrained to
   * keep the entire window within display bounds. This can be overridden with
   * the `SDL_PROP_WINDOW_CREATE_CONSTRAIN_POPUP_BOOLEAN` property.
   *
   * By default, popup menus will automatically grab keyboard focus from the
   * parent when shown. This behavior can be overridden by setting the
   * `SDL_WINDOW_NOT_FOCUSABLE` flag, setting the
   * `SDL_PROP_WINDOW_CREATE_FOCUSABLE_BOOLEAN` property to false, or toggling
   * it after creation via the `SDL_SetWindowFocusable()` function.
   *
   * If a parent window is hidden or destroyed, any child popup windows will be
   * recursively hidden or destroyed as well. Child popup windows not explicitly
   * hidden will be restored when the parent is shown.
   *
   * @param parent the parent of the window, must not be NULL.
   * @param offset_x the x position of the popup window relative to the origin
   *                 of the parent.
   * @param offset_y the y position of the popup window relative to the origin
   *                 of the parent window.
   * @param w the width of the window.
   * @param h the height of the window.
   * @param flags SDL_WINDOW_TOOLTIP or SDL_WINDOW_POPUP_MENU, and zero or more
   *              additional SDL_WindowFlags OR'd together.
   * @returns the window that was created or NULL on failure; call
   *          SDL_GetError() for more information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_CreateWindow
   * @sa SDL_CreateWindowWithProperties
   * @sa SDL_DestroyWindow
   * @sa SDL_GetWindowParent
   *
   * @from SDL_video.h:1259 SDL_Window * SDL_CreatePopupWindow(SDL_Window *parent, int offset_x, int offset_y, int w, int h, SDL_WindowFlags flags);
   */
  createPopup(
    offset_x: number,
    offset_y: number,
    w: number,
    h: number,
    flags: bigint,
  ): Window {
    const r = SDL.createPopupWindow(
      this.pointer,
      offset_x,
      offset_y,
      w,
      h,
      flags,
    );
    if (!r) throw SdlError("createPopupWindow");
    return new Window(r);
  }

  /**
   * Create a window with the specified properties.
   *
   * The window size is a request and may be different than expected based on
   * the desktop layout and window manager policies. Your application should be
   * prepared to handle a window of any size.
   *
   * These are the supported properties:
   *
   * - `SDL_PROP_WINDOW_CREATE_ALWAYS_ON_TOP_BOOLEAN`: true if the window should
   *   be always on top
   * - `SDL_PROP_WINDOW_CREATE_BORDERLESS_BOOLEAN`: true if the window has no
   *   window decoration
   * - `SDL_PROP_WINDOW_CREATE_CONSTRAIN_POPUP_BOOLEAN`: true if the "tooltip"
   *   and "menu" window types should be automatically constrained to be
   *   entirely within display bounds (default), false if no constraints on the
   *   position are desired.
   * - `SDL_PROP_WINDOW_CREATE_EXTERNAL_GRAPHICS_CONTEXT_BOOLEAN`: true if the
   *   window will be used with an externally managed graphics context.
   * - `SDL_PROP_WINDOW_CREATE_FOCUSABLE_BOOLEAN`: true if the window should
   *   accept keyboard input (defaults true)
   * - `SDL_PROP_WINDOW_CREATE_FULLSCREEN_BOOLEAN`: true if the window should
   *   start in fullscreen mode at desktop resolution
   * - `SDL_PROP_WINDOW_CREATE_HEIGHT_NUMBER`: the height of the window
   * - `SDL_PROP_WINDOW_CREATE_HIDDEN_BOOLEAN`: true if the window should start
   *   hidden
   * - `SDL_PROP_WINDOW_CREATE_HIGH_PIXEL_DENSITY_BOOLEAN`: true if the window
   *   uses a high pixel density buffer if possible
   * - `SDL_PROP_WINDOW_CREATE_MAXIMIZED_BOOLEAN`: true if the window should
   *   start maximized
   * - `SDL_PROP_WINDOW_CREATE_MENU_BOOLEAN`: true if the window is a popup menu
   * - `SDL_PROP_WINDOW_CREATE_METAL_BOOLEAN`: true if the window will be used
   *   with Metal rendering
   * - `SDL_PROP_WINDOW_CREATE_MINIMIZED_BOOLEAN`: true if the window should
   *   start minimized
   * - `SDL_PROP_WINDOW_CREATE_MODAL_BOOLEAN`: true if the window is modal to
   *   its parent
   * - `SDL_PROP_WINDOW_CREATE_MOUSE_GRABBED_BOOLEAN`: true if the window starts
   *   with grabbed mouse focus
   * - `SDL_PROP_WINDOW_CREATE_OPENGL_BOOLEAN`: true if the window will be used
   *   with OpenGL rendering
   * - `SDL_PROP_WINDOW_CREATE_PARENT_POINTER`: an SDL_Window that will be the
   *   parent of this window, required for windows with the "tooltip", "menu",
   *   and "modal" properties
   * - `SDL_PROP_WINDOW_CREATE_RESIZABLE_BOOLEAN`: true if the window should be
   *   resizable
   * - `SDL_PROP_WINDOW_CREATE_TITLE_STRING`: the title of the window, in UTF-8
   *   encoding
   * - `SDL_PROP_WINDOW_CREATE_TRANSPARENT_BOOLEAN`: true if the window show
   *   transparent in the areas with alpha of 0
   * - `SDL_PROP_WINDOW_CREATE_TOOLTIP_BOOLEAN`: true if the window is a tooltip
   * - `SDL_PROP_WINDOW_CREATE_UTILITY_BOOLEAN`: true if the window is a utility
   *   window, not showing in the task bar and window list
   * - `SDL_PROP_WINDOW_CREATE_VULKAN_BOOLEAN`: true if the window will be used
   *   with Vulkan rendering
   * - `SDL_PROP_WINDOW_CREATE_WIDTH_NUMBER`: the width of the window
   * - `SDL_PROP_WINDOW_CREATE_X_NUMBER`: the x position of the window, or
   *   `SDL_WINDOWPOS_CENTERED`, defaults to `SDL_WINDOWPOS_UNDEFINED`. This is
   *   relative to the parent for windows with the "tooltip" or "menu" property
   *   set.
   * - `SDL_PROP_WINDOW_CREATE_Y_NUMBER`: the y position of the window, or
   *   `SDL_WINDOWPOS_CENTERED`, defaults to `SDL_WINDOWPOS_UNDEFINED`. This is
   *   relative to the parent for windows with the "tooltip" or "menu" property
   *   set.
   *
   * These are additional supported properties on macOS:
   *
   * - `SDL_PROP_WINDOW_CREATE_COCOA_WINDOW_POINTER`: the
   *   `(__unsafe_unretained)` NSWindow associated with the window, if you want
   *   to wrap an existing window.
   * - `SDL_PROP_WINDOW_CREATE_COCOA_VIEW_POINTER`: the `(__unsafe_unretained)`
   *   NSView associated with the window, defaults to `[window contentView]`
   *
   * These are additional supported properties on iOS, tvOS, and visionOS:
   *
   * - `SDL_PROP_WINDOW_CREATE_WINDOWSCENE_POINTER`: the `(__unsafe_unretained)`
   *   UIWindowScene associated with the window, defaults to the active window
   *   scene.
   *
   * These are additional supported properties on Wayland:
   *
   * - `SDL_PROP_WINDOW_CREATE_WAYLAND_SURFACE_ROLE_CUSTOM_BOOLEAN` - true if
   *   the application wants to use the Wayland surface for a custom role and
   *   does not want it attached to an XDG toplevel window. See
   *   [README-wayland](README-wayland) for more information on using custom
   *   surfaces.
   * - `SDL_PROP_WINDOW_CREATE_WAYLAND_CREATE_EGL_WINDOW_BOOLEAN` - true if the
   *   application wants an associated `wl_egl_window` object to be created and
   *   attached to the window, even if the window does not have the OpenGL
   *   property or `SDL_WINDOW_OPENGL` flag set.
   * - `SDL_PROP_WINDOW_CREATE_WAYLAND_WL_SURFACE_POINTER` - the wl_surface
   *   associated with the window, if you want to wrap an existing window. See
   *   [README-wayland](README-wayland) for more information.
   *
   * These are additional supported properties on Windows:
   *
   * - `SDL_PROP_WINDOW_CREATE_WIN32_HWND_POINTER`: the HWND associated with the
   *   window, if you want to wrap an existing window.
   * - `SDL_PROP_WINDOW_CREATE_WIN32_PIXEL_FORMAT_HWND_POINTER`: optional,
   *   another window to share pixel format with, useful for OpenGL windows
   *
   * These are additional supported properties with X11:
   *
   * - `SDL_PROP_WINDOW_CREATE_X11_WINDOW_NUMBER`: the X11 Window associated
   *   with the window, if you want to wrap an existing window.
   *
   * The window is implicitly shown if the "hidden" property is not set.
   *
   * These are additional supported properties with Emscripten:
   *
   * - `SDL_PROP_WINDOW_CREATE_EMSCRIPTEN_CANVAS_ID_STRING`: the id given to the
   *   canvas element. This should start with a '#' sign
   * - `SDL_PROP_WINDOW_CREATE_EMSCRIPTEN_KEYBOARD_ELEMENT_STRING`: override the
   *   binding element for keyboard inputs for this canvas. The variable can be
   *   one of:
   * - "#window": the javascript window object (default)
   * - "#document": the javascript document object
   * - "#screen": the javascript window.screen object
   * - "#canvas": the WebGL canvas element
   * - "#none": Don't bind anything at all
   * - any other string without a leading # sign applies to the element on the
   *   page with that ID. Windows with the "tooltip" and "menu" properties are
   *   popup windows and have the behaviors and guidelines outlined in
   *   SDL_CreatePopupWindow().
   *
   * If this window is being created to be used with an SDL_Renderer, you should
   * not add a graphics API specific property
   * (`SDL_PROP_WINDOW_CREATE_OPENGL_BOOLEAN`, etc), as SDL will handle that
   * internally when it chooses a renderer. However, SDL might need to recreate
   * your window at that point, which may cause the window to appear briefly,
   * and then flicker as it is recreated. The correct approach to this is to
   * create the window with the `SDL_PROP_WINDOW_CREATE_HIDDEN_BOOLEAN` property
   * set to true, then create the renderer, then show the window with
   * SDL_ShowWindow().
   *
   * @param props the properties to use.
   * @returns the window that was created or NULL on failure; call
   *          SDL_GetError() for more information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_CreateProperties
   * @sa SDL_CreateWindow
   * @sa SDL_DestroyWindow
   *
   * @from SDL_video.h:1408 SDL_Window * SDL_CreateWindowWithProperties(SDL_PropertiesID props);
   */
  static createWithProperties(props: number): Window {
    const r = SDL.createWindowWithProperties(props);
    if (!r) throw SdlError("createWindowWithProperties");
    return new Window(r);
  }

  /**
   * This is a unique ID for a window.
   *
   * The value 0 is an invalid ID.
   *
   * @since This datatype is available since SDL 3.2.0.
   *
   * @from SDL_video.h:83 typedef Uint32 SDL_WindowID;
   */

  /**
   * Get the numeric ID of a window.
   *
   * The numeric ID is what SDL_WindowEvent references, and is necessary to map
   * these events to specific SDL_Window objects.
   *
   * @param window the window to query.
   * @returns the ID of the window on success or 0 on failure; call
   *          SDL_GetError() for more information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_GetWindowFromID
   *
   * @from SDL_video.h:1465 SDL_WindowID SDL_GetWindowID(SDL_Window *window);
   */
  get id(): number {
    return SDL.getWindowId(this.pointer);
  }

  /**
   * Get a window from a stored ID.
   *
   * The numeric ID is what SDL_WindowEvent references, and is necessary to map
   * these events to specific SDL_Window objects.
   *
   * @param id the ID of the window.
   * @returns the window associated with `id` or NULL if it doesn't exist; call
   *          SDL_GetError() for more information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_GetWindowID
   *
   * @from SDL_video.h:1483 SDL_Window * SDL_GetWindowFromID(SDL_WindowID id);
   */
  static fromId(id: number): Window {
    const r = SDL.getWindowFromId(id);
    if (!r) throw SdlError("getWindowFromId");
    return new Window(r);
  }

  /**
   * Get parent of a window.
   *
   * @param window the window to query.
   * @returns the parent of the window on success or NULL if the window has no
   *          parent.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_CreatePopupWindow
   *
   * @from SDL_video.h:1498 SDL_Window * SDL_GetWindowParent(SDL_Window *window);
   */
  get parent(): Window {
    const r = SDL.getWindowParent(this.pointer);
    if (!r) throw SdlError("getWindowParent");
    return new Window(r);
  }

  /**
   * Get the properties associated with a window.
   *
   * The following read-only properties are provided by SDL:
   *
   * - `SDL_PROP_WINDOW_SHAPE_POINTER`: the surface associated with a shaped
   *   window
   * - `SDL_PROP_WINDOW_HDR_ENABLED_BOOLEAN`: true if the window has HDR
   *   headroom above the SDR white point. This property can change dynamically
   *   when SDL_EVENT_WINDOW_HDR_STATE_CHANGED is sent.
   * - `SDL_PROP_WINDOW_SDR_WHITE_LEVEL_FLOAT`: the value of SDR white in the
   *   SDL_COLORSPACE_SRGB_LINEAR colorspace. On Windows this corresponds to the
   *   SDR white level in scRGB colorspace, and on Apple platforms this is
   *   always 1.0 for EDR content. This property can change dynamically when
   *   SDL_EVENT_WINDOW_HDR_STATE_CHANGED is sent.
   * - `SDL_PROP_WINDOW_HDR_HEADROOM_FLOAT`: the additional high dynamic range
   *   that can be displayed, in terms of the SDR white point. When HDR is not
   *   enabled, this will be 1.0. This property can change dynamically when
   *   SDL_EVENT_WINDOW_HDR_STATE_CHANGED is sent.
   *
   * On Android:
   *
   * - `SDL_PROP_WINDOW_ANDROID_WINDOW_POINTER`: the ANativeWindow associated
   *   with the window
   * - `SDL_PROP_WINDOW_ANDROID_SURFACE_POINTER`: the EGLSurface associated with
   *   the window
   *
   * On iOS:
   *
   * - `SDL_PROP_WINDOW_UIKIT_WINDOW_POINTER`: the `(__unsafe_unretained)`
   *   UIWindow associated with the window
   * - `SDL_PROP_WINDOW_UIKIT_METAL_VIEW_TAG_NUMBER`: the NSInteger tag
   *   associated with metal views on the window
   * - `SDL_PROP_WINDOW_UIKIT_OPENGL_FRAMEBUFFER_NUMBER`: the OpenGL view's
   *   framebuffer object. It must be bound when rendering to the screen using
   *   OpenGL.
   * - `SDL_PROP_WINDOW_UIKIT_OPENGL_RENDERBUFFER_NUMBER`: the OpenGL view's
   *   renderbuffer object. It must be bound when SDL_GL_SwapWindow is called.
   * - `SDL_PROP_WINDOW_UIKIT_OPENGL_RESOLVE_FRAMEBUFFER_NUMBER`: the OpenGL
   *   view's resolve framebuffer, when MSAA is used.
   *
   * On KMS/DRM:
   *
   * - `SDL_PROP_WINDOW_KMSDRM_DEVICE_INDEX_NUMBER`: the device index associated
   *   with the window (e.g. the X in /dev/dri/cardX)
   * - `SDL_PROP_WINDOW_KMSDRM_DRM_FD_NUMBER`: the DRM FD associated with the
   *   window
   * - `SDL_PROP_WINDOW_KMSDRM_GBM_DEVICE_POINTER`: the GBM device associated
   *   with the window
   *
   * On macOS:
   *
   * - `SDL_PROP_WINDOW_COCOA_WINDOW_POINTER`: the `(__unsafe_unretained)`
   *   NSWindow associated with the window
   * - `SDL_PROP_WINDOW_COCOA_METAL_VIEW_TAG_NUMBER`: the NSInteger tag
   *   associated with metal views on the window
   *
   * On OpenVR:
   *
   * - `SDL_PROP_WINDOW_OPENVR_OVERLAY_ID_NUMBER`: the OpenVR Overlay Handle ID
   *   for the associated overlay window.
   *
   * On Vivante:
   *
   * - `SDL_PROP_WINDOW_VIVANTE_DISPLAY_POINTER`: the EGLNativeDisplayType
   *   associated with the window
   * - `SDL_PROP_WINDOW_VIVANTE_WINDOW_POINTER`: the EGLNativeWindowType
   *   associated with the window
   * - `SDL_PROP_WINDOW_VIVANTE_SURFACE_POINTER`: the EGLSurface associated with
   *   the window
   *
   * On Windows:
   *
   * - `SDL_PROP_WINDOW_WIN32_HWND_POINTER`: the HWND associated with the window
   * - `SDL_PROP_WINDOW_WIN32_HDC_POINTER`: the HDC associated with the window
   * - `SDL_PROP_WINDOW_WIN32_INSTANCE_POINTER`: the HINSTANCE associated with
   *   the window
   *
   * On Wayland:
   *
   * Note: The `xdg_*` window objects do not internally persist across window
   * show/hide calls. They will be null if the window is hidden and must be
   * queried each time it is shown.
   *
   * - `SDL_PROP_WINDOW_WAYLAND_DISPLAY_POINTER`: the wl_display associated with
   *   the window
   * - `SDL_PROP_WINDOW_WAYLAND_SURFACE_POINTER`: the wl_surface associated with
   *   the window
   * - `SDL_PROP_WINDOW_WAYLAND_VIEWPORT_POINTER`: the wp_viewport associated
   *   with the window
   * - `SDL_PROP_WINDOW_WAYLAND_EGL_WINDOW_POINTER`: the wl_egl_window
   *   associated with the window
   * - `SDL_PROP_WINDOW_WAYLAND_XDG_SURFACE_POINTER`: the xdg_surface associated
   *   with the window
   * - `SDL_PROP_WINDOW_WAYLAND_XDG_TOPLEVEL_POINTER`: the xdg_toplevel role
   *   associated with the window
   * - 'SDL_PROP_WINDOW_WAYLAND_XDG_TOPLEVEL_EXPORT_HANDLE_STRING': the export
   *   handle associated with the window
   * - `SDL_PROP_WINDOW_WAYLAND_XDG_POPUP_POINTER`: the xdg_popup role
   *   associated with the window
   * - `SDL_PROP_WINDOW_WAYLAND_XDG_POSITIONER_POINTER`: the xdg_positioner
   *   associated with the window, in popup mode
   *
   * On X11:
   *
   * - `SDL_PROP_WINDOW_X11_DISPLAY_POINTER`: the X11 Display associated with
   *   the window
   * - `SDL_PROP_WINDOW_X11_SCREEN_NUMBER`: the screen number associated with
   *   the window
   * - `SDL_PROP_WINDOW_X11_WINDOW_NUMBER`: the X11 Window associated with the
   *   window
   *
   * On Emscripten:
   *
   * - `SDL_PROP_WINDOW_EMSCRIPTEN_CANVAS_ID_STRING`: the id the canvas element
   *   will have
   * - `SDL_PROP_WINDOW_EMSCRIPTEN_KEYBOARD_ELEMENT_STRING`: the keyboard
   *   element that associates keyboard events to this window
   *
   * @param window the window to query.
   * @returns a valid property ID on success or 0 on failure; call
   *          SDL_GetError() for more information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @from SDL_video.h:1627 SDL_PropertiesID SDL_GetWindowProperties(SDL_Window *window);
   */
  get properties(): number {
    return SDL.getWindowProperties(this.pointer);
  }

  /**
   * Get the window flags.
   *
   * @param window the window to query.
   * @returns a mask of the SDL_WindowFlags associated with `window`.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_CreateWindow
   * @sa SDL_HideWindow
   * @sa SDL_MaximizeWindow
   * @sa SDL_MinimizeWindow
   * @sa SDL_SetWindowFullscreen
   * @sa SDL_SetWindowMouseGrab
   * @sa SDL_SetWindowFillDocument
   * @sa SDL_ShowWindow
   *
   * @from SDL_video.h:1686 SDL_WindowFlags SDL_GetWindowFlags(SDL_Window *window);
   */
  get flags(): bigint {
    return SDL.getWindowFlags(this.pointer);
  }

  /**
   * Set the title of a window.
   *
   * This string is expected to be in UTF-8 encoding.
   *
   * @param window the window to change.
   * @param title the desired window title in UTF-8 format.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_GetWindowTitle
   *
   * @from SDL_video.h:1704 bool SDL_SetWindowTitle(SDL_Window *window, const char *title);
   */
  setTitle(title: string): boolean {
    return SDL.setWindowTitle(this.pointer, title);
  }

  /**
   * Get the title of a window.
   *
   * @param window the window to query.
   * @returns the title of the window in UTF-8 format or "" if there is no
   *          title.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_SetWindowTitle
   *
   * @from SDL_video.h:1719 const char * SDL_GetWindowTitle(SDL_Window *window);
   */
  get title(): string {
    return SDL.getWindowTitle(this.pointer);
  }

  /**
   * Set the icon for a window.
   *
   * If this function is passed a surface with alternate representations added
   * using SDL_AddSurfaceAlternateImage(), the surface will be interpreted as
   * the content to be used for 100% display scale, and the alternate
   * representations will be used for high DPI situations. For example, if the
   * original surface is 32x32, then on a 2x macOS display or 200% display scale
   * on Windows, a 64x64 version of the image will be used, if available. If a
   * matching version of the image isn't available, the closest larger size
   * image will be downscaled to the appropriate size and be used instead, if
   * available. Otherwise, the closest smaller image will be upscaled and be
   * used instead.
   *
   * @param window the window to change.
   * @param icon an SDL_Surface structure containing the icon for the window.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_AddSurfaceAlternateImage
   *
   * @from SDL_video.h:1746 bool SDL_SetWindowIcon(SDL_Window *window, SDL_Surface *icon);
   */
  setIcon(icon: SurfacePointer): boolean {
    return SDL.setWindowIcon(this.pointer, icon);
  }

  /**
   * Request that the window's position be set.
   *
   * If the window is in an exclusive fullscreen or maximized state, this
   * request has no effect.
   *
   * This can be used to reposition fullscreen-desktop windows onto a different
   * display, however, as exclusive fullscreen windows are locked to a specific
   * display, they can only be repositioned programmatically via
   * SDL_SetWindowFullscreenMode().
   *
   * On some windowing systems this request is asynchronous and the new
   * coordinates may not have have been applied immediately upon the return of
   * this function. If an immediate change is required, call SDL_SyncWindow() to
   * block until the changes have taken effect.
   *
   * When the window position changes, an SDL_EVENT_WINDOW_MOVED event will be
   * emitted with the window's new coordinates. Note that the new coordinates
   * may not match the exact coordinates requested, as some windowing systems
   * can restrict the position of the window in certain scenarios (e.g.
   * constraining the position so the window is always within desktop bounds).
   * Additionally, as this is just a request, it can be denied by the windowing
   * system.
   *
   * @param window the window to reposition.
   * @param x the x coordinate of the window, or `SDL_WINDOWPOS_CENTERED` or
   *          `SDL_WINDOWPOS_UNDEFINED`.
   * @param y the y coordinate of the window, or `SDL_WINDOWPOS_CENTERED` or
   *          `SDL_WINDOWPOS_UNDEFINED`.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_GetWindowPosition
   * @sa SDL_SyncWindow
   *
   * @from SDL_video.h:1787 bool SDL_SetWindowPosition(SDL_Window *window, int x, int y);
   */
  setPosition(x: number, y: number): boolean {
    return SDL.setWindowPosition(this.pointer, x, y);
  }
  /**
   * Get the position of a window.
   *
   * This is the current position of the window as last reported by the
   * windowing system.
   *
   * If you do not need the value for one of the positions a NULL may be passed
   * in the `x` or `y` parameter.
   *
   * @param window the window to query.
   * @param x a pointer filled in with the x position of the window, may be
   *          NULL.
   * @param y a pointer filled in with the y position of the window, may be
   *          NULL.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_SetWindowPosition
   *
   * @from SDL_video.h:1812 bool SDL_GetWindowPosition(SDL_Window *window, int *x, int *y);
   */
  get position(): { x: number; y: number } {
    return SDL.getWindowPosition(this.pointer);
  }

  /**
   * Request that the size of a window's client area be set.
   *
   * If the window is in a fullscreen or maximized state, this request has no
   * effect.
   *
   * To change the exclusive fullscreen mode of a window, use
   * SDL_SetWindowFullscreenMode().
   *
   * On some windowing systems, this request is asynchronous and the new window
   * size may not have have been applied immediately upon the return of this
   * function. If an immediate change is required, call SDL_SyncWindow() to
   * block until the changes have taken effect.
   *
   * When the window size changes, an SDL_EVENT_WINDOW_RESIZED event will be
   * emitted with the new window dimensions. Note that the new dimensions may
   * not match the exact size requested, as some windowing systems can restrict
   * the window size in certain scenarios (e.g. constraining the size of the
   * content area to remain within the usable desktop bounds). Additionally, as
   * this is just a request, it can be denied by the windowing system.
   *
   * @param window the window to change.
   * @param w the width of the window, must be > 0.
   * @param h the height of the window, must be > 0.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_GetWindowSize
   * @sa SDL_SetWindowFullscreenMode
   * @sa SDL_SyncWindow
   *
   * @from SDL_video.h:1849 bool SDL_SetWindowSize(SDL_Window *window, int w, int h);
   */
  setSize({ w, h }: Size): boolean {
    return SDL.setWindowSize(this.pointer, w, h);
  }

  /**
   * Get the size of a window's client area.
   *
   * The window pixel size may differ from its window coordinate size if the
   * window is on a high pixel density display. Use SDL_GetWindowSizeInPixels()
   * or SDL_GetRenderOutputSize() to get the real client area size in pixels.
   *
   * @param window the window to query the width and height from.
   * @param w a pointer filled in with the width of the window, may be NULL.
   * @param h a pointer filled in with the height of the window, may be NULL.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_GetRenderOutputSize
   * @sa SDL_GetWindowSizeInPixels
   * @sa SDL_SetWindowSize
   * @sa SDL_EVENT_WINDOW_RESIZED
   *
   * @from SDL_video.h:1873 bool SDL_GetWindowSize(SDL_Window *window, int *w, int *h);
   */
  get size(): Size {
    return SDL.getWindowSize(this.pointer);
  }

  /**
   * Get the safe area for this window.
   *
   * Some devices have portions of the screen which are partially obscured or
   * not interactive, possibly due to on-screen controls, curved edges, camera
   * notches, TV overscan, etc. This function provides the area of the window
   * which is safe to have interactable content. You should continue rendering
   * into the rest of the window, but it should not contain visually important
   * or interactable content.
   *
   * @param window the window to query.
   * @param rect a pointer filled in with the client area that is safe for
   *             interactive content.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @from SDL_video.h:1895 bool SDL_GetWindowSafeArea(SDL_Window *window, SDL_Rect *rect);
   */
  safeArea(): _r.Rect {
    return SDL.getWindowSafeArea(this.pointer);
  }

  /**
   * Request that the aspect ratio of a window's client area be set.
   *
   * The aspect ratio is the ratio of width divided by height, e.g. 2560x1600
   * would be 1.6. Larger aspect ratios are wider and smaller aspect ratios are
   * narrower.
   *
   * If, at the time of this request, the window in a fixed-size state, such as
   * maximized or fullscreen, the request will be deferred until the window
   * exits this state and becomes resizable again.
   *
   * On some windowing systems, this request is asynchronous and the new window
   * aspect ratio may not have have been applied immediately upon the return of
   * this function. If an immediate change is required, call SDL_SyncWindow() to
   * block until the changes have taken effect.
   *
   * When the window size changes, an SDL_EVENT_WINDOW_RESIZED event will be
   * emitted with the new window dimensions. Note that the new dimensions may
   * not match the exact aspect ratio requested, as some windowing systems can
   * restrict the window size in certain scenarios (e.g. constraining the size
   * of the content area to remain within the usable desktop bounds).
   * Additionally, as this is just a request, it can be denied by the windowing
   * system.
   *
   * @param window the window to change.
   * @param min_aspect the minimum aspect ratio of the window, or 0.0f for no
   *                   limit.
   * @param max_aspect the maximum aspect ratio of the window, or 0.0f for no
   *                   limit.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_GetWindowAspectRatio
   * @sa SDL_SyncWindow
   *
   * @from SDL_video.h:1936 bool SDL_SetWindowAspectRatio(SDL_Window *window, float min_aspect, float max_aspect);
   */
  setAspectRatio(min_aspect: number, max_aspect: number): boolean {
    return SDL.setWindowAspectRatio(this.pointer, min_aspect, max_aspect);
  }

  /**
   * Get the aspect ratio of a window's client area.
   *
   * @param window the window to query the width and height from.
   * @param min_aspect a pointer filled in with the minimum aspect ratio of the
   *                   window, may be NULL.
   * @param max_aspect a pointer filled in with the maximum aspect ratio of the
   *                   window, may be NULL.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_SetWindowAspectRatio
   *
   * @from SDL_video.h:1955 bool SDL_GetWindowAspectRatio(SDL_Window *window, float *min_aspect, float *max_aspect);
   */
  get aspectRatio(): { min_aspect: number; max_aspect: number } {
    return SDL.getWindowAspectRatio(this.pointer);
  }

  /**
   * Get the size of a window's borders (decorations) around the client area.
   *
   * Note: If this function fails (returns false), the size values will be
   * initialized to 0, 0, 0, 0 (if a non-NULL pointer is provided), as if the
   * window in question was borderless.
   *
   * Note: This function may fail on systems where the window has not yet been
   * decorated by the display server (for example, immediately after calling
   * SDL_CreateWindow). It is recommended that you wait at least until the
   * window has been presented and composited, so that the window system has a
   * chance to decorate the window and provide the border dimensions to SDL.
   *
   * This function also returns false if getting the information is not
   * supported.
   *
   * @param window the window to query the size values of the border
   *               (decorations) from.
   * @param top pointer to variable for storing the size of the top border; NULL
   *            is permitted.
   * @param left pointer to variable for storing the size of the left border;
   *             NULL is permitted.
   * @param bottom pointer to variable for storing the size of the bottom
   *               border; NULL is permitted.
   * @param right pointer to variable for storing the size of the right border;
   *              NULL is permitted.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_GetWindowSize
   *
   * @from SDL_video.h:1992 bool SDL_GetWindowBordersSize(SDL_Window *window, int *top, int *left, int *bottom, int *right);
   */
  get bordersSize(): {
    top: number;
    left: number;
    bottom: number;
    right: number;
  } {
    return SDL.getWindowBordersSize(
      this.pointer,
    );
  }
  /**
   * Get the size of a window's client area, in pixels.
   *
   * @param window the window from which the drawable size should be queried.
   * @param w a pointer to variable for storing the width in pixels, may be
   *          NULL.
   * @param h a pointer to variable for storing the height in pixels, may be
   *          NULL.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_CreateWindow
   * @sa SDL_GetWindowSize
   *
   * @from SDL_video.h:2012 bool SDL_GetWindowSizeInPixels(SDL_Window *window, int *w, int *h);
   */
  get sizeInPixels(): Size {
    return SDL.getWindowSizeInPixels(this.pointer);
  }
  /**
   * Set the minimum size of a window's client area.
   *
   * @param window the window to change.
   * @param min_w the minimum width of the window, or 0 for no limit.
   * @param min_h the minimum height of the window, or 0 for no limit.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_GetWindowMinimumSize
   * @sa SDL_SetWindowMaximumSize
   *
   * @from SDL_video.h:2030 bool SDL_SetWindowMinimumSize(SDL_Window *window, int min_w, int min_h);
   */
  setMinimumSize(min_w: number, min_h: number): boolean {
    return SDL.setWindowMinimumSize(this.pointer, min_w, min_h);
  }

  /**
   * Get the minimum size of a window's client area.
   *
   * @param window the window to query.
   * @param w a pointer filled in with the minimum width of the window, may be
   *          NULL.
   * @param h a pointer filled in with the minimum height of the window, may be
   *          NULL.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_GetWindowMaximumSize
   * @sa SDL_SetWindowMinimumSize
   *
   * @from SDL_video.h:2050 bool SDL_GetWindowMinimumSize(SDL_Window *window, int *w, int *h);
   */
  get minimumSize(): Size {
    return SDL.getWindowMinimumSize(this.pointer);
  }

  /**
   * Set the maximum size of a window's client area.
   *
   * @param window the window to change.
   * @param max_w the maximum width of the window, or 0 for no limit.
   * @param max_h the maximum height of the window, or 0 for no limit.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_GetWindowMaximumSize
   * @sa SDL_SetWindowMinimumSize
   *
   * @from SDL_video.h:2068 bool SDL_SetWindowMaximumSize(SDL_Window *window, int max_w, int max_h);
   */
  setMaximumSize(max_w: number, max_h: number): boolean {
    return SDL.setWindowMaximumSize(this.pointer, max_w, max_h);
  }

  /**
   * Get the maximum size of a window's client area.
   *
   * @param window the window to query.
   * @param w a pointer filled in with the maximum width of the window, may be
   *          NULL.
   * @param h a pointer filled in with the maximum height of the window, may be
   *          NULL.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_GetWindowMinimumSize
   * @sa SDL_SetWindowMaximumSize
   *
   * @from SDL_video.h:2088 bool SDL_GetWindowMaximumSize(SDL_Window *window, int *w, int *h);
   */
  get maximumSize(): Size {
    return SDL.getWindowMaximumSize(this.pointer);
  }

  /**
   * Set the border state of a window.
   *
   * This will add or remove the window's `SDL_WINDOW_BORDERLESS` flag and add
   * or remove the border from the actual window. This is a no-op if the
   * window's border already matches the requested state.
   *
   * You can't change the border state of a fullscreen window.
   *
   * @param window the window of which to change the border state.
   * @param bordered false to remove border, true to add border.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_GetWindowFlags
   *
   * @from SDL_video.h:2110 bool SDL_SetWindowBordered(SDL_Window *window, bool bordered);
   */
  setBordered(bordered: boolean): boolean {
    return SDL.setWindowBordered(this.pointer, bordered);
  }

  /**
   * Set the user-resizable state of a window.
   *
   * This will add or remove the window's `SDL_WINDOW_RESIZABLE` flag and
   * allow/disallow user resizing of the window. This is a no-op if the window's
   * resizable state already matches the requested state.
   *
   * You can't change the resizable state of a fullscreen window.
   *
   * @param window the window of which to change the resizable state.
   * @param resizable true to allow resizing, false to disallow.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_GetWindowFlags
   *
   * @from SDL_video.h:2132 bool SDL_SetWindowResizable(SDL_Window *window, bool resizable);
   */
  setResizable(resizable: boolean): boolean {
    return SDL.setWindowResizable(this.pointer, resizable);
  }
  /**
   * Set the window to always be above the others.
   *
   * This will add or remove the window's `SDL_WINDOW_ALWAYS_ON_TOP` flag. This
   * will bring the window to the front and keep the window above the rest.
   *
   * @param window the window of which to change the always on top state.
   * @param on_top true to set the window always on top, false to disable.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_GetWindowFlags
   *
   * @from SDL_video.h:2151 bool SDL_SetWindowAlwaysOnTop(SDL_Window *window, bool on_top);
   */
  setAlwaysOnTop(on_top: boolean): boolean {
    return SDL.setWindowAlwaysOnTop(this.pointer, on_top);
  }


  /**
   * Set the window to fill the current document space (Emscripten only).
   *
   * This will add or remove the window's `SDL_WINDOW_FILL_DOCUMENT` flag.
   *
   * Currently this flag only applies to the Emscripten target.
   *
   * When enabled, the canvas element fills the entire document. Resize events
   * will be generated as the browser window is resized, as that will adjust the
   * canvas size as well. The canvas will cover anything else on the page,
   * including any controls provided by Emscripten in its generated HTML file
   * (in fact, any elements on the page that aren't the canvas will be moved
   * into a hidden `div` element).
   *
   * Often times this is desirable for a browser-based game, but it means
   * several things that we expect of an SDL window on other platforms might not
   * work as expected, such as minimum window sizes and aspect ratios.
   *
   * @param window the window of which to change the fill-document state.
   * @param fill true to set the window to fill the document, false to disable.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.4.0.
   *
   * @sa SDL_GetWindowFlags
   *
   * @from SDL_video.h:2182 bool SDL_SetWindowFillDocument(SDL_Window *window, bool fill);
   */
  setFillDocument(fill: boolean): boolean {
    return SDL.setWindowFillDocument(this.pointer, fill);
  }


  /**
   * Show a window.
   *
   * @param window the window to show.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_HideWindow
   * @sa SDL_RaiseWindow
   *
   * @from SDL_video.h:2198 bool SDL_ShowWindow(SDL_Window *window);
   */
  show(): boolean {
    return SDL.showWindow(this.pointer);
  }

  /**
   * Hide a window.
   *
   * @param window the window to hide.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_ShowWindow
   * @sa SDL_WINDOW_HIDDEN
   *
   * @from SDL_video.h:2214 bool SDL_HideWindow(SDL_Window *window);
   */

  hide(): boolean {
    return SDL.hideWindow(this.pointer);
  }

  /**
   * Request that a window be raised above other windows and gain the input
   * focus.
   *
   * The result of this request is subject to desktop window manager policy,
   * particularly if raising the requested window would result in stealing focus
   * from another application. If the window is successfully raised and gains
   * input focus, an SDL_EVENT_WINDOW_FOCUS_GAINED event will be emitted, and
   * the window will have the SDL_WINDOW_INPUT_FOCUS flag set.
   *
   * @param window the window to raise.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @from SDL_video.h:2234 bool SDL_RaiseWindow(SDL_Window *window);
   */
  raise(): boolean {
    return SDL.raiseWindow(this.pointer);
  }

  /**
   * Request that the window be made as large as possible.
   *
   * Non-resizable windows can't be maximized. The window must have the
   * SDL_WINDOW_RESIZABLE flag set, or this will have no effect.
   *
   * On some windowing systems this request is asynchronous and the new window
   * state may not have have been applied immediately upon the return of this
   * function. If an immediate change is required, call SDL_SyncWindow() to
   * block until the changes have taken effect.
   *
   * When the window state changes, an SDL_EVENT_WINDOW_MAXIMIZED event will be
   * emitted. Note that, as this is just a request, the windowing system can
   * deny the state change.
   *
   * When maximizing a window, whether the constraints set via
   * SDL_SetWindowMaximumSize() are honored depends on the policy of the window
   * manager. Win32 and macOS enforce the constraints when maximizing, while X11
   * and Wayland window managers may vary.
   *
   * @param window the window to maximize.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_MinimizeWindow
   * @sa SDL_RestoreWindow
   * @sa SDL_SyncWindow
   *
   * @from SDL_video.h:2268 bool SDL_MaximizeWindow(SDL_Window *window);
   */
  maximize(): boolean {
    return SDL.maximizeWindow(this.pointer);
  }

  /**
   * Request that the window be minimized to an iconic representation.
   *
   * If the window is in a fullscreen state, this request has no direct effect.
   * It may alter the state the window is returned to when leaving fullscreen.
   *
   * On some windowing systems this request is asynchronous and the new window
   * state may not have been applied immediately upon the return of this
   * function. If an immediate change is required, call SDL_SyncWindow() to
   * block until the changes have taken effect.
   *
   * When the window state changes, an SDL_EVENT_WINDOW_MINIMIZED event will be
   * emitted. Note that, as this is just a request, the windowing system can
   * deny the state change.
   *
   * @param window the window to minimize.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_MaximizeWindow
   * @sa SDL_RestoreWindow
   * @sa SDL_SyncWindow
   *
   * @from SDL_video.h:2297 bool SDL_MinimizeWindow(SDL_Window *window);
   */
  minimize(): boolean {
    return SDL.minimizeWindow(this.pointer);
  }

  /**
   * Request that the size and position of a minimized or maximized window be
   * restored.
   *
   * If the window is in a fullscreen state, this request has no direct effect.
   * It may alter the state the window is returned to when leaving fullscreen.
   *
   * On some windowing systems this request is asynchronous and the new window
   * state may not have have been applied immediately upon the return of this
   * function. If an immediate change is required, call SDL_SyncWindow() to
   * block until the changes have taken effect.
   *
   * When the window state changes, an SDL_EVENT_WINDOW_RESTORED event will be
   * emitted. Note that, as this is just a request, the windowing system can
   * deny the state change.
   *
   * @param window the window to restore.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_MaximizeWindow
   * @sa SDL_MinimizeWindow
   * @sa SDL_SyncWindow
   *
   * @from SDL_video.h:2327 bool SDL_RestoreWindow(SDL_Window *window);
   */
  restore(): boolean {
    return SDL.restoreWindow(this.pointer);
  }

  /**
   * Request that the window's fullscreen state be changed.
   *
   * By default a window in fullscreen state uses borderless fullscreen desktop
   * mode, but a specific exclusive display mode can be set using
   * SDL_SetWindowFullscreenMode().
   *
   * On some windowing systems this request is asynchronous and the new
   * fullscreen state may not have have been applied immediately upon the return
   * of this function. If an immediate change is required, call SDL_SyncWindow()
   * to block until the changes have taken effect.
   *
   * When the window state changes, an SDL_EVENT_WINDOW_ENTER_FULLSCREEN or
   * SDL_EVENT_WINDOW_LEAVE_FULLSCREEN event will be emitted. Note that, as this
   * is just a request, it can be denied by the windowing system.
   *
   * @param window the window to change.
   * @param fullscreen true for fullscreen mode, false for windowed mode.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_GetWindowFullscreenMode
   * @sa SDL_SetWindowFullscreenMode
   * @sa SDL_SyncWindow
   * @sa SDL_WINDOW_FULLSCREEN
   *
   * @from SDL_video.h:2359 bool SDL_SetWindowFullscreen(SDL_Window *window, bool fullscreen);
   */
  setFullScreen(fullscreen: boolean): boolean {
    return SDL.setWindowFullscreen(this.pointer, fullscreen);
  }

  /**
   * Block until any pending window state is finalized.
   *
   * On asynchronous windowing systems, this acts as a synchronization barrier
   * for pending window state. It will attempt to wait until any pending window
   * state has been applied and is guaranteed to return within finite time. Note
   * that for how long it can potentially block depends on the underlying window
   * system, as window state changes may involve somewhat lengthy animations
   * that must complete before the window is in its final requested state.
   *
   * On windowing systems where changes are immediate, this does nothing.
   *
   * @param window the window for which to wait for the pending state to be
   *               applied.
   * @returns true on success or false if the operation timed out before the
   *          window was in the requested state.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_SetWindowSize
   * @sa SDL_SetWindowPosition
   * @sa SDL_SetWindowFullscreen
   * @sa SDL_MinimizeWindow
   * @sa SDL_MaximizeWindow
   * @sa SDL_RestoreWindow
   * @sa SDL_HINT_VIDEO_SYNC_WINDOW_OPERATIONS
   *
   * @from SDL_video.h:2390 bool SDL_SyncWindow(SDL_Window *window);
   */
  sync(): boolean {
    return SDL.syncWindow(this.pointer);
  }

  /**
   * Return whether the window has a surface associated with it.
   *
   * @param window the window to query.
   * @returns true if there is a surface associated with the window, or false
   *          otherwise.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_GetWindowSurface
   *
   * @from SDL_video.h:2405 bool SDL_WindowHasSurface(SDL_Window *window);
   */
  hasSurface(): boolean {
    return SDL.windowHasSurface(this.pointer);
  }

  /**
   * Get the SDL surface associated with the window.
   *
   * A new surface will be created with the optimal format for the window, if
   * necessary. This surface will be freed when the window is destroyed. Do not
   * free this surface.
   *
   * This surface will be invalidated if the window is resized. After resizing a
   * window this function must be called again to return a valid surface.
   *
   * You may not combine this with 3D or the rendering API on this window.
   *
   * This function is affected by `SDL_HINT_FRAMEBUFFER_ACCELERATION`.
   *
   * @param window the window to query.
   * @returns the surface associated with the window, or NULL on failure; call
   *          SDL_GetError() for more information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_DestroyWindowSurface
   * @sa SDL_WindowHasSurface
   * @sa SDL_UpdateWindowSurface
   * @sa SDL_UpdateWindowSurfaceRects
   *
   * @from SDL_video.h:2434 SDL_Surface * SDL_GetWindowSurface(SDL_Window *window);
   */
  get surface(): SurfacePointer {
    return SDL.getWindowSurface(this.pointer);
  }

  /**
   * Toggle VSync for the window surface.
   *
   * When a window surface is created, vsync defaults to
   * SDL_WINDOW_SURFACE_VSYNC_DISABLED.
   *
   * The `vsync` parameter can be 1 to synchronize present with every vertical
   * refresh, 2 to synchronize present with every second vertical refresh, etc.,
   * SDL_WINDOW_SURFACE_VSYNC_ADAPTIVE for late swap tearing (adaptive vsync),
   * or SDL_WINDOW_SURFACE_VSYNC_DISABLED to disable. Not every value is
   * supported by every driver, so you should check the return value to see
   * whether the requested setting is supported.
   *
   * @param window the window.
   * @param vsync the vertical refresh sync interval.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_GetWindowSurfaceVSync
   *
   * @from SDL_video.h:2460 bool SDL_SetWindowSurfaceVSync(SDL_Window *window, int vsync);
   */
  setSurfaceVSync(vsync: number): boolean {
    return SDL.setWindowSurfaceVSync(this.pointer, vsync);
  }

  /**
   * Get VSync for the window surface.
   *
   * @param window the window to query.
   * @param vsync an int filled with the current vertical refresh sync interval.
   *              See SDL_SetWindowSurfaceVSync() for the meaning of the value.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_SetWindowSurfaceVSync
   *
   * @from SDL_video.h:2480 bool SDL_GetWindowSurfaceVSync(SDL_Window *window, int *vsync);
   */
  get surfaceVSync(): number {
    return SDL.getWindowSurfaceVSync(this.pointer);
  }

  /**
   * Copy the window surface to the screen.
   *
   * This is the function you use to reflect any changes to the surface on the
   * screen.
   *
   * This function is equivalent to the SDL 1.2 API SDL_Flip().
   *
   * @param window the window to update.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_GetWindowSurface
   * @sa SDL_UpdateWindowSurfaceRects
   *
   * @from SDL_video.h:2501 bool SDL_UpdateWindowSurface(SDL_Window *window);
   */
  updateSurface(): boolean {
    return SDL.updateWindowSurface(this.pointer);
  }

  /**
   * Copy areas of the window surface to the screen.
   *
   * This is the function you use to reflect changes to portions of the surface
   * on the screen.
   *
   * This function is equivalent to the SDL 1.2 API SDL_UpdateRects().
   *
   * Note that this function will update _at least_ the rectangles specified,
   * but this is only intended as an optimization; in practice, this might
   * update more of the screen (or all of the screen!), depending on what method
   * SDL uses to send pixels to the system.
   *
   * @param window the window to update.
   * @param rects an array of SDL_Rect structures representing areas of the
   *              surface to copy, in pixels.
   * @param numrects the number of rectangles.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_GetWindowSurface
   * @sa SDL_UpdateWindowSurface
   *
   * @from SDL_video.h:2530 bool SDL_UpdateWindowSurfaceRects(SDL_Window *window, const SDL_Rect *rects, int numrects);
   */
  updateSurfaceRects(rects: _r.Rect[]): boolean {
    return SDL.updateWindowSurfaceRects(this.pointer, rects);
  }
  /**
   * Destroy the surface associated with the window.
   *
   * @param window the window to update.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_GetWindowSurface
   * @sa SDL_WindowHasSurface
   *
   * @from SDL_video.h:2546 bool SDL_DestroyWindowSurface(SDL_Window *window);
   */
  destroySurface(): boolean {
    return SDL.destroyWindowSurface(this.pointer);
  }

  /**
   * Set a window's keyboard grab mode.
   *
   * Keyboard grab enables capture of system keyboard shortcuts like Alt+Tab or
   * the Meta/Super key. Note that not all system keyboard shortcuts can be
   * captured by applications (one example is Ctrl+Alt+Del on Windows).
   *
   * This is primarily intended for specialized applications such as VNC clients
   * or VM frontends. Normal games should not use keyboard grab.
   *
   * When keyboard grab is enabled, SDL will continue to handle Alt+Tab when the
   * window is full-screen to ensure the user is not trapped in your
   * application. If you have a custom keyboard shortcut to exit fullscreen
   * mode, you may suppress this behavior with
   * `SDL_HINT_ALLOW_ALT_TAB_WHILE_GRABBED`.
   *
   * If the caller enables a grab while another window is currently grabbed, the
   * other window loses its grab in favor of the caller's window.
   *
   * @param window the window for which the keyboard grab mode should be set.
   * @param grabbed this is true to grab keyboard, and false to release.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_GetWindowKeyboardGrab
   * @sa SDL_SetWindowMouseGrab
   *
   * @from SDL_video.h:2579 bool SDL_SetWindowKeyboardGrab(SDL_Window *window, bool grabbed);
   */
  setKeyboardGrab(grabbed: boolean): boolean {
    return SDL.setWindowKeyboardGrab(this.pointer, grabbed);
  }
  /**
   * Set a window's mouse grab mode.
   *
   * Mouse grab confines the mouse cursor to the window.
   *
   * @param window the window for which the mouse grab mode should be set.
   * @param grabbed this is true to grab mouse, and false to release.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_GetWindowMouseRect
   * @sa SDL_SetWindowMouseRect
   * @sa SDL_SetWindowKeyboardGrab
   *
   * @from SDL_video.h:2599 bool SDL_SetWindowMouseGrab(SDL_Window *window, bool grabbed);
   */
  setMouseGrab(grabbed: boolean): boolean {
    return SDL.setWindowMouseGrab(this.pointer, grabbed);
  }

  /**
   * Get a window's keyboard grab mode.
   *
   * @param window the window to query.
   * @returns true if keyboard is grabbed, and false otherwise.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_SetWindowKeyboardGrab
   *
   * @from SDL_video.h:2613 bool SDL_GetWindowKeyboardGrab(SDL_Window *window);
   */
  getKeyboardGrab(): boolean {
    return SDL.getWindowKeyboardGrab(this.pointer);
  }

  /**
   * Get a window's mouse grab mode.
   *
   * @param window the window to query.
   * @returns true if mouse is grabbed, and false otherwise.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_GetWindowMouseRect
   * @sa SDL_SetWindowMouseRect
   * @sa SDL_SetWindowMouseGrab
   * @sa SDL_SetWindowKeyboardGrab
   *
   * @from SDL_video.h:2630 bool SDL_GetWindowMouseGrab(SDL_Window *window);
   */
  getMouseGrab(): boolean {
    return SDL.getWindowMouseGrab(this.pointer);
  }

  /**
   * Get the window that currently has an input grab enabled.
   *
   * @returns the window if input is grabbed or NULL otherwise.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_SetWindowMouseGrab
   * @sa SDL_SetWindowKeyboardGrab
   *
   * @from SDL_video.h:2644 SDL_Window * SDL_GetGrabbedWindow(void);
   */
  static get grabbed(): Window {
    const r = SDL.getGrabbedWindow();
    if (!r) throw SdlError("getGrabbedWindow");
    return new Window(r);
  }

  /**
   * Confines the cursor to the specified area of a window.
   *
   * Note that this does NOT grab the cursor, it only defines the area a cursor
   * is restricted to when the window has mouse focus.
   *
   * @param window the window that will be associated with the barrier.
   * @param rect a rectangle area in window-relative coordinates. If NULL the
   *             barrier for the specified window will be destroyed.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_GetWindowMouseRect
   * @sa SDL_GetWindowMouseGrab
   * @sa SDL_SetWindowMouseGrab
   *
   * @from SDL_video.h:2666 bool SDL_SetWindowMouseRect(SDL_Window *window, const SDL_Rect *rect);
   */
  setMouseRect(rect: _r.Rect): boolean {
    return SDL.setWindowMouseRect(this.pointer, rect);
  }

  /**
   * Get the mouse confinement rectangle of a window.
   *
   * @param window the window to query.
   * @returns a pointer to the mouse confinement rectangle of a window, or NULL
   *          if there isn't one.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_SetWindowMouseRect
   * @sa SDL_GetWindowMouseGrab
   * @sa SDL_SetWindowMouseGrab
   *
   * @from SDL_video.h:2683 const SDL_Rect * SDL_GetWindowMouseRect(SDL_Window *window);
   */
  get mouseRect(): _r.Rect {
    return SDL.getWindowMouseRect(this.pointer);
  }

  /**
   * Set the opacity for a window.
   *
   * The parameter `opacity` will be clamped internally between 0.0f
   * (transparent) and 1.0f (opaque).
   *
   * This function also returns false if setting the opacity isn't supported.
   *
   * @param window the window which will be made transparent or opaque.
   * @param opacity the opacity value (0.0f - transparent, 1.0f - opaque).
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_GetWindowOpacity
   *
   * @from SDL_video.h:2704 bool SDL_SetWindowOpacity(SDL_Window *window, float opacity);
   */
  setOpacity(opacity: number): boolean {
    return SDL.setWindowOpacity(this.pointer, opacity);
  }

  /**
   * Get the opacity of a window.
   *
   * If transparency isn't supported on this platform, opacity will be returned
   * as 1.0f without error.
   *
   * @param window the window to get the current opacity value from.
   * @returns the opacity, (0.0f - transparent, 1.0f - opaque), or -1.0f on
   *          failure; call SDL_GetError() for more information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_SetWindowOpacity
   *
   * @from SDL_video.h:2722 float SDL_GetWindowOpacity(SDL_Window *window);
   */
  get opacity(): number {
    return SDL.getWindowOpacity(this.pointer);
  }

  /**
   * Set the window as a child of a parent window.
   *
   * If the window is already the child of an existing window, it will be
   * reparented to the new owner. Setting the parent window to NULL unparents
   * the window and removes child window status.
   *
   * If a parent window is hidden or destroyed, the operation will be
   * recursively applied to child windows. Child windows hidden with the parent
   * that did not have their hidden status explicitly set will be restored when
   * the parent is shown.
   *
   * Attempting to set the parent of a window that is currently in the modal
   * state will fail. Use SDL_SetWindowModal() to cancel the modal status before
   * attempting to change the parent.
   *
   * Popup windows cannot change parents and attempts to do so will fail.
   *
   * Setting a parent window that is currently the sibling or descendent of the
   * child window results in undefined behavior.
   *
   * @param window the window that should become the child of a parent.
   * @param parent the new parent window for the child window.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_SetWindowModal
   *
   * @from SDL_video.h:2756 bool SDL_SetWindowParent(SDL_Window *window, SDL_Window *parent);
   */
  setParent(parent: Window): boolean {
    return SDL.setWindowParent(this.pointer, parent.pointer);
  }

  /**
   * Toggle the state of the window as modal.
   *
   * To enable modal status on a window, the window must currently be the child
   * window of a parent, or toggling modal status on will fail.
   *
   * @param window the window on which to set the modal state.
   * @param modal true to toggle modal status on, false to toggle it off.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_SetWindowParent
   * @sa SDL_WINDOW_MODAL
   *
   * @from SDL_video.h:2776 bool SDL_SetWindowModal(SDL_Window *window, bool modal);
   */
  setModal(modal: boolean): boolean {
    return SDL.setWindowModal(this.pointer, modal);
  }

  /**
   * Set whether the window may have input focus.
   *
   * @param window the window to set focusable state.
   * @param focusable true to allow input focus, false to not allow input focus.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @from SDL_video.h:2790 bool SDL_SetWindowFocusable(SDL_Window *window, bool focusable);
   */
  setFocusable(focusable: boolean): boolean {
    return SDL.setWindowFocusable(this.pointer, focusable);
  }

  /**
   * Display the system-level window menu.
   *
   * This default window menu is provided by the system and on some platforms
   * provides functionality for setting or changing privileged state on the
   * window, such as moving it between workspaces or displays, or toggling the
   * always-on-top property.
   *
   * On platforms or desktops where this is unsupported, this function does
   * nothing.
   *
   * @param window the window for which the menu will be displayed.
   * @param x the x coordinate of the menu, relative to the origin (top-left) of
   *          the client area.
   * @param y the y coordinate of the menu, relative to the origin (top-left) of
   *          the client area.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @from SDL_video.h:2816 bool SDL_ShowWindowSystemMenu(SDL_Window *window, int x, int y);
   */
  showSystemMenu(x: number, y: number): boolean {
    return SDL.showWindowSystemMenu(this.pointer, x, y);
  }
  /**
   * Set the shape of a transparent window.
   *
   * This sets the alpha channel of a transparent window and any fully
   * transparent areas are also transparent to mouse clicks. If you are using
   * something besides the SDL render API, then you are responsible for drawing
   * the alpha channel of the window to match the shape alpha channel to get
   * consistent cross-platform results.
   *
   * The shape is copied inside this function, so you can free it afterwards. If
   * your shape surface changes, you should call SDL_SetWindowShape() again to
   * update the window. This is an expensive operation, so should be done
   * sparingly.
   *
   * The window must have been created with the SDL_WINDOW_TRANSPARENT flag.
   *
   * @param window the window.
   * @param shape the surface representing the shape of the window, or NULL to
   *              remove any current shape.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @from SDL_video.h:2925 bool SDL_SetWindowShape(SDL_Window *window, SDL_Surface *shape);
   */
  setShape(shape: SurfacePointer): boolean {
    return SDL.setWindowShape(this.pointer, shape);
  }
  /**
   * Request a window to demand attention from the user.
   *
   * @param window the window to be flashed.
   * @param operation the operation to perform.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @from SDL_video.h:2939 bool SDL_FlashWindow(SDL_Window *window, SDL_FlashOperation operation);
   */
  flash(operation: number): boolean {
    return SDL.flashWindow(this.pointer, operation);
  }


  /**
   * Sets the state of the progress bar for the given window’s taskbar icon.
   *
   * @param window the window whose progress state is to be modified.
   * @param state the progress state. `SDL_PROGRESS_STATE_NONE` stops displaying
   *              the progress bar.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.4.0.
   *
   * @from SDL_video.h:2954 bool SDL_SetWindowProgressState(SDL_Window *window, SDL_ProgressState state);
   */
  setProgressState(state: number): boolean {
    return SDL.setWindowProgressState(this.pointer, state);
  }

  /**
   * Get the state of the progress bar for the given window’s taskbar icon.
   *
   * @param window the window to get the current progress state from.
   * @returns the progress state, or `SDL_PROGRESS_STATE_INVALID` on failure;
   *          call SDL_GetError() for more information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.4.0.
   *
   * @from SDL_video.h:2967 SDL_ProgressState SDL_GetWindowProgressState(SDL_Window *window);
   */
  get progressState(): number {
    return SDL.getWindowProgressState(this.pointer);
  }

  /**
   * Sets the value of the progress bar for the given window’s taskbar icon.
   *
   * @param window the window whose progress value is to be modified.
   * @param value the progress value in the range of [0.0f - 1.0f]. If the value
   *              is outside the valid range, it gets clamped.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.4.0.
   *
   * @from SDL_video.h:2982 bool SDL_SetWindowProgressValue(SDL_Window *window, float value);
   */
  setProgressValue(value: number): boolean {
    return SDL.setWindowProgressValue(this.pointer, value);
  }

  /**
   * Get the value of the progress bar for the given window’s taskbar icon.
   *
   * @param window the window to get the current progress value from.
   * @returns the progress value in the range of [0.0f - 1.0f], or -1.0f on
   *          failure; call SDL_GetError() for more information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.4.0.
   *
   * @from SDL_video.h:2995 float SDL_GetWindowProgressValue(SDL_Window *window);
   */
  get progressValue(): number {
    return SDL.getWindowProgressValue(this.pointer);
  }

  /**
   * Destroy a window.
   *
   * Any child windows owned by the window will be recursively destroyed as
   * well.
   *
   * Note that on some platforms, the visible window may not actually be removed
   * from the screen until the SDL event loop is pumped again, even though the
   * SDL_Window is no longer valid after this call.
   *
   * @param window the window to destroy.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_CreatePopupWindow
   * @sa SDL_CreateWindow
   * @sa SDL_CreateWindowWithProperties
   *
   * @from SDL_video.h:3017 void SDL_DestroyWindow(SDL_Window *window);
   */
  destroy() {
    if (!this.pointer) return;
    SDL.destroyWindow(this.pointer);
    this.pointer = null;
  }

  [Symbol.dispose]() {
    this.destroy();
  }
}

export class ScreenSaver {
  /**
   * Check whether the screensaver is currently enabled.
   *
   * The screensaver is disabled by default.
   *
   * The default can also be changed using `SDL_HINT_VIDEO_ALLOW_SCREENSAVER`.
   *
   * @returns true if the screensaver is enabled, false if it is disabled.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_DisableScreenSaver
   * @sa SDL_EnableScreenSaver
   *
   * @from SDL_video.h:3036 bool SDL_ScreenSaverEnabled(void);
   */
  static get enabled(): boolean {
    return SDL.screenSaverEnabled();
  }

  /**
   * Allow the screen to be blanked by a screen saver.
   *
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_DisableScreenSaver
   * @sa SDL_ScreenSaverEnabled
   *
   * @from SDL_video.h:3051 bool SDL_EnableScreenSaver(void);
   */
  static enable(): boolean {
    return SDL.enableScreenSaver();
  }

  /**
   * Prevent the screen from being blanked by a screen saver.
   *
   * If you disable the screensaver, it is automatically re-enabled when SDL
   * quits.
   *
   * The screensaver is disabled by default, but this may by changed by
   * SDL_HINT_VIDEO_ALLOW_SCREENSAVER.
   *
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_EnableScreenSaver
   * @sa SDL_ScreenSaverEnabled
   *
   * @from SDL_video.h:3072 bool SDL_DisableScreenSaver(void);
   */
  disable(): boolean {
    return SDL.disableScreenSaver();
  }
}

export class GL {
  /**
   * Dynamically load an OpenGL library.
   *
   * This should be done after initializing the video driver, but before
   * creating any OpenGL windows. If no OpenGL library is loaded, the default
   * library will be loaded upon creation of the first OpenGL window.
   *
   * If you do this, you need to retrieve all of the GL functions used in your
   * program from the dynamic library using SDL_GL_GetProcAddress().
   *
   * @param path the platform dependent OpenGL library name, or NULL to open the
   *             default OpenGL library.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_GL_GetProcAddress
   * @sa SDL_GL_UnloadLibrary
   *
   * @from SDL_video.h:3102 bool SDL_GL_LoadLibrary(const char *path);
   */
  static loadLibrary(path: string): boolean {
    return SDL.glLoadLibrary(path);
  }
  /**
   * Get an OpenGL function by name.
   *
   * If the GL library is loaded at runtime with SDL_GL_LoadLibrary(), then all
   * GL functions must be retrieved this way. Usually this is used to retrieve
   * function pointers to OpenGL extensions.
   *
   * There are some quirks to looking up OpenGL functions that require some
   * extra care from the application. If you code carefully, you can handle
   * these quirks without any platform-specific code, though:
   *
   * - On Windows, function pointers are specific to the current GL context;
   *   this means you need to have created a GL context and made it current
   *   before calling SDL_GL_GetProcAddress(). If you recreate your context or
   *   create a second context, you should assume that any existing function
   *   pointers aren't valid to use with it. This is (currently) a
   *   Windows-specific limitation, and in practice lots of drivers don't suffer
   *   this limitation, but it is still the way the wgl API is documented to
   *   work and you should expect crashes if you don't respect it. Store a copy
   *   of the function pointers that comes and goes with context lifespan.
   * - On X11, function pointers returned by this function are valid for any
   *   context, and can even be looked up before a context is created at all.
   *   This means that, for at least some common OpenGL implementations, if you
   *   look up a function that doesn't exist, you'll get a non-NULL result that
   *   is _NOT_ safe to call. You must always make sure the function is actually
   *   available for a given GL context before calling it, by checking for the
   *   existence of the appropriate extension with SDL_GL_ExtensionSupported(),
   *   or verifying that the version of OpenGL you're using offers the function
   *   as core functionality.
   * - Some OpenGL drivers, on all platforms, *will* return NULL if a function
   *   isn't supported, but you can't count on this behavior. Check for
   *   extensions you use, and if you get a NULL anyway, act as if that
   *   extension wasn't available. This is probably a bug in the driver, but you
   *   can code defensively for this scenario anyhow.
   * - Just because you're on Linux/Unix, don't assume you'll be using X11.
   *   Next-gen display servers are waiting to replace it, and may or may not
   *   make the same promises about function pointers.
   * - OpenGL function pointers must be declared `APIENTRY` as in the example
   *   code. This will ensure the proper calling convention is followed on
   *   platforms where this matters (Win32) thereby avoiding stack corruption.
   *
   * @param proc the name of an OpenGL function.
   * @returns a pointer to the named OpenGL function. The returned pointer
   *          should be cast to the appropriate function signature.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_GL_ExtensionSupported
   * @sa SDL_GL_LoadLibrary
   * @sa SDL_GL_UnloadLibrary
   *
   * @from SDL_video.h:3157 SDL_FunctionPointer SDL_GL_GetProcAddress(const char *proc);
   */
  static getProcAddress(proc: string): Deno.PointerValue {
    return SDL.glGetProcAddress(proc);
  }

  /**
   * Get an EGL library function by name.
   *
   * If an EGL library is loaded, this function allows applications to get entry
   * points for EGL functions. This is useful to provide to an EGL API and
   * extension loader.
   *
   * @param proc the name of an EGL function.
   * @returns a pointer to the named EGL function. The returned pointer should
   *          be cast to the appropriate function signature.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_EGL_GetCurrentDisplay
   *
   * @from SDL_video.h:3176 SDL_FunctionPointer SDL_EGL_GetProcAddress(const char *proc);
   */
  static eglGetProcAddress(proc: string): Deno.PointerValue {
    return SDL.eglGetProcAddress(proc);
  }

  /**
   * Unload the OpenGL library previously loaded by SDL_GL_LoadLibrary().
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_GL_LoadLibrary
   *
   * @from SDL_video.h:3187 void SDL_GL_UnloadLibrary(void);
   */
  static unloadLibrary() {
    SDL.glUnloadLibrary();
  }

  /**
   * Check if an OpenGL extension is supported for the current context.
   *
   * This function operates on the current GL context; you must have created a
   * context and it must be current before calling this function. Do not assume
   * that all contexts you create will have the same set of extensions
   * available, or that recreating an existing context will offer the same
   * extensions again.
   *
   * While it's probably not a massive overhead, this function is not an O(1)
   * operation. Check the extensions you care about after creating the GL
   * context and save that information somewhere instead of calling the function
   * every time you need to know.
   *
   * @param extension the name of the extension to check.
   * @returns true if the extension is supported, false otherwise.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @from SDL_video.h:3210 bool SDL_GL_ExtensionSupported(const char *extension);
   */
  static extensionSupported(extension: string): boolean {
    return SDL.glExtensionSupported(extension);
  }

  /**
   * Reset all previously set OpenGL context attributes to their default values.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_GL_GetAttribute
   * @sa SDL_GL_SetAttribute
   *
   * @from SDL_video.h:3222 void SDL_GL_ResetAttributes(void);
   */
  static resetAttributes() {
    SDL.glResetAttributes();
  }

  /**
   * Set an OpenGL window attribute before window creation.
   *
   * This function sets the OpenGL attribute `attr` to `value`. The requested
   * attributes should be set before creating an OpenGL window. You should use
   * SDL_GL_GetAttribute() to check the values after creating the OpenGL
   * context, since the values obtained can differ from the requested ones.
   *
   * @param attr an enum value specifying the OpenGL attribute to set.
   * @param value the desired value for the attribute.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_GL_CreateContext
   * @sa SDL_GL_GetAttribute
   * @sa SDL_GL_ResetAttributes
   *
   * @from SDL_video.h:3245 bool SDL_GL_SetAttribute(SDL_GLAttr attr, int value);
   */
  static setAttribute(attr: number, value: number): boolean {
    return SDL.glSetAttribute(attr, value);
  }

  /**
   * Get the actual value for an attribute from the current context.
   *
   * @param attr an SDL_GLAttr enum value specifying the OpenGL attribute to
   *             get.
   * @param value a pointer filled in with the current value of `attr`.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_GL_ResetAttributes
   * @sa SDL_GL_SetAttribute
   *
   * @from SDL_video.h:3263 bool SDL_GL_GetAttribute(SDL_GLAttr attr, int *value);
   */
  static getAttribute(attr: number): number {
    return SDL.glGetAttribute(attr);
  }

  /**
   * Get the currently active OpenGL window.
   *
   * @returns the currently active OpenGL window on success or NULL on failure;
   *          call SDL_GetError() for more information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @from SDL_video.h:3323 SDL_Window * SDL_GL_GetCurrentWindow(void);
   */
  static glGetCurrentWindow(): Window {
    const r = SDL.glGetCurrentWindow();
    if (!r) throw SdlError("glGetCurrentWindow");
    return new Window(r);
  }

  /**
   * Sets the callbacks for defining custom EGLAttrib arrays for EGL
   * initialization.
   *
   * Callbacks that aren't needed can be set to NULL.
   *
   * NOTE: These callback pointers will be reset after SDL_GL_ResetAttributes.
   *
   * @param platformAttribCallback callback for attributes to pass to
   *                               eglGetPlatformDisplay. May be NULL.
   * @param surfaceAttribCallback callback for attributes to pass to
   *                              eglCreateSurface. May be NULL.
   * @param contextAttribCallback callback for attributes to pass to
   *                              eglCreateContext. May be NULL.
   * @param userdata a pointer that is passed to the callbacks.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @from SDL_video.h:3396 void SDL_EGL_SetAttributeCallbacks(SDL_EGLAttribArrayCallback platformAttribCallback, SDL_EGLIntArrayCallback surfaceAttribCallback, SDL_EGLIntArrayCallback contextAttribCallback, void *userdata);
   */
  eglSetAttributeCallbacks() {} // TODO

  /**
   * Set the swap interval for the current OpenGL context.
   *
   * Some systems allow specifying -1 for the interval, to enable adaptive
   * vsync. Adaptive vsync works the same as vsync, but if you've already missed
   * the vertical retrace for a given frame, it swaps buffers immediately, which
   * might be less jarring for the user during occasional framerate drops. If an
   * application requests adaptive vsync and the system does not support it,
   * this function will fail and return false. In such a case, you should
   * probably retry the call with 1 for the interval.
   *
   * Adaptive vsync is implemented for some glX drivers with
   * GLX_EXT_swap_control_tear, and for some Windows drivers with
   * WGL_EXT_swap_control_tear.
   *
   * Read more on the Khronos wiki:
   * https://www.khronos.org/opengl/wiki/Swap_Interval#Adaptive_Vsync
   *
   * @param interval 0 for immediate updates, 1 for updates synchronized with
   *                 the vertical retrace, -1 for adaptive vsync.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_GL_GetSwapInterval
   *
   * @from SDL_video.h:3429 bool SDL_GL_SetSwapInterval(int interval);
   */
  static glSetSwapInterval(interval: number): boolean {
    return SDL.glSetSwapInterval(interval);
  }

  /**
   * Get the swap interval for the current OpenGL context.
   *
   * If the system can't determine the swap interval, or there isn't a valid
   * current context, this function will set *interval to 0 as a safe default.
   *
   * @param interval output interval value. 0 if there is no vertical retrace
   *                 synchronization, 1 if the buffer swap is synchronized with
   *                 the vertical retrace, and -1 if late swaps happen
   *                 immediately instead of waiting for the next retrace.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_GL_SetSwapInterval
   *
   * @from SDL_video.h:3450 bool SDL_GL_GetSwapInterval(int *interval);
   */
  static glGetSwapInterval(): number {
    return SDL.glGetSwapInterval();
  }

  /**
   * Update a window with OpenGL rendering.
   *
   * This is used with double-buffered OpenGL contexts, which are the default.
   *
   * On macOS, make sure you bind 0 to the draw framebuffer before swapping the
   * window, otherwise nothing will happen. If you aren't using
   * glBindFramebuffer(), this is the default and you won't have to do anything
   * extra.
   *
   * @param window the window to change.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @from SDL_video.h:3470 bool SDL_GL_SwapWindow(SDL_Window *window);
   */
  static glSwapWindow(window: Window): boolean {
    return SDL.glSwapWindow(window.pointer);
  }
}
