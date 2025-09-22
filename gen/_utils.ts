const DENO_SDL3_PATH = (() => {
  try {
    return Deno.env.get("DENO_SDL3_PATH");
  } catch (_) {
    return undefined;
  }
})();

const OS_PREFIX = Deno.build.os === "windows" ? "" : "lib";
const OS_SUFFIX = Deno.build.os === "windows" ? ".dll" : Deno.build.os === "darwin" ? ".dylib" : ".so";

export function libSdlPath(lib: string): string {
  lib = `${OS_PREFIX}${lib}${OS_SUFFIX}`;
  if (DENO_SDL3_PATH) {
    return `${DENO_SDL3_PATH}/${lib}`;
  } else {
    return `${import.meta.dirname}/../sdl3/${lib}`;
  }
}

export function isPlatform(platform: string): boolean {
  switch (platform) {
    case "WIN32":
    case "WINDOWS":
      return Deno.build.os === "windows";
    case "IOS":
      return Deno.build.os === "darwin";
    case "LINUX":
      return Deno.build.os === "linux";
    case "ANDROID":
      return Deno.build.os === "android";
    case "GDK":
    default:
      return false;
  }
}

export function read_cstr(p: Deno.PointerValue): string | undefined {
  if (!p) return undefined;
  return new Deno.UnsafePointerView(p).getCString();
}
export function read_cstr_v(v: bigint): string {
  const p = Deno.UnsafePointer.create(v);
  if (!p) return "";
  return read_cstr(p)!;
}

const enc = new TextEncoder();

export function cstr(s: string): Deno.PointerValue {
  return Deno.UnsafePointer.of(enc.encode(s + "\0"));
}
export function cstr_v(s: string): bigint {
  return Deno.UnsafePointer.value(cstr(s));
}
