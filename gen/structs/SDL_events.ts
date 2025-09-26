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
 * examine any events that have occured since the last time and process or
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

import * as _ from "../_utils.ts";
import * as _b from "../_structs/SDL_events.ts";


/**
 * Fields shared by every event
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @from SDL_events.h:286
 */
export interface CommonEvent {
  type: number; /**< Uint32 : Event type, shared with all events, Uint32 to cover user events which are not in the SDL_EventType enumeration */
  reserved: number; /* Uint32 */
  timestamp: bigint; /**< Uint64 : In nanoseconds, populated using SDL_GetTicksNS() */
}

export function read_CommonEvent(dt: DataView): CommonEvent {
  const t = _b.SDL_CommonEvent.read(dt);
  return {
    type: t.type, /** Uint32 */
    reserved: t.reserved, /** Uint32 */
    timestamp: t.timestamp, /** Uint64 */
  };
}

export function write_CommonEvent(t: CommonEvent, dt: DataView) {
  _b.SDL_CommonEvent.write({
    type: t.type, /** Uint32 */
    reserved: t.reserved, /** Uint32 */
    timestamp: t.timestamp, /** Uint64 */
  }, dt);
}


/**
 * Display state change event data (event.display.*)
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @from SDL_events.h:298
 */
export interface DisplayEvent {
  type: number; /**< SDL_EventType : SDL_DISPLAYEVENT_* */
  reserved: number; /* Uint32 */
  timestamp: bigint; /**< Uint64 : In nanoseconds, populated using SDL_GetTicksNS() */
  displayID: number; /**< SDL_DisplayID : The associated display */
  data1: number; /**< Sint32 : event dependent data */
  data2: number; /**< Sint32 : event dependent data */
}

export function read_DisplayEvent(dt: DataView): DisplayEvent {
  const t = _b.SDL_DisplayEvent.read(dt);
  return {
    type: t.type, /** SDL_EventType */
    reserved: t.reserved, /** Uint32 */
    timestamp: t.timestamp, /** Uint64 */
    displayID: t.displayID, /** SDL_DisplayID */
    data1: t.data1, /** Sint32 */
    data2: t.data2, /** Sint32 */
  };
}

export function write_DisplayEvent(t: DisplayEvent, dt: DataView) {
  _b.SDL_DisplayEvent.write({
    type: t.type, /** SDL_EventType */
    reserved: t.reserved, /** Uint32 */
    timestamp: t.timestamp, /** Uint64 */
    displayID: t.displayID, /** SDL_DisplayID */
    data1: t.data1, /** Sint32 */
    data2: t.data2, /** Sint32 */
  }, dt);
}


/**
 * Window state change event data (event.window.*)
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @from SDL_events.h:313
 */
export interface WindowEvent {
  type: number; /**< SDL_EventType : SDL_EVENT_WINDOW_* */
  reserved: number; /* Uint32 */
  timestamp: bigint; /**< Uint64 : In nanoseconds, populated using SDL_GetTicksNS() */
  windowID: number; /**< SDL_WindowID : The associated window */
  data1: number; /**< Sint32 : event dependent data */
  data2: number; /**< Sint32 : event dependent data */
}

export function read_WindowEvent(dt: DataView): WindowEvent {
  const t = _b.SDL_WindowEvent.read(dt);
  return {
    type: t.type, /** SDL_EventType */
    reserved: t.reserved, /** Uint32 */
    timestamp: t.timestamp, /** Uint64 */
    windowID: t.windowID, /** SDL_WindowID */
    data1: t.data1, /** Sint32 */
    data2: t.data2, /** Sint32 */
  };
}

export function write_WindowEvent(t: WindowEvent, dt: DataView) {
  _b.SDL_WindowEvent.write({
    type: t.type, /** SDL_EventType */
    reserved: t.reserved, /** Uint32 */
    timestamp: t.timestamp, /** Uint64 */
    windowID: t.windowID, /** SDL_WindowID */
    data1: t.data1, /** Sint32 */
    data2: t.data2, /** Sint32 */
  }, dt);
}


/**
 * Keyboard device event structure (event.kdevice.*)
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @from SDL_events.h:328
 */
export interface KeyboardDeviceEvent {
  type: number; /**< SDL_EventType : SDL_EVENT_KEYBOARD_ADDED or SDL_EVENT_KEYBOARD_REMOVED */
  reserved: number; /* Uint32 */
  timestamp: bigint; /**< Uint64 : In nanoseconds, populated using SDL_GetTicksNS() */
  which: number; /**< SDL_KeyboardID : The keyboard instance id */
}

export function read_KeyboardDeviceEvent(dt: DataView): KeyboardDeviceEvent {
  const t = _b.SDL_KeyboardDeviceEvent.read(dt);
  return {
    type: t.type, /** SDL_EventType */
    reserved: t.reserved, /** Uint32 */
    timestamp: t.timestamp, /** Uint64 */
    which: t.which, /** SDL_KeyboardID */
  };
}

export function write_KeyboardDeviceEvent(t: KeyboardDeviceEvent, dt: DataView) {
  _b.SDL_KeyboardDeviceEvent.write({
    type: t.type, /** SDL_EventType */
    reserved: t.reserved, /** Uint32 */
    timestamp: t.timestamp, /** Uint64 */
    which: t.which, /** SDL_KeyboardID */
  }, dt);
}


/**
 * Keyboard button event structure (event.key.*)
 *
 * The `key` is the base SDL_Keycode generated by pressing the `scancode`
 * using the current keyboard layout, applying any options specified in
 * SDL_HINT_KEYCODE_OPTIONS. You can get the SDL_Keycode corresponding to the
 * event scancode and modifiers directly from the keyboard layout, bypassing
 * SDL_HINT_KEYCODE_OPTIONS, by calling SDL_GetKeyFromScancode().
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @sa SDL_GetKeyFromScancode
 * @sa SDL_HINT_KEYCODE_OPTIONS
 *
 * @from SDL_events.h:350
 */
export interface KeyboardEvent {
  type: number; /**< SDL_EventType : SDL_EVENT_KEY_DOWN or SDL_EVENT_KEY_UP */
  reserved: number; /* Uint32 */
  timestamp: bigint; /**< Uint64 : In nanoseconds, populated using SDL_GetTicksNS() */
  windowID: number; /**< SDL_WindowID : The window with keyboard focus, if any */
  which: number; /**< SDL_KeyboardID : The keyboard instance id, or 0 if unknown or virtual */
  scancode: number; /**< SDL_Scancode : SDL physical key code */
  key: number; /**< SDL_Keycode : SDL virtual key code */
  mod: number; /**< SDL_Keymod : current key modifiers */
  raw: number; /**< Uint16 : The platform dependent scancode for this event */
  down: boolean; /**< bool : true if the key is pressed */
  repeat: boolean; /**< bool : true if this is a key repeat */
}

export function read_KeyboardEvent(dt: DataView): KeyboardEvent {
  const t = _b.SDL_KeyboardEvent.read(dt);
  return {
    type: t.type, /** SDL_EventType */
    reserved: t.reserved, /** Uint32 */
    timestamp: t.timestamp, /** Uint64 */
    windowID: t.windowID, /** SDL_WindowID */
    which: t.which, /** SDL_KeyboardID */
    scancode: t.scancode, /** SDL_Scancode */
    key: t.key, /** SDL_Keycode */
    mod: t.mod, /** SDL_Keymod */
    raw: t.raw, /** Uint16 */
    down: t.down, /** bool */
    repeat: t.repeat, /** bool */
  };
}

export function write_KeyboardEvent(t: KeyboardEvent, dt: DataView) {
  _b.SDL_KeyboardEvent.write({
    type: t.type, /** SDL_EventType */
    reserved: t.reserved, /** Uint32 */
    timestamp: t.timestamp, /** Uint64 */
    windowID: t.windowID, /** SDL_WindowID */
    which: t.which, /** SDL_KeyboardID */
    scancode: t.scancode, /** SDL_Scancode */
    key: t.key, /** SDL_Keycode */
    mod: t.mod, /** SDL_Keymod */
    raw: t.raw, /** Uint16 */
    down: t.down, /** bool */
    repeat: t.repeat, /** bool */
  }, dt);
}


/**
 * Keyboard text editing event structure (event.edit.*)
 *
 * The start cursor is the position, in UTF-8 characters, where new typing
 * will be inserted into the editing text. The length is the number of UTF-8
 * characters that will be replaced by new typing.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @from SDL_events.h:374
 */
export interface TextEditingEvent {
  type: number; /**< SDL_EventType : SDL_EVENT_TEXT_EDITING */
  reserved: number; /* Uint32 */
  timestamp: bigint; /**< Uint64 : In nanoseconds, populated using SDL_GetTicksNS() */
  windowID: number; /**< SDL_WindowID : The window with keyboard focus, if any */
  text: string; /**< const char * : The editing text */
  start: number; /**< Sint32 : The start cursor of selected editing text, or -1 if not set */
  length: number; /**< Sint32 : The length of selected editing text, or -1 if not set */
}

