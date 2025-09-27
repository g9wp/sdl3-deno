/**
 * SDL3_ttf library bindings.
 *
 * This module exports functions and enums to the `TTF` object from the SDL3_ttf library
 *
 * @module
 */

import * as TTF from "../gen/TTF.ts";
import { SdlError } from "./_utils.ts";
import { Buf, Cursor } from "@g9wp/ptr";
import type { Color, FColor } from "../gen/structs/SDL_pixels.ts";
import type { Point, Size } from "./rect.ts";
import { Surface } from "./surface.ts";
import {
  read_SubString,
  type SubString,
  write_SubString,
} from "../gen/structs/SDL_ttf.ts";
import { free } from "../gen/sdl/stdinc.ts";

import type {
  IoStreamPointer,
  RendererPointer,
  SurfacePointer,
} from "./pointer_type.ts";
type FontPointer = Deno.PointerValue<"TTF_Font">;
type TextPointer = Deno.PointerValue<"TTF_Text">;
type TextEnginePointer = Deno.PointerValue<"TTF_TextEngine">;

/**
 * Context for managing SDL_ttf library initialization and state.
 *
 * This class handles the initialization and cleanup of the SDL_ttf library.
 * It follows a reference counting pattern where each successful initialization
 * must be paired with a quit call. The library will only actually deinitialize
 * when the quit count matches the initialization count.
 *
 * @since SDL_ttf 3.0.0
 */
export class TtfContext {
  #inited: boolean = false;

  /**
   * Initialize SDL_ttf.
   *
   * You must successfully call this function before it is safe to call any
   * other function in this library.
   *
   * It is safe to call this more than once, and each successful TTF_Init() call
   * should be paired with a matching TTF_Quit() call.
   *
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_Quit
   *
   * @from SDL_ttf.h:130 bool TTF_Init(void);
   */
  constructor() {
    if (!TTF.init()) throw SdlError("TTF init failed");
    this.#inited = true;
  }

  /**
   * Check if SDL_ttf is initialized.
   *
   * This reports the number of times the library has been initialized by a call
   * to TTF_Init(), without a paired deinitialization request from TTF_Quit().
   *
   * In short: if it's greater than zero, the library is currently initialized
   * and ready to work. If zero, it is not initialized.
   *
   * Despite the return value being a signed integer, this function should not
   * return a negative number.
   *
   * @returns the current number of initialization calls, that need to
   *          eventually be paired with this many calls to TTF_Quit().
   *
   * @threadsafety It is safe to call this function from any thread.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_Init
   * @sa TTF_Quit
   *
   * @from SDL_ttf.h:2823 int TTF_WasInit(void);
   */
  wasInit(): number {
    return TTF.wasInit();
  }

  /**
   * Deinitialize SDL_ttf.
   *
   * You must call this when done with the library, to free internal resources.
   * It is safe to call this when the library isn't initialized, as it will just
   * return immediately.
   *
   * Once you have as many quit calls as you have had successful calls to
   * TTF_Init, the library will actually deinitialize.
   *
   * Please note that this does not automatically close any fonts that are still
   * open at the time of deinitialization, and it is possibly not safe to close
   * them afterwards, as parts of the library will no longer be initialized to
   * deal with it. A well-written program should call TTF_CloseFont() on any
   * open fonts before calling this function!
   *
   * @threadsafety It is safe to call this function from any thread.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @from SDL_ttf.h:2799 void TTF_Quit(void);
   */
  quit() {
    if (!this.#inited) return;
    TTF.quit();
    this.#inited = false;
  }

  [Symbol.dispose]() {
    this.quit();
  }
}

/**
 * A font object for rendering text.
 *
 * This class represents a loaded font that can be used for text rendering operations.
 * It provides methods for querying font metrics, rendering text to surfaces, and
 * managing font properties like style, size, and direction.
 *
 * Font instances are created using static factory methods like `Font.open()` and
 * must be properly disposed of using `close()` or the `[Symbol.dispose]()` method
 * when no longer needed.
 *
 * @since SDL_ttf 3.0.0
 */
export class Font {
  constructor(public pointer: FontPointer) {}

  /**
   * Create a font from a file, using a specified point size.
   *
   * Some .fon fonts will have several sizes embedded in the file, so the point
   * size becomes the index of choosing which size. If the value is too high,
   * the last indexed size will be the default.
   *
   * When done with the returned TTF_Font, use TTF_CloseFont() to dispose of it.
   *
   * @param file path to font file.
   * @param ptsize point size to use for the newly-opened font.
   * @returns a valid TTF_Font, or NULL on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety It is safe to call this function from any thread.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_CloseFont
   *
   * @from SDL_ttf.h:152 TTF_Font * TTF_OpenFont(const char *file, float ptsize);
   */
  static open(file: string, ptsize: number): Font {
    const fontPointer = TTF.openFont(file, ptsize);
    if (fontPointer === null) throw SdlError("openFont");
    return new Font(fontPointer);
  }

  /**
   * Create a font from an SDL_IOStream, using a specified point size.
   *
   * Some .fon fonts will have several sizes embedded in the file, so the point
   * size becomes the index of choosing which size. If the value is too high,
   * the last indexed size will be the default.
   *
   * If `closeio` is true, `src` will be automatically closed once the font is
   * closed. Otherwise you should close `src` yourself after closing the font.
   *
   * When done with the returned TTF_Font, use TTF_CloseFont() to dispose of it.
   *
   * @param src an SDL_IOStream to provide a font file's data.
   * @param closeio true to close `src` when the font is closed, false to leave
   *                it open.
   * @param ptsize point size to use for the newly-opened font.
   * @returns a valid TTF_Font, or NULL on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety It is safe to call this function from any thread.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_CloseFont
   *
   * @from SDL_ttf.h:179 TTF_Font * TTF_OpenFontIO(SDL_IOStream *src, bool closeio, float ptsize);
   */
  static openIo(
    src: IoStreamPointer,
    closeio: boolean,
    ptsize: number,
  ): Font {
    const fontPointer = TTF.openFontIo(src, closeio, ptsize);
    if (fontPointer === null) throw SdlError("openFont");
    return new Font(fontPointer);
  }

  /**
   * Create a font with the specified properties.
   *
   * These are the supported properties:
   *
   * - `TTF_PROP_FONT_CREATE_FILENAME_STRING`: the font file to open, if an
   *   SDL_IOStream isn't being used. This is required if
   *   `TTF_PROP_FONT_CREATE_IOSTREAM_POINTER` and
   *   `TTF_PROP_FONT_CREATE_EXISTING_FONT` aren't set.
   * - `TTF_PROP_FONT_CREATE_IOSTREAM_POINTER`: an SDL_IOStream containing the
   *   font to be opened. This should not be closed until the font is closed.
   *   This is required if `TTF_PROP_FONT_CREATE_FILENAME_STRING` and
   *   `TTF_PROP_FONT_CREATE_EXISTING_FONT` aren't set.
   * - `TTF_PROP_FONT_CREATE_IOSTREAM_OFFSET_NUMBER`: the offset in the iostream
   *   for the beginning of the font, defaults to 0.
   * - `TTF_PROP_FONT_CREATE_IOSTREAM_AUTOCLOSE_BOOLEAN`: true if closing the
   *   font should also close the associated SDL_IOStream.
   * - `TTF_PROP_FONT_CREATE_SIZE_FLOAT`: the point size of the font. Some .fon
   *   fonts will have several sizes embedded in the file, so the point size
   *   becomes the index of choosing which size. If the value is too high, the
   *   last indexed size will be the default.
   * - `TTF_PROP_FONT_CREATE_FACE_NUMBER`: the face index of the font, if the
   *   font contains multiple font faces.
   * - `TTF_PROP_FONT_CREATE_HORIZONTAL_DPI_NUMBER`: the horizontal DPI to use
   *   for font rendering, defaults to
   *   `TTF_PROP_FONT_CREATE_VERTICAL_DPI_NUMBER` if set, or 72 otherwise.
   * - `TTF_PROP_FONT_CREATE_VERTICAL_DPI_NUMBER`: the vertical DPI to use for
   *   font rendering, defaults to `TTF_PROP_FONT_CREATE_HORIZONTAL_DPI_NUMBER`
   *   if set, or 72 otherwise.
   * - `TTF_PROP_FONT_CREATE_EXISTING_FONT`: an optional TTF_Font that, if set,
   *   will be used as the font data source and the initial size and style of
   *   the new font.
   *
   * @param props the properties to use.
   * @returns a valid TTF_Font, or NULL on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety It is safe to call this function from any thread.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_CloseFont
   *
   * @from SDL_ttf.h:224 TTF_Font * TTF_OpenFontWithProperties(SDL_PropertiesID props);
   */
  static openWithProperties(props: number): Font {
    const fontPointer = TTF.openFontWithProperties(props);
    if (fontPointer === null) throw SdlError("openFont");
    return new Font(fontPointer);
  }

  /**
   * Dispose of a previously-created font.
   *
   * Call this when done with a font. This function will free any resources
   * associated with it. It is safe to call this function on NULL, for example
   * on the result of a failed call to TTF_OpenFont().
   *
   * The font is not valid after being passed to this function. String pointers
   * from functions that return information on this font, such as
   * TTF_GetFontFamilyName() and TTF_GetFontStyleName(), are no longer valid
   * after this call, as well.
   *
   * @param font the font to dispose of.
   *
   * @threadsafety This function should not be called while any other thread is
   *               using the font.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_OpenFont
   * @sa TTF_OpenFontIO
   *
   * @from SDL_ttf.h:2777 void TTF_CloseFont(TTF_Font *font);
   */
  close() {
    if (!this.pointer) return;
    TTF.closeFont(this.pointer);
    this.pointer = null;
  }

  [Symbol.dispose]() {
    this.close();
  }

  /**
   * Create a copy of an existing font.
   *
   * The copy will be distinct from the original, but will share the font file
   * and have the same size and style as the original.
   *
   * When done with the returned TTF_Font, use TTF_CloseFont() to dispose of it.
   *
   * @param existing_font the font to copy.
   * @returns a valid TTF_Font, or NULL on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should be called on the thread that created the
   *               original font.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_CloseFont
   *
   * @from SDL_ttf.h:255 TTF_Font * TTF_CopyFont(TTF_Font *existing_font);
   */
  copy(): Font {
    const fontPointer = TTF.copyFont(this.pointer);
    if (fontPointer === null) throw SdlError("openFont");
    return new Font(fontPointer);
  }

  /**
   * Get the properties associated with a font.
   *
   * The following read-write properties are provided by SDL:
   *
   * - `TTF_PROP_FONT_OUTLINE_LINE_CAP_NUMBER`: The FT_Stroker_LineCap value
   *   used when setting the font outline, defaults to
   *   `FT_STROKER_LINECAP_ROUND`.
   * - `TTF_PROP_FONT_OUTLINE_LINE_JOIN_NUMBER`: The FT_Stroker_LineJoin value
   *   used when setting the font outline, defaults to
   *   `FT_STROKER_LINEJOIN_ROUND`.
   * - `TTF_PROP_FONT_OUTLINE_MITER_LIMIT_NUMBER`: The FT_Fixed miter limit used
   *   when setting the font outline, defaults to 0.
   *
   * @param font the font to query.
   * @returns a valid property ID on success or 0 on failure; call
   *          SDL_GetError() for more information.
   *
   * @threadsafety It is safe to call this function from any thread.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @from SDL_ttf.h:279 SDL_PropertiesID TTF_GetFontProperties(TTF_Font *font);
   */
  get properties(): number {
    return TTF.getFontProperties(this.pointer);
  }

  /**
   * Get the font generation.
   *
   * The generation is incremented each time font properties change that require
   * rebuilding glyphs, such as style, size, etc.
   *
   * @param font the font to query.
   * @returns the font generation or 0 on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should be called on the thread that created the
   *               font.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @from SDL_ttf.h:300 Uint32 TTF_GetFontGeneration(TTF_Font *font);
   */
  get generation(): number {
    return TTF.getFontGeneration(this.pointer);
  }

