/**
 * # CategoryEvents
 *
 * Event queue management.
 *
 * It's extremely common--often required--that an app deal with SDL's event
 * queue. Almost all useful information about interactions with the real world
 * flow through here: the user interacting with the computer and app, hardware
 * coming and going, the system changing in some way, etc.
 *
 * An app generally takes a moment, perhaps at the start of a new frame, to
 * examine any events that have occurred since the last time and process or
 * ignore them. This is generally done by calling SDL_PollEvent() in a loop
 * until it returns false (or, if using the main callbacks, events are
 * provided one at a time in calls to SDL_AppEvent() before the next call to
 * SDL_AppIterate(); in this scenario, the app does not call SDL_PollEvent()
 * at all).
 *
 * There is other forms of control, too: SDL_PeepEvents() has more
 * functionality at the cost of more complexity, and SDL_WaitEvent() can block
 * the process until something interesting happens, which might be beneficial
 * for certain types of programs on low-power hardware. One may also call
 * SDL_AddEventWatch() to set a callback when new events arrive.
 *
 * The app is free to generate their own events, too: SDL_PushEvent allows the
 * app to put events onto the queue for later retrieval; SDL_RegisterEvents
 * can guarantee that these events have a type that isn't in use by other
 * parts of the system.
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
 * The types of events that can be delivered.
 *
 * @since This enum is available since SDL 3.2.0.
 *
 * @from SDL_events.h:83 SDL_EVENT_
 */
