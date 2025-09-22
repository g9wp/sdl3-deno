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


export const symbols = {

/**
 * Initialize the HIDAPI library.
 *
 * This function initializes the HIDAPI library. Calling it is not strictly
 * necessary, as it will be called automatically by SDL_hid_enumerate() and
 * any of the SDL_hid_open_*() functions if it is needed. This function should
 * be called at the beginning of execution however, if there is a chance of
 * HIDAPI handles being opened by different threads simultaneously.
 *
 * Each call to this function should have a matching call to SDL_hid_exit()
 *
 * @returns 0 on success or a negative error code on failure; call
 *          SDL_GetError() for more information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_hid_exit
 *
 * @from SDL_hidapi.h:175 int SDL_hid_init(void);
 */
SDL_hid_init: {
      parameters: [],
      result: "i32"
    },


/**
 * Finalize the HIDAPI library.
 *
 * This function frees all of the static data associated with HIDAPI. It
 * should be called at the end of execution to avoid memory leaks.
 *
 * @returns 0 on success or a negative error code on failure; call
 *          SDL_GetError() for more information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_hid_init
 *
 * @from SDL_hidapi.h:190 int SDL_hid_exit(void);
 */
SDL_hid_exit: {
      parameters: [],
      result: "i32"
    },


/**
 * Check to see if devices may have been added or removed.
 *
 * Enumerating the HID devices is an expensive operation, so you can call this
 * to see if there have been any system device changes since the last call to
 * this function. A change in the counter returned doesn't necessarily mean
 * that anything has changed, but you can call SDL_hid_enumerate() to get an
 * updated device list.
 *
 * Calling this function for the first time may cause a thread or other system
 * resource to be allocated to track device change notifications.
 *
 * @returns a change counter that is incremented with each potential device
 *          change, or 0 if device change detection isn't available.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_hid_enumerate
 *
 * @from SDL_hidapi.h:211 Uint32 SDL_hid_device_change_count(void);
 */
SDL_hid_device_change_count: {
      parameters: [],
      result: "u32"
    },


/**
 * Enumerate the HID Devices.
 *
 * This function returns a linked list of all the HID devices attached to the
 * system which match vendor_id and product_id. If `vendor_id` is set to 0
 * then any vendor matches. If `product_id` is set to 0 then any product
 * matches. If `vendor_id` and `product_id` are both set to 0, then all HID
 * devices will be returned.
 *
 * By default SDL will only enumerate controllers, to reduce risk of hanging
 * or crashing on bad drivers, but SDL_HINT_HIDAPI_ENUMERATE_ONLY_CONTROLLERS
 * can be set to "0" to enumerate all HID devices.
 *
 * @param vendor_id the Vendor ID (VID) of the types of device to open, or 0
 *                  to match any vendor.
 * @param product_id the Product ID (PID) of the types of device to open, or 0
 *                   to match any product.
 * @returns a pointer to a linked list of type SDL_hid_device_info, containing
 *          information about the HID devices attached to the system, or NULL
 *          in the case of failure. Free this linked list by calling
 *          SDL_hid_free_enumeration().
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_hid_device_change_count
 *
 * @from SDL_hidapi.h:239 SDL_hid_device_info * SDL_hid_enumerate(unsigned short vendor_id, unsigned short product_id);
 */
SDL_hid_enumerate: {
      parameters: ["i16", "i16"],
      result: "pointer"
    },


/**
 * Free an enumeration linked list.
 *
 * This function frees a linked list created by SDL_hid_enumerate().
 *
 * @param devs pointer to a list of struct_device returned from
 *             SDL_hid_enumerate().
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_hidapi.h:251 void SDL_hid_free_enumeration(SDL_hid_device_info *devs);
 */
SDL_hid_free_enumeration: {
      parameters: ["pointer"],
      result: "void"
    },


/**
 * Open a HID device using a Vendor ID (VID), Product ID (PID) and optionally
 * a serial number.
 *
 * If `serial_number` is NULL, the first device with the specified VID and PID
 * is opened.
 *
 * @param vendor_id the Vendor ID (VID) of the device to open.
 * @param product_id the Product ID (PID) of the device to open.
 * @param serial_number the Serial Number of the device to open (Optionally
 *                      NULL).
 * @returns a pointer to a SDL_hid_device object on success or NULL on
 *          failure; call SDL_GetError() for more information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_hidapi.h:269 SDL_hid_device * SDL_hid_open(unsigned short vendor_id, unsigned short product_id, const wchar_t *serial_number);
 */
SDL_hid_open: {
      parameters: ["i16", "i16", "pointer"],
      result: "pointer"
    },


/**
 * Open a HID device by its path name.
 *
 * The path name be determined by calling SDL_hid_enumerate(), or a
 * platform-specific path name can be used (eg: /dev/hidraw0 on Linux).
 *
 * @param path the path name of the device to open.
 * @returns a pointer to a SDL_hid_device object on success or NULL on
 *          failure; call SDL_GetError() for more information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_hidapi.h:283 SDL_hid_device * SDL_hid_open_path(const char *path);
 */
SDL_hid_open_path: {
      parameters: ["pointer"],
      result: "pointer"
    },


/**
 * Write an Output report to a HID device.
 *
 * The first byte of `data` must contain the Report ID. For devices which only
 * support a single report, this must be set to 0x0. The remaining bytes
 * contain the report data. Since the Report ID is mandatory, calls to
 * SDL_hid_write() will always contain one more byte than the report contains.
 * For example, if a hid report is 16 bytes long, 17 bytes must be passed to
 * SDL_hid_write(), the Report ID (or 0x0, for devices with a single report),
 * followed by the report data (16 bytes). In this example, the length passed
 * in would be 17.
 *
 * SDL_hid_write() will send the data on the first OUT endpoint, if one
 * exists. If it does not, it will send the data through the Control Endpoint
 * (Endpoint 0).
 *
 * @param dev a device handle returned from SDL_hid_open().
 * @param data the data to send, including the report number as the first
 *             byte.
 * @param length the length in bytes of the data to send.
 * @returns the actual number of bytes written and -1 on on failure; call
 *          SDL_GetError() for more information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_hidapi.h:310 int SDL_hid_write(SDL_hid_device *dev, const unsigned char *data, size_t length);
 */
SDL_hid_write: {
      parameters: ["pointer", "pointer", "usize"],
      result: "i32"
    },


/**
 * Read an Input report from a HID device with timeout.
 *
 * Input reports are returned to the host through the INTERRUPT IN endpoint.
 * The first byte will contain the Report number if the device uses numbered
 * reports.
 *
 * @param dev a device handle returned from SDL_hid_open().
 * @param data a buffer to put the read data into.
 * @param length the number of bytes to read. For devices with multiple
 *               reports, make sure to read an extra byte for the report
 *               number.
 * @param milliseconds timeout in milliseconds or -1 for blocking wait.
 * @returns the actual number of bytes read and -1 on on failure; call
 *          SDL_GetError() for more information. If no packet was available to
 *          be read within the timeout period, this function returns 0.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_hidapi.h:331 int SDL_hid_read_timeout(SDL_hid_device *dev, unsigned char *data, size_t length, int milliseconds);
 */
SDL_hid_read_timeout: {
      parameters: ["pointer", "pointer", "usize", "i32"],
      result: "i32"
    },


/**
 * Read an Input report from a HID device.
 *
 * Input reports are returned to the host through the INTERRUPT IN endpoint.
 * The first byte will contain the Report number if the device uses numbered
 * reports.
 *
 * @param dev a device handle returned from SDL_hid_open().
 * @param data a buffer to put the read data into.
 * @param length the number of bytes to read. For devices with multiple
 *               reports, make sure to read an extra byte for the report
 *               number.
 * @returns the actual number of bytes read and -1 on failure; call
 *          SDL_GetError() for more information. If no packet was available to
 *          be read and the handle is in non-blocking mode, this function
 *          returns 0.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_hidapi.h:352 int SDL_hid_read(SDL_hid_device *dev, unsigned char *data, size_t length);
 */
SDL_hid_read: {
      parameters: ["pointer", "pointer", "usize"],
      result: "i32"
    },


/**
 * Set the device handle to be non-blocking.
 *
 * In non-blocking mode calls to SDL_hid_read() will return immediately with a
 * value of 0 if there is no data to be read. In blocking mode, SDL_hid_read()
 * will wait (block) until there is data to read before returning.
 *
 * Nonblocking can be turned on and off at any time.
 *
 * @param dev a device handle returned from SDL_hid_open().
 * @param nonblock enable or not the nonblocking reads - 1 to enable
 *                 nonblocking - 0 to disable nonblocking.
 * @returns 0 on success or a negative error code on failure; call
 *          SDL_GetError() for more information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_hidapi.h:371 int SDL_hid_set_nonblocking(SDL_hid_device *dev, int nonblock);
 */
SDL_hid_set_nonblocking: {
      parameters: ["pointer", "i32"],
      result: "i32"
    },


/**
 * Send a Feature report to the device.
 *
 * Feature reports are sent over the Control endpoint as a Set_Report
 * transfer. The first byte of `data` must contain the Report ID. For devices
 * which only support a single report, this must be set to 0x0. The remaining
 * bytes contain the report data. Since the Report ID is mandatory, calls to
 * SDL_hid_send_feature_report() will always contain one more byte than the
 * report contains. For example, if a hid report is 16 bytes long, 17 bytes
 * must be passed to SDL_hid_send_feature_report(): the Report ID (or 0x0, for
 * devices which do not use numbered reports), followed by the report data (16
 * bytes). In this example, the length passed in would be 17.
 *
 * @param dev a device handle returned from SDL_hid_open().
 * @param data the data to send, including the report number as the first
 *             byte.
 * @param length the length in bytes of the data to send, including the report
 *               number.
 * @returns the actual number of bytes written and -1 on failure; call
 *          SDL_GetError() for more information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_hidapi.h:396 int SDL_hid_send_feature_report(SDL_hid_device *dev, const unsigned char *data, size_t length);
 */
SDL_hid_send_feature_report: {
      parameters: ["pointer", "pointer", "usize"],
      result: "i32"
    },


/**
 * Get a feature report from a HID device.
 *
 * Set the first byte of `data` to the Report ID of the report to be read.
 * Make sure to allow space for this extra byte in `data`. Upon return, the
 * first byte will still contain the Report ID, and the report data will start
 * in data[1].
 *
 * @param dev a device handle returned from SDL_hid_open().
 * @param data a buffer to put the read data into, including the Report ID.
 *             Set the first byte of `data` to the Report ID of the report to
 *             be read, or set it to zero if your device does not use numbered
 *             reports.
 * @param length the number of bytes to read, including an extra byte for the
 *               report ID. The buffer can be longer than the actual report.
 * @returns the number of bytes read plus one for the report ID (which is
 *          still in the first byte), or -1 on on failure; call SDL_GetError()
 *          for more information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_hidapi.h:419 int SDL_hid_get_feature_report(SDL_hid_device *dev, unsigned char *data, size_t length);
 */
SDL_hid_get_feature_report: {
      parameters: ["pointer", "pointer", "usize"],
      result: "i32"
    },


/**
 * Get an input report from a HID device.
 *
 * Set the first byte of `data` to the Report ID of the report to be read.
 * Make sure to allow space for this extra byte in `data`. Upon return, the
 * first byte will still contain the Report ID, and the report data will start
 * in data[1].
 *
 * @param dev a device handle returned from SDL_hid_open().
 * @param data a buffer to put the read data into, including the Report ID.
 *             Set the first byte of `data` to the Report ID of the report to
 *             be read, or set it to zero if your device does not use numbered
 *             reports.
 * @param length the number of bytes to read, including an extra byte for the
 *               report ID. The buffer can be longer than the actual report.
 * @returns the number of bytes read plus one for the report ID (which is
 *          still in the first byte), or -1 on on failure; call SDL_GetError()
 *          for more information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_hidapi.h:442 int SDL_hid_get_input_report(SDL_hid_device *dev, unsigned char *data, size_t length);
 */
SDL_hid_get_input_report: {
      parameters: ["pointer", "pointer", "usize"],
      result: "i32"
    },


/**
 * Close a HID device.
 *
 * @param dev a device handle returned from SDL_hid_open().
 * @returns 0 on success or a negative error code on failure; call
 *          SDL_GetError() for more information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_hidapi.h:453 int SDL_hid_close(SDL_hid_device *dev);
 */
SDL_hid_close: {
      parameters: ["pointer"],
      result: "i32"
    },


/**
 * Get The Manufacturer String from a HID device.
 *
 * @param dev a device handle returned from SDL_hid_open().
 * @param string a wide string buffer to put the data into.
 * @param maxlen the length of the buffer in multiples of wchar_t.
 * @returns 0 on success or a negative error code on failure; call
 *          SDL_GetError() for more information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_hidapi.h:466 int SDL_hid_get_manufacturer_string(SDL_hid_device *dev, wchar_t *string, size_t maxlen);
 */
SDL_hid_get_manufacturer_string: {
      parameters: ["pointer", "pointer", "usize"],
      result: "i32"
    },


/**
 * Get The Product String from a HID device.
 *
 * @param dev a device handle returned from SDL_hid_open().
 * @param string a wide string buffer to put the data into.
 * @param maxlen the length of the buffer in multiples of wchar_t.
 * @returns 0 on success or a negative error code on failure; call
 *          SDL_GetError() for more information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_hidapi.h:479 int SDL_hid_get_product_string(SDL_hid_device *dev, wchar_t *string, size_t maxlen);
 */
SDL_hid_get_product_string: {
      parameters: ["pointer", "pointer", "usize"],
      result: "i32"
    },


/**
 * Get The Serial Number String from a HID device.
 *
 * @param dev a device handle returned from SDL_hid_open().
 * @param string a wide string buffer to put the data into.
 * @param maxlen the length of the buffer in multiples of wchar_t.
 * @returns 0 on success or a negative error code on failure; call
 *          SDL_GetError() for more information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_hidapi.h:492 int SDL_hid_get_serial_number_string(SDL_hid_device *dev, wchar_t *string, size_t maxlen);
 */
SDL_hid_get_serial_number_string: {
      parameters: ["pointer", "pointer", "usize"],
      result: "i32"
    },


/**
 * Get a string from a HID device, based on its string index.
 *
 * @param dev a device handle returned from SDL_hid_open().
 * @param string_index the index of the string to get.
 * @param string a wide string buffer to put the data into.
 * @param maxlen the length of the buffer in multiples of wchar_t.
 * @returns 0 on success or a negative error code on failure; call
 *          SDL_GetError() for more information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_hidapi.h:506 int SDL_hid_get_indexed_string(SDL_hid_device *dev, int string_index, wchar_t *string, size_t maxlen);
 */
SDL_hid_get_indexed_string: {
      parameters: ["pointer", "i32", "pointer", "usize"],
      result: "i32"
    },


/**
 * Get the device info from a HID device.
 *
 * @param dev a device handle returned from SDL_hid_open().
 * @returns a pointer to the SDL_hid_device_info for this hid_device or NULL
 *          on failure; call SDL_GetError() for more information. This struct
 *          is valid until the device is closed with SDL_hid_close().
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_hidapi.h:518 SDL_hid_device_info * SDL_hid_get_device_info(SDL_hid_device *dev);
 */
SDL_hid_get_device_info: {
      parameters: ["pointer"],
      result: "pointer"
    },


/**
 * Get a report descriptor from a HID device.
 *
 * User has to provide a preallocated buffer where descriptor will be copied
 * to. The recommended size for a preallocated buffer is 4096 bytes.
 *
 * @param dev a device handle returned from SDL_hid_open().
 * @param buf the buffer to copy descriptor into.
 * @param buf_size the size of the buffer in bytes.
 * @returns the number of bytes actually copied or -1 on failure; call
 *          SDL_GetError() for more information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_hidapi.h:534 int SDL_hid_get_report_descriptor(SDL_hid_device *dev, unsigned char *buf, size_t buf_size);
 */
SDL_hid_get_report_descriptor: {
      parameters: ["pointer", "pointer", "usize"],
      result: "i32"
    },


/**
 * Start or stop a BLE scan on iOS and tvOS to pair Steam Controllers.
 *
 * @param active true to start the scan, false to stop the scan.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_hidapi.h:543 void SDL_hid_ble_scan(bool active);
 */
SDL_hid_ble_scan: {
      parameters: ["bool"],
      result: "void"
    },

} as const satisfies Deno.ForeignLibraryInterface;
