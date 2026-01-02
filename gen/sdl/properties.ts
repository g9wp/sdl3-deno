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

import { lib } from "./lib.ts";
import * as _p from "@g9wp/ptr";


export {
  SDL_PropertyType as PROPERTY_TYPE,
} from "../enums/SDL_properties.ts"

/**
 * Get the global SDL properties.
 *
 * @returns a valid property ID on success or 0 on failure; call
 *          SDL_GetError() for more information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_properties.h:115 SDL_PropertiesID SDL_GetGlobalProperties(void);
 */
export function getGlobalProperties(): number {
  return lib.symbols.SDL_GetGlobalProperties();
}

/**
 * Create a group of properties.
 *
 * All properties are automatically destroyed when SDL_Quit() is called.
 *
 * @returns an ID for a new group of properties, or 0 on failure; call
 *          SDL_GetError() for more information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_DestroyProperties
 *
 * @from SDL_properties.h:131 SDL_PropertiesID SDL_CreateProperties(void);
 */
export function createProperties(): number {
  return lib.symbols.SDL_CreateProperties();
}

/**
 * Copy a group of properties.
 *
 * Copy all the properties from one group of properties to another, with the
 * exception of properties requiring cleanup (set using
 * SDL_SetPointerPropertyWithCleanup()), which will not be copied. Any
 * property that already exists on `dst` will be overwritten.
 *
 * @param src the properties to copy.
 * @param dst the destination properties.
 * @returns true on success or false on failure; call SDL_GetError() for more
 *          information.
 *
 * @threadsafety It is safe to call this function from any thread. This
 *               function acquires simultaneous mutex locks on both the source
 *               and destination property sets.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_properties.h:152 bool SDL_CopyProperties(SDL_PropertiesID src, SDL_PropertiesID dst);
 */
export function copyProperties(src: number, dst: number): boolean {
  return lib.symbols.SDL_CopyProperties(src, dst);
}

/**
 * Lock a group of properties.
 *
 * Obtain a multi-threaded lock for these properties. Other threads will wait
 * while trying to lock these properties until they are unlocked. Properties
 * must be unlocked before they are destroyed.
 *
 * The lock is automatically taken when setting individual properties, this
 * function is only needed when you want to set several properties atomically
 * or want to guarantee that properties being queried aren't freed in another
 * thread.
 *
 * @param props the properties to lock.
 * @returns true on success or false on failure; call SDL_GetError() for more
 *          information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_UnlockProperties
 *
 * @from SDL_properties.h:176 bool SDL_LockProperties(SDL_PropertiesID props);
 */
export function lockProperties(props: number): boolean {
  return lib.symbols.SDL_LockProperties(props);
}

/**
 * Unlock a group of properties.
 *
 * @param props the properties to unlock.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_LockProperties
 *
 * @from SDL_properties.h:189 void SDL_UnlockProperties(SDL_PropertiesID props);
 */
export function unlockProperties(props: number): void {
  return lib.symbols.SDL_UnlockProperties(props);
}

/**
 * Set a pointer property in a group of properties with a cleanup function
 * that is called when the property is deleted.
 *
 * The cleanup function is also called if setting the property fails for any
 * reason.
 *
 * For simply setting basic data types, like numbers, bools, or strings, use
 * SDL_SetNumberProperty, SDL_SetBooleanProperty, or SDL_SetStringProperty
 * instead, as those functions will handle cleanup on your behalf. This
 * function is only for more complex, custom data.
 *
 * @param props the properties to modify.
 * @param name the name of the property to modify.
 * @param value the new value of the property, or NULL to delete the property.
 * @param cleanup the function to call when this property is deleted, or NULL
 *                if no cleanup is necessary.
 * @param userdata a pointer that is passed to the cleanup function.
 * @returns true on success or false on failure; call SDL_GetError() for more
 *          information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetPointerProperty
 * @sa SDL_SetPointerProperty
 * @sa SDL_CleanupPropertyCallback
 *
 * @from SDL_properties.h:244 bool SDL_SetPointerPropertyWithCleanup(SDL_PropertiesID props, const char *name, void *value, SDL_CleanupPropertyCallback cleanup, void *userdata);
 */
export function setPointerPropertyWithCleanup(
    props: number,
    name: string,
    value: Deno.PointerValue,
    cleanup: Deno.PointerValue,
    userdata: Deno.PointerValue,
): boolean {
  return lib.symbols.SDL_SetPointerPropertyWithCleanup(props, _p.toCstr(name), value, cleanup, userdata);
}

/**
 * Set a pointer property in a group of properties.
 *
 * @param props the properties to modify.
 * @param name the name of the property to modify.
 * @param value the new value of the property, or NULL to delete the property.
 * @returns true on success or false on failure; call SDL_GetError() for more
 *          information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetPointerProperty
 * @sa SDL_HasProperty
 * @sa SDL_SetBooleanProperty
 * @sa SDL_SetFloatProperty
 * @sa SDL_SetNumberProperty
 * @sa SDL_SetPointerPropertyWithCleanup
 * @sa SDL_SetStringProperty
 *
 * @from SDL_properties.h:267 bool SDL_SetPointerProperty(SDL_PropertiesID props, const char *name, void *value);
 */
