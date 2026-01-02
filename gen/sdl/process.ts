/**
 * # CategoryProcess
 *
 * Process control support.
 *
 * These functions provide a cross-platform way to spawn and manage OS-level
 * processes.
 *
 * You can create a new subprocess with SDL_CreateProcess() and optionally
 * read and write to it using SDL_ReadProcess() or SDL_GetProcessInput() and
 * SDL_GetProcessOutput(). If more advanced functionality like chaining input
 * between processes is necessary, you can use
 * SDL_CreateProcessWithProperties().
 *
 * You can get the status of a created process with SDL_WaitProcess(), or
 * terminate the process with SDL_KillProcess().
 *
 * Don't forget to call SDL_DestroyProcess() to clean up, whether the process
 * process was killed, terminated on its own, or is still running!
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

import { lib } from "./lib.ts";
import * as _p from "@g9wp/ptr";


export {
  PROP_PROCESS_CREATE as PROP_PROCESS_CREATE,
  PROP_PROCESS as PROP_PROCESS,
  SDL_ProcessIO as PROCESS_STDIO,
} from "../enums/SDL_process.ts"

/**
 * Create a new process.
 *
 * The path to the executable is supplied in args[0]. args[1..N] are
 * additional arguments passed on the command line of the new process, and the
 * argument list should be terminated with a NULL, e.g.:
 *
 * ```c
 * const char *args[] = { "myprogram", "argument", NULL };
 * ```
 *
 * Setting pipe_stdio to true is equivalent to setting
 * `SDL_PROP_PROCESS_CREATE_STDIN_NUMBER` and
 * `SDL_PROP_PROCESS_CREATE_STDOUT_NUMBER` to `SDL_PROCESS_STDIO_APP`, and
 * will allow the use of SDL_ReadProcess() or SDL_GetProcessInput() and
 * SDL_GetProcessOutput().
 *
 * See SDL_CreateProcessWithProperties() for more details.
 *
 * @param args the path and arguments for the new process.
 * @param pipe_stdio true to create pipes to the process's standard input and
 *                   from the process's standard output, false for the process
 *                   to have no input and inherit the application's standard
 *                   output.
 * @returns the newly created and running process, or NULL if the process
 *          couldn't be created.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_CreateProcessWithProperties
 * @sa SDL_GetProcessProperties
 * @sa SDL_ReadProcess
 * @sa SDL_GetProcessInput
 * @sa SDL_GetProcessOutput
 * @sa SDL_KillProcess
 * @sa SDL_WaitProcess
 * @sa SDL_DestroyProcess
 *
 * @from SDL_process.h:105 SDL_Process * SDL_CreateProcess(const char * const *args, bool pipe_stdio);
 */
export function createProcess(args: Deno.PointerValue, pipe_stdio: boolean): Deno.PointerValue<"SDL_Process"> {
  return lib.symbols.SDL_CreateProcess(args, pipe_stdio) as Deno.PointerValue<"SDL_Process">;
}

