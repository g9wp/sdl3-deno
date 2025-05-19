/**
 * # CategoryGPU
 *
 * The GPU API offers a cross-platform way for apps to talk to modern graphics
 * hardware. It offers both 3D graphics and compute support, in the style of
 * Metal, Vulkan, and Direct3D 12.
 *
 * A basic workflow might be something like this:
 *
 * The app creates a GPU device with SDL_CreateGPUDevice(), and assigns it to
 * a window with SDL_ClaimWindowForGPUDevice()--although strictly speaking you
 * can render offscreen entirely, perhaps for image processing, and not use a
 * window at all.
 *
 * Next, the app prepares static data (things that are created once and used
 * over and over). For example:
 *
 * - Shaders (programs that run on the GPU): use SDL_CreateGPUShader().
 * - Vertex buffers (arrays of geometry data) and other rendering data: use
 *   SDL_CreateGPUBuffer() and SDL_UploadToGPUBuffer().
 * - Textures (images): use SDL_CreateGPUTexture() and
 *   SDL_UploadToGPUTexture().
 * - Samplers (how textures should be read from): use SDL_CreateGPUSampler().
 * - Render pipelines (precalculated rendering state): use
 *   SDL_CreateGPUGraphicsPipeline()
 *
 * To render, the app creates one or more command buffers, with
 * SDL_AcquireGPUCommandBuffer(). Command buffers collect rendering
 * instructions that will be submitted to the GPU in batch. Complex scenes can
 * use multiple command buffers, maybe configured across multiple threads in
 * parallel, as long as they are submitted in the correct order, but many apps
 * will just need one command buffer per frame.
 *
 * Rendering can happen to a texture (what other APIs call a "render target")
 * or it can happen to the swapchain texture (which is just a special texture
 * that represents a window's contents). The app can use
 * SDL_WaitAndAcquireGPUSwapchainTexture() to render to the window.
 *
 * Rendering actually happens in a Render Pass, which is encoded into a
 * command buffer. One can encode multiple render passes (or alternate between
 * render and compute passes) in a single command buffer, but many apps might
 * simply need a single render pass in a single command buffer. Render Passes
 * can render to up to four color textures and one depth texture
 * simultaneously. If the set of textures being rendered to needs to change,
 * the Render Pass must be ended and a new one must be begun.
 *
 * The app calls SDL_BeginGPURenderPass(). Then it sets states it needs for
 * each draw:
 *
 * - SDL_BindGPUGraphicsPipeline()
 * - SDL_SetGPUViewport()
 * - SDL_BindGPUVertexBuffers()
 * - SDL_BindGPUVertexSamplers()
 * - etc
 *
 * Then, make the actual draw commands with these states:
 *
 * - SDL_DrawGPUPrimitives()
 * - SDL_DrawGPUPrimitivesIndirect()
 * - SDL_DrawGPUIndexedPrimitivesIndirect()
 * - etc
 *
 * After all the drawing commands for a pass are complete, the app should call
 * SDL_EndGPURenderPass(). Once a render pass ends all render-related state is
 * reset.
 *
 * The app can begin new Render Passes and make new draws in the same command
 * buffer until the entire scene is rendered.
 *
 * Once all of the render commands for the scene are complete, the app calls
 * SDL_SubmitGPUCommandBuffer() to send it to the GPU for processing.
 *
 * If the app needs to read back data from texture or buffers, the API has an
 * efficient way of doing this, provided that the app is willing to tolerate
 * some latency. When the app uses SDL_DownloadFromGPUTexture() or
 * SDL_DownloadFromGPUBuffer(), submitting the command buffer with
 * SDL_SubmitGPUCommandBufferAndAcquireFence() will return a fence handle that
 * the app can poll or wait on in a thread. Once the fence indicates that the
 * command buffer is done processing, it is safe to read the downloaded data.
 * Make sure to call SDL_ReleaseGPUFence() when done with the fence.
 *
 * The API also has "compute" support. The app calls SDL_BeginGPUComputePass()
 * with compute-writeable textures and/or buffers, which can be written to in
 * a compute shader. Then it sets states it needs for the compute dispatches:
 *
 * - SDL_BindGPUComputePipeline()
 * - SDL_BindGPUComputeStorageBuffers()
 * - SDL_BindGPUComputeStorageTextures()
 *
 * Then, dispatch compute work:
 *
 * - SDL_DispatchGPUCompute()
 *
 * For advanced users, this opens up powerful GPU-driven workflows.
 *
 * Graphics and compute pipelines require the use of shaders, which as
 * mentioned above are small programs executed on the GPU. Each backend
 * (Vulkan, Metal, D3D12) requires a different shader format. When the app
 * creates the GPU device, the app lets the device know which shader formats
 * the app can provide. It will then select the appropriate backend depending
 * on the available shader formats and the backends available on the platform.
 * When creating shaders, the app must provide the correct shader format for
 * the selected backend. If you would like to learn more about why the API
 * works this way, there is a detailed
 * [blog post](https://moonside.games/posts/layers-all-the-way-down/)
 * explaining this situation.
 *
 * It is optimal for apps to pre-compile the shader formats they might use,
 * but for ease of use SDL provides a separate project,
 * [SDL_shadercross](https://github.com/libsdl-org/SDL_shadercross)
 * , for performing runtime shader cross-compilation. It also has a CLI
 * interface for offline precompilation as well.
 *
 * This is an extremely quick overview that leaves out several important
 * details. Already, though, one can see that GPU programming can be quite
 * complex! If you just need simple 2D graphics, the
 * [Render API](https://wiki.libsdl.org/SDL3/CategoryRender)
 * is much easier to use but still hardware-accelerated. That said, even for
 * 2D applications the performance benefits and expressiveness of the GPU API
 * are significant.
 *
 * The GPU API targets a feature set with a wide range of hardware support and
 * ease of portability. It is designed so that the app won't have to branch
 * itself by querying feature support. If you need cutting-edge features with
 * limited hardware support, this API is probably not for you.
 *
 * Examples demonstrating proper usage of this API can be found
 * [here](https://github.com/TheSpydog/SDL_gpu_examples)
 * .
 *
 * ## Performance considerations
 *
 * Here are some basic tips for maximizing your rendering performance.
 *
 * - Beginning a new render pass is relatively expensive. Use as few render
 *   passes as you can.
 * - Minimize the amount of state changes. For example, binding a pipeline is
 *   relatively cheap, but doing it hundreds of times when you don't need to
 *   will slow the performance significantly.
 * - Perform your data uploads as early as possible in the frame.
 * - Don't churn resources. Creating and releasing resources is expensive.
 *   It's better to create what you need up front and cache it.
 * - Don't use uniform buffers for large amounts of data (more than a matrix
 *   or so). Use a storage buffer instead.
 * - Use cycling correctly. There is a detailed explanation of cycling further
 *   below.
 * - Use culling techniques to minimize pixel writes. The less writing the GPU
 *   has to do the better. Culling can be a very advanced topic but even
 *   simple culling techniques can boost performance significantly.
 *
 * In general try to remember the golden rule of performance: doing things is
 * more expensive than not doing things. Don't Touch The Driver!
 *
 * ## FAQ
 *
 * **Question: When are you adding more advanced features, like ray tracing or
 * mesh shaders?**
 *
 * Answer: We don't have immediate plans to add more bleeding-edge features,
 * but we certainly might in the future, when these features prove worthwhile,
 * and reasonable to implement across several platforms and underlying APIs.
 * So while these things are not in the "never" category, they are definitely
 * not "near future" items either.
 *
 * **Question: Why is my shader not working?**
 *
 * Answer: A common oversight when using shaders is not properly laying out
 * the shader resources/registers correctly. The GPU API is very strict with
 * how it wants resources to be laid out and it's difficult for the API to
 * automatically validate shaders to see if they have a compatible layout. See
 * the documentation for SDL_CreateGPUShader() and
 * SDL_CreateGPUComputePipeline() for information on the expected layout.
 *
 * Another common issue is not setting the correct number of samplers,
 * textures, and buffers in SDL_GPUShaderCreateInfo. If possible use shader
 * reflection to extract the required information from the shader
 * automatically instead of manually filling in the struct's values.
 *
 * **Question: My application isn't performing very well. Is this the GPU
 * API's fault?**
 *
 * Answer: No. Long answer: The GPU API is a relatively thin layer over the
 * underlying graphics API. While it's possible that we have done something
 * inefficiently, it's very unlikely especially if you are relatively
 * inexperienced with GPU rendering. Please see the performance tips above and
 * make sure you are following them. Additionally, tools like RenderDoc can be
 * very helpful for diagnosing incorrect behavior and performance issues.
 *
 * ## System Requirements
 *
 * **Vulkan:** Supported on Windows, Linux, Nintendo Switch, and certain
 * Android devices. Requires Vulkan 1.0 with the following extensions and
 * device features:
 *
 * - `VK_KHR_swapchain`
 * - `VK_KHR_maintenance1`
 * - `independentBlend`
 * - `imageCubeArray`
 * - `depthClamp`
 * - `shaderClipDistance`
 * - `drawIndirectFirstInstance`
 *
 * **D3D12:** Supported on Windows 10 or newer, Xbox One (GDK), and Xbox
 * Series X|S (GDK). Requires a GPU that supports DirectX 12 Feature Level
 * 11_1.
 *
 * **Metal:** Supported on macOS 10.14+ and iOS/tvOS 13.0+. Hardware
 * requirements vary by operating system:
 *
 * - macOS requires an Apple Silicon or
 *   [Intel Mac2 family](https://developer.apple.com/documentation/metal/mtlfeatureset/mtlfeatureset_macos_gpufamily2_v1?language=objc)
 *   GPU
 * - iOS/tvOS requires an A9 GPU or newer
 * - iOS Simulator and tvOS Simulator are unsupported
 *
 * ## Uniform Data
 *
 * Uniforms are for passing data to shaders. The uniform data will be constant
 * across all executions of the shader.
 *
 * There are 4 available uniform slots per shader stage (where the stages are
 * vertex, fragment, and compute). Uniform data pushed to a slot on a stage
 * keeps its value throughout the command buffer until you call the relevant
 * Push function on that slot again.
 *
 * For example, you could write your vertex shaders to read a camera matrix
 * from uniform binding slot 0, push the camera matrix at the start of the
 * command buffer, and that data will be used for every subsequent draw call.
 *
 * It is valid to push uniform data during a render or compute pass.
 *
 * Uniforms are best for pushing small amounts of data. If you are pushing
 * more than a matrix or two per call you should consider using a storage
 * buffer instead.
 *
 * ## A Note On Cycling
 *
 * When using a command buffer, operations do not occur immediately - they
 * occur some time after the command buffer is submitted.
 *
 * When a resource is used in a pending or active command buffer, it is
 * considered to be "bound". When a resource is no longer used in any pending
 * or active command buffers, it is considered to be "unbound".
 *
 * If data resources are bound, it is unspecified when that data will be
 * unbound unless you acquire a fence when submitting the command buffer and
 * wait on it. However, this doesn't mean you need to track resource usage
 * manually.
 *
 * All of the functions and structs that involve writing to a resource have a
 * "cycle" bool. SDL_GPUTransferBuffer, SDL_GPUBuffer, and SDL_GPUTexture all
 * effectively function as ring buffers on internal resources. When cycle is
 * true, if the resource is bound, the cycle rotates to the next unbound
 * internal resource, or if none are available, a new one is created. This
 * means you don't have to worry about complex state tracking and
 * synchronization as long as cycling is correctly employed.
 *
 * For example: you can call SDL_MapGPUTransferBuffer(), write texture data,
 * SDL_UnmapGPUTransferBuffer(), and then SDL_UploadToGPUTexture(). The next
 * time you write texture data to the transfer buffer, if you set the cycle
 * param to true, you don't have to worry about overwriting any data that is
 * not yet uploaded.
 *
 * Another example: If you are using a texture in a render pass every frame,
 * this can cause a data dependency between frames. If you set cycle to true
 * in the SDL_GPUColorTargetInfo struct, you can prevent this data dependency.
 *
 * Cycling will never undefine already bound data. When cycling, all data in
 * the resource is considered to be undefined for subsequent commands until
 * that data is written again. You must take care not to read undefined data.
 *
 * Note that when cycling a texture, the entire texture will be cycled, even
 * if only part of the texture is used in the call, so you must consider the
 * entire texture to contain undefined data after cycling.
 *
 * You must also take care not to overwrite a section of data that has been
 * referenced in a command without cycling first. It is OK to overwrite
 * unreferenced data in a bound resource without cycling, but overwriting a
 * section of data that has already been referenced will produce unexpected
 * results.
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

import * as _ from "../_utils.ts";
import * as _b from "../_structs/SDL_gpu.ts";
import {FColor} from "./SDL_pixels.ts";


/**
 * A structure specifying a viewport.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @sa SDL_SetGPUViewport
 *
 * @from SDL_gpu.h:1298
 */