export function read_TextEditingEvent(dt: DataView): TextEditingEvent {
  const t = _b.SDL_TextEditingEvent.read(dt);
  return {
    type: t.type, /** SDL_EventType */
    reserved: t.reserved, /** Uint32 */
    timestamp: t.timestamp, /** Uint64 */
    windowID: t.windowID, /** SDL_WindowID */
    text: _.read_cstr_v(t.text), /** const char * */
    start: t.start, /** Sint32 */
    length: t.length, /** Sint32 */
  };
}

export function write_TextEditingEvent(t: TextEditingEvent, dt: DataView) {
  _b.SDL_TextEditingEvent.write({
    type: t.type, /** SDL_EventType */
    reserved: t.reserved, /** Uint32 */
    timestamp: t.timestamp, /** Uint64 */
    windowID: t.windowID, /** SDL_WindowID */
    text: _.cstr_v(t.text), /** const char * */
    start: t.start, /** Sint32 */
    length: t.length, /** Sint32 */
  }, dt);
}


/**
 * Keyboard IME candidates event structure (event.edit_candidates.*)
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @from SDL_events.h:390
 */
export interface TextEditingCandidatesEvent {
  type: number; /**< SDL_EventType : SDL_EVENT_TEXT_EDITING_CANDIDATES */
  reserved: number; /* Uint32 */
  timestamp: bigint; /**< Uint64 : In nanoseconds, populated using SDL_GetTicksNS() */
  windowID: number; /**< SDL_WindowID : The window with keyboard focus, if any */
  candidates: Deno.PointerValue; /**< const char * const * : The list of candidates, or NULL if there are no candidates available */
  num_candidates: number; /**< Sint32 : The number of strings in `candidates` */
  selected_candidate: number; /**< Sint32 : The index of the selected candidate, or -1 if no candidate is selected */
  horizontal: boolean; /**< bool : true if the list is horizontal, false if it's vertical */
  padding1: number; /* Uint8 */
  padding2: number; /* Uint8 */
  padding3: number; /* Uint8 */
}

export function read_TextEditingCandidatesEvent(dt: DataView): TextEditingCandidatesEvent {
  const t = _b.SDL_TextEditingCandidatesEvent.read(dt);
  return {
    type: t.type, /** SDL_EventType */
    reserved: t.reserved, /** Uint32 */
    timestamp: t.timestamp, /** Uint64 */
    windowID: t.windowID, /** SDL_WindowID */
    candidates: Deno.UnsafePointer.create(t.candidates), /** const char * const * */
    num_candidates: t.num_candidates, /** Sint32 */
    selected_candidate: t.selected_candidate, /** Sint32 */
    horizontal: t.horizontal, /** bool */
    padding1: t.padding1, /** Uint8 */
    padding2: t.padding2, /** Uint8 */
    padding3: t.padding3, /** Uint8 */
  };
}

export function write_TextEditingCandidatesEvent(t: TextEditingCandidatesEvent, dt: DataView) {
  _b.SDL_TextEditingCandidatesEvent.write({
    type: t.type, /** SDL_EventType */
    reserved: t.reserved, /** Uint32 */
    timestamp: t.timestamp, /** Uint64 */
    windowID: t.windowID, /** SDL_WindowID */
    candidates: Deno.UnsafePointer.value(t.candidates), /** const char * const * */
    num_candidates: t.num_candidates, /** Sint32 */
    selected_candidate: t.selected_candidate, /** Sint32 */
    horizontal: t.horizontal, /** bool */
    padding1: t.padding1, /** Uint8 */
    padding2: t.padding2, /** Uint8 */
    padding3: t.padding3, /** Uint8 */
  }, dt);
}


/**
 * Keyboard text input event structure (event.text.*)
 *
 * This event will never be delivered unless text input is enabled by calling
 * SDL_StartTextInput(). Text input is disabled by default!
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @sa SDL_StartTextInput
 * @sa SDL_StopTextInput
 *
 * @from SDL_events.h:416
 */
export interface TextInputEvent {
  type: number; /**< SDL_EventType : SDL_EVENT_TEXT_INPUT */
  reserved: number; /* Uint32 */
  timestamp: bigint; /**< Uint64 : In nanoseconds, populated using SDL_GetTicksNS() */
  windowID: number; /**< SDL_WindowID : The window with keyboard focus, if any */
  text: string; /**< const char * : The input text, UTF-8 encoded */
}

export function read_TextInputEvent(dt: DataView): TextInputEvent {
  const t = _b.SDL_TextInputEvent.read(dt);
  return {
    type: t.type, /** SDL_EventType */
    reserved: t.reserved, /** Uint32 */
    timestamp: t.timestamp, /** Uint64 */
    windowID: t.windowID, /** SDL_WindowID */
    text: _.read_cstr_v(t.text), /** const char * */
  };
}

export function write_TextInputEvent(t: TextInputEvent, dt: DataView) {
  _b.SDL_TextInputEvent.write({
    type: t.type, /** SDL_EventType */
    reserved: t.reserved, /** Uint32 */
    timestamp: t.timestamp, /** Uint64 */
    windowID: t.windowID, /** SDL_WindowID */
    text: _.cstr_v(t.text), /** const char * */
  }, dt);
}


/**
 * Mouse device event structure (event.mdevice.*)
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @from SDL_events.h:430
 */
export interface MouseDeviceEvent {
  type: number; /**< SDL_EventType : SDL_EVENT_MOUSE_ADDED or SDL_EVENT_MOUSE_REMOVED */
  reserved: number; /* Uint32 */
  timestamp: bigint; /**< Uint64 : In nanoseconds, populated using SDL_GetTicksNS() */
  which: number; /**< SDL_MouseID : The mouse instance id */
}

export function read_MouseDeviceEvent(dt: DataView): MouseDeviceEvent {
  const t = _b.SDL_MouseDeviceEvent.read(dt);
  return {
    type: t.type, /** SDL_EventType */
    reserved: t.reserved, /** Uint32 */
    timestamp: t.timestamp, /** Uint64 */
    which: t.which, /** SDL_MouseID */
  };
}

export function write_MouseDeviceEvent(t: MouseDeviceEvent, dt: DataView) {
  _b.SDL_MouseDeviceEvent.write({
    type: t.type, /** SDL_EventType */
    reserved: t.reserved, /** Uint32 */
    timestamp: t.timestamp, /** Uint64 */
    which: t.which, /** SDL_MouseID */
  }, dt);
}


/**
 * Mouse motion event structure (event.motion.*)
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @from SDL_events.h:443
 */
export interface MouseMotionEvent {
  type: number; /**< SDL_EventType : SDL_EVENT_MOUSE_MOTION */
  reserved: number; /* Uint32 */
  timestamp: bigint; /**< Uint64 : In nanoseconds, populated using SDL_GetTicksNS() */
  windowID: number; /**< SDL_WindowID : The window with mouse focus, if any */
  which: number; /**< SDL_MouseID : The mouse instance id in relative mode, SDL_TOUCH_MOUSEID for touch events, or 0 */
  state: number; /**< SDL_MouseButtonFlags : The current button state */
  x: number; /**< float : X coordinate, relative to window */
  y: number; /**< float : Y coordinate, relative to window */
  xrel: number; /**< float : The relative motion in the X direction */
  yrel: number; /**< float : The relative motion in the Y direction */
}

export function read_MouseMotionEvent(dt: DataView): MouseMotionEvent {
  const t = _b.SDL_MouseMotionEvent.read(dt);
  return {
    type: t.type, /** SDL_EventType */
    reserved: t.reserved, /** Uint32 */
    timestamp: t.timestamp, /** Uint64 */
    windowID: t.windowID, /** SDL_WindowID */
    which: t.which, /** SDL_MouseID */
    state: t.state, /** SDL_MouseButtonFlags */
    x: t.x, /** float */
    y: t.y, /** float */
    xrel: t.xrel, /** float */
    yrel: t.yrel, /** float */
  };
}

export function write_MouseMotionEvent(t: MouseMotionEvent, dt: DataView) {
  _b.SDL_MouseMotionEvent.write({
    type: t.type, /** SDL_EventType */
    reserved: t.reserved, /** Uint32 */
    timestamp: t.timestamp, /** Uint64 */
    windowID: t.windowID, /** SDL_WindowID */
    which: t.which, /** SDL_MouseID */
    state: t.state, /** SDL_MouseButtonFlags */
    x: t.x, /** float */
    y: t.y, /** float */
    xrel: t.xrel, /** float */
    yrel: t.yrel, /** float */
  }, dt);
}


/**
 * Mouse button event structure (event.button.*)
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @from SDL_events.h:462
 */