/**
 * Create a new process with the specified properties.
 *
 * These are the supported properties:
 *
 * - `SDL_PROP_PROCESS_CREATE_ARGS_POINTER`: an array of strings containing
 *   the program to run, any arguments, and a NULL pointer, e.g. const char
 *   *args[] = { "myprogram", "argument", NULL }. This is a required property.
 * - `SDL_PROP_PROCESS_CREATE_ENVIRONMENT_POINTER`: an SDL_Environment
 *   pointer. If this property is set, it will be the entire environment for
 *   the process, otherwise the current environment is used.
 * - `SDL_PROP_PROCESS_CREATE_WORKING_DIRECTORY_STRING`: a UTF-8 encoded
 *   string representing the working directory for the process, defaults to
 *   the current working directory.
 * - `SDL_PROP_PROCESS_CREATE_STDIN_NUMBER`: an SDL_ProcessIO value describing
 *   where standard input for the process comes from, defaults to
 *   `SDL_PROCESS_STDIO_NULL`.
 * - `SDL_PROP_PROCESS_CREATE_STDIN_POINTER`: an SDL_IOStream pointer used for
 *   standard input when `SDL_PROP_PROCESS_CREATE_STDIN_NUMBER` is set to
 *   `SDL_PROCESS_STDIO_REDIRECT`.
 * - `SDL_PROP_PROCESS_CREATE_STDOUT_NUMBER`: an SDL_ProcessIO value
 *   describing where standard output for the process goes to, defaults to
 *   `SDL_PROCESS_STDIO_INHERITED`.
 * - `SDL_PROP_PROCESS_CREATE_STDOUT_POINTER`: an SDL_IOStream pointer used
 *   for standard output when `SDL_PROP_PROCESS_CREATE_STDOUT_NUMBER` is set
 *   to `SDL_PROCESS_STDIO_REDIRECT`.
 * - `SDL_PROP_PROCESS_CREATE_STDERR_NUMBER`: an SDL_ProcessIO value
 *   describing where standard error for the process goes to, defaults to
 *   `SDL_PROCESS_STDIO_INHERITED`.
 * - `SDL_PROP_PROCESS_CREATE_STDERR_POINTER`: an SDL_IOStream pointer used
 *   for standard error when `SDL_PROP_PROCESS_CREATE_STDERR_NUMBER` is set to
 *   `SDL_PROCESS_STDIO_REDIRECT`.
 * - `SDL_PROP_PROCESS_CREATE_STDERR_TO_STDOUT_BOOLEAN`: true if the error
 *   output of the process should be redirected into the standard output of
 *   the process. This property has no effect if
 *   `SDL_PROP_PROCESS_CREATE_STDERR_NUMBER` is set.
 * - `SDL_PROP_PROCESS_CREATE_BACKGROUND_BOOLEAN`: true if the process should
 *   run in the background. In this case the default input and output is
 *   `SDL_PROCESS_STDIO_NULL` and the exitcode of the process is not
 *   available, and will always be 0.
 * - `SDL_PROP_PROCESS_CREATE_CMDLINE_STRING`: a string containing the program
 *   to run and any parameters. This string is passed directly to
 *   `CreateProcess` on Windows, and does nothing on other platforms. This
 *   property is only important if you want to start programs that does
 *   non-standard command-line processing, and in most cases using
 *   `SDL_PROP_PROCESS_CREATE_ARGS_POINTER` is sufficient.
 *
 * On POSIX platforms, wait() and waitpid(-1, ...) should not be called, and
 * SIGCHLD should not be ignored or handled because those would prevent SDL
 * from properly tracking the lifetime of the underlying process. You should
 * use SDL_WaitProcess() instead.
 *
 * @param props the properties to use.
 * @returns the newly created and running process, or NULL if the process
 *          couldn't be created.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_CreateProcess
 * @sa SDL_GetProcessProperties
 * @sa SDL_ReadProcess
 * @sa SDL_GetProcessInput
 * @sa SDL_GetProcessOutput
 * @sa SDL_KillProcess
 * @sa SDL_WaitProcess
 * @sa SDL_DestroyProcess
 *
 * @from SDL_process.h:226 SDL_Process * SDL_CreateProcessWithProperties(SDL_PropertiesID props);
 */
export function createProcessWithProperties(props: number): Deno.PointerValue<"SDL_Process"> {
  return lib.symbols.SDL_CreateProcessWithProperties(props) as Deno.PointerValue<"SDL_Process">;
}

