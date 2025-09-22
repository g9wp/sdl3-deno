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

/**
 * @from SDL_gpu:822 SDL_GPU_TEXTUREUSAGE_
 */
export enum GPU_TEXTUREUSAGE {
  SAMPLER = (1 << 0), /**< Texture supports sampling. */
  COLOR_TARGET = (1 << 1), /**< Texture is a color render target. */
  DEPTH_STENCIL_TARGET = (1 << 2), /**< Texture is a depth stencil target. */
  GRAPHICS_STORAGE_READ = (1 << 3), /**< Texture supports storage reads in graphics stages. */
  COMPUTE_STORAGE_READ = (1 << 4), /**< Texture supports storage reads in the compute stage. */
  COMPUTE_STORAGE_WRITE = (1 << 5), /**< Texture supports storage writes in the compute stage. */
  COMPUTE_STORAGE_SIMULTANEOUS_READ_WRITE = (1 << 6), /**< Texture supports reads and writes in the same compute shader. This is NOT equivalent to READ | WRITE. */
}



/**
 * @from SDL_gpu:902 SDL_GPU_BUFFERUSAGE_
 */
export enum GPU_BUFFERUSAGE {
  VERTEX = (1 << 0), /**< Buffer is a vertex buffer. */
  INDEX = (1 << 1), /**< Buffer is an index buffer. */
  INDIRECT = (1 << 2), /**< Buffer is an indirect buffer. */
  GRAPHICS_STORAGE_READ = (1 << 3), /**< Buffer supports storage reads in graphics stages. */
  COMPUTE_STORAGE_READ = (1 << 4), /**< Buffer supports storage reads in the compute stage. */
  COMPUTE_STORAGE_WRITE = (1 << 5), /**< Buffer supports storage writes in the compute stage. */
}



/**
 * @from SDL_gpu:949 SDL_GPU_SHADERFORMAT_
 */
export enum GPU_SHADERFORMAT {
  INVALID = 0, 
  PRIVATE = (1 << 0), /**< Shaders for NDA'd platforms. */
  SPIRV = (1 << 1), /**< SPIR-V shaders for Vulkan. */
  DXBC = (1 << 2), /**< DXBC SM5_1 shaders for D3D12. */
  DXIL = (1 << 3), /**< DXIL SM6_0 shaders for D3D12. */
  MSL = (1 << 4), /**< MSL shaders for Metal. */
  METALLIB = (1 << 5), /**< Precompiled metallib shaders for Metal. */
}



/**
 * @from SDL_gpu:1177 SDL_GPU_COLORCOMPONENT_
 */
export enum GPU_COLORCOMPONENT {
  R = (1 << 0), /**< the red component */
  G = (1 << 1), /**< the green component */
  B = (1 << 2), /**< the blue component */
  A = (1 << 3), /**< the alpha component */
}



/**
 * @from SDL_gpu:2179 SDL_PROP_GPU_DEVICE_CREATE_
 */
export enum PROP_GPU_DEVICE_CREATE {
  DEBUGMODE_BOOLEAN = "SDL.gpu.device.create.debugmode", 
  PREFERLOWPOWER_BOOLEAN = "SDL.gpu.device.create.preferlowpower", 
  NAME_STRING = "SDL.gpu.device.create.name", 
  SHADERS_PRIVATE_BOOLEAN = "SDL.gpu.device.create.shaders.private", 
  SHADERS_SPIRV_BOOLEAN = "SDL.gpu.device.create.shaders.spirv", 
  SHADERS_DXBC_BOOLEAN = "SDL.gpu.device.create.shaders.dxbc", 
  SHADERS_DXIL_BOOLEAN = "SDL.gpu.device.create.shaders.dxil", 
  SHADERS_MSL_BOOLEAN = "SDL.gpu.device.create.shaders.msl", 
  SHADERS_METALLIB_BOOLEAN = "SDL.gpu.device.create.shaders.metallib", 
  D3D12_SEMANTIC_NAME_STRING = "SDL.gpu.device.create.d3d12.semantic", 
}