export interface MouseButtonEvent {
  type: number; /**< SDL_EventType : SDL_EVENT_MOUSE_BUTTON_DOWN or SDL_EVENT_MOUSE_BUTTON_UP */
  reserved: number; /* Uint32 */
  timestamp: bigint; /**< Uint64 : In nanoseconds, populated using SDL_GetTicksNS() */
  windowID: number; /**< SDL_WindowID : The window with mouse focus, if any */
  which: number; /**< SDL_MouseID : The mouse instance id in relative mode, SDL_TOUCH_MOUSEID for touch events, or 0 */
  button: number; /**< Uint8 : The mouse button index */
  down: boolean; /**< bool : true if the button is pressed */
  clicks: number; /**< Uint8 : 1 for single-click, 2 for double-click, etc. */
  padding: number; /* Uint8 */
  x: number; /**< float : X coordinate, relative to window */
  y: number; /**< float : Y coordinate, relative to window */
}

export function read_MouseButtonEvent(dt: DataView): MouseButtonEvent {
  const t = _b.SDL_MouseButtonEvent.read(dt);
  return {
    type: t.type, /** SDL_EventType */
    reserved: t.reserved, /** Uint32 */
    timestamp: t.timestamp, /** Uint64 */
    windowID: t.windowID, /** SDL_WindowID */
    which: t.which, /** SDL_MouseID */
    button: t.button, /** Uint8 */
    down: t.down, /** bool */
    clicks: t.clicks, /** Uint8 */
    padding: t.padding, /** Uint8 */
    x: t.x, /** float */
    y: t.y, /** float */
  };
}

export function write_MouseButtonEvent(t: MouseButtonEvent, dt: DataView) {
  _b.SDL_MouseButtonEvent.write({
    type: t.type, /** SDL_EventType */
    reserved: t.reserved, /** Uint32 */
    timestamp: t.timestamp, /** Uint64 */
    windowID: t.windowID, /** SDL_WindowID */
    which: t.which, /** SDL_MouseID */
    button: t.button, /** Uint8 */
    down: t.down, /** bool */
    clicks: t.clicks, /** Uint8 */
    padding: t.padding, /** Uint8 */
    x: t.x, /** float */
    y: t.y, /** float */
  }, dt);
}


/**
 * Mouse wheel event structure (event.wheel.*)
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @from SDL_events.h:482
 */
export interface MouseWheelEvent {
  type: number; /**< SDL_EventType : SDL_EVENT_MOUSE_WHEEL */
  reserved: number; /* Uint32 */
  timestamp: bigint; /**< Uint64 : In nanoseconds, populated using SDL_GetTicksNS() */
  windowID: number; /**< SDL_WindowID : The window with mouse focus, if any */
  which: number; /**< SDL_MouseID : The mouse instance id in relative mode or 0 */
  x: number; /**< float : The amount scrolled horizontally, positive to the right and negative to the left */
  y: number; /**< float : The amount scrolled vertically, positive away from the user and negative toward the user */
  direction: number; /**< SDL_MouseWheelDirection : Set to one of the SDL_MOUSEWHEEL_* defines. When FLIPPED the values in X and Y will be opposite. Multiply by -1 to change them back */
  mouse_x: number; /**< float : X coordinate, relative to window */
  mouse_y: number; /**< float : Y coordinate, relative to window */
  integer_x: number; /**< Sint32 : The amount scrolled horizontally, accumulated to whole scroll "ticks" (added in 3.2.12) */
  integer_y: number; /**< Sint32 : The amount scrolled vertically, accumulated to whole scroll "ticks" (added in 3.2.12) */
}

export function read_MouseWheelEvent(dt: DataView): MouseWheelEvent {
  const t = _b.SDL_MouseWheelEvent.read(dt);
  return {
    type: t.type, /** SDL_EventType */
    reserved: t.reserved, /** Uint32 */
    timestamp: t.timestamp, /** Uint64 */
    windowID: t.windowID, /** SDL_WindowID */
    which: t.which, /** SDL_MouseID */
    x: t.x, /** float */
    y: t.y, /** float */
    direction: t.direction, /** SDL_MouseWheelDirection */
    mouse_x: t.mouse_x, /** float */
    mouse_y: t.mouse_y, /** float */
    integer_x: t.integer_x, /** Sint32 */
    integer_y: t.integer_y, /** Sint32 */
  };
}

export function write_MouseWheelEvent(t: MouseWheelEvent, dt: DataView) {
  _b.SDL_MouseWheelEvent.write({
    type: t.type, /** SDL_EventType */
    reserved: t.reserved, /** Uint32 */
    timestamp: t.timestamp, /** Uint64 */
    windowID: t.windowID, /** SDL_WindowID */
    which: t.which, /** SDL_MouseID */
    x: t.x, /** float */
    y: t.y, /** float */
    direction: t.direction, /** SDL_MouseWheelDirection */
    mouse_x: t.mouse_x, /** float */
    mouse_y: t.mouse_y, /** float */
    integer_x: t.integer_x, /** Sint32 */
    integer_y: t.integer_y, /** Sint32 */
  }, dt);
}


/**
 * Joystick axis motion event structure (event.jaxis.*)
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @from SDL_events.h:503
 */
export interface JoyAxisEvent {
  type: number; /**< SDL_EventType : SDL_EVENT_JOYSTICK_AXIS_MOTION */
  reserved: number; /* Uint32 */
  timestamp: bigint; /**< Uint64 : In nanoseconds, populated using SDL_GetTicksNS() */
  which: number; /**< SDL_JoystickID : The joystick instance id */
  axis: number; /**< Uint8 : The joystick axis index */
  padding1: number; /* Uint8 */
  padding2: number; /* Uint8 */
  padding3: number; /* Uint8 */
  value: number; /**< Sint16 : The axis value (range: -32768 to 32767) */
  padding4: number; /* Uint16 */
}

export function read_JoyAxisEvent(dt: DataView): JoyAxisEvent {
  const t = _b.SDL_JoyAxisEvent.read(dt);
  return {
    type: t.type, /** SDL_EventType */
    reserved: t.reserved, /** Uint32 */
    timestamp: t.timestamp, /** Uint64 */
    which: t.which, /** SDL_JoystickID */
    axis: t.axis, /** Uint8 */
    padding1: t.padding1, /** Uint8 */
    padding2: t.padding2, /** Uint8 */
    padding3: t.padding3, /** Uint8 */
    value: t.value, /** Sint16 */
    padding4: t.padding4, /** Uint16 */
  };
}

export function write_JoyAxisEvent(t: JoyAxisEvent, dt: DataView) {
  _b.SDL_JoyAxisEvent.write({
    type: t.type, /** SDL_EventType */
    reserved: t.reserved, /** Uint32 */
    timestamp: t.timestamp, /** Uint64 */
    which: t.which, /** SDL_JoystickID */
    axis: t.axis, /** Uint8 */
    padding1: t.padding1, /** Uint8 */
    padding2: t.padding2, /** Uint8 */
    padding3: t.padding3, /** Uint8 */
    value: t.value, /** Sint16 */
    padding4: t.padding4, /** Uint16 */
  }, dt);
}


/**
 * Joystick trackball motion event structure (event.jball.*)
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @from SDL_events.h:522
 */
export interface JoyBallEvent {
  type: number; /**< SDL_EventType : SDL_EVENT_JOYSTICK_BALL_MOTION */
  reserved: number; /* Uint32 */
  timestamp: bigint; /**< Uint64 : In nanoseconds, populated using SDL_GetTicksNS() */
  which: number; /**< SDL_JoystickID : The joystick instance id */
  ball: number; /**< Uint8 : The joystick trackball index */
  padding1: number; /* Uint8 */
  padding2: number; /* Uint8 */
  padding3: number; /* Uint8 */
  xrel: number; /**< Sint16 : The relative motion in the X direction */
  yrel: number; /**< Sint16 : The relative motion in the Y direction */
}

export function read_JoyBallEvent(dt: DataView): JoyBallEvent {
  const t = _b.SDL_JoyBallEvent.read(dt);
  return {
    type: t.type, /** SDL_EventType */
    reserved: t.reserved, /** Uint32 */
    timestamp: t.timestamp, /** Uint64 */
    which: t.which, /** SDL_JoystickID */
    ball: t.ball, /** Uint8 */
    padding1: t.padding1, /** Uint8 */
    padding2: t.padding2, /** Uint8 */
    padding3: t.padding3, /** Uint8 */
    xrel: t.xrel, /** Sint16 */
    yrel: t.yrel, /** Sint16 */
  };
}