export interface GPUViewport {
  x: number; /**< float : The left offset of the viewport. */
  y: number; /**< float : The top offset of the viewport. */
  w: number; /**< float : The width of the viewport. */
  h: number; /**< float : The height of the viewport. */
  min_depth: number; /**< float : The minimum depth of the viewport. */
  max_depth: number; /**< float : The maximum depth of the viewport. */
}

export function read_GPUViewport(dt: DataView): GPUViewport {
  const t = _b.SDL_GPUViewport.read(dt);
  return {
    x: t.x, /** float */
    y: t.y, /** float */
    w: t.w, /** float */
    h: t.h, /** float */
    min_depth: t.min_depth, /** float */
    max_depth: t.max_depth, /** float */
  };
}

export function write_GPUViewport(t: GPUViewport, dt: DataView) {
  _b.SDL_GPUViewport.write({
    x: t.x, /** float */
    y: t.y, /** float */
    w: t.w, /** float */
    h: t.h, /** float */
    min_depth: t.min_depth, /** float */
    max_depth: t.max_depth, /** float */
  }, dt);
}


/**
 * A structure specifying parameters related to transferring data to or from a
 * texture.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @sa SDL_UploadToGPUTexture
 * @sa SDL_DownloadFromGPUTexture
 *
 * @from SDL_gpu.h:1317
 */
export interface GPUTextureTransferInfo {
  transfer_buffer: Deno.PointerValue; /**< SDL_GPUTransferBuffer * : The transfer buffer used in the transfer operation. */
  offset: number; /**< Uint32 : The starting byte of the image data in the transfer buffer. */
  pixels_per_row: number; /**< Uint32 : The number of pixels from one row to the next. */
  rows_per_layer: number; /**< Uint32 : The number of rows from one layer/depth-slice to the next. */
}

export function read_GPUTextureTransferInfo(dt: DataView): GPUTextureTransferInfo {
  const t = _b.SDL_GPUTextureTransferInfo.read(dt);
  return {
    transfer_buffer: Deno.UnsafePointer.create(t.transfer_buffer), /** SDL_GPUTransferBuffer * */
    offset: t.offset, /** Uint32 */
    pixels_per_row: t.pixels_per_row, /** Uint32 */
    rows_per_layer: t.rows_per_layer, /** Uint32 */
  };
}

export function write_GPUTextureTransferInfo(t: GPUTextureTransferInfo, dt: DataView) {
  _b.SDL_GPUTextureTransferInfo.write({
    transfer_buffer: Deno.UnsafePointer.value(t.transfer_buffer), /** SDL_GPUTransferBuffer * */
    offset: t.offset, /** Uint32 */
    pixels_per_row: t.pixels_per_row, /** Uint32 */
    rows_per_layer: t.rows_per_layer, /** Uint32 */
  }, dt);
}


/**
 * A structure specifying a location in a transfer buffer.
 *
 * Used when transferring buffer data to or from a transfer buffer.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @sa SDL_UploadToGPUBuffer
 * @sa SDL_DownloadFromGPUBuffer
 *
 * @from SDL_gpu.h:1335
 */
export interface GPUTransferBufferLocation {
  transfer_buffer: Deno.PointerValue; /**< SDL_GPUTransferBuffer * : The transfer buffer used in the transfer operation. */
  offset: number; /**< Uint32 : The starting byte of the buffer data in the transfer buffer. */
}

export function read_GPUTransferBufferLocation(dt: DataView): GPUTransferBufferLocation {
  const t = _b.SDL_GPUTransferBufferLocation.read(dt);
  return {
    transfer_buffer: Deno.UnsafePointer.create(t.transfer_buffer), /** SDL_GPUTransferBuffer * */
    offset: t.offset, /** Uint32 */
  };
}

export function write_GPUTransferBufferLocation(t: GPUTransferBufferLocation, dt: DataView) {
  _b.SDL_GPUTransferBufferLocation.write({
    transfer_buffer: Deno.UnsafePointer.value(t.transfer_buffer), /** SDL_GPUTransferBuffer * */
    offset: t.offset, /** Uint32 */
  }, dt);
}


/**
 * A structure specifying a location in a texture.
 *
 * Used when copying data from one texture to another.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @sa SDL_CopyGPUTextureToTexture
 *
 * @from SDL_gpu.h:1350
 */
export interface GPUTextureLocation {
  texture: Deno.PointerValue; /**< SDL_GPUTexture * : The texture used in the copy operation. */
  mip_level: number; /**< Uint32 : The mip level index of the location. */
  layer: number; /**< Uint32 : The layer index of the location. */
  x: number; /**< Uint32 : The left offset of the location. */
  y: number; /**< Uint32 : The top offset of the location. */
  z: number; /**< Uint32 : The front offset of the location. */
}

export function read_GPUTextureLocation(dt: DataView): GPUTextureLocation {
  const t = _b.SDL_GPUTextureLocation.read(dt);
  return {
    texture: Deno.UnsafePointer.create(t.texture), /** SDL_GPUTexture * */
    mip_level: t.mip_level, /** Uint32 */
    layer: t.layer, /** Uint32 */
    x: t.x, /** Uint32 */
    y: t.y, /** Uint32 */
    z: t.z, /** Uint32 */
  };
}

export function write_GPUTextureLocation(t: GPUTextureLocation, dt: DataView) {
  _b.SDL_GPUTextureLocation.write({
    texture: Deno.UnsafePointer.value(t.texture), /** SDL_GPUTexture * */
    mip_level: t.mip_level, /** Uint32 */
    layer: t.layer, /** Uint32 */
    x: t.x, /** Uint32 */
    y: t.y, /** Uint32 */
    z: t.z, /** Uint32 */
  }, dt);
}


/**
 * A structure specifying a region of a texture.
 *
 * Used when transferring data to or from a texture.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @sa SDL_UploadToGPUTexture
 * @sa SDL_DownloadFromGPUTexture
 * @sa SDL_CreateGPUTexture
 *
 * @from SDL_gpu.h:1371
 */
export interface GPUTextureRegion {
  texture: Deno.PointerValue; /**< SDL_GPUTexture * : The texture used in the copy operation. */
  mip_level: number; /**< Uint32 : The mip level index to transfer. */
  layer: number; /**< Uint32 : The layer index to transfer. */
  x: number; /**< Uint32 : The left offset of the region. */
  y: number; /**< Uint32 : The top offset of the region. */
  z: number; /**< Uint32 : The front offset of the region. */
  w: number; /**< Uint32 : The width of the region. */
  h: number; /**< Uint32 : The height of the region. */
  d: number; /**< Uint32 : The depth of the region. */
}

export function read_GPUTextureRegion(dt: DataView): GPUTextureRegion {
  const t = _b.SDL_GPUTextureRegion.read(dt);
  return {
    texture: Deno.UnsafePointer.create(t.texture), /** SDL_GPUTexture * */
    mip_level: t.mip_level, /** Uint32 */
    layer: t.layer, /** Uint32 */
    x: t.x, /** Uint32 */
    y: t.y, /** Uint32 */
    z: t.z, /** Uint32 */
    w: t.w, /** Uint32 */
    h: t.h, /** Uint32 */
    d: t.d, /** Uint32 */
  };
}

export function write_GPUTextureRegion(t: GPUTextureRegion, dt: DataView) {
  _b.SDL_GPUTextureRegion.write({
    texture: Deno.UnsafePointer.value(t.texture), /** SDL_GPUTexture * */
    mip_level: t.mip_level, /** Uint32 */
    layer: t.layer, /** Uint32 */
    x: t.x, /** Uint32 */
    y: t.y, /** Uint32 */
    z: t.z, /** Uint32 */
    w: t.w, /** Uint32 */
    h: t.h, /** Uint32 */
    d: t.d, /** Uint32 */
  }, dt);
}


/**
 * A structure specifying a region of a texture used in the blit operation.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @sa SDL_BlitGPUTexture
 *
 * @from SDL_gpu.h:1391
 */
export interface GPUBlitRegion {
  texture: Deno.PointerValue; /**< SDL_GPUTexture * : The texture. */
  mip_level: number; /**< Uint32 : The mip level index of the region. */
  layer_or_depth_plane: number; /**< Uint32 : The layer index or depth plane of the region. This value is treated as a layer index on 2D array and cube textures, and as a depth plane on 3D textures. */
  x: number; /**< Uint32 : The left offset of the region. */
  y: number; /**< Uint32 : The top offset of the region.  */
  w: number; /**< Uint32 : The width of the region. */
  h: number; /**< Uint32 : The height of the region. */
}

export function read_GPUBlitRegion(dt: DataView): GPUBlitRegion {
  const t = _b.SDL_GPUBlitRegion.read(dt);
  return _read_GPUBlitRegion(t);
}
function _read_GPUBlitRegion(t: ReturnType<typeof _b.SDL_GPUBlitRegion.read>): GPUBlitRegion {
  return {
    texture: Deno.UnsafePointer.create(t.texture), /** SDL_GPUTexture * */
    mip_level: t.mip_level, /** Uint32 */
    layer_or_depth_plane: t.layer_or_depth_plane, /** Uint32 */
    x: t.x, /** Uint32 */
    y: t.y, /** Uint32 */
    w: t.w, /** Uint32 */
    h: t.h, /** Uint32 */
  };
}

export function write_GPUBlitRegion(t: GPUBlitRegion, dt: DataView) {
  _b.SDL_GPUBlitRegion.write(_write_GPUBlitRegion(t), dt);
}
export function _write_GPUBlitRegion(t: GPUBlitRegion): ReturnType<typeof _b.SDL_GPUBlitRegion.read> {
  return {
    texture: Deno.UnsafePointer.value(t.texture), /** SDL_GPUTexture * */
    mip_level: t.mip_level, /** Uint32 */
    layer_or_depth_plane: t.layer_or_depth_plane, /** Uint32 */
    x: t.x, /** Uint32 */
    y: t.y, /** Uint32 */
    w: t.w, /** Uint32 */
    h: t.h, /** Uint32 */
  };
}


/**
 * A structure specifying a location in a buffer.
 *
 * Used when copying data between buffers.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @sa SDL_CopyGPUBufferToBuffer
 *
 * @from SDL_gpu.h:1411
 */
