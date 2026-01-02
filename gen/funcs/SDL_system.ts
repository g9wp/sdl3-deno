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


export const WINDOWS_symbols = {

/**
 * Set a callback for every Windows message, run before TranslateMessage().
 *
 * The callback may modify the message, and should return true if the message
 * should continue to be processed, or false to prevent further processing.
 *
 * @param callback the SDL_WindowsMessageHook function to call.
 * @param userdata a pointer to pass to every iteration of `callback`.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_WindowsMessageHook
 * @sa SDL_HINT_WINDOWS_ENABLE_MESSAGELOOP
 *
 * @from SDL_system.h:93 void SDL_SetWindowsMessageHook(SDL_WindowsMessageHook callback, void *userdata);
 * @platformSpecific WINDOWS SDL_system.h:51 #if defined(SDL_PLATFORM_WINDOWS)
 */
SDL_SetWindowsMessageHook: {
      parameters: ["function", "pointer"],
      result: "void"
    },

} as const satisfies Deno.ForeignLibraryInterface;

export const WIN32_symbols = {

/**
 * Get the D3D9 adapter index that matches the specified display.
 *
 * The returned adapter index can be passed to `IDirect3D9::CreateDevice` and
 * controls on which monitor a full screen application will appear.
 *
 * @param displayID the instance of the display to query.
 * @returns the D3D9 adapter index on success or -1 on failure; call
 *          SDL_GetError() for more information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_system.h:111 int SDL_GetDirect3D9AdapterIndex(SDL_DisplayID displayID);
 * @platformSpecific WIN32 SDL_system.h:97 #if defined(SDL_PLATFORM_WIN32) || defined(SDL_PLATFORM_WINGDK)
 */
SDL_GetDirect3D9AdapterIndex: {
      parameters: ["u32"],
      result: "i32"
    },


/**
 * Get the DXGI Adapter and Output indices for the specified display.
 *
 * The DXGI Adapter and Output indices can be passed to `EnumAdapters` and
 * `EnumOutputs` respectively to get the objects required to create a DX10 or
 * DX11 device and swap chain.
 *
 * @param displayID the instance of the display to query.
 * @param adapterIndex a pointer to be filled in with the adapter index.
 * @param outputIndex a pointer to be filled in with the output index.
 * @returns true on success or false on failure; call SDL_GetError() for more
 *          information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_system.h:128 bool SDL_GetDXGIOutputInfo(SDL_DisplayID displayID, int *adapterIndex, int *outputIndex);
 * @platformSpecific WIN32 SDL_system.h:97 #if defined(SDL_PLATFORM_WIN32) || defined(SDL_PLATFORM_WINGDK)
 */
SDL_GetDXGIOutputInfo: {
      parameters: ["u32", "pointer", "pointer"],
      result: "bool"
    },

} as const satisfies Deno.ForeignLibraryInterface;