export function write_JoyBallEvent(t: JoyBallEvent, dt: DataView) {
  _b.SDL_JoyBallEvent.write({
    type: t.type, /** SDL_EventType */
    reserved: t.reserved, /** Uint32 */
    timestamp: t.timestamp, /** Uint64 */
    which: t.which, /** SDL_JoystickID */
    ball: t.ball, /** Uint8 */
    padding1: t.padding1, /** Uint8 */
    padding2: t.padding2, /** Uint8 */
    padding3: t.padding3, /** Uint8 */
    xrel: t.xrel, /** Sint16 */
    yrel: t.yrel, /** Sint16 */
  }, dt);
}


/**
 * Joystick hat position change event structure (event.jhat.*)
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @from SDL_events.h:541
 */
export interface JoyHatEvent {
  type: number; /**< SDL_EventType : SDL_EVENT_JOYSTICK_HAT_MOTION */
  reserved: number; /* Uint32 */
  timestamp: bigint; /**< Uint64 : In nanoseconds, populated using SDL_GetTicksNS() */
  which: number; /**< SDL_JoystickID : The joystick instance id */
  hat: number; /**< Uint8 : The joystick hat index */
  value: number; /**< Uint8 : The hat position value.
                         *   \sa SDL_HAT_LEFTUP SDL_HAT_UP SDL_HAT_RIGHTUP
                         *   \sa SDL_HAT_LEFT SDL_HAT_CENTERED SDL_HAT_RIGHT
                         *   \sa SDL_HAT_LEFTDOWN SDL_HAT_DOWN SDL_HAT_RIGHTDOWN
                         *
                         *   Note that zero means the POV is centered.
                         */
  padding1: number; /* Uint8 */
  padding2: number; /* Uint8 */
}

export function read_JoyHatEvent(dt: DataView): JoyHatEvent {
  const t = _b.SDL_JoyHatEvent.read(dt);
  return {
    type: t.type, /** SDL_EventType */
    reserved: t.reserved, /** Uint32 */
    timestamp: t.timestamp, /** Uint64 */
    which: t.which, /** SDL_JoystickID */
    hat: t.hat, /** Uint8 */
    value: t.value, /** Uint8 */
    padding1: t.padding1, /** Uint8 */
    padding2: t.padding2, /** Uint8 */
  };
}

export function write_JoyHatEvent(t: JoyHatEvent, dt: DataView) {
  _b.SDL_JoyHatEvent.write({
    type: t.type, /** SDL_EventType */
    reserved: t.reserved, /** Uint32 */
    timestamp: t.timestamp, /** Uint64 */
    which: t.which, /** SDL_JoystickID */
    hat: t.hat, /** Uint8 */
    value: t.value, /** Uint8 */
    padding1: t.padding1, /** Uint8 */
    padding2: t.padding2, /** Uint8 */
  }, dt);
}


/**
 * Joystick button event structure (event.jbutton.*)
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @from SDL_events.h:564
 */
export interface JoyButtonEvent {
  type: number; /**< SDL_EventType : SDL_EVENT_JOYSTICK_BUTTON_DOWN or SDL_EVENT_JOYSTICK_BUTTON_UP */
  reserved: number; /* Uint32 */
  timestamp: bigint; /**< Uint64 : In nanoseconds, populated using SDL_GetTicksNS() */
  which: number; /**< SDL_JoystickID : The joystick instance id */
  button: number; /**< Uint8 : The joystick button index */
  down: boolean; /**< bool : true if the button is pressed */
  padding1: number; /* Uint8 */
  padding2: number; /* Uint8 */
}

export function read_JoyButtonEvent(dt: DataView): JoyButtonEvent {
  const t = _b.SDL_JoyButtonEvent.read(dt);
  return {
    type: t.type, /** SDL_EventType */
    reserved: t.reserved, /** Uint32 */
    timestamp: t.timestamp, /** Uint64 */
    which: t.which, /** SDL_JoystickID */
    button: t.button, /** Uint8 */
    down: t.down, /** bool */
    padding1: t.padding1, /** Uint8 */
    padding2: t.padding2, /** Uint8 */
  };
}

export function write_JoyButtonEvent(t: JoyButtonEvent, dt: DataView) {
  _b.SDL_JoyButtonEvent.write({
    type: t.type, /** SDL_EventType */
    reserved: t.reserved, /** Uint32 */
    timestamp: t.timestamp, /** Uint64 */
    which: t.which, /** SDL_JoystickID */
    button: t.button, /** Uint8 */
    down: t.down, /** bool */
    padding1: t.padding1, /** Uint8 */
    padding2: t.padding2, /** Uint8 */
  }, dt);
}


/**
 * Joystick device event structure (event.jdevice.*)
 *
 * SDL will send JOYSTICK_ADDED events for devices that are already plugged in
 * during SDL_Init.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @sa SDL_GamepadDeviceEvent
 *
 * @from SDL_events.h:586
 */
export interface JoyDeviceEvent {
  type: number; /**< SDL_EventType : SDL_EVENT_JOYSTICK_ADDED or SDL_EVENT_JOYSTICK_REMOVED or SDL_EVENT_JOYSTICK_UPDATE_COMPLETE */
  reserved: number; /* Uint32 */
  timestamp: bigint; /**< Uint64 : In nanoseconds, populated using SDL_GetTicksNS() */
  which: number; /**< SDL_JoystickID : The joystick instance id */
}

export function read_JoyDeviceEvent(dt: DataView): JoyDeviceEvent {
  const t = _b.SDL_JoyDeviceEvent.read(dt);
  return {
    type: t.type, /** SDL_EventType */
    reserved: t.reserved, /** Uint32 */
    timestamp: t.timestamp, /** Uint64 */
    which: t.which, /** SDL_JoystickID */
  };
}

export function write_JoyDeviceEvent(t: JoyDeviceEvent, dt: DataView) {
  _b.SDL_JoyDeviceEvent.write({
    type: t.type, /** SDL_EventType */
    reserved: t.reserved, /** Uint32 */
    timestamp: t.timestamp, /** Uint64 */
    which: t.which, /** SDL_JoystickID */
  }, dt);
}


/**
 * Joystick battery level change event structure (event.jbattery.*)
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @from SDL_events.h:599
 */
export interface JoyBatteryEvent {
  type: number; /**< SDL_EventType : SDL_EVENT_JOYSTICK_BATTERY_UPDATED */
  reserved: number; /* Uint32 */
  timestamp: bigint; /**< Uint64 : In nanoseconds, populated using SDL_GetTicksNS() */
  which: number; /**< SDL_JoystickID : The joystick instance id */
  state: number; /**< SDL_PowerState : The joystick battery state */
  percent: number; /**< int : The joystick battery percent charge remaining */
}

export function read_JoyBatteryEvent(dt: DataView): JoyBatteryEvent {
  const t = _b.SDL_JoyBatteryEvent.read(dt);
  return {
    type: t.type, /** SDL_EventType */
    reserved: t.reserved, /** Uint32 */
    timestamp: t.timestamp, /** Uint64 */
    which: t.which, /** SDL_JoystickID */
    state: t.state, /** SDL_PowerState */
    percent: t.percent, /** int */
  };
}

export function write_JoyBatteryEvent(t: JoyBatteryEvent, dt: DataView) {
  _b.SDL_JoyBatteryEvent.write({
    type: t.type, /** SDL_EventType */
    reserved: t.reserved, /** Uint32 */
    timestamp: t.timestamp, /** Uint64 */
    which: t.which, /** SDL_JoystickID */
    state: t.state, /** SDL_PowerState */
    percent: t.percent, /** int */
  }, dt);
}


/**
 * Gamepad axis motion event structure (event.gaxis.*)
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @from SDL_events.h:614
 */
export interface GamepadAxisEvent {
  type: number; /**< SDL_EventType : SDL_EVENT_GAMEPAD_AXIS_MOTION */
  reserved: number; /* Uint32 */
  timestamp: bigint; /**< Uint64 : In nanoseconds, populated using SDL_GetTicksNS() */
  which: number; /**< SDL_JoystickID : The joystick instance id */
  axis: number; /**< Uint8 : The gamepad axis (SDL_GamepadAxis) */
  padding1: number; /* Uint8 */
  padding2: number; /* Uint8 */
  padding3: number; /* Uint8 */
  value: number; /**< Sint16 : The axis value (range: -32768 to 32767) */
  padding4: number; /* Uint16 */
}

export function read_GamepadAxisEvent(dt: DataView): GamepadAxisEvent {
  const t = _b.SDL_GamepadAxisEvent.read(dt);
  return {
    type: t.type, /** SDL_EventType */
    reserved: t.reserved, /** Uint32 */
    timestamp: t.timestamp, /** Uint64 */
    which: t.which, /** SDL_JoystickID */
    axis: t.axis, /** Uint8 */
    padding1: t.padding1, /** Uint8 */
    padding2: t.padding2, /** Uint8 */
    padding3: t.padding3, /** Uint8 */
    value: t.value, /** Sint16 */
    padding4: t.padding4, /** Uint16 */
  };
}