export interface GPUBufferLocation {
  buffer: Deno.PointerValue; /**< SDL_GPUBuffer * : The buffer. */
  offset: number; /**< Uint32 : The starting byte within the buffer. */
}

export function read_GPUBufferLocation(dt: DataView): GPUBufferLocation {
  const t = _b.SDL_GPUBufferLocation.read(dt);
  return {
    buffer: Deno.UnsafePointer.create(t.buffer), /** SDL_GPUBuffer * */
    offset: t.offset, /** Uint32 */
  };
}

export function write_GPUBufferLocation(t: GPUBufferLocation, dt: DataView) {
  _b.SDL_GPUBufferLocation.write({
    buffer: Deno.UnsafePointer.value(t.buffer), /** SDL_GPUBuffer * */
    offset: t.offset, /** Uint32 */
  }, dt);
}


/**
 * A structure specifying a region of a buffer.
 *
 * Used when transferring data to or from buffers.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @sa SDL_UploadToGPUBuffer
 * @sa SDL_DownloadFromGPUBuffer
 *
 * @from SDL_gpu.h:1427
 */
export interface GPUBufferRegion {
  buffer: Deno.PointerValue; /**< SDL_GPUBuffer * : The buffer. */
  offset: number; /**< Uint32 : The starting byte within the buffer. */
  size: number; /**< Uint32 : The size in bytes of the region. */
}

export function read_GPUBufferRegion(dt: DataView): GPUBufferRegion {
  const t = _b.SDL_GPUBufferRegion.read(dt);
  return {
    buffer: Deno.UnsafePointer.create(t.buffer), /** SDL_GPUBuffer * */
    offset: t.offset, /** Uint32 */
    size: t.size, /** Uint32 */
  };
}

export function write_GPUBufferRegion(t: GPUBufferRegion, dt: DataView) {
  _b.SDL_GPUBufferRegion.write({
    buffer: Deno.UnsafePointer.value(t.buffer), /** SDL_GPUBuffer * */
    offset: t.offset, /** Uint32 */
    size: t.size, /** Uint32 */
  }, dt);
}


/**
 * A structure specifying the parameters of an indirect draw command.
 *
 * Note that the `first_vertex` and `first_instance` parameters are NOT
 * compatible with built-in vertex/instance ID variables in shaders (for
 * example, SV_VertexID); GPU APIs and shader languages do not define these
 * built-in variables consistently, so if your shader depends on them, the
 * only way to keep behavior consistent and portable is to always pass 0 for
 * the correlating parameter in the draw calls.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @sa SDL_DrawGPUPrimitivesIndirect
 *
 * @from SDL_gpu.h:1448
 */
export interface GPUIndirectDrawCommand {
  num_vertices: number; /**< Uint32 : The number of vertices to draw. */
  num_instances: number; /**< Uint32 : The number of instances to draw. */
  first_vertex: number; /**< Uint32 : The index of the first vertex to draw. */
  first_instance: number; /**< Uint32 : The ID of the first instance to draw. */
}

export function read_GPUIndirectDrawCommand(dt: DataView): GPUIndirectDrawCommand {
  const t = _b.SDL_GPUIndirectDrawCommand.read(dt);
  return {
    num_vertices: t.num_vertices, /** Uint32 */
    num_instances: t.num_instances, /** Uint32 */
    first_vertex: t.first_vertex, /** Uint32 */
    first_instance: t.first_instance, /** Uint32 */
  };
}

export function write_GPUIndirectDrawCommand(t: GPUIndirectDrawCommand, dt: DataView) {
  _b.SDL_GPUIndirectDrawCommand.write({
    num_vertices: t.num_vertices, /** Uint32 */
    num_instances: t.num_instances, /** Uint32 */
    first_vertex: t.first_vertex, /** Uint32 */
    first_instance: t.first_instance, /** Uint32 */
  }, dt);
}


/**
 * A structure specifying the parameters of an indexed indirect draw command.
 *
 * Note that the `first_vertex` and `first_instance` parameters are NOT
 * compatible with built-in vertex/instance ID variables in shaders (for
 * example, SV_VertexID); GPU APIs and shader languages do not define these
 * built-in variables consistently, so if your shader depends on them, the
 * only way to keep behavior consistent and portable is to always pass 0 for
 * the correlating parameter in the draw calls.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @sa SDL_DrawGPUIndexedPrimitivesIndirect
 *
 * @from SDL_gpu.h:1470
 */
export interface GPUIndexedIndirectDrawCommand {
  num_indices: number; /**< Uint32 : The number of indices to draw per instance. */
  num_instances: number; /**< Uint32 : The number of instances to draw. */
  first_index: number; /**< Uint32 : The base index within the index buffer. */
  vertex_offset: number; /**< Sint32 : The value added to the vertex index before indexing into the vertex buffer. */
  first_instance: number; /**< Uint32 : The ID of the first instance to draw. */
}

export function read_GPUIndexedIndirectDrawCommand(dt: DataView): GPUIndexedIndirectDrawCommand {
  const t = _b.SDL_GPUIndexedIndirectDrawCommand.read(dt);
  return {
    num_indices: t.num_indices, /** Uint32 */
    num_instances: t.num_instances, /** Uint32 */
    first_index: t.first_index, /** Uint32 */
    vertex_offset: t.vertex_offset, /** Sint32 */
    first_instance: t.first_instance, /** Uint32 */
  };
}

export function write_GPUIndexedIndirectDrawCommand(t: GPUIndexedIndirectDrawCommand, dt: DataView) {
  _b.SDL_GPUIndexedIndirectDrawCommand.write({
    num_indices: t.num_indices, /** Uint32 */
    num_instances: t.num_instances, /** Uint32 */
    first_index: t.first_index, /** Uint32 */
    vertex_offset: t.vertex_offset, /** Sint32 */
    first_instance: t.first_instance, /** Uint32 */
  }, dt);
}


/**
 * A structure specifying the parameters of an indexed dispatch command.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @sa SDL_DispatchGPUComputeIndirect
 *
 * @from SDL_gpu.h:1486
 */
export interface GPUIndirectDispatchCommand {
  groupcount_x: number; /**< Uint32 : The number of local workgroups to dispatch in the X dimension. */
  groupcount_y: number; /**< Uint32 : The number of local workgroups to dispatch in the Y dimension. */
  groupcount_z: number; /**< Uint32 : The number of local workgroups to dispatch in the Z dimension. */
}

export function read_GPUIndirectDispatchCommand(dt: DataView): GPUIndirectDispatchCommand {
  const t = _b.SDL_GPUIndirectDispatchCommand.read(dt);
  return {
    groupcount_x: t.groupcount_x, /** Uint32 */
    groupcount_y: t.groupcount_y, /** Uint32 */
    groupcount_z: t.groupcount_z, /** Uint32 */
  };
}

export function write_GPUIndirectDispatchCommand(t: GPUIndirectDispatchCommand, dt: DataView) {
  _b.SDL_GPUIndirectDispatchCommand.write({
    groupcount_x: t.groupcount_x, /** Uint32 */
    groupcount_y: t.groupcount_y, /** Uint32 */
    groupcount_z: t.groupcount_z, /** Uint32 */
  }, dt);
}


/**
 * A structure specifying the parameters of a sampler.
 *
 * Note that mip_lod_bias is a no-op for the Metal driver. For Metal, LOD bias
 * must be applied via shader instead.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_CreateGPUSampler
 * @sa SDL_GPUFilter
 * @sa SDL_GPUSamplerMipmapMode
 * @sa SDL_GPUSamplerAddressMode
 * @sa SDL_GPUCompareOp
 *
 * @from SDL_gpu.h:1509
 */
export interface GPUSamplerCreateInfo {
  min_filter: number; /**< SDL_GPUFilter : The minification filter to apply to lookups. */
  mag_filter: number; /**< SDL_GPUFilter : The magnification filter to apply to lookups. */
  mipmap_mode: number; /**< SDL_GPUSamplerMipmapMode : The mipmap filter to apply to lookups. */
  address_mode_u: number; /**< SDL_GPUSamplerAddressMode : The addressing mode for U coordinates outside [0, 1). */
  address_mode_v: number; /**< SDL_GPUSamplerAddressMode : The addressing mode for V coordinates outside [0, 1). */
  address_mode_w: number; /**< SDL_GPUSamplerAddressMode : The addressing mode for W coordinates outside [0, 1). */
  mip_lod_bias: number; /**< float : The bias to be added to mipmap LOD calculation. */
  max_anisotropy: number; /**< float : The anisotropy value clamp used by the sampler. If enable_anisotropy is false, this is ignored. */
  compare_op: number; /**< SDL_GPUCompareOp : The comparison operator to apply to fetched data before filtering. */
  min_lod: number; /**< float : Clamps the minimum of the computed LOD value. */
  max_lod: number; /**< float : Clamps the maximum of the computed LOD value. */
  enable_anisotropy: boolean; /**< bool : true to enable anisotropic filtering. */
  enable_compare: boolean; /**< bool : true to enable comparison against a reference value during lookups. */
  padding1: number; /* Uint8 */
  padding2: number; /* Uint8 */
  props: number; /**< SDL_PropertiesID : A properties ID for extensions. Should be 0 if no extensions are needed. */
}

export function read_GPUSamplerCreateInfo(dt: DataView): GPUSamplerCreateInfo {
  const t = _b.SDL_GPUSamplerCreateInfo.read(dt);
  return {
    min_filter: t.min_filter, /** SDL_GPUFilter */
    mag_filter: t.mag_filter, /** SDL_GPUFilter */
    mipmap_mode: t.mipmap_mode, /** SDL_GPUSamplerMipmapMode */
    address_mode_u: t.address_mode_u, /** SDL_GPUSamplerAddressMode */
    address_mode_v: t.address_mode_v, /** SDL_GPUSamplerAddressMode */
    address_mode_w: t.address_mode_w, /** SDL_GPUSamplerAddressMode */
    mip_lod_bias: t.mip_lod_bias, /** float */
    max_anisotropy: t.max_anisotropy, /** float */
    compare_op: t.compare_op, /** SDL_GPUCompareOp */
    min_lod: t.min_lod, /** float */
    max_lod: t.max_lod, /** float */
    enable_anisotropy: t.enable_anisotropy, /** bool */
    enable_compare: t.enable_compare, /** bool */
    padding1: t.padding1, /** Uint8 */
    padding2: t.padding2, /** Uint8 */
    props: t.props, /** SDL_PropertiesID */
  };
}

export function write_GPUSamplerCreateInfo(t: GPUSamplerCreateInfo, dt: DataView) {
  _b.SDL_GPUSamplerCreateInfo.write({
    min_filter: t.min_filter, /** SDL_GPUFilter */
    mag_filter: t.mag_filter, /** SDL_GPUFilter */
    mipmap_mode: t.mipmap_mode, /** SDL_GPUSamplerMipmapMode */
    address_mode_u: t.address_mode_u, /** SDL_GPUSamplerAddressMode */
    address_mode_v: t.address_mode_v, /** SDL_GPUSamplerAddressMode */
    address_mode_w: t.address_mode_w, /** SDL_GPUSamplerAddressMode */
    mip_lod_bias: t.mip_lod_bias, /** float */
    max_anisotropy: t.max_anisotropy, /** float */
    compare_op: t.compare_op, /** SDL_GPUCompareOp */
    min_lod: t.min_lod, /** float */
    max_lod: t.max_lod, /** float */
    enable_anisotropy: t.enable_anisotropy, /** bool */
    enable_compare: t.enable_compare, /** bool */
    padding1: t.padding1, /** Uint8 */
    padding2: t.padding2, /** Uint8 */
    props: t.props, /** SDL_PropertiesID */
  }, dt);
}