export function setPointerProperty(props: number, name: string, value: Deno.PointerValue): boolean {
  return lib.symbols.SDL_SetPointerProperty(props, _p.toCstr(name), value);
}

/**
 * Set a string property in a group of properties.
 *
 * This function makes a copy of the string; the caller does not have to
 * preserve the data after this call completes.
 *
 * @param props the properties to modify.
 * @param name the name of the property to modify.
 * @param value the new value of the property, or NULL to delete the property.
 * @returns true on success or false on failure; call SDL_GetError() for more
 *          information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetStringProperty
 *
 * @from SDL_properties.h:287 bool SDL_SetStringProperty(SDL_PropertiesID props, const char *name, const char *value);
 */
export function setStringProperty(props: number, name: string, value: string): boolean {
  return lib.symbols.SDL_SetStringProperty(props, _p.toCstr(name), _p.toCstr(value));
}

/**
 * Set an integer property in a group of properties.
 *
 * @param props the properties to modify.
 * @param name the name of the property to modify.
 * @param value the new value of the property.
 * @returns true on success or false on failure; call SDL_GetError() for more
 *          information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetNumberProperty
 *
 * @from SDL_properties.h:304 bool SDL_SetNumberProperty(SDL_PropertiesID props, const char *name, Sint64 value);
 */
export function setNumberProperty(props: number, name: string, value: bigint): boolean {
  return lib.symbols.SDL_SetNumberProperty(props, _p.toCstr(name), value);
}

/**
 * Set a floating point property in a group of properties.
 *
 * @param props the properties to modify.
 * @param name the name of the property to modify.
 * @param value the new value of the property.
 * @returns true on success or false on failure; call SDL_GetError() for more
 *          information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetFloatProperty
 *
 * @from SDL_properties.h:321 bool SDL_SetFloatProperty(SDL_PropertiesID props, const char *name, float value);
 */
export function setFloatProperty(props: number, name: string, value: number): boolean {
  return lib.symbols.SDL_SetFloatProperty(props, _p.toCstr(name), value);
}

/**
 * Set a boolean property in a group of properties.
 *
 * @param props the properties to modify.
 * @param name the name of the property to modify.
 * @param value the new value of the property.
 * @returns true on success or false on failure; call SDL_GetError() for more
 *          information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetBooleanProperty
 *
 * @from SDL_properties.h:338 bool SDL_SetBooleanProperty(SDL_PropertiesID props, const char *name, bool value);
 */
export function setBooleanProperty(props: number, name: string, value: boolean): boolean {
  return lib.symbols.SDL_SetBooleanProperty(props, _p.toCstr(name), value);
}

/**
 * Return whether a property exists in a group of properties.
 *
 * @param props the properties to query.
 * @param name the name of the property to query.
 * @returns true if the property exists, or false if it doesn't.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetPropertyType
 *
 * @from SDL_properties.h:353 bool SDL_HasProperty(SDL_PropertiesID props, const char *name);
 */
export function hasProperty(props: number, name: string): boolean {
  return lib.symbols.SDL_HasProperty(props, _p.toCstr(name));
}

/**
 * Get the type of a property in a group of properties.
 *
 * @param props the properties to query.
 * @param name the name of the property to query.
 * @returns the type of the property, or SDL_PROPERTY_TYPE_INVALID if it is
 *          not set.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_HasProperty
 *
 * @from SDL_properties.h:369 SDL_PropertyType SDL_GetPropertyType(SDL_PropertiesID props, const char *name);
 */
export function getPropertyType(props: number, name: string): number {
  return lib.symbols.SDL_GetPropertyType(props, _p.toCstr(name));
}

/**
 * Get a pointer property from a group of properties.
 *
 * By convention, the names of properties that SDL exposes on objects will
 * start with "SDL.", and properties that SDL uses internally will start with
 * "SDL.internal.". These should be considered read-only and should not be
 * modified by applications.
 *
 * @param props the properties to query.
 * @param name the name of the property to query.
 * @param default_value the default value of the property.
 * @returns the value of the property, or `default_value` if it is not set or
 *          not a pointer property.
 *
 * @threadsafety It is safe to call this function from any thread, although
 *               the data returned is not protected and could potentially be
 *               freed if you call SDL_SetPointerProperty() or
 *               SDL_ClearProperty() on these properties from another thread.
 *               If you need to avoid this, use SDL_LockProperties() and
 *               SDL_UnlockProperties().
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetBooleanProperty
 * @sa SDL_GetFloatProperty
 * @sa SDL_GetNumberProperty
 * @sa SDL_GetPropertyType
 * @sa SDL_GetStringProperty
 * @sa SDL_HasProperty
 * @sa SDL_SetPointerProperty
 *
 * @from SDL_properties.h:402 void * SDL_GetPointerProperty(SDL_PropertiesID props, const char *name, void *default_value);
 */
export function getPointerProperty(props: number, name: string, default_value: Deno.PointerValue): Deno.PointerValue {
  return lib.symbols.SDL_GetPointerProperty(props, _p.toCstr(name), default_value);
}