export function write_GamepadAxisEvent(t: GamepadAxisEvent, dt: DataView) {
  _b.SDL_GamepadAxisEvent.write({
    type: t.type, /** SDL_EventType */
    reserved: t.reserved, /** Uint32 */
    timestamp: t.timestamp, /** Uint64 */
    which: t.which, /** SDL_JoystickID */
    axis: t.axis, /** Uint8 */
    padding1: t.padding1, /** Uint8 */
    padding2: t.padding2, /** Uint8 */
    padding3: t.padding3, /** Uint8 */
    value: t.value, /** Sint16 */
    padding4: t.padding4, /** Uint16 */
  }, dt);
}


/**
 * Gamepad button event structure (event.gbutton.*)
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @from SDL_events.h:634
 */
export interface GamepadButtonEvent {
  type: number; /**< SDL_EventType : SDL_EVENT_GAMEPAD_BUTTON_DOWN or SDL_EVENT_GAMEPAD_BUTTON_UP */
  reserved: number; /* Uint32 */
  timestamp: bigint; /**< Uint64 : In nanoseconds, populated using SDL_GetTicksNS() */
  which: number; /**< SDL_JoystickID : The joystick instance id */
  button: number; /**< Uint8 : The gamepad button (SDL_GamepadButton) */
  down: boolean; /**< bool : true if the button is pressed */
  padding1: number; /* Uint8 */
  padding2: number; /* Uint8 */
}

export function read_GamepadButtonEvent(dt: DataView): GamepadButtonEvent {
  const t = _b.SDL_GamepadButtonEvent.read(dt);
  return {
    type: t.type, /** SDL_EventType */
    reserved: t.reserved, /** Uint32 */
    timestamp: t.timestamp, /** Uint64 */
    which: t.which, /** SDL_JoystickID */
    button: t.button, /** Uint8 */
    down: t.down, /** bool */
    padding1: t.padding1, /** Uint8 */
    padding2: t.padding2, /** Uint8 */
  };
}

export function write_GamepadButtonEvent(t: GamepadButtonEvent, dt: DataView) {
  _b.SDL_GamepadButtonEvent.write({
    type: t.type, /** SDL_EventType */
    reserved: t.reserved, /** Uint32 */
    timestamp: t.timestamp, /** Uint64 */
    which: t.which, /** SDL_JoystickID */
    button: t.button, /** Uint8 */
    down: t.down, /** bool */
    padding1: t.padding1, /** Uint8 */
    padding2: t.padding2, /** Uint8 */
  }, dt);
}


/**
 * Gamepad device event structure (event.gdevice.*)
 *
 * Joysticks that are supported gamepads receive both an SDL_JoyDeviceEvent
 * and an SDL_GamepadDeviceEvent.
 *
 * SDL will send GAMEPAD_ADDED events for joysticks that are already plugged
 * in during SDL_Init() and are recognized as gamepads. It will also send
 * events for joysticks that get gamepad mappings at runtime.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @sa SDL_JoyDeviceEvent
 *
 * @from SDL_events.h:661
 */
export interface GamepadDeviceEvent {
  type: number; /**< SDL_EventType : SDL_EVENT_GAMEPAD_ADDED, SDL_EVENT_GAMEPAD_REMOVED, or SDL_EVENT_GAMEPAD_REMAPPED, SDL_EVENT_GAMEPAD_UPDATE_COMPLETE or SDL_EVENT_GAMEPAD_STEAM_HANDLE_UPDATED */
  reserved: number; /* Uint32 */
  timestamp: bigint; /**< Uint64 : In nanoseconds, populated using SDL_GetTicksNS() */
  which: number; /**< SDL_JoystickID : The joystick instance id */
}

export function read_GamepadDeviceEvent(dt: DataView): GamepadDeviceEvent {
  const t = _b.SDL_GamepadDeviceEvent.read(dt);
  return {
    type: t.type, /** SDL_EventType */
    reserved: t.reserved, /** Uint32 */
    timestamp: t.timestamp, /** Uint64 */
    which: t.which, /** SDL_JoystickID */
  };
}

export function write_GamepadDeviceEvent(t: GamepadDeviceEvent, dt: DataView) {
  _b.SDL_GamepadDeviceEvent.write({
    type: t.type, /** SDL_EventType */
    reserved: t.reserved, /** Uint32 */
    timestamp: t.timestamp, /** Uint64 */
    which: t.which, /** SDL_JoystickID */
  }, dt);
}


/**
 * Gamepad touchpad event structure (event.gtouchpad.*)
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @from SDL_events.h:674
 */
export interface GamepadTouchpadEvent {
  type: number; /**< SDL_EventType : SDL_EVENT_GAMEPAD_TOUCHPAD_DOWN or SDL_EVENT_GAMEPAD_TOUCHPAD_MOTION or SDL_EVENT_GAMEPAD_TOUCHPAD_UP */
  reserved: number; /* Uint32 */
  timestamp: bigint; /**< Uint64 : In nanoseconds, populated using SDL_GetTicksNS() */
  which: number; /**< SDL_JoystickID : The joystick instance id */
  touchpad: number; /**< Sint32 : The index of the touchpad */
  finger: number; /**< Sint32 : The index of the finger on the touchpad */
  x: number; /**< float : Normalized in the range 0...1 with 0 being on the left */
  y: number; /**< float : Normalized in the range 0...1 with 0 being at the top */
  pressure: number; /**< float : Normalized in the range 0...1 */
}

export function read_GamepadTouchpadEvent(dt: DataView): GamepadTouchpadEvent {
  const t = _b.SDL_GamepadTouchpadEvent.read(dt);
  return {
    type: t.type, /** SDL_EventType */
    reserved: t.reserved, /** Uint32 */
    timestamp: t.timestamp, /** Uint64 */
    which: t.which, /** SDL_JoystickID */
    touchpad: t.touchpad, /** Sint32 */
    finger: t.finger, /** Sint32 */
    x: t.x, /** float */
    y: t.y, /** float */
    pressure: t.pressure, /** float */
  };
}

export function write_GamepadTouchpadEvent(t: GamepadTouchpadEvent, dt: DataView) {
  _b.SDL_GamepadTouchpadEvent.write({
    type: t.type, /** SDL_EventType */
    reserved: t.reserved, /** Uint32 */
    timestamp: t.timestamp, /** Uint64 */
    which: t.which, /** SDL_JoystickID */
    touchpad: t.touchpad, /** Sint32 */
    finger: t.finger, /** Sint32 */
    x: t.x, /** float */
    y: t.y, /** float */
    pressure: t.pressure, /** float */
  }, dt);
}


/**
 * Gamepad sensor event structure (event.gsensor.*)
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @from SDL_events.h:692
 */
export interface GamepadSensorEvent {
  type: number; /**< SDL_EventType : SDL_EVENT_GAMEPAD_SENSOR_UPDATE */
  reserved: number; /* Uint32 */
  timestamp: bigint; /**< Uint64 : In nanoseconds, populated using SDL_GetTicksNS() */
  which: number; /**< SDL_JoystickID : The joystick instance id */
  sensor: number; /**< Sint32 : The type of the sensor, one of the values of SDL_SensorType */
  data: number[]; /**< float[3] : Up to 3 values from the sensor, as defined in SDL_sensor.h */
  sensor_timestamp: bigint; /**< Uint64 : The timestamp of the sensor reading in nanoseconds, not necessarily synchronized with the system clock */
}

export function read_GamepadSensorEvent(dt: DataView): GamepadSensorEvent {
  const t = _b.SDL_GamepadSensorEvent.read(dt);
  return {
    type: t.type, /** SDL_EventType */
    reserved: t.reserved, /** Uint32 */
    timestamp: t.timestamp, /** Uint64 */
    which: t.which, /** SDL_JoystickID */
    sensor: t.sensor, /** Sint32 */
    data: t.data, /** float */
    sensor_timestamp: t.sensor_timestamp, /** Uint64 */
  };
}

export function write_GamepadSensorEvent(t: GamepadSensorEvent, dt: DataView) {
  _b.SDL_GamepadSensorEvent.write({
    type: t.type, /** SDL_EventType */
    reserved: t.reserved, /** Uint32 */
    timestamp: t.timestamp, /** Uint64 */
    which: t.which, /** SDL_JoystickID */
    sensor: t.sensor, /** Sint32 */
    data: t.data, /** float */
    sensor_timestamp: t.sensor_timestamp, /** Uint64 */
  }, dt);
}


/**
 * Audio device event structure (event.adevice.*)
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @from SDL_events.h:708
 */
