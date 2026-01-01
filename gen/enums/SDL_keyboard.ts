/**
 * # CategoryKeyboard
 *
 * SDL keyboard management.
 *
 * Please refer to the Best Keyboard Practices document for details on how
 * best to accept keyboard input in various types of programs:
 *
 * https://wiki.libsdl.org/SDL3/BestKeyboardPractices
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
 * @from SDL_keyboard:474 SDL_PROP_TEXTINPUT_
 */
export enum PROP_TEXTINPUT {
  TYPE_NUMBER = "SDL.textinput.type", 
  CAPITALIZATION_NUMBER = "SDL.textinput.capitalization", 
  AUTOCORRECT_BOOLEAN = "SDL.textinput.autocorrect", 
  MULTILINE_BOOLEAN = "SDL.textinput.multiline", 
  ANDROID_INPUTTYPE_NUMBER = "SDL.textinput.android.inputtype", 
}



/**
 * Text input type.
 *
 * These are the valid values for SDL_PROP_TEXTINPUT_TYPE_NUMBER. Not every
 * value is valid on every platform, but where a value isn't supported, a
 * reasonable fallback will be used.
 *
 * @since This enum is available since SDL 3.2.0.
 *
 * @sa SDL_StartTextInputWithProperties
 *
 * @from SDL_keyboard.h:390 SDL_TEXTINPUT_TYPE_
 */
export enum SDL_TextInputType {
  TEXT, /**< The input is text */
  TEXT_NAME, /**< The input is a person's name */
  TEXT_EMAIL, /**< The input is an e-mail address */
  TEXT_USERNAME, /**< The input is a username */
  TEXT_PASSWORD_HIDDEN, /**< The input is a secure password that is hidden */
  TEXT_PASSWORD_VISIBLE, /**< The input is a secure password that is visible */
  NUMBER, /**< The input is a number */
  NUMBER_PASSWORD_HIDDEN, /**< The input is a secure PIN that is hidden */
  NUMBER_PASSWORD_VISIBLE, /**< The input is a secure PIN that is visible */
}



/**
 * Auto capitalization type.
 *
 * These are the valid values for SDL_PROP_TEXTINPUT_CAPITALIZATION_NUMBER.
 * Not every value is valid on every platform, but where a value isn't
 * supported, a reasonable fallback will be used.
 *
 * @since This enum is available since SDL 3.2.0.
 *
 * @sa SDL_StartTextInputWithProperties
 *
 * @from SDL_keyboard.h:414 SDL_CAPITALIZE_
 */
export enum SDL_Capitalization {
  NONE, /**< No auto-capitalization will be done */
  SENTENCES, /**< The first letter of sentences will be capitalized */
  WORDS, /**< The first letter of words will be capitalized */
  LETTERS, /**< All letters will be capitalized */
}



