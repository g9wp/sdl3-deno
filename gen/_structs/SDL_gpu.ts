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
 * Series X|S (GDK). Requires a GPU that supports DirectX 12 Feature Level 11_0 and
 * Resource Binding Tier 2 or above.
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

import * as _ from "@denosaurs/byte-type";
import {SDL_FColor} from "./SDL_pixels.ts";


/**
 * A structure specifying a viewport.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @sa SDL_SetGPUViewport
 *
 * @from SDL_gpu.h:1298
 */
export const SDL_GPUViewport = new _.Struct({
  x: _.f32, /**< float : The left offset of the viewport. */
  y: _.f32, /**< float : The top offset of the viewport. */
  w: _.f32, /**< float : The width of the viewport. */
  h: _.f32, /**< float : The height of the viewport. */
  min_depth: _.f32, /**< float : The minimum depth of the viewport. */
  max_depth: _.f32, /**< float : The maximum depth of the viewport. */
});



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
export const SDL_GPUTextureTransferInfo = new _.Struct({
  transfer_buffer: _.u64, /**< SDL_GPUTransferBuffer * : The transfer buffer used in the transfer operation. */
  offset: _.u32, /**< Uint32 : The starting byte of the image data in the transfer buffer. */
  pixels_per_row: _.u32, /**< Uint32 : The number of pixels from one row to the next. */
  rows_per_layer: _.u32, /**< Uint32 : The number of rows from one layer/depth-slice to the next. */
});



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
export const SDL_GPUTransferBufferLocation = new _.Struct({
  transfer_buffer: _.u64, /**< SDL_GPUTransferBuffer * : The transfer buffer used in the transfer operation. */
  offset: _.u32, /**< Uint32 : The starting byte of the buffer data in the transfer buffer. */
});



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
export const SDL_GPUTextureLocation = new _.Struct({
  texture: _.u64, /**< SDL_GPUTexture * : The texture used in the copy operation. */
  mip_level: _.u32, /**< Uint32 : The mip level index of the location. */
  layer: _.u32, /**< Uint32 : The layer index of the location. */
  x: _.u32, /**< Uint32 : The left offset of the location. */
  y: _.u32, /**< Uint32 : The top offset of the location. */
  z: _.u32, /**< Uint32 : The front offset of the location. */
});



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
export const SDL_GPUTextureRegion = new _.Struct({
  texture: _.u64, /**< SDL_GPUTexture * : The texture used in the copy operation. */
  mip_level: _.u32, /**< Uint32 : The mip level index to transfer. */
  layer: _.u32, /**< Uint32 : The layer index to transfer. */
  x: _.u32, /**< Uint32 : The left offset of the region. */
  y: _.u32, /**< Uint32 : The top offset of the region. */
  z: _.u32, /**< Uint32 : The front offset of the region. */
  w: _.u32, /**< Uint32 : The width of the region. */
  h: _.u32, /**< Uint32 : The height of the region. */
  d: _.u32, /**< Uint32 : The depth of the region. */
});



/**
 * A structure specifying a region of a texture used in the blit operation.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @sa SDL_BlitGPUTexture
 *
 * @from SDL_gpu.h:1391
 */