export interface AudioDeviceEvent {
  type: number; /**< SDL_EventType : SDL_EVENT_AUDIO_DEVICE_ADDED, or SDL_EVENT_AUDIO_DEVICE_REMOVED, or SDL_EVENT_AUDIO_DEVICE_FORMAT_CHANGED */
  reserved: number; /* Uint32 */
  timestamp: bigint; /**< Uint64 : In nanoseconds, populated using SDL_GetTicksNS() */
  which: number; /**< SDL_AudioDeviceID : SDL_AudioDeviceID for the device being added or removed or changing */
  recording: boolean; /**< bool : false if a playback device, true if a recording device. */
  padding1: number; /* Uint8 */
  padding2: number; /* Uint8 */
  padding3: number; /* Uint8 */
}

export function read_AudioDeviceEvent(dt: DataView): AudioDeviceEvent {
  const t = _b.SDL_AudioDeviceEvent.read(dt);
  return {
    type: t.type, /** SDL_EventType */
    reserved: t.reserved, /** Uint32 */
    timestamp: t.timestamp, /** Uint64 */
    which: t.which, /** SDL_AudioDeviceID */
    recording: t.recording, /** bool */
    padding1: t.padding1, /** Uint8 */
    padding2: t.padding2, /** Uint8 */
    padding3: t.padding3, /** Uint8 */
  };
}

export function write_AudioDeviceEvent(t: AudioDeviceEvent, dt: DataView) {
  _b.SDL_AudioDeviceEvent.write({
    type: t.type, /** SDL_EventType */
    reserved: t.reserved, /** Uint32 */
    timestamp: t.timestamp, /** Uint64 */
    which: t.which, /** SDL_AudioDeviceID */
    recording: t.recording, /** bool */
    padding1: t.padding1, /** Uint8 */
    padding2: t.padding2, /** Uint8 */
    padding3: t.padding3, /** Uint8 */
  }, dt);
}


/**
 * Camera device event structure (event.cdevice.*)
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @from SDL_events.h:725
 */
export interface CameraDeviceEvent {
  type: number; /**< SDL_EventType : SDL_EVENT_CAMERA_DEVICE_ADDED, SDL_EVENT_CAMERA_DEVICE_REMOVED, SDL_EVENT_CAMERA_DEVICE_APPROVED, SDL_EVENT_CAMERA_DEVICE_DENIED */
  reserved: number; /* Uint32 */
  timestamp: bigint; /**< Uint64 : In nanoseconds, populated using SDL_GetTicksNS() */
  which: number; /**< SDL_CameraID : SDL_CameraID for the device being added or removed or changing */
}

export function read_CameraDeviceEvent(dt: DataView): CameraDeviceEvent {
  const t = _b.SDL_CameraDeviceEvent.read(dt);
  return {
    type: t.type, /** SDL_EventType */
    reserved: t.reserved, /** Uint32 */
    timestamp: t.timestamp, /** Uint64 */
    which: t.which, /** SDL_CameraID */
  };
}

export function write_CameraDeviceEvent(t: CameraDeviceEvent, dt: DataView) {
  _b.SDL_CameraDeviceEvent.write({
    type: t.type, /** SDL_EventType */
    reserved: t.reserved, /** Uint32 */
    timestamp: t.timestamp, /** Uint64 */
    which: t.which, /** SDL_CameraID */
  }, dt);
}


/**
 * Renderer event structure (event.render.*)
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @from SDL_events.h:739
 */
export interface RenderEvent {
  type: number; /**< SDL_EventType : SDL_EVENT_RENDER_TARGETS_RESET, SDL_EVENT_RENDER_DEVICE_RESET, SDL_EVENT_RENDER_DEVICE_LOST */
  reserved: number; /* Uint32 */
  timestamp: bigint; /**< Uint64 : In nanoseconds, populated using SDL_GetTicksNS() */
  windowID: number; /**< SDL_WindowID : The window containing the renderer in question. */
}

export function read_RenderEvent(dt: DataView): RenderEvent {
  const t = _b.SDL_RenderEvent.read(dt);
  return {
    type: t.type, /** SDL_EventType */
    reserved: t.reserved, /** Uint32 */
    timestamp: t.timestamp, /** Uint64 */
    windowID: t.windowID, /** SDL_WindowID */
  };
}

export function write_RenderEvent(t: RenderEvent, dt: DataView) {
  _b.SDL_RenderEvent.write({
    type: t.type, /** SDL_EventType */
    reserved: t.reserved, /** Uint32 */
    timestamp: t.timestamp, /** Uint64 */
    windowID: t.windowID, /** SDL_WindowID */
  }, dt);
}


/**
 * Touch finger event structure (event.tfinger.*)
 *
 * Coordinates in this event are normalized. `x` and `y` are normalized to a
 * range between 0.0f and 1.0f, relative to the window, so (0,0) is the top
 * left and (1,1) is the bottom right. Delta coordinates `dx` and `dy` are
 * normalized in the ranges of -1.0f (traversed all the way from the bottom or
 * right to all the way up or left) to 1.0f (traversed all the way from the
 * top or left to all the way down or right).
 *
 * Note that while the coordinates are _normalized_, they are not _clamped_,
 * which means in some circumstances you can get a value outside of this
 * range. For example, a renderer using logical presentation might give a
 * negative value when the touch is in the letterboxing. Some platforms might
 * report a touch outside of the window, which will also be outside of the
 * range.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @from SDL_events.h:767
 */
export interface TouchFingerEvent {
  type: number; /**< SDL_EventType : SDL_EVENT_FINGER_DOWN, SDL_EVENT_FINGER_UP, SDL_EVENT_FINGER_MOTION, or SDL_EVENT_FINGER_CANCELED */
  reserved: number; /* Uint32 */
  timestamp: bigint; /**< Uint64 : In nanoseconds, populated using SDL_GetTicksNS() */
  touchID: bigint; /**< SDL_TouchID : The touch device id */
  fingerID: bigint; /* SDL_FingerID */
  x: number; /**< float : Normalized in the range 0...1 */
  y: number; /**< float : Normalized in the range 0...1 */
  dx: number; /**< float : Normalized in the range -1...1 */
  dy: number; /**< float : Normalized in the range -1...1 */
  pressure: number; /**< float : Normalized in the range 0...1 */
  windowID: number; /**< SDL_WindowID : The window underneath the finger, if any */
}

export function read_TouchFingerEvent(dt: DataView): TouchFingerEvent {
  const t = _b.SDL_TouchFingerEvent.read(dt);
  return {
    type: t.type, /** SDL_EventType */
    reserved: t.reserved, /** Uint32 */
    timestamp: t.timestamp, /** Uint64 */
    touchID: t.touchID, /** SDL_TouchID */
    fingerID: t.fingerID, /** SDL_FingerID */
    x: t.x, /** float */
    y: t.y, /** float */
    dx: t.dx, /** float */
    dy: t.dy, /** float */
    pressure: t.pressure, /** float */
    windowID: t.windowID, /** SDL_WindowID */
  };
}

export function write_TouchFingerEvent(t: TouchFingerEvent, dt: DataView) {
  _b.SDL_TouchFingerEvent.write({
    type: t.type, /** SDL_EventType */
    reserved: t.reserved, /** Uint32 */
    timestamp: t.timestamp, /** Uint64 */
    touchID: t.touchID, /** SDL_TouchID */
    fingerID: t.fingerID, /** SDL_FingerID */
    x: t.x, /** float */
    y: t.y, /** float */
    dx: t.dx, /** float */
    dy: t.dy, /** float */
    pressure: t.pressure, /** float */
    windowID: t.windowID, /** SDL_WindowID */
  }, dt);
}


/**
 * Pressure-sensitive pen proximity event structure (event.pmotion.*)
 *
 * When a pen becomes visible to the system (it is close enough to a tablet,
 * etc), SDL will send an SDL_EVENT_PEN_PROXIMITY_IN event with the new pen's
 * ID. This ID is valid until the pen leaves proximity again (has been removed
 * from the tablet's area, the tablet has been unplugged, etc). If the same
 * pen reenters proximity again, it will be given a new ID.
 *
 * Note that "proximity" means "close enough for the tablet to know the tool
 * is there." The pen touching and lifting off from the tablet while not
 * leaving the area are handled by SDL_EVENT_PEN_DOWN and SDL_EVENT_PEN_UP.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @from SDL_events.h:797
 */
export interface PenProximityEvent {
  type: number; /**< SDL_EventType : SDL_EVENT_PEN_PROXIMITY_IN or SDL_EVENT_PEN_PROXIMITY_OUT */
  reserved: number; /* Uint32 */
  timestamp: bigint; /**< Uint64 : In nanoseconds, populated using SDL_GetTicksNS() */
  windowID: number; /**< SDL_WindowID : The window with pen focus, if any */
  which: number; /**< SDL_PenID : The pen instance id */
}

export function read_PenProximityEvent(dt: DataView): PenProximityEvent {
  const t = _b.SDL_PenProximityEvent.read(dt);
  return {
    type: t.type, /** SDL_EventType */
    reserved: t.reserved, /** Uint32 */
    timestamp: t.timestamp, /** Uint64 */
    windowID: t.windowID, /** SDL_WindowID */
    which: t.which, /** SDL_PenID */
  };
}

