import * as SDL_atomic from './SDL_atomic.ts'
import * as SDL_audio from './SDL_audio.ts'
import * as SDL_clipboard from './SDL_clipboard.ts'
import * as SDL_dialog from './SDL_dialog.ts'
import * as SDL_events from './SDL_events.ts'
import * as SDL_filesystem from './SDL_filesystem.ts'
import * as SDL_hints from './SDL_hints.ts'
import * as SDL_init from './SDL_init.ts'
import * as SDL_log from './SDL_log.ts'
import * as SDL_properties from './SDL_properties.ts'
import * as SDL_stdinc from './SDL_stdinc.ts'
import * as SDL_system from './SDL_system.ts'
import * as SDL_thread from './SDL_thread.ts'
import * as SDL_timer from './SDL_timer.ts'
import * as SDL_tray from './SDL_tray.ts'
import * as SDL_video from './SDL_video.ts'


export const callbacks = {
  ...SDL_atomic.callbacks,
  ...SDL_audio.callbacks,
  ...SDL_clipboard.callbacks,
  ...SDL_dialog.callbacks,
  ...SDL_events.callbacks,
  ...SDL_filesystem.callbacks,
  ...SDL_hints.callbacks,
  ...SDL_init.callbacks,
  ...SDL_log.callbacks,
  ...SDL_properties.callbacks,
  ...SDL_stdinc.callbacks,
  ...SDL_system.callbacks,
  ...SDL_thread.callbacks,
  ...SDL_timer.callbacks,
  ...SDL_tray.callbacks,
  ...SDL_video.callbacks,
} as const;