  /**
   * Add a fallback font.
   *
   * Add a font that will be used for glyphs that are not in the current font.
   * The fallback font should have the same size and style as the current font.
   *
   * If there are multiple fallback fonts, they are used in the order added.
   *
   * This updates any TTF_Text objects using this font.
   *
   * @param font the font to modify.
   * @param fallback the font to add as a fallback.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should be called on the thread that created
   *               both fonts.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_ClearFallbackFonts
   * @sa TTF_RemoveFallbackFont
   *
   * @from SDL_ttf.h:325 bool TTF_AddFallbackFont(TTF_Font *font, TTF_Font *fallback);
   */
  addFallback(fallback: Font): boolean {
    return TTF.addFallbackFont(this.pointer, fallback.pointer);
  }

  /**
   * Remove a fallback font.
   *
   * This updates any TTF_Text objects using this font.
   *
   * @param font the font to modify.
   * @param fallback the font to remove as a fallback.
   *
   * @threadsafety This function should be called on the thread that created
   *               both fonts.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_AddFallbackFont
   * @sa TTF_ClearFallbackFonts
   *
   * @from SDL_ttf.h:343 void TTF_RemoveFallbackFont(TTF_Font *font, TTF_Font *fallback);
   */
  removeFallback(fallback: Font) {
    TTF.removeFallbackFont(this.pointer, fallback.pointer);
  }

  /**
   * Remove all fallback fonts.
   *
   * This updates any TTF_Text objects using this font.
   *
   * @param font the font to modify.
   *
   * @threadsafety This function should be called on the thread that created the
   *               font.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_AddFallbackFont
   * @sa TTF_RemoveFallbackFont
   *
   * @from SDL_ttf.h:360 void TTF_ClearFallbackFonts(TTF_Font *font);
   */
  clearFallback() {
    TTF.clearFallbackFonts(this.pointer);
  }

  /**
   * Set a font's size dynamically.
   *
   * This updates any TTF_Text objects using this font, and clears
   * already-generated glyphs, if any, from the cache.
   *
   * @param font the font to resize.
   * @param ptsize the new point size.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should be called on the thread that created the
   *               font.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_GetFontSize
   *
   * @from SDL_ttf.h:380 bool TTF_SetFontSize(TTF_Font *font, float ptsize);
   */
  setSize(ptsize: number): boolean {
    return TTF.setFontSize(this.pointer, ptsize);
  }

  /**
   * Set font size dynamically with target resolutions, in dots per inch.
   *
   * This updates any TTF_Text objects using this font, and clears
   * already-generated glyphs, if any, from the cache.
   *
   * @param font the font to resize.
   * @param ptsize the new point size.
   * @param hdpi the target horizontal DPI.
   * @param vdpi the target vertical DPI.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should be called on the thread that created the
   *               font.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_GetFontSize
   * @sa TTF_GetFontSizeDPI
   *
   * @from SDL_ttf.h:403 bool TTF_SetFontSizeDPI(TTF_Font *font, float ptsize, int hdpi, int vdpi);
   */
  setSizeDpi(ptsize: number, hdpi: number, vdpi: number): boolean {
    return TTF.setFontSizeDpi(this.pointer, ptsize, hdpi, vdpi);
  }
  /**
   * Get the size of a font.
   *
   * @param font the font to query.
   * @returns the size of the font, or 0.0f on failure; call SDL_GetError() for
   *          more information.
   *
   * @threadsafety This function should be called on the thread that created the
   *               font.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_SetFontSize
   * @sa TTF_SetFontSizeDPI
   *
   * @from SDL_ttf.h:420 float TTF_GetFontSize(TTF_Font *font);
   */
  get size(): number {
    return TTF.getFontSize(this.pointer);
  }

  /**
   * Get font target resolutions, in dots per inch.
   *
   * @param font the font to query.
   * @param hdpi a pointer filled in with the target horizontal DPI.
   * @param vdpi a pointer filled in with the target vertical DPI.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should be called on the thread that created the
   *               font.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_SetFontSizeDPI
   *
   * @from SDL_ttf.h:438 bool TTF_GetFontDPI(TTF_Font *font, int *hdpi, int *vdpi);
   */
  get dpi(): { hdpi: number; vdpi: number } {
    return TTF.getFontDpi(this.pointer);
  }

  /**
   * Set a font's current style.
   *
   * This updates any TTF_Text objects using this font, and clears
   * already-generated glyphs, if any, from the cache.
   *
   * The font styles are a set of bit flags, OR'd together:
   *
   * - `TTF_STYLE_NORMAL` (is zero)
   * - `TTF_STYLE_BOLD`
   * - `TTF_STYLE_ITALIC`
   * - `TTF_STYLE_UNDERLINE`
   * - `TTF_STYLE_STRIKETHROUGH`
   *
   * @param font the font to set a new style on.
   * @param style the new style values to set, OR'd together.
   *
   * @threadsafety This function should be called on the thread that created the
   *               font.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_GetFontStyle
   *
   * @from SDL_ttf.h:484 void TTF_SetFontStyle(TTF_Font *font, TTF_FontStyleFlags style);
   */
  setStyle(style: number) {
    TTF.setFontStyle(this.pointer, style);
  }

  /**
   * Query a font's current style.
   *
   * The font styles are a set of bit flags, OR'd together:
   *
   * - `TTF_STYLE_NORMAL` (is zero)
   * - `TTF_STYLE_BOLD`
   * - `TTF_STYLE_ITALIC`
   * - `TTF_STYLE_UNDERLINE`
   * - `TTF_STYLE_STRIKETHROUGH`
   *
   * @param font the font to query.
   * @returns the current font style, as a set of bit flags.
   *
   * @threadsafety It is safe to call this function from any thread.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_SetFontStyle
   *
   * @from SDL_ttf.h:506 TTF_FontStyleFlags TTF_GetFontStyle(const TTF_Font *font);
   */
  get style(): number {
    return TTF.getFontStyle(this.pointer);
  }

  /**
   * Set a font's current outline.
   *
   * This uses the font properties `TTF_PROP_FONT_OUTLINE_LINE_CAP_NUMBER`,
   * `TTF_PROP_FONT_OUTLINE_LINE_JOIN_NUMBER`, and
   * `TTF_PROP_FONT_OUTLINE_MITER_LIMIT_NUMBER` when setting the font outline.
   *
   * This updates any TTF_Text objects using this font, and clears
   * already-generated glyphs, if any, from the cache.
   *
   * @param font the font to set a new outline on.
   * @param outline positive outline value, 0 to default.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should be called on the thread that created the
   *               font.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_GetFontOutline
   *
   * @from SDL_ttf.h:530 bool TTF_SetFontOutline(TTF_Font *font, int outline);
   */
  setOutline(outline: number): boolean {
    return TTF.setFontOutline(this.pointer, outline);
  }

  /**
   * Query a font's current outline.
   *
   * @param font the font to query.
   * @returns the font's current outline value.
   *
   * @threadsafety It is safe to call this function from any thread.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_SetFontOutline
   *
   * @from SDL_ttf.h:544 int TTF_GetFontOutline(const TTF_Font *font);
   */
  get outline(): number {
    return TTF.getFontOutline(this.pointer);
  }

  /**
   * Set a font's current hinter setting.
   *
   * This updates any TTF_Text objects using this font, and clears
   * already-generated glyphs, if any, from the cache.
   *
   * The hinter setting is a single value:
   *
   * - `TTF_HINTING_NORMAL`
   * - `TTF_HINTING_LIGHT`
   * - `TTF_HINTING_MONO`
   * - `TTF_HINTING_NONE`
   * - `TTF_HINTING_LIGHT_SUBPIXEL` (available in SDL_ttf 3.0.0 and later)
   *
   * @param font the font to set a new hinter setting on.
   * @param hinting the new hinter setting.
   *
   * @threadsafety This function should be called on the thread that created the
   *               font.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_GetFontHinting
   *
   * @from SDL_ttf.h:592 void TTF_SetFontHinting(TTF_Font *font, TTF_HintingFlags hinting);
   */
  setHinting(hinting: number) {
    TTF.setFontHinting(this.pointer, hinting);
  }

  /**
   * Query the number of faces of a font.
   *
   * @param font the font to query.
   * @returns the number of FreeType font faces.
   *
   * @threadsafety It is safe to call this function from any thread.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @from SDL_ttf.h:604 int TTF_GetNumFontFaces(const TTF_Font *font);
   */
  get numFaces(): number {
    return TTF.getNumFontFaces(this.pointer);
  }
  /**
   * Query a font's current FreeType hinter setting.
   *
   * The hinter setting is a single value:
   *
   * - `TTF_HINTING_NORMAL`
   * - `TTF_HINTING_LIGHT`
   * - `TTF_HINTING_MONO`
   * - `TTF_HINTING_NONE`
   * - `TTF_HINTING_LIGHT_SUBPIXEL` (available in SDL_ttf 3.0.0 and later)
   *
   * @param font the font to query.
   * @returns the font's current hinter value, or TTF_HINTING_INVALID if the
   *          font is invalid.
   *
   * @threadsafety It is safe to call this function from any thread.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_SetFontHinting
   *
   * @from SDL_ttf.h:627 TTF_HintingFlags TTF_GetFontHinting(const TTF_Font *font);
   */
  get hinting(): number {
    return TTF.getFontHinting(this.pointer);
  }

  /**
   * Enable Signed Distance Field rendering for a font.
   *
   * SDF is a technique that helps fonts look sharp even when scaling and
   * rotating, and requires special shader support for display.
   *
   * This works with Blended APIs, and generates the raw signed distance values
   * in the alpha channel of the resulting texture.
   *
   * This updates any TTF_Text objects using this font, and clears
   * already-generated glyphs, if any, from the cache.
   *
   * @param font the font to set SDF support on.
   * @param enabled true to enable SDF, false to disable.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should be called on the thread that created the
   *               font.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_GetFontSDF
   *
   * @from SDL_ttf.h:653 bool TTF_SetFontSDF(TTF_Font *font, bool enabled);
   */
  setSdf(enabled: boolean): boolean {
    return TTF.setFontSdf(this.pointer, enabled);
  }

  /**
   * Query whether Signed Distance Field rendering is enabled for a font.
   *
   * @param font the font to query.
   * @returns true if enabled, false otherwise.
   *
   * @threadsafety It is safe to call this function from any thread.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_SetFontSDF
   *
   * @from SDL_ttf.h:667 bool TTF_GetFontSDF(const TTF_Font *font);
   */
  get sdf(): boolean {
    return TTF.getFontSdf(this.pointer);
  }

  /**
   * Query a font's weight, in terms of the lightness/heaviness of the strokes.
   *
   * @param font the font to query.
   * @returns the font's current weight.
   *
   * @threadsafety This function should be called on the thread that created the
   *               font.
   *
   * @since This function is available since SDL_ttf 3.4.0.
   *
   * @from SDL_ttf.h:680 int TTF_GetFontWeight(const TTF_Font *font);
   */
  get weight(): number {
    return TTF.getFontWeight(this.pointer);
  }

  /**
   * Set a font's current wrap alignment option.
   *
   * This updates any TTF_Text objects using this font.
   *
   * @param font the font to set a new wrap alignment option on.
   * @param align the new wrap alignment option.
   *
   * @threadsafety This function should be called on the thread that created the
   *               font.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_GetFontWrapAlignment
   *
   * @from SDL_ttf.h:721 void TTF_SetFontWrapAlignment(TTF_Font *font, TTF_HorizontalAlignment align);
   */
  setWrapAlignment(align: number) {
    TTF.setFontWrapAlignment(this.pointer, align);
  }

  /**
   * Query a font's current wrap alignment option.
   *
   * @param font the font to query.
   * @returns the font's current wrap alignment option.
   *
   * @threadsafety It is safe to call this function from any thread.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_SetFontWrapAlignment
   *
   * @from SDL_ttf.h:735 TTF_HorizontalAlignment TTF_GetFontWrapAlignment(const TTF_Font *font);
   */
  get wrapAlignment(): number {
    return TTF.getFontWrapAlignment(this.pointer);
  }

  /**
   * Query the total height of a font.
   *
   * This is usually equal to point size.
   *
   * @param font the font to query.
   * @returns the font's height.
   *
   * @threadsafety It is safe to call this function from any thread.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @from SDL_ttf.h:749 int TTF_GetFontHeight(const TTF_Font *font);
   */
  get height(): number {
    return TTF.getFontHeight(this.pointer);
  }

