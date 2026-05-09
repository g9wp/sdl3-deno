/**
 * # CategoryIntrinsics
 *
 * SDL does some preprocessor gymnastics to determine if any CPU-specific
 * compiler intrinsics are available, as this is not necessarily an easy thing
 * to calculate, and sometimes depends on quirks of a system, versions of
 * build tools, and other external forces.
 *
 * Apps including SDL's headers will be able to check consistent preprocessor
 * definitions to decide if it's safe to use compiler intrinsics for a
 * specific CPU architecture. This check only tells you that the compiler is
 * capable of using those intrinsics; at runtime, you should still check if
 * they are available on the current system with the
 * [CPU info functions](https://wiki.libsdl.org/SDL3/CategoryCPUInfo)
 * , such as SDL_HasSSE() or SDL_HasNEON(). Otherwise, the process might crash
 * for using an unsupported CPU instruction.
 *
 * SDL only sets preprocessor defines for CPU intrinsics if they are
 * supported, so apps should check with `#ifdef` and not `#if`.
 *
 * SDL will also include the appropriate instruction-set-specific support
 * headers, so if SDL decides to define SDL_SSE2_INTRINSICS, it will also
 * `#include <emmintrin.h>` as well.
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
 * @from SDL_intrin:262 __ARM_
 */
export enum __ARM {
  NEON = 1, /* Set __ARM_NEON so that it can be used elsewhere, at compile time */
  ARCH = 8, 
}