/**
 * A structure specifying the parameters of vertex buffers used in a graphics
 * pipeline.
 *
 * When you call SDL_BindGPUVertexBuffers, you specify the binding slots of
 * the vertex buffers. For example if you called SDL_BindGPUVertexBuffers with
 * a first_slot of 2 and num_bindings of 3, the binding slots 2, 3, 4 would be
 * used by the vertex buffers you pass in.
 *
 * Vertex attributes are linked to buffers via the buffer_slot field of
 * SDL_GPUVertexAttribute. For example, if an attribute has a buffer_slot of
 * 0, then that attribute belongs to the vertex buffer bound at slot 0.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @sa SDL_GPUVertexAttribute
 * @sa SDL_GPUVertexInputRate
 *
 * @from SDL_gpu.h:1548
 */
export interface GPUVertexBufferDescription {
  slot: number; /**< Uint32 : The binding slot of the vertex buffer. */
  pitch: number; /**< Uint32 : The byte pitch between consecutive elements of the vertex buffer. */
  input_rate: number; /**< SDL_GPUVertexInputRate : Whether attribute addressing is a function of the vertex index or instance index. */
  instance_step_rate: number; /**< Uint32 : Reserved for future use. Must be set to 0. */
}

export function read_GPUVertexBufferDescription(dt: DataView): GPUVertexBufferDescription {
  const t = _b.SDL_GPUVertexBufferDescription.read(dt);
  return {
    slot: t.slot, /** Uint32 */
    pitch: t.pitch, /** Uint32 */
    input_rate: t.input_rate, /** SDL_GPUVertexInputRate */
    instance_step_rate: t.instance_step_rate, /** Uint32 */
  };
}

export function write_GPUVertexBufferDescription(t: GPUVertexBufferDescription, dt: DataView) {
  _b.SDL_GPUVertexBufferDescription.write({
    slot: t.slot, /** Uint32 */
    pitch: t.pitch, /** Uint32 */
    input_rate: t.input_rate, /** SDL_GPUVertexInputRate */
    instance_step_rate: t.instance_step_rate, /** Uint32 */
  }, dt);
}


/**
 * A structure specifying a vertex attribute.
 *
 * All vertex attribute locations provided to an SDL_GPUVertexInputState must
 * be unique.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @sa SDL_GPUVertexBufferDescription
 * @sa SDL_GPUVertexInputState
 * @sa SDL_GPUVertexElementFormat
 *
 * @from SDL_gpu.h:1568
 */
export interface GPUVertexAttribute {
  location: number; /**< Uint32 : The shader input location index. */
  buffer_slot: number; /**< Uint32 : The binding slot of the associated vertex buffer. */
  format: number; /**< SDL_GPUVertexElementFormat : The size and type of the attribute data. */
  offset: number; /**< Uint32 : The byte offset of this attribute relative to the start of the vertex element. */
}

export function read_GPUVertexAttribute(dt: DataView): GPUVertexAttribute {
  const t = _b.SDL_GPUVertexAttribute.read(dt);
  return {
    location: t.location, /** Uint32 */
    buffer_slot: t.buffer_slot, /** Uint32 */
    format: t.format, /** SDL_GPUVertexElementFormat */
    offset: t.offset, /** Uint32 */
  };
}

export function write_GPUVertexAttribute(t: GPUVertexAttribute, dt: DataView) {
  _b.SDL_GPUVertexAttribute.write({
    location: t.location, /** Uint32 */
    buffer_slot: t.buffer_slot, /** Uint32 */
    format: t.format, /** SDL_GPUVertexElementFormat */
    offset: t.offset, /** Uint32 */
  }, dt);
}


/**
 * A structure specifying the parameters of a graphics pipeline vertex input
 * state.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @sa SDL_GPUGraphicsPipelineCreateInfo
 * @sa SDL_GPUVertexBufferDescription
 * @sa SDL_GPUVertexAttribute
 *
 * @from SDL_gpu.h:1586
 */
export interface GPUVertexInputState {
  vertex_buffer_descriptions: Deno.PointerValue; /**< const SDL_GPUVertexBufferDescription * : A pointer to an array of vertex buffer descriptions. */
  num_vertex_buffers: number; /**< Uint32 : The number of vertex buffer descriptions in the above array. */
  vertex_attributes: Deno.PointerValue; /**< const SDL_GPUVertexAttribute * : A pointer to an array of vertex attribute descriptions. */
  num_vertex_attributes: number; /**< Uint32 : The number of vertex attribute descriptions in the above array. */
}

export function read_GPUVertexInputState(dt: DataView): GPUVertexInputState {
  const t = _b.SDL_GPUVertexInputState.read(dt);
  return _read_GPUVertexInputState(t);
}

function _read_GPUVertexInputState(t: ReturnType<typeof _b.SDL_GPUVertexInputState.read>): GPUVertexInputState {
  return {
    vertex_buffer_descriptions: Deno.UnsafePointer.create(t.vertex_buffer_descriptions), /** const SDL_GPUVertexBufferDescription * */
    num_vertex_buffers: t.num_vertex_buffers, /** Uint32 */
    vertex_attributes: Deno.UnsafePointer.create(t.vertex_attributes), /** const SDL_GPUVertexAttribute * */
    num_vertex_attributes: t.num_vertex_attributes, /** Uint32 */
  };
}

export function write_GPUVertexInputState(t: GPUVertexInputState, dt: DataView) {
  _b.SDL_GPUVertexInputState.write(_write_GPUVertexInputState(t), dt);
}

function _write_GPUVertexInputState(t: GPUVertexInputState): ReturnType<typeof _b.SDL_GPUVertexInputState.read> {
  return {
    vertex_buffer_descriptions: Deno.UnsafePointer.value(t.vertex_buffer_descriptions), /** const SDL_GPUVertexBufferDescription * */
    num_vertex_buffers: t.num_vertex_buffers, /** Uint32 */
    vertex_attributes: Deno.UnsafePointer.value(t.vertex_attributes), /** const SDL_GPUVertexAttribute * */
    num_vertex_attributes: t.num_vertex_attributes, /** Uint32 */
  }
}


/**
 * A structure specifying the stencil operation state of a graphics pipeline.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @sa SDL_GPUDepthStencilState
 *
 * @from SDL_gpu.h:1601
 */
export interface GPUStencilOpState {
  fail_op: number; /**< SDL_GPUStencilOp : The action performed on samples that fail the stencil test. */
  pass_op: number; /**< SDL_GPUStencilOp : The action performed on samples that pass the depth and stencil tests. */
  depth_fail_op: number; /**< SDL_GPUStencilOp : The action performed on samples that pass the stencil test and fail the depth test. */
  compare_op: number; /**< SDL_GPUCompareOp : The comparison operator used in the stencil test. */
}

export function read_GPUStencilOpState(dt: DataView): GPUStencilOpState {
  const t = _b.SDL_GPUStencilOpState.read(dt);
  return {
    fail_op: t.fail_op, /** SDL_GPUStencilOp */
    pass_op: t.pass_op, /** SDL_GPUStencilOp */
    depth_fail_op: t.depth_fail_op, /** SDL_GPUStencilOp */
    compare_op: t.compare_op, /** SDL_GPUCompareOp */
  };
}

export function write_GPUStencilOpState(t: GPUStencilOpState, dt: DataView) {
  _b.SDL_GPUStencilOpState.write({
    fail_op: t.fail_op, /** SDL_GPUStencilOp */
    pass_op: t.pass_op, /** SDL_GPUStencilOp */
    depth_fail_op: t.depth_fail_op, /** SDL_GPUStencilOp */
    compare_op: t.compare_op, /** SDL_GPUCompareOp */
  }, dt);
}


/**
 * A structure specifying the blend state of a color target.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @sa SDL_GPUColorTargetDescription
 *
 * @from SDL_gpu.h:1616
 */
export interface GPUColorTargetBlendState {
  src_color_blendfactor: number; /**< SDL_GPUBlendFactor : The value to be multiplied by the source RGB value. */
  dst_color_blendfactor: number; /**< SDL_GPUBlendFactor : The value to be multiplied by the destination RGB value. */
  color_blend_op: number; /**< SDL_GPUBlendOp : The blend operation for the RGB components. */
  src_alpha_blendfactor: number; /**< SDL_GPUBlendFactor : The value to be multiplied by the source alpha. */
  dst_alpha_blendfactor: number; /**< SDL_GPUBlendFactor : The value to be multiplied by the destination alpha. */
  alpha_blend_op: number; /**< SDL_GPUBlendOp : The blend operation for the alpha component. */
  color_write_mask: number; /**< SDL_GPUColorComponentFlags : A bitmask specifying which of the RGBA components are enabled for writing. Writes to all channels if enable_color_write_mask is false. */
  enable_blend: boolean; /**< bool : Whether blending is enabled for the color target. */
  enable_color_write_mask: boolean; /**< bool : Whether the color write mask is enabled. */
  padding1: number; /* Uint8 */
  padding2: number; /* Uint8 */
}

export function read_GPUColorTargetBlendState(dt: DataView): GPUColorTargetBlendState {
  const t = _b.SDL_GPUColorTargetBlendState.read(dt);
  return {
    src_color_blendfactor: t.src_color_blendfactor, /** SDL_GPUBlendFactor */
    dst_color_blendfactor: t.dst_color_blendfactor, /** SDL_GPUBlendFactor */
    color_blend_op: t.color_blend_op, /** SDL_GPUBlendOp */
    src_alpha_blendfactor: t.src_alpha_blendfactor, /** SDL_GPUBlendFactor */
    dst_alpha_blendfactor: t.dst_alpha_blendfactor, /** SDL_GPUBlendFactor */
    alpha_blend_op: t.alpha_blend_op, /** SDL_GPUBlendOp */
    color_write_mask: t.color_write_mask, /** SDL_GPUColorComponentFlags */
    enable_blend: t.enable_blend, /** bool */
    enable_color_write_mask: t.enable_color_write_mask, /** bool */
    padding1: t.padding1, /** Uint8 */
    padding2: t.padding2, /** Uint8 */
  };
}

export function write_GPUColorTargetBlendState(t: GPUColorTargetBlendState, dt: DataView) {
  _b.SDL_GPUColorTargetBlendState.write({
    src_color_blendfactor: t.src_color_blendfactor, /** SDL_GPUBlendFactor */
    dst_color_blendfactor: t.dst_color_blendfactor, /** SDL_GPUBlendFactor */
    color_blend_op: t.color_blend_op, /** SDL_GPUBlendOp */
    src_alpha_blendfactor: t.src_alpha_blendfactor, /** SDL_GPUBlendFactor */
    dst_alpha_blendfactor: t.dst_alpha_blendfactor, /** SDL_GPUBlendFactor */
    alpha_blend_op: t.alpha_blend_op, /** SDL_GPUBlendOp */
    color_write_mask: t.color_write_mask, /** SDL_GPUColorComponentFlags */
    enable_blend: t.enable_blend, /** bool */
    enable_color_write_mask: t.enable_color_write_mask, /** bool */
    padding1: t.padding1, /** Uint8 */
    padding2: t.padding2, /** Uint8 */
  }, dt);
}


/**
 * A structure specifying code and metadata for creating a shader object.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @sa SDL_CreateGPUShader
 *
 * @from SDL_gpu.h:1639
 */
