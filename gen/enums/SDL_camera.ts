/**
 * # CategoryCamera
 *
 * Video capture for the SDL library.
 *
 * This API lets apps read input from video sources, like webcams. Camera
 * devices can be enumerated, queried, and opened. Once opened, it will
 * provide SDL_Surface objects as new frames of video come in. These surfaces
 * can be uploaded to an SDL_Texture or processed as pixels in memory.
 *
 * Several platforms will alert the user if an app tries to access a camera,
 * and some will present a UI asking the user if your application should be
 * allowed to obtain images at all, which they can deny. A successfully opened
 * camera will not provide images until permission is granted. Applications,
 * after opening a camera device, can see if they were granted access by
 * either polling with the SDL_GetCameraPermissionState() function, or waiting
 * for an SDL_EVENT_CAMERA_DEVICE_APPROVED or SDL_EVENT_CAMERA_DEVICE_DENIED
 * event. Platforms that don't have any user approval process will report
 * approval immediately.
 *
 * Note that SDL cameras only provide video as individual frames; they will
 * not provide full-motion video encoded in a movie file format, although an
 * app is free to encode the acquired frames into any format it likes. It also
 * does not provide audio from the camera hardware through this API; not only
 * do many webcams not have microphones at all, many people--from streamers to
 * people on Zoom calls--will want to use a separate microphone regardless of
 * the camera. In any case, recorded audio will be available through SDL's
 * audio API no matter what hardware provides the microphone.
 *
 * ## Camera gotchas
 *
 * Consumer-level camera hardware tends to take a little while to warm up,
 * once the device has been opened. Generally most camera apps have some sort
 * of UI to take a picture (a button to snap a pic while a preview is showing,
 * some sort of multi-second countdown for the user to pose, like a photo
 * booth), which puts control in the users' hands, or they are intended to
 * stay on for long times (Pokemon Go, etc).
 *
 * It's not uncommon that a newly-opened camera will provide a couple of
 * completely black frames, maybe followed by some under-exposed images. If
 * taking a single frame automatically, or recording video from a camera's
 * input without the user initiating it from a preview, it could be wise to
 * drop the first several frames (if not the first several _seconds_ worth of
 * frames!) before using images from a camera.
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
 * The position of camera in relation to system device.
 *
 * @since This enum is available since SDL 3.2.0.
 *
 * @sa SDL_GetCameraPosition
 *
 * @from SDL_camera.h:131 SDL_CAMERA_POSITION_
 */
export enum SDL_CameraPosition {
  UNKNOWN, 
  FRONT_FACING, 
  BACK_FACING, 
}



/**
 * The current state of a request for camera access.
 *
 * @since This enum is available since SDL 3.4.0.
 *
 * @sa SDL_GetCameraPermissionState
 *
 * @from SDL_camera.h:145 SDL_CAMERA_PERMISSION_STATE_
 */
export enum SDL_CameraPermissionState {
  DENIED = -1, 
  PENDING, 
  APPROVED, 
}



