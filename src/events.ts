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

import { EventType, EventUnion } from "../gen/events.ts";
export { EventType };

import * as SDL from "../gen/sdl/events.ts";

/**
 * Represents an SDL event with methods to poll, push, and access various event types.
 *
 * The Event class provides a wrapper around SDL's event system, allowing for
 * easy polling of events from the queue and pushing new events. It maintains
 * an internal buffer for event data and provides typed accessors for all
 * supported SDL event types.
 *
 * @example
 * ```ts
 * for await (const event of Event.iter(frameInterval, () => {
 *     // update game state, draw the current frame
 *   })
 * ) {
 *   // decide what to do with this event.
 *   if (event.type === EventType.QUIT) {
 *     handleQuitEvent(event.quit);
 *   }
 * }
 * ```
 * ```ts
 * setInterval(() => {
 *     const event = new Event();
 *     while (event.poll()) {  // poll until all events are handled!
 *         // decide what to do with this event.
 *         if (event.type === EventType.QUIT) {
 *             handleQuitEvent(event.quit);
 *         }
 *     }
 *
 *     // update game state, draw the current frame
 *
 * }, frameInterval);
 * ```
 */
export class Event extends EventUnion {
  #buffer: Uint8Array = new Uint8Array(128);
  get pointer(): Deno.PointerObject {
    return Deno.UnsafePointer.of(this.#buffer)!;
  }

  type: number =
    0; /**< Uint32: Event type, shared with all events, Uint32 to cover user events which are not in the SDL_EventType enumeration */

  //timestamp: bigint = 0n; /**< Uint64: In nanoseconds, populated using SDL_GetTicksNS() */

  override get dt(): DataView {
    return new DataView(this.#buffer.buffer);
  }

  /**
   * Asynchronously iterate over events at a specified interval.
   *
   * This method provides an asynchronous generator that yields events from the
   * event queue at a configurable interval. It is designed to simplify event
   * handling in applications, allowing for efficient polling of events without
   * blocking the main thread.
   *
   * The `interval` parameter specifies the time in milliseconds between each
   * iteration. By default, it is set to approximately 60 iterations per second
   * (1000 / 60 ms). If provided, the `onIdle` callback will be invoked when no
   * events are available during an iteration.
   *
   * The iterator stops yielding events if a `QUIT` event is encountered, ensuring
   * that the application can gracefully handle shutdown requests.
   *
   * @example
   * ```ts
   * for await (const event of Event.iter(1000 / 60, drawFrame)) {
   *     if (event.type === EventType.QUIT) {
   *         console.log("Quit event received, shutting down...");
   *         break;
   *     }
   *     // Handle other event types
   * }
   * ```
   *
   * @param interval The interval in milliseconds between iterations. Defaults to
   *                 1000 / 60 (~60 FPS).
   * @param onIdle An optional callback to invoke when no events are available.
   * @yields The next event from the event queue.
   */
  async *iter(
    interval: number = 1000 / 60,
    onIdle?: () => void,
  ): AsyncGenerator<Event> {
    let nextFrame = Date.now() + interval;
    while (true) {
      while (this.poll()) {
        const quit = this.type === EventType.QUIT;
        yield this;
        if (quit) return;
      }

      if (onIdle) onIdle();

      const now = Date.now();
      const remaining = nextFrame - now;
      nextFrame += interval;
      await new Promise((resolve) =>
        setTimeout(resolve, remaining > 0 ? remaining : 0)
      );
    }
  }

  static iter(
    interval: number = 1000 / 60,
    onIdle?: () => void,
  ): AsyncGenerator<Event> {
    return new Event().iter(interval, onIdle);
  }

  /**
   * Poll for currently pending events.
   *
   * If `event` is not NULL, the next event is removed from the queue and stored
   * in the SDL_Event structure pointed to by `event`. The 1 returned refers to
   * this event, immediately stored in the SDL Event structure -- not an event
   * to follow.
   *
   * If `event` is NULL, it simply returns 1 if there is an event in the queue,
   * but will not remove it from the queue.
   *
   * As this function may implicitly call SDL_PumpEvents(), you can only call
   * this function in the thread that set the video mode.
   *
   * SDL_PollEvent() is the favored way of receiving system events since it can
   * be done from the main loop and does not suspend the main loop while waiting
   * on an event to be posted.
   *
   * The common practice is to fully process the event queue once every frame,
   * usually as a first step before updating the game's state:
   *
   * ```ts
   * setInterval(() => {
   *     const event = new Event();
   *     while (event.poll()) {  // poll until all events are handled!
   *         // decide what to do with this event.
   *         if (event.type === EventType.QUIT) {
   *             handleQuitEvent(event.quit);
   *         }
   *     }
   *
   *     // update game state, draw the current frame
   *
   * }, frameInterval);
   * ```
   *
   * @returns true if this got an event or false if there are none available.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_PushEvent
   * @sa SDL_WaitEvent
   * @sa SDL_WaitEventTimeout
   *
   * @from SDL_events.h:1267 bool SDL_PollEvent(SDL_Event *event);
   */
  poll(): boolean {
    return SDL.pollEvent(this.pointer) && this.readType_();
  }

  private readType_(): true {
    const view = new Deno.UnsafePointerView(this.pointer);
    this.type = view.getUint32(0);
    return true;
  }

  /**
   * Wait indefinitely for the next available event.
   *
   * If `event` is not NULL, the next event is removed from the queue and stored
   * in the SDL_Event structure pointed to by `event`.
   *
   * As this function may implicitly call SDL_PumpEvents(), you can only call
   * this function in the thread that initialized the video subsystem.
   *
   * @param event the SDL_Event structure to be filled in with the next event
   *              from the queue, or NULL.
   * @returns true on success or false if there was an error while waiting for
   *          events; call SDL_GetError() for more information.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_PollEvent
   * @sa SDL_PushEvent
   * @sa SDL_WaitEventTimeout
   *
   * @from SDL_events.h:1291 bool SDL_WaitEvent(SDL_Event *event);
   */
  wait(): boolean {
    return SDL.waitEvent(this.pointer) && this.readType_();
  }

  /**
   * Wait until the specified timeout (in milliseconds) for the next available
   * event.
   *
   * If `event` is not NULL, the next event is removed from the queue and stored
   * in the SDL_Event structure pointed to by `event`.
   *
   * As this function may implicitly call SDL_PumpEvents(), you can only call
   * this function in the thread that initialized the video subsystem.
   *
   * The timeout is not guaranteed, the actual wait time could be longer due to
   * system scheduling.
   *
   * @param event the SDL_Event structure to be filled in with the next event
   *              from the queue, or NULL.
   * @param timeoutMS the maximum number of milliseconds to wait for the next
   *                  available event.
   * @returns true if this got an event or false if the timeout elapsed without
   *          any events available.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_PollEvent
   * @sa SDL_PushEvent
   * @sa SDL_WaitEvent
   *
   * @from SDL_events.h:1321 bool SDL_WaitEventTimeout(SDL_Event *event, Sint32 timeoutMS);
   */
  waitTimeout(timeoutMS: number): boolean {
    return SDL.waitEventTimeout(this.pointer, timeoutMS) && this.readType_();
  }

  /**
   * Pump the event loop, gathering events from the input devices.
   *
   * This function updates the event queue and internal input device state.
   *
   * SDL_PumpEvents() gathers all the pending input information from devices and
   * places it in the event queue. Without calls to SDL_PumpEvents() no events
   * would ever be placed on the queue. Often the need for calls to
   * SDL_PumpEvents() is hidden from the user since SDL_PollEvent() and
   * SDL_WaitEvent() implicitly call SDL_PumpEvents(). However, if you are not
   * polling or waiting for events (e.g. you are filtering them), then you must
   * call SDL_PumpEvents() to force an event queue update.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_PollEvent
   * @sa SDL_WaitEvent
   *
   * @from SDL_events.h:1068 void SDL_PumpEvents(void);
   */
  static pump() {
    SDL.pumpEvents();
  }

  /**
   * Add an event to the event queue.
   *
   * The event queue can actually be used as a two way communication channel.
   * Not only can events be read from the queue, but the user can also push
   * their own events onto it. `event` is a pointer to the event structure you
   * wish to push onto the queue. The event is copied into the queue, and the
   * caller may dispose of the memory pointed to after SDL_PushEvent() returns.
   *
   * Note: Pushing device input events onto the queue doesn't modify the state
   * of the device within SDL.
   *
   * Note: Events pushed onto the queue with SDL_PushEvent() get passed through
   * the event filter but events added with SDL_PeepEvents() do not.
   *
   * For pushing application-specific events, please use SDL_RegisterEvents() to
   * get an event type that does not conflict with other code that also wants
   * its own custom event types.
   *
   * @param event the SDL_Event to be added to the queue.
   * @returns true on success, false if the event was filtered or on failure;
   *          call SDL_GetError() for more information. A common reason for
   *          error is the event queue being full.
   *
   * @threadsafety It is safe to call this function from any thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_PeepEvents
   * @sa SDL_PollEvent
   * @sa SDL_RegisterEvents
   *
   * @from SDL_events.h:1355 bool SDL_PushEvent(SDL_Event *event);
   */
  override push(): boolean {
    return SDL.pushEvent(this.pointer);
  }
}