/**
 * Get the properties associated with a process.
 *
 * The following read-only properties are provided by SDL:
 *
 * - `SDL_PROP_PROCESS_PID_NUMBER`: the process ID of the process.
 * - `SDL_PROP_PROCESS_STDIN_POINTER`: an SDL_IOStream that can be used to
 *   write input to the process, if it was created with
 *   `SDL_PROP_PROCESS_CREATE_STDIN_NUMBER` set to `SDL_PROCESS_STDIO_APP`.
 * - `SDL_PROP_PROCESS_STDOUT_POINTER`: a non-blocking SDL_IOStream that can
 *   be used to read output from the process, if it was created with
 *   `SDL_PROP_PROCESS_CREATE_STDOUT_NUMBER` set to `SDL_PROCESS_STDIO_APP`.
 * - `SDL_PROP_PROCESS_STDERR_POINTER`: a non-blocking SDL_IOStream that can
 *   be used to read error output from the process, if it was created with
 *   `SDL_PROP_PROCESS_CREATE_STDERR_NUMBER` set to `SDL_PROCESS_STDIO_APP`.
 * - `SDL_PROP_PROCESS_BACKGROUND_BOOLEAN`: true if the process is running in
 *   the background.
 *
 * @param process the process to query.
 * @returns a valid property ID on success or 0 on failure; call
 *          SDL_GetError() for more information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_CreateProcess
 * @sa SDL_CreateProcessWithProperties
 *
 * @from SDL_process.h:270 SDL_PropertiesID SDL_GetProcessProperties(SDL_Process *process);
 */
export function getProcessProperties(process: Deno.PointerValue<"SDL_Process">): number {
  return lib.symbols.SDL_GetProcessProperties(process);
}

/**
 * Read all the output from a process.
 *
 * If a process was created with I/O enabled, you can use this function to
 * read the output. This function blocks until the process is complete,
 * capturing all output, and providing the process exit code.
 *
 * The data is allocated with a zero byte at the end (null terminated) for
 * convenience. This extra byte is not included in the value reported via
 * `datasize`.
 *
 * The data should be freed with SDL_free().
 *
 * @param process The process to read.
 * @param datasize a pointer filled in with the number of bytes read, may be
 *                 NULL.
 * @param exitcode a pointer filled in with the process exit code if the
 *                 process has exited, may be NULL.
 * @returns the data or NULL on failure; call SDL_GetError() for more
 *          information.
 *
 * @threadsafety This function is not thread safe.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_CreateProcess
 * @sa SDL_CreateProcessWithProperties
 * @sa SDL_DestroyProcess
 *
 * @from SDL_process.h:307 void * SDL_ReadProcess(SDL_Process *process, size_t *datasize, int *exitcode);
 */
export function readProcess(process: Deno.PointerValue<"SDL_Process">): { datasize: bigint; exitcode: number; ret: Deno.PointerValue } {
  const ret = lib.symbols.SDL_ReadProcess(process, _p.u64.p0, _p.i32.p0) as Deno.PointerValue;
  if(!ret) throw new Error(`SDL_ReadProcess: ${_p.getCstr2(lib.symbols.SDL_GetError())}`);
  return { datasize: _p.u64.v0, exitcode: _p.i32.v0, ret };
}

/**
 * Get the SDL_IOStream associated with process standard input.
 *
 * The process must have been created with SDL_CreateProcess() and pipe_stdio
 * set to true, or with SDL_CreateProcessWithProperties() and
 * `SDL_PROP_PROCESS_CREATE_STDIN_NUMBER` set to `SDL_PROCESS_STDIO_APP`.
 *
 * Writing to this stream can return less data than expected if the process
 * hasn't read its input. It may be blocked waiting for its output to be read,
 * if so you may need to call SDL_GetProcessOutput() and read the output in
 * parallel with writing input.
 *
 * @param process The process to get the input stream for.
 * @returns the input stream or NULL on failure; call SDL_GetError() for more
 *          information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_CreateProcess
 * @sa SDL_CreateProcessWithProperties
 * @sa SDL_GetProcessOutput
 *
 * @from SDL_process.h:333 SDL_IOStream * SDL_GetProcessInput(SDL_Process *process);
 */
export function getProcessInput(process: Deno.PointerValue<"SDL_Process">): Deno.PointerValue<"SDL_IOStream"> {
  return lib.symbols.SDL_GetProcessInput(process) as Deno.PointerValue<"SDL_IOStream">;
}

