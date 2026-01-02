/**
 * # CategoryAudio
 *
 * Audio functionality for the SDL library.
 *
 * All audio in SDL3 revolves around SDL_AudioStream. Whether you want to play
 * or record audio, convert it, stream it, buffer it, or mix it, you're going
 * to be passing it through an audio stream.
 *
 * Audio streams are quite flexible; they can accept any amount of data at a
 * time, in any supported format, and output it as needed in any other format,
 * even if the data format changes on either side halfway through.
 *
 * An app opens an audio device and binds any number of audio streams to it,
 * feeding more data to the streams as available. When the device needs more
 * data, it will pull it from all bound streams and mix them together for
 * playback.
 *
 * Audio streams can also use an app-provided callback to supply data
 * on-demand, which maps pretty closely to the SDL2 audio model.
 *
 * SDL also provides a simple .WAV loader in SDL_LoadWAV (and SDL_LoadWAV_IO
 * if you aren't reading from a file) as a basic means to load sound data into
 * your program.
 *
 * ## Logical audio devices
 *
 * In SDL3, opening a physical device (like a SoundBlaster 16 Pro) gives you a
 * logical device ID that you can bind audio streams to. In almost all cases,
 * logical devices can be used anywhere in the API that a physical device is
 * normally used. However, since each device opening generates a new logical
 * device, different parts of the program (say, a VoIP library, or
 * text-to-speech framework, or maybe some other sort of mixer on top of SDL)
 * can have their own device opens that do not interfere with each other; each
 * logical device will mix its separate audio down to a single buffer, fed to
 * the physical device, behind the scenes. As many logical devices as you like
 * can come and go; SDL will only have to open the physical device at the OS
 * level once, and will manage all the logical devices on top of it
 * internally.
 *
 * One other benefit of logical devices: if you don't open a specific physical
 * device, instead opting for the default, SDL can automatically migrate those
 * logical devices to different hardware as circumstances change: a user
 * plugged in headphones? The system default changed? SDL can transparently
 * migrate the logical devices to the correct physical device seamlessly and
 * keep playing; the app doesn't even have to know it happened if it doesn't
 * want to.
 *
 * ## Simplified audio
 *
 * As a simplified model for when a single source of audio is all that's
 * needed, an app can use SDL_OpenAudioDeviceStream, which is a single
 * function to open an audio device, create an audio stream, bind that stream
 * to the newly-opened device, and (optionally) provide a callback for
 * obtaining audio data. When using this function, the primary interface is
 * the SDL_AudioStream and the device handle is mostly hidden away; destroying
 * a stream created through this function will also close the device, stream
 * bindings cannot be changed, etc. One other quirk of this is that the device
 * is started in a _paused_ state and must be explicitly resumed; this is
 * partially to offer a clean migration for SDL2 apps and partially because
 * the app might have to do more setup before playback begins; in the
 * non-simplified form, nothing will play until a stream is bound to a device,
 * so they start _unpaused_.
 *
 * ## Channel layouts
 *
 * Audio data passing through SDL is uncompressed PCM data, interleaved. One
 * can provide their own decompression through an MP3, etc, decoder, but SDL
 * does not provide this directly. Each interleaved channel of data is meant
 * to be in a specific order.
 *
 * Abbreviations:
 *
 * - FRONT = single mono speaker
 * - FL = front left speaker
 * - FR = front right speaker
 * - FC = front center speaker
 * - BL = back left speaker
 * - BR = back right speaker
 * - SR = surround right speaker
 * - SL = surround left speaker
 * - BC = back center speaker
 * - LFE = low-frequency speaker
 *
 * These are listed in the order they are laid out in memory, so "FL, FR"
 * means "the front left speaker is laid out in memory first, then the front
 * right, then it repeats for the next audio frame".
 *
 * - 1 channel (mono) layout: FRONT
 * - 2 channels (stereo) layout: FL, FR
 * - 3 channels (2.1) layout: FL, FR, LFE
 * - 4 channels (quad) layout: FL, FR, BL, BR
 * - 5 channels (4.1) layout: FL, FR, LFE, BL, BR
 * - 6 channels (5.1) layout: FL, FR, FC, LFE, BL, BR (last two can also be
 *   SL, SR)
 * - 7 channels (6.1) layout: FL, FR, FC, LFE, BC, SL, SR
 * - 8 channels (7.1) layout: FL, FR, FC, LFE, BL, BR, SL, SR
 *
 * This is the same order as DirectSound expects, but applied to all
 * platforms; SDL will swizzle the channels as necessary if a platform expects
 * something different.
 *
 * SDL_AudioStream can also be provided channel maps to change this ordering
 * to whatever is necessary, in other audio processing scenarios.
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

import { symbols } from './symbols/SDL_audio.ts';
/**
 * A callback that fires for completed SDL_PutAudioStreamDataNoCopy() data.
 *
 * When using SDL_PutAudioStreamDataNoCopy() to provide data to an
 * SDL_AudioStream, it's not safe to dispose of the data until the stream has
 * completely consumed it. Often times it's difficult to know exactly when
 * this has happened.
 *
 * This callback fires once when the stream no longer needs the buffer,
 * allowing the app to easily free or reuse it.
 *
 * @param userdata an opaque pointer provided by the app for their personal
 *                 use.
 * @param buf the pointer provided to SDL_PutAudioStreamDataNoCopy().
 * @param buflen the size of buffer, in bytes, provided to
 *               SDL_PutAudioStreamDataNoCopy().
 *
 * @threadsafety This callbacks may run from any thread, so if you need to
 *               protect shared data, you should use SDL_LockAudioStream to
 *               serialize access; this lock will be held before your callback
 *               is called, so your callback does not need to manage the lock
 *               explicitly.
 *
 * @since This datatype is available since SDL 3.4.0.
 *
 * @sa SDL_SetAudioStreamGetCallback
 * @sa SDL_SetAudioStreamPutCallback
 *
 * @from SDL_audio.h:1471 typedef void (*SDL_AudioStreamDataCompleteCallback)(void *userdata, const void *buf, int buflen);
 */