export const SDL_GPUBlitRegion = new _.Struct({
  texture: _.u64, /**< SDL_GPUTexture * : The texture. */
  mip_level: _.u32, /**< Uint32 : The mip level index of the region. */
  layer_or_depth_plane: _.u32, /**< Uint32 : The layer index or depth plane of the region. This value is treated as a layer index on 2D array and cube textures, and as a depth plane on 3D textures. */
  x: _.u32, /**< Uint32 : The left offset of the region. */
  y: _.u32, /**< Uint32 : The top offset of the region.  */
  w: _.u32, /**< Uint32 : The width of the region. */
  h: _.u32, /**< Uint32 : The height of the region. */
});



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
export const SDL_GPUBufferLocation = new _.Struct({
  buffer: _.u64, /**< SDL_GPUBuffer * : The buffer. */
  offset: _.u32, /**< Uint32 : The starting byte within the buffer. */
});



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
export const SDL_GPUBufferRegion = new _.Struct({
  buffer: _.u64, /**< SDL_GPUBuffer * : The buffer. */
  offset: _.u32, /**< Uint32 : The starting byte within the buffer. */
  size: _.u32, /**< Uint32 : The size in bytes of the region. */
});



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
export const SDL_GPUIndirectDrawCommand = new _.Struct({
  num_vertices: _.u32, /**< Uint32 : The number of vertices to draw. */
  num_instances: _.u32, /**< Uint32 : The number of instances to draw. */
  first_vertex: _.u32, /**< Uint32 : The index of the first vertex to draw. */
  first_instance: _.u32, /**< Uint32 : The ID of the first instance to draw. */
});



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
export const SDL_GPUIndexedIndirectDrawCommand = new _.Struct({
  num_indices: _.u32, /**< Uint32 : The number of indices to draw per instance. */
  num_instances: _.u32, /**< Uint32 : The number of instances to draw. */
  first_index: _.u32, /**< Uint32 : The base index within the index buffer. */
  vertex_offset: _.i32, /**< Sint32 : The value added to the vertex index before indexing into the vertex buffer. */
  first_instance: _.u32, /**< Uint32 : The ID of the first instance to draw. */
});



/**
 * A structure specifying the parameters of an indexed dispatch command.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @sa SDL_DispatchGPUComputeIndirect
 *
 * @from SDL_gpu.h:1486
 */
export const SDL_GPUIndirectDispatchCommand = new _.Struct({
  groupcount_x: _.u32, /**< Uint32 : The number of local workgroups to dispatch in the X dimension. */
  groupcount_y: _.u32, /**< Uint32 : The number of local workgroups to dispatch in the Y dimension. */
  groupcount_z: _.u32, /**< Uint32 : The number of local workgroups to dispatch in the Z dimension. */
});



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
export const SDL_GPUSamplerCreateInfo = new _.Struct({
  min_filter: _.u32, /**< SDL_GPUFilter : The minification filter to apply to lookups. */
  mag_filter: _.u32, /**< SDL_GPUFilter : The magnification filter to apply to lookups. */
  mipmap_mode: _.u32, /**< SDL_GPUSamplerMipmapMode : The mipmap filter to apply to lookups. */
  address_mode_u: _.u32, /**< SDL_GPUSamplerAddressMode : The addressing mode for U coordinates outside [0, 1). */
  address_mode_v: _.u32, /**< SDL_GPUSamplerAddressMode : The addressing mode for V coordinates outside [0, 1). */
  address_mode_w: _.u32, /**< SDL_GPUSamplerAddressMode : The addressing mode for W coordinates outside [0, 1). */
  mip_lod_bias: _.f32, /**< float : The bias to be added to mipmap LOD calculation. */
  max_anisotropy: _.f32, /**< float : The anisotropy value clamp used by the sampler. If enable_anisotropy is false, this is ignored. */
  compare_op: _.u32, /**< SDL_GPUCompareOp : The comparison operator to apply to fetched data before filtering. */
  min_lod: _.f32, /**< float : Clamps the minimum of the computed LOD value. */
  max_lod: _.f32, /**< float : Clamps the maximum of the computed LOD value. */
  enable_anisotropy: _.bool, /**< bool : true to enable anisotropic filtering. */
  enable_compare: _.bool, /**< bool : true to enable comparison against a reference value during lookups. */
  padding1: _.u8, /* Uint8 */
  padding2: _.u8, /* Uint8 */
  props: _.u32, /**< SDL_PropertiesID : A properties ID for extensions. Should be 0 if no extensions are needed. */
});



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
export const SDL_GPUVertexBufferDescription = new _.Struct({
  slot: _.u32, /**< Uint32 : The binding slot of the vertex buffer. */
  pitch: _.u32, /**< Uint32 : The size of a single element + the offset between elements. */
  input_rate: _.u32, /**< SDL_GPUVertexInputRate : Whether attribute addressing is a function of the vertex index or instance index. */
  instance_step_rate: _.u32, /**< Uint32 : Reserved for future use. Must be set to 0. */
});



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
export const SDL_GPUVertexAttribute = new _.Struct({
  location: _.u32, /**< Uint32 : The shader input location index. */
  buffer_slot: _.u32, /**< Uint32 : The binding slot of the associated vertex buffer. */
  format: _.u32, /**< SDL_GPUVertexElementFormat : The size and type of the attribute data. */
  offset: _.u32, /**< Uint32 : The byte offset of this attribute relative to the start of the vertex element. */
});



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
export const SDL_GPUVertexInputState = new _.Struct({
  vertex_buffer_descriptions: _.u64, /**< const SDL_GPUVertexBufferDescription * : A pointer to an array of vertex buffer descriptions. */
  num_vertex_buffers: _.u32, /**< Uint32 : The number of vertex buffer descriptions in the above array. */
  vertex_attributes: _.u64, /**< const SDL_GPUVertexAttribute * : A pointer to an array of vertex attribute descriptions. */
  num_vertex_attributes: _.u32, /**< Uint32 : The number of vertex attribute descriptions in the above array. */
});



