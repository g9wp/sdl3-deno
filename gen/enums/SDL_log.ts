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
  Copyright (C) 1997-2026 Sam Lantinga <slouken@libsdl.org>

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
 * The predefined log categories
 *
 * By default the application and gpu categories are enabled at the INFO
 * level, the assert category is enabled at the WARN level, test is enabled at
 * the VERBOSE level and all other categories are enabled at the ERROR level.
 *
 * @since This enum is available since SDL 3.2.0.
 *
 * @from SDL_log.h:89 SDL_LOG_CATEGORY_
 */
export enum SDL_LogCategory {
  APPLICATION, 
  ERROR, 
  ASSERT, 
  SYSTEM, 
  AUDIO, 
  VIDEO, 
  RENDER, 
  INPUT, 
  TEST, 
  GPU, 
    /* Reserved for future SDL library use */
  RESERVED2, 
  RESERVED3, 
  RESERVED4, 
  RESERVED5, 
  RESERVED6, 
  RESERVED7, 
  RESERVED8, 
  RESERVED9, 
  RESERVED10, 
    /* Beyond this point is reserved for application use, e.g.
       enum {
           MYAPP_CATEGORY_AWESOME1 = SDL_LOG_CATEGORY_CUSTOM,
           MYAPP_CATEGORY_AWESOME2,
           MYAPP_CATEGORY_AWESOME3,
           ...
       };
     */
  CUSTOM, 
}



/**
 * The predefined log priorities
 *
 * @since This enum is available since SDL 3.2.0.
 *
 * @from SDL_log.h:129 SDL_LOG_PRIORITY_
 */
export enum SDL_LogPriority {
  INVALID, 
  TRACE, 
  VERBOSE, 
  DEBUG, 
  INFO, 
  WARN, 
  ERROR, 
  CRITICAL, 
  COUNT, 
}



