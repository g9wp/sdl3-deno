import * as _ from "./structs/SDL_events.ts";
import { SDL_EventType as EventType } from "./enums/SDL_events.ts";
export { EventType };

export type PartialCommon<T extends _.CommonEvent> = Partial<_.CommonEvent> & Omit<T, keyof _.CommonEvent>;

export type PartialComm_T<T extends _.CommonEvent> =
  Pick<_.CommonEvent, "type"> &
  Partial<Omit<_.CommonEvent, "type">> &
  Omit<T, keyof _.CommonEvent>;

export abstract class EventUnion {
  abstract get dt(): DataView;
  abstract push(): void;


  /**< Event type, shared with all events, Uint32 to cover user events which are not in the SDL_EventType enumeration */
  get common(): _.CommonEvent {
    return _.read_CommonEvent(this.dt);
  }
  pushCommon(e: PartialComm_T<_.CommonEvent>) {
    _.write_CommonEvent({ reserved: 0, timestamp: 0n, ...e }, this.dt);
    this.push();
  }

  /**< SDL_EVENT_DISPLAY_* */
  get display(): _.DisplayEvent {
    return _.read_DisplayEvent(this.dt);
  }
  pushDisplay(e: PartialComm_T<_.DisplayEvent>) {
    _.write_DisplayEvent({ reserved: 0, timestamp: 0n, ...e }, this.dt);
    this.push();
  }

  /**< SDL_EVENT_WINDOW_* */
  get window(): _.WindowEvent {
    return _.read_WindowEvent(this.dt);
  }
  pushWindow(e: PartialComm_T<_.WindowEvent>) {
    _.write_WindowEvent({ reserved: 0, timestamp: 0n, ...e }, this.dt);
    this.push();
  }

  /**< SDL_EVENT_KEYBOARD_ADDED or SDL_EVENT_KEYBOARD_REMOVED */
  get keyboardDevice(): _.KeyboardDeviceEvent {
    return _.read_KeyboardDeviceEvent(this.dt);
  }
  pushKeyboardDevice(e: PartialComm_T<_.KeyboardDeviceEvent>) {
    _.write_KeyboardDeviceEvent({ reserved: 0, timestamp: 0n, ...e }, this.dt);
    this.push();
  }

  /**< SDL_EVENT_KEY_DOWN or SDL_EVENT_KEY_UP */
  get keyboard(): _.KeyboardEvent {
    return _.read_KeyboardEvent(this.dt);
  }
  pushKeyboard(e: PartialComm_T<_.KeyboardEvent>) {
    _.write_KeyboardEvent({ reserved: 0, timestamp: 0n, ...e }, this.dt);
    this.push();
  }

  /**< SDL_EVENT_TEXT_EDITING */
  get textEditing(): _.TextEditingEvent {
    return _.read_TextEditingEvent(this.dt);
  }
  pushTextEditing(e: PartialCommon<_.TextEditingEvent>) {
    _.write_TextEditingEvent({ type: EventType.TEXT_EDITING, reserved: 0, timestamp: 0n, ...e }, this.dt);
    this.push();
  }

  /**< SDL_EVENT_TEXT_EDITING_CANDIDATES */
  get textEditingCandidates(): _.TextEditingCandidatesEvent {
    return _.read_TextEditingCandidatesEvent(this.dt);
  }
  pushTextEditingCandidates(e: PartialCommon<_.TextEditingCandidatesEvent>) {
    _.write_TextEditingCandidatesEvent({ type: EventType.TEXT_EDITING_CANDIDATES, reserved: 0, timestamp: 0n, ...e }, this.dt);
    this.push();
  }

  /**< SDL_EVENT_TEXT_INPUT */
  get textInput(): _.TextInputEvent {
    return _.read_TextInputEvent(this.dt);
  }
  pushTextInput(e: PartialCommon<_.TextInputEvent>) {
    _.write_TextInputEvent({ type: EventType.TEXT_INPUT, reserved: 0, timestamp: 0n, ...e }, this.dt);
    this.push();
  }

  /**< SDL_EVENT_MOUSE_ADDED or SDL_EVENT_MOUSE_REMOVED */
  get mouseDevice(): _.MouseDeviceEvent {
    return _.read_MouseDeviceEvent(this.dt);
  }
  pushMouseDevice(e: PartialComm_T<_.MouseDeviceEvent>) {
    _.write_MouseDeviceEvent({ reserved: 0, timestamp: 0n, ...e }, this.dt);
    this.push();
  }

