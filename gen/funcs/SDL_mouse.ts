/**
 * # CategoryMouse
 *
 * Any GUI application has to deal with the mouse, and SDL provides functions
 * to manage mouse input and the displayed cursor.
 *
 * Most interactions with the mouse will come through the event subsystem.
 * Moving a mouse generates an SDL_EVENT_MOUSE_MOTION event, pushing a button
 * generates SDL_EVENT_MOUSE_BUTTON_DOWN, etc, but one can also query the
 * current state of the mouse at any time with SDL_GetMouseState().
 *
 * For certain games, it's useful to disassociate the mouse cursor from mouse
 * input. An FPS, for example, would not want the player's motion to stop as
 * the mouse hits the edge of the window. For these scenarios, use
 * SDL_SetWindowRelativeMouseMode(), which hides the cursor, grabs mouse input
 * to the window, and reads mouse input no matter how far it moves.
 *
 * Games that want the system to track the mouse but want to draw their own
 * cursor can use SDL_HideCursor() and SDL_ShowCursor(). It might be more
 * efficient to let the system manage the cursor, if possible, using
 * SDL_SetCursor() with a custom image made through SDL_CreateColorCursor(),
 * or perhaps just a specific system cursor from SDL_CreateSystemCursor().
 *
 * SDL can, on many platforms, differentiate between multiple connected mice,
 * allowing for interesting input scenarios and multiplayer games. They can be
 * enumerated with SDL_GetMice(), and SDL will send SDL_EVENT_MOUSE_ADDED and
 * SDL_EVENT_MOUSE_REMOVED events as they are connected and unplugged.
 *
 * Since many apps only care about basic mouse input, SDL offers a virtual
 * mouse device for touch and pen input, which often can make a desktop
 * application work on a touchscreen phone without any code changes. Apps that
 * care about touch/pen separately from mouse input should filter out events
 * with a `which` field of SDL_TOUCH_MOUSEID/SDL_PEN_MOUSEID.
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
 * Return whether a mouse is currently connected.
 *
 * @returns true if a mouse is connected, false otherwise.
 *
 * @threadsafety This function should only be called on the main thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetMice
 *
 * @from SDL_mouse.h:176 bool SDL_HasMouse(void);
 */
SDL_HasMouse: {
      parameters: [],
      result: "bool"
    },


/**
 * Get a list of currently connected mice.
 *
 * Note that this will include any device or virtual driver that includes
 * mouse functionality, including some game controllers, KVM switches, etc.
 * You should wait for input from a device before you consider it actively in
 * use.
 *
 * @param count a pointer filled in with the number of mice returned, may be
 *              NULL.
 * @returns a 0 terminated array of mouse instance IDs or NULL on failure;
 *          call SDL_GetError() for more information. This should be freed
 *          with SDL_free() when it is no longer needed.
 *
 * @threadsafety This function should only be called on the main thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetMouseNameForID
 * @sa SDL_HasMouse
 *
 * @from SDL_mouse.h:199 SDL_MouseID * SDL_GetMice(int *count);
 */
SDL_GetMice: {
      parameters: ["pointer"],
      result: "pointer"
    },


/**
 * Get the name of a mouse.
 *
 * This function returns "" if the mouse doesn't have a name.
 *
 * @param instance_id the mouse instance ID.
 * @returns the name of the selected mouse, or NULL on failure; call
 *          SDL_GetError() for more information.
 *
 * @threadsafety This function should only be called on the main thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetMice
 *
 * @from SDL_mouse.h:216 const char * SDL_GetMouseNameForID(SDL_MouseID instance_id);
 */
SDL_GetMouseNameForID: {
      parameters: ["u32"],
      result: "pointer"
    },


/**
 * Get the window which currently has mouse focus.
 *
 * @returns the window with mouse focus.
 *
 * @threadsafety This function should only be called on the main thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_mouse.h:227 SDL_Window * SDL_GetMouseFocus(void);
 */
SDL_GetMouseFocus: {
      parameters: [],
      result: "pointer"
    },


