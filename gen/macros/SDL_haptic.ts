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
 *    SDL_HapticEffectID effect_id;
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
 * Used to play a device an infinite number of times.
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @sa SDL_RunHapticEffect
 *
 * @from SDL_haptic.h:162
 */
export const SDL_HAPTIC_INFINITY = 4294967295;

/**
 * Constant effect supported.
 *
 * Constant haptic effect.
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @sa SDL_HapticCondition
 *
 * @from SDL_haptic.h:191
 */
export const SDL_HAPTIC_CONSTANT = (1<<0);

/**
 * Sine wave effect supported.
 *
 * Periodic haptic effect that simulates sine waves.
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @sa SDL_HapticPeriodic
 *
 * @from SDL_haptic.h:202
 */
export const SDL_HAPTIC_SINE = (1<<1);

/**
 * Square wave effect supported.
 *
 * Periodic haptic effect that simulates square waves.
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @sa SDL_HapticPeriodic
 *
 * @from SDL_haptic.h:213
 */
export const SDL_HAPTIC_SQUARE = (1<<2);

/**
 * Triangle wave effect supported.
 *
 * Periodic haptic effect that simulates triangular waves.
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @sa SDL_HapticPeriodic
 *
 * @from SDL_haptic.h:224
 */
export const SDL_HAPTIC_TRIANGLE = (1<<3);

/**
 * Sawtoothup wave effect supported.
 *
 * Periodic haptic effect that simulates saw tooth up waves.
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @sa SDL_HapticPeriodic
 *
 * @from SDL_haptic.h:235
 */
export const SDL_HAPTIC_SAWTOOTHUP = (1<<4);

/**
 * Sawtoothdown wave effect supported.
 *
 * Periodic haptic effect that simulates saw tooth down waves.
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @sa SDL_HapticPeriodic
 *
 * @from SDL_haptic.h:246
 */
export const SDL_HAPTIC_SAWTOOTHDOWN = (1<<5);

/**
 * Ramp effect supported.
 *
 * Ramp haptic effect.
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @sa SDL_HapticRamp
 *
 * @from SDL_haptic.h:257
 */
export const SDL_HAPTIC_RAMP = (1<<6);

/**
 * Spring effect supported - uses axes position.
 *
 * Condition haptic effect that simulates a spring. Effect is based on the
 * axes position.
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @sa SDL_HapticCondition
 *
 * @from SDL_haptic.h:269
 */
export const SDL_HAPTIC_SPRING = (1<<7);

/**
 * Damper effect supported - uses axes velocity.
 *
 * Condition haptic effect that simulates dampening. Effect is based on the
 * axes velocity.
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @sa SDL_HapticCondition
 *
 * @from SDL_haptic.h:281
 */
export const SDL_HAPTIC_DAMPER = (1<<8);

/**
 * Inertia effect supported - uses axes acceleration.
 *
 * Condition haptic effect that simulates inertia. Effect is based on the axes
 * acceleration.
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @sa SDL_HapticCondition
 *
 * @from SDL_haptic.h:293
 */
export const SDL_HAPTIC_INERTIA = (1<<9);

/**
 * Friction effect supported - uses axes movement.
 *
 * Condition haptic effect that simulates friction. Effect is based on the
 * axes movement.
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @sa SDL_HapticCondition
 *
 * @from SDL_haptic.h:305
 */
export const SDL_HAPTIC_FRICTION = (1<<10);

/**
 * Left/Right effect supported.
 *
 * Haptic effect for direct control over high/low frequency motors.
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @sa SDL_HapticLeftRight
 *
 * @from SDL_haptic.h:316
 */
export const SDL_HAPTIC_LEFTRIGHT = (1<<11);

/**
 * Reserved for future use.
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @from SDL_haptic.h:323
 */
export const SDL_HAPTIC_RESERVED1 = (1<<12);

/**
 * Reserved for future use.
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @from SDL_haptic.h:330
 */
export const SDL_HAPTIC_RESERVED2 = (1<<13);

/**
 * Reserved for future use.
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @from SDL_haptic.h:337
 */
export const SDL_HAPTIC_RESERVED3 = (1<<14);

/**
 * Custom effect is supported.
 *
 * User defined custom haptic effect.
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @from SDL_haptic.h:346
 */
export const SDL_HAPTIC_CUSTOM = (1<<15);

/**
 * Device can set global gain.
 *
 * Device supports setting the global gain.
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @sa SDL_SetHapticGain
 *
 * @from SDL_haptic.h:361
 */
export const SDL_HAPTIC_GAIN = (1<<16);

/**
 * Device can set autocenter.
 *
 * Device supports setting autocenter.
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @sa SDL_SetHapticAutocenter
 *
 * @from SDL_haptic.h:372
 */
export const SDL_HAPTIC_AUTOCENTER = (1<<17);

/**
 * Device can be queried for effect status.
 *
 * Device supports querying effect status.
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @sa SDL_GetHapticEffectStatus
 *
 * @from SDL_haptic.h:383
 */
export const SDL_HAPTIC_STATUS = (1<<18);

/**
 * Device can be paused.
 *
 * Devices supports being paused.
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @sa SDL_PauseHaptic
 * @sa SDL_ResumeHaptic
 *
 * @from SDL_haptic.h:395
 */
export const SDL_HAPTIC_PAUSE = (1<<19);

/**
 * Uses polar coordinates for the direction.
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @sa SDL_HapticDirection
 *
 * @from SDL_haptic.h:415
 */
export const SDL_HAPTIC_POLAR = 0;

/**
 * Uses cartesian coordinates for the direction.
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @sa SDL_HapticDirection
 *
 * @from SDL_haptic.h:424
 */
export const SDL_HAPTIC_CARTESIAN = 1;

/**
 * Uses spherical coordinates for the direction.
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @sa SDL_HapticDirection
 *
 * @from SDL_haptic.h:433
 */
export const SDL_HAPTIC_SPHERICAL = 2;

/**
 * Use this value to play an effect on the steering wheel axis.
 *
 * This provides better compatibility across platforms and devices as SDL will
 * guess the correct axis.
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @sa SDL_HapticDirection
 *
 * @from SDL_haptic.h:445
 */
export const SDL_HAPTIC_STEERING_AXIS = 3;
