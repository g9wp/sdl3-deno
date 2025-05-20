/**
 * SDL pointer types for Deno FFI.
 *
 * These types represent pointers to various SDL structures that can be passed
 * between Deno and native SDL code via FFI (Foreign Function Interface).
 *
 * Each type is parameterized with the corresponding SDL structure name as a
 * type-level string literal for better type safety and documentation.
 *
 * @module
 */

export type RendererPointer = Deno.PointerValue<"SDL_Renderer">;
export type SurfacePointer = Deno.PointerValue<"SDL_Surface">;
export type WindowPointer = Deno.PointerValue<"SDL_Window">;

export type RectPointer = Deno.PointerValue<"SDL_Rect">;
export type PointPointer = Deno.PointerValue<"SDL_Point">;
export type FRectPointer = Deno.PointerValue<"SDL_FRect">;
export type FPointPointer = Deno.PointerValue<"SDL_FPoint">;

export type FColorPointer = Deno.PointerValue<"SDL_FColor">;
export type ColorPointer = Deno.PointerValue<"SDL_Color">;

export type IoStreamPointer = Deno.PointerValue<"SDL_IOStream">;
