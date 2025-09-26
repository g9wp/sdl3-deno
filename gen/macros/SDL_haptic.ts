/**
 * # CategoryHaptic
 *
 * The SDL haptic subsystem manages haptic (force feedback) devices.
 *
 * The basic usage is as follows:
 *
 * - Initialize the subsystem (SDL_INIT_HAPTIC).
 * - Open a haptic device.
 * - SDL_OpenHaptic() to open from index.
 * - SDL_OpenHapticFromJoystick() to open from an existing joystick.
 * - Create an effect (SDL_HapticEffect).
 * - Upload the effect with SDL_CreateHapticEffect().
 * - Run the effect with SDL_RunHapticEffect().
 * - (optional) Free the effect with SDL_DestroyHapticEffect().
 * - Close the haptic device with SDL_CloseHaptic().
 *
 * Simple rumble example:
 *
 * ```c
 *    SDL_Haptic *haptic = NULL;
 *
 *    // Open the device
 *    SDL_HapticID *haptics = SDL_GetHaptics(NULL);
 *    if (haptics) {
 *        haptic = SDL_OpenHaptic(haptics[0]);
 *        SDL_free(haptics);
 *    }
 *    if (haptic == NULL)
 *       return;
 *
 *    // Initialize simple rumble
 *    if (!SDL_InitHapticRumble(haptic))
 *       return;
 *
 *    // Play effect at 50% strength for 2 seconds
 *    if (!SDL_PlayHapticRumble(haptic, 0.5, 2000))
 *       return;
 *    SDL_Delay(2000);
 *
 *    // Clean up
 *    SDL_CloseHaptic(haptic);
 * ```
 *
 * Complete example:
 *
 * ```c
 * bool test_haptic(SDL_Joystick *joystick)
 * {
 *    SDL_Haptic *haptic;
 *    SDL_HapticEffect effect;
 *    int effect_id;
 *
 *    // Open the device
 *    haptic = SDL_OpenHapticFromJoystick(joystick);
 *    if (haptic == NULL) return false; // Most likely joystick isn't haptic
 *
 *    // See if it can do sine waves
 *    if ((SDL_GetHapticFeatures(haptic) & SDL_HAPTIC_SINE)==0) {
 *       SDL_CloseHaptic(haptic); // No sine effect
 *       return false;
 *    }
 *
 *    // Create the effect
 *    SDL_memset(&effect, 0, sizeof(SDL_HapticEffect)); // 0 is safe default
 *    effect.type = SDL_HAPTIC_SINE;
 *    effect.periodic.direction.type = SDL_HAPTIC_POLAR; // Polar coordinates
 *    effect.periodic.direction.dir[0] = 18000; // Force comes from south
 *    effect.periodic.period = 1000; // 1000 ms
 *    effect.periodic.magnitude = 20000; // 20000/32767 strength
 *    effect.periodic.length = 5000; // 5 seconds long
 *    effect.periodic.attack_length = 1000; // Takes 1 second to get max strength
 *    effect.periodic.fade_length = 1000; // Takes 1 second to fade away
 *
 *    // Upload the effect
 *    effect_id = SDL_CreateHapticEffect(haptic, &effect);
 *
 *    // Test the effect
 *    SDL_RunHapticEffect(haptic, effect_id, 1);
 *    SDL_Delay(5000); // Wait for the effect to finish
 *
 *    // We destroy the effect, although closing the device also does this
 *    SDL_DestroyHapticEffect(haptic, effect_id);
 *
 *    // Close the device
 *    SDL_CloseHaptic(haptic);
 *
 *    return true; // Success
 * }
 * ```
 *
 * Note that the SDL haptic subsystem is not thread-safe.
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
 * @from SDL_haptic:173
 */
export const SDL_HAPTIC_CONSTANT = (1<<0);

/**
 * @from SDL_haptic:184
 */
export const SDL_HAPTIC_SINE = (1<<1);

/**
 * @from SDL_haptic:195
 */
export const SDL_HAPTIC_SQUARE = (1<<2);

/**
 * @from SDL_haptic:206
 */
export const SDL_HAPTIC_TRIANGLE = (1<<3);

/**
 * @from SDL_haptic:217
 */
export const SDL_HAPTIC_SAWTOOTHUP = (1<<4);

/**
 * @from SDL_haptic:228
 */
export const SDL_HAPTIC_SAWTOOTHDOWN = (1<<5);

/**
 * @from SDL_haptic:239
 */
export const SDL_HAPTIC_RAMP = (1<<6);

/**
 * @from SDL_haptic:251
 */
export const SDL_HAPTIC_SPRING = (1<<7);

/**
 * @from SDL_haptic:263
 */
export const SDL_HAPTIC_DAMPER = (1<<8);

/**
 * @from SDL_haptic:275
 */
export const SDL_HAPTIC_INERTIA = (1<<9);

/**
 * @from SDL_haptic:287
 */
export const SDL_HAPTIC_FRICTION = (1<<10);

/**
 * @from SDL_haptic:298
 */
export const SDL_HAPTIC_LEFTRIGHT = (1<<11);

/**
 * @from SDL_haptic:305
 */
export const SDL_HAPTIC_RESERVED1 = (1<<12);

/**
 * @from SDL_haptic:312
 */
export const SDL_HAPTIC_RESERVED2 = (1<<13);

/**
 * @from SDL_haptic:319
 */
export const SDL_HAPTIC_RESERVED3 = (1<<14);

/**
 * @from SDL_haptic:328
 */
export const SDL_HAPTIC_CUSTOM = (1<<15);

/**
 * @from SDL_haptic:343
 */
export const SDL_HAPTIC_GAIN = (1<<16);

/**
 * @from SDL_haptic:354
 */
export const SDL_HAPTIC_AUTOCENTER = (1<<17);

/**
 * @from SDL_haptic:365
 */
export const SDL_HAPTIC_STATUS = (1<<18);

/**
 * @from SDL_haptic:377
 */
export const SDL_HAPTIC_PAUSE = (1<<19);

/**
 * @from SDL_haptic:392
 */
export const SDL_HAPTIC_POLAR = 0;

/**
 * @from SDL_haptic:401
 */
export const SDL_HAPTIC_CARTESIAN = 1;

/**
 * @from SDL_haptic:410
 */
export const SDL_HAPTIC_SPHERICAL = 2;

/**
 * @from SDL_haptic:422
 */
export const SDL_HAPTIC_STEERING_AXIS = 3;

/**
 * @from SDL_haptic:439
 */
export const SDL_HAPTIC_INFINITY = 4294967295;

