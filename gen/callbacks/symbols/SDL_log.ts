/**
 * # CategoryLog
 *
 * Simple log messages with priorities and categories. A message's
 * SDL_LogPriority signifies how important the message is. A message's
 * SDL_LogCategory signifies from what domain it belongs to. Every category
 * has a minimum priority specified: when a message belongs to that category,
 * it will only be sent out if it has that minimum priority or higher.
 *
 * SDL's own logs are sent below the default priority threshold, so they are
 * quiet by default.
 *
 * You can change the log verbosity programmatically using
 * SDL_SetLogPriority() or with SDL_SetHint(SDL_HINT_LOGGING, ...), or with
 * the "SDL_LOGGING" environment variable. This variable is a comma separated
 * set of category=level tokens that define the default logging levels for SDL
 * applications.
 *
 * The category can be a numeric category, one of "app", "error", "assert",
 * "system", "audio", "video", "render", "input", "test", or `*` for any
 * unspecified category.
 *
 * The level can be a numeric level, one of "trace", "verbose", "debug",
 * "info", "warn", "error", "critical", or "quiet" to disable that category.
 *
 * You can omit the category if you want to set the logging level for all
 * categories.
 *
 * If this hint isn't set, the default log levels are equivalent to:
 *
 * `app=info,assert=warn,test=verbose,*=error`
 *
 * Here's where the messages go on different platforms:
 *
 * - Windows: debug output stream
 * - Android: log output
 * - Others: standard error output (stderr)
 *
 * You don't need to have a newline (`\n`) on the end of messages, the
 * functions will do that for you. For consistent behavior cross-platform, you
 * shouldn't have any newlines in messages, such as to log multiple lines in
 * one call; unusual platform-specific behavior can be observed in such usage.
 * Do one log call per line instead, with no newlines in messages.
 *
 * Each log call is atomic, so you won't see log messages cut off one another
 * when logging from multiple threads.
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
 * The prototype for the log output callback function.
 *
 * This function is called by SDL when there is new text to be logged. A mutex
 * is held so that this function is never called by more than one thread at
 * once.
 *
 * @param userdata what was passed as `userdata` to
 *                 SDL_SetLogOutputFunction().
 * @param category the category of the message.
 * @param priority the priority of the message.
 * @param message the message being output.
 *
 * @since This datatype is available since SDL 3.2.0.
 *
 * @from SDL_log.h:482 typedef void (*SDL_LogOutputFunction)(void *userdata, int category, SDL_LogPriority priority, const char *message);
 */
SDL_LogOutputFunction: {
      parameters: ["pointer", "i32", "u32", "pointer"],
      result: "void"
    },

} as const satisfies Deno.ForeignLibraryInterface;


/**
 * The prototype for the log output callback function.
 *
 * This function is called by SDL when there is new text to be logged. A mutex
 * is held so that this function is never called by more than one thread at
 * once.
 *
 * @param userdata what was passed as `userdata` to
 *                 SDL_SetLogOutputFunction().
 * @param category the category of the message.
 * @param priority the priority of the message.
 * @param message the message being output.
 *
 * @since This datatype is available since SDL 3.2.0.
 *
 * @from SDL_log.h:482 typedef void (*SDL_LogOutputFunction)(void *userdata, int category, SDL_LogPriority priority, const char *message);
 */
export function LogOutputFunction(cb: (
    userdata: Deno.PointerValue, 
    category: number, 
    priority: number, 
    message: Deno.PointerValue, 
  ) => void) {
  return new Deno.UnsafeCallback(symbols.SDL_LogOutputFunction, cb);
}

