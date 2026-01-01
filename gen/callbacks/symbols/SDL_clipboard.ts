/**
 * # CategoryClipboard
 *
 * SDL provides access to the system clipboard, both for reading information
 * from other processes and publishing information of its own.
 *
 * This is not just text! SDL apps can access and publish data by mimetype.
 *
 * ## Basic use (text)
 *
 * Obtaining and publishing simple text to the system clipboard is as easy as
 * calling SDL_GetClipboardText() and SDL_SetClipboardText(), respectively.
 * These deal with C strings in UTF-8 encoding. Data transmission and encoding
 * conversion is completely managed by SDL.
 *
 * ## Clipboard callbacks (data other than text)
 *
 * Things get more complicated when the clipboard contains something other
 * than text. Not only can the system clipboard contain data of any type, in
 * some cases it can contain the same data in different formats! For example,
 * an image painting app might let the user copy a graphic to the clipboard,
 * and offers it in .BMP, .JPG, or .PNG format for other apps to consume.
 *
 * Obtaining clipboard data ("pasting") like this is a matter of calling
 * SDL_GetClipboardData() and telling it the mimetype of the data you want.
 * But how does one know if that format is available? SDL_HasClipboardData()
 * can report if a specific mimetype is offered, and
 * SDL_GetClipboardMimeTypes() can provide the entire list of mimetypes
 * available, so the app can decide what to do with the data and what formats
 * it can support.
 *
 * Setting the clipboard ("copying") to arbitrary data is done with
 * SDL_SetClipboardData. The app does not provide the data in this call, but
 * rather the mimetypes it is willing to provide and a callback function.
 * During the callback, the app will generate the data. This allows massive
 * data sets to be provided to the clipboard, without any data being copied
 * before it is explicitly requested. More specifically, it allows an app to
 * offer data in multiple formats without providing a copy of all of them
 * upfront. If the app has an image that it could provide in PNG or JPG
 * format, it doesn't have to encode it to either of those unless and until
 * something tries to paste it.
 *
 * ## Primary Selection
 *
 * The X11 and Wayland video targets have a concept of the "primary selection"
 * in addition to the usual clipboard. This is generally highlighted (but not
 * explicitly copied) text from various apps. SDL offers APIs for this through
 * SDL_GetPrimarySelectionText() and SDL_SetPrimarySelectionText(). SDL offers
 * these APIs on platforms without this concept, too, but only so far that it
 * will keep a copy of a string that the app sets for later retrieval; the
 * operating system will not ever attempt to change the string externally if
 * it doesn't support a primary selection.
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
 * Callback function that will be called when data for the specified mime-type
 * is requested by the OS.
 *
 * The callback function is called with NULL as the mime_type when the
 * clipboard is cleared or new data is set. The clipboard is automatically
 * cleared in SDL_Quit().
 *
 * @param userdata a pointer to the provided user data.
 * @param mime_type the requested mime-type.
 * @param size a pointer filled in with the length of the returned data.
 * @returns a pointer to the data for the provided mime-type. Returning NULL
 *          or setting the length to 0 will cause zero length data to be sent
 *          to the "receiver", which should be able to handle this. The
 *          returned data will not be freed, so it needs to be retained and
 *          dealt with internally.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_SetClipboardData
 *
 * @from SDL_clipboard.h:209 typedef const void *(*SDL_ClipboardDataCallback)(void *userdata, const char *mime_type, size_t *size);
 */
SDL_ClipboardDataCallback: {
      parameters: ["pointer", "pointer", "pointer"],
      result: "pointer"
    },

/**
 * Callback function that will be called when the clipboard is cleared, or
 * when new data is set.
 *
 * @param userdata a pointer to the provided user data.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_SetClipboardData
 *
 * @from SDL_clipboard.h:221 typedef void (*SDL_ClipboardCleanupCallback)(void *userdata);
 */
SDL_ClipboardCleanupCallback: {
      parameters: ["pointer"],
      result: "void"
    },

} as const satisfies Deno.ForeignLibraryInterface;


/**
 * Callback function that will be called when data for the specified mime-type
 * is requested by the OS.
 *
 * The callback function is called with NULL as the mime_type when the
 * clipboard is cleared or new data is set. The clipboard is automatically
 * cleared in SDL_Quit().
 *
 * @param userdata a pointer to the provided user data.
 * @param mime_type the requested mime-type.
 * @param size a pointer filled in with the length of the returned data.
 * @returns a pointer to the data for the provided mime-type. Returning NULL
 *          or setting the length to 0 will cause zero length data to be sent
 *          to the "receiver", which should be able to handle this. The
 *          returned data will not be freed, so it needs to be retained and
 *          dealt with internally.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_SetClipboardData
 *
 * @from SDL_clipboard.h:209 typedef const void *(*SDL_ClipboardDataCallback)(void *userdata, const char *mime_type, size_t *size);
 */
export function ClipboardDataCallback(cb: (
    userdata: Deno.PointerValue, 
    mime_type: Deno.PointerValue, 
    size: Deno.PointerValue, 
  ) => Deno.PointerValue) {
  return new Deno.UnsafeCallback(symbols.SDL_ClipboardDataCallback, cb);
}

/**
 * Callback function that will be called when the clipboard is cleared, or
 * when new data is set.
 *
 * @param userdata a pointer to the provided user data.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_SetClipboardData
 *
 * @from SDL_clipboard.h:221 typedef void (*SDL_ClipboardCleanupCallback)(void *userdata);
 */
export function ClipboardCleanupCallback(cb: (
    userdata: Deno.PointerValue, 
  ) => void) {
  return new Deno.UnsafeCallback(symbols.SDL_ClipboardCleanupCallback, cb);
}

