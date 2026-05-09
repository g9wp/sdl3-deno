/**
 * # CategoryStorage
 *
 * The storage API is a high-level API designed to abstract away the
 * portability issues that come up when using something lower-level (in SDL's
 * case, this sits on top of the [Filesystem](CategoryFilesystem) and
 * [IOStream](CategoryIOStream) subsystems). It is significantly more
 * restrictive than a typical filesystem API, for a number of reasons:
 *
 * 1. **What to Access:** A common pitfall with existing filesystem APIs is
 * the assumption that all storage is monolithic. However, many other
 * platforms (game consoles in particular) are more strict about what _type_
 * of filesystem is being accessed; for example, game content and user data
 * are usually two separate storage devices with entirely different
 * characteristics (and possibly different low-level APIs altogether!).
 *
 * 2. **How to Access:** Another common mistake is applications assuming that
 * all storage is universally writeable - again, many platforms treat game
 * content and user data as two separate storage devices, and only user data
 * is writeable while game content is read-only.
 *
 * 3. **When to Access:** The most common portability issue with filesystem
 * access is _timing_ - you cannot always assume that the storage device is
 * always accessible all of the time, nor can you assume that there are no
 * limits to how long you have access to a particular device.
 *
 * Consider the following example:
 *
 * ```c
 * void ReadGameData(void)
 * {
 *     extern char** fileNames;
 *     extern size_t numFiles;
 *     for (size_t i = 0; i < numFiles; i += 1) {
 *         FILE *data = fopen(fileNames[i], "rwb");
 *         if (data == NULL) {
 *             // Something bad happened!
 *         } else {
 *             // A bunch of stuff happens here
 *             fclose(data);
 *         }
 *     }
 * }
 *
 * void ReadSave(void)
 * {
 *     FILE *save = fopen("saves/save0.sav", "rb");
 *     if (save == NULL) {
 *         // Something bad happened!
 *     } else {
 *         // A bunch of stuff happens here
 *         fclose(save);
 *     }
 * }
 *
 * void WriteSave(void)
 * {
 *     FILE *save = fopen("saves/save0.sav", "wb");
 *     if (save == NULL) {
 *         // Something bad happened!
 *     } else {
 *         // A bunch of stuff happens here
 *         fclose(save);
 *     }
 * }
 * ```
 *
 * Going over the bullet points again:
 *
 * 1. **What to Access:** This code accesses a global filesystem; game data
 * and saves are all presumed to be in the current working directory (which
 * may or may not be the game's installation folder!).
 *
 * 2. **How to Access:** This code assumes that content paths are writeable,
 * and that save data is also writeable despite being in the same location as
 * the game data.
 *
 * 3. **When to Access:** This code assumes that they can be called at any
 * time, since the filesystem is always accessible and has no limits on how
 * long the filesystem is being accessed.
 *
 * Due to these assumptions, the filesystem code is not portable and will fail
 * under these common scenarios:
 *
 * - The game is installed on a device that is read-only, both content loading
 *   and game saves will fail or crash outright
 * - Game/User storage is not implicitly mounted, so no files will be found
 *   for either scenario when a platform requires explicitly mounting
 *   filesystems
 * - Save data may not be safe since the I/O is not being flushed or
 *   validated, so an error occurring elsewhere in the program may result in
 *   missing/corrupted save data
 *
 * When using SDL_Storage, these types of problems are virtually impossible to
 * trip over:
 *
 * ```c
 * void ReadGameData(void)
 * {
 *     extern char** fileNames;
 *     extern size_t numFiles;
 *
 *     SDL_Storage *title = SDL_OpenTitleStorage(NULL, 0);
 *     if (title == NULL) {
 *         // Something bad happened!
 *     }
 *     while (!SDL_StorageReady(title)) {
 *         SDL_Delay(1);
 *     }
 *
 *     for (size_t i = 0; i < numFiles; i += 1) {
 *         void* dst;
 *         Uint64 dstLen = 0;
 *
 *         if (SDL_GetStorageFileSize(title, fileNames[i], &dstLen) && dstLen > 0) {
 *             dst = SDL_malloc(dstLen);
 *             if (SDL_ReadStorageFile(title, fileNames[i], dst, dstLen)) {
 *                 // A bunch of stuff happens here
 *             } else {
 *                 // Something bad happened!
 *             }
 *             SDL_free(dst);
 *         } else {
 *             // Something bad happened!
 *         }
 *     }
 *
 *     SDL_CloseStorage(title);
 * }
 *
 * void ReadSave(void)
 * {
 *     SDL_Storage *user = SDL_OpenUserStorage("libsdl", "Storage Example", 0);
 *     if (user == NULL) {
 *         // Something bad happened!
 *     }
 *     while (!SDL_StorageReady(user)) {
 *         SDL_Delay(1);
 *     }
 *
 *     Uint64 saveLen = 0;
 *     if (SDL_GetStorageFileSize(user, "save0.sav", &saveLen) && saveLen > 0) {
 *         void* dst = SDL_malloc(saveLen);
 *         if (SDL_ReadStorageFile(user, "save0.sav", dst, saveLen)) {
 *             // A bunch of stuff happens here
 *         } else {
 *             // Something bad happened!
 *         }
 *         SDL_free(dst);
 *     } else {
 *         // Something bad happened!
 *     }
 *
 *     SDL_CloseStorage(user);
 * }
 *
 * void WriteSave(void)
 * {
 *     SDL_Storage *user = SDL_OpenUserStorage("libsdl", "Storage Example", 0);
 *     if (user == NULL) {
 *         // Something bad happened!
 *     }
 *     while (!SDL_StorageReady(user)) {
 *         SDL_Delay(1);
 *     }
 *
 *     extern void *saveData; // A bunch of stuff happened here...
 *     extern Uint64 saveLen;
 *     if (!SDL_WriteStorageFile(user, "save0.sav", saveData, saveLen)) {
 *         // Something bad happened!
 *     }
 *
 *     SDL_CloseStorage(user);
 * }
 * ```
 *
 * Note the improvements that SDL_Storage makes:
 *
 * 1. **What to Access:** This code explicitly reads from a title or user
 * storage device based on the context of the function.
 *
 * 2. **How to Access:** This code explicitly uses either a read or write
 * function based on the context of the function.
 *
 * 3. **When to Access:** This code explicitly opens the device when it needs
 * to, and closes it when it is finished working with the filesystem.
 *
 * The result is an application that is significantly more robust against the
 * increasing demands of platforms and their filesystems!
 *
 * A publicly available example of an SDL_Storage backend is the
 * [Steam Cloud](https://partner.steamgames.com/doc/features/cloud)
 * backend - you can initialize Steamworks when starting the program, and then
 * SDL will recognize that Steamworks is initialized and automatically use
 * ISteamRemoteStorage when the application opens user storage. More
 * importantly, when you _open_ storage it knows to begin a "batch" of
 * filesystem operations, and when you _close_ storage it knows to end and
 * flush the batch. This is used by Steam to support
 * [Dynamic Cloud Sync](https://steamcommunity.com/groups/steamworks/announcements/detail/3142949576401813670)
 * ; users can save data on one PC, put the device to sleep, and then continue
 * playing on another PC (and vice versa) with the save data fully
 * synchronized across all devices, allowing for a seamless experience without
 * having to do full restarts of the program.
 *
 * ## Notes on valid paths
 *
 * All paths in the Storage API use Unix-style path separators ('/'). Using a
 * different path separator will not work, even if the underlying platform
 * would otherwise accept it. This is to keep code using the Storage API
 * portable between platforms and Storage implementations and simplify app
 * code.
 *
 * Paths with relative directories ("." and "..") are forbidden by the Storage
 * API.
 *
 * All valid UTF-8 strings (discounting the NULL terminator character and the
 * '/' path separator) are usable for filenames, however, an underlying
 * Storage implementation may not support particularly strange sequences and
 * refuse to create files with those names, etc.
 *
 * @module
 */