export interface GPUShaderCreateInfo {
  code_size: bigint; /**< size_t : The size in bytes of the code pointed to. */
  code: Deno.PointerValue; /**< const Uint8 * : A pointer to shader code. */
  entrypoint: string; /**< const char * : A pointer to a null-terminated UTF-8 string specifying the entry point function name for the shader. */
  format: number; /**< SDL_GPUShaderFormat : The format of the shader code. */
  stage: number; /**< SDL_GPUShaderStage : The stage the shader program corresponds to. */
  num_samplers: number; /**< Uint32 : The number of samplers defined in the shader. */
  num_storage_textures: number; /**< Uint32 : The number of storage textures defined in the shader. */
  num_storage_buffers: number; /**< Uint32 : The number of storage buffers defined in the shader. */
  num_uniform_buffers: number; /**< Uint32 : The number of uniform buffers defined in the shader. */
  props: number; /**< SDL_PropertiesID : A properties ID for extensions. Should be 0 if no extensions are needed. */
}

export function read_GPUShaderCreateInfo(dt: DataView): GPUShaderCreateInfo {
  const t = _b.SDL_GPUShaderCreateInfo.read(dt);
  return {
    code_size: t.code_size, /** size_t */
    code: Deno.UnsafePointer.create(t.code), /** const Uint8 * */
    entrypoint: _.read_cstr_v(t.entrypoint), /** const char * */
    format: t.format, /** SDL_GPUShaderFormat */
    stage: t.stage, /** SDL_GPUShaderStage */
    num_samplers: t.num_samplers, /** Uint32 */
    num_storage_textures: t.num_storage_textures, /** Uint32 */
    num_storage_buffers: t.num_storage_buffers, /** Uint32 */
    num_uniform_buffers: t.num_uniform_buffers, /** Uint32 */
    props: t.props, /** SDL_PropertiesID */
  };
}

export function write_GPUShaderCreateInfo(t: GPUShaderCreateInfo, dt: DataView) {
  _b.SDL_GPUShaderCreateInfo.write({
    code_size: t.code_size, /** size_t */
    code: Deno.UnsafePointer.value(t.code), /** const Uint8 * */
    entrypoint: _.cstr_v(t.entrypoint), /** const char * */
    format: t.format, /** SDL_GPUShaderFormat */
    stage: t.stage, /** SDL_GPUShaderStage */
    num_samplers: t.num_samplers, /** Uint32 */
    num_storage_textures: t.num_storage_textures, /** Uint32 */
    num_storage_buffers: t.num_storage_buffers, /** Uint32 */
    num_uniform_buffers: t.num_uniform_buffers, /** Uint32 */
    props: t.props, /** SDL_PropertiesID */
  }, dt);
}


/**
 * A structure specifying the parameters of a texture.
 *
 * Usage flags can be bitwise OR'd together for combinations of usages. Note
 * that certain usage combinations are invalid, for example SAMPLER and
 * GRAPHICS_STORAGE.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @sa SDL_CreateGPUTexture
 * @sa SDL_GPUTextureType
 * @sa SDL_GPUTextureFormat
 * @sa SDL_GPUTextureUsageFlags
 * @sa SDL_GPUSampleCount
 *
 * @from SDL_gpu.h:1669
 */
export interface GPUTextureCreateInfo {
  type: number; /**< SDL_GPUTextureType : The base dimensionality of the texture. */
  format: number; /**< SDL_GPUTextureFormat : The pixel format of the texture. */
  usage: number; /**< SDL_GPUTextureUsageFlags : How the texture is intended to be used by the client. */
  width: number; /**< Uint32 : The width of the texture. */
  height: number; /**< Uint32 : The height of the texture. */
  layer_count_or_depth: number; /**< Uint32 : The layer count or depth of the texture. This value is treated as a layer count on 2D array textures, and as a depth value on 3D textures. */
  num_levels: number; /**< Uint32 : The number of mip levels in the texture. */
  sample_count: number; /**< SDL_GPUSampleCount : The number of samples per texel. Only applies if the texture is used as a render target. */
  props: number; /**< SDL_PropertiesID : A properties ID for extensions. Should be 0 if no extensions are needed. */
}

export function read_GPUTextureCreateInfo(dt: DataView): GPUTextureCreateInfo {
  const t = _b.SDL_GPUTextureCreateInfo.read(dt);
  return {
    type: t.type, /** SDL_GPUTextureType */
    format: t.format, /** SDL_GPUTextureFormat */
    usage: t.usage, /** SDL_GPUTextureUsageFlags */
    width: t.width, /** Uint32 */
    height: t.height, /** Uint32 */
    layer_count_or_depth: t.layer_count_or_depth, /** Uint32 */
    num_levels: t.num_levels, /** Uint32 */
    sample_count: t.sample_count, /** SDL_GPUSampleCount */
    props: t.props, /** SDL_PropertiesID */
  };
}

export function write_GPUTextureCreateInfo(t: GPUTextureCreateInfo, dt: DataView) {
  _b.SDL_GPUTextureCreateInfo.write({
    type: t.type, /** SDL_GPUTextureType */
    format: t.format, /** SDL_GPUTextureFormat */
    usage: t.usage, /** SDL_GPUTextureUsageFlags */
    width: t.width, /** Uint32 */
    height: t.height, /** Uint32 */
    layer_count_or_depth: t.layer_count_or_depth, /** Uint32 */
    num_levels: t.num_levels, /** Uint32 */
    sample_count: t.sample_count, /** SDL_GPUSampleCount */
    props: t.props, /** SDL_PropertiesID */
  }, dt);
}


/**
 * A structure specifying the parameters of a buffer.
 *
 * Usage flags can be bitwise OR'd together for combinations of usages. Note
 * that certain combinations are invalid, for example VERTEX and INDEX.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @sa SDL_CreateGPUBuffer
 * @sa SDL_GPUBufferUsageFlags
 *
 * @from SDL_gpu.h:1694
 */
export interface GPUBufferCreateInfo {
  usage: number; /**< SDL_GPUBufferUsageFlags : How the buffer is intended to be used by the client. */
  size: number; /**< Uint32 : The size in bytes of the buffer. */
  props: number; /**< SDL_PropertiesID : A properties ID for extensions. Should be 0 if no extensions are needed. */
}

export function read_GPUBufferCreateInfo(dt: DataView): GPUBufferCreateInfo {
  const t = _b.SDL_GPUBufferCreateInfo.read(dt);
  return {
    usage: t.usage, /** SDL_GPUBufferUsageFlags */
    size: t.size, /** Uint32 */
    props: t.props, /** SDL_PropertiesID */
  };
}

export function write_GPUBufferCreateInfo(t: GPUBufferCreateInfo, dt: DataView) {
  _b.SDL_GPUBufferCreateInfo.write({
    usage: t.usage, /** SDL_GPUBufferUsageFlags */
    size: t.size, /** Uint32 */
    props: t.props, /** SDL_PropertiesID */
  }, dt);
}


/**
 * A structure specifying the parameters of a transfer buffer.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @sa SDL_CreateGPUTransferBuffer
 *
 * @from SDL_gpu.h:1709
 */
export interface GPUTransferBufferCreateInfo {
  usage: number; /**< SDL_GPUTransferBufferUsage : How the transfer buffer is intended to be used by the client. */
  size: number; /**< Uint32 : The size in bytes of the transfer buffer. */
  props: number; /**< SDL_PropertiesID : A properties ID for extensions. Should be 0 if no extensions are needed. */
}

export function read_GPUTransferBufferCreateInfo(dt: DataView): GPUTransferBufferCreateInfo {
  const t = _b.SDL_GPUTransferBufferCreateInfo.read(dt);
  return {
    usage: t.usage, /** SDL_GPUTransferBufferUsage */
    size: t.size, /** Uint32 */
    props: t.props, /** SDL_PropertiesID */
  };
}

export function write_GPUTransferBufferCreateInfo(t: GPUTransferBufferCreateInfo, dt: DataView) {
  _b.SDL_GPUTransferBufferCreateInfo.write({
    usage: t.usage, /** SDL_GPUTransferBufferUsage */
    size: t.size, /** Uint32 */
    props: t.props, /** SDL_PropertiesID */
  }, dt);
}


/**
 * A structure specifying the parameters of the graphics pipeline rasterizer
 * state.
 *
 * Note that SDL_GPU_FILLMODE_LINE is not supported on many Android devices.
 * For those devices, the fill mode will automatically fall back to FILL.
 *
 * Also note that the D3D12 driver will enable depth clamping even if
 * enable_depth_clip is true. If you need this clamp+clip behavior, consider
 * enabling depth clip and then manually clamping depth in your fragment
 * shaders on Metal and Vulkan.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @sa SDL_GPUGraphicsPipelineCreateInfo
 *
 * @from SDL_gpu.h:1735
 */
export interface GPURasterizerState {
  fill_mode: number; /**< SDL_GPUFillMode : Whether polygons will be filled in or drawn as lines. */
  cull_mode: number; /**< SDL_GPUCullMode : The facing direction in which triangles will be culled. */
  front_face: number; /**< SDL_GPUFrontFace : The vertex winding that will cause a triangle to be determined as front-facing. */
  depth_bias_constant_factor: number; /**< float : A scalar factor controlling the depth value added to each fragment. */
  depth_bias_clamp: number; /**< float : The maximum depth bias of a fragment. */
  depth_bias_slope_factor: number; /**< float : A scalar factor applied to a fragment's slope in depth calculations. */
  enable_depth_bias: boolean; /**< bool : true to bias fragment depth values. */
  enable_depth_clip: boolean; /**< bool : true to enable depth clip, false to enable depth clamp. */
  padding1: number; /* Uint8 */
  padding2: number; /* Uint8 */
}

export function read_GPURasterizerState(dt: DataView): GPURasterizerState {
  const t = _b.SDL_GPURasterizerState.read(dt);
  return {
    fill_mode: t.fill_mode, /** SDL_GPUFillMode */
    cull_mode: t.cull_mode, /** SDL_GPUCullMode */
    front_face: t.front_face, /** SDL_GPUFrontFace */
    depth_bias_constant_factor: t.depth_bias_constant_factor, /** float */
    depth_bias_clamp: t.depth_bias_clamp, /** float */
    depth_bias_slope_factor: t.depth_bias_slope_factor, /** float */
    enable_depth_bias: t.enable_depth_bias, /** bool */
    enable_depth_clip: t.enable_depth_clip, /** bool */
    padding1: t.padding1, /** Uint8 */
    padding2: t.padding2, /** Uint8 */
  };
}

export function write_GPURasterizerState(t: GPURasterizerState, dt: DataView) {
  _b.SDL_GPURasterizerState.write({
    fill_mode: t.fill_mode, /** SDL_GPUFillMode */
    cull_mode: t.cull_mode, /** SDL_GPUCullMode */
    front_face: t.front_face, /** SDL_GPUFrontFace */
    depth_bias_constant_factor: t.depth_bias_constant_factor, /** float */
    depth_bias_clamp: t.depth_bias_clamp, /** float */
    depth_bias_slope_factor: t.depth_bias_slope_factor, /** float */
    enable_depth_bias: t.enable_depth_bias, /** bool */
    enable_depth_clip: t.enable_depth_clip, /** bool */
    padding1: t.padding1, /** Uint8 */
    padding2: t.padding2, /** Uint8 */
  }, dt);
}


/**
 * A structure specifying the parameters of the graphics pipeline multisample
 * state.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @sa SDL_GPUGraphicsPipelineCreateInfo
 *
 * @from SDL_gpu.h:1757
 */
export interface GPUMultisampleState {
  sample_count: number; /**< SDL_GPUSampleCount : The number of samples to be used in rasterization. */
  sample_mask: number; /**< Uint32 : Reserved for future use. Must be set to 0. */
  enable_mask: boolean; /**< bool : Reserved for future use. Must be set to false. */
  padding1: number; /* Uint8 */
  padding2: number; /* Uint8 */
  padding3: number; /* Uint8 */
}