/**
 * A structure specifying the stencil operation state of a graphics pipeline.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @sa SDL_GPUDepthStencilState
 *
 * @from SDL_gpu.h:1601
 */
export const SDL_GPUStencilOpState = new _.Struct({
  fail_op: _.u32, /**< SDL_GPUStencilOp : The action performed on samples that fail the stencil test. */
  pass_op: _.u32, /**< SDL_GPUStencilOp : The action performed on samples that pass the depth and stencil tests. */
  depth_fail_op: _.u32, /**< SDL_GPUStencilOp : The action performed on samples that pass the stencil test and fail the depth test. */
  compare_op: _.u32, /**< SDL_GPUCompareOp : The comparison operator used in the stencil test. */
});



/**
 * A structure specifying the blend state of a color target.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @sa SDL_GPUColorTargetDescription
 *
 * @from SDL_gpu.h:1616
 */
export const SDL_GPUColorTargetBlendState = new _.Struct({
  src_color_blendfactor: _.u32, /**< SDL_GPUBlendFactor : The value to be multiplied by the source RGB value. */
  dst_color_blendfactor: _.u32, /**< SDL_GPUBlendFactor : The value to be multiplied by the destination RGB value. */
  color_blend_op: _.u32, /**< SDL_GPUBlendOp : The blend operation for the RGB components. */
  src_alpha_blendfactor: _.u32, /**< SDL_GPUBlendFactor : The value to be multiplied by the source alpha. */
  dst_alpha_blendfactor: _.u32, /**< SDL_GPUBlendFactor : The value to be multiplied by the destination alpha. */
  alpha_blend_op: _.u32, /**< SDL_GPUBlendOp : The blend operation for the alpha component. */
  color_write_mask: _.u8, /**< SDL_GPUColorComponentFlags : A bitmask specifying which of the RGBA components are enabled for writing. Writes to all channels if enable_color_write_mask is false. */
  enable_blend: _.bool, /**< bool : Whether blending is enabled for the color target. */
  enable_color_write_mask: _.bool, /**< bool : Whether the color write mask is enabled. */
  padding1: _.u8, /* Uint8 */
  padding2: _.u8, /* Uint8 */
});



/**
 * A structure specifying code and metadata for creating a shader object.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @sa SDL_CreateGPUShader
 *
 * @from SDL_gpu.h:1639
 */