  /**< SDL_EVENT_MOUSE_MOTION */
  get mouseMotion(): _.MouseMotionEvent {
    return _.read_MouseMotionEvent(this.dt);
  }
  pushMouseMotion(e: PartialCommon<_.MouseMotionEvent>) {
    _.write_MouseMotionEvent({ type: EventType.MOUSE_MOTION, reserved: 0, timestamp: 0n, ...e }, this.dt);
    this.push();
  }

  /**< SDL_EVENT_MOUSE_BUTTON_DOWN or SDL_EVENT_MOUSE_BUTTON_UP */
  get mouseButton(): _.MouseButtonEvent {
    return _.read_MouseButtonEvent(this.dt);
  }
  pushMouseButton(e: PartialComm_T<_.MouseButtonEvent>) {
    _.write_MouseButtonEvent({ reserved: 0, timestamp: 0n, ...e }, this.dt);
    this.push();
  }

  /**< SDL_EVENT_MOUSE_WHEEL */
  get mouseWheel(): _.MouseWheelEvent {
    return _.read_MouseWheelEvent(this.dt);
  }
  pushMouseWheel(e: PartialCommon<_.MouseWheelEvent>) {
    _.write_MouseWheelEvent({ type: EventType.MOUSE_WHEEL, reserved: 0, timestamp: 0n, ...e }, this.dt);
    this.push();
  }

  /**< SDL_EVENT_JOYSTICK_AXIS_MOTION */
  get joyAxis(): _.JoyAxisEvent {
    return _.read_JoyAxisEvent(this.dt);
  }
  pushJoyAxis(e: PartialCommon<_.JoyAxisEvent>) {
    _.write_JoyAxisEvent({ type: EventType.JOYSTICK_AXIS_MOTION, reserved: 0, timestamp: 0n, ...e }, this.dt);
    this.push();
  }

  /**< SDL_EVENT_JOYSTICK_BALL_MOTION */
  get joyBall(): _.JoyBallEvent {
    return _.read_JoyBallEvent(this.dt);
  }
  pushJoyBall(e: PartialCommon<_.JoyBallEvent>) {
    _.write_JoyBallEvent({ type: EventType.JOYSTICK_BALL_MOTION, reserved: 0, timestamp: 0n, ...e }, this.dt);
    this.push();
  }

  /**< SDL_EVENT_JOYSTICK_HAT_MOTION */
  get joyHat(): _.JoyHatEvent {
    return _.read_JoyHatEvent(this.dt);
  }
  pushJoyHat(e: PartialCommon<_.JoyHatEvent>) {
    _.write_JoyHatEvent({ type: EventType.JOYSTICK_HAT_MOTION, reserved: 0, timestamp: 0n, ...e }, this.dt);
    this.push();
  }

  /**< SDL_EVENT_JOYSTICK_BUTTON_DOWN or SDL_EVENT_JOYSTICK_BUTTON_UP */
  get joyButton(): _.JoyButtonEvent {
    return _.read_JoyButtonEvent(this.dt);
  }
  pushJoyButton(e: PartialComm_T<_.JoyButtonEvent>) {
    _.write_JoyButtonEvent({ reserved: 0, timestamp: 0n, ...e }, this.dt);
    this.push();
  }

  /**< SDL_EVENT_JOYSTICK_ADDED or SDL_EVENT_JOYSTICK_REMOVED or SDL_EVENT_JOYSTICK_UPDATE_COMPLETE */
  get joyDevice(): _.JoyDeviceEvent {
    return _.read_JoyDeviceEvent(this.dt);
  }
  pushJoyDevice(e: PartialComm_T<_.JoyDeviceEvent>) {
    _.write_JoyDeviceEvent({ reserved: 0, timestamp: 0n, ...e }, this.dt);
    this.push();
  }

  /**< SDL_EVENT_JOYSTICK_BATTERY_UPDATED */
  get joyBattery(): _.JoyBatteryEvent {
    return _.read_JoyBatteryEvent(this.dt);
  }
  pushJoyBattery(e: PartialCommon<_.JoyBatteryEvent>) {
    _.write_JoyBatteryEvent({ type: EventType.JOYSTICK_BATTERY_UPDATED, reserved: 0, timestamp: 0n, ...e }, this.dt);
    this.push();
  }