  /**
   * Query the offset from the baseline to the top of a font.
   *
   * This is a positive value, relative to the baseline.
   *
   * @param font the font to query.
   * @returns the font's ascent.
   *
   * @threadsafety It is safe to call this function from any thread.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @from SDL_ttf.h:763 int TTF_GetFontAscent(const TTF_Font *font);
   */
  get ascent(): number {
    return TTF.getFontAscent(this.pointer);
  }

  /**
   * Query the offset from the baseline to the bottom of a font.
   *
   * This is a negative value, relative to the baseline.
   *
   * @param font the font to query.
   * @returns the font's descent.
   *
   * @threadsafety It is safe to call this function from any thread.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @from SDL_ttf.h:777 int TTF_GetFontDescent(const TTF_Font *font);
   */
  get descent(): number {
    return TTF.getFontDescent(this.pointer);
  }

  /**
   * Set the spacing between lines of text for a font.
   *
   * This updates any TTF_Text objects using this font.
   *
   * @param font the font to modify.
   * @param lineskip the new line spacing for the font.
   *
   * @threadsafety This function should be called on the thread that created the
   *               font.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_GetFontLineSkip
   *
   * @from SDL_ttf.h:794 void TTF_SetFontLineSkip(TTF_Font *font, int lineskip);
   */
  setLineSkip(lineskip: number): void {
    TTF.setFontLineSkip(this.pointer, lineskip);
  }

  /**
   * Query the spacing between lines of text for a font.
   *
   * @param font the font to query.
   * @returns the font's recommended spacing.
   *
   * @threadsafety It is safe to call this function from any thread.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_SetFontLineSkip
   *
   * @from SDL_ttf.h:808 int TTF_GetFontLineSkip(const TTF_Font *font);
   */
  get lineSkip(): number {
    return TTF.getFontLineSkip(this.pointer);
  }

  /**
   * Set if kerning is enabled for a font.
   *
   * Newly-opened fonts default to allowing kerning. This is generally a good
   * policy unless you have a strong reason to disable it, as it tends to
   * produce better rendering (with kerning disabled, some fonts might render
   * the word `kerning` as something that looks like `keming` for example).
   *
   * This updates any TTF_Text objects using this font.
   *
   * @param font the font to set kerning on.
   * @param enabled true to enable kerning, false to disable.
   *
   * @threadsafety This function should be called on the thread that created the
   *               font.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_GetFontKerning
   *
   * @from SDL_ttf.h:830 void TTF_SetFontKerning(TTF_Font *font, bool enabled);
   */
  setKerning(enabled: boolean): void {
    TTF.setFontKerning(this.pointer, enabled);
  }

  /**
   * Query whether or not kerning is enabled for a font.
   *
   * @param font the font to query.
   * @returns true if kerning is enabled, false otherwise.
   *
   * @threadsafety It is safe to call this function from any thread.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_SetFontKerning
   *
   * @from SDL_ttf.h:844 bool TTF_GetFontKerning(const TTF_Font *font);
   */
  get kerning(): boolean {
    return TTF.getFontKerning(this.pointer);
  }

  /**
   * Query whether a font is fixed-width.
   *
   * A "fixed-width" font means all glyphs are the same width across; a
   * lowercase 'i' will be the same size across as a capital 'W', for example.
   * This is common for terminals and text editors, and other apps that treat
   * text as a grid. Most other things (WYSIWYG word processors, web pages, etc)
   * are more likely to not be fixed-width in most cases.
   *
   * @param font the font to query.
   * @returns true if the font is fixed-width, false otherwise.
   *
   * @threadsafety It is safe to call this function from any thread.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @from SDL_ttf.h:862 bool TTF_FontIsFixedWidth(const TTF_Font *font);
   */
  isFixedWidth(): boolean {
    return TTF.fontIsFixedWidth(this.pointer);
  }

  /**
   * Query whether a font is scalable or not.
   *
   * Scalability lets us distinguish between outline and bitmap fonts.
   *
   * @param font the font to query.
   * @returns true if the font is scalable, false otherwise.
   *
   * @threadsafety It is safe to call this function from any thread.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_SetFontSDF
   *
   * @from SDL_ttf.h:878 bool TTF_FontIsScalable(const TTF_Font *font);
   */
  isScalable(): boolean {
    return TTF.fontIsScalable(this.pointer);
  }

  /**
   * Query a font's family name.
   *
   * This string is dictated by the contents of the font file.
   *
   * Note that the returned string is to internal storage, and should not be
   * modified or free'd by the caller. The string becomes invalid, with the rest
   * of the font, when `font` is handed to TTF_CloseFont().
   *
   * @param font the font to query.
   * @returns the font's family name.
   *
   * @threadsafety It is safe to call this function from any thread.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @from SDL_ttf.h:896 const char * TTF_GetFontFamilyName(const TTF_Font *font);
   */
  get familyName(): string {
    return TTF.getFontFamilyName(this.pointer);
  }

  /**
   * Query a font's style name.
   *
   * This string is dictated by the contents of the font file.
   *
   * Note that the returned string is to internal storage, and should not be
   * modified or free'd by the caller. The string becomes invalid, with the rest
   * of the font, when `font` is handed to TTF_CloseFont().
   *
   * @param font the font to query.
   * @returns the font's style name.
   *
   * @threadsafety It is safe to call this function from any thread.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @from SDL_ttf.h:914 const char * TTF_GetFontStyleName(const TTF_Font *font);
   */
  get styleName(): string {
    return TTF.getFontStyleName(this.pointer);
  }

  /**
   * Set the direction to be used for text shaping by a font.
   *
   * This function only supports left-to-right text shaping if SDL_ttf was not
   * built with HarfBuzz support.
   *
   * This updates any TTF_Text objects using this font.
   *
   * @param font the font to modify.
   * @param direction the new direction for text to flow.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should be called on the thread that created the
   *               font.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @from SDL_ttf.h:954 bool TTF_SetFontDirection(TTF_Font *font, TTF_Direction direction);
   */
  setDirection(direction: number): boolean {
    return TTF.setFontDirection(this.pointer, direction);
  }

  /**
   * Get the direction to be used for text shaping by a font.
   *
   * This defaults to TTF_DIRECTION_INVALID if it hasn't been set.
   *
   * @param font the font to query.
   * @returns the direction to be used for text shaping.
   *
   * @threadsafety This function should be called on the thread that created the
   *               font.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @from SDL_ttf.h:969 TTF_Direction TTF_GetFontDirection(TTF_Font *font);
   */
  get direction(): number {
    return TTF.getFontDirection(this.pointer);
  }

  /**
   * Convert from a 4 character string to a 32-bit tag.
   *
   * @param string the 4 character string to convert.
   * @returns the 32-bit representation of the string.
   *
   * @threadsafety It is safe to call this function from any thread.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_TagToString
   *
   * @from SDL_ttf.h:983 Uint32 TTF_StringToTag(const char *string);
   */
  static stringToTag(string: string): number {
    return TTF.stringToTag(string);
  }

  /**
   * Convert from a 32-bit tag to a 4 character string.
   *
   * @param tag the 32-bit tag to convert.
   * @param string a pointer filled in with the 4 character representation of
   *               the tag.
   * @param size the size of the buffer pointed at by string, should be at least
   *             4.
   *
   * @threadsafety It is safe to call this function from any thread.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_TagToString
   *
   * @from SDL_ttf.h:1000 void TTF_TagToString(Uint32 tag, char *string, size_t size);
   */
  static tagToString(tag: number, size: bigint): string {
    return TTF.tagToString(tag, size);
  }

  /**
   * Set the script to be used for text shaping by a font.
   *
   * This returns false if SDL_ttf isn't built with HarfBuzz support.
   *
   * This updates any TTF_Text objects using this font.
   *
   * @param font the font to modify.
   * @param script an
   *               [ISO 15924 code](https://unicode.org/iso15924/iso15924-codes.html)
   *               .
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should be called on the thread that created the
   *               font.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_StringToTag
   *
   * @from SDL_ttf.h:997 bool TTF_SetFontScript(TTF_Font *font, Uint32 script);
   */
  setScript(script: number): boolean {
    return TTF.setFontScript(this.pointer, script);
  }

  /**
   * Get the script used for text shaping a font.
   *
   * @param font the font to query.
   * @returns an
   *          [ISO 15924 code](https://unicode.org/iso15924/iso15924-codes.html)
   *          or 0 if a script hasn't been set.
   *
   * @threadsafety This function should be called on the thread that created the
   *               font.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_TagToString
   *
   * @from SDL_ttf.h:1040 Uint32 TTF_GetFontScript(TTF_Font *font);
   */
  get script(): number {
    return TTF.getFontScript(this.pointer);
  }
  /**
   * Get the script used by a 32-bit codepoint.
   *
   * @param ch the character code to check.
   * @returns an
   *          [ISO 15924 code](https://unicode.org/iso15924/iso15924-codes.html)
   *          on success, or 0 on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function is thread-safe.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_TagToString
   *
   * @from SDL_ttf.h:1057 Uint32 TTF_GetGlyphScript(Uint32 ch);
   */
  static getGlyphScript(ch: number): number {
    return TTF.getGlyphScript(ch);
  }

  /**
   * Set language to be used for text shaping by a font.
   *
   * If SDL_ttf was not built with HarfBuzz support, this function returns
   * false.
   *
   * This updates any TTF_Text objects using this font.
   *
   * @param font the font to specify a language for.
   * @param language_bcp47 a null-terminated string containing the desired
   *                       language's BCP47 code. Or null to reset the value.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should be called on the thread that created the
   *               font.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @from SDL_ttf.h:1078 bool TTF_SetFontLanguage(TTF_Font *font, const char *language_bcp47);
   */
  setLanguage(language_bcp47?: string): boolean {
    return TTF.setFontLanguage(this.pointer, language_bcp47);
  }

  /**
   * Check whether a glyph is provided by the font for a UNICODE codepoint.
   *
   * @param font the font to query.
   * @param ch the codepoint to check.
   * @returns true if font provides a glyph for this character, false if not.
   *
   * @threadsafety This function should be called on the thread that created the
   *               font.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @from SDL_ttf.h:1092 bool TTF_FontHasGlyph(TTF_Font *font, Uint32 ch);
   */
  hasGlyph(ch: number): boolean {
    return TTF.fontHasGlyph(this.pointer, ch);
  }

  /**
   * Get the pixel image for a UNICODE codepoint.
   *
   * @param font the font to query.
   * @param ch the codepoint to check.
   * @param image_type a pointer filled in with the glyph image type, may be
   *                   NULL.
   * @returns an SDL_Surface containing the glyph, or NULL on failure; call
   *          SDL_GetError() for more information.
   *
   * @threadsafety This function should be called on the thread that created the
   *               font.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @from SDL_ttf.h:1122 SDL_Surface * TTF_GetGlyphImage(TTF_Font *font, Uint32 ch, TTF_ImageType *image_type);
   */
  getGlyphImage(
    ch: number,
  ): { surface: Surface; image_type: TTF.IMAGE } {
    const { ret: surface, image_type } = TTF.getGlyphImage(this.pointer, ch);
    return { surface: Surface.of(surface), image_type };
  }

  /**
   * Get the pixel image for a character index.
   *
   * This is useful for text engine implementations, which can call this with
   * the `glyph_index` in a TTF_CopyOperation
   *
   * @param font the font to query.
   * @param glyph_index the index of the glyph to return.
   * @param image_type a pointer filled in with the glyph image type, may be
   *                   NULL.
   * @returns an SDL_Surface containing the glyph, or NULL on failure; call
   *          SDL_GetError() for more information.
   *
   * @threadsafety This function should be called on the thread that created the
   *               font.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @from SDL_ttf.h:1142 SDL_Surface * TTF_GetGlyphImageForIndex(TTF_Font *font, Uint32 glyph_index, TTF_ImageType *image_type);
   */
  getGlyphImageForIndex(
    glyph_index: number,
  ): { surface: Surface; image_type: TTF.IMAGE } {
    const { ret: surface, image_type } = TTF.getGlyphImageForIndex(
      this.pointer,
      glyph_index,
    );
    return { surface: Surface.of(surface), image_type };
  }