/**
 * Query SDL's cache for the synchronous mouse button state and the
 * window-relative SDL-cursor position.
 *
 * This function returns the cached synchronous state as SDL understands it
 * from the last pump of the event queue.
 *
 * To query the platform for immediate asynchronous state, use
 * SDL_GetGlobalMouseState.
 *
 * Passing non-NULL pointers to `x` or `y` will write the destination with
 * respective x or y coordinates relative to the focused window.
 *
 * In Relative Mode, the SDL-cursor's position usually contradicts the
 * platform-cursor's position as manually calculated from
 * SDL_GetGlobalMouseState() and SDL_GetWindowPosition.
 *
 * @param x a pointer to receive the SDL-cursor's x-position from the focused
 *          window's top left corner, can be NULL if unused.
 * @param y a pointer to receive the SDL-cursor's y-position from the focused
 *          window's top left corner, can be NULL if unused.
 * @returns a 32-bit bitmask of the button state that can be bitwise-compared
 *          against the SDL_BUTTON_MASK(X) macro.
 *
 * @threadsafety This function should only be called on the main thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetGlobalMouseState
 * @sa SDL_GetRelativeMouseState
 *
 * @from SDL_mouse.h:260 SDL_MouseButtonFlags SDL_GetMouseState(float *x, float *y);
 */
SDL_GetMouseState: {
      parameters: ["pointer", "pointer"],
      result: "u32"
    },


/**
 * Query the platform for the asynchronous mouse button state and the
 * desktop-relative platform-cursor position.
 *
 * This function immediately queries the platform for the most recent
 * asynchronous state, more costly than retrieving SDL's cached state in
 * SDL_GetMouseState().
 *
 * Passing non-NULL pointers to `x` or `y` will write the destination with
 * respective x or y coordinates relative to the desktop.
 *
 * In Relative Mode, the platform-cursor's position usually contradicts the
 * SDL-cursor's position as manually calculated from SDL_GetMouseState() and
 * SDL_GetWindowPosition.
 *
 * This function can be useful if you need to track the mouse outside of a
 * specific window and SDL_CaptureMouse() doesn't fit your needs. For example,
 * it could be useful if you need to track the mouse while dragging a window,
 * where coordinates relative to a window might not be in sync at all times.
 *
 * @param x a pointer to receive the platform-cursor's x-position from the
 *          desktop's top left corner, can be NULL if unused.
 * @param y a pointer to receive the platform-cursor's y-position from the
 *          desktop's top left corner, can be NULL if unused.
 * @returns a 32-bit bitmask of the button state that can be bitwise-compared
 *          against the SDL_BUTTON_MASK(X) macro.
 *
 * @threadsafety This function should only be called on the main thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_CaptureMouse
 * @sa SDL_GetMouseState
 * @sa SDL_GetGlobalMouseState
 *
 * @from SDL_mouse.h:297 SDL_MouseButtonFlags SDL_GetGlobalMouseState(float *x, float *y);
 */
SDL_GetGlobalMouseState: {
      parameters: ["pointer", "pointer"],
      result: "u32"
    },


/**
 * Query SDL's cache for the synchronous mouse button state and accumulated
 * mouse delta since last call.
 *
 * This function returns the cached synchronous state as SDL understands it
 * from the last pump of the event queue.
 *
 * To query the platform for immediate asynchronous state, use
 * SDL_GetGlobalMouseState.
 *
 * Passing non-NULL pointers to `x` or `y` will write the destination with
 * respective x or y deltas accumulated since the last call to this function
 * (or since event initialization).
 *
 * This function is useful for reducing overhead by processing relative mouse
 * inputs in one go per-frame instead of individually per-event, at the
 * expense of losing the order between events within the frame (e.g. quickly
 * pressing and releasing a button within the same frame).
 *
 * @param x a pointer to receive the x mouse delta accumulated since last
 *          call, can be NULL if unused.
 * @param y a pointer to receive the y mouse delta accumulated since last
 *          call, can be NULL if unused.
 * @returns a 32-bit bitmask of the button state that can be bitwise-compared
 *          against the SDL_BUTTON_MASK(X) macro.
 *
 * @threadsafety This function should only be called on the main thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetMouseState
 * @sa SDL_GetGlobalMouseState
 *
 * @from SDL_mouse.h:332 SDL_MouseButtonFlags SDL_GetRelativeMouseState(float *x, float *y);
 */
SDL_GetRelativeMouseState: {
      parameters: ["pointer", "pointer"],
      result: "u32"
    },


