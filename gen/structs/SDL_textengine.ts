import * as _ from "../_utils.ts";
import * as _b from "../_structs/SDL_textengine.ts";
import { Rect } from "./SDL_rect.ts";
import { FColor } from "./SDL_pixels.ts";


/**
 * A filled rectangle draw operation.
 *
 * @since This struct is available since SDL_ttf 3.0.0.
 *
 * @sa TTF_DrawOperation
 *
 * @from SDL_textengine.h:59
 */
export interface FillOperation {
  cmd: number; /**< TTF_DrawCommand : TTF_DRAW_COMMAND_FILL */
  rect: Rect; /**< SDL_Rect : The rectangle to fill, in pixels. The x coordinate is relative to the left side of the text area, going right, and the y coordinate is relative to the top side of the text area, going down. */
}

export function read_FillOperation(dt: DataView): FillOperation {
  const t = _b.TTF_FillOperation.read(dt);
  return {
    cmd: t.cmd, /** TTF_DrawCommand */
    rect: t.rect, /** SDL_Rect */
  };
}

export function write_FillOperation(t: FillOperation, dt: DataView) {
  _b.TTF_FillOperation.write({
    cmd: t.cmd, /** TTF_DrawCommand */
    rect: t.rect, /** SDL_Rect */
  }, dt);
}


/**
 * A texture copy draw operation.
 *
 * @since This struct is available since SDL_ttf 3.0.0.
 *
 * @sa TTF_DrawOperation
 *
 * @from SDL_textengine.h:72
 */
export interface CopyOperation {
  cmd: number; /**< TTF_DrawCommand : TTF_DRAW_COMMAND_COPY */
  text_offset: number; /**< int : The offset in the text corresponding to this glyph.
                                      There may be multiple glyphs with the same text offset
                                      and the next text offset might be several Unicode codepoints
                                      later. In this case the glyphs and codepoints are grouped
                                      together and the group bounding box is the union of the dst
                                      rectangles for the corresponding glyphs. */
  glyph_font: Deno.PointerValue; /**< TTF_Font * : The font containing the glyph to be drawn, can be passed to TTF_GetGlyphImageForIndex() */
  glyph_index: number; /**< Uint32 : The glyph index of the glyph to be drawn, can be passed to TTF_GetGlyphImageForIndex() */
  src: Rect; /**< SDL_Rect : The area within the glyph to be drawn */
  dst: Rect; /**< SDL_Rect : The drawing coordinates of the glyph, in pixels. The x coordinate is relative to the left side of the text area, going right, and the y coordinate is relative to the top side of the text area, going down. */
  reserved: Deno.PointerValue; /* void * */
}

export function read_CopyOperation(dt: DataView): CopyOperation {
  const t = _b.TTF_CopyOperation.read(dt);
  return {
    cmd: t.cmd, /** TTF_DrawCommand */
    text_offset: t.text_offset, /** int */
    glyph_font: Deno.UnsafePointer.create(t.glyph_font), /** TTF_Font * */
    glyph_index: t.glyph_index, /** Uint32 */
    src: t.src, /** SDL_Rect */
    dst: t.dst, /** SDL_Rect */
    reserved: Deno.UnsafePointer.create(t.reserved), /** void * */
  };
}

export function write_CopyOperation(t: CopyOperation, dt: DataView) {
  _b.TTF_CopyOperation.write({
    cmd: t.cmd, /** TTF_DrawCommand */
    text_offset: t.text_offset, /** int */
    glyph_font: Deno.UnsafePointer.value(t.glyph_font), /** TTF_Font * */
    glyph_index: t.glyph_index, /** Uint32 */
    src: t.src, /** SDL_Rect */
    dst: t.dst, /** SDL_Rect */
    reserved: Deno.UnsafePointer.value(t.reserved), /** void * */
  }, dt);
}


/* Private data in TTF_Text, available to implementations */
export interface TextData {
  font: Deno.PointerValue; /**< TTF_Font * : The font used by this text, read-only. */
  color: FColor; /**< SDL_FColor : The color of the text, read-only. */
  needs_layout_update: boolean; /**< bool : True if the layout needs to be updated */
  layout: Deno.PointerValue; /**< TTF_TextLayout * : Cached layout information, read-only. */
  x: number; /**< int : The x offset of the upper left corner of this text, in pixels, read-only. */
  y: number; /**< int : The y offset of the upper left corner of this text, in pixels, read-only. */
  w: number; /**< int : The width of this text, in pixels, read-only. */
  h: number; /**< int : The height of this text, in pixels, read-only. */
  num_ops: number; /**< int : The number of drawing operations to render this text, read-only. */
  ops: Deno.PointerValue; /**< TTF_DrawOperation * : The drawing operations used to render this text, read-only. */
  num_clusters: number; /**< int : The number of substrings representing clusters of glyphs in the string, read-only */
  clusters: Deno.PointerValue; /**< TTF_SubString * : Substrings representing clusters of glyphs in the string, read-only */
  props: number; /**< SDL_PropertiesID : Custom properties associated with this text, read-only. This field is created as-needed using TTF_GetTextProperties() and the properties may be then set and read normally */
  needs_engine_update: boolean; /**< bool : True if the engine text needs to be updated */
  engine: Deno.PointerValue; /**< TTF_TextEngine * : The engine used to render this text, read-only. */
  engine_text: Deno.PointerValue; /**< void * : The implementation-specific representation of this text */
}