export function write_PenProximityEvent(t: PenProximityEvent, dt: DataView) {
  _b.SDL_PenProximityEvent.write({
    type: t.type, /** SDL_EventType */
    reserved: t.reserved, /** Uint32 */
    timestamp: t.timestamp, /** Uint64 */
    windowID: t.windowID, /** SDL_WindowID */
    which: t.which, /** SDL_PenID */
  }, dt);
}


/**
 * Pressure-sensitive pen motion event structure (event.pmotion.*)
 *
 * Depending on the hardware, you may get motion events when the pen is not
 * touching a tablet, for tracking a pen even when it isn't drawing. You
 * should listen for SDL_EVENT_PEN_DOWN and SDL_EVENT_PEN_UP events, or check
 * `pen_state & SDL_PEN_INPUT_DOWN` to decide if a pen is "drawing" when
 * dealing with pen motion.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @from SDL_events.h:817
 */
export interface PenMotionEvent {
  type: number; /**< SDL_EventType : SDL_EVENT_PEN_MOTION */
  reserved: number; /* Uint32 */
  timestamp: bigint; /**< Uint64 : In nanoseconds, populated using SDL_GetTicksNS() */
  windowID: number; /**< SDL_WindowID : The window with pen focus, if any */
  which: number; /**< SDL_PenID : The pen instance id */
  pen_state: number; /**< SDL_PenInputFlags : Complete pen input state at time of event */
  x: number; /**< float : X coordinate, relative to window */
  y: number; /**< float : Y coordinate, relative to window */
}

export function read_PenMotionEvent(dt: DataView): PenMotionEvent {
  const t = _b.SDL_PenMotionEvent.read(dt);
  return {
    type: t.type, /** SDL_EventType */
    reserved: t.reserved, /** Uint32 */
    timestamp: t.timestamp, /** Uint64 */
    windowID: t.windowID, /** SDL_WindowID */
    which: t.which, /** SDL_PenID */
    pen_state: t.pen_state, /** SDL_PenInputFlags */
    x: t.x, /** float */
    y: t.y, /** float */
  };
}

export function write_PenMotionEvent(t: PenMotionEvent, dt: DataView) {
  _b.SDL_PenMotionEvent.write({
    type: t.type, /** SDL_EventType */
    reserved: t.reserved, /** Uint32 */
    timestamp: t.timestamp, /** Uint64 */
    windowID: t.windowID, /** SDL_WindowID */
    which: t.which, /** SDL_PenID */
    pen_state: t.pen_state, /** SDL_PenInputFlags */
    x: t.x, /** float */
    y: t.y, /** float */
  }, dt);
}


/**
 * Pressure-sensitive pen touched event structure (event.ptouch.*)
 *
 * These events come when a pen touches a surface (a tablet, etc), or lifts
 * off from one.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @from SDL_events.h:837
 */
export interface PenTouchEvent {
  type: number; /**< SDL_EventType : SDL_EVENT_PEN_DOWN or SDL_EVENT_PEN_UP */
  reserved: number; /* Uint32 */
  timestamp: bigint; /**< Uint64 : In nanoseconds, populated using SDL_GetTicksNS() */
  windowID: number; /**< SDL_WindowID : The window with pen focus, if any */
  which: number; /**< SDL_PenID : The pen instance id */
  pen_state: number; /**< SDL_PenInputFlags : Complete pen input state at time of event */
  x: number; /**< float : X coordinate, relative to window */
  y: number; /**< float : Y coordinate, relative to window */
  eraser: boolean; /**< bool : true if eraser end is used (not all pens support this). */
  down: boolean; /**< bool : true if the pen is touching or false if the pen is lifted off */
}

export function read_PenTouchEvent(dt: DataView): PenTouchEvent {
  const t = _b.SDL_PenTouchEvent.read(dt);
  return {
    type: t.type, /** SDL_EventType */
    reserved: t.reserved, /** Uint32 */
    timestamp: t.timestamp, /** Uint64 */
    windowID: t.windowID, /** SDL_WindowID */
    which: t.which, /** SDL_PenID */
    pen_state: t.pen_state, /** SDL_PenInputFlags */
    x: t.x, /** float */
    y: t.y, /** float */
    eraser: t.eraser, /** bool */
    down: t.down, /** bool */
  };
}

export function write_PenTouchEvent(t: PenTouchEvent, dt: DataView) {
  _b.SDL_PenTouchEvent.write({
    type: t.type, /** SDL_EventType */
    reserved: t.reserved, /** Uint32 */
    timestamp: t.timestamp, /** Uint64 */
    windowID: t.windowID, /** SDL_WindowID */
    which: t.which, /** SDL_PenID */
    pen_state: t.pen_state, /** SDL_PenInputFlags */
    x: t.x, /** float */
    y: t.y, /** float */
    eraser: t.eraser, /** bool */
    down: t.down, /** bool */
  }, dt);
}


/**
 * Pressure-sensitive pen button event structure (event.pbutton.*)
 *
 * This is for buttons on the pen itself that the user might click. The pen
 * itself pressing down to draw triggers a SDL_EVENT_PEN_DOWN event instead.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @from SDL_events.h:859
 */
export interface PenButtonEvent {
  type: number; /**< SDL_EventType : SDL_EVENT_PEN_BUTTON_DOWN or SDL_EVENT_PEN_BUTTON_UP */
  reserved: number; /* Uint32 */
  timestamp: bigint; /**< Uint64 : In nanoseconds, populated using SDL_GetTicksNS() */
  windowID: number; /**< SDL_WindowID : The window with mouse focus, if any */
  which: number; /**< SDL_PenID : The pen instance id */
  pen_state: number; /**< SDL_PenInputFlags : Complete pen input state at time of event */
  x: number; /**< float : X coordinate, relative to window */
  y: number; /**< float : Y coordinate, relative to window */
  button: number; /**< Uint8 : The pen button index (first button is 1). */
  down: boolean; /**< bool : true if the button is pressed */
}

export function read_PenButtonEvent(dt: DataView): PenButtonEvent {
  const t = _b.SDL_PenButtonEvent.read(dt);
  return {
    type: t.type, /** SDL_EventType */
    reserved: t.reserved, /** Uint32 */
    timestamp: t.timestamp, /** Uint64 */
    windowID: t.windowID, /** SDL_WindowID */
    which: t.which, /** SDL_PenID */
    pen_state: t.pen_state, /** SDL_PenInputFlags */
    x: t.x, /** float */
    y: t.y, /** float */
    button: t.button, /** Uint8 */
    down: t.down, /** bool */
  };
}

export function write_PenButtonEvent(t: PenButtonEvent, dt: DataView) {
  _b.SDL_PenButtonEvent.write({
    type: t.type, /** SDL_EventType */
    reserved: t.reserved, /** Uint32 */
    timestamp: t.timestamp, /** Uint64 */
    windowID: t.windowID, /** SDL_WindowID */
    which: t.which, /** SDL_PenID */
    pen_state: t.pen_state, /** SDL_PenInputFlags */
    x: t.x, /** float */
    y: t.y, /** float */
    button: t.button, /** Uint8 */
    down: t.down, /** bool */
  }, dt);
}


/**
 * Pressure-sensitive pen pressure / angle event structure (event.paxis.*)
 *
 * You might get some of these events even if the pen isn't touching the
 * tablet.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @from SDL_events.h:881
 */
export interface PenAxisEvent {
  type: number; /**< SDL_EventType : SDL_EVENT_PEN_AXIS */
  reserved: number; /* Uint32 */
  timestamp: bigint; /**< Uint64 : In nanoseconds, populated using SDL_GetTicksNS() */
  windowID: number; /**< SDL_WindowID : The window with pen focus, if any */
  which: number; /**< SDL_PenID : The pen instance id */
  pen_state: number; /**< SDL_PenInputFlags : Complete pen input state at time of event */
  x: number; /**< float : X coordinate, relative to window */
  y: number; /**< float : Y coordinate, relative to window */
  axis: number; /**< SDL_PenAxis : Axis that has changed */
  value: number; /**< float : New value of axis */
}

export function read_PenAxisEvent(dt: DataView): PenAxisEvent {
  const t = _b.SDL_PenAxisEvent.read(dt);
  return {
    type: t.type, /** SDL_EventType */
    reserved: t.reserved, /** Uint32 */
    timestamp: t.timestamp, /** Uint64 */
    windowID: t.windowID, /** SDL_WindowID */
    which: t.which, /** SDL_PenID */
    pen_state: t.pen_state, /** SDL_PenInputFlags */
    x: t.x, /** float */
    y: t.y, /** float */
    axis: t.axis, /** SDL_PenAxis */
    value: t.value, /** float */
  };
}