/**
 * Move the mouse cursor to the given position within the window.
 *
 * This function generates a mouse motion event if relative mode is not
 * enabled. If relative mode is enabled, you can force mouse events for the
 * warp by setting the SDL_HINT_MOUSE_RELATIVE_WARP_MOTION hint.
 *
 * Note that this function will appear to succeed, but not actually move the
 * mouse when used over Microsoft Remote Desktop.
 *
 * @param window the window to move the mouse into, or NULL for the current
 *               mouse focus.
 * @param x the x coordinate within the window.
 * @param y the y coordinate within the window.
 *
 * @threadsafety This function should only be called on the main thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_WarpMouseGlobal
 *
 * @from SDL_mouse.h:355 void SDL_WarpMouseInWindow(SDL_Window *window, float x, float y);
 */
SDL_WarpMouseInWindow: {
      parameters: ["pointer", "f32", "f32"],
      result: "void"
    },


/**
 * Move the mouse to the given position in global screen space.
 *
 * This function generates a mouse motion event.
 *
 * A failure of this function usually means that it is unsupported by a
 * platform.
 *
 * Note that this function will appear to succeed, but not actually move the
 * mouse when used over Microsoft Remote Desktop.
 *
 * @param x the x coordinate.
 * @param y the y coordinate.
 * @returns true on success or false on failure; call SDL_GetError() for more
 *          information.
 *
 * @threadsafety This function should only be called on the main thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_WarpMouseInWindow
 *
 * @from SDL_mouse.h:380 bool SDL_WarpMouseGlobal(float x, float y);
 */
SDL_WarpMouseGlobal: {
      parameters: ["f32", "f32"],
      result: "bool"
    },


/**
 * Set relative mouse mode for a window.
 *
 * While the window has focus and relative mouse mode is enabled, the cursor
 * is hidden, the mouse position is constrained to the window, and SDL will
 * report continuous relative mouse motion even if the mouse is at the edge of
 * the window.
 *
 * If you'd like to keep the mouse position fixed while in relative mode you
 * can use SDL_SetWindowMouseRect(). If you'd like the cursor to be at a
 * specific location when relative mode ends, you should use
 * SDL_WarpMouseInWindow() before disabling relative mode.
 *
 * This function will flush any pending mouse motion for this window.
 *
 * @param window the window to change.
 * @param enabled true to enable relative mode, false to disable.
 * @returns true on success or false on failure; call SDL_GetError() for more
 *          information.
 *
 * @threadsafety This function should only be called on the main thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetWindowRelativeMouseMode
 *
 * @from SDL_mouse.h:408 bool SDL_SetWindowRelativeMouseMode(SDL_Window *window, bool enabled);
 */
SDL_SetWindowRelativeMouseMode: {
      parameters: ["pointer", "bool"],
      result: "bool"
    },


/**
 * Query whether relative mouse mode is enabled for a window.
 *
 * @param window the window to query.
 * @returns true if relative mode is enabled for a window or false otherwise.
 *
 * @threadsafety This function should only be called on the main thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_SetWindowRelativeMouseMode
 *
 * @from SDL_mouse.h:422 bool SDL_GetWindowRelativeMouseMode(SDL_Window *window);
 */
SDL_GetWindowRelativeMouseMode: {
      parameters: ["pointer"],
      result: "bool"
    },


/**
 * Capture the mouse and to track input outside an SDL window.
 *
 * Capturing enables your app to obtain mouse events globally, instead of just
 * within your window. Not all video targets support this function. When
 * capturing is enabled, the current window will get all mouse events, but
 * unlike relative mode, no change is made to the cursor and it is not
 * restrained to your window.
 *
 * This function may also deny mouse input to other windows--both those in
 * your application and others on the system--so you should use this function
 * sparingly, and in small bursts. For example, you might want to track the
 * mouse while the user is dragging something, until the user releases a mouse
 * button. It is not recommended that you capture the mouse for long periods
 * of time, such as the entire time your app is running. For that, you should
 * probably use SDL_SetWindowRelativeMouseMode() or SDL_SetWindowMouseGrab(),
 * depending on your goals.
 *
 * While captured, mouse events still report coordinates relative to the
 * current (foreground) window, but those coordinates may be outside the
 * bounds of the window (including negative values). Capturing is only allowed
 * for the foreground window. If the window loses focus while capturing, the
 * capture will be disabled automatically.
 *
 * While capturing is enabled, the current window will have the
 * `SDL_WINDOW_MOUSE_CAPTURE` flag set.
 *
 * Please note that SDL will attempt to "auto capture" the mouse while the
 * user is pressing a button; this is to try and make mouse behavior more
 * consistent between platforms, and deal with the common case of a user
 * dragging the mouse outside of the window. This means that if you are
 * calling SDL_CaptureMouse() only to deal with this situation, you do not
 * have to (although it is safe to do so). If this causes problems for your
 * app, you can disable auto capture by setting the
 * `SDL_HINT_MOUSE_AUTO_CAPTURE` hint to zero.
 *
 * @param enabled true to enable capturing, false to disable.
 * @returns true on success or false on failure; call SDL_GetError() for more
 *          information.
 *
 * @threadsafety This function should only be called on the main thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetGlobalMouseState
 *
 * @from SDL_mouse.h:470 bool SDL_CaptureMouse(bool enabled);
 */