export const SDL_GPUShaderCreateInfo = new _.Struct({
  code_size: _.u64, /**< size_t : The size in bytes of the code pointed to. */
  code: _.u64, /**< const Uint8 * : A pointer to shader code. */
  entrypoint: _.u64, /**< const char * : A pointer to a null-terminated UTF-8 string specifying the entry point function name for the shader. */
  format: _.u32, /**< SDL_GPUShaderFormat : The format of the shader code. */
  stage: _.u32, /**< SDL_GPUShaderStage : The stage the shader program corresponds to. */
  num_samplers: _.u32, /**< Uint32 : The number of samplers defined in the shader. */
  num_storage_textures: _.u32, /**< Uint32 : The number of storage textures defined in the shader. */
  num_storage_buffers: _.u32, /**< Uint32 : The number of storage buffers defined in the shader. */
  num_uniform_buffers: _.u32, /**< Uint32 : The number of uniform buffers defined in the shader. */
  props: _.u32, /**< SDL_PropertiesID : A properties ID for extensions. Should be 0 if no extensions are needed. */
});



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
export const SDL_GPUTextureCreateInfo = new _.Struct({
  type: _.u32, /**< SDL_GPUTextureType : The base dimensionality of the texture. */
  format: _.u32, /**< SDL_GPUTextureFormat : The pixel format of the texture. */
  usage: _.u32, /**< SDL_GPUTextureUsageFlags : How the texture is intended to be used by the client. */
  width: _.u32, /**< Uint32 : The width of the texture. */
  height: _.u32, /**< Uint32 : The height of the texture. */
  layer_count_or_depth: _.u32, /**< Uint32 : The layer count or depth of the texture. This value is treated as a layer count on 2D array textures, and as a depth value on 3D textures. */
  num_levels: _.u32, /**< Uint32 : The number of mip levels in the texture. */
  sample_count: _.u32, /**< SDL_GPUSampleCount : The number of samples per texel. Only applies if the texture is used as a render target. */
  props: _.u32, /**< SDL_PropertiesID : A properties ID for extensions. Should be 0 if no extensions are needed. */
});



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
export const SDL_GPUBufferCreateInfo = new _.Struct({
  usage: _.u32, /**< SDL_GPUBufferUsageFlags : How the buffer is intended to be used by the client. */
  size: _.u32, /**< Uint32 : The size in bytes of the buffer. */
  props: _.u32, /**< SDL_PropertiesID : A properties ID for extensions. Should be 0 if no extensions are needed. */
});



/**
 * A structure specifying the parameters of a transfer buffer.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @sa SDL_CreateGPUTransferBuffer
 *
 * @from SDL_gpu.h:1709
 */
