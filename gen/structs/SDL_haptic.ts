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

import * as _ from "../_utils.ts";
import * as _b from "../_structs/SDL_haptic.ts";


/**
 * Structure that represents a haptic direction.
 *
 * This is the direction where the force comes from, instead of the direction
 * in which the force is exerted.
 *
 * Directions can be specified by:
 *
 * - SDL_HAPTIC_POLAR : Specified by polar coordinates.
 * - SDL_HAPTIC_CARTESIAN : Specified by cartesian coordinates.
 * - SDL_HAPTIC_SPHERICAL : Specified by spherical coordinates.
 *
 * Cardinal directions of the haptic device are relative to the positioning of
 * the device. North is considered to be away from the user.
 *
 * The following diagram represents the cardinal directions:
 *
 * ```
 *                .--.
 *                |__| .-------.
 *                |=.| |.-----.|
 *                |--| ||     ||
 *                |  | |'-----'|
 *                |__|~')_____('
 *                  [ COMPUTER ]
 *
 *
 *                    North (0,-1)
 *                        ^
 *                        |
 *                        |
 *  (-1,0)  West <----[ HAPTIC ]----> East (1,0)
 *                        |
 *                        |
 *                        v
 *                     South (0,1)
 *
 *
 *                     [ USER ]
 *                       @|||/
 *                       (o o)
 *                 ---ooO-(_)-Ooo---
 * ```
 *
 * If type is SDL_HAPTIC_POLAR, direction is encoded by hundredths of a degree
 * starting north and turning clockwise. SDL_HAPTIC_POLAR only uses the first
 * `dir` parameter. The cardinal directions would be:
 *
 * - North: 0 (0 degrees)
 * - East: 9000 (90 degrees)
 * - South: 18000 (180 degrees)
 * - West: 27000 (270 degrees)
 *
 * If type is SDL_HAPTIC_CARTESIAN, direction is encoded by three positions (X
 * axis, Y axis and Z axis (with 3 axes)). SDL_HAPTIC_CARTESIAN uses the first
 * three `dir` parameters. The cardinal directions would be:
 *
 * - North: 0,-1, 0
 * - East: 1, 0, 0
 * - South: 0, 1, 0
 * - West: -1, 0, 0
 *
 * The Z axis represents the height of the effect if supported, otherwise it's
 * unused. In cartesian encoding (1, 2) would be the same as (2, 4), you can
 * use any multiple you want, only the direction matters.
 *
 * If type is SDL_HAPTIC_SPHERICAL, direction is encoded by two rotations. The
 * first two `dir` parameters are used. The `dir` parameters are as follows
 * (all values are in hundredths of degrees):
 *
 * - Degrees from (1, 0) rotated towards (0, 1).
 * - Degrees towards (0, 0, 1) (device needs at least 3 axes).
 *
 * Example of force coming from the south with all encodings (force coming
 * from the south means the user will have to pull the stick to counteract):
 *
 * ```c
 *  SDL_HapticDirection direction;
 *
 *  // Cartesian directions
 *  direction.type = SDL_HAPTIC_CARTESIAN; // Using cartesian direction encoding.
 *  direction.dir[0] = 0; // X position
 *  direction.dir[1] = 1; // Y position
 *  // Assuming the device has 2 axes, we don't need to specify third parameter.
 *
 *  // Polar directions
 *  direction.type = SDL_HAPTIC_POLAR; // We'll be using polar direction encoding.
 *  direction.dir[0] = 18000; // Polar only uses first parameter
 *
 *  // Spherical coordinates
 *  direction.type = SDL_HAPTIC_SPHERICAL; // Spherical encoding
 *  direction.dir[0] = 9000; // Since we only have two axes we don't need more parameters.
 * ```
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @sa SDL_HAPTIC_POLAR
 * @sa SDL_HAPTIC_CARTESIAN
 * @sa SDL_HAPTIC_SPHERICAL
 * @sa SDL_HAPTIC_STEERING_AXIS
 * @sa SDL_HapticEffect
 * @sa SDL_GetNumHapticAxes
 *
 * @from SDL_haptic.h:565
 */
export interface HapticDirection {
  type: number; /**< SDL_HapticDirectionType : The type of encoding. */
  dir: number[]; /**< Sint32[3] : The encoded direction. */
}