SDL_CaptureMouse: {
      parameters: ["bool"],
      result: "bool"
    },


/**
 * Create a cursor using the specified bitmap data and mask (in MSB format).
 *
 * `mask` has to be in MSB (Most Significant Bit) format.
 *
 * The cursor width (`w`) must be a multiple of 8 bits.
 *
 * The cursor is created in black and white according to the following:
 *
 * - data=0, mask=1: white
 * - data=1, mask=1: black
 * - data=0, mask=0: transparent
 * - data=1, mask=0: inverted color if possible, black if not.
 *
 * Cursors created with this function must be freed with SDL_DestroyCursor().
 *
 * If you want to have a color cursor, or create your cursor from an
 * SDL_Surface, you should use SDL_CreateColorCursor(). Alternately, you can
 * hide the cursor and draw your own as part of your game's rendering, but it
 * will be bound to the framerate.
 *
 * Also, SDL_CreateSystemCursor() is available, which provides several
 * readily-available system cursors to pick from.
 *
 * @param data the color value for each pixel of the cursor.
 * @param mask the mask value for each pixel of the cursor.
 * @param w the width of the cursor.
 * @param h the height of the cursor.
 * @param hot_x the x-axis offset from the left of the cursor image to the
 *              mouse x position, in the range of 0 to `w` - 1.
 * @param hot_y the y-axis offset from the top of the cursor image to the
 *              mouse y position, in the range of 0 to `h` - 1.
 * @returns a new cursor with the specified parameters on success or NULL on
 *          failure; call SDL_GetError() for more information.
 *
 * @threadsafety This function should only be called on the main thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_CreateColorCursor
 * @sa SDL_CreateSystemCursor
 * @sa SDL_DestroyCursor
 * @sa SDL_SetCursor
 *
 * @from SDL_mouse.h:516 SDL_Cursor * SDL_CreateCursor(const Uint8 *data, const Uint8 *mask, int w, int h, int hot_x, int hot_y);
 */
SDL_CreateCursor: {
      parameters: ["pointer", "pointer", "i32", "i32", "i32", "i32"],
      result: "pointer"
    },


/**
 * Create a color cursor.
 *
 * If this function is passed a surface with alternate representations, the
 * surface will be interpreted as the content to be used for 100% display
 * scale, and the alternate representations will be used for high DPI
 * situations. For example, if the original surface is 32x32, then on a 2x
 * macOS display or 200% display scale on Windows, a 64x64 version of the
 * image will be used, if available. If a matching version of the image isn't
 * available, the closest larger size image will be downscaled to the
 * appropriate size and be used instead, if available. Otherwise, the closest
 * smaller image will be upscaled and be used instead.
 *
 * @param surface an SDL_Surface structure representing the cursor image.
 * @param hot_x the x position of the cursor hot spot.
 * @param hot_y the y position of the cursor hot spot.
 * @returns the new cursor on success or NULL on failure; call SDL_GetError()
 *          for more information.
 *
 * @threadsafety This function should only be called on the main thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_CreateCursor
 * @sa SDL_CreateSystemCursor
 * @sa SDL_DestroyCursor
 * @sa SDL_SetCursor
 *
 * @from SDL_mouse.h:549 SDL_Cursor * SDL_CreateColorCursor(SDL_Surface *surface, int hot_x, int hot_y);
 */