  /**
   * Query the metrics (dimensions) of a font's glyph for a UNICODE codepoint.
   *
   * To understand what these metrics mean, here is a useful link:
   *
   * https://freetype.sourceforge.net/freetype2/docs/tutorial/step2.html
   *
   * @param font the font to query.
   * @param ch the codepoint to check.
   * @param minx a pointer filled in with the minimum x coordinate of the glyph
   *             from the left edge of its bounding box. This value may be
   *             negative.
   * @param maxx a pointer filled in with the maximum x coordinate of the glyph
   *             from the left edge of its bounding box.
   * @param miny a pointer filled in with the minimum y coordinate of the glyph
   *             from the bottom edge of its bounding box. This value may be
   *             negative.
   * @param maxy a pointer filled in with the maximum y coordinate of the glyph
   *             from the bottom edge of its bounding box.
   * @param advance a pointer filled in with the distance to the next glyph from
   *                the left edge of this glyph's bounding box.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should be called on the thread that created the
   *               font.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @from SDL_ttf.h:1173 bool TTF_GetGlyphMetrics(TTF_Font *font, Uint32 ch, int *minx, int *maxx, int *miny, int *maxy, int *advance);
   */
  getGlyphMetrics(ch: number): {
    minx: number;
    maxx: number;
    miny: number;
    maxy: number;
    advance: number;
  } {
    return TTF.getGlyphMetrics(this.pointer, ch);
  }

  /**
   * Query the kerning size between the glyphs of two UNICODE codepoints.
   *
   * @param font the font to query.
   * @param previous_ch the previous codepoint.
   * @param ch the current codepoint.
   * @param kerning a pointer filled in with the kerning size between the two
   *                glyphs, in pixels, may be NULL.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should be called on the thread that created the
   *               font.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @from SDL_ttf.h:1191 bool TTF_GetGlyphKerning(TTF_Font *font, Uint32 previous_ch, Uint32 ch, int *kerning);
   */
  getGlyphKerning(previous_ch: number, ch: number): number {
    return TTF.getGlyphKerning(this.pointer, previous_ch, ch);
  }

  /**
   * Calculate the dimensions of a rendered string of UTF-8 text.
   *
   * This will report the width and height, in pixels, of the space that the
   * specified string will take to fully render.
   *
   * @param font the font to query.
   * @param text text to calculate, in UTF-8 encoding.
   * @param length the length of the text, in bytes, or 0 for null terminated
   *               text.
   * @param w will be filled with width, in pixels, on return.
   * @param h will be filled with height, in pixels, on return.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should be called on the thread that created the
   *               font.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @from SDL_ttf.h:1213 bool TTF_GetStringSize(TTF_Font *font, const char *text, size_t length, int *w, int *h);
   */
  getStringSize(text: string): Size {
    return TTF.getStringSize(this.pointer, text);
  }

  /**
   * Calculate the dimensions of a rendered string of UTF-8 text.
   *
   * This will report the width and height, in pixels, of the space that the
   * specified string will take to fully render.
   *
   * Text is wrapped to multiple lines on line endings and on word boundaries if
   * it extends beyond `wrap_width` in pixels.
   *
   * If wrap_width is 0, this function will only wrap on newline characters.
   *
   * @param font the font to query.
   * @param text text to calculate, in UTF-8 encoding.
   * @param length the length of the text, in bytes, or 0 for null terminated
   *               text.
   * @param wrap_width the maximum width or 0 to wrap on newline characters.
   * @param w will be filled with width, in pixels, on return.
   * @param h will be filled with height, in pixels, on return.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should be called on the thread that created the
   *               font.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @from SDL_ttf.h:1241 bool TTF_GetStringSizeWrapped(TTF_Font *font, const char *text, size_t length, int wrap_width, int *w, int *h);
   */
  getStringSizeWrapped(text: string, wrap_width: number): Size {
    return TTF.getStringSizeWrapped(this.pointer, text, wrap_width);
  }

  /**
   * Calculate how much of a UTF-8 string will fit in a given width.
   *
   * This reports the number of characters that can be rendered before reaching
   * `max_width`.
   *
   * This does not need to render the string to do this calculation.
   *
   * @param font the font to query.
   * @param text text to calculate, in UTF-8 encoding.
   * @param length the length of the text, in bytes, or 0 for null terminated
   *               text.
   * @param max_width maximum width, in pixels, available for the string, or 0
   *                  for unbounded width.
   * @param measured_width a pointer filled in with the width, in pixels, of the
   *                       string that will fit, may be NULL.
   * @param measured_length a pointer filled in with the length, in bytes, of
   *                        the string that will fit, may be NULL.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should be called on the thread that created the
   *               font.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @from SDL_ttf.h:1269 bool TTF_MeasureString(TTF_Font *font, const char *text, size_t length, int max_width, int *measured_width, size_t *measured_length);
   */
  measureString(
    text: string,
    max_width: number,
  ): { measured_width: number; measured_length: bigint } {
    return TTF.measureString(this.pointer, text, max_width);
  }

  /**
   * Render UTF-8 text at fast quality to a new 8-bit surface.
   *
   * This function will allocate a new 8-bit, palettized surface. The surface's
   * 0 pixel will be the colorkey, giving a transparent background. The 1 pixel
   * will be set to the text color.
   *
   * This will not word-wrap the string; you'll get a surface with a single line
   * of text, as long as the string requires. You can use
   * TTF_RenderText_Solid_Wrapped() instead if you need to wrap the output to
   * multiple lines.
   *
   * This will not wrap on newline characters.
   *
   * You can render at other quality levels with TTF_RenderText_Shaded,
   * TTF_RenderText_Blended, and TTF_RenderText_LCD.
   *
   * @param font the font to render with.
   * @param text text to render, in UTF-8 encoding.
   * @param length the length of the text, in bytes, or 0 for null terminated
   *               text.
   * @param fg the foreground color for the text.
   * @returns a new 8-bit, palettized surface, or NULL if there was an error.
   *
   * @threadsafety This function should be called on the thread that created the
   *               font.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_RenderText_Blended
   * @sa TTF_RenderText_LCD
   * @sa TTF_RenderText_Shaded
   * @sa TTF_RenderText_Solid
   * @sa TTF_RenderText_Solid_Wrapped
   *
   * @from SDL_ttf.h:1306 SDL_Surface * TTF_RenderText_Solid(TTF_Font *font, const char *text, size_t length, SDL_Color fg);
   */
  renderSolid(text: string, color: Color): Surface {
    return Surface.of(TTF.renderTextSolid(
      this.pointer,
      text,
      color,
    ));
  }

  /**
   * Render word-wrapped UTF-8 text at fast quality to a new 8-bit surface.
   *
   * This function will allocate a new 8-bit, palettized surface. The surface's
   * 0 pixel will be the colorkey, giving a transparent background. The 1 pixel
   * will be set to the text color.
   *
   * Text is wrapped to multiple lines on line endings and on word boundaries if
   * it extends beyond `wrapLength` in pixels.
   *
   * If wrapLength is 0, this function will only wrap on newline characters.
   *
   * You can render at other quality levels with TTF_RenderText_Shaded_Wrapped,
   * TTF_RenderText_Blended_Wrapped, and TTF_RenderText_LCD_Wrapped.
   *
   * @param font the font to render with.
   * @param text text to render, in UTF-8 encoding.
   * @param length the length of the text, in bytes, or 0 for null terminated
   *               text.
   * @param fg the foreground color for the text.
   * @param wrapLength the maximum width of the text surface or 0 to wrap on
   *                   newline characters.
   * @returns a new 8-bit, palettized surface, or NULL if there was an error.
   *
   * @threadsafety This function should be called on the thread that created the
   *               font.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_RenderText_Blended_Wrapped
   * @sa TTF_RenderText_LCD_Wrapped
   * @sa TTF_RenderText_Shaded_Wrapped
   * @sa TTF_RenderText_Solid
   *
   * @from SDL_ttf.h:1342 SDL_Surface * TTF_RenderText_Solid_Wrapped(TTF_Font *font, const char *text, size_t length, SDL_Color fg, int wrapLength);
   */
  renderSolidWrapped(
    text: string,
    fg: Color,
    wrapLength: number,
  ): Surface {
    return Surface.of(
      TTF.renderTextSolidWrapped(this.pointer, text, fg, wrapLength),
    );
  }

  /**
   * Render a single 32-bit glyph at fast quality to a new 8-bit surface.
   *
   * This function will allocate a new 8-bit, palettized surface. The surface's
   * 0 pixel will be the colorkey, giving a transparent background. The 1 pixel
   * will be set to the text color.
   *
   * The glyph is rendered without any padding or centering in the X direction,
   * and aligned normally in the Y direction.
   *
   * You can render at other quality levels with TTF_RenderGlyph_Shaded,
   * TTF_RenderGlyph_Blended, and TTF_RenderGlyph_LCD.
   *
   * @param font the font to render with.
   * @param ch the character to render.
   * @param fg the foreground color for the text.
   * @returns a new 8-bit, palettized surface, or NULL if there was an error.
   *
   * @threadsafety This function should be called on the thread that created the
   *               font.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_RenderGlyph_Blended
   * @sa TTF_RenderGlyph_LCD
   * @sa TTF_RenderGlyph_Shaded
   *
   * @from SDL_ttf.h:1371 SDL_Surface * TTF_RenderGlyph_Solid(TTF_Font *font, Uint32 ch, SDL_Color fg);
   */
  renderGlyphSolid(ch: number, fg: Color): Surface {
    const p = TTF.renderGlyphSolid(this.pointer, ch, fg);
    return Surface.of(p);
  }

  /**
   * Render UTF-8 text at high quality to a new 8-bit surface.
   *
   * This function will allocate a new 8-bit, palettized surface. The surface's
   * 0 pixel will be the specified background color, while other pixels have
   * varying degrees of the foreground color. This function returns the new
   * surface, or NULL if there was an error.
   *
   * This will not word-wrap the string; you'll get a surface with a single line
   * of text, as long as the string requires. You can use
   * TTF_RenderText_Shaded_Wrapped() instead if you need to wrap the output to
   * multiple lines.
   *
   * This will not wrap on newline characters.
   *
   * You can render at other quality levels with TTF_RenderText_Solid,
   * TTF_RenderText_Blended, and TTF_RenderText_LCD.
   *
   * @param font the font to render with.
   * @param text text to render, in UTF-8 encoding.
   * @param length the length of the text, in bytes, or 0 for null terminated
   *               text.
   * @param fg the foreground color for the text.
   * @param bg the background color for the text.
   * @returns a new 8-bit, palettized surface, or NULL if there was an error.
   *
   * @threadsafety This function should be called on the thread that created the
   *               font.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_RenderText_Blended
   * @sa TTF_RenderText_LCD
   * @sa TTF_RenderText_Shaded_Wrapped
   * @sa TTF_RenderText_Solid
   *
   * @from SDL_ttf.h:1409 SDL_Surface * TTF_RenderText_Shaded(TTF_Font *font, const char *text, size_t length, SDL_Color fg, SDL_Color bg);
   */
  renderShaded(text: string, fg: Color, bg: Color): Surface {
    const p = TTF.renderTextShaded(this.pointer, text, fg, bg);
    return Surface.of(p);
  }

  /**
   * Render word-wrapped UTF-8 text at high quality to a new 8-bit surface.
   *
   * This function will allocate a new 8-bit, palettized surface. The surface's
   * 0 pixel will be the specified background color, while other pixels have
   * varying degrees of the foreground color. This function returns the new
   * surface, or NULL if there was an error.
   *
   * Text is wrapped to multiple lines on line endings and on word boundaries if
   * it extends beyond `wrap_width` in pixels.
   *
   * If wrap_width is 0, this function will only wrap on newline characters.
   *
   * You can render at other quality levels with TTF_RenderText_Solid_Wrapped,
   * TTF_RenderText_Blended_Wrapped, and TTF_RenderText_LCD_Wrapped.
   *
   * @param font the font to render with.
   * @param text text to render, in UTF-8 encoding.
   * @param length the length of the text, in bytes, or 0 for null terminated
   *               text.
   * @param fg the foreground color for the text.
   * @param bg the background color for the text.
   * @param wrap_width the maximum width of the text surface or 0 to wrap on
   *                   newline characters.
   * @returns a new 8-bit, palettized surface, or NULL if there was an error.
   *
   * @threadsafety This function should be called on the thread that created the
   *               font.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_RenderText_Blended_Wrapped
   * @sa TTF_RenderText_LCD_Wrapped
   * @sa TTF_RenderText_Shaded
   * @sa TTF_RenderText_Solid_Wrapped
   *
   * @from SDL_ttf.h:1447 SDL_Surface * TTF_RenderText_Shaded_Wrapped(TTF_Font *font, const char *text, size_t length, SDL_Color fg, SDL_Color bg, int wrap_width);
   */
  renderShadedWrapped(
    text: string,
    fg: Color,
    bg: Color,
    wrap_width: number,
  ): Surface {
    const p = TTF.renderTextShadedWrapped(
      this.pointer,
      text,
      fg,
      bg,
      wrap_width,
    );
    return Surface.of(p);
  }

