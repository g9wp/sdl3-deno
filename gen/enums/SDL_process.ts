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

/**
 * @from SDL_process:228 SDL_PROP_PROCESS_CREATE_
 */
export enum PROP_PROCESS_CREATE {
  ARGS_POINTER = "SDL.process.create.args", 
  ENVIRONMENT_POINTER = "SDL.process.create.environment", 
  WORKING_DIRECTORY_STRING = "SDL.process.create.working_directory", 
  STDIN_NUMBER = "SDL.process.create.stdin_option", 
  STDIN_POINTER = "SDL.process.create.stdin_source", 
  STDOUT_NUMBER = "SDL.process.create.stdout_option", 
  STDOUT_POINTER = "SDL.process.create.stdout_source", 
  STDERR_NUMBER = "SDL.process.create.stderr_option", 
  STDERR_POINTER = "SDL.process.create.stderr_source", 
  STDERR_TO_STDOUT_BOOLEAN = "SDL.process.create.stderr_to_stdout", 
  BACKGROUND_BOOLEAN = "SDL.process.create.background", 
  CMDLINE_STRING = "SDL.process.create.cmdline", 
}



/**
 * @from SDL_process:272 SDL_PROP_PROCESS_
 */
export enum PROP_PROCESS {
  PID_NUMBER = "SDL.process.pid", 
  STDIN_POINTER = "SDL.process.stdin", 
  STDOUT_POINTER = "SDL.process.stdout", 
  STDERR_POINTER = "SDL.process.stderr", 
  BACKGROUND_BOOLEAN = "SDL.process.background", 
}



/**
 * Description of where standard I/O should be directed when creating a
 * process.
 *
 * If a standard I/O stream is set to SDL_PROCESS_STDIO_INHERITED, it will go
 * to the same place as the application's I/O stream. This is the default for
 * standard output and standard error.
 *
 * If a standard I/O stream is set to SDL_PROCESS_STDIO_NULL, it is connected
 * to `NUL:` on Windows and `/dev/null` on POSIX systems. This is the default
 * for standard input.
 *
 * If a standard I/O stream is set to SDL_PROCESS_STDIO_APP, it is connected
 * to a new SDL_IOStream that is available to the application. Standard input
 * will be available as `SDL_PROP_PROCESS_STDIN_POINTER` and allows
 * SDL_GetProcessInput(), standard output will be available as
 * `SDL_PROP_PROCESS_STDOUT_POINTER` and allows SDL_ReadProcess() and
 * SDL_GetProcessOutput(), and standard error will be available as
 * `SDL_PROP_PROCESS_STDERR_POINTER` in the properties for the created
 * process.
 *
 * If a standard I/O stream is set to SDL_PROCESS_STDIO_REDIRECT, it is
 * connected to an existing SDL_IOStream provided by the application. Standard
 * input is provided using `SDL_PROP_PROCESS_CREATE_STDIN_POINTER`, standard
 * output is provided using `SDL_PROP_PROCESS_CREATE_STDOUT_POINTER`, and
 * standard error is provided using `SDL_PROP_PROCESS_CREATE_STDERR_POINTER`
 * in the creation properties. These existing streams should be closed by the
 * application once the new process is created.
 *
 * In order to use an SDL_IOStream with SDL_PROCESS_STDIO_REDIRECT, it must
 * have `SDL_PROP_IOSTREAM_WINDOWS_HANDLE_POINTER` or
 * `SDL_PROP_IOSTREAM_FILE_DESCRIPTOR_NUMBER` set. This is true for streams
 * representing files and process I/O.
 *
 * @since This enum is available since SDL 3.2.0.
 *
 * @sa SDL_CreateProcessWithProperties
 * @sa SDL_GetProcessProperties
 * @sa SDL_ReadProcess
 * @sa SDL_GetProcessInput
 * @sa SDL_GetProcessOutput
 *
 * @from SDL_process.h:149 SDL_PROCESS_STDIO_
 */
export enum SDL_ProcessIO {
  INHERITED, /**< The I/O stream is inherited from the application. */
  NULL, /**< The I/O stream is ignored. */
  APP, /**< The I/O stream is connected to a new SDL_IOStream that the application can read or write */
  REDIRECT, /**< The I/O stream is redirected to an existing SDL_IOStream. */
}