/**
 * @from SDL_gpu:2497 SDL_PROP_GPU_TEXTURE_CREATE_
 */
export enum PROP_GPU_TEXTURE_CREATE {
  D3D12_CLEAR_R_FLOAT = "SDL.gpu.texture.create.d3d12.clear.r", 
  D3D12_CLEAR_G_FLOAT = "SDL.gpu.texture.create.d3d12.clear.g", 
  D3D12_CLEAR_B_FLOAT = "SDL.gpu.texture.create.d3d12.clear.b", 
  D3D12_CLEAR_A_FLOAT = "SDL.gpu.texture.create.d3d12.clear.a", 
  D3D12_CLEAR_DEPTH_FLOAT = "SDL.gpu.texture.create.d3d12.clear.depth", 
  D3D12_CLEAR_STENCIL_NUMBER = "SDL.gpu.texture.create.d3d12.clear.stencil", 
  NAME_STRING = "SDL.gpu.texture.create.name", 
}



/**
 * Specifies the primitive topology of a graphics pipeline.
 *
 * If you are using POINTLIST you must include a point size output in the
 * vertex shader.
 *
 * - For HLSL compiling to SPIRV you must decorate a float output with
 *   [[vk::builtin("PointSize")]].
 * - For GLSL you must set the gl_PointSize builtin.
 * - For MSL you must include a float output with the [[point_size]]
 *   decorator.
 *
 * Note that sized point topology is totally unsupported on D3D12. Any size
 * other than 1 will be ignored. In general, you should avoid using point
 * topology for both compatibility and performance reasons. You WILL regret
 * using it.
 *
 * @since This enum is available since SDL 3.2.0.
 *
 * @sa SDL_CreateGPUGraphicsPipeline
 *
 * @from SDL_gpu.h:537 SDL_GPU_PRIMITIVETYPE_
 */
export enum SDL_GPUPrimitiveType {
  TRIANGLELIST, /**< A series of separate triangles. */
  TRIANGLESTRIP, /**< A series of connected triangles. */
  LINELIST, /**< A series of separate lines. */
  LINESTRIP, /**< A series of connected lines. */
  POINTLIST, /**< A series of separate points. */
}



/**
 * Specifies how the contents of a texture attached to a render pass are
 * treated at the beginning of the render pass.
 *
 * @since This enum is available since SDL 3.2.0.
 *
 * @sa SDL_BeginGPURenderPass
 *
 * @from SDL_gpu.h:554 SDL_GPU_LOADOP_
 */
export enum SDL_GPULoadOp {
  LOAD, /**< The previous contents of the texture will be preserved. */
  CLEAR, /**< The contents of the texture will be cleared to a color. */
  DONT_CARE, /**< The previous contents of the texture need not be preserved. The contents will be undefined. */
}



/**
 * Specifies how the contents of a texture attached to a render pass are
 * treated at the end of the render pass.
 *
 * @since This enum is available since SDL 3.2.0.
 *
 * @sa SDL_BeginGPURenderPass
 *
 * @from SDL_gpu.h:569 SDL_GPU_STOREOP_
 */
export enum SDL_GPUStoreOp {
  STORE, /**< The contents generated during the render pass will be written to memory. */
  DONT_CARE, /**< The contents generated during the render pass are not needed and may be discarded. The contents will be undefined. */
  RESOLVE, /**< The multisample contents generated during the render pass will be resolved to a non-multisample texture. The contents in the multisample texture may then be discarded and will be undefined. */
  RESOLVE_AND_STORE, /**< The multisample contents generated during the render pass will be resolved to a non-multisample texture. The contents in the multisample texture will be written to memory. */
}



/**
 * Specifies the size of elements in an index buffer.
 *
 * @since This enum is available since SDL 3.2.0.
 *
 * @sa SDL_CreateGPUGraphicsPipeline
 *
 * @from SDL_gpu.h:584 SDL_GPU_INDEXELEMENTSIZE_
 */