/*
  Simple DirectMedia Layer
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

import * as _ from "@denosaurs/byte-type";


/**
 * Function interface for SDL_Storage.
 *
 * Apps that want to supply a custom implementation of SDL_Storage will fill
 * in all the functions in this struct, and then pass it to SDL_OpenStorage to
 * create a custom SDL_Storage object.
 *
 * It is not usually necessary to do this; SDL provides standard
 * implementations for many things you might expect to do with an SDL_Storage.
 *
 * This structure should be initialized using SDL_INIT_INTERFACE()
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @sa SDL_INIT_INTERFACE
 *
 * @from SDL_storage.h:273
 */
export const SDL_StorageInterface = new _.Struct({
    /* The version of this interface */
  version: _.u32, /* Uint32 */
    /* Called when the storage is closed */
  close: _.u64, /*     bool (SDLCALL *close)(void *userdata); */
    /* Optional, returns whether the storage is currently ready for access */
  ready: _.u64, /*     bool (SDLCALL *ready)(void *userdata); */
    /* Enumerate a directory, optional for write-only storage */
  enumerate: _.u64, /*     bool (SDLCALL *enumerate)(void *userdata, const char *path, SDL_EnumerateDirectoryCallback callback, void *callback_userdata); */
    /* Get path information, optional for write-only storage */
  info: _.u64, /*     bool (SDLCALL *info)(void *userdata, const char *path, SDL_PathInfo *info); */
    /* Read a file from storage, optional for write-only storage */
  read_file: _.u64, /*     bool (SDLCALL *read_file)(void *userdata, const char *path, void *destination, Uint64 length); */
    /* Write a file to storage, optional for read-only storage */
  write_file: _.u64, /*     bool (SDLCALL *write_file)(void *userdata, const char *path, const void *source, Uint64 length); */
    /* Create a directory, optional for read-only storage */
  mkdir: _.u64, /*     bool (SDLCALL *mkdir)(void *userdata, const char *path); */
    /* Remove a file or empty directory, optional for read-only storage */
  remove: _.u64, /*     bool (SDLCALL *remove)(void *userdata, const char *path); */
    /* Rename a path, optional for read-only storage */
  rename: _.u64, /*     bool (SDLCALL *rename)(void *userdata, const char *oldpath, const char *newpath); */
    /* Copy a file, optional for read-only storage */
  copy: _.u64, /*     bool (SDLCALL *copy)(void *userdata, const char *oldpath, const char *newpath); */
    /* Get the space remaining, optional for read-only storage */
  space_remaining: _.u64, /*     Uint64 (SDLCALL *space_remaining)(void *userdata); */
});