export function read_GPUMultisampleState(dt: DataView): GPUMultisampleState {
  const t = _b.SDL_GPUMultisampleState.read(dt);
  return {
    sample_count: t.sample_count, /** SDL_GPUSampleCount */
    sample_mask: t.sample_mask, /** Uint32 */
    enable_mask: t.enable_mask, /** bool */
    padding1: t.padding1, /** Uint8 */
    padding2: t.padding2, /** Uint8 */
    padding3: t.padding3, /** Uint8 */
  };
}

export function write_GPUMultisampleState(t: GPUMultisampleState, dt: DataView) {
  _b.SDL_GPUMultisampleState.write({
    sample_count: t.sample_count, /** SDL_GPUSampleCount */
    sample_mask: t.sample_mask, /** Uint32 */
    enable_mask: t.enable_mask, /** bool */
    padding1: t.padding1, /** Uint8 */
    padding2: t.padding2, /** Uint8 */
    padding3: t.padding3, /** Uint8 */
  }, dt);
}


/**
 * A structure specifying the parameters of the graphics pipeline depth
 * stencil state.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @sa SDL_GPUGraphicsPipelineCreateInfo
 *
 * @from SDL_gpu.h:1775
 */
export interface GPUDepthStencilState {
  compare_op: number; /**< SDL_GPUCompareOp : The comparison operator used for depth testing. */
  back_stencil_state: GPUStencilOpState; /**< SDL_GPUStencilOpState : The stencil op state for back-facing triangles. */
  front_stencil_state: GPUStencilOpState; /**< SDL_GPUStencilOpState : The stencil op state for front-facing triangles. */
  compare_mask: number; /**< Uint8 : Selects the bits of the stencil values participating in the stencil test. */
  write_mask: number; /**< Uint8 : Selects the bits of the stencil values updated by the stencil test. */
  enable_depth_test: boolean; /**< bool : true enables the depth test. */
  enable_depth_write: boolean; /**< bool : true enables depth writes. Depth writes are always disabled when enable_depth_test is false. */
  enable_stencil_test: boolean; /**< bool : true enables the stencil test. */
  padding1: number; /* Uint8 */
  padding2: number; /* Uint8 */
  padding3: number; /* Uint8 */
}

export function read_GPUDepthStencilState(dt: DataView): GPUDepthStencilState {
  const t = _b.SDL_GPUDepthStencilState.read(dt);
  return {
    compare_op: t.compare_op, /** SDL_GPUCompareOp */
    back_stencil_state: t.back_stencil_state, /** SDL_GPUStencilOpState */
    front_stencil_state: t.front_stencil_state, /** SDL_GPUStencilOpState */
    compare_mask: t.compare_mask, /** Uint8 */
    write_mask: t.write_mask, /** Uint8 */
    enable_depth_test: t.enable_depth_test, /** bool */
    enable_depth_write: t.enable_depth_write, /** bool */
    enable_stencil_test: t.enable_stencil_test, /** bool */
    padding1: t.padding1, /** Uint8 */
    padding2: t.padding2, /** Uint8 */
    padding3: t.padding3, /** Uint8 */
  };
}

export function write_GPUDepthStencilState(t: GPUDepthStencilState, dt: DataView) {
  _b.SDL_GPUDepthStencilState.write({
    compare_op: t.compare_op, /** SDL_GPUCompareOp */
    back_stencil_state: t.back_stencil_state, /** SDL_GPUStencilOpState */
    front_stencil_state: t.front_stencil_state, /** SDL_GPUStencilOpState */
    compare_mask: t.compare_mask, /** Uint8 */
    write_mask: t.write_mask, /** Uint8 */
    enable_depth_test: t.enable_depth_test, /** bool */
    enable_depth_write: t.enable_depth_write, /** bool */
    enable_stencil_test: t.enable_stencil_test, /** bool */
    padding1: t.padding1, /** Uint8 */
    padding2: t.padding2, /** Uint8 */
    padding3: t.padding3, /** Uint8 */
  }, dt);
}


/**
 * A structure specifying the parameters of color targets used in a graphics
 * pipeline.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @sa SDL_GPUGraphicsPipelineTargetInfo
 *
 * @from SDL_gpu.h:1798
 */
export interface GPUColorTargetDescription {
  format: number; /**< SDL_GPUTextureFormat : The pixel format of the texture to be used as a color target. */
  blend_state: GPUColorTargetBlendState; /**< SDL_GPUColorTargetBlendState : The blend state to be used for the color target. */
}

export function read_GPUColorTargetDescription(dt: DataView): GPUColorTargetDescription {
  const t = _b.SDL_GPUColorTargetDescription.read(dt);
  return {
    format: t.format, /** SDL_GPUTextureFormat */
    blend_state: t.blend_state, /** SDL_GPUColorTargetBlendState */
  };
}

export function write_GPUColorTargetDescription(t: GPUColorTargetDescription, dt: DataView) {
  _b.SDL_GPUColorTargetDescription.write({
    format: t.format, /** SDL_GPUTextureFormat */
    blend_state: t.blend_state, /** SDL_GPUColorTargetBlendState */
  }, dt);
}


/**
 * A structure specifying the descriptions of render targets used in a
 * graphics pipeline.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @sa SDL_GPUGraphicsPipelineCreateInfo
 * @sa SDL_GPUColorTargetDescription
 * @sa SDL_GPUTextureFormat
 *
 * @from SDL_gpu.h:1814
 */
export interface GPUGraphicsPipelineTargetInfo {
  color_target_descriptions: Deno.PointerValue; /**< const SDL_GPUColorTargetDescription * : A pointer to an array of color target descriptions. */
  num_color_targets: number; /**< Uint32 : The number of color target descriptions in the above array. */
  depth_stencil_format: number; /**< SDL_GPUTextureFormat : The pixel format of the depth-stencil target. Ignored if has_depth_stencil_target is false. */
  has_depth_stencil_target: boolean; /**< bool : true specifies that the pipeline uses a depth-stencil target. */
  padding1: number; /* Uint8 */
  padding2: number; /* Uint8 */
  padding3: number; /* Uint8 */
}

export function read_GPUGraphicsPipelineTargetInfo(dt: DataView): GPUGraphicsPipelineTargetInfo {
  const t = _b.SDL_GPUGraphicsPipelineTargetInfo.read(dt);
  return _read_GPUGraphicsPipelineTargetInfo(t);
}
function _read_GPUGraphicsPipelineTargetInfo(t: ReturnType<typeof _b.SDL_GPUGraphicsPipelineTargetInfo.read>): GPUGraphicsPipelineTargetInfo {
  return {
    color_target_descriptions: Deno.UnsafePointer.create(t.color_target_descriptions), /** const SDL_GPUColorTargetDescription * */
    num_color_targets: t.num_color_targets, /** Uint32 */
    depth_stencil_format: t.depth_stencil_format, /** SDL_GPUTextureFormat */
    has_depth_stencil_target: t.has_depth_stencil_target, /** bool */
    padding1: t.padding1, /** Uint8 */
    padding2: t.padding2, /** Uint8 */
    padding3: t.padding3, /** Uint8 */
  };
}

export function write_GPUGraphicsPipelineTargetInfo(t: GPUGraphicsPipelineTargetInfo, dt: DataView) {
  _b.SDL_GPUGraphicsPipelineTargetInfo.write(_write_GPUGraphicsPipelineTargetInfo(t), dt);
}
export function _write_GPUGraphicsPipelineTargetInfo(t: GPUGraphicsPipelineTargetInfo): ReturnType<typeof _b.SDL_GPUGraphicsPipelineTargetInfo.read> {
  return {
    color_target_descriptions: Deno.UnsafePointer.value(t.color_target_descriptions), /** const SDL_GPUColorTargetDescription * */
    num_color_targets: t.num_color_targets, /** Uint32 */
    depth_stencil_format: t.depth_stencil_format, /** SDL_GPUTextureFormat */
    has_depth_stencil_target: t.has_depth_stencil_target, /** bool */
    padding1: t.padding1, /** Uint8 */
    padding2: t.padding2, /** Uint8 */
    padding3: t.padding3, /** Uint8 */
  };
}


/**
 * A structure specifying the parameters of a graphics pipeline state.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @sa SDL_CreateGPUGraphicsPipeline
 * @sa SDL_GPUShader
 * @sa SDL_GPUVertexInputState
 * @sa SDL_GPUPrimitiveType
 * @sa SDL_GPURasterizerState
 * @sa SDL_GPUMultisampleState
 * @sa SDL_GPUDepthStencilState
 * @sa SDL_GPUGraphicsPipelineTargetInfo
 *
 * @from SDL_gpu.h:1839
 */
export interface GPUGraphicsPipelineCreateInfo {
  vertex_shader: Deno.PointerValue; /**< SDL_GPUShader * : The vertex shader used by the graphics pipeline. */
  fragment_shader: Deno.PointerValue; /**< SDL_GPUShader * : The fragment shader used by the graphics pipeline. */
  vertex_input_state: GPUVertexInputState; /**< SDL_GPUVertexInputState : The vertex layout of the graphics pipeline. */
  primitive_type: number; /**< SDL_GPUPrimitiveType : The primitive topology of the graphics pipeline. */
  rasterizer_state: GPURasterizerState; /**< SDL_GPURasterizerState : The rasterizer state of the graphics pipeline. */
  multisample_state: GPUMultisampleState; /**< SDL_GPUMultisampleState : The multisample state of the graphics pipeline. */
  depth_stencil_state: GPUDepthStencilState; /**< SDL_GPUDepthStencilState : The depth-stencil state of the graphics pipeline. */
  target_info: GPUGraphicsPipelineTargetInfo; /**< SDL_GPUGraphicsPipelineTargetInfo : Formats and blend modes for the render targets of the graphics pipeline. */
  props: number; /**< SDL_PropertiesID : A properties ID for extensions. Should be 0 if no extensions are needed. */
}

export function read_GPUGraphicsPipelineCreateInfo(dt: DataView): GPUGraphicsPipelineCreateInfo {
  const t = _b.SDL_GPUGraphicsPipelineCreateInfo.read(dt);
  return {
    vertex_shader: Deno.UnsafePointer.create(t.vertex_shader), /** SDL_GPUShader * */
    fragment_shader: Deno.UnsafePointer.create(t.fragment_shader), /** SDL_GPUShader * */
    vertex_input_state: _read_GPUVertexInputState(t.vertex_input_state), /** SDL_GPUVertexInputState */
    primitive_type: t.primitive_type, /** SDL_GPUPrimitiveType */
    rasterizer_state: t.rasterizer_state, /** SDL_GPURasterizerState */
    multisample_state: t.multisample_state, /** SDL_GPUMultisampleState */
    depth_stencil_state: t.depth_stencil_state, /** SDL_GPUDepthStencilState */
    target_info: _read_GPUGraphicsPipelineTargetInfo(t.target_info), /** SDL_GPUGraphicsPipelineTargetInfo */
    props: t.props, /** SDL_PropertiesID */
  };
}

export function write_GPUGraphicsPipelineCreateInfo(t: GPUGraphicsPipelineCreateInfo, dt: DataView) {
  _b.SDL_GPUGraphicsPipelineCreateInfo.write({
    vertex_shader: Deno.UnsafePointer.value(t.vertex_shader), /** SDL_GPUShader * */
    fragment_shader: Deno.UnsafePointer.value(t.fragment_shader), /** SDL_GPUShader * */
    vertex_input_state: _write_GPUVertexInputState(t.vertex_input_state), /** SDL_GPUVertexInputState */
    primitive_type: t.primitive_type, /** SDL_GPUPrimitiveType */
    rasterizer_state: t.rasterizer_state, /** SDL_GPURasterizerState */
    multisample_state: t.multisample_state, /** SDL_GPUMultisampleState */
    depth_stencil_state: t.depth_stencil_state, /** SDL_GPUDepthStencilState */
    target_info: _write_GPUGraphicsPipelineTargetInfo(t.target_info), /** SDL_GPUGraphicsPipelineTargetInfo */
    props: t.props, /** SDL_PropertiesID */
  }, dt);
}


