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


export const symbols = {

/**
 * Checks for GPU runtime support.
 *
 * @param format_flags a bitflag indicating which shader formats the app is
 *                     able to provide.
 * @param name the preferred GPU driver, or NULL to let SDL pick the optimal
 *             driver.
 * @returns true if supported, false otherwise.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_CreateGPUDevice
 *
 * @from SDL_gpu.h:2093 bool SDL_GPUSupportsShaderFormats(SDL_GPUShaderFormat format_flags, const char *name);
 */
SDL_GPUSupportsShaderFormats: {
      parameters: ["u32", "pointer"],
      result: "bool"
    },


/**
 * Checks for GPU runtime support.
 *
 * @param props the properties to use.
 * @returns true if supported, false otherwise.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_CreateGPUDeviceWithProperties
 *
 * @from SDL_gpu.h:2107 bool SDL_GPUSupportsProperties(SDL_PropertiesID props);
 */
SDL_GPUSupportsProperties: {
      parameters: ["u32"],
      result: "bool"
    },


/**
 * Creates a GPU context.
 *
 * @param format_flags a bitflag indicating which shader formats the app is
 *                     able to provide.
 * @param debug_mode enable debug mode properties and validations.
 * @param name the preferred GPU driver, or NULL to let SDL pick the optimal
 *             driver.
 * @returns a GPU context on success or NULL on failure; call SDL_GetError()
 *          for more information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetGPUShaderFormats
 * @sa SDL_GetGPUDeviceDriver
 * @sa SDL_DestroyGPUDevice
 * @sa SDL_GPUSupportsShaderFormats
 *
 * @from SDL_gpu.h:2128 SDL_GPUDevice * SDL_CreateGPUDevice(SDL_GPUShaderFormat format_flags, bool debug_mode, const char *name);
 */
SDL_CreateGPUDevice: {
      parameters: ["u32", "bool", "pointer"],
      result: "pointer"
    },


/**
 * Creates a GPU context.
 *
 * These are the supported properties:
 *
 * - `SDL_PROP_GPU_DEVICE_CREATE_DEBUGMODE_BOOLEAN`: enable debug mode
 *   properties and validations, defaults to true.
 * - `SDL_PROP_GPU_DEVICE_CREATE_PREFERLOWPOWER_BOOLEAN`: enable to prefer
 *   energy efficiency over maximum GPU performance, defaults to false.
 * - `SDL_PROP_GPU_DEVICE_CREATE_NAME_STRING`: the name of the GPU driver to
 *   use, if a specific one is desired.
 *
 * These are the current shader format properties:
 *
 * - `SDL_PROP_GPU_DEVICE_CREATE_SHADERS_PRIVATE_BOOLEAN`: The app is able to
 *   provide shaders for an NDA platform.
 * - `SDL_PROP_GPU_DEVICE_CREATE_SHADERS_SPIRV_BOOLEAN`: The app is able to
 *   provide SPIR-V shaders if applicable.
 * - `SDL_PROP_GPU_DEVICE_CREATE_SHADERS_DXBC_BOOLEAN`: The app is able to
 *   provide DXBC shaders if applicable
 * - `SDL_PROP_GPU_DEVICE_CREATE_SHADERS_DXIL_BOOLEAN`: The app is able to
 *   provide DXIL shaders if applicable.
 * - `SDL_PROP_GPU_DEVICE_CREATE_SHADERS_MSL_BOOLEAN`: The app is able to
 *   provide MSL shaders if applicable.
 * - `SDL_PROP_GPU_DEVICE_CREATE_SHADERS_METALLIB_BOOLEAN`: The app is able to
 *   provide Metal shader libraries if applicable.
 *
 * With the D3D12 renderer:
 *
 * - `SDL_PROP_GPU_DEVICE_CREATE_D3D12_SEMANTIC_NAME_STRING`: the prefix to
 *   use for all vertex semantics, default is "TEXCOORD".
 *
 * @param props the properties to use.
 * @returns a GPU context on success or NULL on failure; call SDL_GetError()
 *          for more information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetGPUShaderFormats
 * @sa SDL_GetGPUDeviceDriver
 * @sa SDL_DestroyGPUDevice
 * @sa SDL_GPUSupportsProperties
 *
 * @from SDL_gpu.h:2176 SDL_GPUDevice * SDL_CreateGPUDeviceWithProperties(SDL_PropertiesID props);
 */
SDL_CreateGPUDeviceWithProperties: {
      parameters: ["u32"],
      result: "pointer"
    },


/**
 * Destroys a GPU context previously returned by SDL_CreateGPUDevice.
 *
 * @param device a GPU Context to destroy.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_CreateGPUDevice
 *
 * @from SDL_gpu.h:2199 void SDL_DestroyGPUDevice(SDL_GPUDevice *device);
 */
SDL_DestroyGPUDevice: {
      parameters: ["pointer"],
      result: "void"
    },


/**
 * Get the number of GPU drivers compiled into SDL.
 *
 * @returns the number of built in GPU drivers.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetGPUDriver
 *
 * @from SDL_gpu.h:2210 int SDL_GetNumGPUDrivers(void);
 */
SDL_GetNumGPUDrivers: {
      parameters: [],
      result: "i32"
    },


/**
 * Get the name of a built in GPU driver.
 *
 * The GPU drivers are presented in the order in which they are normally
 * checked during initialization.
 *
 * The names of drivers are all simple, low-ASCII identifiers, like "vulkan",
 * "metal" or "direct3d12". These never have Unicode characters, and are not
 * meant to be proper names.
 *
 * @param index the index of a GPU driver.
 * @returns the name of the GPU driver with the given **index**.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_GetNumGPUDrivers
 *
 * @from SDL_gpu.h:2229 const char * SDL_GetGPUDriver(int index);
 */
SDL_GetGPUDriver: {
      parameters: ["i32"],
      result: "pointer"
    },


/**
 * Returns the name of the backend used to create this GPU context.
 *
 * @param device a GPU context to query.
 * @returns the name of the device's driver, or NULL on error.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gpu.h:2239 const char * SDL_GetGPUDeviceDriver(SDL_GPUDevice *device);
 */
SDL_GetGPUDeviceDriver: {
      parameters: ["pointer"],
      result: "pointer"
    },


/**
 * Returns the supported shader formats for this GPU context.
 *
 * @param device a GPU context to query.
 * @returns a bitflag indicating which shader formats the driver is able to
 *          consume.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gpu.h:2250 SDL_GPUShaderFormat SDL_GetGPUShaderFormats(SDL_GPUDevice *device);
 */
SDL_GetGPUShaderFormats: {
      parameters: ["pointer"],
      result: "u32"
    },


/**
 * Creates a pipeline object to be used in a compute workflow.
 *
 * Shader resource bindings must be authored to follow a particular order
 * depending on the shader format.
 *
 * For SPIR-V shaders, use the following resource sets:
 *
 * - 0: Sampled textures, followed by read-only storage textures, followed by
 *   read-only storage buffers
 * - 1: Read-write storage textures, followed by read-write storage buffers
 * - 2: Uniform buffers
 *
 * For DXBC and DXIL shaders, use the following register order:
 *
 * - (t[n], space0): Sampled textures, followed by read-only storage textures,
 *   followed by read-only storage buffers
 * - (u[n], space1): Read-write storage textures, followed by read-write
 *   storage buffers
 * - (b[n], space2): Uniform buffers
 *
 * For MSL/metallib, use the following order:
 *
 * - [[buffer]]: Uniform buffers, followed by read-only storage buffers,
 *   followed by read-write storage buffers
 * - [[texture]]: Sampled textures, followed by read-only storage textures,
 *   followed by read-write storage textures
 *
 * There are optional properties that can be provided through `props`. These
 * are the supported properties:
 *
 * - `SDL_PROP_GPU_COMPUTEPIPELINE_CREATE_NAME_STRING`: a name that can be
 *   displayed in debugging tools.
 *
 * @param device a GPU Context.
 * @param createinfo a struct describing the state of the compute pipeline to
 *                   create.
 * @returns a compute pipeline object on success, or NULL on failure; call
 *          SDL_GetError() for more information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_BindGPUComputePipeline
 * @sa SDL_ReleaseGPUComputePipeline
 *
 * @from SDL_gpu.h:2299 SDL_GPUComputePipeline * SDL_CreateGPUComputePipeline(SDL_GPUDevice *device, const SDL_GPUComputePipelineCreateInfo *createinfo);
 */
SDL_CreateGPUComputePipeline: {
      parameters: ["pointer", "pointer"],
      result: "pointer"
    },


/**
 * Creates a pipeline object to be used in a graphics workflow.
 *
 * There are optional properties that can be provided through `props`. These
 * are the supported properties:
 *
 * - `SDL_PROP_GPU_GRAPHICSPIPELINE_CREATE_NAME_STRING`: a name that can be
 *   displayed in debugging tools.
 *
 * @param device a GPU Context.
 * @param createinfo a struct describing the state of the graphics pipeline to
 *                   create.
 * @returns a graphics pipeline object on success, or NULL on failure; call
 *          SDL_GetError() for more information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_CreateGPUShader
 * @sa SDL_BindGPUGraphicsPipeline
 * @sa SDL_ReleaseGPUGraphicsPipeline
 *
 * @from SDL_gpu.h:2326 SDL_GPUGraphicsPipeline * SDL_CreateGPUGraphicsPipeline(SDL_GPUDevice *device, const SDL_GPUGraphicsPipelineCreateInfo *createinfo);
 */
SDL_CreateGPUGraphicsPipeline: {
      parameters: ["pointer", "pointer"],
      result: "pointer"
    },


/**
 * Creates a sampler object to be used when binding textures in a graphics
 * workflow.
 *
 * There are optional properties that can be provided through `props`. These
 * are the supported properties:
 *
 * - `SDL_PROP_GPU_SAMPLER_CREATE_NAME_STRING`: a name that can be displayed
 *   in debugging tools.
 *
 * @param device a GPU Context.
 * @param createinfo a struct describing the state of the sampler to create.
 * @returns a sampler object on success, or NULL on failure; call
 *          SDL_GetError() for more information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_BindGPUVertexSamplers
 * @sa SDL_BindGPUFragmentSamplers
 * @sa SDL_ReleaseGPUSampler
 *
 * @from SDL_gpu.h:2353 SDL_GPUSampler * SDL_CreateGPUSampler(SDL_GPUDevice *device, const SDL_GPUSamplerCreateInfo *createinfo);
 */
SDL_CreateGPUSampler: {
      parameters: ["pointer", "pointer"],
      result: "pointer"
    },


/**
 * Creates a shader to be used when creating a graphics pipeline.
 *
 * Shader resource bindings must be authored to follow a particular order
 * depending on the shader format.
 *
 * For SPIR-V shaders, use the following resource sets:
 *
 * For vertex shaders:
 *
 * - 0: Sampled textures, followed by storage textures, followed by storage
 *   buffers
 * - 1: Uniform buffers
 *
 * For fragment shaders:
 *
 * - 2: Sampled textures, followed by storage textures, followed by storage
 *   buffers
 * - 3: Uniform buffers
 *
 * For DXBC and DXIL shaders, use the following register order:
 *
 * For vertex shaders:
 *
 * - (t[n], space0): Sampled textures, followed by storage textures, followed
 *   by storage buffers
 * - (s[n], space0): Samplers with indices corresponding to the sampled
 *   textures
 * - (b[n], space1): Uniform buffers
 *
 * For pixel shaders:
 *
 * - (t[n], space2): Sampled textures, followed by storage textures, followed
 *   by storage buffers
 * - (s[n], space2): Samplers with indices corresponding to the sampled
 *   textures
 * - (b[n], space3): Uniform buffers
 *
 * For MSL/metallib, use the following order:
 *
 * - [[texture]]: Sampled textures, followed by storage textures
 * - [[sampler]]: Samplers with indices corresponding to the sampled textures
 * - [[buffer]]: Uniform buffers, followed by storage buffers. Vertex buffer 0
 *   is bound at [[buffer(14)]], vertex buffer 1 at [[buffer(15)]], and so on.
 *   Rather than manually authoring vertex buffer indices, use the
 *   [[stage_in]] attribute which will automatically use the vertex input
 *   information from the SDL_GPUGraphicsPipeline.
 *
 * Shader semantics other than system-value semantics do not matter in D3D12
 * and for ease of use the SDL implementation assumes that non system-value
 * semantics will all be TEXCOORD. If you are using HLSL as the shader source
 * language, your vertex semantics should start at TEXCOORD0 and increment
 * like so: TEXCOORD1, TEXCOORD2, etc. If you wish to change the semantic
 * prefix to something other than TEXCOORD you can use
 * SDL_PROP_GPU_DEVICE_CREATE_D3D12_SEMANTIC_NAME_STRING with
 * SDL_CreateGPUDeviceWithProperties().
 *
 * There are optional properties that can be provided through `props`. These
 * are the supported properties:
 *
 * - `SDL_PROP_GPU_SHADER_CREATE_NAME_STRING`: a name that can be displayed in
 *   debugging tools.
 *
 * @param device a GPU Context.
 * @param createinfo a struct describing the state of the shader to create.
 * @returns a shader object on success, or NULL on failure; call
 *          SDL_GetError() for more information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_CreateGPUGraphicsPipeline
 * @sa SDL_ReleaseGPUShader
 *
 * @from SDL_gpu.h:2432 SDL_GPUShader * SDL_CreateGPUShader(SDL_GPUDevice *device, const SDL_GPUShaderCreateInfo *createinfo);
 */
SDL_CreateGPUShader: {
      parameters: ["pointer", "pointer"],
      result: "pointer"
    },


/**
 * Creates a texture object to be used in graphics or compute workflows.
 *
 * The contents of this texture are undefined until data is written to the
 * texture.
 *
 * Note that certain combinations of usage flags are invalid. For example, a
 * texture cannot have both the SAMPLER and GRAPHICS_STORAGE_READ flags.
 *
 * If you request a sample count higher than the hardware supports, the
 * implementation will automatically fall back to the highest available sample
 * count.
 *
 * There are optional properties that can be provided through
 * SDL_GPUTextureCreateInfo's `props`. These are the supported properties:
 *
 * - `SDL_PROP_GPU_TEXTURE_CREATE_D3D12_CLEAR_R_FLOAT`: (Direct3D 12 only) if
 *   the texture usage is SDL_GPU_TEXTUREUSAGE_COLOR_TARGET, clear the texture
 *   to a color with this red intensity. Defaults to zero.
 * - `SDL_PROP_GPU_TEXTURE_CREATE_D3D12_CLEAR_G_FLOAT`: (Direct3D 12 only) if
 *   the texture usage is SDL_GPU_TEXTUREUSAGE_COLOR_TARGET, clear the texture
 *   to a color with this green intensity. Defaults to zero.
 * - `SDL_PROP_GPU_TEXTURE_CREATE_D3D12_CLEAR_B_FLOAT`: (Direct3D 12 only) if
 *   the texture usage is SDL_GPU_TEXTUREUSAGE_COLOR_TARGET, clear the texture
 *   to a color with this blue intensity. Defaults to zero.
 * - `SDL_PROP_GPU_TEXTURE_CREATE_D3D12_CLEAR_A_FLOAT`: (Direct3D 12 only) if
 *   the texture usage is SDL_GPU_TEXTUREUSAGE_COLOR_TARGET, clear the texture
 *   to a color with this alpha intensity. Defaults to zero.
 * - `SDL_PROP_GPU_TEXTURE_CREATE_D3D12_CLEAR_DEPTH_FLOAT`: (Direct3D 12 only)
 *   if the texture usage is SDL_GPU_TEXTUREUSAGE_DEPTH_STENCIL_TARGET, clear
 *   the texture to a depth of this value. Defaults to zero.
 * - `SDL_PROP_GPU_TEXTURE_CREATE_D3D12_CLEAR_STENCIL_NUMBER`: (Direct3D 12
 *   only) if the texture usage is SDL_GPU_TEXTUREUSAGE_DEPTH_STENCIL_TARGET,
 *   clear the texture to a stencil of this Uint8 value. Defaults to zero.
 * - `SDL_PROP_GPU_TEXTURE_CREATE_NAME_STRING`: a name that can be displayed
 *   in debugging tools.
 *
 * @param device a GPU Context.
 * @param createinfo a struct describing the state of the texture to create.
 * @returns a texture object on success, or NULL on failure; call
 *          SDL_GetError() for more information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_UploadToGPUTexture
 * @sa SDL_DownloadFromGPUTexture
 * @sa SDL_BindGPUVertexSamplers
 * @sa SDL_BindGPUVertexStorageTextures
 * @sa SDL_BindGPUFragmentSamplers
 * @sa SDL_BindGPUFragmentStorageTextures
 * @sa SDL_BindGPUComputeStorageTextures
 * @sa SDL_BlitGPUTexture
 * @sa SDL_ReleaseGPUTexture
 * @sa SDL_GPUTextureSupportsFormat
 *
 * @from SDL_gpu.h:2493 SDL_GPUTexture * SDL_CreateGPUTexture(SDL_GPUDevice *device, const SDL_GPUTextureCreateInfo *createinfo);
 */
SDL_CreateGPUTexture: {
      parameters: ["pointer", "pointer"],
      result: "pointer"
    },


/**
 * Creates a buffer object to be used in graphics or compute workflows.
 *
 * The contents of this buffer are undefined until data is written to the
 * buffer.
 *
 * Note that certain combinations of usage flags are invalid. For example, a
 * buffer cannot have both the VERTEX and INDEX flags.
 *
 * If you use a STORAGE flag, the data in the buffer must respect std140
 * layout conventions. In practical terms this means you must ensure that vec3
 * and vec4 fields are 16-byte aligned.
 *
 * For better understanding of underlying concepts and memory management with
 * SDL GPU API, you may refer
 * [this blog post](https://moonside.games/posts/sdl-gpu-concepts-cycling/)
 * .
 *
 * There are optional properties that can be provided through `props`. These
 * are the supported properties:
 *
 * - `SDL_PROP_GPU_BUFFER_CREATE_NAME_STRING`: a name that can be displayed in
 *   debugging tools.
 *
 * @param device a GPU Context.
 * @param createinfo a struct describing the state of the buffer to create.
 * @returns a buffer object on success, or NULL on failure; call
 *          SDL_GetError() for more information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_UploadToGPUBuffer
 * @sa SDL_DownloadFromGPUBuffer
 * @sa SDL_CopyGPUBufferToBuffer
 * @sa SDL_BindGPUVertexBuffers
 * @sa SDL_BindGPUIndexBuffer
 * @sa SDL_BindGPUVertexStorageBuffers
 * @sa SDL_BindGPUFragmentStorageBuffers
 * @sa SDL_DrawGPUPrimitivesIndirect
 * @sa SDL_DrawGPUIndexedPrimitivesIndirect
 * @sa SDL_BindGPUComputeStorageBuffers
 * @sa SDL_DispatchGPUComputeIndirect
 * @sa SDL_ReleaseGPUBuffer
 *
 * @from SDL_gpu.h:2549 SDL_GPUBuffer * SDL_CreateGPUBuffer(SDL_GPUDevice *device, const SDL_GPUBufferCreateInfo *createinfo);
 */
SDL_CreateGPUBuffer: {
      parameters: ["pointer", "pointer"],
      result: "pointer"
    },


/**
 * Creates a transfer buffer to be used when uploading to or downloading from
 * graphics resources.
 *
 * Download buffers can be particularly expensive to create, so it is good
 * practice to reuse them if data will be downloaded regularly.
 *
 * There are optional properties that can be provided through `props`. These
 * are the supported properties:
 *
 * - `SDL_PROP_GPU_TRANSFERBUFFER_CREATE_NAME_STRING`: a name that can be
 *   displayed in debugging tools.
 *
 * @param device a GPU Context.
 * @param createinfo a struct describing the state of the transfer buffer to
 *                   create.
 * @returns a transfer buffer on success, or NULL on failure; call
 *          SDL_GetError() for more information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_UploadToGPUBuffer
 * @sa SDL_DownloadFromGPUBuffer
 * @sa SDL_UploadToGPUTexture
 * @sa SDL_DownloadFromGPUTexture
 * @sa SDL_ReleaseGPUTransferBuffer
 *
 * @from SDL_gpu.h:2582 SDL_GPUTransferBuffer * SDL_CreateGPUTransferBuffer(SDL_GPUDevice *device, const SDL_GPUTransferBufferCreateInfo *createinfo);
 */
SDL_CreateGPUTransferBuffer: {
      parameters: ["pointer", "pointer"],
      result: "pointer"
    },


/**
 * Sets an arbitrary string constant to label a buffer.
 *
 * You should use SDL_PROP_GPU_BUFFER_CREATE_NAME_STRING with
 * SDL_CreateGPUBuffer instead of this function to avoid thread safety issues.
 *
 * @param device a GPU Context.
 * @param buffer a buffer to attach the name to.
 * @param text a UTF-8 string constant to mark as the name of the buffer.
 *
 * @threadsafety This function is not thread safe, you must make sure the
 *               buffer is not simultaneously used by any other thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_CreateGPUBuffer
 *
 * @from SDL_gpu.h:2607 void SDL_SetGPUBufferName(SDL_GPUDevice *device, SDL_GPUBuffer *buffer, const char *text);
 */
SDL_SetGPUBufferName: {
      parameters: ["pointer", "pointer", "pointer"],
      result: "void"
    },


/**
 * Sets an arbitrary string constant to label a texture.
 *
 * You should use SDL_PROP_GPU_TEXTURE_CREATE_NAME_STRING with
 * SDL_CreateGPUTexture instead of this function to avoid thread safety
 * issues.
 *
 * @param device a GPU Context.
 * @param texture a texture to attach the name to.
 * @param text a UTF-8 string constant to mark as the name of the texture.
 *
 * @threadsafety This function is not thread safe, you must make sure the
 *               texture is not simultaneously used by any other thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_CreateGPUTexture
 *
 * @from SDL_gpu.h:2630 void SDL_SetGPUTextureName(SDL_GPUDevice *device, SDL_GPUTexture *texture, const char *text);
 */
SDL_SetGPUTextureName: {
      parameters: ["pointer", "pointer", "pointer"],
      result: "void"
    },


/**
 * Inserts an arbitrary string label into the command buffer callstream.
 *
 * Useful for debugging.
 *
 * @param command_buffer a command buffer.
 * @param text a UTF-8 string constant to insert as the label.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gpu.h:2645 void SDL_InsertGPUDebugLabel(SDL_GPUCommandBuffer *command_buffer, const char *text);
 */
SDL_InsertGPUDebugLabel: {
      parameters: ["pointer", "pointer"],
      result: "void"
    },


/**
 * Begins a debug group with an arbitrary name.
 *
 * Used for denoting groups of calls when viewing the command buffer
 * callstream in a graphics debugging tool.
 *
 * Each call to SDL_PushGPUDebugGroup must have a corresponding call to
 * SDL_PopGPUDebugGroup.
 *
 * On some backends (e.g. Metal), pushing a debug group during a
 * render/blit/compute pass will create a group that is scoped to the native
 * pass rather than the command buffer. For best results, if you push a debug
 * group during a pass, always pop it in the same pass.
 *
 * @param command_buffer a command buffer.
 * @param name a UTF-8 string constant that names the group.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_PopGPUDebugGroup
 *
 * @from SDL_gpu.h:2670 void SDL_PushGPUDebugGroup(SDL_GPUCommandBuffer *command_buffer, const char *name);
 */
SDL_PushGPUDebugGroup: {
      parameters: ["pointer", "pointer"],
      result: "void"
    },


/**
 * Ends the most-recently pushed debug group.
 *
 * @param command_buffer a command buffer.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_PushGPUDebugGroup
 *
 * @from SDL_gpu.h:2683 void SDL_PopGPUDebugGroup(SDL_GPUCommandBuffer *command_buffer);
 */
SDL_PopGPUDebugGroup: {
      parameters: ["pointer"],
      result: "void"
    },


/**
 * Frees the given texture as soon as it is safe to do so.
 *
 * You must not reference the texture after calling this function.
 *
 * @param device a GPU context.
 * @param texture a texture to be destroyed.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gpu.h:2698 void SDL_ReleaseGPUTexture(SDL_GPUDevice *device, SDL_GPUTexture *texture);
 */
SDL_ReleaseGPUTexture: {
      parameters: ["pointer", "pointer"],
      result: "void"
    },


/**
 * Frees the given sampler as soon as it is safe to do so.
 *
 * You must not reference the sampler after calling this function.
 *
 * @param device a GPU context.
 * @param sampler a sampler to be destroyed.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gpu.h:2712 void SDL_ReleaseGPUSampler(SDL_GPUDevice *device, SDL_GPUSampler *sampler);
 */
SDL_ReleaseGPUSampler: {
      parameters: ["pointer", "pointer"],
      result: "void"
    },


/**
 * Frees the given buffer as soon as it is safe to do so.
 *
 * You must not reference the buffer after calling this function.
 *
 * @param device a GPU context.
 * @param buffer a buffer to be destroyed.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gpu.h:2726 void SDL_ReleaseGPUBuffer(SDL_GPUDevice *device, SDL_GPUBuffer *buffer);
 */
SDL_ReleaseGPUBuffer: {
      parameters: ["pointer", "pointer"],
      result: "void"
    },


/**
 * Frees the given transfer buffer as soon as it is safe to do so.
 *
 * You must not reference the transfer buffer after calling this function.
 *
 * @param device a GPU context.
 * @param transfer_buffer a transfer buffer to be destroyed.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gpu.h:2740 void SDL_ReleaseGPUTransferBuffer(SDL_GPUDevice *device, SDL_GPUTransferBuffer *transfer_buffer);
 */
SDL_ReleaseGPUTransferBuffer: {
      parameters: ["pointer", "pointer"],
      result: "void"
    },


/**
 * Frees the given compute pipeline as soon as it is safe to do so.
 *
 * You must not reference the compute pipeline after calling this function.
 *
 * @param device a GPU context.
 * @param compute_pipeline a compute pipeline to be destroyed.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gpu.h:2754 void SDL_ReleaseGPUComputePipeline(SDL_GPUDevice *device, SDL_GPUComputePipeline *compute_pipeline);
 */
SDL_ReleaseGPUComputePipeline: {
      parameters: ["pointer", "pointer"],
      result: "void"
    },


/**
 * Frees the given shader as soon as it is safe to do so.
 *
 * You must not reference the shader after calling this function.
 *
 * @param device a GPU context.
 * @param shader a shader to be destroyed.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gpu.h:2768 void SDL_ReleaseGPUShader(SDL_GPUDevice *device, SDL_GPUShader *shader);
 */
SDL_ReleaseGPUShader: {
      parameters: ["pointer", "pointer"],
      result: "void"
    },


/**
 * Frees the given graphics pipeline as soon as it is safe to do so.
 *
 * You must not reference the graphics pipeline after calling this function.
 *
 * @param device a GPU context.
 * @param graphics_pipeline a graphics pipeline to be destroyed.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gpu.h:2782 void SDL_ReleaseGPUGraphicsPipeline(SDL_GPUDevice *device, SDL_GPUGraphicsPipeline *graphics_pipeline);
 */
SDL_ReleaseGPUGraphicsPipeline: {
      parameters: ["pointer", "pointer"],
      result: "void"
    },


/**
 * Acquire a command buffer.
 *
 * This command buffer is managed by the implementation and should not be
 * freed by the user. The command buffer may only be used on the thread it was
 * acquired on. The command buffer should be submitted on the thread it was
 * acquired on.
 *
 * It is valid to acquire multiple command buffers on the same thread at once.
 * In fact a common design pattern is to acquire two command buffers per frame
 * where one is dedicated to render and compute passes and the other is
 * dedicated to copy passes and other preparatory work such as generating
 * mipmaps. Interleaving commands between the two command buffers reduces the
 * total amount of passes overall which improves rendering performance.
 *
 * @param device a GPU context.
 * @returns a command buffer, or NULL on failure; call SDL_GetError() for more
 *          information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_SubmitGPUCommandBuffer
 * @sa SDL_SubmitGPUCommandBufferAndAcquireFence
 *
 * @from SDL_gpu.h:2810 SDL_GPUCommandBuffer * SDL_AcquireGPUCommandBuffer(SDL_GPUDevice *device);
 */
SDL_AcquireGPUCommandBuffer: {
      parameters: ["pointer"],
      result: "pointer"
    },


/**
 * Pushes data to a vertex uniform slot on the command buffer.
 *
 * Subsequent draw calls will use this uniform data.
 *
 * The data being pushed must respect std140 layout conventions. In practical
 * terms this means you must ensure that vec3 and vec4 fields are 16-byte
 * aligned.
 *
 * @param command_buffer a command buffer.
 * @param slot_index the vertex uniform slot to push data to.
 * @param data client data to write.
 * @param length the length of the data to write.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gpu.h:2831 void SDL_PushGPUVertexUniformData(SDL_GPUCommandBuffer *command_buffer, Uint32 slot_index, const void *data, Uint32 length);
 */
SDL_PushGPUVertexUniformData: {
      parameters: ["pointer", "u32", "pointer", "u32"],
      result: "void"
    },


/**
 * Pushes data to a fragment uniform slot on the command buffer.
 *
 * Subsequent draw calls will use this uniform data.
 *
 * The data being pushed must respect std140 layout conventions. In practical
 * terms this means you must ensure that vec3 and vec4 fields are 16-byte
 * aligned.
 *
 * @param command_buffer a command buffer.
 * @param slot_index the fragment uniform slot to push data to.
 * @param data client data to write.
 * @param length the length of the data to write.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gpu.h:2853 void SDL_PushGPUFragmentUniformData(SDL_GPUCommandBuffer *command_buffer, Uint32 slot_index, const void *data, Uint32 length);
 */
SDL_PushGPUFragmentUniformData: {
      parameters: ["pointer", "u32", "pointer", "u32"],
      result: "void"
    },


/**
 * Pushes data to a uniform slot on the command buffer.
 *
 * Subsequent draw calls will use this uniform data.
 *
 * The data being pushed must respect std140 layout conventions. In practical
 * terms this means you must ensure that vec3 and vec4 fields are 16-byte
 * aligned.
 *
 * @param command_buffer a command buffer.
 * @param slot_index the uniform slot to push data to.
 * @param data client data to write.
 * @param length the length of the data to write.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gpu.h:2875 void SDL_PushGPUComputeUniformData(SDL_GPUCommandBuffer *command_buffer, Uint32 slot_index, const void *data, Uint32 length);
 */
SDL_PushGPUComputeUniformData: {
      parameters: ["pointer", "u32", "pointer", "u32"],
      result: "void"
    },


/**
 * Begins a render pass on a command buffer.
 *
 * A render pass consists of a set of texture subresources (or depth slices in
 * the 3D texture case) which will be rendered to during the render pass,
 * along with corresponding clear values and load/store operations. All
 * operations related to graphics pipelines must take place inside of a render
 * pass. A default viewport and scissor state are automatically set when this
 * is called. You cannot begin another render pass, or begin a compute pass or
 * copy pass until you have ended the render pass.
 *
 * @param command_buffer a command buffer.
 * @param color_target_infos an array of texture subresources with
 *                           corresponding clear values and load/store ops.
 * @param num_color_targets the number of color targets in the
 *                          color_target_infos array.
 * @param depth_stencil_target_info a texture subresource with corresponding
 *                                  clear value and load/store ops, may be
 *                                  NULL.
 * @returns a render pass handle.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_EndGPURenderPass
 *
 * @from SDL_gpu.h:2908 SDL_GPURenderPass * SDL_BeginGPURenderPass(SDL_GPUCommandBuffer *command_buffer, const SDL_GPUColorTargetInfo *color_target_infos, Uint32 num_color_targets, const SDL_GPUDepthStencilTargetInfo *depth_stencil_target_info);
 */
SDL_BeginGPURenderPass: {
      parameters: ["pointer", "pointer", "u32", "pointer"],
      result: "pointer"
    },


/**
 * Binds a graphics pipeline on a render pass to be used in rendering.
 *
 * A graphics pipeline must be bound before making any draw calls.
 *
 * @param render_pass a render pass handle.
 * @param graphics_pipeline the graphics pipeline to bind.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gpu.h:2924 void SDL_BindGPUGraphicsPipeline(SDL_GPURenderPass *render_pass, SDL_GPUGraphicsPipeline *graphics_pipeline);
 */
SDL_BindGPUGraphicsPipeline: {
      parameters: ["pointer", "pointer"],
      result: "void"
    },


/**
 * Sets the current viewport state on a command buffer.
 *
 * @param render_pass a render pass handle.
 * @param viewport the viewport to set.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gpu.h:2936 void SDL_SetGPUViewport(SDL_GPURenderPass *render_pass, const SDL_GPUViewport *viewport);
 */
SDL_SetGPUViewport: {
      parameters: ["pointer", "pointer"],
      result: "void"
    },


/**
 * Sets the current scissor state on a command buffer.
 *
 * @param render_pass a render pass handle.
 * @param scissor the scissor area to set.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gpu.h:2948 void SDL_SetGPUScissor(SDL_GPURenderPass *render_pass, const SDL_Rect *scissor);
 */
SDL_SetGPUScissor: {
      parameters: ["pointer", "pointer"],
      result: "void"
    },


/**
 * Sets the current stencil reference value on a command buffer.
 *
 * @param render_pass a render pass handle.
 * @param reference the stencil reference value to set.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gpu.h:2975 void SDL_SetGPUStencilReference(SDL_GPURenderPass *render_pass, Uint8 reference);
 */
SDL_SetGPUStencilReference: {
      parameters: ["pointer", "u8"],
      result: "void"
    },


/**
 * Binds vertex buffers on a command buffer for use with subsequent draw
 * calls.
 *
 * @param render_pass a render pass handle.
 * @param first_slot the vertex buffer slot to begin binding from.
 * @param bindings an array of SDL_GPUBufferBinding structs containing vertex
 *                 buffers and offset values.
 * @param num_bindings the number of bindings in the bindings array.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gpu.h:2991 void SDL_BindGPUVertexBuffers(SDL_GPURenderPass *render_pass, Uint32 first_slot, const SDL_GPUBufferBinding *bindings, Uint32 num_bindings);
 */
SDL_BindGPUVertexBuffers: {
      parameters: ["pointer", "u32", "pointer", "u32"],
      result: "void"
    },


/**
 * Binds an index buffer on a command buffer for use with subsequent draw
 * calls.
 *
 * @param render_pass a render pass handle.
 * @param binding a pointer to a struct containing an index buffer and offset.
 * @param index_element_size whether the index values in the buffer are 16- or
 *                           32-bit.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gpu.h:3008 void SDL_BindGPUIndexBuffer(SDL_GPURenderPass *render_pass, const SDL_GPUBufferBinding *binding, SDL_GPUIndexElementSize index_element_size);
 */
SDL_BindGPUIndexBuffer: {
      parameters: ["pointer", "pointer", "u32"],
      result: "void"
    },


/**
 * Binds texture-sampler pairs for use on the vertex shader.
 *
 * The textures must have been created with SDL_GPU_TEXTUREUSAGE_SAMPLER.
 *
 * Be sure your shader is set up according to the requirements documented in
 * SDL_CreateGPUShader().
 *
 * @param render_pass a render pass handle.
 * @param first_slot the vertex sampler slot to begin binding from.
 * @param texture_sampler_bindings an array of texture-sampler binding
 *                                 structs.
 * @param num_bindings the number of texture-sampler pairs to bind from the
 *                     array.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_CreateGPUShader
 *
 * @from SDL_gpu.h:3032 void SDL_BindGPUVertexSamplers(SDL_GPURenderPass *render_pass, Uint32 first_slot, const SDL_GPUTextureSamplerBinding *texture_sampler_bindings, Uint32 num_bindings);
 */
SDL_BindGPUVertexSamplers: {
      parameters: ["pointer", "u32", "pointer", "u32"],
      result: "void"
    },


/**
 * Binds storage textures for use on the vertex shader.
 *
 * These textures must have been created with
 * SDL_GPU_TEXTUREUSAGE_GRAPHICS_STORAGE_READ.
 *
 * Be sure your shader is set up according to the requirements documented in
 * SDL_CreateGPUShader().
 *
 * @param render_pass a render pass handle.
 * @param first_slot the vertex storage texture slot to begin binding from.
 * @param storage_textures an array of storage textures.
 * @param num_bindings the number of storage texture to bind from the array.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_CreateGPUShader
 *
 * @from SDL_gpu.h:3056 void SDL_BindGPUVertexStorageTextures(SDL_GPURenderPass *render_pass, Uint32 first_slot, SDL_GPUTexture *const *storage_textures, Uint32 num_bindings);
 */
SDL_BindGPUVertexStorageTextures: {
      parameters: ["pointer", "u32", "pointer", "u32"],
      result: "void"
    },


/**
 * Binds storage buffers for use on the vertex shader.
 *
 * These buffers must have been created with
 * SDL_GPU_BUFFERUSAGE_GRAPHICS_STORAGE_READ.
 *
 * Be sure your shader is set up according to the requirements documented in
 * SDL_CreateGPUShader().
 *
 * @param render_pass a render pass handle.
 * @param first_slot the vertex storage buffer slot to begin binding from.
 * @param storage_buffers an array of buffers.
 * @param num_bindings the number of buffers to bind from the array.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_CreateGPUShader
 *
 * @from SDL_gpu.h:3080 void SDL_BindGPUVertexStorageBuffers(SDL_GPURenderPass *render_pass, Uint32 first_slot, SDL_GPUBuffer *const *storage_buffers, Uint32 num_bindings);
 */
SDL_BindGPUVertexStorageBuffers: {
      parameters: ["pointer", "u32", "pointer", "u32"],
      result: "void"
    },


/**
 * Binds texture-sampler pairs for use on the fragment shader.
 *
 * The textures must have been created with SDL_GPU_TEXTUREUSAGE_SAMPLER.
 *
 * Be sure your shader is set up according to the requirements documented in
 * SDL_CreateGPUShader().
 *
 * @param render_pass a render pass handle.
 * @param first_slot the fragment sampler slot to begin binding from.
 * @param texture_sampler_bindings an array of texture-sampler binding
 *                                 structs.
 * @param num_bindings the number of texture-sampler pairs to bind from the
 *                     array.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_CreateGPUShader
 *
 * @from SDL_gpu.h:3105 void SDL_BindGPUFragmentSamplers(SDL_GPURenderPass *render_pass, Uint32 first_slot, const SDL_GPUTextureSamplerBinding *texture_sampler_bindings, Uint32 num_bindings);
 */
SDL_BindGPUFragmentSamplers: {
      parameters: ["pointer", "u32", "pointer", "u32"],
      result: "void"
    },


/**
 * Binds storage textures for use on the fragment shader.
 *
 * These textures must have been created with
 * SDL_GPU_TEXTUREUSAGE_GRAPHICS_STORAGE_READ.
 *
 * Be sure your shader is set up according to the requirements documented in
 * SDL_CreateGPUShader().
 *
 * @param render_pass a render pass handle.
 * @param first_slot the fragment storage texture slot to begin binding from.
 * @param storage_textures an array of storage textures.
 * @param num_bindings the number of storage textures to bind from the array.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_CreateGPUShader
 *
 * @from SDL_gpu.h:3129 void SDL_BindGPUFragmentStorageTextures(SDL_GPURenderPass *render_pass, Uint32 first_slot, SDL_GPUTexture *const *storage_textures, Uint32 num_bindings);
 */
SDL_BindGPUFragmentStorageTextures: {
      parameters: ["pointer", "u32", "pointer", "u32"],
      result: "void"
    },


/**
 * Binds storage buffers for use on the fragment shader.
 *
 * These buffers must have been created with
 * SDL_GPU_BUFFERUSAGE_GRAPHICS_STORAGE_READ.
 *
 * Be sure your shader is set up according to the requirements documented in
 * SDL_CreateGPUShader().
 *
 * @param render_pass a render pass handle.
 * @param first_slot the fragment storage buffer slot to begin binding from.
 * @param storage_buffers an array of storage buffers.
 * @param num_bindings the number of storage buffers to bind from the array.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_CreateGPUShader
 *
 * @from SDL_gpu.h:3153 void SDL_BindGPUFragmentStorageBuffers(SDL_GPURenderPass *render_pass, Uint32 first_slot, SDL_GPUBuffer *const *storage_buffers, Uint32 num_bindings);
 */
SDL_BindGPUFragmentStorageBuffers: {
      parameters: ["pointer", "u32", "pointer", "u32"],
      result: "void"
    },


/**
 * Draws data using bound graphics state with an index buffer and instancing
 * enabled.
 *
 * You must not call this function before binding a graphics pipeline.
 *
 * Note that the `first_vertex` and `first_instance` parameters are NOT
 * compatible with built-in vertex/instance ID variables in shaders (for
 * example, SV_VertexID); GPU APIs and shader languages do not define these
 * built-in variables consistently, so if your shader depends on them, the
 * only way to keep behavior consistent and portable is to always pass 0 for
 * the correlating parameter in the draw calls.
 *
 * @param render_pass a render pass handle.
 * @param num_indices the number of indices to draw per instance.
 * @param num_instances the number of instances to draw.
 * @param first_index the starting index within the index buffer.
 * @param vertex_offset value added to vertex index before indexing into the
 *                      vertex buffer.
 * @param first_instance the ID of the first instance to draw.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gpu.h:3184 void SDL_DrawGPUIndexedPrimitives(SDL_GPURenderPass *render_pass, Uint32 num_indices, Uint32 num_instances, Uint32 first_index, Sint32 vertex_offset, Uint32 first_instance);
 */
SDL_DrawGPUIndexedPrimitives: {
      parameters: ["pointer", "u32", "u32", "u32", "i32", "u32"],
      result: "void"
    },


/**
 * Draws data using bound graphics state.
 *
 * You must not call this function before binding a graphics pipeline.
 *
 * Note that the `first_vertex` and `first_instance` parameters are NOT
 * compatible with built-in vertex/instance ID variables in shaders (for
 * example, SV_VertexID); GPU APIs and shader languages do not define these
 * built-in variables consistently, so if your shader depends on them, the
 * only way to keep behavior consistent and portable is to always pass 0 for
 * the correlating parameter in the draw calls.
 *
 * @param render_pass a render pass handle.
 * @param num_vertices the number of vertices to draw.
 * @param num_instances the number of instances that will be drawn.
 * @param first_vertex the index of the first vertex to draw.
 * @param first_instance the ID of the first instance to draw.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gpu.h:3212 void SDL_DrawGPUPrimitives(SDL_GPURenderPass *render_pass, Uint32 num_vertices, Uint32 num_instances, Uint32 first_vertex, Uint32 first_instance);
 */
SDL_DrawGPUPrimitives: {
      parameters: ["pointer", "u32", "u32", "u32", "u32"],
      result: "void"
    },


/**
 * Draws data using bound graphics state and with draw parameters set from a
 * buffer.
 *
 * The buffer must consist of tightly-packed draw parameter sets that each
 * match the layout of SDL_GPUIndirectDrawCommand. You must not call this
 * function before binding a graphics pipeline.
 *
 * @param render_pass a render pass handle.
 * @param buffer a buffer containing draw parameters.
 * @param offset the offset to start reading from the draw buffer.
 * @param draw_count the number of draw parameter sets that should be read
 *                   from the draw buffer.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gpu.h:3235 void SDL_DrawGPUPrimitivesIndirect(SDL_GPURenderPass *render_pass, SDL_GPUBuffer *buffer, Uint32 offset, Uint32 draw_count);
 */
SDL_DrawGPUPrimitivesIndirect: {
      parameters: ["pointer", "pointer", "u32", "u32"],
      result: "void"
    },


/**
 * Draws data using bound graphics state with an index buffer enabled and with
 * draw parameters set from a buffer.
 *
 * The buffer must consist of tightly-packed draw parameter sets that each
 * match the layout of SDL_GPUIndexedIndirectDrawCommand. You must not call
 * this function before binding a graphics pipeline.
 *
 * @param render_pass a render pass handle.
 * @param buffer a buffer containing draw parameters.
 * @param offset the offset to start reading from the draw buffer.
 * @param draw_count the number of draw parameter sets that should be read
 *                   from the draw buffer.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gpu.h:3257 void SDL_DrawGPUIndexedPrimitivesIndirect(SDL_GPURenderPass *render_pass, SDL_GPUBuffer *buffer, Uint32 offset, Uint32 draw_count);
 */
SDL_DrawGPUIndexedPrimitivesIndirect: {
      parameters: ["pointer", "pointer", "u32", "u32"],
      result: "void"
    },


/**
 * Ends the given render pass.
 *
 * All bound graphics state on the render pass command buffer is unset. The
 * render pass handle is now invalid.
 *
 * @param render_pass a render pass handle.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gpu.h:3273 void SDL_EndGPURenderPass(SDL_GPURenderPass *render_pass);
 */
SDL_EndGPURenderPass: {
      parameters: ["pointer"],
      result: "void"
    },


/**
 * Begins a compute pass on a command buffer.
 *
 * A compute pass is defined by a set of texture subresources and buffers that
 * may be written to by compute pipelines. These textures and buffers must
 * have been created with the COMPUTE_STORAGE_WRITE bit or the
 * COMPUTE_STORAGE_SIMULTANEOUS_READ_WRITE bit. If you do not create a texture
 * with COMPUTE_STORAGE_SIMULTANEOUS_READ_WRITE, you must not read from the
 * texture in the compute pass. All operations related to compute pipelines
 * must take place inside of a compute pass. You must not begin another
 * compute pass, or a render pass or copy pass before ending the compute pass.
 *
 * A VERY IMPORTANT NOTE - Reads and writes in compute passes are NOT
 * implicitly synchronized. This means you may cause data races by both
 * reading and writing a resource region in a compute pass, or by writing
 * multiple times to a resource region. If your compute work depends on
 * reading the completed output from a previous dispatch, you MUST end the
 * current compute pass and begin a new one before you can safely access the
 * data. Otherwise you will receive unexpected results. Reading and writing a
 * texture in the same compute pass is only supported by specific texture
 * formats. Make sure you check the format support!
 *
 * @param command_buffer a command buffer.
 * @param storage_texture_bindings an array of writeable storage texture
 *                                 binding structs.
 * @param num_storage_texture_bindings the number of storage textures to bind
 *                                     from the array.
 * @param storage_buffer_bindings an array of writeable storage buffer binding
 *                                structs.
 * @param num_storage_buffer_bindings the number of storage buffers to bind
 *                                    from the array.
 * @returns a compute pass handle.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_EndGPUComputePass
 *
 * @from SDL_gpu.h:3315 SDL_GPUComputePass * SDL_BeginGPUComputePass(SDL_GPUCommandBuffer *command_buffer, const SDL_GPUStorageTextureReadWriteBinding *storage_texture_bindings, Uint32 num_storage_texture_bindings, const SDL_GPUStorageBufferReadWriteBinding *storage_buffer_bindings, Uint32 num_storage_buffer_bindings);
 */
SDL_BeginGPUComputePass: {
      parameters: ["pointer", "pointer", "u32", "pointer", "u32"],
      result: "pointer"
    },


/**
 * Binds a compute pipeline on a command buffer for use in compute dispatch.
 *
 * @param compute_pass a compute pass handle.
 * @param compute_pipeline a compute pipeline to bind.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gpu.h:3330 void SDL_BindGPUComputePipeline(SDL_GPUComputePass *compute_pass, SDL_GPUComputePipeline *compute_pipeline);
 */
SDL_BindGPUComputePipeline: {
      parameters: ["pointer", "pointer"],
      result: "void"
    },


/**
 * Binds texture-sampler pairs for use on the compute shader.
 *
 * The textures must have been created with SDL_GPU_TEXTUREUSAGE_SAMPLER.
 *
 * Be sure your shader is set up according to the requirements documented in
 * SDL_CreateGPUShader().
 *
 * @param compute_pass a compute pass handle.
 * @param first_slot the compute sampler slot to begin binding from.
 * @param texture_sampler_bindings an array of texture-sampler binding
 *                                 structs.
 * @param num_bindings the number of texture-sampler bindings to bind from the
 *                     array.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_CreateGPUShader
 *
 * @from SDL_gpu.h:3353 void SDL_BindGPUComputeSamplers(SDL_GPUComputePass *compute_pass, Uint32 first_slot, const SDL_GPUTextureSamplerBinding *texture_sampler_bindings, Uint32 num_bindings);
 */
SDL_BindGPUComputeSamplers: {
      parameters: ["pointer", "u32", "pointer", "u32"],
      result: "void"
    },


/**
 * Binds storage textures as readonly for use on the compute pipeline.
 *
 * These textures must have been created with
 * SDL_GPU_TEXTUREUSAGE_COMPUTE_STORAGE_READ.
 *
 * Be sure your shader is set up according to the requirements documented in
 * SDL_CreateGPUShader().
 *
 * @param compute_pass a compute pass handle.
 * @param first_slot the compute storage texture slot to begin binding from.
 * @param storage_textures an array of storage textures.
 * @param num_bindings the number of storage textures to bind from the array.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_CreateGPUShader
 *
 * @from SDL_gpu.h:3377 void SDL_BindGPUComputeStorageTextures(SDL_GPUComputePass *compute_pass, Uint32 first_slot, SDL_GPUTexture *const *storage_textures, Uint32 num_bindings);
 */
SDL_BindGPUComputeStorageTextures: {
      parameters: ["pointer", "u32", "pointer", "u32"],
      result: "void"
    },


/**
 * Binds storage buffers as readonly for use on the compute pipeline.
 *
 * These buffers must have been created with
 * SDL_GPU_BUFFERUSAGE_COMPUTE_STORAGE_READ.
 *
 * Be sure your shader is set up according to the requirements documented in
 * SDL_CreateGPUShader().
 *
 * @param compute_pass a compute pass handle.
 * @param first_slot the compute storage buffer slot to begin binding from.
 * @param storage_buffers an array of storage buffer binding structs.
 * @param num_bindings the number of storage buffers to bind from the array.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_CreateGPUShader
 *
 * @from SDL_gpu.h:3401 void SDL_BindGPUComputeStorageBuffers(SDL_GPUComputePass *compute_pass, Uint32 first_slot, SDL_GPUBuffer *const *storage_buffers, Uint32 num_bindings);
 */
SDL_BindGPUComputeStorageBuffers: {
      parameters: ["pointer", "u32", "pointer", "u32"],
      result: "void"
    },


/**
 * Dispatches compute work.
 *
 * You must not call this function before binding a compute pipeline.
 *
 * A VERY IMPORTANT NOTE If you dispatch multiple times in a compute pass, and
 * the dispatches write to the same resource region as each other, there is no
 * guarantee of which order the writes will occur. If the write order matters,
 * you MUST end the compute pass and begin another one.
 *
 * @param compute_pass a compute pass handle.
 * @param groupcount_x number of local workgroups to dispatch in the X
 *                     dimension.
 * @param groupcount_y number of local workgroups to dispatch in the Y
 *                     dimension.
 * @param groupcount_z number of local workgroups to dispatch in the Z
 *                     dimension.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gpu.h:3427 void SDL_DispatchGPUCompute(SDL_GPUComputePass *compute_pass, Uint32 groupcount_x, Uint32 groupcount_y, Uint32 groupcount_z);
 */
SDL_DispatchGPUCompute: {
      parameters: ["pointer", "u32", "u32", "u32"],
      result: "void"
    },


/**
 * Dispatches compute work with parameters set from a buffer.
 *
 * The buffer layout should match the layout of
 * SDL_GPUIndirectDispatchCommand. You must not call this function before
 * binding a compute pipeline.
 *
 * A VERY IMPORTANT NOTE If you dispatch multiple times in a compute pass, and
 * the dispatches write to the same resource region as each other, there is no
 * guarantee of which order the writes will occur. If the write order matters,
 * you MUST end the compute pass and begin another one.
 *
 * @param compute_pass a compute pass handle.
 * @param buffer a buffer containing dispatch parameters.
 * @param offset the offset to start reading from the dispatch buffer.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gpu.h:3451 void SDL_DispatchGPUComputeIndirect(SDL_GPUComputePass *compute_pass, SDL_GPUBuffer *buffer, Uint32 offset);
 */
SDL_DispatchGPUComputeIndirect: {
      parameters: ["pointer", "pointer", "u32"],
      result: "void"
    },


/**
 * Ends the current compute pass.
 *
 * All bound compute state on the command buffer is unset. The compute pass
 * handle is now invalid.
 *
 * @param compute_pass a compute pass handle.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gpu.h:3466 void SDL_EndGPUComputePass(SDL_GPUComputePass *compute_pass);
 */
SDL_EndGPUComputePass: {
      parameters: ["pointer"],
      result: "void"
    },


/**
 * Maps a transfer buffer into application address space.
 *
 * You must unmap the transfer buffer before encoding upload commands. The
 * memory is owned by the graphics driver - do NOT call SDL_free() on the
 * returned pointer.
 *
 * @param device a GPU context.
 * @param transfer_buffer a transfer buffer.
 * @param cycle if true, cycles the transfer buffer if it is already bound.
 * @returns the address of the mapped transfer buffer memory, or NULL on
 *          failure; call SDL_GetError() for more information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gpu.h:3486 void * SDL_MapGPUTransferBuffer(SDL_GPUDevice *device, SDL_GPUTransferBuffer *transfer_buffer, bool cycle);
 */
SDL_MapGPUTransferBuffer: {
      parameters: ["pointer", "pointer", "bool"],
      result: "pointer"
    },


/**
 * Unmaps a previously mapped transfer buffer.
 *
 * @param device a GPU context.
 * @param transfer_buffer a previously mapped transfer buffer.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gpu.h:3499 void SDL_UnmapGPUTransferBuffer(SDL_GPUDevice *device, SDL_GPUTransferBuffer *transfer_buffer);
 */
SDL_UnmapGPUTransferBuffer: {
      parameters: ["pointer", "pointer"],
      result: "void"
    },


/**
 * Begins a copy pass on a command buffer.
 *
 * All operations related to copying to or from buffers or textures take place
 * inside a copy pass. You must not begin another copy pass, or a render pass
 * or compute pass before ending the copy pass.
 *
 * @param command_buffer a command buffer.
 * @returns a copy pass handle.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gpu.h:3517 SDL_GPUCopyPass * SDL_BeginGPUCopyPass(SDL_GPUCommandBuffer *command_buffer);
 */
SDL_BeginGPUCopyPass: {
      parameters: ["pointer"],
      result: "pointer"
    },


/**
 * Uploads data from a transfer buffer to a texture.
 *
 * The upload occurs on the GPU timeline. You may assume that the upload has
 * finished in subsequent commands.
 *
 * You must align the data in the transfer buffer to a multiple of the texel
 * size of the texture format.
 *
 * @param copy_pass a copy pass handle.
 * @param source the source transfer buffer with image layout information.
 * @param destination the destination texture region.
 * @param cycle if true, cycles the texture if the texture is bound, otherwise
 *              overwrites the data.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gpu.h:3537 void SDL_UploadToGPUTexture(SDL_GPUCopyPass *copy_pass, const SDL_GPUTextureTransferInfo *source, const SDL_GPUTextureRegion *destination, bool cycle);
 */
SDL_UploadToGPUTexture: {
      parameters: ["pointer", "pointer", "pointer", "bool"],
      result: "void"
    },


/**
 * Uploads data from a transfer buffer to a buffer.
 *
 * The upload occurs on the GPU timeline. You may assume that the upload has
 * finished in subsequent commands.
 *
 * @param copy_pass a copy pass handle.
 * @param source the source transfer buffer with offset.
 * @param destination the destination buffer with offset and size.
 * @param cycle if true, cycles the buffer if it is already bound, otherwise
 *              overwrites the data.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gpu.h:3557 void SDL_UploadToGPUBuffer(SDL_GPUCopyPass *copy_pass, const SDL_GPUTransferBufferLocation *source, const SDL_GPUBufferRegion *destination, bool cycle);
 */
SDL_UploadToGPUBuffer: {
      parameters: ["pointer", "pointer", "pointer", "bool"],
      result: "void"
    },


/**
 * Performs a texture-to-texture copy.
 *
 * This copy occurs on the GPU timeline. You may assume the copy has finished
 * in subsequent commands.
 *
 * @param copy_pass a copy pass handle.
 * @param source a source texture region.
 * @param destination a destination texture region.
 * @param w the width of the region to copy.
 * @param h the height of the region to copy.
 * @param d the depth of the region to copy.
 * @param cycle if true, cycles the destination texture if the destination
 *              texture is bound, otherwise overwrites the data.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gpu.h:3580 void SDL_CopyGPUTextureToTexture(SDL_GPUCopyPass *copy_pass, const SDL_GPUTextureLocation *source, const SDL_GPUTextureLocation *destination, Uint32 w, Uint32 h, Uint32 d, bool cycle);
 */
SDL_CopyGPUTextureToTexture: {
      parameters: ["pointer", "pointer", "pointer", "u32", "u32", "u32", "bool"],
      result: "void"
    },


/**
 * Performs a buffer-to-buffer copy.
 *
 * This copy occurs on the GPU timeline. You may assume the copy has finished
 * in subsequent commands.
 *
 * @param copy_pass a copy pass handle.
 * @param source the buffer and offset to copy from.
 * @param destination the buffer and offset to copy to.
 * @param size the length of the buffer to copy.
 * @param cycle if true, cycles the destination buffer if it is already bound,
 *              otherwise overwrites the data.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gpu.h:3604 void SDL_CopyGPUBufferToBuffer(SDL_GPUCopyPass *copy_pass, const SDL_GPUBufferLocation *source, const SDL_GPUBufferLocation *destination, Uint32 size, bool cycle);
 */
SDL_CopyGPUBufferToBuffer: {
      parameters: ["pointer", "pointer", "pointer", "u32", "bool"],
      result: "void"
    },


/**
 * Copies data from a texture to a transfer buffer on the GPU timeline.
 *
 * This data is not guaranteed to be copied until the command buffer fence is
 * signaled.
 *
 * @param copy_pass a copy pass handle.
 * @param source the source texture region.
 * @param destination the destination transfer buffer with image layout
 *                    information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gpu.h:3624 void SDL_DownloadFromGPUTexture(SDL_GPUCopyPass *copy_pass, const SDL_GPUTextureRegion *source, const SDL_GPUTextureTransferInfo *destination);
 */
SDL_DownloadFromGPUTexture: {
      parameters: ["pointer", "pointer", "pointer"],
      result: "void"
    },


/**
 * Copies data from a buffer to a transfer buffer on the GPU timeline.
 *
 * This data is not guaranteed to be copied until the command buffer fence is
 * signaled.
 *
 * @param copy_pass a copy pass handle.
 * @param source the source buffer with offset and size.
 * @param destination the destination transfer buffer with offset.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gpu.h:3641 void SDL_DownloadFromGPUBuffer(SDL_GPUCopyPass *copy_pass, const SDL_GPUBufferRegion *source, const SDL_GPUTransferBufferLocation *destination);
 */
SDL_DownloadFromGPUBuffer: {
      parameters: ["pointer", "pointer", "pointer"],
      result: "void"
    },


/**
 * Ends the current copy pass.
 *
 * @param copy_pass a copy pass handle.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gpu.h:3653 void SDL_EndGPUCopyPass(SDL_GPUCopyPass *copy_pass);
 */
SDL_EndGPUCopyPass: {
      parameters: ["pointer"],
      result: "void"
    },


/**
 * Generates mipmaps for the given texture.
 *
 * This function must not be called inside of any pass.
 *
 * @param command_buffer a command_buffer.
 * @param texture a texture with more than 1 mip level.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gpu.h:3666 void SDL_GenerateMipmapsForGPUTexture(SDL_GPUCommandBuffer *command_buffer, SDL_GPUTexture *texture);
 */
SDL_GenerateMipmapsForGPUTexture: {
      parameters: ["pointer", "pointer"],
      result: "void"
    },


/**
 * Blits from a source texture region to a destination texture region.
 *
 * This function must not be called inside of any pass.
 *
 * @param command_buffer a command buffer.
 * @param info the blit info struct containing the blit parameters.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gpu.h:3680 void SDL_BlitGPUTexture(SDL_GPUCommandBuffer *command_buffer, const SDL_GPUBlitInfo *info);
 */
SDL_BlitGPUTexture: {
      parameters: ["pointer", "pointer"],
      result: "void"
    },


/**
 * Determines whether a swapchain composition is supported by the window.
 *
 * The window must be claimed before calling this function.
 *
 * @param device a GPU context.
 * @param window an SDL_Window.
 * @param swapchain_composition the swapchain composition to check.
 * @returns true if supported, false if unsupported.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_ClaimWindowForGPUDevice
 *
 * @from SDL_gpu.h:3700 bool SDL_WindowSupportsGPUSwapchainComposition(SDL_GPUDevice *device, SDL_Window *window, SDL_GPUSwapchainComposition swapchain_composition);
 */
SDL_WindowSupportsGPUSwapchainComposition: {
      parameters: ["pointer", "pointer", "u32"],
      result: "bool"
    },


/**
 * Determines whether a presentation mode is supported by the window.
 *
 * The window must be claimed before calling this function.
 *
 * @param device a GPU context.
 * @param window an SDL_Window.
 * @param present_mode the presentation mode to check.
 * @returns true if supported, false if unsupported.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_ClaimWindowForGPUDevice
 *
 * @from SDL_gpu.h:3719 bool SDL_WindowSupportsGPUPresentMode(SDL_GPUDevice *device, SDL_Window *window, SDL_GPUPresentMode present_mode);
 */
SDL_WindowSupportsGPUPresentMode: {
      parameters: ["pointer", "pointer", "u32"],
      result: "bool"
    },


/**
 * Claims a window, creating a swapchain structure for it.
 *
 * This must be called before SDL_AcquireGPUSwapchainTexture is called using
 * the window. You should only call this function from the thread that created
 * the window.
 *
 * The swapchain will be created with SDL_GPU_SWAPCHAINCOMPOSITION_SDR and
 * SDL_GPU_PRESENTMODE_VSYNC. If you want to have different swapchain
 * parameters, you must call SDL_SetGPUSwapchainParameters after claiming the
 * window.
 *
 * @param device a GPU context.
 * @param window an SDL_Window.
 * @returns true on success, or false on failure; call SDL_GetError() for more
 *          information.
 *
 * @threadsafety This function should only be called from the thread that
 *               created the window.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_WaitAndAcquireGPUSwapchainTexture
 * @sa SDL_ReleaseWindowFromGPUDevice
 * @sa SDL_WindowSupportsGPUPresentMode
 * @sa SDL_WindowSupportsGPUSwapchainComposition
 *
 * @from SDL_gpu.h:3751 bool SDL_ClaimWindowForGPUDevice(SDL_GPUDevice *device, SDL_Window *window);
 */
SDL_ClaimWindowForGPUDevice: {
      parameters: ["pointer", "pointer"],
      result: "bool"
    },


/**
 * Unclaims a window, destroying its swapchain structure.
 *
 * @param device a GPU context.
 * @param window an SDL_Window that has been claimed.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_ClaimWindowForGPUDevice
 *
 * @from SDL_gpu.h:3765 void SDL_ReleaseWindowFromGPUDevice(SDL_GPUDevice *device, SDL_Window *window);
 */
SDL_ReleaseWindowFromGPUDevice: {
      parameters: ["pointer", "pointer"],
      result: "void"
    },


/**
 * Changes the swapchain parameters for the given claimed window.
 *
 * This function will fail if the requested present mode or swapchain
 * composition are unsupported by the device. Check if the parameters are
 * supported via SDL_WindowSupportsGPUPresentMode /
 * SDL_WindowSupportsGPUSwapchainComposition prior to calling this function.
 *
 * SDL_GPU_PRESENTMODE_VSYNC with SDL_GPU_SWAPCHAINCOMPOSITION_SDR are always
 * supported.
 *
 * @param device a GPU context.
 * @param window an SDL_Window that has been claimed.
 * @param swapchain_composition the desired composition of the swapchain.
 * @param present_mode the desired present mode for the swapchain.
 * @returns true if successful, false on error; call SDL_GetError() for more
 *          information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_WindowSupportsGPUPresentMode
 * @sa SDL_WindowSupportsGPUSwapchainComposition
 *
 * @from SDL_gpu.h:3792 bool SDL_SetGPUSwapchainParameters(SDL_GPUDevice *device, SDL_Window *window, SDL_GPUSwapchainComposition swapchain_composition, SDL_GPUPresentMode present_mode);
 */
SDL_SetGPUSwapchainParameters: {
      parameters: ["pointer", "pointer", "u32", "u32"],
      result: "bool"
    },


/**
 * Configures the maximum allowed number of frames in flight.
 *
 * The default value when the device is created is 2. This means that after
 * you have submitted 2 frames for presentation, if the GPU has not finished
 * working on the first frame, SDL_AcquireGPUSwapchainTexture() will fill the
 * swapchain texture pointer with NULL, and
 * SDL_WaitAndAcquireGPUSwapchainTexture() will block.
 *
 * Higher values increase throughput at the expense of visual latency. Lower
 * values decrease visual latency at the expense of throughput.
 *
 * Note that calling this function will stall and flush the command queue to
 * prevent synchronization issues.
 *
 * The minimum value of allowed frames in flight is 1, and the maximum is 3.
 *
 * @param device a GPU context.
 * @param allowed_frames_in_flight the maximum number of frames that can be
 *                                 pending on the GPU.
 * @returns true if successful, false on error; call SDL_GetError() for more
 *          information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gpu.h:3823 bool SDL_SetGPUAllowedFramesInFlight(SDL_GPUDevice *device, Uint32 allowed_frames_in_flight);
 */
SDL_SetGPUAllowedFramesInFlight: {
      parameters: ["pointer", "u32"],
      result: "bool"
    },


/**
 * Obtains the texture format of the swapchain for the given window.
 *
 * Note that this format can change if the swapchain parameters change.
 *
 * @param device a GPU context.
 * @param window an SDL_Window that has been claimed.
 * @returns the texture format of the swapchain.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gpu.h:3838 SDL_GPUTextureFormat SDL_GetGPUSwapchainTextureFormat(SDL_GPUDevice *device, SDL_Window *window);
 */
SDL_GetGPUSwapchainTextureFormat: {
      parameters: ["pointer", "pointer"],
      result: "u32"
    },


/**
 * Acquire a texture to use in presentation.
 *
 * When a swapchain texture is acquired on a command buffer, it will
 * automatically be submitted for presentation when the command buffer is
 * submitted. The swapchain texture should only be referenced by the command
 * buffer used to acquire it.
 *
 * This function will fill the swapchain texture handle with NULL if too many
 * frames are in flight. This is not an error.
 *
 * If you use this function, it is possible to create a situation where many
 * command buffers are allocated while the rendering context waits for the GPU
 * to catch up, which will cause memory usage to grow. You should use
 * SDL_WaitAndAcquireGPUSwapchainTexture() unless you know what you are doing
 * with timing.
 *
 * The swapchain texture is managed by the implementation and must not be
 * freed by the user. You MUST NOT call this function from any thread other
 * than the one that created the window.
 *
 * @param command_buffer a command buffer.
 * @param window a window that has been claimed.
 * @param swapchain_texture a pointer filled in with a swapchain texture
 *                          handle.
 * @param swapchain_texture_width a pointer filled in with the swapchain
 *                                texture width, may be NULL.
 * @param swapchain_texture_height a pointer filled in with the swapchain
 *                                 texture height, may be NULL.
 * @returns true on success, false on error; call SDL_GetError() for more
 *          information.
 *
 * @threadsafety This function should only be called from the thread that
 *               created the window.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_ClaimWindowForGPUDevice
 * @sa SDL_SubmitGPUCommandBuffer
 * @sa SDL_SubmitGPUCommandBufferAndAcquireFence
 * @sa SDL_CancelGPUCommandBuffer
 * @sa SDL_GetWindowSizeInPixels
 * @sa SDL_WaitForGPUSwapchain
 * @sa SDL_WaitAndAcquireGPUSwapchainTexture
 * @sa SDL_SetGPUAllowedFramesInFlight
 *
 * @from SDL_gpu.h:3888 bool SDL_AcquireGPUSwapchainTexture(SDL_GPUCommandBuffer *command_buffer, SDL_Window *window, SDL_GPUTexture **swapchain_texture, Uint32 *swapchain_texture_width, Uint32 *swapchain_texture_height);
 */
SDL_AcquireGPUSwapchainTexture: {
      parameters: ["pointer", "pointer", "pointer", "pointer", "pointer"],
      result: "bool"
    },


/**
 * Blocks the thread until a swapchain texture is available to be acquired.
 *
 * @param device a GPU context.
 * @param window a window that has been claimed.
 * @returns true on success, false on failure; call SDL_GetError() for more
 *          information.
 *
 * @threadsafety This function should only be called from the thread that
 *               created the window.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_AcquireGPUSwapchainTexture
 * @sa SDL_WaitAndAcquireGPUSwapchainTexture
 * @sa SDL_SetGPUAllowedFramesInFlight
 *
 * @from SDL_gpu.h:3912 bool SDL_WaitForGPUSwapchain(SDL_GPUDevice *device, SDL_Window *window);
 */
SDL_WaitForGPUSwapchain: {
      parameters: ["pointer", "pointer"],
      result: "bool"
    },


/**
 * Blocks the thread until a swapchain texture is available to be acquired,
 * and then acquires it.
 *
 * When a swapchain texture is acquired on a command buffer, it will
 * automatically be submitted for presentation when the command buffer is
 * submitted. The swapchain texture should only be referenced by the command
 * buffer used to acquire it. It is an error to call
 * SDL_CancelGPUCommandBuffer() after a swapchain texture is acquired.
 *
 * This function can fill the swapchain texture handle with NULL in certain
 * cases, for example if the window is minimized. This is not an error. You
 * should always make sure to check whether the pointer is NULL before
 * actually using it.
 *
 * The swapchain texture is managed by the implementation and must not be
 * freed by the user. You MUST NOT call this function from any thread other
 * than the one that created the window.
 *
 * The swapchain texture is write-only and cannot be used as a sampler or for
 * another reading operation.
 *
 * @param command_buffer a command buffer.
 * @param window a window that has been claimed.
 * @param swapchain_texture a pointer filled in with a swapchain texture
 *                          handle.
 * @param swapchain_texture_width a pointer filled in with the swapchain
 *                                texture width, may be NULL.
 * @param swapchain_texture_height a pointer filled in with the swapchain
 *                                 texture height, may be NULL.
 * @returns true on success, false on error; call SDL_GetError() for more
 *          information.
 *
 * @threadsafety This function should only be called from the thread that
 *               created the window.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_SubmitGPUCommandBuffer
 * @sa SDL_SubmitGPUCommandBufferAndAcquireFence
 * @sa SDL_AcquireGPUSwapchainTexture
 *
 * @from SDL_gpu.h:3958 bool SDL_WaitAndAcquireGPUSwapchainTexture(SDL_GPUCommandBuffer *command_buffer, SDL_Window *window, SDL_GPUTexture **swapchain_texture, Uint32 *swapchain_texture_width, Uint32 *swapchain_texture_height);
 */
SDL_WaitAndAcquireGPUSwapchainTexture: {
      parameters: ["pointer", "pointer", "pointer", "pointer", "pointer"],
      result: "bool"
    },


/**
 * Submits a command buffer so its commands can be processed on the GPU.
 *
 * It is invalid to use the command buffer after this is called.
 *
 * This must be called from the thread the command buffer was acquired on.
 *
 * All commands in the submission are guaranteed to begin executing before any
 * command in a subsequent submission begins executing.
 *
 * @param command_buffer a command buffer.
 * @returns true on success, false on failure; call SDL_GetError() for more
 *          information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_AcquireGPUCommandBuffer
 * @sa SDL_WaitAndAcquireGPUSwapchainTexture
 * @sa SDL_AcquireGPUSwapchainTexture
 * @sa SDL_SubmitGPUCommandBufferAndAcquireFence
 *
 * @from SDL_gpu.h:3986 bool SDL_SubmitGPUCommandBuffer(SDL_GPUCommandBuffer *command_buffer);
 */
SDL_SubmitGPUCommandBuffer: {
      parameters: ["pointer"],
      result: "bool"
    },


/**
 * Submits a command buffer so its commands can be processed on the GPU, and
 * acquires a fence associated with the command buffer.
 *
 * You must release this fence when it is no longer needed or it will cause a
 * leak. It is invalid to use the command buffer after this is called.
 *
 * This must be called from the thread the command buffer was acquired on.
 *
 * All commands in the submission are guaranteed to begin executing before any
 * command in a subsequent submission begins executing.
 *
 * @param command_buffer a command buffer.
 * @returns a fence associated with the command buffer, or NULL on failure;
 *          call SDL_GetError() for more information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_AcquireGPUCommandBuffer
 * @sa SDL_WaitAndAcquireGPUSwapchainTexture
 * @sa SDL_AcquireGPUSwapchainTexture
 * @sa SDL_SubmitGPUCommandBuffer
 * @sa SDL_ReleaseGPUFence
 *
 * @from SDL_gpu.h:4013 SDL_GPUFence * SDL_SubmitGPUCommandBufferAndAcquireFence(SDL_GPUCommandBuffer *command_buffer);
 */
SDL_SubmitGPUCommandBufferAndAcquireFence: {
      parameters: ["pointer"],
      result: "pointer"
    },


/**
 * Cancels a command buffer.
 *
 * None of the enqueued commands are executed.
 *
 * It is an error to call this function after a swapchain texture has been
 * acquired.
 *
 * This must be called from the thread the command buffer was acquired on.
 *
 * You must not reference the command buffer after calling this function.
 *
 * @param command_buffer a command buffer.
 * @returns true on success, false on error; call SDL_GetError() for more
 *          information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_WaitAndAcquireGPUSwapchainTexture
 * @sa SDL_AcquireGPUCommandBuffer
 * @sa SDL_AcquireGPUSwapchainTexture
 *
 * @from SDL_gpu.h:4038 bool SDL_CancelGPUCommandBuffer(SDL_GPUCommandBuffer *command_buffer);
 */
SDL_CancelGPUCommandBuffer: {
      parameters: ["pointer"],
      result: "bool"
    },


/**
 * Blocks the thread until the GPU is completely idle.
 *
 * @param device a GPU context.
 * @returns true on success, false on failure; call SDL_GetError() for more
 *          information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_WaitForGPUFences
 *
 * @from SDL_gpu.h:4052 bool SDL_WaitForGPUIdle(SDL_GPUDevice *device);
 */
SDL_WaitForGPUIdle: {
      parameters: ["pointer"],
      result: "bool"
    },


/**
 * Blocks the thread until the given fences are signaled.
 *
 * @param device a GPU context.
 * @param wait_all if 0, wait for any fence to be signaled, if 1, wait for all
 *                 fences to be signaled.
 * @param fences an array of fences to wait on.
 * @param num_fences the number of fences in the fences array.
 * @returns true on success, false on failure; call SDL_GetError() for more
 *          information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_SubmitGPUCommandBufferAndAcquireFence
 * @sa SDL_WaitForGPUIdle
 *
 * @from SDL_gpu.h:4071 bool SDL_WaitForGPUFences(SDL_GPUDevice *device, bool wait_all, SDL_GPUFence *const *fences, Uint32 num_fences);
 */
SDL_WaitForGPUFences: {
      parameters: ["pointer", "bool", "pointer", "u32"],
      result: "bool"
    },


/**
 * Checks the status of a fence.
 *
 * @param device a GPU context.
 * @param fence a fence.
 * @returns true if the fence is signaled, false if it is not.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_SubmitGPUCommandBufferAndAcquireFence
 *
 * @from SDL_gpu.h:4088 bool SDL_QueryGPUFence(SDL_GPUDevice *device, SDL_GPUFence *fence);
 */
SDL_QueryGPUFence: {
      parameters: ["pointer", "pointer"],
      result: "bool"
    },


/**
 * Releases a fence obtained from SDL_SubmitGPUCommandBufferAndAcquireFence.
 *
 * You must not reference the fence after calling this function.
 *
 * @param device a GPU context.
 * @param fence a fence.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_SubmitGPUCommandBufferAndAcquireFence
 *
 * @from SDL_gpu.h:4104 void SDL_ReleaseGPUFence(SDL_GPUDevice *device, SDL_GPUFence *fence);
 */
SDL_ReleaseGPUFence: {
      parameters: ["pointer", "pointer"],
      result: "void"
    },


/**
 * Obtains the texel block size for a texture format.
 *
 * @param format the texture format you want to know the texel size of.
 * @returns the texel block size of the texture format.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_UploadToGPUTexture
 *
 * @from SDL_gpu.h:4120 Uint32 SDL_GPUTextureFormatTexelBlockSize(SDL_GPUTextureFormat format);
 */
SDL_GPUTextureFormatTexelBlockSize: {
      parameters: ["u32"],
      result: "u32"
    },


/**
 * Determines whether a texture format is supported for a given type and
 * usage.
 *
 * @param device a GPU context.
 * @param format the texture format to check.
 * @param type the type of texture (2D, 3D, Cube).
 * @param usage a bitmask of all usage scenarios to check.
 * @returns whether the texture format is supported for this type and usage.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gpu.h:4135 bool SDL_GPUTextureSupportsFormat(SDL_GPUDevice *device, SDL_GPUTextureFormat format, SDL_GPUTextureType type, SDL_GPUTextureUsageFlags usage);
 */
SDL_GPUTextureSupportsFormat: {
      parameters: ["pointer", "u32", "u32", "u32"],
      result: "bool"
    },


/**
 * Determines if a sample count for a texture format is supported.
 *
 * @param device a GPU context.
 * @param format the texture format to check.
 * @param sample_count the sample count to check.
 * @returns whether the sample count is supported for this texture format.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gpu.h:4151 bool SDL_GPUTextureSupportsSampleCount(SDL_GPUDevice *device, SDL_GPUTextureFormat format, SDL_GPUSampleCount sample_count);
 */
SDL_GPUTextureSupportsSampleCount: {
      parameters: ["pointer", "u32", "u32"],
      result: "bool"
    },


/**
 * Calculate the size in bytes of a texture format with dimensions.
 *
 * @param format a texture format.
 * @param width width in pixels.
 * @param height height in pixels.
 * @param depth_or_layer_count depth for 3D textures or layer count otherwise.
 * @returns the size of a texture with this format and dimensions.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_gpu.h:4167 Uint32 SDL_CalculateGPUTextureFormatSize(SDL_GPUTextureFormat format, Uint32 width, Uint32 height, Uint32 depth_or_layer_count);
 */
SDL_CalculateGPUTextureFormatSize: {
      parameters: ["u32", "u32", "u32", "u32"],
      result: "u32"
    },

} as const satisfies Deno.ForeignLibraryInterface;

