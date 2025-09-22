/**
 * # CategorySystem
 *
 * Platform-specific SDL API functions. These are functions that deal with
 * needs of specific operating systems, that didn't make sense to offer as
 * platform-independent, generic APIs.
 *
 * Most apps can make do without these functions, but they can be useful for
 * integrating with other parts of a specific system, adding platform-specific
 * polish to an app, or solving problems that only affect one target.
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

export const callbacks = {
/**
 * A callback to be used with SDL_SetWindowsMessageHook.
 *
 * This callback may modify the message, and should return true if the message
 * should continue to be processed, or false to prevent further processing.
 *
 * As this is processing a message directly from the Windows event loop, this
 * callback should do the minimum required work and return quickly.
 *
 * @param userdata the app-defined pointer provided to
 *                 SDL_SetWindowsMessageHook.
 * @param msg a pointer to a Win32 event structure to process.
 * @returns true to let event continue on, false to drop it.
 *
 * @threadsafety This may only be called (by SDL) from the thread handling the
 *               Windows event loop.
 *
 * @since This datatype is available since SDL 3.2.0.
 *
 * @sa SDL_SetWindowsMessageHook
 * @sa SDL_HINT_WINDOWS_ENABLE_MESSAGELOOP
 *
 * @from SDL_system.h:77 typedef bool (*SDL_WindowsMessageHook)(void *userdata, MSG *msg);
 * @platformSpecific WINDOWS SDL_system.h:51 #if defined(SDL_PLATFORM_WINDOWS)
 */
SDL_WindowsMessageHook: {
      parameters: ["pointer", "pointer"],
      result: "bool"
    },

/**
 * A callback to be used with SDL_SetX11EventHook.
 *
 * This callback may modify the event, and should return true if the event
 * should continue to be processed, or false to prevent further processing.
 *
 * As this is processing an event directly from the X11 event loop, this
 * callback should do the minimum required work and return quickly.
 *
 * @param userdata the app-defined pointer provided to SDL_SetX11EventHook.
 * @param xevent a pointer to an Xlib XEvent union to process.
 * @returns true to let event continue on, false to drop it.
 *
 * @threadsafety This may only be called (by SDL) from the thread handling the
 *               X11 event loop.
 *
 * @since This datatype is available since SDL 3.2.0.
 *
 * @sa SDL_SetX11EventHook
 *
 * @from SDL_system.h:160 typedef bool (*SDL_X11EventHook)(void *userdata, XEvent *xevent);
 */
SDL_X11EventHook: {
      parameters: ["pointer", "pointer"],
      result: "bool"
    },

/**
 * The prototype for an Apple iOS animation callback.
 *
 * This datatype is only useful on Apple iOS.
 *
 * After passing a function pointer of this type to
 * SDL_SetiOSAnimationCallback, the system will call that function pointer at
 * a regular interval.
 *
 * @param userdata what was passed as `callbackParam` to
 *                 SDL_SetiOSAnimationCallback as `callbackParam`.
 *
 * @since This datatype is available since SDL 3.2.0.
 *
 * @sa SDL_SetiOSAnimationCallback
 *
 * @from SDL_system.h:231 typedef void (*SDL_iOSAnimationCallback)(void *userdata);
 * @platformSpecific IOS SDL_system.h:213 #ifdef SDL_PLATFORM_IOS
 */
SDL_iOSAnimationCallback: {
      parameters: ["pointer"],
      result: "void"
    },

/**
 * Callback that presents a response from a SDL_RequestAndroidPermission call.
 *
 * @param userdata an app-controlled pointer that is passed to the callback.
 * @param permission the Android-specific permission name that was requested.
 * @param granted true if permission is granted, false if denied.
 *
 * @since This datatype is available since SDL 3.2.0.
 *
 * @sa SDL_RequestAndroidPermission
 *
 * @from SDL_system.h:516 typedef void (*SDL_RequestAndroidPermissionCallback)(void *userdata, const char *permission, bool granted);
 * @platformSpecific ANDROID SDL_system.h:291 #ifdef SDL_PLATFORM_ANDROID
 */
SDL_RequestAndroidPermissionCallback: {
      parameters: ["pointer", "pointer", "bool"],
      result: "void"
    },

} as const;