  /**< SDL_EVENT_GAMEPAD_AXIS_MOTION */
  get gamepadAxis(): _.GamepadAxisEvent {
    return _.read_GamepadAxisEvent(this.dt);
  }
  pushGamepadAxis(e: PartialCommon<_.GamepadAxisEvent>) {
    _.write_GamepadAxisEvent({ type: EventType.GAMEPAD_AXIS_MOTION, reserved: 0, timestamp: 0n, ...e }, this.dt);
    this.push();
  }

  /**< SDL_EVENT_GAMEPAD_BUTTON_DOWN or SDL_EVENT_GAMEPAD_BUTTON_UP */
  get gamepadButton(): _.GamepadButtonEvent {
    return _.read_GamepadButtonEvent(this.dt);
  }
  pushGamepadButton(e: PartialComm_T<_.GamepadButtonEvent>) {
    _.write_GamepadButtonEvent({ reserved: 0, timestamp: 0n, ...e }, this.dt);
    this.push();
  }

  /**< SDL_EVENT_GAMEPAD_ADDED, SDL_EVENT_GAMEPAD_REMOVED, or SDL_EVENT_GAMEPAD_REMAPPED, SDL_EVENT_GAMEPAD_UPDATE_COMPLETE or SDL_EVENT_GAMEPAD_STEAM_HANDLE_UPDATED */
  get gamepadDevice(): _.GamepadDeviceEvent {
    return _.read_GamepadDeviceEvent(this.dt);
  }
  pushGamepadDevice(e: PartialComm_T<_.GamepadDeviceEvent>) {
    _.write_GamepadDeviceEvent({ reserved: 0, timestamp: 0n, ...e }, this.dt);
    this.push();
  }

  /**< SDL_EVENT_GAMEPAD_TOUCHPAD_DOWN or SDL_EVENT_GAMEPAD_TOUCHPAD_MOTION or SDL_EVENT_GAMEPAD_TOUCHPAD_UP */
  get gamepadTouchpad(): _.GamepadTouchpadEvent {
    return _.read_GamepadTouchpadEvent(this.dt);
  }
  pushGamepadTouchpad(e: PartialComm_T<_.GamepadTouchpadEvent>) {
    _.write_GamepadTouchpadEvent({ reserved: 0, timestamp: 0n, ...e }, this.dt);
    this.push();
  }

  /**< SDL_EVENT_GAMEPAD_SENSOR_UPDATE */
  get gamepadSensor(): _.GamepadSensorEvent {
    return _.read_GamepadSensorEvent(this.dt);
  }
  pushGamepadSensor(e: PartialCommon<_.GamepadSensorEvent>) {
    _.write_GamepadSensorEvent({ type: EventType.GAMEPAD_SENSOR_UPDATE, reserved: 0, timestamp: 0n, ...e }, this.dt);
    this.push();
  }

  /**< SDL_EVENT_AUDIO_DEVICE_ADDED, or SDL_EVENT_AUDIO_DEVICE_REMOVED, or SDL_EVENT_AUDIO_DEVICE_FORMAT_CHANGED */
  get audioDevice(): _.AudioDeviceEvent {
    return _.read_AudioDeviceEvent(this.dt);
  }
  pushAudioDevice(e: PartialComm_T<_.AudioDeviceEvent>) {
    _.write_AudioDeviceEvent({ reserved: 0, timestamp: 0n, ...e }, this.dt);
    this.push();
  }

  /**< SDL_EVENT_CAMERA_DEVICE_ADDED, SDL_EVENT_CAMERA_DEVICE_REMOVED, SDL_EVENT_CAMERA_DEVICE_APPROVED, SDL_EVENT_CAMERA_DEVICE_DENIED */
  get cameraDevice(): _.CameraDeviceEvent {
    return _.read_CameraDeviceEvent(this.dt);
  }
  pushCameraDevice(e: PartialComm_T<_.CameraDeviceEvent>) {
    _.write_CameraDeviceEvent({ reserved: 0, timestamp: 0n, ...e }, this.dt);
    this.push();
  }

  /**< SDL_EVENT_RENDER_TARGETS_RESET, SDL_EVENT_RENDER_DEVICE_RESET, SDL_EVENT_RENDER_DEVICE_LOST */
  get render(): _.RenderEvent {
    return _.read_RenderEvent(this.dt);
  }
  pushRender(e: PartialComm_T<_.RenderEvent>) {
    _.write_RenderEvent({ reserved: 0, timestamp: 0n, ...e }, this.dt);
    this.push();
  }

