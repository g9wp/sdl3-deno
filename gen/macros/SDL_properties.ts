/**
 * # CategoryProperties
 *
 * A property is a variable that can be created and retrieved by name at
 * runtime.
 *
 * All properties are part of a property group (SDL_PropertiesID). A property
 * group can be created with the SDL_CreateProperties function and destroyed
 * with the SDL_DestroyProperties function.
 *
 * Properties can be added to and retrieved from a property group through the
 * following functions:
 *
 * - SDL_SetPointerProperty and SDL_GetPointerProperty operate on `void*`
 *   pointer types.
 * - SDL_SetStringProperty and SDL_GetStringProperty operate on string types.
 * - SDL_SetNumberProperty and SDL_GetNumberProperty operate on signed 64-bit
 *   integer types.
 * - SDL_SetFloatProperty and SDL_GetFloatProperty operate on floating point
 *   types.
 * - SDL_SetBooleanProperty and SDL_GetBooleanProperty operate on boolean
 *   types.
 *
 * Properties can be removed from a group by using SDL_ClearProperty.
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
 * A generic property for naming things.
 *
 * This property is intended to be added to any SDL_PropertiesID that needs a
 * generic name associated with the property set. It is not guaranteed that
 * any property set will include this key, but it is convenient to have a
 * standard key that any piece of code could reasonably agree to use.
 *
 * For example, the properties associated with an SDL_Texture might have a
 * name string of "player sprites", or an SDL_AudioStream might have
 * "background music", etc. This might also be useful for an SDL_IOStream to
 * list the path to its asset.
 *
 * There is no format for the value set with this key; it is expected to be
 * human-readable and informational in nature, possibly for logging or
 * debugging purposes.
 *
 * SDL does not currently set this property on any objects it creates, but
 * this may change in later versions; it is currently expected that apps and
 * external libraries will take advantage of it, when appropriate.
 *
 * @since This macro is available since SDL 3.4.0.
 *
 * @from SDL_properties.h:105
 */
export const SDL_PROP_NAME_STRING = "SDL.name";