export const symbols = {

/**
 * Set a callback for every X11 event.
 *
 * The callback may modify the event, and should return true if the event
 * should continue to be processed, or false to prevent further processing.
 *
 * @param callback the SDL_X11EventHook function to call.
 * @param userdata a pointer to pass to every iteration of `callback`.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_system.h:173 void SDL_SetX11EventHook(SDL_X11EventHook callback, void *userdata);
 */
SDL_SetX11EventHook: {
      parameters: ["function", "pointer"],
      result: "void"
    },


/**
 * Query if the current device is a tablet.
 *
 * If SDL can't determine this, it will return false.
 *
 * @returns true if the device is a tablet, false otherwise.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_system.h:609 bool SDL_IsTablet(void);
 */
SDL_IsTablet: {
      parameters: [],
      result: "bool"
    },


/**
 * Query if the current device is a TV.
 *
 * If SDL can't determine this, it will return false.
 *
 * @returns true if the device is a TV, false otherwise.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_system.h:620 bool SDL_IsTV(void);
 */
SDL_IsTV: {
      parameters: [],
      result: "bool"
    },


/**
 * Get the application sandbox environment, if any.
 *
 * @returns the application sandbox environment or SDL_SANDBOX_NONE if the
 *          application is not running in a sandbox environment.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_system.h:644 SDL_Sandbox SDL_GetSandbox(void);
 */
SDL_GetSandbox: {
      parameters: [],
      result: "u32"
    },


/**
 * Let iOS apps with external event handling report
 * onApplicationWillTerminate.
 *
 * This functions allows iOS apps that have their own event handling to hook
 * into SDL to generate SDL events. This maps directly to an iOS-specific
 * event, but since it doesn't do anything iOS-specific internally, it is
 * available on all platforms, in case it might be useful for some specific
 * paradigm. Most apps do not need to use this directly; SDL's internal event
 * code will handle all this for windows created by SDL_CreateWindow!
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_system.h:664 void SDL_OnApplicationWillTerminate(void);
 */
SDL_OnApplicationWillTerminate: {
      parameters: [],
      result: "void"
    },


/**
 * Let iOS apps with external event handling report
 * onApplicationDidReceiveMemoryWarning.
 *
 * This functions allows iOS apps that have their own event handling to hook
 * into SDL to generate SDL events. This maps directly to an iOS-specific
 * event, but since it doesn't do anything iOS-specific internally, it is
 * available on all platforms, in case it might be useful for some specific
 * paradigm. Most apps do not need to use this directly; SDL's internal event
 * code will handle all this for windows created by SDL_CreateWindow!
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_system.h:681 void SDL_OnApplicationDidReceiveMemoryWarning(void);
 */
SDL_OnApplicationDidReceiveMemoryWarning: {
      parameters: [],
      result: "void"
    },


/**
 * Let iOS apps with external event handling report
 * onApplicationWillResignActive.
 *
 * This functions allows iOS apps that have their own event handling to hook
 * into SDL to generate SDL events. This maps directly to an iOS-specific
 * event, but since it doesn't do anything iOS-specific internally, it is
 * available on all platforms, in case it might be useful for some specific
 * paradigm. Most apps do not need to use this directly; SDL's internal event
 * code will handle all this for windows created by SDL_CreateWindow!
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_system.h:698 void SDL_OnApplicationWillEnterBackground(void);
 */
SDL_OnApplicationWillEnterBackground: {
      parameters: [],
      result: "void"
    },


/**
 * Let iOS apps with external event handling report
 * onApplicationDidEnterBackground.
 *
 * This functions allows iOS apps that have their own event handling to hook
 * into SDL to generate SDL events. This maps directly to an iOS-specific
 * event, but since it doesn't do anything iOS-specific internally, it is
 * available on all platforms, in case it might be useful for some specific
 * paradigm. Most apps do not need to use this directly; SDL's internal event
 * code will handle all this for windows created by SDL_CreateWindow!
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_system.h:715 void SDL_OnApplicationDidEnterBackground(void);
 */
SDL_OnApplicationDidEnterBackground: {
      parameters: [],
      result: "void"
    },


/**
 * Let iOS apps with external event handling report
 * onApplicationWillEnterForeground.
 *
 * This functions allows iOS apps that have their own event handling to hook
 * into SDL to generate SDL events. This maps directly to an iOS-specific
 * event, but since it doesn't do anything iOS-specific internally, it is
 * available on all platforms, in case it might be useful for some specific
 * paradigm. Most apps do not need to use this directly; SDL's internal event
 * code will handle all this for windows created by SDL_CreateWindow!
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_system.h:732 void SDL_OnApplicationWillEnterForeground(void);
 */
SDL_OnApplicationWillEnterForeground: {
      parameters: [],
      result: "void"
    },


/**
 * Let iOS apps with external event handling report
 * onApplicationDidBecomeActive.
 *
 * This functions allows iOS apps that have their own event handling to hook
 * into SDL to generate SDL events. This maps directly to an iOS-specific
 * event, but since it doesn't do anything iOS-specific internally, it is
 * available on all platforms, in case it might be useful for some specific
 * paradigm. Most apps do not need to use this directly; SDL's internal event
 * code will handle all this for windows created by SDL_CreateWindow!
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_system.h:749 void SDL_OnApplicationDidEnterForeground(void);
 */
SDL_OnApplicationDidEnterForeground: {
      parameters: [],
      result: "void"
    },

} as const satisfies Deno.ForeignLibraryInterface;