  /**< SDL_EVENT_FINGER_DOWN, SDL_EVENT_FINGER_UP, SDL_EVENT_FINGER_MOTION, or SDL_EVENT_FINGER_CANCELED */
  get touchFinger(): _.TouchFingerEvent {
    return _.read_TouchFingerEvent(this.dt);
  }
  pushTouchFinger(e: PartialComm_T<_.TouchFingerEvent>) {
    _.write_TouchFingerEvent({ reserved: 0, timestamp: 0n, ...e }, this.dt);
    this.push();
  }

  /**< ::SDL_EVENT_PINCH_BEGIN or ::SDL_EVENT_PINCH_UPDATE or ::SDL_EVENT_PINCH_END */
  get pinchFinger(): _.PinchFingerEvent {
    return _.read_PinchFingerEvent(this.dt);
  }
  pushPinchFinger(e: PartialComm_T<_.PinchFingerEvent>) {
    _.write_PinchFingerEvent({ reserved: 0, timestamp: 0n, ...e }, this.dt);
    this.push();
  }

  /**< SDL_EVENT_PEN_PROXIMITY_IN or SDL_EVENT_PEN_PROXIMITY_OUT */
  get penProximity(): _.PenProximityEvent {
    return _.read_PenProximityEvent(this.dt);
  }
  pushPenProximity(e: PartialComm_T<_.PenProximityEvent>) {
    _.write_PenProximityEvent({ reserved: 0, timestamp: 0n, ...e }, this.dt);
    this.push();
  }

  /**< SDL_EVENT_PEN_MOTION */
  get penMotion(): _.PenMotionEvent {
    return _.read_PenMotionEvent(this.dt);
  }
  pushPenMotion(e: PartialCommon<_.PenMotionEvent>) {
    _.write_PenMotionEvent({ type: EventType.PEN_MOTION, reserved: 0, timestamp: 0n, ...e }, this.dt);
    this.push();
  }

  /**< SDL_EVENT_PEN_DOWN or SDL_EVENT_PEN_UP */
  get penTouch(): _.PenTouchEvent {
    return _.read_PenTouchEvent(this.dt);
  }
  pushPenTouch(e: PartialComm_T<_.PenTouchEvent>) {
    _.write_PenTouchEvent({ reserved: 0, timestamp: 0n, ...e }, this.dt);
    this.push();
  }

  /**< SDL_EVENT_PEN_BUTTON_DOWN or SDL_EVENT_PEN_BUTTON_UP */
  get penButton(): _.PenButtonEvent {
    return _.read_PenButtonEvent(this.dt);
  }
  pushPenButton(e: PartialComm_T<_.PenButtonEvent>) {
    _.write_PenButtonEvent({ reserved: 0, timestamp: 0n, ...e }, this.dt);
    this.push();
  }

  /**< SDL_EVENT_PEN_AXIS */
  get penAxis(): _.PenAxisEvent {
    return _.read_PenAxisEvent(this.dt);
  }
  pushPenAxis(e: PartialCommon<_.PenAxisEvent>) {
    _.write_PenAxisEvent({ type: EventType.PEN_AXIS, reserved: 0, timestamp: 0n, ...e }, this.dt);
    this.push();
  }

  /**< SDL_EVENT_DROP_BEGIN or SDL_EVENT_DROP_FILE or SDL_EVENT_DROP_TEXT or SDL_EVENT_DROP_COMPLETE or SDL_EVENT_DROP_POSITION */
  get drop(): _.DropEvent {
    return _.read_DropEvent(this.dt);
  }
  pushDrop(e: PartialComm_T<_.DropEvent>) {
    _.write_DropEvent({ reserved: 0, timestamp: 0n, ...e }, this.dt);
    this.push();
  }

  /**< SDL_EVENT_CLIPBOARD_UPDATE */
  get clipboard(): _.ClipboardEvent {
    return _.read_ClipboardEvent(this.dt);
  }
  pushClipboard(e: PartialCommon<_.ClipboardEvent>) {
    _.write_ClipboardEvent({ type: EventType.CLIPBOARD_UPDATE, reserved: 0, timestamp: 0n, ...e }, this.dt);
    this.push();
  }