export enum SDL_GPUIndexElementSize {
  _16BIT, /**< The index elements are 16-bit. */
  _32BIT, /**< The index elements are 32-bit. */
}



/**
 * Specifies the pixel format of a texture.
 *
 * Texture format support varies depending on driver, hardware, and usage
 * flags. In general, you should use SDL_GPUTextureSupportsFormat to query if
 * a format is supported before using it. However, there are a few guaranteed
 * formats.
 *
 * FIXME: Check universal support for 32-bit component formats FIXME: Check
 * universal support for SIMULTANEOUS_READ_WRITE
 *
 * For SAMPLER usage, the following formats are universally supported:
 *
 * - R8G8B8A8_UNORM
 * - B8G8R8A8_UNORM
 * - R8_UNORM
 * - R8_SNORM
 * - R8G8_UNORM
 * - R8G8_SNORM
 * - R8G8B8A8_SNORM
 * - R16_FLOAT
 * - R16G16_FLOAT
 * - R16G16B16A16_FLOAT
 * - R32_FLOAT
 * - R32G32_FLOAT
 * - R32G32B32A32_FLOAT
 * - R11G11B10_UFLOAT
 * - R8G8B8A8_UNORM_SRGB
 * - B8G8R8A8_UNORM_SRGB
 * - D16_UNORM
 *
 * For COLOR_TARGET usage, the following formats are universally supported:
 *
 * - R8G8B8A8_UNORM
 * - B8G8R8A8_UNORM
 * - R8_UNORM
 * - R16_FLOAT
 * - R16G16_FLOAT
 * - R16G16B16A16_FLOAT
 * - R32_FLOAT
 * - R32G32_FLOAT
 * - R32G32B32A32_FLOAT
 * - R8_UINT
 * - R8G8_UINT
 * - R8G8B8A8_UINT
 * - R16_UINT
 * - R16G16_UINT
 * - R16G16B16A16_UINT
 * - R8_INT
 * - R8G8_INT
 * - R8G8B8A8_INT
 * - R16_INT
 * - R16G16_INT
 * - R16G16B16A16_INT
 * - R8G8B8A8_UNORM_SRGB
 * - B8G8R8A8_UNORM_SRGB
 *
 * For STORAGE usages, the following formats are universally supported:
 *
 * - R8G8B8A8_UNORM
 * - R8G8B8A8_SNORM
 * - R16G16B16A16_FLOAT
 * - R32_FLOAT
 * - R32G32_FLOAT
 * - R32G32B32A32_FLOAT
 * - R8G8B8A8_UINT
 * - R16G16B16A16_UINT
 * - R8G8B8A8_INT
 * - R16G16B16A16_INT
 *
 * For DEPTH_STENCIL_TARGET usage, the following formats are universally
 * supported:
 *
 * - D16_UNORM
 * - Either (but not necessarily both!) D24_UNORM or D32_FLOAT
 * - Either (but not necessarily both!) D24_UNORM_S8_UINT or D32_FLOAT_S8_UINT
 *
 * Unless D16_UNORM is sufficient for your purposes, always check which of
 * D24/D32 is supported before creating a depth-stencil texture!
 *
 * @since This enum is available since SDL 3.2.0.
 *
 * @sa SDL_CreateGPUTexture
 * @sa SDL_GPUTextureSupportsFormat
 *
 * @from SDL_gpu.h:675 SDL_GPU_TEXTUREFORMAT_
 */