export const SDL_GPUTransferBufferCreateInfo = new _.Struct({
  usage: _.u32, /**< SDL_GPUTransferBufferUsage : How the transfer buffer is intended to be used by the client. */
  size: _.u32, /**< Uint32 : The size in bytes of the transfer buffer. */
  props: _.u32, /**< SDL_PropertiesID : A properties ID for extensions. Should be 0 if no extensions are needed. */
});



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
export const SDL_GPURasterizerState = new _.Struct({
  fill_mode: _.u32, /**< SDL_GPUFillMode : Whether polygons will be filled in or drawn as lines. */
  cull_mode: _.u32, /**< SDL_GPUCullMode : The facing direction in which triangles will be culled. */
  front_face: _.u32, /**< SDL_GPUFrontFace : The vertex winding that will cause a triangle to be determined as front-facing. */
  depth_bias_constant_factor: _.f32, /**< float : A scalar factor controlling the depth value added to each fragment. */
  depth_bias_clamp: _.f32, /**< float : The maximum depth bias of a fragment. */
  depth_bias_slope_factor: _.f32, /**< float : A scalar factor applied to a fragment's slope in depth calculations. */
  enable_depth_bias: _.bool, /**< bool : true to bias fragment depth values. */
  enable_depth_clip: _.bool, /**< bool : true to enable depth clip, false to enable depth clamp. */
  padding1: _.u8, /* Uint8 */
  padding2: _.u8, /* Uint8 */
});



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
export const SDL_GPUMultisampleState = new _.Struct({
  sample_count: _.u32, /**< SDL_GPUSampleCount : The number of samples to be used in rasterization. */
  sample_mask: _.u32, /**< Uint32 : Reserved for future use. Must be set to 0. */
  enable_mask: _.bool, /**< bool : Reserved for future use. Must be set to false. */
  padding1: _.u8, /* Uint8 */
  padding2: _.u8, /* Uint8 */
  padding3: _.u8, /* Uint8 */
});



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
export const SDL_GPUDepthStencilState = new _.Struct({
  compare_op: _.u32, /**< SDL_GPUCompareOp : The comparison operator used for depth testing. */
  back_stencil_state: SDL_GPUStencilOpState, /**< SDL_GPUStencilOpState : The stencil op state for back-facing triangles. */
  front_stencil_state: SDL_GPUStencilOpState, /**< SDL_GPUStencilOpState : The stencil op state for front-facing triangles. */
  compare_mask: _.u8, /**< Uint8 : Selects the bits of the stencil values participating in the stencil test. */
  write_mask: _.u8, /**< Uint8 : Selects the bits of the stencil values updated by the stencil test. */
  enable_depth_test: _.bool, /**< bool : true enables the depth test. */
  enable_depth_write: _.bool, /**< bool : true enables depth writes. Depth writes are always disabled when enable_depth_test is false. */
  enable_stencil_test: _.bool, /**< bool : true enables the stencil test. */
  padding1: _.u8, /* Uint8 */
  padding2: _.u8, /* Uint8 */
  padding3: _.u8, /* Uint8 */
});



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
export const SDL_GPUColorTargetDescription = new _.Struct({
  format: _.u32, /**< SDL_GPUTextureFormat : The pixel format of the texture to be used as a color target. */
  blend_state: SDL_GPUColorTargetBlendState, /**< SDL_GPUColorTargetBlendState : The blend state to be used for the color target. */
});



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
export const SDL_GPUGraphicsPipelineTargetInfo = new _.Struct({
  color_target_descriptions: _.u64, /**< const SDL_GPUColorTargetDescription * : A pointer to an array of color target descriptions. */
  num_color_targets: _.u32, /**< Uint32 : The number of color target descriptions in the above array. */
  depth_stencil_format: _.u32, /**< SDL_GPUTextureFormat : The pixel format of the depth-stencil target. Ignored if has_depth_stencil_target is false. */
  has_depth_stencil_target: _.bool, /**< bool : true specifies that the pipeline uses a depth-stencil target. */
  padding1: _.u8, /* Uint8 */
  padding2: _.u8, /* Uint8 */
  padding3: _.u8, /* Uint8 */
});



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
export const SDL_GPUGraphicsPipelineCreateInfo = new _.Struct({
  vertex_shader: _.u64, /**< SDL_GPUShader * : The vertex shader used by the graphics pipeline. */
  fragment_shader: _.u64, /**< SDL_GPUShader * : The fragment shader used by the graphics pipeline. */
  vertex_input_state: SDL_GPUVertexInputState, /**< SDL_GPUVertexInputState : The vertex layout of the graphics pipeline. */
  primitive_type: _.u32, /**< SDL_GPUPrimitiveType : The primitive topology of the graphics pipeline. */
  rasterizer_state: SDL_GPURasterizerState, /**< SDL_GPURasterizerState : The rasterizer state of the graphics pipeline. */
  multisample_state: SDL_GPUMultisampleState, /**< SDL_GPUMultisampleState : The multisample state of the graphics pipeline. */
  depth_stencil_state: SDL_GPUDepthStencilState, /**< SDL_GPUDepthStencilState : The depth-stencil state of the graphics pipeline. */
  target_info: SDL_GPUGraphicsPipelineTargetInfo, /**< SDL_GPUGraphicsPipelineTargetInfo : Formats and blend modes for the render targets of the graphics pipeline. */
  props: _.u32, /**< SDL_PropertiesID : A properties ID for extensions. Should be 0 if no extensions are needed. */
});



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
export const SDL_GPUComputePipelineCreateInfo = new _.Struct({
  code_size: _.u64, /**< size_t : The size in bytes of the compute shader code pointed to. */
  code: _.u64, /**< const Uint8 * : A pointer to compute shader code. */
  entrypoint: _.u64, /**< const char * : A pointer to a null-terminated UTF-8 string specifying the entry point function name for the shader. */
  format: _.u32, /**< SDL_GPUShaderFormat : The format of the compute shader code. */
  num_samplers: _.u32, /**< Uint32 : The number of samplers defined in the shader. */
  num_readonly_storage_textures: _.u32, /**< Uint32 : The number of readonly storage textures defined in the shader. */
  num_readonly_storage_buffers: _.u32, /**< Uint32 : The number of readonly storage buffers defined in the shader. */
  num_readwrite_storage_textures: _.u32, /**< Uint32 : The number of read-write storage textures defined in the shader. */
  num_readwrite_storage_buffers: _.u32, /**< Uint32 : The number of read-write storage buffers defined in the shader. */
  num_uniform_buffers: _.u32, /**< Uint32 : The number of uniform buffers defined in the shader. */
  threadcount_x: _.u32, /**< Uint32 : The number of threads in the X dimension. This should match the value in the shader. */
  threadcount_y: _.u32, /**< Uint32 : The number of threads in the Y dimension. This should match the value in the shader. */
  threadcount_z: _.u32, /**< Uint32 : The number of threads in the Z dimension. This should match the value in the shader. */
  props: _.u32, /**< SDL_PropertiesID : A properties ID for extensions. Should be 0 if no extensions are needed. */
});



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
export const SDL_GPUColorTargetInfo = new _.Struct({
  texture: _.u64, /**< SDL_GPUTexture * : The texture that will be used as a color target by a render pass. */
  mip_level: _.u32, /**< Uint32 : The mip level to use as a color target. */
  layer_or_depth_plane: _.u32, /**< Uint32 : The layer index or depth plane to use as a color target. This value is treated as a layer index on 2D array and cube textures, and as a depth plane on 3D textures. */
  clear_color: SDL_FColor, /**< SDL_FColor : The color to clear the color target to at the start of the render pass. Ignored if SDL_GPU_LOADOP_CLEAR is not used. */
  load_op: _.u32, /**< SDL_GPULoadOp : What is done with the contents of the color target at the beginning of the render pass. */
  store_op: _.u32, /**< SDL_GPUStoreOp : What is done with the results of the render pass. */
  resolve_texture: _.u64, /**< SDL_GPUTexture * : The texture that will receive the results of a multisample resolve operation. Ignored if a RESOLVE* store_op is not used. */
  resolve_mip_level: _.u32, /**< Uint32 : The mip level of the resolve texture to use for the resolve operation. Ignored if a RESOLVE* store_op is not used. */
  resolve_layer: _.u32, /**< Uint32 : The layer index of the resolve texture to use for the resolve operation. Ignored if a RESOLVE* store_op is not used. */
  cycle: _.bool, /**< bool : true cycles the texture if the texture is bound and load_op is not LOAD */
  cycle_resolve_texture: _.bool, /**< bool : true cycles the resolve texture if the resolve texture is bound. Ignored if a RESOLVE* store_op is not used. */
  padding1: _.u8, /* Uint8 */
  padding2: _.u8, /* Uint8 */
});



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
export const SDL_GPUDepthStencilTargetInfo = new _.Struct({
  texture: _.u64, /**< SDL_GPUTexture * : The texture that will be used as the depth stencil target by the render pass. */
  clear_depth: _.f32, /**< float : The value to clear the depth component to at the beginning of the render pass. Ignored if SDL_GPU_LOADOP_CLEAR is not used. */
  load_op: _.u32, /**< SDL_GPULoadOp : What is done with the depth contents at the beginning of the render pass. */
  store_op: _.u32, /**< SDL_GPUStoreOp : What is done with the depth results of the render pass. */
  stencil_load_op: _.u32, /**< SDL_GPULoadOp : What is done with the stencil contents at the beginning of the render pass. */
  stencil_store_op: _.u32, /**< SDL_GPUStoreOp : What is done with the stencil results of the render pass. */
  cycle: _.bool, /**< bool : true cycles the texture if the texture is bound and any load ops are not LOAD */
  clear_stencil: _.u8, /**< Uint8 : The value to clear the stencil component to at the beginning of the render pass. Ignored if SDL_GPU_LOADOP_CLEAR is not used. */
  padding1: _.u8, /* Uint8 */
  padding2: _.u8, /* Uint8 */
});