export function read_HapticDirection(dt: DataView): HapticDirection {
  const t = _b.SDL_HapticDirection.read(dt);
  return {
    type: t.type, /** SDL_HapticDirectionType */
    dir: t.dir, /** Sint32 */
  };
}

export function write_HapticDirection(t: HapticDirection, dt: DataView) {
  _b.SDL_HapticDirection.write({
    type: t.type, /** SDL_HapticDirectionType */
    dir: t.dir, /** Sint32 */
  }, dt);
}


/**
 * A structure containing a template for a Constant effect.
 *
 * This struct is exclusively for the SDL_HAPTIC_CONSTANT effect.
 *
 * A constant effect applies a constant force in the specified direction to
 * the joystick.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @sa SDL_HAPTIC_CONSTANT
 * @sa SDL_HapticEffect
 *
 * @from SDL_haptic.h:585
 */
export interface HapticConstant {
    /* Header */
  type: number; /**< SDL_HapticEffectType : SDL_HAPTIC_CONSTANT */
  direction: HapticDirection; /**< SDL_HapticDirection : Direction of the effect. */
    /* Replay */
  length: number; /**< Uint32 : Duration of the effect. */
  delay: number; /**< Uint16 : Delay before starting the effect. */
    /* Trigger */
  button: number; /**< Uint16 : Button that triggers the effect. */
  interval: number; /**< Uint16 : How soon it can be triggered again after button. */
    /* Constant */
  level: number; /**< Sint16 : Strength of the constant effect. */
    /* Envelope */
  attack_length: number; /**< Uint16 : Duration of the attack. */
  attack_level: number; /**< Uint16 : Level at the start of the attack. */
  fade_length: number; /**< Uint16 : Duration of the fade. */
  fade_level: number; /**< Uint16 : Level at the end of the fade. */
}

export function read_HapticConstant(dt: DataView): HapticConstant {
  const t = _b.SDL_HapticConstant.read(dt);
  return {
    /* Header */
    type: t.type, /** SDL_HapticEffectType */
    direction: t.direction, /** SDL_HapticDirection */
    /* Replay */
    length: t.length, /** Uint32 */
    delay: t.delay, /** Uint16 */
    /* Trigger */
    button: t.button, /** Uint16 */
    interval: t.interval, /** Uint16 */
    /* Constant */
    level: t.level, /** Sint16 */
    /* Envelope */
    attack_length: t.attack_length, /** Uint16 */
    attack_level: t.attack_level, /** Uint16 */
    fade_length: t.fade_length, /** Uint16 */
    fade_level: t.fade_level, /** Uint16 */
  };
}

export function write_HapticConstant(t: HapticConstant, dt: DataView) {
  _b.SDL_HapticConstant.write({
    /* Header */
    type: t.type, /** SDL_HapticEffectType */
    direction: t.direction, /** SDL_HapticDirection */
    /* Replay */
    length: t.length, /** Uint32 */
    delay: t.delay, /** Uint16 */
    /* Trigger */
    button: t.button, /** Uint16 */
    interval: t.interval, /** Uint16 */
    /* Constant */
    level: t.level, /** Sint16 */
    /* Envelope */
    attack_length: t.attack_length, /** Uint16 */
    attack_level: t.attack_level, /** Uint16 */
    fade_length: t.fade_length, /** Uint16 */
    fade_level: t.fade_level, /** Uint16 */
  }, dt);
}