  /**
   * Render a single UNICODE codepoint at high quality to a new 8-bit surface.
   *
   * This function will allocate a new 8-bit, palettized surface. The surface's
   * 0 pixel will be the specified background color, while other pixels have
   * varying degrees of the foreground color. This function returns the new
   * surface, or NULL if there was an error.
   *
   * The glyph is rendered without any padding or centering in the X direction,
   * and aligned normally in the Y direction.
   *
   * You can render at other quality levels with TTF_RenderGlyph_Solid,
   * TTF_RenderGlyph_Blended, and TTF_RenderGlyph_LCD.
   *
   * @param font the font to render with.
   * @param ch the codepoint to render.
   * @param fg the foreground color for the text.
   * @param bg the background color for the text.
   * @returns a new 8-bit, palettized surface, or NULL if there was an error.
   *
   * @threadsafety This function should be called on the thread that created the
   *               font.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_RenderGlyph_Blended
   * @sa TTF_RenderGlyph_LCD
   * @sa TTF_RenderGlyph_Solid
   *
   * @from SDL_ttf.h:1478 SDL_Surface * TTF_RenderGlyph_Shaded(TTF_Font *font, Uint32 ch, SDL_Color fg, SDL_Color bg);
   */
  renderGlyphShaded(ch: number, fg: Color, bg: Color): Surface {
    const p = TTF.renderGlyphShaded(
      this.pointer,
      ch,
      fg,
      bg,
    );
    if (!p) throw SdlError("renderGlyphShaded");
    return Surface.of(p);
  }

  /**
   * Render UTF-8 text at high quality to a new ARGB surface.
   *
   * This function will allocate a new 32-bit, ARGB surface, using alpha
   * blending to dither the font with the given color. This function returns the
   * new surface, or NULL if there was an error.
   *
   * This will not word-wrap the string; you'll get a surface with a single line
   * of text, as long as the string requires. You can use
   * TTF_RenderText_Blended_Wrapped() instead if you need to wrap the output to
   * multiple lines.
   *
   * This will not wrap on newline characters.
   *
   * You can render at other quality levels with TTF_RenderText_Solid,
   * TTF_RenderText_Shaded, and TTF_RenderText_LCD.
   *
   * @param font the font to render with.
   * @param text text to render, in UTF-8 encoding.
   * @param length the length of the text, in bytes, or 0 for null terminated
   *               text.
   * @param fg the foreground color for the text.
   * @returns a new 32-bit, ARGB surface, or NULL if there was an error.
   *
   * @threadsafety This function should be called on the thread that created the
   *               font.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_RenderText_Blended_Wrapped
   * @sa TTF_RenderText_LCD
   * @sa TTF_RenderText_Shaded
   * @sa TTF_RenderText_Solid
   *
   * @from SDL_ttf.h:1514 SDL_Surface * TTF_RenderText_Blended(TTF_Font *font, const char *text, size_t length, SDL_Color fg);
   */
  renderBlended(text: string, fg: Color): Surface {
    const p = TTF.renderTextBlended(
      this.pointer,
      text,
      0n,
      fg,
    );
    if (!p) throw SdlError("renderTextBlended");
    return Surface.of(p);
  }

  /**
   * Render word-wrapped UTF-8 text at high quality to a new ARGB surface.
   *
   * This function will allocate a new 32-bit, ARGB surface, using alpha
   * blending to dither the font with the given color. This function returns the
   * new surface, or NULL if there was an error.
   *
   * Text is wrapped to multiple lines on line endings and on word boundaries if
   * it extends beyond `wrap_width` in pixels.
   *
   * If wrap_width is 0, this function will only wrap on newline characters.
   *
   * You can render at other quality levels with TTF_RenderText_Solid_Wrapped,
   * TTF_RenderText_Shaded_Wrapped, and TTF_RenderText_LCD_Wrapped.
   *
   * @param font the font to render with.
   * @param text text to render, in UTF-8 encoding.
   * @param length the length of the text, in bytes, or 0 for null terminated
   *               text.
   * @param fg the foreground color for the text.
   * @param wrap_width the maximum width of the text surface or 0 to wrap on
   *                   newline characters.
   * @returns a new 32-bit, ARGB surface, or NULL if there was an error.
   *
   * @threadsafety This function should be called on the thread that created the
   *               font.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_RenderText_Blended
   * @sa TTF_RenderText_LCD_Wrapped
   * @sa TTF_RenderText_Shaded_Wrapped
   * @sa TTF_RenderText_Solid_Wrapped
   *
   * @from SDL_ttf.h:1550 SDL_Surface * TTF_RenderText_Blended_Wrapped(TTF_Font *font, const char *text, size_t length, SDL_Color fg, int wrap_width);
   */
  renderBlendedWrapped(
    text: string,
    fg: Color,
    wrap_width: number,
  ): Surface {
    const p = TTF.renderTextBlendedWrapped(this.pointer, text, fg, wrap_width);
    if (!p) throw SdlError("renderTextBlendedWrapped");
    return Surface.of(p);
  }

  /**
   * Render a single UNICODE codepoint at high quality to a new ARGB surface.
   *
   * This function will allocate a new 32-bit, ARGB surface, using alpha
   * blending to dither the font with the given color. This function returns the
   * new surface, or NULL if there was an error.
   *
   * The glyph is rendered without any padding or centering in the X direction,
   * and aligned normally in the Y direction.
   *
   * You can render at other quality levels with TTF_RenderGlyph_Solid,
   * TTF_RenderGlyph_Shaded, and TTF_RenderGlyph_LCD.
   *
   * @param font the font to render with.
   * @param ch the codepoint to render.
   * @param fg the foreground color for the text.
   * @returns a new 32-bit, ARGB surface, or NULL if there was an error.
   *
   * @threadsafety This function should be called on the thread that created the
   *               font.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_RenderGlyph_LCD
   * @sa TTF_RenderGlyph_Shaded
   * @sa TTF_RenderGlyph_Solid
   *
   * @from SDL_ttf.h:1579 SDL_Surface * TTF_RenderGlyph_Blended(TTF_Font *font, Uint32 ch, SDL_Color fg);
   */
  renderGlyphBlended(ch: number, fg: Color): Surface {
    const p = TTF.renderGlyphBlended(
      this.pointer,
      ch,
      fg,
    );
    if (!p) throw SdlError("renderGlyphBlended");
    return Surface.of(p);
  }

  /**
   * Render UTF-8 text at LCD subpixel quality to a new ARGB surface.
   *
   * This function will allocate a new 32-bit, ARGB surface, and render
   * alpha-blended text using FreeType's LCD subpixel rendering. This function
   * returns the new surface, or NULL if there was an error.
   *
   * This will not word-wrap the string; you'll get a surface with a single line
   * of text, as long as the string requires. You can use
   * TTF_RenderText_LCD_Wrapped() instead if you need to wrap the output to
   * multiple lines.
   *
   * This will not wrap on newline characters.
   *
   * You can render at other quality levels with TTF_RenderText_Solid,
   * TTF_RenderText_Shaded, and TTF_RenderText_Blended.
   *
   * @param font the font to render with.
   * @param text text to render, in UTF-8 encoding.
   * @param length the length of the text, in bytes, or 0 for null terminated
   *               text.
   * @param fg the foreground color for the text.
   * @param bg the background color for the text.
   * @returns a new 32-bit, ARGB surface, or NULL if there was an error.
   *
   * @threadsafety This function should be called on the thread that created the
   *               font.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_RenderText_Blended
   * @sa TTF_RenderText_LCD_Wrapped
   * @sa TTF_RenderText_Shaded
   * @sa TTF_RenderText_Solid
   *
   * @from SDL_ttf.h:1616 SDL_Surface * TTF_RenderText_LCD(TTF_Font *font, const char *text, size_t length, SDL_Color fg, SDL_Color bg);
   */
  renderLcd(text: string, fg: Color, bg: Color): Surface {
    const p = TTF.renderTextLcd(
      this.pointer,
      text,
      0n,
      fg,
      bg,
    );
    if (!p) throw SdlError("renderTextLcd");
    return Surface.of(p);
  }

  /**
   * Render word-wrapped UTF-8 text at LCD subpixel quality to a new ARGB
   * surface.
   *
   * This function will allocate a new 32-bit, ARGB surface, and render
   * alpha-blended text using FreeType's LCD subpixel rendering. This function
   * returns the new surface, or NULL if there was an error.
   *
   * Text is wrapped to multiple lines on line endings and on word boundaries if
   * it extends beyond `wrap_width` in pixels.
   *
   * If wrap_width is 0, this function will only wrap on newline characters.
   *
   * You can render at other quality levels with TTF_RenderText_Solid_Wrapped,
   * TTF_RenderText_Shaded_Wrapped, and TTF_RenderText_Blended_Wrapped.
   *
   * @param font the font to render with.
   * @param text text to render, in UTF-8 encoding.
   * @param length the length of the text, in bytes, or 0 for null terminated
   *               text.
   * @param fg the foreground color for the text.
   * @param bg the background color for the text.
   * @param wrap_width the maximum width of the text surface or 0 to wrap on
   *                   newline characters.
   * @returns a new 32-bit, ARGB surface, or NULL if there was an error.
   *
   * @threadsafety This function should be called on the thread that created the
   *               font.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_RenderText_Blended_Wrapped
   * @sa TTF_RenderText_LCD
   * @sa TTF_RenderText_Shaded_Wrapped
   * @sa TTF_RenderText_Solid_Wrapped
   *
   * @from SDL_ttf.h:1654 SDL_Surface * TTF_RenderText_LCD_Wrapped(TTF_Font *font, const char *text, size_t length, SDL_Color fg, SDL_Color bg, int wrap_width);
   */
  renderLcdWrapped(
    text: string,
    fg: Color,
    bg: Color,
    wrap_width: number,
  ): Surface {
    const p = TTF.renderTextLcdWrapped(
      this.pointer,
      text,
      0n,
      fg,
      bg,
      wrap_width,
    );
    if (!p) throw SdlError("renderTextLcdWrapped");
    return Surface.of(p);
  }

  /**
   * Render a single UNICODE codepoint at LCD subpixel quality to a new ARGB
   * surface.
   *
   * This function will allocate a new 32-bit, ARGB surface, and render
   * alpha-blended text using FreeType's LCD subpixel rendering. This function
   * returns the new surface, or NULL if there was an error.
   *
   * The glyph is rendered without any padding or centering in the X direction,
   * and aligned normally in the Y direction.
   *
   * You can render at other quality levels with TTF_RenderGlyph_Solid,
   * TTF_RenderGlyph_Shaded, and TTF_RenderGlyph_Blended.
   *
   * @param font the font to render with.
   * @param ch the codepoint to render.
   * @param fg the foreground color for the text.
   * @param bg the background color for the text.
   * @returns a new 32-bit, ARGB surface, or NULL if there was an error.
   *
   * @threadsafety This function should be called on the thread that created the
   *               font.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_RenderGlyph_Blended
   * @sa TTF_RenderGlyph_Shaded
   * @sa TTF_RenderGlyph_Solid
   *
   * @from SDL_ttf.h:1685 SDL_Surface * TTF_RenderGlyph_LCD(TTF_Font *font, Uint32 ch, SDL_Color fg, SDL_Color bg);
   */
  renderGlyphLcd(ch: number, fg: Color, bg: Color): Surface {
    const p = TTF.renderGlyphLcd(
      this.pointer,
      ch,
      fg,
      bg,
    );
    if (!p) throw SdlError("renderGlyphLcd");
    return Surface.of(p);
  }
}

/**
 * A text engine for rendering text with SDL_ttf.
 *
 * This class provides the base functionality for text rendering engines.
 * Specific implementations are provided by subclasses like SurfaceTextEngine,
 * RendererTextEngine, and GpuTextEngine.
 *
 * @since This class is available since SDL_ttf 3.0.0.
 */
export class TextEngine {
  constructor(public pointer: TextEnginePointer) {}