export enum SDL_GPUTextureFormat {
  INVALID, 
    /* Unsigned Normalized Float Color Formats */
  A8_UNORM, 
  R8_UNORM, 
  R8G8_UNORM, 
  R8G8B8A8_UNORM, 
  R16_UNORM, 
  R16G16_UNORM, 
  R16G16B16A16_UNORM, 
  R10G10B10A2_UNORM, 
  B5G6R5_UNORM, 
  B5G5R5A1_UNORM, 
  B4G4R4A4_UNORM, 
  B8G8R8A8_UNORM, 
    /* Compressed Unsigned Normalized Float Color Formats */
  BC1_RGBA_UNORM, 
  BC2_RGBA_UNORM, 
  BC3_RGBA_UNORM, 
  BC4_R_UNORM, 
  BC5_RG_UNORM, 
  BC7_RGBA_UNORM, 
    /* Compressed Signed Float Color Formats */
  BC6H_RGB_FLOAT, 
    /* Compressed Unsigned Float Color Formats */
  BC6H_RGB_UFLOAT, 
    /* Signed Normalized Float Color Formats  */
  R8_SNORM, 
  R8G8_SNORM, 
  R8G8B8A8_SNORM, 
  R16_SNORM, 
  R16G16_SNORM, 
  R16G16B16A16_SNORM, 
    /* Signed Float Color Formats */
  R16_FLOAT, 
  R16G16_FLOAT, 
  R16G16B16A16_FLOAT, 
  R32_FLOAT, 
  R32G32_FLOAT, 
  R32G32B32A32_FLOAT, 
    /* Unsigned Float Color Formats */
  R11G11B10_UFLOAT, 
    /* Unsigned Integer Color Formats */
  R8_UINT, 
  R8G8_UINT, 
  R8G8B8A8_UINT, 
  R16_UINT, 
  R16G16_UINT, 
  R16G16B16A16_UINT, 
  R32_UINT, 
  R32G32_UINT, 
  R32G32B32A32_UINT, 
    /* Signed Integer Color Formats */
  R8_INT, 
  R8G8_INT, 
  R8G8B8A8_INT, 
  R16_INT, 
  R16G16_INT, 
  R16G16B16A16_INT, 
  R32_INT, 
  R32G32_INT, 
  R32G32B32A32_INT, 
    /* SRGB Unsigned Normalized Color Formats */
  R8G8B8A8_UNORM_SRGB, 
  B8G8R8A8_UNORM_SRGB, 
    /* Compressed SRGB Unsigned Normalized Color Formats */
  BC1_RGBA_UNORM_SRGB, 
  BC2_RGBA_UNORM_SRGB, 
  BC3_RGBA_UNORM_SRGB, 
  BC7_RGBA_UNORM_SRGB, 
    /* Depth Formats */
  D16_UNORM, 
  D24_UNORM, 
  D32_FLOAT, 
  D24_UNORM_S8_UINT, 
  D32_FLOAT_S8_UINT, 
    /* Compressed ASTC Normalized Float Color Formats*/
  ASTC_4x4_UNORM, 
  ASTC_5x4_UNORM, 
  ASTC_5x5_UNORM, 
  ASTC_6x5_UNORM, 
  ASTC_6x6_UNORM, 
  ASTC_8x5_UNORM, 
  ASTC_8x6_UNORM, 
  ASTC_8x8_UNORM, 
  ASTC_10x5_UNORM, 
  ASTC_10x6_UNORM, 
  ASTC_10x8_UNORM, 
  ASTC_10x10_UNORM, 
  ASTC_12x10_UNORM, 
  ASTC_12x12_UNORM, 
    /* Compressed SRGB ASTC Normalized Float Color Formats*/
  ASTC_4x4_UNORM_SRGB, 
  ASTC_5x4_UNORM_SRGB, 
  ASTC_5x5_UNORM_SRGB, 
  ASTC_6x5_UNORM_SRGB, 
  ASTC_6x6_UNORM_SRGB, 
  ASTC_8x5_UNORM_SRGB, 
  ASTC_8x6_UNORM_SRGB, 
  ASTC_8x8_UNORM_SRGB, 
  ASTC_10x5_UNORM_SRGB, 
  ASTC_10x6_UNORM_SRGB, 
  ASTC_10x8_UNORM_SRGB, 
  ASTC_10x10_UNORM_SRGB, 
  ASTC_12x10_UNORM_SRGB, 
  ASTC_12x12_UNORM_SRGB, 
    /* Compressed ASTC Signed Float Color Formats*/
  ASTC_4x4_FLOAT, 
  ASTC_5x4_FLOAT, 
  ASTC_5x5_FLOAT, 
  ASTC_6x5_FLOAT, 
  ASTC_6x6_FLOAT, 
  ASTC_8x5_FLOAT, 
  ASTC_8x6_FLOAT, 
  ASTC_8x8_FLOAT, 
  ASTC_10x5_FLOAT, 
  ASTC_10x6_FLOAT, 
  ASTC_10x8_FLOAT, 
  ASTC_10x10_FLOAT, 
  ASTC_12x10_FLOAT, 
  ASTC_12x12_FLOAT, 
}



