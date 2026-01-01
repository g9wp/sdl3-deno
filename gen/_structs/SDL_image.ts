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

import * as _ from "@denosaurs/byte-type";


/**
 * Animated image support
 *
 * Currently only animated GIFs and WEBP images are supported.
 *
 * @from SDL_image.h:1974
 */
export const IMG_Animation = new _.Struct({
  w: _.i32, /**< int : The width of the frames */
  h: _.i32, /**< int : The height of the frames */
  count: _.i32, /**< int : The number of frames */
  frames: _.u64, /**< SDL_Surface ** : An array of frames */
  delays: _.u64, /**< int * : An array of frame delays, in milliseconds */
});