export function AudioStreamDataCompleteCallback(cb: (
    userdata: Deno.PointerValue, 
    buf: Deno.PointerValue, 
    buflen: number, 
  ) => void) {
  return new Deno.UnsafeCallback(symbols.SDL_AudioStreamDataCompleteCallback, cb);
}

/**
 * A callback that fires when data passes through an SDL_AudioStream.
 *
 * Apps can (optionally) register a callback with an audio stream that is
 * called when data is added with SDL_PutAudioStreamData, or requested with
 * SDL_GetAudioStreamData.
 *
 * Two values are offered here: one is the amount of additional data needed to
 * satisfy the immediate request (which might be zero if the stream already
 * has enough data queued) and the other is the total amount being requested.
 * In a Get call triggering a Put callback, these values can be different. In
 * a Put call triggering a Get callback, these values are always the same.
 *
 * Byte counts might be slightly overestimated due to buffering or resampling,
 * and may change from call to call.
 *
 * This callback is not required to do anything. Generally this is useful for
 * adding/reading data on demand, and the app will often put/get data as
 * appropriate, but the system goes on with the data currently available to it
 * if this callback does nothing.
 *
 * @param stream the SDL audio stream associated with this callback.
 * @param additional_amount the amount of data, in bytes, that is needed right
 *                          now.
 * @param total_amount the total amount of data requested, in bytes, that is
 *                     requested or available.
 * @param userdata an opaque pointer provided by the app for their personal
 *                 use.
 *
 * @threadsafety This callbacks may run from any thread, so if you need to
 *               protect shared data, you should use SDL_LockAudioStream to
 *               serialize access; this lock will be held before your callback
 *               is called, so your callback does not need to manage the lock
 *               explicitly.
 *
 * @since This datatype is available since SDL 3.2.0.
 *
 * @sa SDL_SetAudioStreamGetCallback
 * @sa SDL_SetAudioStreamPutCallback
 *
 * @from SDL_audio.h:1864 typedef void (*SDL_AudioStreamCallback)(void *userdata, SDL_AudioStream *stream, int additional_amount, int total_amount);
 */
export function AudioStreamCallback(cb: (
    userdata: Deno.PointerValue, 
    stream: Deno.PointerValue, 
    additional_amount: number, 
    total_amount: number, 
  ) => void) {
  return new Deno.UnsafeCallback(symbols.SDL_AudioStreamCallback, cb);
}

/**
 * A callback that fires when data is about to be fed to an audio device.
 *
 * This is useful for accessing the final mix, perhaps for writing a
 * visualizer or applying a final effect to the audio data before playback.
 *
 * This callback should run as quickly as possible and not block for any
 * significant time, as this callback delays submission of data to the audio
 * device, which can cause audio playback problems.
 *
 * The postmix callback _must_ be able to handle any audio data format
 * specified in `spec`, which can change between callbacks if the audio device
 * changed. However, this only covers frequency and channel count; data is
 * always provided here in SDL_AUDIO_F32 format.
 *
 * The postmix callback runs _after_ logical device gain and audiostream gain
 * have been applied, which is to say you can make the output data louder at
 * this point than the gain settings would suggest.
 *
 * @param userdata a pointer provided by the app through
 *                 SDL_SetAudioPostmixCallback, for its own use.
 * @param spec the current format of audio that is to be submitted to the
 *             audio device.
 * @param buffer the buffer of audio samples to be submitted. The callback can
 *               inspect and/or modify this data.
 * @param buflen the size of `buffer` in bytes.
 *
 * @threadsafety This will run from a background thread owned by SDL. The
 *               application is responsible for locking resources the callback
 *               touches that need to be protected.
 *
 * @since This datatype is available since SDL 3.2.0.
 *
 * @sa SDL_SetAudioPostmixCallback
 *
 * @from SDL_audio.h:2081 typedef void (*SDL_AudioPostmixCallback)(void *userdata, const SDL_AudioSpec *spec, float *buffer, int buflen);
 */
export function AudioPostmixCallback(cb: (
    userdata: Deno.PointerValue, 
    spec: Deno.PointerValue, 
    buffer: Deno.PointerValue, 
    buflen: number, 
  ) => void) {
  return new Deno.UnsafeCallback(symbols.SDL_AudioPostmixCallback, cb);
}

