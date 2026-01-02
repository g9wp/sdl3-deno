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

/**
 * HID underlying bus types.
 *
 * @since This enum is available since SDL 3.2.0.
 *
 * @from SDL_hidapi.h:77 SDL_HID_API_BUS_
 */
export enum SDL_hid_bus_type {
    /** Unknown bus type */
  UNKNOWN = 0x00, 
    /** USB bus
       Specifications:
       https://usb.org/hid */
  USB = 0x01, 
    /** Bluetooth or Bluetooth LE bus
       Specifications:
       https://www.bluetooth.com/specifications/specs/human-interface-device-profile-1-1-1/
       https://www.bluetooth.com/specifications/specs/hid-service-1-0/
       https://www.bluetooth.com/specifications/specs/hid-over-gatt-profile-1-0/ */
  BLUETOOTH = 0x02, 
    /** I2C bus
       Specifications:
       https://docs.microsoft.com/previous-versions/windows/hardware/design/dn642101(v=vs.85) */
  I2C = 0x03, 
    /** SPI bus
       Specifications:
       https://www.microsoft.com/download/details.aspx?id=103325 */
  SPI = 0x04, 
}



