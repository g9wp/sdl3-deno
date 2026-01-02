export interface UserConfig {
  /**
   * Path to SDL3.dll/libSDL3.so/libSDL3.dylib.
   */
  sdl3?: string;

  /**
   * Path to SDL3_image.dll/libSDL3_image.so/libSDL3_image.dylib.
   */
  sdl3_image?: string;

  /**
   * Path to SDL3_ttf.dll/libSDL3_ttf.so/libSDL3_ttf.dylib.
   */
  sdl3_ttf?: string;

  /**
   * Path to the directory containing the library files (SDL3.dll/libSDL3.so/libSDL3.dylib/SDL3_image.dll...).
   *
   * @default ['sdl3', 'lib', `${import.meta.dirname}/../sdl3`, `${import.meta.dirname}/../lib`]
   */
  lib?: string | string[];

  /**
   * Environment variable to use for the library path.
   *
   * @default "SDL3_DENO_PATH"
   * @example "SDL3_DENO_PATH=/path/to/sdl3"
   *
   * Set to `false` to disable environment variable lookup.
   */
  env?: string | boolean;
}

export function defineConfig(config: UserConfig): UserConfig {
  return config;
}