/**
 * Get the SDL_IOStream associated with process standard output.
 *
 * The process must have been created with SDL_CreateProcess() and pipe_stdio
 * set to true, or with SDL_CreateProcessWithProperties() and
 * `SDL_PROP_PROCESS_CREATE_STDOUT_NUMBER` set to `SDL_PROCESS_STDIO_APP`.
 *
 * Reading from this stream can return 0 with SDL_GetIOStatus() returning
 * SDL_IO_STATUS_NOT_READY if no output is available yet.
 *
 * @param process The process to get the output stream for.
 * @returns the output stream or NULL on failure; call SDL_GetError() for more
 *          information.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_CreateProcess
 * @sa SDL_CreateProcessWithProperties
 * @sa SDL_GetProcessInput
 *
 * @from SDL_process.h:357 SDL_IOStream * SDL_GetProcessOutput(SDL_Process *process);
 */
export function getProcessOutput(process: Deno.PointerValue<"SDL_Process">): Deno.PointerValue<"SDL_IOStream"> {
  return lib.symbols.SDL_GetProcessOutput(process) as Deno.PointerValue<"SDL_IOStream">;
}

/**
 * Stop a process.
 *
 * @param process The process to stop.
 * @param force true to terminate the process immediately, false to try to
 *              stop the process gracefully. In general you should try to stop
 *              the process gracefully first as terminating a process may
 *              leave it with half-written data or in some other unstable
 *              state.
 * @returns true on success or false on failure; call SDL_GetError() for more
 *          information.
 *
 * @threadsafety This function is not thread safe.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_CreateProcess
 * @sa SDL_CreateProcessWithProperties
 * @sa SDL_WaitProcess
 * @sa SDL_DestroyProcess
 *
 * @from SDL_process.h:380 bool SDL_KillProcess(SDL_Process *process, bool force);
 */
export function killProcess(process: Deno.PointerValue<"SDL_Process">, force: boolean): boolean {
  return lib.symbols.SDL_KillProcess(process, force);
}

/**
 * Wait for a process to finish.
 *
 * This can be called multiple times to get the status of a process.
 *
 * The exit code will be the exit code of the process if it terminates
 * normally, a negative signal if it terminated due to a signal, or -255
 * otherwise. It will not be changed if the process is still running.
 *
 * If you create a process with standard output piped to the application
 * (`pipe_stdio` being true) then you should read all of the process output
 * before calling SDL_WaitProcess(). If you don't do this the process might be
 * blocked indefinitely waiting for output to be read and SDL_WaitProcess()
 * will never return true;
 *
 * @param process The process to wait for.
 * @param block If true, block until the process finishes; otherwise, report
 *              on the process' status.
 * @param exitcode a pointer filled in with the process exit code if the
 *                 process has exited, may be NULL.
 * @returns true if the process exited, false otherwise.
 *
 * @threadsafety This function is not thread safe.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_CreateProcess
 * @sa SDL_CreateProcessWithProperties
 * @sa SDL_KillProcess
 * @sa SDL_DestroyProcess
 *
 * @from SDL_process.h:413 bool SDL_WaitProcess(SDL_Process *process, bool block, int *exitcode);
 */
export function waitProcess(process: Deno.PointerValue<"SDL_Process">, block: boolean): number {
  if(!lib.symbols.SDL_WaitProcess(process, block, _p.i32.p0))
    throw new Error(`SDL_WaitProcess: ${_p.getCstr2(lib.symbols.SDL_GetError())}`);
  return _p.i32.v0;
}

/**
 * Destroy a previously created process object.
 *
 * Note that this does not stop the process, just destroys the SDL object used
 * to track it. If you want to stop the process you should use
 * SDL_KillProcess().
 *
 * @param process The process object to destroy.
 *
 * @threadsafety This function is not thread safe.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_CreateProcess
 * @sa SDL_CreateProcessWithProperties
 * @sa SDL_KillProcess
 *
 * @from SDL_process.h:432 void SDL_DestroyProcess(SDL_Process *process);
 */
export function destroyProcess(process: Deno.PointerValue<"SDL_Process">): void {
  return lib.symbols.SDL_DestroyProcess(process);
}