/**
 * A structure containing a template for a Periodic effect.
 *
 * The struct handles the following effects:
 *
 * - SDL_HAPTIC_SINE
 * - SDL_HAPTIC_SQUARE
 * - SDL_HAPTIC_TRIANGLE
 * - SDL_HAPTIC_SAWTOOTHUP
 * - SDL_HAPTIC_SAWTOOTHDOWN
 *
 * A periodic effect consists in a wave-shaped effect that repeats itself over
 * time. The type determines the shape of the wave and the parameters
 * determine the dimensions of the wave.
 *
 * Phase is given by hundredth of a degree meaning that giving the phase a
 * value of 9000 will displace it 25% of its period. Here are sample values:
 *
 * - 0: No phase displacement.
 * - 9000: Displaced 25% of its period.
 * - 18000: Displaced 50% of its period.
 * - 27000: Displaced 75% of its period.
 * - 36000: Displaced 100% of its period, same as 0, but 0 is preferred.
 *
 * Examples:
 *
 * ```
 *   SDL_HAPTIC_SINE
 *     __      __      __      __
 *    /  \    /  \    /  \    /
 *   /    \__/    \__/    \__/
 *
 *   SDL_HAPTIC_SQUARE
 *    __    __    __    __    __
 *   |  |  |  |  |  |  |  |  |  |
 *   |  |__|  |__|  |__|  |__|  |
 *
 *   SDL_HAPTIC_TRIANGLE
 *     /\    /\    /\    /\    /\
 *    /  \  /  \  /  \  /  \  /
 *   /    \/    \/    \/    \/
 *
 *   SDL_HAPTIC_SAWTOOTHUP
 *     /|  /|  /|  /|  /|  /|  /|
 *    / | / | / | / | / | / | / |
 *   /  |/  |/  |/  |/  |/  |/  |
 *
 *   SDL_HAPTIC_SAWTOOTHDOWN
 *   @  |\  |\  |\  |\  |\  |\  |
 *    @ | \ | \ | \ | \ | \ | \ |
 *     @|  \|  \|  \|  \|  \|  \|
 * ```
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @sa SDL_HAPTIC_SINE
 * @sa SDL_HAPTIC_SQUARE
 * @sa SDL_HAPTIC_TRIANGLE
 * @sa SDL_HAPTIC_SAWTOOTHUP
 * @sa SDL_HAPTIC_SAWTOOTHDOWN
 * @sa SDL_HapticEffect
 *
 * @from SDL_haptic.h:671
 */
export interface HapticPeriodic {
    /* Header */
  type: number; /**< SDL_HapticEffectType : SDL_HAPTIC_SINE, SDL_HAPTIC_SQUARE
                                         SDL_HAPTIC_TRIANGLE, SDL_HAPTIC_SAWTOOTHUP or
                                         SDL_HAPTIC_SAWTOOTHDOWN */
  direction: HapticDirection; /**< SDL_HapticDirection : Direction of the effect. */
    /* Replay */
  length: number; /**< Uint32 : Duration of the effect. */
  delay: number; /**< Uint16 : Delay before starting the effect. */
    /* Trigger */
  button: number; /**< Uint16 : Button that triggers the effect. */
  interval: number; /**< Uint16 : How soon it can be triggered again after button. */
    /* Periodic */
  period: number; /**< Uint16 : Period of the wave. */
  magnitude: number; /**< Sint16 : Peak value; if negative, equivalent to 180 degrees extra phase shift. */
  offset: number; /**< Sint16 : Mean value of the wave. */
  phase: number; /**< Uint16 : Positive phase shift given by hundredth of a degree. */
    /* Envelope */
  attack_length: number; /**< Uint16 : Duration of the attack. */
  attack_level: number; /**< Uint16 : Level at the start of the attack. */
  fade_length: number; /**< Uint16 : Duration of the fade. */
  fade_level: number; /**< Uint16 : Level at the end of the fade. */
}

export function read_HapticPeriodic(dt: DataView): HapticPeriodic {
  const t = _b.SDL_HapticPeriodic.read(dt);
  return {
    /* Header */
    type: t.type, /** SDL_HapticEffectType */
    direction: t.direction, /** SDL_HapticDirection */
    /* Replay */
    length: t.length, /** Uint32 */
    delay: t.delay, /** Uint16 */
    /* Trigger */
    button: t.button, /** Uint16 */
    interval: t.interval, /** Uint16 */
    /* Periodic */
    period: t.period, /** Uint16 */
    magnitude: t.magnitude, /** Sint16 */
    offset: t.offset, /** Sint16 */
    phase: t.phase, /** Uint16 */
    /* Envelope */
    attack_length: t.attack_length, /** Uint16 */
    attack_level: t.attack_level, /** Uint16 */
    fade_length: t.fade_length, /** Uint16 */
    fade_level: t.fade_level, /** Uint16 */
  };
}

export function write_HapticPeriodic(t: HapticPeriodic, dt: DataView) {
  _b.SDL_HapticPeriodic.write({
    /* Header */
    type: t.type, /** SDL_HapticEffectType */
    direction: t.direction, /** SDL_HapticDirection */
    /* Replay */
    length: t.length, /** Uint32 */
    delay: t.delay, /** Uint16 */
    /* Trigger */
    button: t.button, /** Uint16 */
    interval: t.interval, /** Uint16 */
    /* Periodic */
    period: t.period, /** Uint16 */
    magnitude: t.magnitude, /** Sint16 */
    offset: t.offset, /** Sint16 */
    phase: t.phase, /** Uint16 */
    /* Envelope */
    attack_length: t.attack_length, /** Uint16 */
    attack_level: t.attack_level, /** Uint16 */
    fade_length: t.fade_length, /** Uint16 */
    fade_level: t.fade_level, /** Uint16 */
  }, dt);
}