export function read_TextData(dt: DataView): TextData {
  const t = _b.TTF_TextData.read(dt);
  return {
    font: Deno.UnsafePointer.create(t.font), /** TTF_Font * */
    color: t.color, /** SDL_FColor */
    needs_layout_update: t.needs_layout_update, /** bool */
    layout: Deno.UnsafePointer.create(t.layout), /** TTF_TextLayout * */
    x: t.x, /** int */
    y: t.y, /** int */
    w: t.w, /** int */
    h: t.h, /** int */
    num_ops: t.num_ops, /** int */
    ops: Deno.UnsafePointer.create(t.ops), /** TTF_DrawOperation * */
    num_clusters: t.num_clusters, /** int */
    clusters: Deno.UnsafePointer.create(t.clusters), /** TTF_SubString * */
    props: t.props, /** SDL_PropertiesID */
    needs_engine_update: t.needs_engine_update, /** bool */
    engine: Deno.UnsafePointer.create(t.engine), /** TTF_TextEngine * */
    engine_text: Deno.UnsafePointer.create(t.engine_text), /** void * */
  };
}

export function write_TextData(t: TextData, dt: DataView) {
  _b.TTF_TextData.write({
    font: Deno.UnsafePointer.value(t.font), /** TTF_Font * */
    color: t.color, /** SDL_FColor */
    needs_layout_update: t.needs_layout_update, /** bool */
    layout: Deno.UnsafePointer.value(t.layout), /** TTF_TextLayout * */
    x: t.x, /** int */
    y: t.y, /** int */
    w: t.w, /** int */
    h: t.h, /** int */
    num_ops: t.num_ops, /** int */
    ops: Deno.UnsafePointer.value(t.ops), /** TTF_DrawOperation * */
    num_clusters: t.num_clusters, /** int */
    clusters: Deno.UnsafePointer.value(t.clusters), /** TTF_SubString * */
    props: t.props, /** SDL_PropertiesID */
    needs_engine_update: t.needs_engine_update, /** bool */
    engine: Deno.UnsafePointer.value(t.engine), /** TTF_TextEngine * */
    engine_text: Deno.UnsafePointer.value(t.engine_text), /** void * */
  }, dt);
}


/**
 * A text engine interface.
 *
 * This structure should be initialized using SDL_INIT_INTERFACE()
 *
 * @since This struct is available since SDL_ttf 3.0.0.
 *
 * @sa SDL_INIT_INTERFACE
 *
 * @from SDL_textengine.h:138
 */
export interface TextEngine {
  version: number; /**< Uint32 : The version of this interface */
  userdata: Deno.PointerValue; /**< void * : User data pointer passed to callbacks */
    /* Create a text representation from draw instructions.
     *
     * All fields of `text` except `internal->engine_text` will already be filled out.
     *
     * This function should set the `internal->engine_text` field to a non-NULL value.
     *
     * \param userdata the userdata pointer in this interface.
     * \param text the text object being created.
     */
  CreateText: Deno.PointerValue; /*     bool (SDLCALL *CreateText)(void *userdata, TTF_Text *text); */
    /**
     * Destroy a text representation.
     */
  DestroyText: Deno.PointerValue; /*     void (SDLCALL *DestroyText)(void *userdata, TTF_Text *text); */
}

export function read_TextEngine(dt: DataView): TextEngine {
  const t = _b.TTF_TextEngine.read(dt);
  return {
    version: t.version, /** Uint32 */
    userdata: Deno.UnsafePointer.create(t.userdata), /** void * */
    /* Create a text representation from draw instructions.
     *
     * All fields of `text` except `internal->engine_text` will already be filled out.
     *
     * This function should set the `internal->engine_text` field to a non-NULL value.
     *
     * \param userdata the userdata pointer in this interface.
     * \param text the text object being created.
     */
    CreateText: Deno.UnsafePointer.create(t.CreateText), /**     bool (SDLCALL *CreateText)(void *userdata, TTF_Text *text); */
    /**
     * Destroy a text representation.
     */
    DestroyText: Deno.UnsafePointer.create(t.DestroyText), /**     void (SDLCALL *DestroyText)(void *userdata, TTF_Text *text); */
  };
}

export function write_TextEngine(t: TextEngine, dt: DataView) {
  _b.TTF_TextEngine.write({
    version: t.version, /** Uint32 */
    userdata: Deno.UnsafePointer.value(t.userdata), /** void * */
    /* Create a text representation from draw instructions.
     *
     * All fields of `text` except `internal->engine_text` will already be filled out.
     *
     * This function should set the `internal->engine_text` field to a non-NULL value.
     *
     * \param userdata the userdata pointer in this interface.
     * \param text the text object being created.
     */
    CreateText: Deno.UnsafePointer.value(t.CreateText), /**     bool (SDLCALL *CreateText)(void *userdata, TTF_Text *text); */
    /**
     * Destroy a text representation.
     */
    DestroyText: Deno.UnsafePointer.value(t.DestroyText), /**     void (SDLCALL *DestroyText)(void *userdata, TTF_Text *text); */
  }, dt);
}