export const LINUX_symbols = {

/**
 * Sets the UNIX nice value for a thread.
 *
 * This uses setpriority() if possible, and RealtimeKit if available.
 *
 * @param threadID the Unix thread ID to change priority of.
 * @param priority the new, Unix-specific, priority value.
 * @returns true on success or false on failure; call SDL_GetError() for more
 *          information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_system.h:190 bool SDL_SetLinuxThreadPriority(Sint64 threadID, int priority);
 * @platformSpecific LINUX SDL_system.h:176 #ifdef SDL_PLATFORM_LINUX
 */
SDL_SetLinuxThreadPriority: {
      parameters: ["i64", "i32"],
      result: "bool"
    },


/**
 * Sets the priority (not nice level) and scheduling policy for a thread.
 *
 * This uses setpriority() if possible, and RealtimeKit if available.
 *
 * @param threadID the Unix thread ID to change priority of.
 * @param sdlPriority the new SDL_ThreadPriority value.
 * @param schedPolicy the new scheduling policy (SCHED_FIFO, SCHED_RR,
 *                    SCHED_OTHER, etc...).
 * @returns true on success or false on failure; call SDL_GetError() for more
 *          information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_system.h:206 bool SDL_SetLinuxThreadPriorityAndPolicy(Sint64 threadID, int sdlPriority, int schedPolicy);
 * @platformSpecific LINUX SDL_system.h:176 #ifdef SDL_PLATFORM_LINUX
 */
SDL_SetLinuxThreadPriorityAndPolicy: {
      parameters: ["i64", "i32", "i32"],
      result: "bool"
    },

} as const satisfies Deno.ForeignLibraryInterface;

export const IOS_symbols = {

/**
 * Use this function to set the animation callback on Apple iOS.
 *
 * The function prototype for `callback` is:
 *
 * ```c
 * void callback(void *callbackParam);
 * ```
 *
 * Where its parameter, `callbackParam`, is what was passed as `callbackParam`
 * to SDL_SetiOSAnimationCallback().
 *
 * This function is only available on Apple iOS.
 *
 * For more information see:
 *
 * https://wiki.libsdl.org/SDL3/README-ios
 *
 * Note that if you use the "main callbacks" instead of a standard C `main`
 * function, you don't have to use this API, as SDL will manage this for you.
 *
 * Details on main callbacks are here:
 *
 * https://wiki.libsdl.org/SDL3/README-main-functions
 *
 * @param window the window for which the animation callback should be set.
 * @param interval the number of frames after which **callback** will be
 *                 called.
 * @param callback the function to call for every frame.
 * @param callbackParam a pointer that is passed to `callback`.
 * @returns true on success or false on failure; call SDL_GetError() for more
 *          information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_SetiOSEventPump
 *
 * @from SDL_system.h:270 bool SDL_SetiOSAnimationCallback(SDL_Window *window, int interval, SDL_iOSAnimationCallback callback, void *callbackParam);
 * @platformSpecific IOS SDL_system.h:213 #ifdef SDL_PLATFORM_IOS
 */
SDL_SetiOSAnimationCallback: {
      parameters: ["pointer", "i32", "function", "pointer"],
      result: "bool"
    },


/**
 * Use this function to enable or disable the SDL event pump on Apple iOS.
 *
 * This function is only available on Apple iOS.
 *
 * @param enabled true to enable the event pump, false to disable it.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_SetiOSAnimationCallback
 *
 * @from SDL_system.h:283 void SDL_SetiOSEventPump(bool enabled);
 * @platformSpecific IOS SDL_system.h:213 #ifdef SDL_PLATFORM_IOS
 */
SDL_SetiOSEventPump: {
      parameters: ["bool"],
      result: "void"
    },


/**
 * Let iOS apps with external event handling report
 * onApplicationDidChangeStatusBarOrientation.
 *
 * This functions allows iOS apps that have their own event handling to hook
 * into SDL to generate SDL events. This maps directly to an iOS-specific
 * event, but since it doesn't do anything iOS-specific internally, it is
 * available on all platforms, in case it might be useful for some specific
 * paradigm. Most apps do not need to use this directly; SDL's internal event
 * code will handle all this for windows created by SDL_CreateWindow!
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_system.h:768 void SDL_OnApplicationDidChangeStatusBarOrientation(void);
 * @platformSpecific IOS SDL_system.h:751 #ifdef SDL_PLATFORM_IOS
 */
SDL_OnApplicationDidChangeStatusBarOrientation: {
      parameters: [],
      result: "void"
    },

} as const satisfies Deno.ForeignLibraryInterface;

