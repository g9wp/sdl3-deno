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
 * Set the priority of all log categories.
 *
 * @param priority the SDL_LogPriority to assign.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_ResetLogPriorities
 * @sa SDL_SetLogPriority
 *
 * @from SDL_log.h:155 void SDL_SetLogPriorities(SDL_LogPriority priority);
 */
SDL_SetLogPriorities: {
      parameters: ["u32"],
      result: "void"
    },


/**
 * Set the priority of a particular log category.
 *
 * @param category the category to assign a priority to.
 * @param priority the SDL_LogPriority to assign.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetLogPriority
 * @sa SDL_ResetLogPriorities
 * @sa SDL_SetLogPriorities
 *
 * @from SDL_log.h:171 void SDL_SetLogPriority(int category, SDL_LogPriority priority);
 */
SDL_SetLogPriority: {
      parameters: ["i32", "u32"],
      result: "void"
    },


/**
 * Get the priority of a particular log category.
 *
 * @param category the category to query.
 * @returns the SDL_LogPriority for the requested category.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_SetLogPriority
 *
 * @from SDL_log.h:185 SDL_LogPriority SDL_GetLogPriority(int category);
 */
SDL_GetLogPriority: {
      parameters: ["i32"],
      result: "u32"
    },


/**
 * Reset all priorities to default.
 *
 * This is called by SDL_Quit().
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_SetLogPriorities
 * @sa SDL_SetLogPriority
 *
 * @from SDL_log.h:199 void SDL_ResetLogPriorities(void);
 */
SDL_ResetLogPriorities: {
      parameters: [],
      result: "void"
    },


/**
 * Set the text prepended to log messages of a given priority.
 *
 * By default SDL_LOG_PRIORITY_INFO and below have no prefix, and
 * SDL_LOG_PRIORITY_WARN and higher have a prefix showing their priority, e.g.
 * "WARNING: ".
 *
 * This function makes a copy of its string argument, **prefix**, so it is not
 * necessary to keep the value of **prefix** alive after the call returns.
 *
 * @param priority the SDL_LogPriority to modify.
 * @param prefix the prefix to use for that log priority, or NULL to use no
 *               prefix.
 * @returns true on success or false on failure; call SDL_GetError() for more
 *          information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_SetLogPriorities
 * @sa SDL_SetLogPriority
 *
 * @from SDL_log.h:224 bool SDL_SetLogPriorityPrefix(SDL_LogPriority priority, const char *prefix);
 */
SDL_SetLogPriorityPrefix: {
      parameters: ["u32", "pointer"],
      result: "bool"
    },


/**
 * Get the default log output function.
 *
 * @returns the default log output callback.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_SetLogOutputFunction
 * @sa SDL_GetLogOutputFunction
 *
 * @from SDL_log.h:498 SDL_LogOutputFunction SDL_GetDefaultLogOutputFunction(void);
 */
SDL_GetDefaultLogOutputFunction: {
      parameters: [],
      result: "function"
    },


/**
 * Get the current log output function.
 *
 * @param callback an SDL_LogOutputFunction filled in with the current log
 *                 callback.
 * @param userdata a pointer filled in with the pointer that is passed to
 *                 `callback`.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetDefaultLogOutputFunction
 * @sa SDL_SetLogOutputFunction
 *
 * @from SDL_log.h:515 void SDL_GetLogOutputFunction(SDL_LogOutputFunction *callback, void **userdata);
 */
SDL_GetLogOutputFunction: {
      parameters: ["pointer", "pointer"],
      result: "void"
    },


/**
 * Replace the default log output function with one of your own.
 *
 * @param callback an SDL_LogOutputFunction to call instead of the default.
 * @param userdata a pointer that is passed to `callback`.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetDefaultLogOutputFunction
 * @sa SDL_GetLogOutputFunction
 *
 * @from SDL_log.h:530 void SDL_SetLogOutputFunction(SDL_LogOutputFunction callback, void *userdata);
 */
SDL_SetLogOutputFunction: {
      parameters: ["function", "pointer"],
      result: "void"
    },

} as const satisfies Deno.ForeignLibraryInterface;