/**
 * Specifies the type of a texture.
 *
 * @since This enum is available since SDL 3.2.0.
 *
 * @sa SDL_CreateGPUTexture
 *
 * @from SDL_gpu.h:837 SDL_GPU_TEXTURETYPE_
 */
export enum SDL_GPUTextureType {
  _2D, /**< The texture is a 2-dimensional image. */
  _2D_ARRAY, /**< The texture is a 2-dimensional array image. */
  _3D, /**< The texture is a 3-dimensional image. */
  CUBE, /**< The texture is a cube image. */
  CUBE_ARRAY, /**< The texture is a cube array image. */
}



/**
 * Specifies the sample count of a texture.
 *
 * Used in multisampling. Note that this value only applies when the texture
 * is used as a render target.
 *
 * @since This enum is available since SDL 3.2.0.
 *
 * @sa SDL_CreateGPUTexture
 * @sa SDL_GPUTextureSupportsSampleCount
 *
 * @from SDL_gpu.h:857 SDL_GPU_SAMPLECOUNT_
 */
export enum SDL_GPUSampleCount {
  _1, /**< No multisampling. */
  _2, /**< MSAA 2x */
  _4, /**< MSAA 4x */
  _8, /**< MSAA 8x */
}



/**
 * Specifies the face of a cube map.
 *
 * Can be passed in as the layer field in texture-related structs.
 *
 * @since This enum is available since SDL 3.2.0.
 *
 * @from SDL_gpu.h:873 SDL_GPU_CUBEMAPFACE_
 */
export enum SDL_GPUCubeMapFace {
  POSITIVEX, 
  NEGATIVEX, 
  POSITIVEY, 
  NEGATIVEY, 
  POSITIVEZ, 
  NEGATIVEZ, 
}



/**
 * Specifies how a transfer buffer is intended to be used by the client.
 *
 * Note that mapping and copying FROM an upload transfer buffer or TO a
 * download transfer buffer is undefined behavior.
 *
 * @since This enum is available since SDL 3.2.0.
 *
 * @sa SDL_CreateGPUTransferBuffer
 *
 * @from SDL_gpu.h:919 SDL_GPU_TRANSFERBUFFERUSAGE_
 */
export enum SDL_GPUTransferBufferUsage {
  UPLOAD, 
  DOWNLOAD, 
}



/**
 * Specifies which stage a shader program corresponds to.
 *
 * @since This enum is available since SDL 3.2.0.
 *
 * @sa SDL_CreateGPUShader
 *
 * @from SDL_gpu.h:932 SDL_GPU_SHADERSTAGE_
 */
export enum SDL_GPUShaderStage {
  VERTEX, 
  FRAGMENT, 
}



/**
 * Specifies the format of a vertex attribute.
 *
 * @since This enum is available since SDL 3.2.0.
 *
 * @sa SDL_CreateGPUGraphicsPipeline
 *
 * @from SDL_gpu.h:964 SDL_GPU_VERTEXELEMENTFORMAT_
 */