export enum SDL_EventType {
  FIRST = 0, /**< Unused (do not remove) */
    /* Application events */
  QUIT = 0x100, /**< User-requested quit */
    /* These application events have special meaning on iOS and Android, see README-ios.md and README-android.md for details */
  TERMINATING, /**< The application is being terminated by the OS. This event must be handled in a callback set with SDL_AddEventWatch().
                                     Called on iOS in applicationWillTerminate()
                                     Called on Android in onDestroy()
                                */
  LOW_MEMORY, /**< The application is low on memory, free memory if possible. This event must be handled in a callback set with SDL_AddEventWatch().
                                     Called on iOS in applicationDidReceiveMemoryWarning()
                                     Called on Android in onTrimMemory()
                                */
  WILL_ENTER_BACKGROUND, /**< The application is about to enter the background. This event must be handled in a callback set with SDL_AddEventWatch().
                                     Called on iOS in applicationWillResignActive()
                                     Called on Android in onPause()
                                */
  DID_ENTER_BACKGROUND, /**< The application did enter the background and may not get CPU for some time. This event must be handled in a callback set with SDL_AddEventWatch().
                                     Called on iOS in applicationDidEnterBackground()
                                     Called on Android in onPause()
                                */
  WILL_ENTER_FOREGROUND, /**< The application is about to enter the foreground. This event must be handled in a callback set with SDL_AddEventWatch().
                                     Called on iOS in applicationWillEnterForeground()
                                     Called on Android in onResume()
                                */
  DID_ENTER_FOREGROUND, /**< The application is now interactive. This event must be handled in a callback set with SDL_AddEventWatch().
                                     Called on iOS in applicationDidBecomeActive()
                                     Called on Android in onResume()
                                */
  LOCALE_CHANGED, /**< The user's locale preferences have changed. */
  SYSTEM_THEME_CHANGED, /**< The system theme changed */
    /* Display events */
    /* 0x150 was SDL_DISPLAYEVENT, reserve the number for sdl2-compat */
  DISPLAY_ORIENTATION = 0x151, /**< Display orientation has changed to data1 */
  DISPLAY_ADDED, /**< Display has been added to the system */
  DISPLAY_REMOVED, /**< Display has been removed from the system */
  DISPLAY_MOVED, /**< Display has changed position */
  DISPLAY_DESKTOP_MODE_CHANGED, /**< Display has changed desktop mode */
  DISPLAY_CURRENT_MODE_CHANGED, /**< Display has changed current mode */
  DISPLAY_CONTENT_SCALE_CHANGED, /**< Display has changed content scale */
  DISPLAY_USABLE_BOUNDS_CHANGED, /**< Display has changed usable bounds */
  DISPLAY_FIRST = DISPLAY_ORIENTATION, 
  DISPLAY_LAST = DISPLAY_USABLE_BOUNDS_CHANGED, 
    /* Window events */
    /* 0x200 was SDL_WINDOWEVENT, reserve the number for sdl2-compat */
    /* 0x201 was SDL_SYSWMEVENT, reserve the number for sdl2-compat */
  WINDOW_SHOWN = 0x202, /**< Window has been shown */
  WINDOW_HIDDEN, /**< Window has been hidden */
  WINDOW_EXPOSED, /**< Window has been exposed and should be redrawn, and can be redrawn directly from event watchers for this event.
                                             data1 is 1 for live-resize expose events, 0 otherwise. */
  WINDOW_MOVED, /**< Window has been moved to data1, data2 */
  WINDOW_RESIZED, /**< Window has been resized to data1xdata2 */
  WINDOW_PIXEL_SIZE_CHANGED, /**< The pixel size of the window has changed to data1xdata2 */
  WINDOW_METAL_VIEW_RESIZED, /**< The pixel size of a Metal view associated with the window has changed */
  WINDOW_MINIMIZED, /**< Window has been minimized */
  WINDOW_MAXIMIZED, /**< Window has been maximized */
  WINDOW_RESTORED, /**< Window has been restored to normal size and position */
  WINDOW_MOUSE_ENTER, /**< Window has gained mouse focus */
  WINDOW_MOUSE_LEAVE, /**< Window has lost mouse focus */
  WINDOW_FOCUS_GAINED, /**< Window has gained keyboard focus */
  WINDOW_FOCUS_LOST, /**< Window has lost keyboard focus */
  WINDOW_CLOSE_REQUESTED, /**< The window manager requests that the window be closed */
  WINDOW_HIT_TEST, /**< Window had a hit test that wasn't SDL_HITTEST_NORMAL */
  WINDOW_ICCPROF_CHANGED, /**< The ICC profile of the window's display has changed */
  WINDOW_DISPLAY_CHANGED, /**< Window has been moved to display data1 */
  WINDOW_DISPLAY_SCALE_CHANGED, /**< Window display scale has been changed */
  WINDOW_SAFE_AREA_CHANGED, /**< The window safe area has been changed */
  WINDOW_OCCLUDED, /**< The window has been occluded */
  WINDOW_ENTER_FULLSCREEN, /**< The window has entered fullscreen mode */
  WINDOW_LEAVE_FULLSCREEN, /**< The window has left fullscreen mode */
  WINDOW_DESTROYED, /**< The window with the associated ID is being or has been destroyed. If this message is being handled
                                             in an event watcher, the window handle is still valid and can still be used to retrieve any properties
                                             associated with the window. Otherwise, the handle has already been destroyed and all resources
                                             associated with it are invalid */
  WINDOW_HDR_STATE_CHANGED, /**< Window HDR properties have changed */
  WINDOW_FIRST = WINDOW_SHOWN, 
  WINDOW_LAST = WINDOW_HDR_STATE_CHANGED, 
    /* Keyboard events */
  KEY_DOWN = 0x300, /**< Key pressed */
  KEY_UP, /**< Key released */
  TEXT_EDITING, /**< Keyboard text editing (composition) */
  TEXT_INPUT, /**< Keyboard text input */
  KEYMAP_CHANGED, /**< Keymap changed due to a system event such as an
                                            input language or keyboard layout change. */
  KEYBOARD_ADDED, /**< A new keyboard has been inserted into the system */
  KEYBOARD_REMOVED, /**< A keyboard has been removed */
  TEXT_EDITING_CANDIDATES, /**< Keyboard text editing candidates */
  SCREEN_KEYBOARD_SHOWN, /**< The on-screen keyboard has been shown */
  SCREEN_KEYBOARD_HIDDEN, /**< The on-screen keyboard has been hidden */
    /* Mouse events */
  MOUSE_MOTION = 0x400, /**< Mouse moved */
  MOUSE_BUTTON_DOWN, /**< Mouse button pressed */
  MOUSE_BUTTON_UP, /**< Mouse button released */
  MOUSE_WHEEL, /**< Mouse wheel motion */
  MOUSE_ADDED, /**< A new mouse has been inserted into the system */
  MOUSE_REMOVED, /**< A mouse has been removed */
    /* Joystick events */
  JOYSTICK_AXIS_MOTION = 0x600, /**< Joystick axis motion */
  JOYSTICK_BALL_MOTION, /**< Joystick trackball motion */
  JOYSTICK_HAT_MOTION, /**< Joystick hat position change */
  JOYSTICK_BUTTON_DOWN, /**< Joystick button pressed */
  JOYSTICK_BUTTON_UP, /**< Joystick button released */
  JOYSTICK_ADDED, /**< A new joystick has been inserted into the system */
  JOYSTICK_REMOVED, /**< An opened joystick has been removed */
  JOYSTICK_BATTERY_UPDATED, /**< Joystick battery level change */
  JOYSTICK_UPDATE_COMPLETE, /**< Joystick update is complete */
    /* Gamepad events */
  GAMEPAD_AXIS_MOTION = 0x650, /**< Gamepad axis motion */
  GAMEPAD_BUTTON_DOWN, /**< Gamepad button pressed */
  GAMEPAD_BUTTON_UP, /**< Gamepad button released */
  GAMEPAD_ADDED, /**< A new gamepad has been inserted into the system */
  GAMEPAD_REMOVED, /**< A gamepad has been removed */
  GAMEPAD_REMAPPED, /**< The gamepad mapping was updated */
  GAMEPAD_TOUCHPAD_DOWN, /**< Gamepad touchpad was touched */
  GAMEPAD_TOUCHPAD_MOTION, /**< Gamepad touchpad finger was moved */
  GAMEPAD_TOUCHPAD_UP, /**< Gamepad touchpad finger was lifted */
  GAMEPAD_SENSOR_UPDATE, /**< Gamepad sensor was updated */
  GAMEPAD_UPDATE_COMPLETE, /**< Gamepad update is complete */
  GAMEPAD_STEAM_HANDLE_UPDATED, /**< Gamepad Steam handle has changed */
    /* Touch events */
  FINGER_DOWN = 0x700, 
  FINGER_UP, 
  FINGER_MOTION, 
  FINGER_CANCELED, 
    /* Pinch events */
  PINCH_BEGIN = 0x710, /**< Pinch gesture started */
  PINCH_UPDATE, /**< Pinch gesture updated */
  PINCH_END, /**< Pinch gesture ended */
    /* 0x800, 0x801, and 0x802 were the Gesture events from SDL2. Do not reuse these values! sdl2-compat needs them! */
    /* Clipboard events */
  CLIPBOARD_UPDATE = 0x900, /**< The clipboard changed */
    /* Drag and drop events */
  DROP_FILE = 0x1000, /**< The system requests a file open */
  DROP_TEXT, /**< text/plain drag-and-drop event */
  DROP_BEGIN, /**< A new set of drops is beginning (NULL filename) */
  DROP_COMPLETE, /**< Current set of drops is now complete (NULL filename) */
  DROP_POSITION, /**< Position while moving over the window */
    /* Audio hotplug events */
  AUDIO_DEVICE_ADDED = 0x1100, /**< A new audio device is available */
  AUDIO_DEVICE_REMOVED, /**< An audio device has been removed. */
  AUDIO_DEVICE_FORMAT_CHANGED, /**< An audio device's format has been changed by the system. */
    /* Sensor events */
  SENSOR_UPDATE = 0x1200, /**< A sensor was updated */
    /* Pressure-sensitive pen events */
  PEN_PROXIMITY_IN = 0x1300, /**< Pressure-sensitive pen has become available */
  PEN_PROXIMITY_OUT, /**< Pressure-sensitive pen has become unavailable */
  PEN_DOWN, /**< Pressure-sensitive pen touched drawing surface */
  PEN_UP, /**< Pressure-sensitive pen stopped touching drawing surface */
  PEN_BUTTON_DOWN, /**< Pressure-sensitive pen button pressed */
  PEN_BUTTON_UP, /**< Pressure-sensitive pen button released */
  PEN_MOTION, /**< Pressure-sensitive pen is moving on the tablet */
  PEN_AXIS, /**< Pressure-sensitive pen angle/pressure/etc changed */
    /* Camera hotplug events */
  CAMERA_DEVICE_ADDED = 0x1400, /**< A new camera device is available */
  CAMERA_DEVICE_REMOVED, /**< A camera device has been removed. */
  CAMERA_DEVICE_APPROVED, /**< A camera device has been approved for use by the user. */
  CAMERA_DEVICE_DENIED, /**< A camera device has been denied for use by the user. */
    /* Render events */
  RENDER_TARGETS_RESET = 0x2000, /**< The render targets have been reset and their contents need to be updated */
  RENDER_DEVICE_RESET, /**< The device has been reset and all textures need to be recreated */
  RENDER_DEVICE_LOST, /**< The device has been lost and can't be recovered. */
    /* Reserved events for private platforms */
  PRIVATE0 = 0x4000, 
  PRIVATE1, 
  PRIVATE2, 
  PRIVATE3, 
    /* Internal events */
  POLL_SENTINEL = 0x7F00, /**< Signals the end of an event poll cycle */
    /** Events SDL_EVENT_USER through SDL_EVENT_LAST are for your use,
     *  and should be allocated with SDL_RegisterEvents()
     */
  USER = 0x8000, 
    /**
     *  This last event is only for bounding internal arrays
     */
  LAST = 0xFFFF, 
    /* This just makes sure the enum is the size of Uint32 */
  ENUM_PADDING = 0x7FFFFFFF, 
}



/**
 * The type of action to request from SDL_PeepEvents().
 *
 * @since This enum is available since SDL 3.2.0.
 *
 * @from SDL_events.h:1108 SDL_
 */
export enum SDL_EventAction {
  ADDEVENT, /**< Add events to the back of the queue. */
  PEEKEVENT, /**< Check but don't remove events from the queue front. */
  GETEVENT, /**< Retrieve/remove events from the front of the queue. */
}



