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

import * as SDL from "../gen/sdl/properties.ts";

import { read_cstr, SdlError } from "./_utils.ts";

import { SDL_PropertyType as PropertyType } from "../gen/enums/SDL_properties.ts";

import * as _cb from "../gen/callbacks/SDL_properties.ts";
export { PropertyType };

const cbholder = {
  map: new Map<number, Deno.UnsafeCallback[]>(),

  set(id: number, cb: Deno.UnsafeCallback) {
    const old = this.map.get(id);
    if (!old) {
      this.map.set(id, [cb]);
    } else old.push(cb);
  },
};

/**
 * A group of properties that can be attached to various SDL objects.
 *
 * Properties are key-value pairs that can store different types of data including:
 * - Pointers (void*, may also attach cleanup callback)
 * - Strings
 * - Numbers (64-bit integers)
 * - Floating point values
 * - Boolean values
 *
 * Properties are automatically cleaned up when the Properties object is destroyed.
 *
 * @example
 * ```ts
 * const props = new Properties();
 * props.setNumber("width", 100n);
 * props.setString("title", "My Window");
 * ```
 */
export class Properties {
  /**
   * SDL properties ID
   *
   * @since This datatype is available since SDL 3.2.0.
   * @from SDL_properties.h:66 typedef Uint32 SDL_PropertiesID;
   */
  public id: number;

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
   * @from SDL_properties.h:106 SDL_PropertiesID SDL_CreateProperties(void);
   */
  constructor(id?: number) {
    if (id === undefined) {
      id = SDL.createProperties();
      if (id === 0) throw SdlError("createProperties");
    }
    this.id = id;
  }