  /**
   * Create a text object from UTF-8 text and a text engine.
   *
   * @param engine the text engine to use when creating the text object, may be
   *               NULL.
   * @param font the font to render with.
   * @param text the text to use, in UTF-8 encoding.
   * @param length the length of the text, in bytes, or 0 for null terminated
   *               text.
   * @returns a TTF_Text object or NULL on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should be called on the thread that created the
   *               font and text engine.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_DestroyText
   *
   * @from SDL_ttf.h:2036 TTF_Text * TTF_CreateText(TTF_TextEngine *engine, TTF_Font *font, const char *text, size_t length);
   */
  createText(font: Font, text: string): Text {
    const pointer = TTF.createText(this.pointer, font.pointer, text, 0n);
    if (!pointer) throw SdlError("createText");
    return new Text(pointer);
  }
}

export class SurfaceTextEngine extends TextEngine {
  /**
   * Create a text engine for drawing text on SDL surfaces.
   *
   * @returns a TTF_TextEngine object or NULL on failure; call SDL_GetError()
   *          for more information.
   *
   * @threadsafety It is safe to call this function from any thread.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_DestroySurfaceTextEngine
   * @sa TTF_DrawSurfaceText
   *
   * @from SDL_ttf.h:1746 TTF_TextEngine * TTF_CreateSurfaceTextEngine(void);
   */
  static create(): SurfaceTextEngine {
    const pointer = TTF.createSurfaceTextEngine();
    if (!pointer) throw SdlError("createSurfaceTextEngine");
    return new SurfaceTextEngine(pointer);
  }

  /**
   * Destroy a text engine created for drawing text on SDL surfaces.
   *
   * All text created by this engine should be destroyed before calling this
   * function.
   *
   * @param engine a TTF_TextEngine object created with
   *               TTF_CreateSurfaceTextEngine().
   *
   * @threadsafety This function should be called on the thread that created the
   *               engine.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_CreateSurfaceTextEngine
   *
   * @from SDL_ttf.h:1789 void TTF_DestroySurfaceTextEngine(TTF_TextEngine *engine);
   */
  destroy() {
    if (!this.pointer) return;
    TTF.destroySurfaceTextEngine(this.pointer);
    this.pointer = null;
  }

  [Symbol.dispose]() {
    this.destroy();
  }
}

export class RendererTextEngine extends TextEngine {
  /**
   * Create a text engine for drawing text on an SDL renderer.
   *
   * @param renderer the renderer to use for creating textures and drawing text.
   * @returns a TTF_TextEngine object or NULL on failure; call SDL_GetError()
   *          for more information.
   *
   * @threadsafety This function should be called on the thread that created the
   *               renderer.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_DestroyRendererTextEngine
   * @sa TTF_DrawRendererText
   * @sa TTF_CreateRendererTextEngineWithProperties
   *
   * @from SDL_ttf.h:1807 TTF_TextEngine * TTF_CreateRendererTextEngine(SDL_Renderer *renderer);
   */
  static create(renderer: RendererPointer): RendererTextEngine {
    const pointer = TTF.createRendererTextEngine(renderer);
    if (!pointer) throw SdlError("createRendererTextEngine");
    return new RendererTextEngine(pointer);
  }

  /**
   * Create a text engine for drawing text on an SDL renderer, with the
   * specified properties.
   *
   * These are the supported properties:
   *
   * - `TTF_PROP_RENDERER_TEXT_ENGINE_RENDERER`: the renderer to use for
   *   creating textures and drawing text
   * - `TTF_PROP_RENDERER_TEXT_ENGINE_ATLAS_TEXTURE_SIZE`: the size of the
   *   texture atlas
   *
   * @param props the properties to use.
   * @returns a TTF_TextEngine object or NULL on failure; call SDL_GetError()
   *          for more information.
   *
   * @threadsafety This function should be called on the thread that created the
   *               renderer.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_CreateRendererTextEngine
   * @sa TTF_DestroyRendererTextEngine
   * @sa TTF_DrawRendererText
   *
   * @from SDL_ttf.h:1833 TTF_TextEngine * TTF_CreateRendererTextEngineWithProperties(SDL_PropertiesID props);
   */
  static createWithProperties(props: number): RendererTextEngine {
    const pointer = TTF.createRendererTextEngineWithProperties(props);
    if (!pointer) throw SdlError("createRendererTextEngineWithProperties");
    return new RendererTextEngine(pointer);
  }

  /**
   * Destroy a text engine created for drawing text on an SDL renderer.
   *
   * All text created by this engine should be destroyed before calling this
   * function.
   *
   * @param engine a TTF_TextEngine object created with
   *               TTF_CreateRendererTextEngine().
   *
   * @threadsafety This function should be called on the thread that created the
   *               engine.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_CreateRendererTextEngine
   *
   * @from SDL_ttf.h:1879 void TTF_DestroyRendererTextEngine(TTF_TextEngine *engine);
   */
  destroy() {
    if (!this.pointer) return;
    TTF.destroyRendererTextEngine(this.pointer);
    this.pointer = null;
  }

  [Symbol.dispose]() {
    this.destroy();
  }
}

export class GpuTextEngine extends TextEngine {
  /**
   * Create a text engine for drawing text with the SDL GPU API.
   *
   * @param device the SDL_GPUDevice to use for creating textures and drawing
   *               text.
   * @returns a TTF_TextEngine object or NULL on failure; call SDL_GetError()
   *          for more information.
   *
   * @threadsafety This function should be called on the thread that created the
   *               device.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_CreateGPUTextEngineWithProperties
   * @sa TTF_DestroyGPUTextEngine
   * @sa TTF_GetGPUTextDrawData
   *
   * @from SDL_ttf.h:1898 TTF_TextEngine * TTF_CreateGPUTextEngine(SDL_GPUDevice *device);
   */
  static create(device: Deno.PointerValue<"SDL_GPUDevice">): GpuTextEngine {
    const pointer = TTF.createGpuTextEngine(device);
    if (!pointer) throw SdlError("createGpuTextEngine");
    return new GpuTextEngine(pointer);
  }

  /**
   * Create a text engine for drawing text with the SDL GPU API, with the
   * specified properties.
   *
   * These are the supported properties:
   *
   * - `TTF_PROP_GPU_TEXT_ENGINE_DEVICE`: the SDL_GPUDevice to use for creating
   *   textures and drawing text.
   * - `TTF_PROP_GPU_TEXT_ENGINE_ATLAS_TEXTURE_SIZE`: the size of the texture
   *   atlas
   *
   * @param props the properties to use.
   * @returns a TTF_TextEngine object or NULL on failure; call SDL_GetError()
   *          for more information.
   *
   * @threadsafety This function should be called on the thread that created the
   *               device.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_CreateGPUTextEngine
   * @sa TTF_DestroyGPUTextEngine
   * @sa TTF_GetGPUTextDrawData
   *
   * @from SDL_ttf.h:1924 TTF_TextEngine * TTF_CreateGPUTextEngineWithProperties(SDL_PropertiesID props);
   */
  createWithProperties(props: number): GpuTextEngine {
    const pointer = TTF.createRendererTextEngineWithProperties(props);
    if (!pointer) throw SdlError("createRendererTextEngineWithProperties");
    return new GpuTextEngine(pointer);
  }

  /**
   * Destroy a text engine created for drawing text with the SDL GPU API.
   *
   * All text created by this engine should be destroyed before calling this
   * function.
   *
   * @param engine a TTF_TextEngine object created with
   *               TTF_CreateGPUTextEngine().
   *
   * @threadsafety This function should be called on the thread that created the
   *               engine.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_CreateGPUTextEngine
   *
   * @from SDL_ttf.h:1994 void TTF_DestroyGPUTextEngine(TTF_TextEngine *engine);
   */
  destroy() {
    if (!this.pointer) return;
    TTF.destroyGpuTextEngine(this.pointer);
    this.pointer = null;
  }

  [Symbol.dispose]() {
    this.destroy();
  }
  /**
   * Sets the winding order of the vertices returned by TTF_GetGPUTextDrawData
   * for a particular GPU text engine.
   *
   * @param engine a TTF_TextEngine object created with
   *               TTF_CreateGPUTextEngine().
   * @param winding the new winding order option.
   *
   * @threadsafety This function should be called on the thread that created the
   *               engine.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_GetGPUTextEngineWinding
   *
   * @from SDL_ttf.h:2023 void TTF_SetGPUTextEngineWinding(TTF_TextEngine *engine, TTF_GPUTextEngineWinding winding);
   */
  setWinding(winding: TTF.GPU_TEXTENGINE_WINDING) {
    TTF.setGpuTextEngineWinding(this.pointer, winding);
  }

  /**
   * Get the winding order of the vertices returned by TTF_GetGPUTextDrawData
   * for a particular GPU text engine
   *
   * @param engine a TTF_TextEngine object created with
   *               TTF_CreateGPUTextEngine().
   * @returns the winding order used by the GPU text engine or
   *          TTF_GPU_TEXTENGINE_WINDING_INVALID in case of error.
   *
   * @threadsafety This function should be called on the thread that created the
   *               engine.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_SetGPUTextEngineWinding
   *
   * @from SDL_ttf.h:2041 TTF_GPUTextEngineWinding TTF_GetGPUTextEngineWinding(const TTF_TextEngine *engine);
   */
  get winding(): TTF.GPU_TEXTENGINE_WINDING {
    return TTF.getGpuTextEngineWinding(this.pointer);
  }
}

/**
 * A text object for rendering text with SDL_ttf.
 *
 * This class provides functionality for rendering and manipulating text using
 * a text engine. It allows for text shaping, styling, and layout control.
 *
 * @since This class is available since SDL_ttf 3.0.0.
 */
export class Text {
  constructor(public pointer: TextPointer) {}

  [Symbol.dispose]() {
    this.destroy();
  }

  /**
   * Draw text to an SDL surface.
   *
   * `text` must have been created using a TTF_TextEngine from
   * TTF_CreateSurfaceTextEngine().
   *
   * @param text the text to draw.
   * @param x the x coordinate in pixels, positive from the left edge towards
   *          the right.
   * @param y the y coordinate in pixels, positive from the top edge towards the
   *          bottom.
   * @param surface the surface to draw on.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should be called on the thread that created the
   *               text.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_CreateSurfaceTextEngine
   * @sa TTF_CreateText
   *
   * @from SDL_ttf.h:1771 bool TTF_DrawSurfaceText(TTF_Text *text, int x, int y, SDL_Surface *surface);
   */
  drawSurface(x: number, y: number, surface: Surface) {
    TTF.drawSurfaceText(this.pointer, x, y, surface.pointer);
  }

  /**
   * Draw text to an SDL renderer.
   *
   * `text` must have been created using a TTF_TextEngine from
   * TTF_CreateRendererTextEngine(), and will draw using the renderer passed to
   * that function.
   *
   * @param text the text to draw.
   * @param x the x coordinate in pixels, positive from the left edge towards
   *          the right.
   * @param y the y coordinate in pixels, positive from the top edge towards the
   *          bottom.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should be called on the thread that created the
   *               text.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_CreateRendererTextEngine
   * @sa TTF_CreateText
   *
   * @from SDL_ttf.h:1861 bool TTF_DrawRendererText(TTF_Text *text, float x, float y);
   */
  drawRenderer(x: number, y: number): boolean {
    return TTF.drawRendererText(this.pointer, x, y);
  }

