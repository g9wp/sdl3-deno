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

import * as _ from "../_utils.ts";
import * as _b from "../_structs/SDL_assert.ts";


/**
 * Information about an assertion failure.
 *
 * This structure is filled in with information about a triggered assertion,
 * used by the assertion handler, then added to the assertion report. This is
 * returned as a linked list from SDL_GetAssertionReport().
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @from SDL_assert.h:288
 */
export interface AssertData {
  always_ignore: boolean; /**< bool : true if app should always continue when assertion is triggered. */
  trigger_count: number; /**< unsigned int : Number of times this assertion has been triggered. */
  condition: Deno.PointerValue; /**< const char * : A string of this assert's test code. */
  filename: Deno.PointerValue; /**< const char * : The source file where this assert lives. */
  linenum: number; /**< int : The line in `filename` where this assert lives. */
  function: Deno.PointerValue; /**< const char * : The name of the function where this assert lives. */
  next: Deno.PointerValue; /**< const struct SDL_AssertData * : next item in the linked list. */
}

export function read_AssertData(dt: DataView): AssertData {
  const t = _b.SDL_AssertData.read(dt);
  return {
    always_ignore: t.always_ignore, /** bool */
    trigger_count: t.trigger_count, /** unsigned int */
    condition: _.read_cstr_v(t.condition), /** const char * */
    filename: _.read_cstr_v(t.filename), /** const char * */
    linenum: t.linenum, /** int */
    function: _.read_cstr_v(t.function), /** const char * */
    next: Deno.UnsafePointer.create(t.next), /** const struct SDL_AssertData * */
  };
}

export function write_AssertData(t: AssertData, dt: DataView) {
  _b.SDL_AssertData.write({
    always_ignore: t.always_ignore, /** bool */
    trigger_count: t.trigger_count, /** unsigned int */
    condition: _.cstr_v(t.condition), /** const char * */
    filename: _.cstr_v(t.filename), /** const char * */
    linenum: t.linenum, /** int */
    function: _.cstr_v(t.function), /** const char * */
    next: Deno.UnsafePointer.value(t.next), /** const struct SDL_AssertData * */
  }, dt);
}