export enum SDL_GPUVertexElementFormat {
  INVALID, 
    /* 32-bit Signed Integers */
  INT, 
  INT2, 
  INT3, 
  INT4, 
    /* 32-bit Unsigned Integers */
  UINT, 
  UINT2, 
  UINT3, 
  UINT4, 
    /* 32-bit Floats */
  FLOAT, 
  FLOAT2, 
  FLOAT3, 
  FLOAT4, 
    /* 8-bit Signed Integers */
  BYTE2, 
  BYTE4, 
    /* 8-bit Unsigned Integers */
  UBYTE2, 
  UBYTE4, 
    /* 8-bit Signed Normalized */
  BYTE2_NORM, 
  BYTE4_NORM, 
    /* 8-bit Unsigned Normalized */
  UBYTE2_NORM, 
  UBYTE4_NORM, 
    /* 16-bit Signed Integers */
  SHORT2, 
  SHORT4, 
    /* 16-bit Unsigned Integers */
  USHORT2, 
  USHORT4, 
    /* 16-bit Signed Normalized */
  SHORT2_NORM, 
  SHORT4_NORM, 
    /* 16-bit Unsigned Normalized */
  USHORT2_NORM, 
  USHORT4_NORM, 
    /* 16-bit Floats */
  HALF2, 
  HALF4, 
}



/**
 * Specifies the rate at which vertex attributes are pulled from buffers.
 *
 * @since This enum is available since SDL 3.2.0.
 *
 * @sa SDL_CreateGPUGraphicsPipeline
 *
 * @from SDL_gpu.h:1030 SDL_GPU_VERTEXINPUTRATE_
 */
export enum SDL_GPUVertexInputRate {
  VERTEX, /**< Attribute addressing is a function of the vertex index. */
  INSTANCE, /**< Attribute addressing is a function of the instance index. */
}



/**
 * Specifies the fill mode of the graphics pipeline.
 *
 * @since This enum is available since SDL 3.2.0.
 *
 * @sa SDL_CreateGPUGraphicsPipeline
 *
 * @from SDL_gpu.h:1043 SDL_GPU_FILLMODE_
 */
export enum SDL_GPUFillMode {
  FILL, /**< Polygons will be rendered via rasterization. */
  LINE, /**< Polygon edges will be drawn as line segments. */
}



/**
 * Specifies the facing direction in which triangle faces will be culled.
 *
 * @since This enum is available since SDL 3.2.0.
 *
 * @sa SDL_CreateGPUGraphicsPipeline
 *
 * @from SDL_gpu.h:1056 SDL_GPU_CULLMODE_
 */
export enum SDL_GPUCullMode {
  NONE, /**< No triangles are culled. */
  FRONT, /**< Front-facing triangles are culled. */
  BACK, /**< Back-facing triangles are culled. */
}



/**
 * Specifies the vertex winding that will cause a triangle to be determined to
 * be front-facing.
 *
 * @since This enum is available since SDL 3.2.0.
 *
 * @sa SDL_CreateGPUGraphicsPipeline
 *
 * @from SDL_gpu.h:1071 SDL_GPU_FRONTFACE_
 */
export enum SDL_GPUFrontFace {
  COUNTER_CLOCKWISE, /**< A triangle with counter-clockwise vertex winding will be considered front-facing. */
  CLOCKWISE, /**< A triangle with clockwise vertex winding will be considered front-facing. */
}



/**
 * Specifies a comparison operator for depth, stencil and sampler operations.
 *
 * @since This enum is available since SDL 3.2.0.
 *
 * @sa SDL_CreateGPUGraphicsPipeline
 *
 * @from SDL_gpu.h:1084 SDL_GPU_COMPAREOP_
 */
export enum SDL_GPUCompareOp {
  INVALID, 
  NEVER, /**< The comparison always evaluates false. */
  LESS, /**< The comparison evaluates reference < test. */
  EQUAL, /**< The comparison evaluates reference == test. */
  LESS_OR_EQUAL, /**< The comparison evaluates reference <= test. */
  GREATER, /**< The comparison evaluates reference > test. */
  NOT_EQUAL, /**< The comparison evaluates reference != test. */
  GREATER_OR_EQUAL, /**< The comparison evaluates reference >= test. */
  ALWAYS, /**< The comparison always evaluates true. */
}



