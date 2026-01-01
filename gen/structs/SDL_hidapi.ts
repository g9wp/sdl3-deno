/**
 * # CategoryHIDAPI
 *
 * Header file for SDL HIDAPI functions.
 *
 * This is an adaptation of the original HIDAPI interface by Alan Ott, and
 * includes source code licensed under the following license:
 *
 * ```
 * HIDAPI - Multi-Platform library for
 * communication with HID devices.
 *
 * Copyright 2009, Alan Ott, Signal 11 Software.
 * All Rights Reserved.
 *
 * This software may be used by anyone for any reason so
 * long as the copyright notice in the source files
 * remains intact.
 * ```
 *
 * (Note that this license is the same as item three of SDL's zlib license, so
 * it adds no new requirements on the user.)
 *
 * If you would like a version of SDL without this code, you can build SDL
 * with SDL_HIDAPI_DISABLED defined to 1. You might want to do this for
 * example on iOS or tvOS to avoid a dependency on the CoreBluetooth
 * framework.
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

import * as _ from "../_utils.ts";
import * as _b from "../_structs/SDL_hidapi.ts";


/**
 * Information about a connected HID device
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @from SDL_hidapi.h:112
 */
export interface hid_device_info {
    /** Platform-specific device path */
  path: Deno.PointerValue; /* char * */
    /** Device Vendor ID */
  vendor_id: number; /* unsigned short */
    /** Device Product ID */
  product_id: number; /* unsigned short */
    /** Serial Number */
  serial_number: Deno.PointerValue; /* wchar_t * */
    /** Device Release Number in binary-coded decimal,
        also known as Device Version Number */
  release_number: number; /* unsigned short */
    /** Manufacturer String */
  manufacturer_string: Deno.PointerValue; /* wchar_t * */
    /** Product string */
  product_string: Deno.PointerValue; /* wchar_t * */
    /** Usage Page for this Device/Interface
        (Windows/Mac/hidraw only) */
  usage_page: number; /* unsigned short */
    /** Usage for this Device/Interface
        (Windows/Mac/hidraw only) */
  usage: number; /* unsigned short */
    /** The USB interface which this logical device
        represents.

        Valid only if the device is a USB HID device.
        Set to -1 in all other cases.
    */
  interface_number: number; /* int */
    /** Additional information about the USB interface.
        Valid on libusb and Android implementations. */
  interface_class: number; /* int */
  interface_subclass: number; /* int */
  interface_protocol: number; /* int */
    /** Underlying bus type */
  bus_type: number; /* SDL_hid_bus_type */
    /** Pointer to the next device */
  next: Deno.PointerValue; /* struct SDL_hid_device_info * */
}

export function read_hid_device_info(dt: DataView): hid_device_info {
  const t = _b.SDL_hid_device_info.read(dt);
  return {
    /** Platform-specific device path */
    path: Deno.UnsafePointer.create(t.path), /** char * */
    /** Device Vendor ID */
    vendor_id: t.vendor_id, /** unsigned short */
    /** Device Product ID */
    product_id: t.product_id, /** unsigned short */
    /** Serial Number */
    serial_number: Deno.UnsafePointer.create(t.serial_number), /** wchar_t * */
    /** Device Release Number in binary-coded decimal,
        also known as Device Version Number */
    release_number: t.release_number, /** unsigned short */
    /** Manufacturer String */
    manufacturer_string: Deno.UnsafePointer.create(t.manufacturer_string), /** wchar_t * */
    /** Product string */
    product_string: Deno.UnsafePointer.create(t.product_string), /** wchar_t * */
    /** Usage Page for this Device/Interface
        (Windows/Mac/hidraw only) */
    usage_page: t.usage_page, /** unsigned short */
    /** Usage for this Device/Interface
        (Windows/Mac/hidraw only) */
    usage: t.usage, /** unsigned short */
    /** The USB interface which this logical device
        represents.

        Valid only if the device is a USB HID device.
        Set to -1 in all other cases.
    */
    interface_number: t.interface_number, /** int */
    /** Additional information about the USB interface.
        Valid on libusb and Android implementations. */
    interface_class: t.interface_class, /** int */
    interface_subclass: t.interface_subclass, /** int */
    interface_protocol: t.interface_protocol, /** int */
    /** Underlying bus type */
    bus_type: t.bus_type, /** SDL_hid_bus_type */
    /** Pointer to the next device */
    next: Deno.UnsafePointer.create(t.next), /** struct SDL_hid_device_info * */
  };
}

export function write_hid_device_info(t: hid_device_info, dt: DataView) {
  _b.SDL_hid_device_info.write({
    /** Platform-specific device path */
    path: Deno.UnsafePointer.value(t.path), /** char * */
    /** Device Vendor ID */
    vendor_id: t.vendor_id, /** unsigned short */
    /** Device Product ID */
    product_id: t.product_id, /** unsigned short */
    /** Serial Number */
    serial_number: Deno.UnsafePointer.value(t.serial_number), /** wchar_t * */
    /** Device Release Number in binary-coded decimal,
        also known as Device Version Number */
    release_number: t.release_number, /** unsigned short */
    /** Manufacturer String */
    manufacturer_string: Deno.UnsafePointer.value(t.manufacturer_string), /** wchar_t * */
    /** Product string */
    product_string: Deno.UnsafePointer.value(t.product_string), /** wchar_t * */
    /** Usage Page for this Device/Interface
        (Windows/Mac/hidraw only) */
    usage_page: t.usage_page, /** unsigned short */
    /** Usage for this Device/Interface
        (Windows/Mac/hidraw only) */
    usage: t.usage, /** unsigned short */
    /** The USB interface which this logical device
        represents.

        Valid only if the device is a USB HID device.
        Set to -1 in all other cases.
    */
    interface_number: t.interface_number, /** int */
    /** Additional information about the USB interface.
        Valid on libusb and Android implementations. */
    interface_class: t.interface_class, /** int */
    interface_subclass: t.interface_subclass, /** int */
    interface_protocol: t.interface_protocol, /** int */
    /** Underlying bus type */
    bus_type: t.bus_type, /** SDL_hid_bus_type */
    /** Pointer to the next device */
    next: Deno.UnsafePointer.value(t.next), /** struct SDL_hid_device_info * */
  }, dt);
}