SDL_CreateColorCursor: {
      parameters: ["pointer", "i32", "i32"],
      result: "pointer"
    },


/**
 * Create a system cursor.
 *
 * @param id an SDL_SystemCursor enum value.
 * @returns a cursor on success or NULL on failure; call SDL_GetError() for
 *          more information.
 *
 * @threadsafety This function should only be called on the main thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_DestroyCursor
 *
 * @from SDL_mouse.h:566 SDL_Cursor * SDL_CreateSystemCursor(SDL_SystemCursor id);
 */
SDL_CreateSystemCursor: {
      parameters: ["u32"],
      result: "pointer"
    },


/**
 * Set the active cursor.
 *
 * This function sets the currently active cursor to the specified one. If the
 * cursor is currently visible, the change will be immediately represented on
 * the display. SDL_SetCursor(NULL) can be used to force cursor redraw, if
 * this is desired for any reason.
 *
 * @param cursor a cursor to make active.
 * @returns true on success or false on failure; call SDL_GetError() for more
 *          information.
 *
 * @threadsafety This function should only be called on the main thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetCursor
 *
 * @from SDL_mouse.h:586 bool SDL_SetCursor(SDL_Cursor *cursor);
 */
SDL_SetCursor: {
      parameters: ["pointer"],
      result: "bool"
    },


/**
 * Get the active cursor.
 *
 * This function returns a pointer to the current cursor which is owned by the
 * library. It is not necessary to free the cursor with SDL_DestroyCursor().
 *
 * @returns the active cursor or NULL if there is no mouse.
 *
 * @threadsafety This function should only be called on the main thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_SetCursor
 *
 * @from SDL_mouse.h:602 SDL_Cursor * SDL_GetCursor(void);
 */
SDL_GetCursor: {
      parameters: [],
      result: "pointer"
    },


/**
 * Get the default cursor.
 *
 * You do not have to call SDL_DestroyCursor() on the return value, but it is
 * safe to do so.
 *
 * @returns the default cursor on success or NULL on failuree; call
 *          SDL_GetError() for more information.
 *
 * @threadsafety This function should only be called on the main thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_mouse.h:617 SDL_Cursor * SDL_GetDefaultCursor(void);
 */
SDL_GetDefaultCursor: {
      parameters: [],
      result: "pointer"
    },


/**
 * Free a previously-created cursor.
 *
 * Use this function to free cursor resources created with SDL_CreateCursor(),
 * SDL_CreateColorCursor() or SDL_CreateSystemCursor().
 *
 * @param cursor the cursor to free.
 *
 * @threadsafety This function should only be called on the main thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_CreateColorCursor
 * @sa SDL_CreateCursor
 * @sa SDL_CreateSystemCursor
 *
 * @from SDL_mouse.h:635 void SDL_DestroyCursor(SDL_Cursor *cursor);
 */
SDL_DestroyCursor: {
      parameters: ["pointer"],
      result: "void"
    },


/**
 * Show the cursor.
 *
 * @returns true on success or false on failure; call SDL_GetError() for more
 *          information.
 *
 * @threadsafety This function should only be called on the main thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_CursorVisible
 * @sa SDL_HideCursor
 *
 * @from SDL_mouse.h:650 bool SDL_ShowCursor(void);
 */
SDL_ShowCursor: {
      parameters: [],
      result: "bool"
    },


/**
 * Hide the cursor.
 *
 * @returns true on success or false on failure; call SDL_GetError() for more
 *          information.
 *
 * @threadsafety This function should only be called on the main thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_CursorVisible
 * @sa SDL_ShowCursor
 *
 * @from SDL_mouse.h:665 bool SDL_HideCursor(void);
 */
SDL_HideCursor: {
      parameters: [],
      result: "bool"
    },


/**
 * Return whether the cursor is currently being shown.
 *
 * @returns `true` if the cursor is being shown, or `false` if the cursor is
 *          hidden.
 *
 * @threadsafety This function should only be called on the main thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_HideCursor
 * @sa SDL_ShowCursor
 *
 * @from SDL_mouse.h:680 bool SDL_CursorVisible(void);
 */
SDL_CursorVisible: {
      parameters: [],
      result: "bool"
    },

} as const satisfies Deno.ForeignLibraryInterface;