/**
 * A structure containing parameters for a blit command.
 *
 * @since This struct is available since SDL 3.2.0.
 *
 * @sa SDL_BlitGPUTexture
 *
 * @from SDL_gpu.h:1997
 */
export const SDL_GPUBlitInfo = new _.Struct({
  source: SDL_GPUBlitRegion, /**< SDL_GPUBlitRegion : The source region for the blit. */
  destination: SDL_GPUBlitRegion, /**< SDL_GPUBlitRegion : The destination region for the blit. */
  load_op: _.u32, /**< SDL_GPULoadOp : What is done with the contents of the destination before the blit. */
  clear_color: SDL_FColor, /**< SDL_FColor : The color to clear the destination region to before the blit. Ignored if load_op is not SDL_GPU_LOADOP_CLEAR. */
  flip_mode: _.u32, /**< SDL_FlipMode : The flip mode for the source region. */
  filter: _.u32, /**< SDL_GPUFilter : The filter mode used when blitting. */
  cycle: _.bool, /**< bool : true cycles the destination texture if it is already bound. */
  padding1: _.u8, /* Uint8 */
  padding2: _.u8, /* Uint8 */
  padding3: _.u8, /* Uint8 */
});



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
export const SDL_GPUBufferBinding = new _.Struct({
  buffer: _.u64, /**< SDL_GPUBuffer * : The buffer to bind. Must have been created with SDL_GPU_BUFFERUSAGE_VERTEX for SDL_BindGPUVertexBuffers, or SDL_GPU_BUFFERUSAGE_INDEX for SDL_BindGPUIndexBuffer. */
  offset: _.u32, /**< Uint32 : The starting byte of the data to bind in the buffer. */
});



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
export const SDL_GPUTextureSamplerBinding = new _.Struct({
  texture: _.u64, /**< SDL_GPUTexture * : The texture to bind. Must have been created with SDL_GPU_TEXTUREUSAGE_SAMPLER. */
  sampler: _.u64, /**< SDL_GPUSampler * : The sampler to bind. */
});



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
export const SDL_GPUStorageBufferReadWriteBinding = new _.Struct({
  buffer: _.u64, /**< SDL_GPUBuffer * : The buffer to bind. Must have been created with SDL_GPU_BUFFERUSAGE_COMPUTE_STORAGE_WRITE. */
  cycle: _.bool, /**< bool : true cycles the buffer if it is already bound. */
  padding1: _.u8, /* Uint8 */
  padding2: _.u8, /* Uint8 */
  padding3: _.u8, /* Uint8 */
});



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
export const SDL_GPUStorageTextureReadWriteBinding = new _.Struct({
  texture: _.u64, /**< SDL_GPUTexture * : The texture to bind. Must have been created with SDL_GPU_TEXTUREUSAGE_COMPUTE_STORAGE_WRITE or SDL_GPU_TEXTUREUSAGE_COMPUTE_STORAGE_SIMULTANEOUS_READ_WRITE. */
  mip_level: _.u32, /**< Uint32 : The mip level index to bind. */
  layer: _.u32, /**< Uint32 : The layer index to bind. */
  cycle: _.bool, /**< bool : true cycles the texture if it is already bound. */
  padding1: _.u8, /* Uint8 */
  padding2: _.u8, /* Uint8 */
  padding3: _.u8, /* Uint8 */
});



