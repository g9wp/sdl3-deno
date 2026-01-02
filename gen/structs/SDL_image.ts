/**
 * # CategorySDLImage
 *
 * Header file for SDL_image library
 *
 * A simple library to load images of various formats as SDL surfaces
 *
 * @module
 */

/*
  SDL_image:  An example image loading library for use with SDL
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
import * as _b from "../_structs/SDL_image.ts";


/**
 * Animated image support
 *
 * Currently only animated GIFs and WEBP images are supported.
 *
 * @from SDL_image.h:1974
 */
export interface Animation {
  w: number; /**< int : The width of the frames */
  h: number; /**< int : The height of the frames */
  count: number; /**< int : The number of frames */
  frames: Deno.PointerValue; /**< SDL_Surface ** : An array of frames */
  delays: Deno.PointerValue; /**< int * : An array of frame delays, in milliseconds */
}

export function read_Animation(dt: DataView): Animation {
  const t = _b.IMG_Animation.read(dt);
  return {
    w: t.w, /** int */
    h: t.h, /** int */
    count: t.count, /** int */
    frames: Deno.UnsafePointer.create(t.frames), /** SDL_Surface ** */
    delays: Deno.UnsafePointer.create(t.delays), /** int * */
  };
}

export function write_Animation(t: Animation, dt: DataView) {
  _b.IMG_Animation.write({
    w: t.w, /** int */
    h: t.h, /** int */
    count: t.count, /** int */
    frames: Deno.UnsafePointer.value(t.frames), /** SDL_Surface ** */
    delays: Deno.UnsafePointer.value(t.delays), /** int * */
  }, dt);
}