/**
 * A structure containing a template for a Condition effect.
 *
 * The struct handles the following effects:
 *
 * - SDL_HAPTIC_SPRING: Effect based on axes position.
 * - SDL_HAPTIC_DAMPER: Effect based on axes velocity.
 * - SDL_HAPTIC_INERTIA: Effect based on axes acceleration.
 * - SDL_HAPTIC_FRICTION: Effect based on axes movement.
 *
 * Direction is handled by condition internals instead of a direction member.
 * The condition effect specific members have three parameters. The first
 * refers to the X axis, the second refers to the Y axis and the third refers
 * to the Z axis. The right terms refer to the positive side of the axis and
 * the left terms refer to the negative side of the axis. Please refer to the
 * SDL_HapticDirection diagram for which side is positive and which is
 * negative.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @sa SDL_HapticDirection
 * @sa SDL_HAPTIC_SPRING
 * @sa SDL_HAPTIC_DAMPER
 * @sa SDL_HAPTIC_INERTIA
 * @sa SDL_HAPTIC_FRICTION
 * @sa SDL_HapticEffect
 *
 * @from SDL_haptic.h:727
 */
export interface HapticCondition {
    /* Header */
  type: number; /**< SDL_HapticEffectType : SDL_HAPTIC_SPRING, SDL_HAPTIC_DAMPER,
                                         SDL_HAPTIC_INERTIA or SDL_HAPTIC_FRICTION */
  direction: HapticDirection; /**< SDL_HapticDirection : Direction of the effect. */
    /* Replay */
  length: number; /**< Uint32 : Duration of the effect. */
  delay: number; /**< Uint16 : Delay before starting the effect. */
    /* Trigger */
  button: number; /**< Uint16 : Button that triggers the effect. */
  interval: number; /**< Uint16 : How soon it can be triggered again after button. */
    /* Condition */
  right_sat: number[]; /**< Uint16[3] : Level when joystick is to the positive side; max 0xFFFF. */
  left_sat: number[]; /**< Uint16[3] : Level when joystick is to the negative side; max 0xFFFF. */
  right_coeff: number[]; /**< Sint16[3] : How fast to increase the force towards the positive side. */
  left_coeff: number[]; /**< Sint16[3] : How fast to increase the force towards the negative side. */
  deadband: number[]; /**< Uint16[3] : Size of the dead zone; max 0xFFFF: whole axis-range when 0-centered. */
  center: number[]; /**< Sint16[3] : Position of the dead zone. */
}

export function read_HapticCondition(dt: DataView): HapticCondition {
  const t = _b.SDL_HapticCondition.read(dt);
  return {
    /* Header */
    type: t.type, /** SDL_HapticEffectType */
    direction: t.direction, /** SDL_HapticDirection */
    /* Replay */
    length: t.length, /** Uint32 */
    delay: t.delay, /** Uint16 */
    /* Trigger */
    button: t.button, /** Uint16 */
    interval: t.interval, /** Uint16 */
    /* Condition */
    right_sat: t.right_sat, /** Uint16 */
    left_sat: t.left_sat, /** Uint16 */
    right_coeff: t.right_coeff, /** Sint16 */
    left_coeff: t.left_coeff, /** Sint16 */
    deadband: t.deadband, /** Uint16 */
    center: t.center, /** Sint16 */
  };
}

export function write_HapticCondition(t: HapticCondition, dt: DataView) {
  _b.SDL_HapticCondition.write({
    /* Header */
    type: t.type, /** SDL_HapticEffectType */
    direction: t.direction, /** SDL_HapticDirection */
    /* Replay */
    length: t.length, /** Uint32 */
    delay: t.delay, /** Uint16 */
    /* Trigger */
    button: t.button, /** Uint16 */
    interval: t.interval, /** Uint16 */
    /* Condition */
    right_sat: t.right_sat, /** Uint16 */
    left_sat: t.left_sat, /** Uint16 */
    right_coeff: t.right_coeff, /** Sint16 */
    left_coeff: t.left_coeff, /** Sint16 */
    deadband: t.deadband, /** Uint16 */
    center: t.center, /** Sint16 */
  }, dt);
}