/**
 * A structure specifying the parameters of a compute pipeline state.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @sa SDL_CreateGPUComputePipeline
 * @sa SDL_GPUShaderFormat
 *
 * @from SDL_gpu.h:1861
 */
export interface GPUComputePipelineCreateInfo {
  code_size: bigint; /**< size_t : The size in bytes of the compute shader code pointed to. */
  code: Deno.PointerValue; /**< const Uint8 * : A pointer to compute shader code. */
  entrypoint: string; /**< const char * : A pointer to a null-terminated UTF-8 string specifying the entry point function name for the shader. */
  format: number; /**< SDL_GPUShaderFormat : The format of the compute shader code. */
  num_samplers: number; /**< Uint32 : The number of samplers defined in the shader. */
  num_readonly_storage_textures: number; /**< Uint32 : The number of readonly storage textures defined in the shader. */
  num_readonly_storage_buffers: number; /**< Uint32 : The number of readonly storage buffers defined in the shader. */
  num_readwrite_storage_textures: number; /**< Uint32 : The number of read-write storage textures defined in the shader. */
  num_readwrite_storage_buffers: number; /**< Uint32 : The number of read-write storage buffers defined in the shader. */
  num_uniform_buffers: number; /**< Uint32 : The number of uniform buffers defined in the shader. */
  threadcount_x: number; /**< Uint32 : The number of threads in the X dimension. This should match the value in the shader. */
  threadcount_y: number; /**< Uint32 : The number of threads in the Y dimension. This should match the value in the shader. */
  threadcount_z: number; /**< Uint32 : The number of threads in the Z dimension. This should match the value in the shader. */
  props: number; /**< SDL_PropertiesID : A properties ID for extensions. Should be 0 if no extensions are needed. */
}

export function read_GPUComputePipelineCreateInfo(dt: DataView): GPUComputePipelineCreateInfo {
  const t = _b.SDL_GPUComputePipelineCreateInfo.read(dt);
  return {
    code_size: t.code_size, /** size_t */
    code: Deno.UnsafePointer.create(t.code), /** const Uint8 * */
    entrypoint: _.read_cstr_v(t.entrypoint), /** const char * */
    format: t.format, /** SDL_GPUShaderFormat */
    num_samplers: t.num_samplers, /** Uint32 */
    num_readonly_storage_textures: t.num_readonly_storage_textures, /** Uint32 */
    num_readonly_storage_buffers: t.num_readonly_storage_buffers, /** Uint32 */
    num_readwrite_storage_textures: t.num_readwrite_storage_textures, /** Uint32 */
    num_readwrite_storage_buffers: t.num_readwrite_storage_buffers, /** Uint32 */
    num_uniform_buffers: t.num_uniform_buffers, /** Uint32 */
    threadcount_x: t.threadcount_x, /** Uint32 */
    threadcount_y: t.threadcount_y, /** Uint32 */
    threadcount_z: t.threadcount_z, /** Uint32 */
    props: t.props, /** SDL_PropertiesID */
  };
}

export function write_GPUComputePipelineCreateInfo(t: GPUComputePipelineCreateInfo, dt: DataView) {
  _b.SDL_GPUComputePipelineCreateInfo.write({
    code_size: t.code_size, /** size_t */
    code: Deno.UnsafePointer.value(t.code), /** const Uint8 * */
    entrypoint: _.cstr_v(t.entrypoint), /** const char * */
    format: t.format, /** SDL_GPUShaderFormat */
    num_samplers: t.num_samplers, /** Uint32 */
    num_readonly_storage_textures: t.num_readonly_storage_textures, /** Uint32 */
    num_readonly_storage_buffers: t.num_readonly_storage_buffers, /** Uint32 */
    num_readwrite_storage_textures: t.num_readwrite_storage_textures, /** Uint32 */
    num_readwrite_storage_buffers: t.num_readwrite_storage_buffers, /** Uint32 */
    num_uniform_buffers: t.num_uniform_buffers, /** Uint32 */
    threadcount_x: t.threadcount_x, /** Uint32 */
    threadcount_y: t.threadcount_y, /** Uint32 */
    threadcount_z: t.threadcount_z, /** Uint32 */
    props: t.props, /** SDL_PropertiesID */
  }, dt);
}


/**
 * A structure specifying the parameters of a color target used by a render
 * pass.
 *
 * The load_op field determines what is done with the texture at the beginning
 * of the render pass.
 *
 * - LOAD: Loads the data currently in the texture. Not recommended for
 *   multisample textures as it requires significant memory bandwidth.
 * - CLEAR: Clears the texture to a single color.
 * - DONT_CARE: The driver will do whatever it wants with the texture memory.
 *   This is a good option if you know that every single pixel will be touched
 *   in the render pass.
 *
 * The store_op field determines what is done with the color results of the
 * render pass.
 *
 * - STORE: Stores the results of the render pass in the texture. Not
 *   recommended for multisample textures as it requires significant memory
 *   bandwidth.
 * - DONT_CARE: The driver will do whatever it wants with the texture memory.
 *   This is often a good option for depth/stencil textures.
 * - RESOLVE: Resolves a multisample texture into resolve_texture, which must
 *   have a sample count of 1. Then the driver may discard the multisample
 *   texture memory. This is the most performant method of resolving a
 *   multisample target.
 * - RESOLVE_AND_STORE: Resolves a multisample texture into the
 *   resolve_texture, which must have a sample count of 1. Then the driver
 *   stores the multisample texture's contents. Not recommended as it requires
 *   significant memory bandwidth.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @sa SDL_BeginGPURenderPass
 *
 * @from SDL_gpu.h:1915
 */
export interface GPUColorTargetInfo {
  texture: Deno.PointerValue; /**< SDL_GPUTexture * : The texture that will be used as a color target by a render pass. */
  mip_level: number; /**< Uint32 : The mip level to use as a color target. */
  layer_or_depth_plane: number; /**< Uint32 : The layer index or depth plane to use as a color target. This value is treated as a layer index on 2D array and cube textures, and as a depth plane on 3D textures. */
  clear_color: FColor; /**< SDL_FColor : The color to clear the color target to at the start of the render pass. Ignored if SDL_GPU_LOADOP_CLEAR is not used. */
  load_op: number; /**< SDL_GPULoadOp : What is done with the contents of the color target at the beginning of the render pass. */
  store_op: number; /**< SDL_GPUStoreOp : What is done with the results of the render pass. */
  resolve_texture: Deno.PointerValue; /**< SDL_GPUTexture * : The texture that will receive the results of a multisample resolve operation. Ignored if a RESOLVE* store_op is not used. */
  resolve_mip_level: number; /**< Uint32 : The mip level of the resolve texture to use for the resolve operation. Ignored if a RESOLVE* store_op is not used. */
  resolve_layer: number; /**< Uint32 : The layer index of the resolve texture to use for the resolve operation. Ignored if a RESOLVE* store_op is not used. */
  cycle: boolean; /**< bool : true cycles the texture if the texture is bound and load_op is not LOAD */
  cycle_resolve_texture: boolean; /**< bool : true cycles the resolve texture if the resolve texture is bound. Ignored if a RESOLVE* store_op is not used. */
  padding1: number; /* Uint8 */
  padding2: number; /* Uint8 */
}

export function read_GPUColorTargetInfo(dt: DataView): GPUColorTargetInfo {
  const t = _b.SDL_GPUColorTargetInfo.read(dt);
  return {
    texture: Deno.UnsafePointer.create(t.texture), /** SDL_GPUTexture * */
    mip_level: t.mip_level, /** Uint32 */
    layer_or_depth_plane: t.layer_or_depth_plane, /** Uint32 */
    clear_color: t.clear_color, /** SDL_FColor */
    load_op: t.load_op, /** SDL_GPULoadOp */
    store_op: t.store_op, /** SDL_GPUStoreOp */
    resolve_texture: Deno.UnsafePointer.create(t.resolve_texture), /** SDL_GPUTexture * */
    resolve_mip_level: t.resolve_mip_level, /** Uint32 */
    resolve_layer: t.resolve_layer, /** Uint32 */
    cycle: t.cycle, /** bool */
    cycle_resolve_texture: t.cycle_resolve_texture, /** bool */
    padding1: t.padding1, /** Uint8 */
    padding2: t.padding2, /** Uint8 */
  };
}

export function write_GPUColorTargetInfo(t: GPUColorTargetInfo, dt: DataView) {
  _b.SDL_GPUColorTargetInfo.write({
    texture: Deno.UnsafePointer.value(t.texture), /** SDL_GPUTexture * */
    mip_level: t.mip_level, /** Uint32 */
    layer_or_depth_plane: t.layer_or_depth_plane, /** Uint32 */
    clear_color: t.clear_color, /** SDL_FColor */
    load_op: t.load_op, /** SDL_GPULoadOp */
    store_op: t.store_op, /** SDL_GPUStoreOp */
    resolve_texture: Deno.UnsafePointer.value(t.resolve_texture), /** SDL_GPUTexture * */
    resolve_mip_level: t.resolve_mip_level, /** Uint32 */
    resolve_layer: t.resolve_layer, /** Uint32 */
    cycle: t.cycle, /** bool */
    cycle_resolve_texture: t.cycle_resolve_texture, /** bool */
    padding1: t.padding1, /** Uint8 */
    padding2: t.padding2, /** Uint8 */
  }, dt);
}


/**
 * A structure specifying the parameters of a depth-stencil target used by a
 * render pass.
 *
 * The load_op field determines what is done with the depth contents of the
 * texture at the beginning of the render pass.
 *
 * - LOAD: Loads the depth values currently in the texture.
 * - CLEAR: Clears the texture to a single depth.
 * - DONT_CARE: The driver will do whatever it wants with the memory. This is
 *   a good option if you know that every single pixel will be touched in the
 *   render pass.
 *
 * The store_op field determines what is done with the depth results of the
 * render pass.
 *
 * - STORE: Stores the depth results in the texture.
 * - DONT_CARE: The driver will do whatever it wants with the depth results.
 *   This is often a good option for depth/stencil textures that don't need to
 *   be reused again.
 *
 * The stencil_load_op field determines what is done with the stencil contents
 * of the texture at the beginning of the render pass.
 *
 * - LOAD: Loads the stencil values currently in the texture.
 * - CLEAR: Clears the stencil values to a single value.
 * - DONT_CARE: The driver will do whatever it wants with the memory. This is
 *   a good option if you know that every single pixel will be touched in the
 *   render pass.
 *
 * The stencil_store_op field determines what is done with the stencil results
 * of the render pass.
 *
 * - STORE: Stores the stencil results in the texture.
 * - DONT_CARE: The driver will do whatever it wants with the stencil results.
 *   This is often a good option for depth/stencil textures that don't need to
 *   be reused again.
 *
 * Note that depth/stencil targets do not support multisample resolves.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @sa SDL_BeginGPURenderPass
 *
 * @from SDL_gpu.h:1976
 */
