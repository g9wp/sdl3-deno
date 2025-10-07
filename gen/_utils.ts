import config from '../src/user_config_loader.ts';

export function libSdlPath(lib: string): string {
  switch(lib) {
    case "SDL3":
    case "SDL3_image":
    case "SDL3_ttf":
      return config[lib];
    default:
      throw new Error(`Unknown library: ${lib}`);
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
