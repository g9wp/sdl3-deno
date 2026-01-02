/**
 * # CategoryDlopenNotes
 *
 * This header allows you to annotate your code so external tools know about
 * dynamic shared library dependencies.
 *
 * If you determine that your toolchain doesn't support dlopen notes, you can
 * disable this feature by defining `SDL_DISABLE_DLOPEN_NOTES`. You can use
 * this CMake snippet to check for support:
 *
 * ```cmake
 * include(CheckCSourceCompiles)
 * find_package(SDL3 REQUIRED CONFIG COMPONENTS Headers)
 * list(APPEND CMAKE_REQUIRED_LIBRARIES SDL3::Headers)
 * check_c_source_compiles([==[
 *   #include <SDL3/SDL_dlopennote.h>
 *   SDL_ELF_NOTE_DLOPEN("sdl-video",
 *     "Support for video through SDL",
 *     SDL_ELF_NOTE_DLOPEN_PRIORITY_SUGGESTED,
 *     "libSDL-1.2.so.0", "libSDL-2.0.so.0", "libSDL3.so.0"
 *   )
 *   int main(int argc, char *argv[]) {
 *     return argc + argv[0][1];
 *   }
 * ]==] COMPILER_SUPPORTS_SDL_ELF_NOTE_DLOPEN)
 * if(NOT COMPILER_SUPPORTS_SDL_ELF_NOTE_DLOPEN)
 *   add_compile_definitions(-DSDL_DISABLE_DLOPEN_NOTE)
 * endif()
 * ```
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
 * @from SDL_dlopennote:119 SDL_ELF_NOTE_DLOPEN_
 */
export enum ELF_NOTE_DLOPEN {
  VENDOR = "FDO", 
  TYPE = 0x407c0c0a, 
}



