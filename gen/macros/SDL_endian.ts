/**
 * # CategoryEndian
 *
 * Functions converting endian-specific values to different byte orders.
 *
 * These functions either unconditionally swap byte order (SDL_Swap16,
 * SDL_Swap32, SDL_Swap64, SDL_SwapFloat), or they swap to/from the system's
 * native byte order (SDL_Swap16LE, SDL_Swap16BE, SDL_Swap32LE, SDL_Swap32BE,
 * SDL_Swap32LE, SDL_Swap32BE, SDL_SwapFloatLE, SDL_SwapFloatBE). In the
 * latter case, the functionality is provided by macros that become no-ops if
 * a swap isn't necessary: on an x86 (littleendian) processor, SDL_Swap32LE
 * does nothing, but SDL_Swap32BE reverses the bytes of the data. On a PowerPC
 * processor (bigendian), the macros behavior is reversed.
 *
 * The swap routines are inline functions, and attempt to use compiler
 * intrinsics, inline assembly, and other magic to make byteswapping
 * efficient.
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
 * A value to represent littleendian byteorder.
 *
 * This is used with the preprocessor macro SDL_BYTEORDER, to determine a
 * platform's byte ordering:
 *
 * ```c
 * #if SDL_BYTEORDER == SDL_LIL_ENDIAN
 * SDL_Log("This system is littleendian.");
 * #endif
 * ```
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @sa SDL_BYTEORDER
 * @sa SDL_BIG_ENDIAN
 *
 * @from SDL_endian.h:85
 */
export const SDL_LIL_ENDIAN = 1234;

/**
 * A value to represent bigendian byteorder.
 *
 * This is used with the preprocessor macro SDL_BYTEORDER, to determine a
 * platform's byte ordering:
 *
 * ```c
 * #if SDL_BYTEORDER == SDL_BIG_ENDIAN
 * SDL_Log("This system is bigendian.");
 * #endif
 * ```
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @sa SDL_BYTEORDER
 * @sa SDL_LIL_ENDIAN
 *
 * @from SDL_endian.h:104
 */
export const SDL_BIG_ENDIAN = 4321;

/**
 * @from SDL_endian:129
 */
export const SDL_BYTEORDER = SDL_LIL_ENDIAN___or_maybe___SDL_BIG_ENDIAN;

/**
 * @from SDL_endian:136
 */
export const SDL_BYTEORDER = SDL_LIL_ENDIAN;

/**
 * @from SDL_endian:138
 */
export const SDL_BYTEORDER = SDL_BIG_ENDIAN;

/**
 * @from SDL_endian:144
 */
export const SDL_BYTEORDER = BYTE_ORDER;

/**
 * @from SDL_endian:147
 */
export const SDL_BYTEORDER = BYTE_ORDER;

/**
 * @from SDL_endian:151
 */
export const SDL_BYTEORDER = SDL_LIL_ENDIAN;

/**
 * @from SDL_endian:153
 */
export const SDL_BYTEORDER = SDL_BIG_ENDIAN;

/**
 * @from SDL_endian:163
 */
export const SDL_BYTEORDER = SDL_BIG_ENDIAN;

/**
 * @from SDL_endian:165
 */
export const SDL_BYTEORDER = SDL_LIL_ENDIAN;

/**
 * @from SDL_endian:191
 */
export const SDL_FLOATWORDORDER = SDL_LIL_ENDIAN___or_maybe___SDL_BIG_ENDIAN;

/**
 * @from SDL_endian:195
 */
export const SDL_FLOATWORDORDER = SDL_LIL_ENDIAN;

/**
 * @from SDL_endian:197
 */
export const SDL_FLOATWORDORDER = SDL_BIG_ENDIAN;

/**
 * @from SDL_endian:203
 */
export const SDL_FLOATWORDORDER = SDL_LIL_ENDIAN;

/**
 * @from SDL_endian:206
 */
export const SDL_FLOATWORDORDER = SDL_BIG_ENDIAN;

/**
 * @from SDL_endian:209
 */
export const SDL_FLOATWORDORDER = SDL_BYTEORDER;