export const ANDROID_symbols = {

/**
 * Get the Android Java Native Interface Environment of the current thread.
 *
 * This is the JNIEnv one needs to access the Java virtual machine from native
 * code, and is needed for many Android APIs to be usable from C.
 *
 * The prototype of the function in SDL's code actually declare a void* return
 * type, even if the implementation returns a pointer to a JNIEnv. The
 * rationale being that the SDL headers can avoid including jni.h.
 *
 * @returns a pointer to Java native interface object (JNIEnv) to which the
 *          current thread is attached, or NULL on failure; call
 *          SDL_GetError() for more information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetAndroidActivity
 *
 * @from SDL_system.h:313 void * SDL_GetAndroidJNIEnv(void);
 * @platformSpecific ANDROID SDL_system.h:291 #ifdef SDL_PLATFORM_ANDROID
 */
SDL_GetAndroidJNIEnv: {
      parameters: [],
      result: "pointer"
    },


/**
 * Retrieve the Java instance of the Android activity class.
 *
 * The prototype of the function in SDL's code actually declares a void*
 * return type, even if the implementation returns a jobject. The rationale
 * being that the SDL headers can avoid including jni.h.
 *
 * The jobject returned by the function is a local reference and must be
 * released by the caller. See the PushLocalFrame() and PopLocalFrame() or
 * DeleteLocalRef() functions of the Java native interface:
 *
 * https://docs.oracle.com/javase/1.5.0/docs/guide/jni/spec/functions.html
 *
 * @returns the jobject representing the instance of the Activity class of the
 *          Android application, or NULL on failure; call SDL_GetError() for
 *          more information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetAndroidJNIEnv
 *
 * @from SDL_system.h:338 void * SDL_GetAndroidActivity(void);
 * @platformSpecific ANDROID SDL_system.h:291 #ifdef SDL_PLATFORM_ANDROID
 */
SDL_GetAndroidActivity: {
      parameters: [],
      result: "pointer"
    },


/**
 * Query Android API level of the current device.
 *
 * - API level 35: Android 15 (VANILLA_ICE_CREAM)
 * - API level 34: Android 14 (UPSIDE_DOWN_CAKE)
 * - API level 33: Android 13 (TIRAMISU)
 * - API level 32: Android 12L (S_V2)
 * - API level 31: Android 12 (S)
 * - API level 30: Android 11 (R)
 * - API level 29: Android 10 (Q)
 * - API level 28: Android 9 (P)
 * - API level 27: Android 8.1 (O_MR1)
 * - API level 26: Android 8.0 (O)
 * - API level 25: Android 7.1 (N_MR1)
 * - API level 24: Android 7.0 (N)
 * - API level 23: Android 6.0 (M)
 * - API level 22: Android 5.1 (LOLLIPOP_MR1)
 * - API level 21: Android 5.0 (LOLLIPOP, L)
 * - API level 20: Android 4.4W (KITKAT_WATCH)
 * - API level 19: Android 4.4 (KITKAT)
 * - API level 18: Android 4.3 (JELLY_BEAN_MR2)
 * - API level 17: Android 4.2 (JELLY_BEAN_MR1)
 * - API level 16: Android 4.1 (JELLY_BEAN)
 * - API level 15: Android 4.0.3 (ICE_CREAM_SANDWICH_MR1)
 * - API level 14: Android 4.0 (ICE_CREAM_SANDWICH)
 * - API level 13: Android 3.2 (HONEYCOMB_MR2)
 * - API level 12: Android 3.1 (HONEYCOMB_MR1)
 * - API level 11: Android 3.0 (HONEYCOMB)
 * - API level 10: Android 2.3.3 (GINGERBREAD_MR1)
 *
 * @returns the Android API level.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_system.h:374 int SDL_GetAndroidSDKVersion(void);
 * @platformSpecific ANDROID SDL_system.h:291 #ifdef SDL_PLATFORM_ANDROID
 */
SDL_GetAndroidSDKVersion: {
      parameters: [],
      result: "i32"
    },


/**
 * Query if the application is running on a Chromebook.
 *
 * @returns true if this is a Chromebook, false otherwise.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_system.h:383 bool SDL_IsChromebook(void);
 * @platformSpecific ANDROID SDL_system.h:291 #ifdef SDL_PLATFORM_ANDROID
 */
SDL_IsChromebook: {
      parameters: [],
      result: "bool"
    },


/**
 * Query if the application is running on a Samsung DeX docking station.
 *
 * @returns true if this is a DeX docking station, false otherwise.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_system.h:392 bool SDL_IsDeXMode(void);
 * @platformSpecific ANDROID SDL_system.h:291 #ifdef SDL_PLATFORM_ANDROID
 */
SDL_IsDeXMode: {
      parameters: [],
      result: "bool"
    },


/**
 * Trigger the Android system back button behavior.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_system.h:401 void SDL_SendAndroidBackButton(void);
 * @platformSpecific ANDROID SDL_system.h:291 #ifdef SDL_PLATFORM_ANDROID
 */
SDL_SendAndroidBackButton: {
      parameters: [],
      result: "void"
    },


/**
 * Get the path used for internal storage for this Android application.
 *
 * This path is unique to your application and cannot be written to by other
 * applications.
 *
 * Your internal storage path is typically:
 * `/data/data/your.app.package/files`.
 *
 * This is a C wrapper over `android.content.Context.getFilesDir()`:
 *
 * https://developer.android.com/reference/android/content/Context#getFilesDir()
 *
 * @returns the path used for internal storage or NULL on failure; call
 *          SDL_GetError() for more information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetAndroidExternalStoragePath
 * @sa SDL_GetAndroidCachePath
 *
 * @from SDL_system.h:440 const char * SDL_GetAndroidInternalStoragePath(void);
 * @platformSpecific ANDROID SDL_system.h:291 #ifdef SDL_PLATFORM_ANDROID
 */
SDL_GetAndroidInternalStoragePath: {
      parameters: [],
      result: "pointer"
    },


/**
 * Get the current state of external storage for this Android application.
 *
 * The current state of external storage, a bitmask of these values:
 * `SDL_ANDROID_EXTERNAL_STORAGE_READ`, `SDL_ANDROID_EXTERNAL_STORAGE_WRITE`.
 *
 * If external storage is currently unavailable, this will return 0.
 *
 * @returns the current state of external storage, or 0 if external storage is
 *          currently unavailable.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetAndroidExternalStoragePath
 *
 * @from SDL_system.h:457 Uint32 SDL_GetAndroidExternalStorageState(void);
 * @platformSpecific ANDROID SDL_system.h:291 #ifdef SDL_PLATFORM_ANDROID
 */
SDL_GetAndroidExternalStorageState: {
      parameters: [],
      result: "u32"
    },


/**
 * Get the path used for external storage for this Android application.
 *
 * This path is unique to your application, but is public and can be written
 * to by other applications.
 *
 * Your external storage path is typically:
 * `/storage/sdcard0/Android/data/your.app.package/files`.
 *
 * This is a C wrapper over `android.content.Context.getExternalFilesDir()`:
 *
 * https://developer.android.com/reference/android/content/Context#getExternalFilesDir()
 *
 * @returns the path used for external storage for this application on success
 *          or NULL on failure; call SDL_GetError() for more information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetAndroidExternalStorageState
 * @sa SDL_GetAndroidInternalStoragePath
 * @sa SDL_GetAndroidCachePath
 *
 * @from SDL_system.h:481 const char * SDL_GetAndroidExternalStoragePath(void);
 * @platformSpecific ANDROID SDL_system.h:291 #ifdef SDL_PLATFORM_ANDROID
 */
SDL_GetAndroidExternalStoragePath: {
      parameters: [],
      result: "pointer"
    },


/**
 * Get the path used for caching data for this Android application.
 *
 * This path is unique to your application, but is public and can be written
 * to by other applications.
 *
 * Your cache path is typically: `/data/data/your.app.package/cache/`.
 *
 * This is a C wrapper over `android.content.Context.getCacheDir()`:
 *
 * https://developer.android.com/reference/android/content/Context#getCacheDir()
 *
 * @returns the path used for caches for this application on success or NULL
 *          on failure; call SDL_GetError() for more information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetAndroidInternalStoragePath
 * @sa SDL_GetAndroidExternalStoragePath
 *
 * @from SDL_system.h:503 const char * SDL_GetAndroidCachePath(void);
 * @platformSpecific ANDROID SDL_system.h:291 #ifdef SDL_PLATFORM_ANDROID
 */
SDL_GetAndroidCachePath: {
      parameters: [],
      result: "pointer"
    },


/**
 * Request permissions at runtime, asynchronously.
 *
 * You do not need to call this for built-in functionality of SDL; recording
 * from a microphone or reading images from a camera, using standard SDL APIs,
 * will manage permission requests for you.
 *
 * This function never blocks. Instead, the app-supplied callback will be
 * called when a decision has been made. This callback may happen on a
 * different thread, and possibly much later, as it might wait on a user to
 * respond to a system dialog. If permission has already been granted for a
 * specific entitlement, the callback will still fire, probably on the current
 * thread and before this function returns.
 *
 * If the request submission fails, this function returns -1 and the callback
 * will NOT be called, but this should only happen in catastrophic conditions,
 * like memory running out. Normally there will be a yes or no to the request
 * through the callback.
 *
 * For the `permission` parameter, choose a value from here:
 *
 * https://developer.android.com/reference/android/Manifest.permission
 *
 * @param permission the permission to request.
 * @param cb the callback to trigger when the request has a response.
 * @param userdata an app-controlled pointer that is passed to the callback.
 * @returns true if the request was submitted, false if there was an error
 *          submitting. The result of the request is only ever reported
 *          through the callback, not this return value.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_system.h:552 bool SDL_RequestAndroidPermission(const char *permission, SDL_RequestAndroidPermissionCallback cb, void *userdata);
 * @platformSpecific ANDROID SDL_system.h:291 #ifdef SDL_PLATFORM_ANDROID
 */
SDL_RequestAndroidPermission: {
      parameters: ["pointer", "function", "pointer"],
      result: "bool"
    },


/**
 * Shows an Android toast notification.
 *
 * Toasts are a sort of lightweight notification that are unique to Android.
 *
 * https://developer.android.com/guide/topics/ui/notifiers/toasts
 *
 * Shows toast in UI thread.
 *
 * For the `gravity` parameter, choose a value from here, or -1 if you don't
 * have a preference:
 *
 * https://developer.android.com/reference/android/view/Gravity
 *
 * @param message text message to be shown.
 * @param duration 0=short, 1=long.
 * @param gravity where the notification should appear on the screen.
 * @param xoffset set this parameter only when gravity >=0.
 * @param yoffset set this parameter only when gravity >=0.
 * @returns true on success or false on failure; call SDL_GetError() for more
 *          information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_system.h:580 bool SDL_ShowAndroidToast(const char *message, int duration, int gravity, int xoffset, int yoffset);
 * @platformSpecific ANDROID SDL_system.h:291 #ifdef SDL_PLATFORM_ANDROID
 */
SDL_ShowAndroidToast: {
      parameters: ["pointer", "i32", "i32", "i32", "i32"],
      result: "bool"
    },


/**
 * Send a user command to SDLActivity.
 *
 * Override "boolean onUnhandledMessage(Message msg)" to handle the message.
 *
 * @param command user command that must be greater or equal to 0x8000.
 * @param param user parameter.
 * @returns true on success or false on failure; call SDL_GetError() for more
 *          information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_system.h:596 bool SDL_SendAndroidMessage(Uint32 command, int param);
 * @platformSpecific ANDROID SDL_system.h:291 #ifdef SDL_PLATFORM_ANDROID
 */
SDL_SendAndroidMessage: {
      parameters: ["u32", "i32"],
      result: "bool"
    },

} as const satisfies Deno.ForeignLibraryInterface;

