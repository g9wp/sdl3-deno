/**
 * # CategorySensor
 *
 * SDL sensor management.
 *
 * These APIs grant access to gyros and accelerometers on various platforms.
 *
 * In order to use these functions, SDL_Init() must have been called with the
 * SDL_INIT_SENSOR flag. This causes SDL to scan the system for sensors, and
 * load appropriate drivers.
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


export const symbols = {

/**
 * Get a list of currently connected sensors.
 *
 * @param count a pointer filled in with the number of sensors returned, may
 *              be NULL.
 * @returns a 0 terminated array of sensor instance IDs or NULL on failure;
 *          call SDL_GetError() for more information. This should be freed
 *          with SDL_free() when it is no longer needed.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_sensor.h:158 SDL_SensorID * SDL_GetSensors(int *count);
 */
SDL_GetSensors: {
      parameters: ["pointer"],
      result: "pointer"
    },


/**
 * Get the implementation dependent name of a sensor.
 *
 * This can be called before any sensors are opened.
 *
 * @param instance_id the sensor instance ID.
 * @returns the sensor name, or NULL if `instance_id` is not valid.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_sensor.h:170 const char * SDL_GetSensorNameForID(SDL_SensorID instance_id);
 */
SDL_GetSensorNameForID: {
      parameters: ["u32"],
      result: "pointer"
    },


/**
 * Get the type of a sensor.
 *
 * This can be called before any sensors are opened.
 *
 * @param instance_id the sensor instance ID.
 * @returns the SDL_SensorType, or `SDL_SENSOR_INVALID` if `instance_id` is
 *          not valid.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_sensor.h:183 SDL_SensorType SDL_GetSensorTypeForID(SDL_SensorID instance_id);
 */
SDL_GetSensorTypeForID: {
      parameters: ["u32"],
      result: "u32"
    },


/**
 * Get the platform dependent type of a sensor.
 *
 * This can be called before any sensors are opened.
 *
 * @param instance_id the sensor instance ID.
 * @returns the sensor platform dependent type, or -1 if `instance_id` is not
 *          valid.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_sensor.h:196 int SDL_GetSensorNonPortableTypeForID(SDL_SensorID instance_id);
 */
SDL_GetSensorNonPortableTypeForID: {
      parameters: ["u32"],
      result: "i32"
    },


/**
 * Open a sensor for use.
 *
 * @param instance_id the sensor instance ID.
 * @returns an SDL_Sensor object or NULL on failure; call SDL_GetError() for
 *          more information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_sensor.h:207 SDL_Sensor * SDL_OpenSensor(SDL_SensorID instance_id);
 */
SDL_OpenSensor: {
      parameters: ["u32"],
      result: "pointer"
    },


/**
 * Return the SDL_Sensor associated with an instance ID.
 *
 * @param instance_id the sensor instance ID.
 * @returns an SDL_Sensor object or NULL on failure; call SDL_GetError() for
 *          more information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_sensor.h:218 SDL_Sensor * SDL_GetSensorFromID(SDL_SensorID instance_id);
 */
SDL_GetSensorFromID: {
      parameters: ["u32"],
      result: "pointer"
    },


/**
 * Get the properties associated with a sensor.
 *
 * @param sensor the SDL_Sensor object.
 * @returns a valid property ID on success or 0 on failure; call
 *          SDL_GetError() for more information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_sensor.h:229 SDL_PropertiesID SDL_GetSensorProperties(SDL_Sensor *sensor);
 */
SDL_GetSensorProperties: {
      parameters: ["pointer"],
      result: "u32"
    },


/**
 * Get the implementation dependent name of a sensor.
 *
 * @param sensor the SDL_Sensor object.
 * @returns the sensor name or NULL on failure; call SDL_GetError() for more
 *          information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_sensor.h:240 const char * SDL_GetSensorName(SDL_Sensor *sensor);
 */
SDL_GetSensorName: {
      parameters: ["pointer"],
      result: "pointer"
    },


/**
 * Get the type of a sensor.
 *
 * @param sensor the SDL_Sensor object to inspect.
 * @returns the SDL_SensorType type, or `SDL_SENSOR_INVALID` if `sensor` is
 *          NULL.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_sensor.h:251 SDL_SensorType SDL_GetSensorType(SDL_Sensor *sensor);
 */
SDL_GetSensorType: {
      parameters: ["pointer"],
      result: "u32"
    },


/**
 * Get the platform dependent type of a sensor.
 *
 * @param sensor the SDL_Sensor object to inspect.
 * @returns the sensor platform dependent type, or -1 if `sensor` is NULL.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_sensor.h:261 int SDL_GetSensorNonPortableType(SDL_Sensor *sensor);
 */
SDL_GetSensorNonPortableType: {
      parameters: ["pointer"],
      result: "i32"
    },


/**
 * Get the instance ID of a sensor.
 *
 * @param sensor the SDL_Sensor object to inspect.
 * @returns the sensor instance ID, or 0 on failure; call SDL_GetError() for
 *          more information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_sensor.h:272 SDL_SensorID SDL_GetSensorID(SDL_Sensor *sensor);
 */
SDL_GetSensorID: {
      parameters: ["pointer"],
      result: "u32"
    },


/**
 * Get the current state of an opened sensor.
 *
 * The number of values and interpretation of the data is sensor dependent.
 *
 * @param sensor the SDL_Sensor object to query.
 * @param data a pointer filled with the current sensor state.
 * @param num_values the number of values to write to data.
 * @returns true on success or false on failure; call SDL_GetError() for more
 *          information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_sensor.h:287 bool SDL_GetSensorData(SDL_Sensor *sensor, float *data, int num_values);
 */
SDL_GetSensorData: {
      parameters: ["pointer", "pointer", "i32"],
      result: "bool"
    },


/**
 * Close a sensor previously opened with SDL_OpenSensor().
 *
 * @param sensor the SDL_Sensor object to close.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_sensor.h:296 void SDL_CloseSensor(SDL_Sensor *sensor);
 */
SDL_CloseSensor: {
      parameters: ["pointer"],
      result: "void"
    },


/**
 * Update the current state of the open sensors.
 *
 * This is called automatically by the event loop if sensor events are
 * enabled.
 *
 * This needs to be called from the thread that initialized the sensor
 * subsystem.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_sensor.h:309 void SDL_UpdateSensors(void);
 */
SDL_UpdateSensors: {
      parameters: [],
      result: "void"
    },

} as const satisfies Deno.ForeignLibraryInterface;
