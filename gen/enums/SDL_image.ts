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
 * @from SDL_image:45 SDL_IMAGE_
 */
export enum IMAGE {
  MAJOR_VERSION = 3, /**
 * Printable format: "%d.%d.%d", MAJOR, MINOR, MICRO
 */
  MINOR_VERSION = 4, 
  MICRO_VERSION = 4, 
}



/**
 * @from SDL_image:3021 IMG_PROP_ANIMATION_ENCODER_CREATE_
 */
export enum PROP_ANIMATION_ENCODER_CREATE {
  FILENAME_STRING = "SDL_image.animation_encoder.create.filename", 
  IOSTREAM_POINTER = "SDL_image.animation_encoder.create.iostream", 
  IOSTREAM_AUTOCLOSE_BOOLEAN = "SDL_image.animation_encoder.create.iostream.autoclose", 
  TYPE_STRING = "SDL_image.animation_encoder.create.type", 
  QUALITY_NUMBER = "SDL_image.animation_encoder.create.quality", 
  TIMEBASE_NUMERATOR_NUMBER = "SDL_image.animation_encoder.create.timebase.numerator", 
  TIMEBASE_DENOMINATOR_NUMBER = "SDL_image.animation_encoder.create.timebase.denominator", 
}



/**
 * @from SDL_image:3191 IMG_PROP_ANIMATION_DECODER_CREATE_
 */
export enum PROP_ANIMATION_DECODER_CREATE {
  FILENAME_STRING = "SDL_image.animation_decoder.create.filename", 
  IOSTREAM_POINTER = "SDL_image.animation_decoder.create.iostream", 
  IOSTREAM_AUTOCLOSE_BOOLEAN = "SDL_image.animation_decoder.create.iostream.autoclose", 
  TYPE_STRING = "SDL_image.animation_decoder.create.type", 
  TIMEBASE_NUMERATOR_NUMBER = "SDL_image.animation_decoder.create.timebase.numerator", 
  TIMEBASE_DENOMINATOR_NUMBER = "SDL_image.animation_decoder.create.timebase.denominator", 
}



/**
 * @from SDL_image:3225 IMG_PROP_METADATA_
 */
export enum PROP_METADATA {
  IGNORE_PROPS_BOOLEAN = "SDL_image.metadata.ignore_props", 
  DESCRIPTION_STRING = "SDL_image.metadata.description", 
  COPYRIGHT_STRING = "SDL_image.metadata.copyright", 
  TITLE_STRING = "SDL_image.metadata.title", 
  AUTHOR_STRING = "SDL_image.metadata.author", 
  CREATION_TIME_STRING = "SDL_image.metadata.creation_time", 
  FRAME_COUNT_NUMBER = "SDL_image.metadata.frame_count", 
  LOOP_COUNT_NUMBER = "SDL_image.metadata.loop_count", 
}



/**
 * An enum representing the status of an animation decoder.
 *
 * @since This enum is available since SDL_image 3.4.0.
 *
 * @from SDL_image.h:3077 IMG_DECODER_STATUS_
 */
export enum IMG_AnimationDecoderStatus {
  INVALID = -1, /**< The decoder is invalid */
  OK, /**< The decoder is ready to decode the next frame */
  FAILED, /**< The decoder failed to decode a frame, call SDL_GetError() for more information. */
  COMPLETE, /**< No more frames available */
}



