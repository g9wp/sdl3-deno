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

/**
 * Mask of bits in an SDL_AudioFormat that contains the format bit size.
 *
 * Generally one should use SDL_AUDIO_BITSIZE instead of this macro directly.
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @from SDL_audio.h:150
 */
export const SDL_AUDIO_MASK_BITSIZE = (0xFFu);

/**
 * Mask of bits in an SDL_AudioFormat that contain the floating point flag.
 *
 * Generally one should use SDL_AUDIO_ISFLOAT instead of this macro directly.
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @from SDL_audio.h:159
 */
export const SDL_AUDIO_MASK_FLOAT = (1u<<8);

/**
 * Mask of bits in an SDL_AudioFormat that contain the bigendian flag.
 *
 * Generally one should use SDL_AUDIO_ISBIGENDIAN or SDL_AUDIO_ISLITTLEENDIAN
 * instead of this macro directly.
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @from SDL_audio.h:169
 */
export const SDL_AUDIO_MASK_BIG_ENDIAN = (1u<<12);

/**
 * Mask of bits in an SDL_AudioFormat that contain the signed data flag.
 *
 * Generally one should use SDL_AUDIO_ISSIGNED instead of this macro directly.
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @from SDL_audio.h:178
 */
export const SDL_AUDIO_MASK_SIGNED = (1u<<15);

/**
 * A value used to request a default playback audio device.
 *
 * Several functions that require an SDL_AudioDeviceID will accept this value
 * to signify the app just wants the system to choose a default device instead
 * of the app providing a specific one.
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @from SDL_audio.h:384
 */
export const SDL_AUDIO_DEVICE_DEFAULT_PLAYBACK = ((SDL_AudioDeviceID) 0xFFFFFFFFu);

/**
 * A value used to request a default recording audio device.
 *
 * Several functions that require an SDL_AudioDeviceID will accept this value
 * to signify the app just wants the system to choose a default device instead
 * of the app providing a specific one.
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @from SDL_audio.h:395
 */
export const SDL_AUDIO_DEVICE_DEFAULT_RECORDING = ((SDL_AudioDeviceID) 0xFFFFFFFEu);

/**
 * @from SDL_audio:1099
 */
export const SDL_PROP_AUDIOSTREAM_AUTO_CLEANUP_BOOLEAN = "SDL.audiostream.auto_cleanup";