/**
 * A structure containing a template for a Ramp effect.
 *
 * This struct is exclusively for the SDL_HAPTIC_RAMP effect.
 *
 * The ramp effect starts at start strength and ends at end strength. It
 * augments in linear fashion. If you use attack and fade with a ramp the
 * effects get added to the ramp effect making the effect become quadratic
 * instead of linear.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @sa SDL_HAPTIC_RAMP
 * @sa SDL_HapticEffect
 *
 * @from SDL_haptic.h:766
 */
export interface HapticRamp {
    /* Header */
  type: number; /**< SDL_HapticEffectType : SDL_HAPTIC_RAMP */
  direction: HapticDirection; /**< SDL_HapticDirection : Direction of the effect. */
    /* Replay */
  length: number; /**< Uint32 : Duration of the effect. */
  delay: number; /**< Uint16 : Delay before starting the effect. */
    /* Trigger */
  button: number; /**< Uint16 : Button that triggers the effect. */
  interval: number; /**< Uint16 : How soon it can be triggered again after button. */
    /* Ramp */
  start: number; /**< Sint16 : Beginning strength level. */
  end: number; /**< Sint16 : Ending strength level. */
    /* Envelope */
  attack_length: number; /**< Uint16 : Duration of the attack. */
  attack_level: number; /**< Uint16 : Level at the start of the attack. */
  fade_length: number; /**< Uint16 : Duration of the fade. */
  fade_level: number; /**< Uint16 : Level at the end of the fade. */
}

export function read_HapticRamp(dt: DataView): HapticRamp {
  const t = _b.SDL_HapticRamp.read(dt);
  return {
    /* Header */
    type: t.type, /** SDL_HapticEffectType */
    direction: t.direction, /** SDL_HapticDirection */
    /* Replay */
    length: t.length, /** Uint32 */
    delay: t.delay, /** Uint16 */
    /* Trigger */
    button: t.button, /** Uint16 */
    interval: t.interval, /** Uint16 */
    /* Ramp */
    start: t.start, /** Sint16 */
    end: t.end, /** Sint16 */
    /* Envelope */
    attack_length: t.attack_length, /** Uint16 */
    attack_level: t.attack_level, /** Uint16 */
    fade_length: t.fade_length, /** Uint16 */
    fade_level: t.fade_level, /** Uint16 */
  };
}

export function write_HapticRamp(t: HapticRamp, dt: DataView) {
  _b.SDL_HapticRamp.write({
    /* Header */
    type: t.type, /** SDL_HapticEffectType */
    direction: t.direction, /** SDL_HapticDirection */
    /* Replay */
    length: t.length, /** Uint32 */
    delay: t.delay, /** Uint16 */
    /* Trigger */
    button: t.button, /** Uint16 */
    interval: t.interval, /** Uint16 */
    /* Ramp */
    start: t.start, /** Sint16 */
    end: t.end, /** Sint16 */
    /* Envelope */
    attack_length: t.attack_length, /** Uint16 */
    attack_level: t.attack_level, /** Uint16 */
    fade_length: t.fade_length, /** Uint16 */
    fade_level: t.fade_level, /** Uint16 */
  }, dt);
}


/**
 * A structure containing a template for a Left/Right effect.
 *
 * This struct is exclusively for the SDL_HAPTIC_LEFTRIGHT effect.
 *
 * The Left/Right effect is used to explicitly control the large and small
 * motors, commonly found in modern game controllers. The small (right) motor
 * is high frequency, and the large (left) motor is low frequency.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @sa SDL_HAPTIC_LEFTRIGHT
 * @sa SDL_HapticEffect
 *
 * @from SDL_haptic.h:805
 */
export interface HapticLeftRight {
    /* Header */
  type: number; /**< SDL_HapticEffectType : SDL_HAPTIC_LEFTRIGHT */
    /* Replay */
  length: number; /**< Uint32 : Duration of the effect in milliseconds. */
    /* Rumble */
  large_magnitude: number; /**< Uint16 : Control of the large controller motor. */
  small_magnitude: number; /**< Uint16 : Control of the small controller motor. */
}

