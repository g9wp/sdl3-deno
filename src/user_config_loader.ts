import type { UserConfig } from "./user_config.ts";
import * as path from '@std/path';
import * as fs from '@std/fs';

export interface LibPathConfig {
  SDL3: string;
  SDL3_image: string;
  SDL3_ttf: string;
}

export default await loadConfig();

async function loadConfig(): Promise<LibPathConfig> {
  const configPath = 'sdl3-deno.config.ts';
  let config: UserConfig | undefined = undefined;
  if (await fs.exists(configPath)) {
    config = (await import(path.toFileUrl(path.resolve(configPath)).toString())).default as UserConfig;
  }

  const sdl3 = config?.sdl3 || await libPath('SDL3', config);
  const sdl3_image = config?.sdl3_image || await libPath('SDL3_image', config);
  const sdl3_ttf = config?.sdl3_ttf || await libPath('SDL3_ttf', config);
  return { SDL3: path.resolve(sdl3), SDL3_image: path.resolve(sdl3_image), SDL3_ttf: path.resolve(sdl3_ttf) };
}


async function libPath(name: string, config?: UserConfig): Promise<string> {
  const OS_PREFIX = Deno.build.os === "windows" ? "" : "lib";
  const OS_SUFFIX = Deno.build.os === "windows" ? ".dll" : Deno.build.os === "darwin" ? ".dylib" : ".so";
  const f = `${OS_PREFIX}${name}${OS_SUFFIX}`;

  const lib = config?.lib;
  if (config?.env !== false) {
    const env = typeof config?.env === 'string' ? config.env : "DENO_SDL3_PATH";
    const envPath = Deno.env.get(env);
    if (envPath) {
      return path.join(envPath, f);
    }
  }

  if (typeof lib === 'string') {
      return path.join(lib, f);
  } else {
    for (const dir of lib || defaultLibPaths()) {
      if (await fs.exists(path.join(dir, f))) {
        return path.join(dir, f);
      }
    }
  }
  return f;
}

function* defaultLibPaths(): Generator<string> {
  const lib = ["./sdl3", "./lib"];
  for (const dir of lib) {
    yield dir;
  }
  if (import.meta.dirname && path.normalize('.') != path.normalize(path.join(import.meta.dirname, ".."))) {
    yield* lib.map((dir) => path.normalize(path.join(import.meta.dirname!, "..", dir)));
  }
}
