import { getError } from "../gen/sdl/error.ts";
import { INIT, init } from "../gen/sdl/init.ts";
import { pumpEvents } from "../gen/sdl/events.ts";

const enc = new TextEncoder();

export function cstr(s?: string): Deno.PointerValue {
  if (s === undefined) return null;
  return Deno.UnsafePointer.of(enc.encode(`${s}\0`));
}

export function cstr_v(s: string): bigint {
  return Deno.UnsafePointer.value(cstr(s));
}

export function ptr_view(p: Deno.PointerValue): Deno.UnsafePointerView {
  if (!p) throw new Error("Pointer is null");
  return new Deno.UnsafePointerView(p);
}

export function read_cstr(p: Deno.PointerValue): string {
  return ptr_view(p).getCString();
}

export function getErr(): string {
  return getError();
}

export function SdlError(s?: string): Error {
  return new Error(`${s || "SDL Error"}: ${getErr()}`);
}

export function init_pumpEvents(tick = 1000 / 60): number {
  if (!init(INIT.VIDEO | INIT.EVENTS)) throw SdlError("SDL init failed");
  return setInterval(pumpEvents, tick);
}