export function read_HapticLeftRight(dt: DataView): HapticLeftRight {
  const t = _b.SDL_HapticLeftRight.read(dt);
  return {
    /* Header */
    type: t.type, /** SDL_HapticEffectType */
    /* Replay */
    length: t.length, /** Uint32 */
    /* Rumble */
    large_magnitude: t.large_magnitude, /** Uint16 */
    small_magnitude: t.small_magnitude, /** Uint16 */
  };
}

export function write_HapticLeftRight(t: HapticLeftRight, dt: DataView) {
  _b.SDL_HapticLeftRight.write({
    /* Header */
    type: t.type, /** SDL_HapticEffectType */
    /* Replay */
    length: t.length, /** Uint32 */
    /* Rumble */
    large_magnitude: t.large_magnitude, /** Uint16 */
    small_magnitude: t.small_magnitude, /** Uint16 */
  }, dt);
}


/**
 * A structure containing a template for the SDL_HAPTIC_CUSTOM effect.
 *
 * This struct is exclusively for the SDL_HAPTIC_CUSTOM effect.
 *
 * A custom force feedback effect is much like a periodic effect, where the
 * application can define its exact shape. You will have to allocate the data
 * yourself. Data should consist of channels * samples Uint16 samples.
 *
 * If channels is one, the effect is rotated using the defined direction.
 * Otherwise it uses the samples in data for the different axes.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @sa SDL_HAPTIC_CUSTOM
 * @sa SDL_HapticEffect
 *
 * @from SDL_haptic.h:835
 */
export interface HapticCustom {
    /* Header */
  type: number; /**< SDL_HapticEffectType : SDL_HAPTIC_CUSTOM */
  direction: HapticDirection; /**< SDL_HapticDirection : Direction of the effect. */
    /* Replay */
  length: number; /**< Uint32 : Duration of the effect. */
  delay: number; /**< Uint16 : Delay before starting the effect. */
    /* Trigger */
  button: number; /**< Uint16 : Button that triggers the effect. */
  interval: number; /**< Uint16 : How soon it can be triggered again after button. */
    /* Custom */
  channels: number; /**< Uint8 : Axes to use, minimum of one. */
  period: number; /**< Uint16 : Sample periods. */
  samples: number; /**< Uint16 : Amount of samples. */
  data: Deno.PointerValue; /**< Uint16 * : Should contain channels*samples items. */
    /* Envelope */
  attack_length: number; /**< Uint16 : Duration of the attack. */
  attack_level: number; /**< Uint16 : Level at the start of the attack. */
  fade_length: number; /**< Uint16 : Duration of the fade. */
  fade_level: number; /**< Uint16 : Level at the end of the fade. */
}

export function read_HapticCustom(dt: DataView): HapticCustom {
  const t = _b.SDL_HapticCustom.read(dt);
  return {
    /* Header */
    type: t.type, /** SDL_HapticEffectType */
    direction: t.direction, /** SDL_HapticDirection */
    /* Replay */
    length: t.length, /** Uint32 */
    delay: t.delay, /** Uint16 */
    /* Trigger */
    button: t.button, /** Uint16 */
    interval: t.interval, /** Uint16 */
    /* Custom */
    channels: t.channels, /** Uint8 */
    period: t.period, /** Uint16 */
    samples: t.samples, /** Uint16 */
    data: Deno.UnsafePointer.create(t.data), /** Uint16 * */
    /* Envelope */
    attack_length: t.attack_length, /** Uint16 */
    attack_level: t.attack_level, /** Uint16 */
    fade_length: t.fade_length, /** Uint16 */
    fade_level: t.fade_level, /** Uint16 */
  };
}

export function write_HapticCustom(t: HapticCustom, dt: DataView) {
  _b.SDL_HapticCustom.write({
    /* Header */
    type: t.type, /** SDL_HapticEffectType */
    direction: t.direction, /** SDL_HapticDirection */
    /* Replay */
    length: t.length, /** Uint32 */
    delay: t.delay, /** Uint16 */
    /* Trigger */
    button: t.button, /** Uint16 */
    interval: t.interval, /** Uint16 */
    /* Custom */
    channels: t.channels, /** Uint8 */
    period: t.period, /** Uint16 */
    samples: t.samples, /** Uint16 */
    data: Deno.UnsafePointer.value(t.data), /** Uint16 * */
    /* Envelope */
    attack_length: t.attack_length, /** Uint16 */
    attack_level: t.attack_level, /** Uint16 */
    fade_length: t.fade_length, /** Uint16 */
    fade_level: t.fade_level, /** Uint16 */
  }, dt);
}