export interface GPUDepthStencilTargetInfo {
  texture: Deno.PointerValue; /**< SDL_GPUTexture * : The texture that will be used as the depth stencil target by the render pass. */
  clear_depth: number; /**< float : The value to clear the depth component to at the beginning of the render pass. Ignored if SDL_GPU_LOADOP_CLEAR is not used. */
  load_op: number; /**< SDL_GPULoadOp : What is done with the depth contents at the beginning of the render pass. */
  store_op: number; /**< SDL_GPUStoreOp : What is done with the depth results of the render pass. */
  stencil_load_op: number; /**< SDL_GPULoadOp : What is done with the stencil contents at the beginning of the render pass. */
  stencil_store_op: number; /**< SDL_GPUStoreOp : What is done with the stencil results of the render pass. */
  cycle: boolean; /**< bool : true cycles the texture if the texture is bound and any load ops are not LOAD */
  clear_stencil: number; /**< Uint8 : The value to clear the stencil component to at the beginning of the render pass. Ignored if SDL_GPU_LOADOP_CLEAR is not used. */
  padding1: number; /* Uint8 */
  padding2: number; /* Uint8 */
}

export function read_GPUDepthStencilTargetInfo(dt: DataView): GPUDepthStencilTargetInfo {
  const t = _b.SDL_GPUDepthStencilTargetInfo.read(dt);
  return {
    texture: Deno.UnsafePointer.create(t.texture), /** SDL_GPUTexture * */
    clear_depth: t.clear_depth, /** float */
    load_op: t.load_op, /** SDL_GPULoadOp */
    store_op: t.store_op, /** SDL_GPUStoreOp */
    stencil_load_op: t.stencil_load_op, /** SDL_GPULoadOp */
    stencil_store_op: t.stencil_store_op, /** SDL_GPUStoreOp */
    cycle: t.cycle, /** bool */
    clear_stencil: t.clear_stencil, /** Uint8 */
    padding1: t.padding1, /** Uint8 */
    padding2: t.padding2, /** Uint8 */
  };
}

export function write_GPUDepthStencilTargetInfo(t: GPUDepthStencilTargetInfo, dt: DataView) {
  _b.SDL_GPUDepthStencilTargetInfo.write({
    texture: Deno.UnsafePointer.value(t.texture), /** SDL_GPUTexture * */
    clear_depth: t.clear_depth, /** float */
    load_op: t.load_op, /** SDL_GPULoadOp */
    store_op: t.store_op, /** SDL_GPUStoreOp */
    stencil_load_op: t.stencil_load_op, /** SDL_GPULoadOp */
    stencil_store_op: t.stencil_store_op, /** SDL_GPUStoreOp */
    cycle: t.cycle, /** bool */
    clear_stencil: t.clear_stencil, /** Uint8 */
    padding1: t.padding1, /** Uint8 */
    padding2: t.padding2, /** Uint8 */
  }, dt);
}


/**
 * A structure containing parameters for a blit command.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @sa SDL_BlitGPUTexture
 *
 * @from SDL_gpu.h:1997
 */
export interface GPUBlitInfo {
  source: GPUBlitRegion; /**< SDL_GPUBlitRegion : The source region for the blit. */
  destination: GPUBlitRegion; /**< SDL_GPUBlitRegion : The destination region for the blit. */
  load_op: number; /**< SDL_GPULoadOp : What is done with the contents of the destination before the blit. */
  clear_color: FColor; /**< SDL_FColor : The color to clear the destination region to before the blit. Ignored if load_op is not SDL_GPU_LOADOP_CLEAR. */
  flip_mode: number; /**< SDL_FlipMode : The flip mode for the source region. */
  filter: number; /**< SDL_GPUFilter : The filter mode used when blitting. */
  cycle: boolean; /**< bool : true cycles the destination texture if it is already bound. */
  padding1: number; /* Uint8 */
  padding2: number; /* Uint8 */
  padding3: number; /* Uint8 */
}

export function read_GPUBlitInfo(dt: DataView): GPUBlitInfo {
  const t = _b.SDL_GPUBlitInfo.read(dt);
  return {
    source: _read_GPUBlitRegion(t.source), /** SDL_GPUBlitRegion */
    destination: _read_GPUBlitRegion(t.destination), /** SDL_GPUBlitRegion */
    load_op: t.load_op, /** SDL_GPULoadOp */
    clear_color: t.clear_color, /** SDL_FColor */
    flip_mode: t.flip_mode, /** SDL_FlipMode */
    filter: t.filter, /** SDL_GPUFilter */
    cycle: t.cycle, /** bool */
    padding1: t.padding1, /** Uint8 */
    padding2: t.padding2, /** Uint8 */
    padding3: t.padding3, /** Uint8 */
  };
}

export function write_GPUBlitInfo(t: GPUBlitInfo, dt: DataView) {
  _b.SDL_GPUBlitInfo.write({
    source: _write_GPUBlitRegion(t.source), /** SDL_GPUBlitRegion */
    destination: _write_GPUBlitRegion(t.destination), /** SDL_GPUBlitRegion */
    load_op: t.load_op, /** SDL_GPULoadOp */
    clear_color: t.clear_color, /** SDL_FColor */
    flip_mode: t.flip_mode, /** SDL_FlipMode */
    filter: t.filter, /** SDL_GPUFilter */
    cycle: t.cycle, /** bool */
    padding1: t.padding1, /** Uint8 */
    padding2: t.padding2, /** Uint8 */
    padding3: t.padding3, /** Uint8 */
  }, dt);
}


/**
 * A structure specifying parameters in a buffer binding call.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @sa SDL_BindGPUVertexBuffers
 * @sa SDL_BindGPUIndexBuffer
 *
 * @from SDL_gpu.h:2020
 */
export interface GPUBufferBinding {
  buffer: Deno.PointerValue; /**< SDL_GPUBuffer * : The buffer to bind. Must have been created with SDL_GPU_BUFFERUSAGE_VERTEX for SDL_BindGPUVertexBuffers, or SDL_GPU_BUFFERUSAGE_INDEX for SDL_BindGPUIndexBuffer. */
  offset: number; /**< Uint32 : The starting byte of the data to bind in the buffer. */
}

export function read_GPUBufferBinding(dt: DataView): GPUBufferBinding {
  const t = _b.SDL_GPUBufferBinding.read(dt);
  return {
    buffer: Deno.UnsafePointer.create(t.buffer), /** SDL_GPUBuffer * */
    offset: t.offset, /** Uint32 */
  };
}

export function write_GPUBufferBinding(t: GPUBufferBinding, dt: DataView) {
  _b.SDL_GPUBufferBinding.write({
    buffer: Deno.UnsafePointer.value(t.buffer), /** SDL_GPUBuffer * */
    offset: t.offset, /** Uint32 */
  }, dt);
}


/**
 * A structure specifying parameters in a sampler binding call.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @sa SDL_BindGPUVertexSamplers
 * @sa SDL_BindGPUFragmentSamplers
 *
 * @from SDL_gpu.h:2034
 */
export interface GPUTextureSamplerBinding {
  texture: Deno.PointerValue; /**< SDL_GPUTexture * : The texture to bind. Must have been created with SDL_GPU_TEXTUREUSAGE_SAMPLER. */
  sampler: Deno.PointerValue; /**< SDL_GPUSampler * : The sampler to bind. */
}

export function read_GPUTextureSamplerBinding(dt: DataView): GPUTextureSamplerBinding {
  const t = _b.SDL_GPUTextureSamplerBinding.read(dt);
  return {
    texture: Deno.UnsafePointer.create(t.texture), /** SDL_GPUTexture * */
    sampler: Deno.UnsafePointer.create(t.sampler), /** SDL_GPUSampler * */
  };
}

export function write_GPUTextureSamplerBinding(t: GPUTextureSamplerBinding, dt: DataView) {
  _b.SDL_GPUTextureSamplerBinding.write({
    texture: Deno.UnsafePointer.value(t.texture), /** SDL_GPUTexture * */
    sampler: Deno.UnsafePointer.value(t.sampler), /** SDL_GPUSampler * */
  }, dt);
}


/**
 * A structure specifying parameters related to binding buffers in a compute
 * pass.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @sa SDL_BeginGPUComputePass
 *
 * @from SDL_gpu.h:2048
 */
export interface GPUStorageBufferReadWriteBinding {
  buffer: Deno.PointerValue; /**< SDL_GPUBuffer * : The buffer to bind. Must have been created with SDL_GPU_BUFFERUSAGE_COMPUTE_STORAGE_WRITE. */
  cycle: boolean; /**< bool : true cycles the buffer if it is already bound. */
  padding1: number; /* Uint8 */
  padding2: number; /* Uint8 */
  padding3: number; /* Uint8 */
}

export function read_GPUStorageBufferReadWriteBinding(dt: DataView): GPUStorageBufferReadWriteBinding {
  const t = _b.SDL_GPUStorageBufferReadWriteBinding.read(dt);
  return {
    buffer: Deno.UnsafePointer.create(t.buffer), /** SDL_GPUBuffer * */
    cycle: t.cycle, /** bool */
    padding1: t.padding1, /** Uint8 */
    padding2: t.padding2, /** Uint8 */
    padding3: t.padding3, /** Uint8 */
  };
}

export function write_GPUStorageBufferReadWriteBinding(t: GPUStorageBufferReadWriteBinding, dt: DataView) {
  _b.SDL_GPUStorageBufferReadWriteBinding.write({
    buffer: Deno.UnsafePointer.value(t.buffer), /** SDL_GPUBuffer * */
    cycle: t.cycle, /** bool */
    padding1: t.padding1, /** Uint8 */
    padding2: t.padding2, /** Uint8 */
    padding3: t.padding3, /** Uint8 */
  }, dt);
}


/**
 * A structure specifying parameters related to binding textures in a compute
 * pass.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @sa SDL_BeginGPUComputePass
 *
 * @from SDL_gpu.h:2065
 */
export interface GPUStorageTextureReadWriteBinding {
  texture: Deno.PointerValue; /**< SDL_GPUTexture * : The texture to bind. Must have been created with SDL_GPU_TEXTUREUSAGE_COMPUTE_STORAGE_WRITE or SDL_GPU_TEXTUREUSAGE_COMPUTE_STORAGE_SIMULTANEOUS_READ_WRITE. */
  mip_level: number; /**< Uint32 : The mip level index to bind. */
  layer: number; /**< Uint32 : The layer index to bind. */
  cycle: boolean; /**< bool : true cycles the texture if it is already bound. */
  padding1: number; /* Uint8 */
  padding2: number; /* Uint8 */
  padding3: number; /* Uint8 */
}

export function read_GPUStorageTextureReadWriteBinding(dt: DataView): GPUStorageTextureReadWriteBinding {
  const t = _b.SDL_GPUStorageTextureReadWriteBinding.read(dt);
  return {
    texture: Deno.UnsafePointer.create(t.texture), /** SDL_GPUTexture * */
    mip_level: t.mip_level, /** Uint32 */
    layer: t.layer, /** Uint32 */
    cycle: t.cycle, /** bool */
    padding1: t.padding1, /** Uint8 */
    padding2: t.padding2, /** Uint8 */
    padding3: t.padding3, /** Uint8 */
  };
}

export function write_GPUStorageTextureReadWriteBinding(t: GPUStorageTextureReadWriteBinding, dt: DataView) {
  _b.SDL_GPUStorageTextureReadWriteBinding.write({
    texture: Deno.UnsafePointer.value(t.texture), /** SDL_GPUTexture * */
    mip_level: t.mip_level, /** Uint32 */
    layer: t.layer, /** Uint32 */
    cycle: t.cycle, /** bool */
    padding1: t.padding1, /** Uint8 */
    padding2: t.padding2, /** Uint8 */
    padding3: t.padding3, /** Uint8 */
  }, dt);
}