  /**
   * Get the geometry data needed for drawing the text.
   *
   * `text` must have been created using a TTF_TextEngine from
   * TTF_CreateGPUTextEngine().
   *
   * The positive X-axis is taken towards the right and the positive Y-axis is
   * taken upwards for both the vertex and the texture coordinates, i.e, it
   * follows the same convention used by the SDL_GPU API. If you want to use a
   * different coordinate system you will need to transform the vertices
   * yourself.
   *
   * If the text looks blocky use linear filtering.
   *
   * @param text the text to draw.
   * @returns a NULL terminated linked list of TTF_GPUAtlasDrawSequence objects
   *          or NULL if the passed text is empty or in case of failure; call
   *          SDL_GetError() for more information.
   *
   * @threadsafety This function should be called on the thread that created the
   *               text.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_CreateGPUTextEngine
   * @sa TTF_CreateText
   *
   * @from SDL_ttf.h:1976 TTF_GPUAtlasDrawSequence * TTF_GetGPUTextDrawData(TTF_Text *text);
   */
  get gpuDrawData(): Deno.PointerValue<"TTF_GPUAtlasDrawSequence"> {
    return TTF.getGpuTextDrawData(this.pointer) as Deno.PointerValue<
      "TTF_GPUAtlasDrawSequence"
    >;
  }

  /**
   * Get the properties associated with a text object.
   *
   * @param text the TTF_Text to query.
   * @returns a valid property ID on success or 0 on failure; call
   *          SDL_GetError() for more information.
   *
   * @threadsafety This function should be called on the thread that created the
   *               text.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @from SDL_ttf.h:2076 SDL_PropertiesID TTF_GetTextProperties(TTF_Text *text);
   */
  get properties(): number {
    return TTF.getTextProperties(this.pointer);
  }

  /**
   * Set the text engine used by a text object.
   *
   * This function may cause the internal text representation to be rebuilt.
   *
   * @param text the TTF_Text to modify.
   * @param engine the text engine to use for drawing.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should be called on the thread that created the
   *               text.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_GetTextEngine
   *
   * @from SDL_ttf.h:2095 bool TTF_SetTextEngine(TTF_Text *text, TTF_TextEngine *engine);
   */
  setEngine(engine: TextEngine): boolean {
    return TTF.setTextEngine(this.pointer, engine.pointer);
  }

  /**
   * Get the text engine used by a text object.
   *
   * @param text the TTF_Text to query.
   * @returns the TTF_TextEngine used by the text on success or NULL on failure;
   *          call SDL_GetError() for more information.
   *
   * @threadsafety This function should be called on the thread that created the
   *               text.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_SetTextEngine
   *
   * @from SDL_ttf.h:2111 TTF_TextEngine * TTF_GetTextEngine(TTF_Text *text);
   */
  get engine(): TextEngine {
    const r = TTF.getTextEngine(this.pointer);
    if (!r) throw SdlError("getTextEngine");
    return new TextEngine(r);
  }

  /**
   * Set the font used by a text object.
   *
   * When a text object has a font, any changes to the font will automatically
   * regenerate the text. If you set the font to NULL, the text will continue to
   * render but changes to the font will no longer affect the text.
   *
   * This function may cause the internal text representation to be rebuilt.
   *
   * @param text the TTF_Text to modify.
   * @param font the font to use, may be NULL.
   * @returns false if the text pointer is null; otherwise, true. call
   *          SDL_GetError() for more information.
   *
   * @threadsafety This function should be called on the thread that created the
   *               text.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_GetTextFont
   *
   * @from SDL_ttf.h:2134 bool TTF_SetTextFont(TTF_Text *text, TTF_Font *font);
   */
  setFont(font: Font | null): boolean {
    return TTF.setTextFont(this.pointer, font?.pointer ?? null);
  }

  /**
   * Get the font used by a text object.
   *
   * @param text the TTF_Text to query.
   * @returns the TTF_Font used by the text on success or NULL on failure; call
   *          SDL_GetError() for more information.
   *
   * @threadsafety This function should be called on the thread that created the
   *               text.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_SetTextFont
   *
   * @from SDL_ttf.h:2150 TTF_Font * TTF_GetTextFont(TTF_Text *text);
   */
  get font(): Font {
    return new Font(TTF.getTextFont(this.pointer));
  }

  /**
   * Set the direction to be used for text shaping a text object.
   *
   * This function only supports left-to-right text shaping if SDL_ttf was not
   * built with HarfBuzz support.
   *
   * @param text the text to modify.
   * @param direction the new direction for text to flow.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should be called on the thread that created the
   *               text.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @from SDL_ttf.h:2168 bool TTF_SetTextDirection(TTF_Text *text, TTF_Direction direction);
   */
  setDirection(direction: TTF.DIRECTION): boolean {
    return TTF.setTextDirection(this.pointer, direction);
  }

  /**
   * Get the direction to be used for text shaping a text object.
   *
   * This defaults to the direction of the font used by the text object.
   *
   * @param text the text to query.
   * @returns the direction to be used for text shaping.
   *
   * @threadsafety This function should be called on the thread that created the
   *               text.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @from SDL_ttf.h:2183 TTF_Direction TTF_GetTextDirection(TTF_Text *text);
   */
  get direction(): TTF.DIRECTION {
    return TTF.getTextDirection(this.pointer);
  }

  /**
   * Set the script to be used for text shaping a text object.
   *
   * This returns false if SDL_ttf isn't built with HarfBuzz support.
   *
   * @param text the text to modify.
   * @param script an
   *               [ISO 15924 code](https://unicode.org/iso15924/iso15924-codes.html)
   *               .
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should be called on the thread that created the
   *               text.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_StringToTag
   *
   * @from SDL_ttf.h:2204 bool TTF_SetTextScript(TTF_Text *text, Uint32 script);
   */
  setScript(script: number): boolean {
    return TTF.setTextScript(this.pointer, script);
  }

  /**
   * Get the script used for text shaping a text object.
   *
   * This defaults to the script of the font used by the text object.
   *
   * @param text the text to query.
   * @returns an
   *          [ISO 15924 code](https://unicode.org/iso15924/iso15924-codes.html)
   *          or 0 if a script hasn't been set on either the text object or the
   *          font.
   *
   * @threadsafety This function should be called on the thread that created the
   *               text.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_TagToString
   *
   * @from SDL_ttf.h:2224 Uint32 TTF_GetTextScript(TTF_Text *text);
   */
  get script(): number {
    return TTF.getTextScript(this.pointer);
  }

  /**
   * Set the color of a text object.
   *
   * The default text color is white (255, 255, 255, 255).
   *
   * @param text the TTF_Text to modify.
   * @param r the red color value in the range of 0-255.
   * @param g the green color value in the range of 0-255.
   * @param b the blue color value in the range of 0-255.
   * @param a the alpha value in the range of 0-255.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should be called on the thread that created the
   *               text.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_GetTextColor
   * @sa TTF_SetTextColorFloat
   *
   * @from SDL_ttf.h:2247 bool TTF_SetTextColor(TTF_Text *text, Uint8 r, Uint8 g, Uint8 b, Uint8 a);
   */
  setColor(color: Color): boolean {
    return TTF.setTextColor(this.pointer, color.r, color.g, color.b, color.a);
  }

  /**
   * Set the color of a text object.
   *
   * The default text color is white (1.0f, 1.0f, 1.0f, 1.0f).
   *
   * @param text the TTF_Text to modify.
   * @param r the red color value, normally in the range of 0-1.
   * @param g the green color value, normally in the range of 0-1.
   * @param b the blue color value, normally in the range of 0-1.
   * @param a the alpha value in the range of 0-1.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should be called on the thread that created the
   *               text.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_GetTextColorFloat
   * @sa TTF_SetTextColor
   *
   * @from SDL_ttf.h:2270 bool TTF_SetTextColorFloat(TTF_Text *text, float r, float g, float b, float a);
   */
  setColorFloat(color: FColor): boolean {
    return TTF.setTextColorFloat(
      this.pointer,
      color.r,
      color.g,
      color.b,
      color.a,
    );
  }

  /**
   * Get the color of a text object.
   *
   * @param text the TTF_Text to query.
   * @param r a pointer filled in with the red color value in the range of
   *          0-255, may be NULL.
   * @param g a pointer filled in with the green color value in the range of
   *          0-255, may be NULL.
   * @param b a pointer filled in with the blue color value in the range of
   *          0-255, may be NULL.
   * @param a a pointer filled in with the alpha value in the range of 0-255,
   *          may be NULL.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should be called on the thread that created the
   *               text.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_GetTextColorFloat
   * @sa TTF_SetTextColor
   *
   * @from SDL_ttf.h:2295 bool TTF_GetTextColor(TTF_Text *text, Uint8 *r, Uint8 *g, Uint8 *b, Uint8 *a);
   */
  get color(): Color {
    return TTF.getTextColor(this.pointer);
  }

  /**
   * Get the color of a text object.
   *
   * @param text the TTF_Text to query.
   * @param r a pointer filled in with the red color value, normally in the
   *          range of 0-1, may be NULL.
   * @param g a pointer filled in with the green color value, normally in the
   *          range of 0-1, may be NULL.
   * @param b a pointer filled in with the blue color value, normally in the
   *          range of 0-1, may be NULL.
   * @param a a pointer filled in with the alpha value in the range of 0-1, may
   *          be NULL.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should be called on the thread that created the
   *               text.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_GetTextColor
   * @sa TTF_SetTextColorFloat
   *
   * @from SDL_ttf.h:2320 bool TTF_GetTextColorFloat(TTF_Text *text, float *r, float *g, float *b, float *a);
   */
  get colorFloat(): FColor {
    return TTF.getTextColorFloat(this.pointer);
  }

  /**
   * Set the position of a text object.
   *
   * This can be used to position multiple text objects within a single wrapping
   * text area.
   *
   * This function may cause the internal text representation to be rebuilt.
   *
   * @param text the TTF_Text to modify.
   * @param x the x offset of the upper left corner of this text in pixels.
   * @param y the y offset of the upper left corner of this text in pixels.
   *
   * @threadsafety This function should be called on the thread that created the
   *               text.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_GetTextPosition
   *
   * @from SDL_ttf.h:2341 bool TTF_SetTextPosition(TTF_Text *text, int x, int y);
   */
  setPosition(x: number, y: number): boolean {
    return TTF.setTextPosition(this.pointer, x, y);
  }

  /**
   * Get the position of a text object.
   *
   * @param text the TTF_Text to query.
   * @param x a pointer filled in with the x offset of the upper left corner of
   *          this text in pixels, may be NULL.
   * @param y a pointer filled in with the y offset of the upper left corner of
   *          this text in pixels, may be NULL.
   *
   * @threadsafety This function should be called on the thread that created the
   *               text.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_SetTextPosition
   *
   * @from SDL_ttf.h:2359 bool TTF_GetTextPosition(TTF_Text *text, int *x, int *y);
   */
  get position(): Point {
    return TTF.getTextPosition(this.pointer);
  }

  /**
   * Set whether wrapping is enabled on a text object.
   *
   * This function may cause the internal text representation to be rebuilt.
   *
   * @param text the TTF_Text to modify.
   * @param wrap_width the maximum width in pixels, 0 to wrap on newline
   *                   characters.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should be called on the thread that created the
   *               text.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_GetTextWrapWidth
   *
   * @from SDL_ttf.h:2379 bool TTF_SetTextWrapWidth(TTF_Text *text, int wrap_width);
   */
  setWrapWidth(wrap_width: number): boolean {
    return TTF.setTextWrapWidth(this.pointer, wrap_width);
  }

  /**
   * Get whether wrapping is enabled on a text object.
   *
   * @param text the TTF_Text to query.
   * @param wrap_width a pointer filled in with the maximum width in pixels or 0
   *                   if the text is being wrapped on newline characters.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should be called on the thread that created the
   *               text.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_SetTextWrapWidth
   *
   * @from SDL_ttf.h:2397 bool TTF_GetTextWrapWidth(TTF_Text *text, int *wrap_width);
   */
  get wrapWidth(): number {
    return TTF.getTextWrapWidth(this.pointer);
  }

  /**
   * Set whether whitespace should be visible when wrapping a text object.
   *
   * If the whitespace is visible, it will take up space for purposes of
   * alignment and wrapping. This is good for editing, but looks better when
   * centered or aligned if whitespace around line wrapping is hidden. This
   * defaults false.
   *
   * This function may cause the internal text representation to be rebuilt.
   *
   * @param text the TTF_Text to modify.
   * @param visible true to show whitespace when wrapping text, false to hide
   *                it.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should be called on the thread that created the
   *               text.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_TextWrapWhitespaceVisible
   *
   * @from SDL_ttf.h:2422 bool TTF_SetTextWrapWhitespaceVisible(TTF_Text *text, bool visible);
   */
  setWrapWhitespaceVisible(visible: boolean): boolean {
    return TTF.setTextWrapWhitespaceVisible(this.pointer, visible);
  }

