/**
 * # CategoryVulkan
 *
 * Functions for creating Vulkan surfaces on SDL windows.
 *
 * For the most part, Vulkan operates independent of SDL, but it benefits from
 * a little support during setup.
 *
 * Use SDL_Vulkan_GetInstanceExtensions() to get platform-specific bits for
 * creating a VkInstance, then SDL_Vulkan_GetVkGetInstanceProcAddr() to get
 * the appropriate function for querying Vulkan entry points. Then
 * SDL_Vulkan_CreateSurface() will get you the final pieces you need to
 * prepare for rendering into an SDL_Window with Vulkan.
 *
 * Unlike OpenGL, most of the details of "context" creation and window buffer
 * swapping are handled by the Vulkan API directly, so SDL doesn't provide
 * Vulkan equivalents of SDL_GL_SwapWindow(), etc; they aren't necessary.
 *
 * @module
 */

/*
  Simple DirectMedia Layer
  Copyright (C) 2017, Mark Callow

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


/**
 * Dynamically load the Vulkan loader library.
 *
 * This should be called after initializing the video driver, but before
 * creating any Vulkan windows. If no Vulkan loader library is loaded, the
 * default library will be loaded upon creation of the first Vulkan window.
 *
 * SDL keeps a counter of how many times this function has been successfully
 * called, so it is safe to call this function multiple times, so long as it
 * is eventually paired with an equivalent number of calls to
 * SDL_Vulkan_UnloadLibrary. The `path` argument is ignored unless there is no
 * library currently loaded, and and the library isn't actually unloaded until
 * there have been an equivalent number of calls to SDL_Vulkan_UnloadLibrary.
 *
 * It is fairly common for Vulkan applications to link with libvulkan instead
 * of explicitly loading it at run time. This will work with SDL provided the
 * application links to a dynamic library and both it and SDL use the same
 * search path.
 *
 * If you specify a non-NULL `path`, an application should retrieve all of the
 * Vulkan functions it uses from the dynamic library using
 * SDL_Vulkan_GetVkGetInstanceProcAddr unless you can guarantee `path` points
 * to the same vulkan loader library the application linked to.
 *
 * On Apple devices, if `path` is NULL, SDL will attempt to find the
 * `vkGetInstanceProcAddr` address within all the Mach-O images of the current
 * process. This is because it is fairly common for Vulkan applications to
 * link with libvulkan (and historically MoltenVK was provided as a static
 * library). If it is not found, on macOS, SDL will attempt to load
 * `vulkan.framework/vulkan`, `libvulkan.1.dylib`,
 * `MoltenVK.framework/MoltenVK`, and `libMoltenVK.dylib`, in that order. On
 * iOS, SDL will attempt to load `libMoltenVK.dylib`. Applications using a
 * dynamic framework or .dylib must ensure it is included in its application
 * bundle.
 *
 * On non-Apple devices, application linking with a static libvulkan is not
 * supported. Either do not link to the Vulkan loader or link to a dynamic
 * library version.
 *
 * @param path the platform dependent Vulkan loader library name or NULL.
 * @returns true on success or false on failure; call SDL_GetError() for more
 *          information.
 *
 * @threadsafety This function is not thread safe.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_Vulkan_GetVkGetInstanceProcAddr
 * @sa SDL_Vulkan_UnloadLibrary
 *
 * @from SDL_vulkan.h:132 bool SDL_Vulkan_LoadLibrary(const char *path);
 */
export function vulkanLoadLibrary(path: string): boolean {
  return lib.symbols.SDL_Vulkan_LoadLibrary(_p.toCstr(path));
}

/**
 * Get the address of the `vkGetInstanceProcAddr` function.
 *
 * This should be called after either calling SDL_Vulkan_LoadLibrary() or
 * creating an SDL_Window with the `SDL_WINDOW_VULKAN` flag.
 *
 * The actual type of the returned function pointer is
 * PFN_vkGetInstanceProcAddr, but that isn't available because the Vulkan
 * headers are not included here. You should cast the return value of this
 * function to that type, e.g.
 *
 * `vkGetInstanceProcAddr =
 * (PFN_vkGetInstanceProcAddr)SDL_Vulkan_GetVkGetInstanceProcAddr();`
 *
 * @returns the function pointer for `vkGetInstanceProcAddr` or NULL on
 *          failure; call SDL_GetError() for more information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_vulkan.h:153 SDL_FunctionPointer SDL_Vulkan_GetVkGetInstanceProcAddr(void);
 */
export function vulkanGetVkGetInstanceProcAddr(): Deno.PointerValue {
  return lib.symbols.SDL_Vulkan_GetVkGetInstanceProcAddr();
}

/**
 * Unload the Vulkan library previously loaded by SDL_Vulkan_LoadLibrary().
 *
 * SDL keeps a counter of how many times this function has been called, so it
 * is safe to call this function multiple times, so long as it is paired with
 * an equivalent number of calls to SDL_Vulkan_LoadLibrary. The library isn't
 * actually unloaded until there have been an equivalent number of calls to
 * SDL_Vulkan_UnloadLibrary.
 *
 * Once the library has actually been unloaded, if any Vulkan instances
 * remain, they will likely crash the program. Clean up any existing Vulkan
 * resources, and destroy appropriate windows, renderers and GPU devices
 * before calling this function.
 *
 * @threadsafety This function is not thread safe.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_Vulkan_LoadLibrary
 *
 * @from SDL_vulkan.h:175 void SDL_Vulkan_UnloadLibrary(void);
 */
export function vulkanUnloadLibrary(): void {
  return lib.symbols.SDL_Vulkan_UnloadLibrary();
}

/**
 * Get the Vulkan instance extensions needed for vkCreateInstance.
 *
 * This should be called after either calling SDL_Vulkan_LoadLibrary() or
 * creating an SDL_Window with the `SDL_WINDOW_VULKAN` flag.
 *
 * On return, the variable pointed to by `count` will be set to the number of
 * elements returned, suitable for using with
 * VkInstanceCreateInfo::enabledExtensionCount, and the returned array can be
 * used with VkInstanceCreateInfo::ppEnabledExtensionNames, for calling
 * Vulkan's vkCreateInstance API.
 *
 * You should not free the returned array; it is owned by SDL.
 *
 * @param count a pointer filled in with the number of extensions returned.
 * @returns an array of extension name strings on success, NULL on failure;
 *          call SDL_GetError() for more information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_Vulkan_CreateSurface
 *
 * @from SDL_vulkan.h:199 char const * const * SDL_Vulkan_GetInstanceExtensions(Uint32 *count);
 */
export function vulkanGetInstanceExtensions(): { count: number; ret: Deno.PointerValue } {
  const ret = lib.symbols.SDL_Vulkan_GetInstanceExtensions(_p.u32.p0) as Deno.PointerValue;
  if(!ret) throw new Error(`SDL_Vulkan_GetInstanceExtensions: ${_p.getCstr2(lib.symbols.SDL_GetError())}`);
  return { count: _p.u32.v0, ret };
}

