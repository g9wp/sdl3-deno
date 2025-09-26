import * as SDL_atomic from './symbols/SDL_atomic.ts';
export * from './SDL_atomic.ts';
import * as SDL_audio from './symbols/SDL_audio.ts';
export * from './SDL_audio.ts';
import * as SDL_clipboard from './symbols/SDL_clipboard.ts';
export * from './SDL_clipboard.ts';
import * as SDL_dialog from './symbols/SDL_dialog.ts';
export * from './SDL_dialog.ts';
import * as SDL_events from './symbols/SDL_events.ts';
export * from './SDL_events.ts';
import * as SDL_filesystem from './symbols/SDL_filesystem.ts';
export * from './SDL_filesystem.ts';
import * as SDL_hints from './symbols/SDL_hints.ts';
export * from './SDL_hints.ts';
import * as SDL_init from './symbols/SDL_init.ts';
export * from './SDL_init.ts';
import * as SDL_log from './symbols/SDL_log.ts';
export * from './SDL_log.ts';
import * as SDL_properties from './symbols/SDL_properties.ts';
export * from './SDL_properties.ts';
import * as SDL_stdinc from './symbols/SDL_stdinc.ts';
export * from './SDL_stdinc.ts';
import * as SDL_system from './symbols/SDL_system.ts';
export * from './SDL_system.ts';
import * as SDL_thread from './symbols/SDL_thread.ts';
export * from './SDL_thread.ts';
import * as SDL_timer from './symbols/SDL_timer.ts';
export * from './SDL_timer.ts';
import * as SDL_tray from './symbols/SDL_tray.ts';
export * from './SDL_tray.ts';
import * as SDL_video from './symbols/SDL_video.ts';
export * from './SDL_video.ts';


export const symbols = {
  ...SDL_atomic.symbols,
  ...SDL_audio.symbols,
  ...SDL_clipboard.symbols,
  ...SDL_dialog.symbols,
  ...SDL_events.symbols,
  ...SDL_filesystem.symbols,
  ...SDL_hints.symbols,
  ...SDL_init.symbols,
  ...SDL_log.symbols,
  ...SDL_properties.symbols,
  ...SDL_stdinc.symbols,
  ...SDL_system.symbols,
  ...SDL_thread.symbols,
  ...SDL_timer.symbols,
  ...SDL_tray.symbols,
  ...SDL_video.symbols,
} as const satisfies Deno.ForeignLibraryInterface;