  /**< SDL_EVENT_SENSOR_UPDATE */
  get sensor(): _.SensorEvent {
    return _.read_SensorEvent(this.dt);
  }
  pushSensor(e: PartialCommon<_.SensorEvent>) {
    _.write_SensorEvent({ type: EventType.SENSOR_UPDATE, reserved: 0, timestamp: 0n, ...e }, this.dt);
    this.push();
  }

  /**< SDL_EVENT_QUIT */
  get quit(): _.QuitEvent {
    return _.read_QuitEvent(this.dt);
  }
  pushQuit(e: PartialCommon<_.QuitEvent>) {
    _.write_QuitEvent({ type: EventType.QUIT, reserved: 0, timestamp: 0n, ...e }, this.dt);
    this.push();
  }

  /**< SDL_EVENT_USER through SDL_EVENT_LAST, Uint32 because these are not in the SDL_EventType enumeration */
  get user(): _.UserEvent {
    return _.read_UserEvent(this.dt);
  }
  pushUser(e: PartialComm_T<_.UserEvent>) {
    _.write_UserEvent({ reserved: 0, timestamp: 0n, ...e }, this.dt);
    this.push();
  }

  abstract type: number;

  toObject(): _.CommonEvent {
    switch(this.type) {
    case EventType.QUIT: return this.quit;
    case EventType.DISPLAY_ORIENTATION: return this.display;
    case EventType.DISPLAY_ADDED: return this.display;
    case EventType.DISPLAY_REMOVED: return this.display;
    case EventType.DISPLAY_MOVED: return this.display;
    case EventType.DISPLAY_DESKTOP_MODE_CHANGED: return this.display;
    case EventType.DISPLAY_CURRENT_MODE_CHANGED: return this.display;
    case EventType.DISPLAY_CONTENT_SCALE_CHANGED: return this.display;
    case EventType.DISPLAY_USABLE_BOUNDS_CHANGED: return this.display;
    case EventType.WINDOW_SHOWN: return this.window;
    case EventType.WINDOW_HIDDEN: return this.window;
    case EventType.WINDOW_EXPOSED: return this.window;
    case EventType.WINDOW_MOVED: return this.window;
    case EventType.WINDOW_RESIZED: return this.window;
    case EventType.WINDOW_PIXEL_SIZE_CHANGED: return this.window;
    case EventType.WINDOW_METAL_VIEW_RESIZED: return this.window;
    case EventType.WINDOW_MINIMIZED: return this.window;
    case EventType.WINDOW_MAXIMIZED: return this.window;
    case EventType.WINDOW_RESTORED: return this.window;
    case EventType.WINDOW_MOUSE_ENTER: return this.window;
    case EventType.WINDOW_MOUSE_LEAVE: return this.window;
    case EventType.WINDOW_FOCUS_GAINED: return this.window;
    case EventType.WINDOW_FOCUS_LOST: return this.window;
    case EventType.WINDOW_CLOSE_REQUESTED: return this.window;
    case EventType.WINDOW_HIT_TEST: return this.window;
    case EventType.WINDOW_ICCPROF_CHANGED: return this.window;
    case EventType.WINDOW_DISPLAY_CHANGED: return this.window;
    case EventType.WINDOW_DISPLAY_SCALE_CHANGED: return this.window;
    case EventType.WINDOW_SAFE_AREA_CHANGED: return this.window;
    case EventType.WINDOW_OCCLUDED: return this.window;
    case EventType.WINDOW_ENTER_FULLSCREEN: return this.window;
    case EventType.WINDOW_LEAVE_FULLSCREEN: return this.window;
    case EventType.WINDOW_DESTROYED: return this.window;
    case EventType.WINDOW_HDR_STATE_CHANGED: return this.window;
    case EventType.KEY_DOWN: return this.keyboard;
    case EventType.KEY_UP: return this.keyboard;
    case EventType.TEXT_EDITING: return this.textEditing;
    case EventType.TEXT_INPUT: return this.textInput;
    case EventType.KEYBOARD_ADDED: return this.keyboardDevice;
    case EventType.KEYBOARD_REMOVED: return this.keyboardDevice;
    case EventType.TEXT_EDITING_CANDIDATES: return this.textEditingCandidates;
    case EventType.MOUSE_MOTION: return this.mouseMotion;
    case EventType.MOUSE_BUTTON_DOWN: return this.mouseButton;
    case EventType.MOUSE_BUTTON_UP: return this.mouseButton;
    case EventType.MOUSE_WHEEL: return this.mouseWheel;
    case EventType.MOUSE_ADDED: return this.mouseDevice;
    case EventType.MOUSE_REMOVED: return this.mouseDevice;
    case EventType.JOYSTICK_AXIS_MOTION: return this.joyAxis;
    case EventType.JOYSTICK_BALL_MOTION: return this.joyBall;
    case EventType.JOYSTICK_HAT_MOTION: return this.joyHat;
    case EventType.JOYSTICK_BUTTON_DOWN: return this.joyButton;
    case EventType.JOYSTICK_BUTTON_UP: return this.joyButton;
    case EventType.JOYSTICK_ADDED: return this.joyDevice;
    case EventType.JOYSTICK_REMOVED: return this.joyDevice;
    case EventType.JOYSTICK_BATTERY_UPDATED: return this.joyBattery;
    case EventType.JOYSTICK_UPDATE_COMPLETE: return this.joyDevice;
    case EventType.GAMEPAD_AXIS_MOTION: return this.gamepadAxis;
    case EventType.GAMEPAD_BUTTON_DOWN: return this.gamepadButton;
    case EventType.GAMEPAD_BUTTON_UP: return this.gamepadButton;
    case EventType.GAMEPAD_ADDED: return this.gamepadDevice;
    case EventType.GAMEPAD_REMOVED: return this.gamepadDevice;
    case EventType.GAMEPAD_REMAPPED: return this.gamepadDevice;
    case EventType.GAMEPAD_TOUCHPAD_DOWN: return this.gamepadTouchpad;
    case EventType.GAMEPAD_TOUCHPAD_MOTION: return this.gamepadTouchpad;
    case EventType.GAMEPAD_TOUCHPAD_UP: return this.gamepadTouchpad;
    case EventType.GAMEPAD_SENSOR_UPDATE: return this.gamepadSensor;
    case EventType.GAMEPAD_UPDATE_COMPLETE: return this.gamepadDevice;
    case EventType.GAMEPAD_STEAM_HANDLE_UPDATED: return this.gamepadDevice;
    case EventType.FINGER_DOWN: return this.touchFinger;
    case EventType.FINGER_UP: return this.touchFinger;
    case EventType.FINGER_MOTION: return this.touchFinger;
    case EventType.FINGER_CANCELED: return this.touchFinger;
    case EventType.PINCH_BEGIN: return this.pinchFinger;
    case EventType.PINCH_UPDATE: return this.pinchFinger;
    case EventType.PINCH_END: return this.pinchFinger;
    case EventType.CLIPBOARD_UPDATE: return this.clipboard;
    case EventType.DROP_FILE: return this.drop;
    case EventType.DROP_TEXT: return this.drop;
    case EventType.DROP_BEGIN: return this.drop;
    case EventType.DROP_COMPLETE: return this.drop;
    case EventType.DROP_POSITION: return this.drop;
    case EventType.AUDIO_DEVICE_ADDED: return this.audioDevice;
    case EventType.AUDIO_DEVICE_REMOVED: return this.audioDevice;
    case EventType.AUDIO_DEVICE_FORMAT_CHANGED: return this.audioDevice;
    case EventType.SENSOR_UPDATE: return this.sensor;
    case EventType.PEN_PROXIMITY_IN: return this.penProximity;
    case EventType.PEN_PROXIMITY_OUT: return this.penProximity;
    case EventType.PEN_DOWN: return this.penTouch;
    case EventType.PEN_UP: return this.penTouch;
    case EventType.PEN_BUTTON_DOWN: return this.penButton;
    case EventType.PEN_BUTTON_UP: return this.penButton;
    case EventType.PEN_MOTION: return this.penMotion;
    case EventType.PEN_AXIS: return this.penAxis;
    case EventType.CAMERA_DEVICE_ADDED: return this.cameraDevice;
    case EventType.CAMERA_DEVICE_REMOVED: return this.cameraDevice;
    case EventType.CAMERA_DEVICE_APPROVED: return this.cameraDevice;
    case EventType.CAMERA_DEVICE_DENIED: return this.cameraDevice;
    case EventType.RENDER_TARGETS_RESET: return this.render;
    case EventType.RENDER_DEVICE_RESET: return this.render;
    case EventType.RENDER_DEVICE_LOST: return this.render;
    case EventType.USER: return this.user;
    default: return (this.type >= EventType.USER && this.type <= EventType.LAST) ? this.user : this.common;
    }
  }
}
