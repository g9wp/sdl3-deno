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

import * as _ from "@denosaurs/byte-type";


/**
 * Information about a connected HID device
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @from SDL_hidapi.h:112
 */
export const SDL_hid_device_info = new _.Struct({
    /** Platform-specific device path */
  path: _.u64, /* char * */
    /** Device Vendor ID */
  vendor_id: _.u16, /* unsigned short */
    /** Device Product ID */
  product_id: _.u16, /* unsigned short */
    /** Serial Number */
  serial_number: _.u64, /* wchar_t * */
    /** Device Release Number in binary-coded decimal,
        also known as Device Version Number */
  release_number: _.u16, /* unsigned short */
    /** Manufacturer String */
  manufacturer_string: _.u64, /* wchar_t * */
    /** Product string */
  product_string: _.u64, /* wchar_t * */
    /** Usage Page for this Device/Interface
        (Windows/Mac/hidraw only) */
  usage_page: _.u16, /* unsigned short */
    /** Usage for this Device/Interface
        (Windows/Mac/hidraw only) */
  usage: _.u16, /* unsigned short */
    /** The USB interface which this logical device
        represents.

        Valid only if the device is a USB HID device.
        Set to -1 in all other cases.
    */
  interface_number: _.i32, /* int */
    /** Additional information about the USB interface.
        Valid on libusb and Android implementations. */
  interface_class: _.i32, /* int */
  interface_subclass: _.i32, /* int */
  interface_protocol: _.i32, /* int */
    /** Underlying bus type */
  bus_type: _.u32, /* SDL_hid_bus_type */
    /** Pointer to the next device */
  next: _.u64, /* struct SDL_hid_device_info * */
});



