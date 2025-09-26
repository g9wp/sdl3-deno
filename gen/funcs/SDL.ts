import * as SDL_assert from './SDL_assert.ts';
import * as SDL_asyncio from './SDL_asyncio.ts';
import * as SDL_atomic from './SDL_atomic.ts';
import * as SDL_audio from './SDL_audio.ts';
import * as SDL_blendmode from './SDL_blendmode.ts';
import * as SDL_camera from './SDL_camera.ts';
import * as SDL_clipboard from './SDL_clipboard.ts';
import * as SDL_cpuinfo from './SDL_cpuinfo.ts';
import * as SDL_dialog from './SDL_dialog.ts';
import * as SDL_error from './SDL_error.ts';
import * as SDL_events from './SDL_events.ts';
import * as SDL_filesystem from './SDL_filesystem.ts';
import * as SDL_gamepad from './SDL_gamepad.ts';
import * as SDL_gpu from './SDL_gpu.ts';
import * as SDL_guid from './SDL_guid.ts';
import * as SDL_haptic from './SDL_haptic.ts';
import * as SDL_hidapi from './SDL_hidapi.ts';
import * as SDL_hints from './SDL_hints.ts';
import * as SDL_init from './SDL_init.ts';
import * as SDL_iostream from './SDL_iostream.ts';
import * as SDL_joystick from './SDL_joystick.ts';
import * as SDL_keyboard from './SDL_keyboard.ts';
import * as SDL_loadso from './SDL_loadso.ts';
import * as SDL_locale from './SDL_locale.ts';
import * as SDL_log from './SDL_log.ts';
import * as SDL_messagebox from './SDL_messagebox.ts';
import * as SDL_misc from './SDL_misc.ts';
import * as SDL_mouse from './SDL_mouse.ts';
import * as SDL_pixels from './SDL_pixels.ts';
import * as SDL_platform from './SDL_platform.ts';
import * as SDL_power from './SDL_power.ts';
import * as SDL_process from './SDL_process.ts';
import * as SDL_properties from './SDL_properties.ts';
import * as SDL_rect from './SDL_rect.ts';
import * as SDL_render from './SDL_render.ts';
import * as SDL_sensor from './SDL_sensor.ts';
import * as SDL_stdinc from './SDL_stdinc.ts';
import * as SDL_storage from './SDL_storage.ts';
import * as SDL_surface from './SDL_surface.ts';
import * as SDL_system from './SDL_system.ts';
import * as SDL_thread from './SDL_thread.ts';
import * as SDL_time from './SDL_time.ts';
import * as SDL_timer from './SDL_timer.ts';
import * as SDL_touch from './SDL_touch.ts';
import * as SDL_tray from './SDL_tray.ts';
import * as SDL_version from './SDL_version.ts';
import * as SDL_video from './SDL_video.ts';
import * as SDL_vulkan from './SDL_vulkan.ts';

import { isPlatform } from '../_utils.ts';

export const symbols = {
  ...SDL_assert.symbols,
  ...SDL_asyncio.symbols,
  ...SDL_atomic.symbols,
  ...SDL_audio.symbols,
  ...SDL_blendmode.symbols,
  ...SDL_camera.symbols,
  ...SDL_clipboard.symbols,
  ...SDL_cpuinfo.symbols,
  ...SDL_dialog.symbols,
  ...SDL_error.symbols,
  ...SDL_events.symbols,
  ...SDL_filesystem.symbols,
  ...SDL_gamepad.symbols,
  ...SDL_gpu.symbols,
  ...isPlatform('GDK') ? SDL_gpu.GDK_symbols : {},
  ...SDL_guid.symbols,
  ...SDL_haptic.symbols,
  ...SDL_hidapi.symbols,
  ...SDL_hints.symbols,
  ...SDL_init.symbols,
  ...SDL_iostream.symbols,
  ...SDL_joystick.symbols,
  ...SDL_keyboard.symbols,
  ...SDL_loadso.symbols,
  ...SDL_locale.symbols,
  ...SDL_log.symbols,
  ...SDL_messagebox.symbols,
  ...SDL_misc.symbols,
  ...SDL_mouse.symbols,
  ...SDL_pixels.symbols,
  ...SDL_platform.symbols,
  ...SDL_power.symbols,
  ...SDL_process.symbols,
  ...SDL_properties.symbols,
  ...SDL_rect.symbols,
  ...SDL_render.symbols,
  ...SDL_sensor.symbols,
  ...SDL_stdinc.symbols,
  ...SDL_storage.symbols,
  ...SDL_surface.symbols,
  ...isPlatform('WINDOWS') ? SDL_system.WINDOWS_symbols : {},
  ...isPlatform('WIN32') ? SDL_system.WIN32_symbols : {},
  ...SDL_system.symbols,
  ...isPlatform('LINUX') ? SDL_system.LINUX_symbols : {},
  ...isPlatform('IOS') ? SDL_system.IOS_symbols : {},
  ...isPlatform('ANDROID') ? SDL_system.ANDROID_symbols : {},
  ...isPlatform('GDK') ? SDL_system.GDK_symbols : {},
  ...SDL_thread.symbols,
  ...SDL_time.symbols,
  ...SDL_timer.symbols,
  ...SDL_touch.symbols,
  ...SDL_tray.symbols,
  ...SDL_version.symbols,
  ...SDL_video.symbols,
  ...SDL_vulkan.symbols,
} as const satisfies Deno.ForeignLibraryInterface;
