/**
 * # CategoryAssert
 *
 * A helpful assertion macro!
 *
 * SDL assertions operate like your usual `assert` macro, but with some added
 * features:
 *
 * - It uses a trick with the `sizeof` operator, so disabled assertions
 *   vaporize out of the compiled code, but variables only referenced in the
 *   assertion won't trigger compiler warnings about being unused.
 * - It is safe to use with a dangling-else: `if (x) SDL_assert(y); else
 *   do_something();`
 * - It works the same everywhere, instead of counting on various platforms'
 *   compiler and C runtime to behave.
 * - It provides multiple levels of assertion (SDL_assert, SDL_assert_release,
 *   SDL_assert_paranoid) instead of a single all-or-nothing option.
 * - It offers a variety of responses when an assertion fails (retry, trigger
 *   the debugger, abort the program, ignore the failure once, ignore it for
 *   the rest of the program's run).
 * - It tries to show the user a dialog by default, if possible, but the app
 *   can provide a callback to handle assertion failures however they like.
 * - It lets failed assertions be retried. Perhaps you had a network failure
 *   and just want to retry the test after plugging your network cable back
 *   in? You can.
 * - It lets the user ignore an assertion failure, if there's a harmless
 *   problem that one can continue past.
 * - It lets the user mark an assertion as ignored for the rest of the
 *   program's run; if there's a harmless problem that keeps popping up.
 * - It provides statistics and data on all failed assertions to the app.
 * - It allows the default assertion handler to be controlled with environment
 *   variables, in case an automated script needs to control it.
 * - It can be used as an aid to Clang's static analysis; it will treat SDL
 *   assertions as universally true (under the assumption that you are serious
 *   about the asserted claims and that your debug builds will detect when
 *   these claims were wrong). This can help the analyzer avoid false
 *   positives.
 *
 * To use it: compile a debug build and just sprinkle around tests to check
 * your code!
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

import { lib } from "./lib.ts";

export {
  SDL_AssertState as ASSERTION,
} from "../enums/SDL_assert.ts"

/**
 * Never call this directly.
 *
 * Use the SDL_assert macros instead.
 *
 * @param data assert data structure.
 * @param func function name.
 * @param file file name.
 * @param line line number.
 * @returns assert state.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_assert.h:314 SDL_AssertState SDL_ReportAssertion(SDL_AssertData *data, const char *func, const char *file, int line) SDL_ANALYZER_NORETURN;
 */
export const reportAssertion = lib.symbols.SDL_ReportAssertion;

/**
 * Get a list of all assertion failures.
 *
 * This function gets all assertions triggered since the last call to
 * SDL_ResetAssertionReport(), or the start of the program.
 *
 * The proper way to examine this data looks something like this:
 *
 * ```c
 * const SDL_AssertData *item = SDL_GetAssertionReport();
 * while (item) {
 *    printf("'%s', %s (%s:%d), triggered %u times, always ignore: %s.\\n",
 *           item->condition, item->function, item->filename,
 *           item->linenum, item->trigger_count,
 *           item->always_ignore ? "yes" : "no");
 *    item = item->next;
 * }
 * ```
 *
 * @returns a list of all failed assertions or NULL if the list is empty. This
 *          memory should not be modified or freed by the application. This
 *          pointer remains valid until the next call to SDL_Quit() or
 *          SDL_ResetAssertionReport().
 *
 * @threadsafety This function is not thread safe. Other threads calling
 *               SDL_ResetAssertionReport() simultaneously, may render the
 *               returned pointer invalid.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_ResetAssertionReport
 *
 * @from SDL_assert.h:635 const SDL_AssertData * SDL_GetAssertionReport(void);
 */
export const getAssertionReport = lib.symbols.SDL_GetAssertionReport;

/**
 * Clear the list of all assertion failures.
 *
 * This function will clear the list of all assertions triggered up to that
 * point. Immediately following this call, SDL_GetAssertionReport will return
 * no items. In addition, any previously-triggered assertions will be reset to
 * a trigger_count of zero, and their always_ignore state will be false.
 *
 * @threadsafety This function is not thread safe. Other threads triggering an
 *               assertion, or simultaneously calling this function may cause
 *               memory leaks or crashes.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetAssertionReport
 *
 * @from SDL_assert.h:653 void SDL_ResetAssertionReport(void);
 */
export const resetAssertionReport = lib.symbols.SDL_ResetAssertionReport;

