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

export const callbacks = {
/**
 * A callback used to free resources when a property is deleted.
 *
 * This should release any resources associated with `value` that are no
 * longer needed.
 *
 * This callback is set per-property. Different properties in the same group
 * can have different cleanup callbacks.
 *
 * This callback will be called _during_ SDL_SetPointerPropertyWithCleanup if
 * the function fails for any reason.
 *
 * @param userdata an app-defined pointer passed to the callback.
 * @param value the pointer assigned to the property to clean up.
 *
 * @threadsafety This callback may fire without any locks held; if this is a
 *               concern, the app should provide its own locking.
 *
 * @since This datatype is available since SDL 3.2.0.
 *
 * @sa SDL_SetPointerPropertyWithCleanup
 *
 * @from SDL_properties.h:186 typedef void (*SDL_CleanupPropertyCallback)(void *userdata, void *value);
 */
SDL_CleanupPropertyCallback: {
      parameters: ["pointer", "pointer"],
      result: "void"
    },

/**
 * A callback used to enumerate all the properties in a group of properties.
 *
 * This callback is called from SDL_EnumerateProperties(), and is called once
 * per property in the set.
 *
 * @param userdata an app-defined pointer passed to the callback.
 * @param props the SDL_PropertiesID that is being enumerated.
 * @param name the next property name in the enumeration.
 *
 * @threadsafety SDL_EnumerateProperties holds a lock on `props` during this
 *               callback.
 *
 * @since This datatype is available since SDL 3.2.0.
 *
 * @sa SDL_EnumerateProperties
 *
 * @from SDL_properties.h:498 typedef void (*SDL_EnumeratePropertiesCallback)(void *userdata, SDL_PropertiesID props, const char *name);
 */
SDL_EnumeratePropertiesCallback: {
      parameters: ["pointer", "u32", "pointer"],
      result: "void"
    },

} as const;


/**
 * A callback used to free resources when a property is deleted.
 *
 * This should release any resources associated with `value` that are no
 * longer needed.
 *
 * This callback is set per-property. Different properties in the same group
 * can have different cleanup callbacks.
 *
 * This callback will be called _during_ SDL_SetPointerPropertyWithCleanup if
 * the function fails for any reason.
 *
 * @param userdata an app-defined pointer passed to the callback.
 * @param value the pointer assigned to the property to clean up.
 *
 * @threadsafety This callback may fire without any locks held; if this is a
 *               concern, the app should provide its own locking.
 *
 * @since This datatype is available since SDL 3.2.0.
 *
 * @sa SDL_SetPointerPropertyWithCleanup
 *
 * @from SDL_properties.h:186 typedef void (*SDL_CleanupPropertyCallback)(void *userdata, void *value);
 */
export function CleanupPropertyCallback(cb: (
    userdata: Deno.PointerValue, 
    value: Deno.PointerValue, 
  ) => void) {
  return new Deno.UnsafeCallback(callbacks.SDL_CleanupPropertyCallback, cb);
}

/**
 * A callback used to enumerate all the properties in a group of properties.
 *
 * This callback is called from SDL_EnumerateProperties(), and is called once
 * per property in the set.
 *
 * @param userdata an app-defined pointer passed to the callback.
 * @param props the SDL_PropertiesID that is being enumerated.
 * @param name the next property name in the enumeration.
 *
 * @threadsafety SDL_EnumerateProperties holds a lock on `props` during this
 *               callback.
 *
 * @since This datatype is available since SDL 3.2.0.
 *
 * @sa SDL_EnumerateProperties
 *
 * @from SDL_properties.h:498 typedef void (*SDL_EnumeratePropertiesCallback)(void *userdata, SDL_PropertiesID props, const char *name);
 */
export function EnumeratePropertiesCallback(cb: (
    userdata: Deno.PointerValue, 
    props: number, 
    name: Deno.PointerValue, 
  ) => void) {
  return new Deno.UnsafeCallback(callbacks.SDL_EnumeratePropertiesCallback, cb);
}