  /**
   * Return whether whitespace is shown when wrapping a text object.
   *
   * @param text the TTF_Text to query.
   * @returns true if whitespace is shown when wrapping text, or false
   *          otherwise.
   *
   * @threadsafety This function should be called on the thread that created the
   *               text.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_SetTextWrapWhitespaceVisible
   *
   * @from SDL_ttf.h:2438 bool TTF_TextWrapWhitespaceVisible(TTF_Text *text);
   */
  textWrapWhitespaceVisible(): boolean {
    return TTF.textWrapWhitespaceVisible(this.pointer);
  }

  /**
   * Set the UTF-8 text used by a text object.
   *
   * This function may cause the internal text representation to be rebuilt.
   *
   * @param text the TTF_Text to modify.
   * @param string the UTF-8 text to use, may be NULL.
   * @param length the length of the text, in bytes, or 0 for null terminated
   *               text.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should be called on the thread that created the
   *               text.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_AppendTextString
   * @sa TTF_DeleteTextString
   * @sa TTF_InsertTextString
   *
   * @from SDL_ttf.h:2461 bool TTF_SetTextString(TTF_Text *text, const char *string, size_t length);
   */
  setString(string: string): boolean {
    return TTF.setTextString(this.pointer, string, 0n);
  }

  /**
   * Insert UTF-8 text into a text object.
   *
   * This function may cause the internal text representation to be rebuilt.
   *
   * @param text the TTF_Text to modify.
   * @param offset the offset, in bytes, from the beginning of the string if >=
   *               0, the offset from the end of the string if < 0. Note that
   *               this does not do UTF-8 validation, so you should only insert
   *               at UTF-8 sequence boundaries.
   * @param string the UTF-8 text to insert.
   * @param length the length of the text, in bytes, or 0 for null terminated
   *               text.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should be called on the thread that created the
   *               text.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_AppendTextString
   * @sa TTF_DeleteTextString
   * @sa TTF_SetTextString
   *
   * @from SDL_ttf.h:2488 bool TTF_InsertTextString(TTF_Text *text, int offset, const char *string, size_t length);
   */
  insertString(offset: number, string: string): boolean {
    return TTF.insertTextString(this.pointer, offset, string, 0n);
  }

  /**
   * Append UTF-8 text to a text object.
   *
   * This function may cause the internal text representation to be rebuilt.
   *
   * @param text the TTF_Text to modify.
   * @param string the UTF-8 text to insert.
   * @param length the length of the text, in bytes, or 0 for null terminated
   *               text.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should be called on the thread that created the
   *               text.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_DeleteTextString
   * @sa TTF_InsertTextString
   * @sa TTF_SetTextString
   *
   * @from SDL_ttf.h:2511 bool TTF_AppendTextString(TTF_Text *text, const char *string, size_t length);
   */
  appendString(s: string): boolean {
    return TTF.appendTextString(this.pointer, s, 0n);
  }

  /**
   * Delete UTF-8 text from a text object.
   *
   * This function may cause the internal text representation to be rebuilt.
   *
   * @param text the TTF_Text to modify.
   * @param offset the offset, in bytes, from the beginning of the string if >=
   *               0, the offset from the end of the string if < 0. Note that
   *               this does not do UTF-8 validation, so you should only delete
   *               at UTF-8 sequence boundaries.
   * @param length the length of text to delete, in bytes, or -1 for the
   *               remainder of the string.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should be called on the thread that created the
   *               text.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_AppendTextString
   * @sa TTF_InsertTextString
   * @sa TTF_SetTextString
   *
   * @from SDL_ttf.h:2537 bool TTF_DeleteTextString(TTF_Text *text, int offset, int length);
   */
  deleteString(offset: number, length: number): boolean {
    return TTF.deleteTextString(this.pointer, offset, length);
  }

  /**
   * Get the size of a text object.
   *
   * The size of the text may change when the font or font style and size
   * change.
   *
   * @param text the TTF_Text to query.
   * @param w a pointer filled in with the width of the text, in pixels, may be
   *          NULL.
   * @param h a pointer filled in with the height of the text, in pixels, may be
   *          NULL.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should be called on the thread that created the
   *               text.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @from SDL_ttf.h:2558 bool TTF_GetTextSize(TTF_Text *text, int *w, int *h);
   */
  get size(): Size {
    return TTF.getTextSize(this.pointer);
  }

  /**
   * Get the substring of a text object that surrounds a text offset.
   *
   * If `offset` is less than 0, this will return a zero length substring at the
   * beginning of the text with the TTF_SUBSTRING_TEXT_START flag set. If
   * `offset` is greater than or equal to the length of the text string, this
   * will return a zero length substring at the end of the text with the
   * TTF_SUBSTRING_TEXT_END flag set.
   *
   * @param text the TTF_Text to query.
   * @param offset a byte offset into the text string.
   * @param substring a pointer filled in with the substring containing the
   *                  offset.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should be called on the thread that created the
   *               text.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @from SDL_ttf.h:2618 bool TTF_GetTextSubString(TTF_Text *text, int offset, TTF_SubString *substring);
   */
  getSubString(offset: number): SubString {
    const b = Buf.of(Int32Array, 9);
    const r = TTF.getTextSubString(
      this.pointer,
      offset,
      b.pointer as Deno.PointerValue<"TTF_SubString">,
    );
    if (!r) throw SdlError("getTextSubString");
    return read_SubString(b.dataView);
  }

  /**
   * Get the substring of a text object that contains the given line.
   *
   * If `line` is less than 0, this will return a zero length substring at the
   * beginning of the text with the TTF_SUBSTRING_TEXT_START flag set. If `line`
   * is greater than or equal to `text->num_lines` this will return a zero
   * length substring at the end of the text with the TTF_SUBSTRING_TEXT_END
   * flag set.
   *
   * @param text the TTF_Text to query.
   * @param line a zero-based line index, in the range [0 .. text->num_lines-1].
   * @param substring a pointer filled in with the substring containing the
   *                  offset.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should be called on the thread that created the
   *               text.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @from SDL_ttf.h:2641 bool TTF_GetTextSubStringForLine(TTF_Text *text, int line, TTF_SubString *substring);
   */
  getSubStringForLine(line: number): SubString {
    const b = Buf.of(Int32Array, 9);
    const r = TTF.getTextSubStringForLine(
      this.pointer,
      line,
      b.pointer as Deno.PointerValue<"TTF_SubString">,
    );
    if (!r) throw SdlError("getTextSubStringForLine");
    return read_SubString(b.dataView);
  }

  /**
   * Get the substrings of a text object that contain a range of text.
   *
   * @param text the TTF_Text to query.
   * @param offset a byte offset into the text string.
   * @param length the length of the range being queried, in bytes, or -1 for
   *               the remainder of the string.
   * @param count a pointer filled in with the number of substrings returned,
   *              may be NULL.
   * @returns a NULL terminated array of substring pointers or NULL on failure;
   *          call SDL_GetError() for more information. This is a single
   *          allocation that should be freed with SDL_free() when it is no
   *          longer needed.
   *
   * @threadsafety This function should be called on the thread that created the
   *               text.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @from SDL_ttf.h:2662 TTF_SubString ** TTF_GetTextSubStringsForRange(TTF_Text *text, int offset, int length, int *count);
   */
  getSubStringsForRange(
    offset: number,
    length: number = -1,
  ): SubString[] {
    const { ret: p } = TTF.getTextSubStringsForRange(
      this.pointer,
      offset,
      length,
    );
    const c = Cursor.Unsafe(p!);
    const r: SubString[] = [];
    while (true) {
      const q = c.ptr;
      if (!q) break;
      const b = Deno.UnsafePointerView.getArrayBuffer(q, 9 * 4);
      r.push(read_SubString(new DataView(b)));
    }
    free(p);
    return r;
  }

  /**
   * Get the portion of a text string that is closest to a point.
   *
   * This will return the closest substring of text to the given point.
   *
   * @param text the TTF_Text to query.
   * @param x the x coordinate relative to the left side of the text, may be
   *          outside the bounds of the text area.
   * @param y the y coordinate relative to the top side of the text, may be
   *          outside the bounds of the text area.
   * @param substring a pointer filled in with the closest substring of text to
   *                  the given point.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should be called on the thread that created the
   *               text.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @from SDL_ttf.h:2684 bool TTF_GetTextSubStringForPoint(TTF_Text *text, int x, int y, TTF_SubString *substring);
   */
  getSubStringForPoint(x: number, y: number): SubString {
    const b = Buf.of(Int32Array, 9);
    const r = TTF.getTextSubStringForPoint(
      this.pointer,
      x,
      y,
      b.pointer as Deno.PointerValue<"TTF_SubString">,
    );
    if (!r) throw SdlError("getTextSubStringForPoint");
    return read_SubString(b.dataView);
  }

  /**
   * Get the previous substring in a text object
   *
   * If called at the start of the text, this will return a zero length
   * substring with the TTF_SUBSTRING_TEXT_START flag set.
   *
   * @param text the TTF_Text to query.
   * @param substring the TTF_SubString to query.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should be called on the thread that created the
   *               text.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @from SDL_ttf.h:2702 bool TTF_GetPreviousTextSubString(TTF_Text *text, const TTF_SubString *substring, TTF_SubString *previous);
   */
  getPreviousSubString(substring: SubString): SubString {
    const s = Buf.of(Int32Array, 9);
    write_SubString(substring, s.dataView);
    const b = Buf.of(Int32Array, 9);
    const r = TTF.getPreviousTextSubString(
      this.pointer,
      s.pointer as Deno.PointerValue<"TTF_SubString">,
      b.pointer as Deno.PointerValue<"TTF_SubString">,
    );
    if (!r) throw SdlError("getPreviousTextSubString");
    return read_SubString(b.dataView);
  }

  /**
   * Get the next substring in a text object
   *
   * If called at the end of the text, this will return a zero length substring
   * with the TTF_SUBSTRING_TEXT_END flag set.
   *
   * @param text the TTF_Text to query.
   * @param substring the TTF_SubString to query.
   * @param next a pointer filled in with the next substring.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should be called on the thread that created the
   *               text.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @from SDL_ttf.h:2721 bool TTF_GetNextTextSubString(TTF_Text *text, const TTF_SubString *substring, TTF_SubString *next);
   */
  getNextSubString(substring: SubString): SubString {
    const s = Buf.of(Int32Array, 9);
    write_SubString(substring, s.dataView);
    const b = Buf.of(Int32Array, 9);
    const r = TTF.getNextTextSubString(
      this.pointer,
      s.pointer as Deno.PointerValue<"TTF_SubString">,
      b.pointer as Deno.PointerValue<"TTF_SubString">,
    );
    if (!r) throw SdlError("getNextTextSubString");
    return read_SubString(b.dataView);
  }

  /**
   * Update the layout of a text object.
   *
   * This is automatically done when the layout is requested or the text is
   * rendered, but you can call this if you need more control over the timing of
   * when the layout and text engine representation are updated.
   *
   * @param text the TTF_Text to update.
   * @returns true on success or false on failure; call SDL_GetError() for more
   *          information.
   *
   * @threadsafety This function should be called on the thread that created the
   *               text.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @from SDL_ttf.h:2739 bool TTF_UpdateText(TTF_Text *text);
   */
  update(): boolean {
    return TTF.updateText(this.pointer);
  }

  /**
   * Destroy a text object created by a text engine.
   *
   * @param text the text to destroy.
   *
   * @threadsafety This function should be called on the thread that created the
   *               text.
   *
   * @since This function is available since SDL_ttf 3.0.0.
   *
   * @sa TTF_CreateText
   *
   * @from SDL_ttf.h:2753 void TTF_DestroyText(TTF_Text *text);
   */
  destroy() {
    if (!this.pointer) return;
    TTF.destroyText(this.pointer);
    this.pointer = null;
  }
}