/**
 * Specifies what happens to a stored stencil value if stencil tests fail or
 * pass.
 *
 * @since This enum is available since SDL 3.2.0.
 *
 * @sa SDL_CreateGPUGraphicsPipeline
 *
 * @from SDL_gpu.h:1105 SDL_GPU_STENCILOP_
 */
export enum SDL_GPUStencilOp {
  INVALID, 
  KEEP, /**< Keeps the current value. */
  ZERO, /**< Sets the value to 0. */
  REPLACE, /**< Sets the value to reference. */
  INCREMENT_AND_CLAMP, /**< Increments the current value and clamps to the maximum value. */
  DECREMENT_AND_CLAMP, /**< Decrements the current value and clamps to 0. */
  INVERT, /**< Bitwise-inverts the current value. */
  INCREMENT_AND_WRAP, /**< Increments the current value and wraps back to 0. */
  DECREMENT_AND_WRAP, /**< Decrements the current value and wraps to the maximum value. */
}



/**
 * Specifies the operator to be used when pixels in a render target are
 * blended with existing pixels in the texture.
 *
 * The source color is the value written by the fragment shader. The
 * destination color is the value currently existing in the texture.
 *
 * @since This enum is available since SDL 3.2.0.
 *
 * @sa SDL_CreateGPUGraphicsPipeline
 *
 * @from SDL_gpu.h:1129 SDL_GPU_BLENDOP_
 */
export enum SDL_GPUBlendOp {
  INVALID, 
  ADD, /**< (source * source_factor) + (destination * destination_factor) */
  SUBTRACT, /**< (source * source_factor) - (destination * destination_factor) */
  REVERSE_SUBTRACT, /**< (destination * destination_factor) - (source * source_factor) */
  MIN, /**< min(source, destination) */
  MAX, /**< max(source, destination) */
}



/**
 * Specifies a blending factor to be used when pixels in a render target are
 * blended with existing pixels in the texture.
 *
 * The source color is the value written by the fragment shader. The
 * destination color is the value currently existing in the texture.
 *
 * @since This enum is available since SDL 3.2.0.
 *
 * @sa SDL_CreateGPUGraphicsPipeline
 *
 * @from SDL_gpu.h:1150 SDL_GPU_BLENDFACTOR_
 */
export enum SDL_GPUBlendFactor {
  INVALID, 
  ZERO, /**< 0 */
  ONE, /**< 1 */
  SRC_COLOR, /**< source color */
  ONE_MINUS_SRC_COLOR, /**< 1 - source color */
  DST_COLOR, /**< destination color */
  ONE_MINUS_DST_COLOR, /**< 1 - destination color */
  SRC_ALPHA, /**< source alpha */
  ONE_MINUS_SRC_ALPHA, /**< 1 - source alpha */
  DST_ALPHA, /**< destination alpha */
  ONE_MINUS_DST_ALPHA, /**< 1 - destination alpha */
  CONSTANT_COLOR, /**< blend constant */
  ONE_MINUS_CONSTANT_COLOR, /**< 1 - blend constant */
  SRC_ALPHA_SATURATE, /**< min(source alpha, 1 - destination alpha) */
}



/**
 * Specifies a filter operation used by a sampler.
 *
 * @since This enum is available since SDL 3.2.0.
 *
 * @sa SDL_CreateGPUSampler
 *
 * @from SDL_gpu.h:1189 SDL_GPU_FILTER_
 */
export enum SDL_GPUFilter {
  NEAREST, /**< Point filtering. */
  LINEAR, /**< Linear filtering. */
}



/**
 * Specifies a mipmap mode used by a sampler.
 *
 * @since This enum is available since SDL 3.2.0.
 *
 * @sa SDL_CreateGPUSampler
 *
 * @from SDL_gpu.h:1202 SDL_GPU_SAMPLERMIPMAPMODE_
 */