export const GDK_symbols = {

/**
 * Gets a reference to the global async task queue handle for GDK,
 * initializing if needed.
 *
 * Once you are done with the task queue, you should call
 * XTaskQueueCloseHandle to reduce the reference count to avoid a resource
 * leak.
 *
 * @param outTaskQueue a pointer to be filled in with task queue handle.
 * @returns true on success or false on failure; call SDL_GetError() for more
 *          information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_system.h:792 bool SDL_GetGDKTaskQueue(XTaskQueueHandle *outTaskQueue);
 * @platformSpecific GDK SDL_system.h:774 #ifdef SDL_PLATFORM_GDK
 */
SDL_GetGDKTaskQueue: {
      parameters: ["pointer"],
      result: "bool"
    },


/**
 * Gets a reference to the default user handle for GDK.
 *
 * This is effectively a synchronous version of XUserAddAsync, which always
 * prefers the default user and allows a sign-in UI.
 *
 * @param outUserHandle a pointer to be filled in with the default user
 *                      handle.
 * @returns true if success or false on failure; call SDL_GetError() for more
 *          information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_system.h:807 bool SDL_GetGDKDefaultUser(XUserHandle *outUserHandle);
 * @platformSpecific GDK SDL_system.h:774 #ifdef SDL_PLATFORM_GDK
 */
SDL_GetGDKDefaultUser: {
      parameters: ["pointer"],
      result: "bool"
    },

} as const satisfies Deno.ForeignLibraryInterface;
