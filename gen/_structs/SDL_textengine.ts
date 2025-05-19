import * as _ from "@denosaurs/byte-type";
import { SDL_Rect } from "./SDL_rect.ts";
import { SDL_FColor } from "./SDL_pixels.ts";


/**
 * A filled rectangle draw operation.
 *
 * @since This struct is available since SDL_ttf 3.0.0.
 *
 * @sa TTF_DrawOperation
 *
 * @from SDL_textengine.h:59
 */
export const TTF_FillOperation = new _.Struct({
  cmd: _.u32, /**< TTF_DrawCommand : TTF_DRAW_COMMAND_FILL */
  rect: SDL_Rect, /**< SDL_Rect : The rectangle to fill, in pixels. The x coordinate is relative to the left side of the text area, going right, and the y coordinate is relative to the top side of the text area, going down. */
});



/**
 * A texture copy draw operation.
 *
 * @since This struct is available since SDL_ttf 3.0.0.
 *
 * @sa TTF_DrawOperation
 *
 * @from SDL_textengine.h:72
 */
export const TTF_CopyOperation = new _.Struct({
  cmd: _.u32, /**< TTF_DrawCommand : TTF_DRAW_COMMAND_COPY */
  text_offset: _.i32, /**< int : The offset in the text corresponding to this glyph.
                                      There may be multiple glyphs with the same text offset
                                      and the next text offset might be several Unicode codepoints
                                      later. In this case the glyphs and codepoints are grouped
                                      together and the group bounding box is the union of the dst
                                      rectangles for the corresponding glyphs. */
  glyph_font: _.u64, /**< TTF_Font * : The font containing the glyph to be drawn, can be passed to TTF_GetGlyphImageForIndex() */
  glyph_index: _.u32, /**< Uint32 : The glyph index of the glyph to be drawn, can be passed to TTF_GetGlyphImageForIndex() */
  src: SDL_Rect, /**< SDL_Rect : The area within the glyph to be drawn */
  dst: SDL_Rect, /**< SDL_Rect : The drawing coordinates of the glyph, in pixels. The x coordinate is relative to the left side of the text area, going right, and the y coordinate is relative to the top side of the text area, going down. */
  reserved: _.u64, /* void * */
});



/* Private data in TTF_Text, available to implementations */
export const TTF_TextData = new _.Struct({
  font: _.u64, /**< TTF_Font * : The font used by this text, read-only. */
  color: SDL_FColor, /**< SDL_FColor : The color of the text, read-only. */
  needs_layout_update: _.bool, /**< bool : True if the layout needs to be updated */
  layout: _.u64, /**< TTF_TextLayout * : Cached layout information, read-only. */
  x: _.i32, /**< int : The x offset of the upper left corner of this text, in pixels, read-only. */
  y: _.i32, /**< int : The y offset of the upper left corner of this text, in pixels, read-only. */
  w: _.i32, /**< int : The width of this text, in pixels, read-only. */
  h: _.i32, /**< int : The height of this text, in pixels, read-only. */
  num_ops: _.i32, /**< int : The number of drawing operations to render this text, read-only. */
  ops: _.u64, /**< TTF_DrawOperation * : The drawing operations used to render this text, read-only. */
  num_clusters: _.i32, /**< int : The number of substrings representing clusters of glyphs in the string, read-only */
  clusters: _.u64, /**< TTF_SubString * : Substrings representing clusters of glyphs in the string, read-only */
  props: _.u32, /**< SDL_PropertiesID : Custom properties associated with this text, read-only. This field is created as-needed using TTF_GetTextProperties() and the properties may be then set and read normally */
  needs_engine_update: _.bool, /**< bool : True if the engine text needs to be updated */
  engine: _.u64, /**< TTF_TextEngine * : The engine used to render this text, read-only. */
  engine_text: _.u64, /**< void * : The implementation-specific representation of this text */
});



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
export const TTF_TextEngine = new _.Struct({
  version: _.u32, /**< Uint32 : The version of this interface */
  userdata: _.u64, /**< void * : User data pointer passed to callbacks */
    /* Create a text representation from draw instructions.
     *
     * All fields of `text` except `internal->engine_text` will already be filled out.
     *
     * This function should set the `internal->engine_text` field to a non-NULL value.
     *
     * \param userdata the userdata pointer in this interface.
     * \param text the text object being created.
     */
  CreateText: _.u64, /*     bool (SDLCALL *CreateText)(void *userdata, TTF_Text *text); */
    /**
     * Destroy a text representation.
     */
  DestroyText: _.u64, /*     void (SDLCALL *DestroyText)(void *userdata, TTF_Text *text); */
});