export enum SDL_GPUSamplerMipmapMode {
  NEAREST, /**< Point filtering. */
  LINEAR, /**< Linear filtering. */
}



/**
 * Specifies behavior of texture sampling when the coordinates exceed the 0-1
 * range.
 *
 * @since This enum is available since SDL 3.2.0.
 *
 * @sa SDL_CreateGPUSampler
 *
 * @from SDL_gpu.h:1216 SDL_GPU_SAMPLERADDRESSMODE_
 */
export enum SDL_GPUSamplerAddressMode {
  REPEAT, /**< Specifies that the coordinates will wrap around. */
  MIRRORED_REPEAT, /**< Specifies that the coordinates will wrap around mirrored. */
  CLAMP_TO_EDGE, /**< Specifies that the coordinates will clamp to the 0-1 range. */
}



/**
 * Specifies the timing that will be used to present swapchain textures to the
 * OS.
 *
 * VSYNC mode will always be supported. IMMEDIATE and MAILBOX modes may not be
 * supported on certain systems.
 *
 * It is recommended to query SDL_WindowSupportsGPUPresentMode after claiming
 * the window if you wish to change the present mode to IMMEDIATE or MAILBOX.
 *
 * - VSYNC: Waits for vblank before presenting. No tearing is possible. If
 *   there is a pending image to present, the new image is enqueued for
 *   presentation. Disallows tearing at the cost of visual latency.
 * - IMMEDIATE: Immediately presents. Lowest latency option, but tearing may
 *   occur.
 * - MAILBOX: Waits for vblank before presenting. No tearing is possible. If
 *   there is a pending image to present, the pending image is replaced by the
 *   new image. Similar to VSYNC, but with reduced visual latency.
 *
 * @since This enum is available since SDL 3.2.0.
 *
 * @sa SDL_SetGPUSwapchainParameters
 * @sa SDL_WindowSupportsGPUPresentMode
 * @sa SDL_WaitAndAcquireGPUSwapchainTexture
 *
 * @from SDL_gpu.h:1248 SDL_GPU_PRESENTMODE_
 */
export enum SDL_GPUPresentMode {
  VSYNC, 
  IMMEDIATE, 
  MAILBOX, 
}



/**
 * Specifies the texture format and colorspace of the swapchain textures.
 *
 * SDR will always be supported. Other compositions may not be supported on
 * certain systems.
 *
 * It is recommended to query SDL_WindowSupportsGPUSwapchainComposition after
 * claiming the window if you wish to change the swapchain composition from
 * SDR.
 *
 * - SDR: B8G8R8A8 or R8G8B8A8 swapchain. Pixel values are in sRGB encoding.
 * - SDR_LINEAR: B8G8R8A8_SRGB or R8G8B8A8_SRGB swapchain. Pixel values are
 *   stored in memory in sRGB encoding but accessed in shaders in "linear
 *   sRGB" encoding which is sRGB but with a linear transfer function.
 * - HDR_EXTENDED_LINEAR: R16G16B16A16_FLOAT swapchain. Pixel values are in
 *   extended linear sRGB encoding and permits values outside of the [0, 1]
 *   range.
 * - HDR10_ST2084: A2R10G10B10 or A2B10G10R10 swapchain. Pixel values are in
 *   BT.2020 ST2084 (PQ) encoding.
 *
 * @since This enum is available since SDL 3.2.0.
 *
 * @sa SDL_SetGPUSwapchainParameters
 * @sa SDL_WindowSupportsGPUSwapchainComposition
 * @sa SDL_WaitAndAcquireGPUSwapchainTexture
 *
 * @from SDL_gpu.h:1281 SDL_GPU_SWAPCHAINCOMPOSITION_
 */
export enum SDL_GPUSwapchainComposition {
  SDR, 
  SDR_LINEAR, 
  HDR_EXTENDED_LINEAR, 
  HDR10_ST2084, 
}