/**
 * Get a string property from a group of properties.
 *
 * @param props the properties to query.
 * @param name the name of the property to query.
 * @param default_value the default value of the property.
 * @returns the value of the property, or `default_value` if it is not set or
 *          not a string property.
 *
 * @threadsafety It is safe to call this function from any thread, although
 *               the data returned is not protected and could potentially be
 *               freed if you call SDL_SetStringProperty() or
 *               SDL_ClearProperty() on these properties from another thread.
 *               If you need to avoid this, use SDL_LockProperties() and
 *               SDL_UnlockProperties().
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetPropertyType
 * @sa SDL_HasProperty
 * @sa SDL_SetStringProperty
 *
 * @from SDL_properties.h:426 const char * SDL_GetStringProperty(SDL_PropertiesID props, const char *name, const char *default_value);
 */
export function getStringProperty(props: number, name: string, default_value: string): string {
  return _p.getCstr2(lib.symbols.SDL_GetStringProperty(props, _p.toCstr(name), _p.toCstr(default_value)));
}

/**
 * Get a number property from a group of properties.
 *
 * You can use SDL_GetPropertyType() to query whether the property exists and
 * is a number property.
 *
 * @param props the properties to query.
 * @param name the name of the property to query.
 * @param default_value the default value of the property.
 * @returns the value of the property, or `default_value` if it is not set or
 *          not a number property.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetPropertyType
 * @sa SDL_HasProperty
 * @sa SDL_SetNumberProperty
 *
 * @from SDL_properties.h:448 Sint64 SDL_GetNumberProperty(SDL_PropertiesID props, const char *name, Sint64 default_value);
 */
export function getNumberProperty(props: number, name: string, default_value: bigint): bigint {
  return lib.symbols.SDL_GetNumberProperty(props, _p.toCstr(name), default_value);
}

/**
 * Get a floating point property from a group of properties.
 *
 * You can use SDL_GetPropertyType() to query whether the property exists and
 * is a floating point property.
 *
 * @param props the properties to query.
 * @param name the name of the property to query.
 * @param default_value the default value of the property.
 * @returns the value of the property, or `default_value` if it is not set or
 *          not a float property.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetPropertyType
 * @sa SDL_HasProperty
 * @sa SDL_SetFloatProperty
 *
 * @from SDL_properties.h:470 float SDL_GetFloatProperty(SDL_PropertiesID props, const char *name, float default_value);
 */
export function getFloatProperty(props: number, name: string, default_value: number): number {
  return lib.symbols.SDL_GetFloatProperty(props, _p.toCstr(name), default_value);
}

/**
 * Get a boolean property from a group of properties.
 *
 * You can use SDL_GetPropertyType() to query whether the property exists and
 * is a boolean property.
 *
 * @param props the properties to query.
 * @param name the name of the property to query.
 * @param default_value the default value of the property.
 * @returns the value of the property, or `default_value` if it is not set or
 *          not a boolean property.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetPropertyType
 * @sa SDL_HasProperty
 * @sa SDL_SetBooleanProperty
 *
 * @from SDL_properties.h:492 bool SDL_GetBooleanProperty(SDL_PropertiesID props, const char *name, bool default_value);
 */
export function getBooleanProperty(props: number, name: string, default_value: boolean): boolean {
  return lib.symbols.SDL_GetBooleanProperty(props, _p.toCstr(name), default_value);
}

/**
 * Clear a property from a group of properties.
 *
 * @param props the properties to modify.
 * @param name the name of the property to clear.
 * @returns true on success or false on failure; call SDL_GetError() for more
 *          information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_properties.h:506 bool SDL_ClearProperty(SDL_PropertiesID props, const char *name);
 */
export function clearProperty(props: number, name: string): boolean {
  return lib.symbols.SDL_ClearProperty(props, _p.toCstr(name));
}

/**
 * Enumerate the properties contained in a group of properties.
 *
 * The callback function is called for each property in the group of
 * properties. The properties are locked during enumeration.
 *
 * @param props the properties to query.
 * @param callback the function to call for each property.
 * @param userdata a pointer that is passed to `callback`.
 * @returns true on success or false on failure; call SDL_GetError() for more
 *          information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_properties.h:543 bool SDL_EnumerateProperties(SDL_PropertiesID props, SDL_EnumeratePropertiesCallback callback, void *userdata);
 */
export function enumerateProperties(props: number, callback: Deno.PointerValue, userdata: Deno.PointerValue): boolean {
  return lib.symbols.SDL_EnumerateProperties(props, callback, userdata);
}

/**
 * Destroy a group of properties.
 *
 * All properties are deleted and their cleanup functions will be called, if
 * any.
 *
 * @param props the properties to destroy.
 *
 * @threadsafety This function should not be called while these properties are
 *               locked or other threads might be setting or getting values
 *               from these properties.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_CreateProperties
 *
 * @from SDL_properties.h:561 void SDL_DestroyProperties(SDL_PropertiesID props);
 */
export function destroyProperties(props: number): void {
  return lib.symbols.SDL_DestroyProperties(props);
}