export const GDK_symbols = {

/**
 * Call this to suspend GPU operation on Xbox when you receive the
 * SDL_EVENT_DID_ENTER_BACKGROUND event.
 *
 * Do NOT call any SDL_GPU functions after calling this function! This must
 * also be called before calling SDL_GDKSuspendComplete.
 *
 * @param device a GPU context.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_AddEventWatch
 *
 * @from SDL_gpu.h:4188 void SDL_GDKSuspendGPU(SDL_GPUDevice *device);
 * @platformSpecific GDK SDL_gpu.h:4173 #ifdef SDL_PLATFORM_GDK
 */
SDL_GDKSuspendGPU: {
      parameters: ["pointer"],
      result: "void"
    },


/**
 * Call this to resume GPU operation on Xbox when you receive the
 * SDL_EVENT_WILL_ENTER_FOREGROUND event.
 *
 * When resuming, this function MUST be called before calling any other
 * SDL_GPU functions.
 *
 * @param device a GPU context.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_AddEventWatch
 *
 * @from SDL_gpu.h:4203 void SDL_GDKResumeGPU(SDL_GPUDevice *device);
 * @platformSpecific GDK SDL_gpu.h:4173 #ifdef SDL_PLATFORM_GDK
 */
SDL_GDKResumeGPU: {
      parameters: ["pointer"],
      result: "void"
    },

} as const satisfies Deno.ForeignLibraryInterface;