export function write_PenAxisEvent(t: PenAxisEvent, dt: DataView) {
  _b.SDL_PenAxisEvent.write({
    type: t.type, /** SDL_EventType */
    reserved: t.reserved, /** Uint32 */
    timestamp: t.timestamp, /** Uint64 */
    windowID: t.windowID, /** SDL_WindowID */
    which: t.which, /** SDL_PenID */
    pen_state: t.pen_state, /** SDL_PenInputFlags */
    x: t.x, /** float */
    y: t.y, /** float */
    axis: t.axis, /** SDL_PenAxis */
    value: t.value, /** float */
  }, dt);
}


/**
 * An event used to drop text or request a file open by the system
 * (event.drop.*)
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @from SDL_events.h:901
 */
export interface DropEvent {
  type: number; /**< SDL_EventType : SDL_EVENT_DROP_BEGIN or SDL_EVENT_DROP_FILE or SDL_EVENT_DROP_TEXT or SDL_EVENT_DROP_COMPLETE or SDL_EVENT_DROP_POSITION */
  reserved: number; /* Uint32 */
  timestamp: bigint; /**< Uint64 : In nanoseconds, populated using SDL_GetTicksNS() */
  windowID: number; /**< SDL_WindowID : The window that was dropped on, if any */
  x: number; /**< float : X coordinate, relative to window (not on begin) */
  y: number; /**< float : Y coordinate, relative to window (not on begin) */
  source: string; /**< const char * : The source app that sent this drop event, or NULL if that isn't available */
  data: string; /**< const char * : The text for SDL_EVENT_DROP_TEXT and the file name for SDL_EVENT_DROP_FILE, NULL for other events */
}

export function read_DropEvent(dt: DataView): DropEvent {
  const t = _b.SDL_DropEvent.read(dt);
  return {
    type: t.type, /** SDL_EventType */
    reserved: t.reserved, /** Uint32 */
    timestamp: t.timestamp, /** Uint64 */
    windowID: t.windowID, /** SDL_WindowID */
    x: t.x, /** float */
    y: t.y, /** float */
    source: _.read_cstr_v(t.source), /** const char * */
    data: _.read_cstr_v(t.data), /** const char * */
  };
}

export function write_DropEvent(t: DropEvent, dt: DataView) {
  _b.SDL_DropEvent.write({
    type: t.type, /** SDL_EventType */
    reserved: t.reserved, /** Uint32 */
    timestamp: t.timestamp, /** Uint64 */
    windowID: t.windowID, /** SDL_WindowID */
    x: t.x, /** float */
    y: t.y, /** float */
    source: _.cstr_v(t.source), /** const char * */
    data: _.cstr_v(t.data), /** const char * */
  }, dt);
}


/**
 * An event triggered when the clipboard contents have changed
 * (event.clipboard.*)
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @from SDL_events.h:919
 */
export interface ClipboardEvent {
  type: number; /**< SDL_EventType : SDL_EVENT_CLIPBOARD_UPDATE */
  reserved: number; /* Uint32 */
  timestamp: bigint; /**< Uint64 : In nanoseconds, populated using SDL_GetTicksNS() */
  owner: boolean; /**< bool : are we owning the clipboard (internal update) */
  num_mime_types: number; /**< Sint32 : number of mime types */
  mime_types: Deno.PointerValue; /**< const char ** : current mime types */
}

export function read_ClipboardEvent(dt: DataView): ClipboardEvent {
  const t = _b.SDL_ClipboardEvent.read(dt);
  return {
    type: t.type, /** SDL_EventType */
    reserved: t.reserved, /** Uint32 */
    timestamp: t.timestamp, /** Uint64 */
    owner: t.owner, /** bool */
    num_mime_types: t.num_mime_types, /** Sint32 */
    mime_types: Deno.UnsafePointer.create(t.mime_types), /** const char ** */
  };
}

export function write_ClipboardEvent(t: ClipboardEvent, dt: DataView) {
  _b.SDL_ClipboardEvent.write({
    type: t.type, /** SDL_EventType */
    reserved: t.reserved, /** Uint32 */
    timestamp: t.timestamp, /** Uint64 */
    owner: t.owner, /** bool */
    num_mime_types: t.num_mime_types, /** Sint32 */
    mime_types: Deno.UnsafePointer.value(t.mime_types), /** const char ** */
  }, dt);
}


/**
 * Sensor event structure (event.sensor.*)
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @from SDL_events.h:934
 */
export interface SensorEvent {
  type: number; /**< SDL_EventType : SDL_EVENT_SENSOR_UPDATE */
  reserved: number; /* Uint32 */
  timestamp: bigint; /**< Uint64 : In nanoseconds, populated using SDL_GetTicksNS() */
  which: number; /**< SDL_SensorID : The instance ID of the sensor */
  data: number[]; /**< float[6] : Up to 6 values from the sensor - additional values can be queried using SDL_GetSensorData() */
  sensor_timestamp: bigint; /**< Uint64 : The timestamp of the sensor reading in nanoseconds, not necessarily synchronized with the system clock */
}

export function read_SensorEvent(dt: DataView): SensorEvent {
  const t = _b.SDL_SensorEvent.read(dt);
  return {
    type: t.type, /** SDL_EventType */
    reserved: t.reserved, /** Uint32 */
    timestamp: t.timestamp, /** Uint64 */
    which: t.which, /** SDL_SensorID */
    data: t.data, /** float */
    sensor_timestamp: t.sensor_timestamp, /** Uint64 */
  };
}

export function write_SensorEvent(t: SensorEvent, dt: DataView) {
  _b.SDL_SensorEvent.write({
    type: t.type, /** SDL_EventType */
    reserved: t.reserved, /** Uint32 */
    timestamp: t.timestamp, /** Uint64 */
    which: t.which, /** SDL_SensorID */
    data: t.data, /** float */
    sensor_timestamp: t.sensor_timestamp, /** Uint64 */
  }, dt);
}


/**
 * The "quit requested" event
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @from SDL_events.h:949
 */
export interface QuitEvent {
  type: number; /**< SDL_EventType : SDL_EVENT_QUIT */
  reserved: number; /* Uint32 */
  timestamp: bigint; /**< Uint64 : In nanoseconds, populated using SDL_GetTicksNS() */
}

export function read_QuitEvent(dt: DataView): QuitEvent {
  const t = _b.SDL_QuitEvent.read(dt);
  return {
    type: t.type, /** SDL_EventType */
    reserved: t.reserved, /** Uint32 */
    timestamp: t.timestamp, /** Uint64 */
  };
}

export function write_QuitEvent(t: QuitEvent, dt: DataView) {
  _b.SDL_QuitEvent.write({
    type: t.type, /** SDL_EventType */
    reserved: t.reserved, /** Uint32 */
    timestamp: t.timestamp, /** Uint64 */
  }, dt);
}


/**
 * A user-defined event type (event.user.*)
 *
 * This event is unique; it is never created by SDL, but only by the
 * application. The event can be pushed onto the event queue using
 * SDL_PushEvent(). The contents of the structure members are completely up to
 * the programmer; the only requirement is that '''type''' is a value obtained
 * from SDL_RegisterEvents().
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @from SDL_events.h:967
 */
export interface UserEvent {
  type: number; /**< Uint32 : SDL_EVENT_USER through SDL_EVENT_LAST-1, Uint32 because these are not in the SDL_EventType enumeration */
  reserved: number; /* Uint32 */
  timestamp: bigint; /**< Uint64 : In nanoseconds, populated using SDL_GetTicksNS() */
  windowID: number; /**< SDL_WindowID : The associated window if any */
  code: number; /**< Sint32 : User defined event code */
  data1: Deno.PointerValue; /**< void * : User defined data pointer */
  data2: Deno.PointerValue; /**< void * : User defined data pointer */
}

export function read_UserEvent(dt: DataView): UserEvent {
  const t = _b.SDL_UserEvent.read(dt);
  return {
    type: t.type, /** Uint32 */
    reserved: t.reserved, /** Uint32 */
    timestamp: t.timestamp, /** Uint64 */
    windowID: t.windowID, /** SDL_WindowID */
    code: t.code, /** Sint32 */
    data1: Deno.UnsafePointer.create(t.data1), /** void * */
    data2: Deno.UnsafePointer.create(t.data2), /** void * */
  };
}

export function write_UserEvent(t: UserEvent, dt: DataView) {
  _b.SDL_UserEvent.write({
    type: t.type, /** Uint32 */
    reserved: t.reserved, /** Uint32 */
    timestamp: t.timestamp, /** Uint64 */
    windowID: t.windowID, /** SDL_WindowID */
    code: t.code, /** Sint32 */
    data1: Deno.UnsafePointer.value(t.data1), /** void * */
    data2: Deno.UnsafePointer.value(t.data2), /** void * */
  }, dt);
}