/**
 * A callback to be used with SDL_SetWindowsMessageHook.
 *
 * This callback may modify the message, and should return true if the message
 * should continue to be processed, or false to prevent further processing.
 *
 * As this is processing a message directly from the Windows event loop, this
 * callback should do the minimum required work and return quickly.
 *
 * @param userdata the app-defined pointer provided to
 *                 SDL_SetWindowsMessageHook.
 * @param msg a pointer to a Win32 event structure to process.
 * @returns true to let event continue on, false to drop it.
 *
 * @threadsafety This may only be called (by SDL) from the thread handling the
 *               Windows event loop.
 *
 * @since This datatype is available since SDL 3.2.0.
 *
 * @sa SDL_SetWindowsMessageHook
 * @sa SDL_HINT_WINDOWS_ENABLE_MESSAGELOOP
 *
 * @from SDL_system.h:77 typedef bool (*SDL_WindowsMessageHook)(void *userdata, MSG *msg);
 * @platformSpecific WINDOWS SDL_system.h:51 #if defined(SDL_PLATFORM_WINDOWS)
 */
export function WindowsMessageHook(cb: (
    userdata: Deno.PointerValue, 
    msg: Deno.PointerValue, 
  ) => boolean) {
  return new Deno.UnsafeCallback(callbacks.SDL_WindowsMessageHook, cb);
}

/**
 * A callback to be used with SDL_SetX11EventHook.
 *
 * This callback may modify the event, and should return true if the event
 * should continue to be processed, or false to prevent further processing.
 *
 * As this is processing an event directly from the X11 event loop, this
 * callback should do the minimum required work and return quickly.
 *
 * @param userdata the app-defined pointer provided to SDL_SetX11EventHook.
 * @param xevent a pointer to an Xlib XEvent union to process.
 * @returns true to let event continue on, false to drop it.
 *
 * @threadsafety This may only be called (by SDL) from the thread handling the
 *               X11 event loop.
 *
 * @since This datatype is available since SDL 3.2.0.
 *
 * @sa SDL_SetX11EventHook
 *
 * @from SDL_system.h:160 typedef bool (*SDL_X11EventHook)(void *userdata, XEvent *xevent);
 */
export function X11EventHook(cb: (
    userdata: Deno.PointerValue, 
    xevent: Deno.PointerValue, 
  ) => boolean) {
  return new Deno.UnsafeCallback(callbacks.SDL_X11EventHook, cb);
}

/**
 * The prototype for an Apple iOS animation callback.
 *
 * This datatype is only useful on Apple iOS.
 *
 * After passing a function pointer of this type to
 * SDL_SetiOSAnimationCallback, the system will call that function pointer at
 * a regular interval.
 *
 * @param userdata what was passed as `callbackParam` to
 *                 SDL_SetiOSAnimationCallback as `callbackParam`.
 *
 * @since This datatype is available since SDL 3.2.0.
 *
 * @sa SDL_SetiOSAnimationCallback
 *
 * @from SDL_system.h:231 typedef void (*SDL_iOSAnimationCallback)(void *userdata);
 * @platformSpecific IOS SDL_system.h:213 #ifdef SDL_PLATFORM_IOS
 */
export function iOSAnimationCallback(cb: (
    userdata: Deno.PointerValue, 
  ) => void) {
  return new Deno.UnsafeCallback(callbacks.SDL_iOSAnimationCallback, cb);
}

/**
 * Callback that presents a response from a SDL_RequestAndroidPermission call.
 *
 * @param userdata an app-controlled pointer that is passed to the callback.
 * @param permission the Android-specific permission name that was requested.
 * @param granted true if permission is granted, false if denied.
 *
 * @since This datatype is available since SDL 3.2.0.
 *
 * @sa SDL_RequestAndroidPermission
 *
 * @from SDL_system.h:516 typedef void (*SDL_RequestAndroidPermissionCallback)(void *userdata, const char *permission, bool granted);
 * @platformSpecific ANDROID SDL_system.h:291 #ifdef SDL_PLATFORM_ANDROID
 */
export function RequestAndroidPermissionCallback(cb: (
    userdata: Deno.PointerValue, 
    permission: Deno.PointerValue, 
    granted: boolean, 
  ) => void) {
  return new Deno.UnsafeCallback(callbacks.SDL_RequestAndroidPermissionCallback, cb);
}