  /**
   * Get the global SDL properties.
   *
   * @returns a valid property ID on success or 0 on failure; call
   *          SDL_GetError() for more information.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @from SDL_properties.h:90 SDL_PropertiesID SDL_GetGlobalProperties(void);
   */
  static get global(): Properties | null {
    const id = SDL.getGlobalProperties();
    if (id === 0) throw SdlError("getGlobalProperties");
    return new Properties(id);
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
   * @threadsafety It is safe to call this function from any thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @from SDL_properties.h:125 bool SDL_CopyProperties(SDL_PropertiesID src, SDL_PropertiesID dst);
   */
  copyTo(dst: Properties): boolean {
    return SDL.copyProperties(this.id, dst.id);
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
   * @from SDL_properties.h:149 bool SDL_LockProperties(SDL_PropertiesID props);
   */
  lock(): boolean {
    return SDL.lockProperties(this.id);
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
   * @from SDL_properties.h:162 void SDL_UnlockProperties(SDL_PropertiesID props);
   */
  unlock() {
    SDL.unlockProperties(this.id);
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
   * @from SDL_properties.h:217 bool SDL_SetPointerPropertyWithCleanup(SDL_PropertiesID props, const char *name, void *value, SDL_CleanupPropertyCallback cleanup, void *userdata);
   */
  setPointerWithCleanup(
    name: string,
    value: Deno.PointerValue,
    cleanup?: (
      userdata: Deno.PointerValue,
      id: number,
      value: Deno.PointerValue,
    ) => void,
    userdata?: Deno.PointerValue,
  ): boolean {
    if (!cleanup) {
      return SDL.setPointerPropertyWithCleanup(
        this.id,
        name,
        value,
        null,
        userdata ?? null,
      );
    }

    const cb = _cb.EnumeratePropertiesCallback(cleanup);
    cbholder.set(this.id, cb as Deno.UnsafeCallback);

    return SDL.setPointerPropertyWithCleanup(
      this.id,
      name,
      value,
      cb.pointer,
      userdata ?? null,
    );
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
   * @from SDL_properties.h:240 bool SDL_SetPointerProperty(SDL_PropertiesID props, const char *name, void *value);
   */
  setPointer(name: string, value: Deno.PointerValue): boolean {
    return SDL.setPointerProperty(this.id, name, value);
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
   * @from SDL_properties.h:260 bool SDL_SetStringProperty(SDL_PropertiesID props, const char *name, const char *value);
   */
  setString(name: string, value: string): boolean {
    return SDL.setStringProperty(this.id, name, value);
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
   * @from SDL_properties.h:277 bool SDL_SetNumberProperty(SDL_PropertiesID props, const char *name, Sint64 value);
   */

  setNumber(name: string, value: bigint): boolean {
    return SDL.setNumberProperty(this.id, name, value);
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
   * @from SDL_properties.h:294 bool SDL_SetFloatProperty(SDL_PropertiesID props, const char *name, float value);
   */
  setFloat(name: string, value: number): boolean {
    return SDL.setFloatProperty(this.id, name, value);
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
   * @from SDL_properties.h:311 bool SDL_SetBooleanProperty(SDL_PropertiesID props, const char *name, bool value);
   */
  setBoolean(name: string, value: boolean): boolean {
    return SDL.setBooleanProperty(this.id, name, value);
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
   * @from SDL_properties.h:326 bool SDL_HasProperty(SDL_PropertiesID props, const char *name);
   */
  has(name: string): boolean {
    return SDL.hasProperty(this.id, name);
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
   * @from SDL_properties.h:342 SDL_PropertyType SDL_GetPropertyType(SDL_PropertiesID props, const char *name);
   */
  get type(): PropertyType {
    return SDL.getPropertyType(this.id, name);
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
   * @from SDL_properties.h:375 void * SDL_GetPointerProperty(SDL_PropertiesID props, const char *name, void *default_value);
   */
  getPointer(
    name: string,
    default_value: Deno.PointerValue,
  ): Deno.PointerValue {
    return SDL.getPointerProperty(this.id, name, default_value);
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
   * @from SDL_properties.h:399 const char * SDL_GetStringProperty(SDL_PropertiesID props, const char *name, const char *default_value);
   */
  getString(name: string, default_value: string): string {
    return SDL.getStringProperty(this.id, name, default_value);
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
   * @from SDL_properties.h:421 Sint64 SDL_GetNumberProperty(SDL_PropertiesID props, const char *name, Sint64 default_value);
   */
  getNumber(name: string, default_value: bigint): bigint | null {
    return SDL.getNumberProperty(this.id, name, default_value);
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
   * @from SDL_properties.h:443 float SDL_GetFloatProperty(SDL_PropertiesID props, const char *name, float default_value);
   */
  getFloat(name: string, default_value: number): number | null {
    return SDL.getFloatProperty(this.id, name, default_value);
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
   * @from SDL_properties.h:465 bool SDL_GetBooleanProperty(SDL_PropertiesID props, const char *name, bool default_value);
   */
  getBoolean(name: string, default_value: boolean): boolean | null {
    return SDL.getBooleanProperty(this.id, name, default_value);
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
   * @from SDL_properties.h:479 bool SDL_ClearProperty(SDL_PropertiesID props, const char *name);
   */
  clear(name: string): boolean {
    return SDL.clearProperty(this.id, name);
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
   * @from SDL_properties.h:516 bool SDL_EnumerateProperties(SDL_PropertiesID props, SDL_EnumeratePropertiesCallback callback, void *userdata);
   */
  enumerateProperties(
    callback: (
      userdata: Deno.PointerValue,
      id: number,
      name: string | null,
    ) => void,
    userdata: Deno.PointerValue,
  ): boolean {
    const cb = _cb.EnumeratePropertiesCallback(
      (userdata: Deno.PointerValue, id: number, name: Deno.PointerValue) =>
        callback(userdata, id, name ? read_cstr(name!) : null),
    );
    const r = SDL.enumerateProperties(this.id, cb.pointer, userdata);
    cb.close();
    return r;
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
   * @from SDL_properties.h:534 void SDL_DestroyProperties(SDL_PropertiesID props);
   */
  destroy() {
    SDL.destroyProperties(this.id);
    const cbs = cbholder.map.get(this.id);
    if (!cbs) return;

    for (const cb of cbs) {
      cb.close();
    }
    cbholder.map.delete(this.id);
  }

  static clearCb_() {
    for (const cbs of cbholder.map.values()) {
      for (const cb of cbs) {
        cb.close();
      }
    }
    cbholder.map.clear();
  }
}
