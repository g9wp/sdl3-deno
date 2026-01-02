/**
 * A preprocessor macro that is only defined if compiling for AIX.
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @from SDL_platform_defines.h:37
 */
export const SDL_PLATFORM_AIX = 1;

/**
 * A preprocessor macro that is only defined if compiling for Haiku OS.
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @from SDL_platform_defines.h:47
 */
export const SDL_PLATFORM_HAIKU = 1;

/**
 * A preprocessor macro that is only defined if compiling for BSDi
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @from SDL_platform_defines.h:57
 */
export const SDL_PLATFORM_BSDI = 1;

/**
 * A preprocessor macro that is only defined if compiling for FreeBSD.
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @from SDL_platform_defines.h:67
 */
export const SDL_PLATFORM_FREEBSD = 1;

/**
 * A preprocessor macro that is only defined if compiling for HP-UX.
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @from SDL_platform_defines.h:77
 */
export const SDL_PLATFORM_HPUX = 1;

/**
 * A preprocessor macro that is only defined if compiling for IRIX.
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @from SDL_platform_defines.h:87
 */
export const SDL_PLATFORM_IRIX = 1;

/**
 * A preprocessor macro that is only defined if compiling for Linux.
 *
 * Note that Android, although ostensibly a Linux-based system, will not
 * define this. It defines SDL_PLATFORM_ANDROID instead.
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @from SDL_platform_defines.h:100
 */
export const SDL_PLATFORM_LINUX = 1;

/**
 * A preprocessor macro that is only defined if compiling for Android.
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @from SDL_platform_defines.h:110
 */
export const SDL_PLATFORM_ANDROID = 1;

/**
 * A preprocessor macro that is only defined if compiling for a Unix-like
 * system.
 *
 * Other platforms, like Linux, might define this in addition to their primary
 * define.
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @from SDL_platform_defines.h:125
 */
export const SDL_PLATFORM_UNIX = 1;

/**
 * A preprocessor macro that is only defined if compiling for Apple platforms.
 *
 * iOS, macOS, etc will additionally define a more specific platform macro.
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @sa SDL_PLATFORM_MACOS
 * @sa SDL_PLATFORM_IOS
 * @sa SDL_PLATFORM_TVOS
 * @sa SDL_PLATFORM_VISIONOS
 *
 * @from SDL_platform_defines.h:142
 */
export const SDL_PLATFORM_APPLE = 1;

/**
 * @from SDL_platform_defines:159
 */
export const TARGET_OS_MACCATALYST = 0;

/**
 * @from SDL_platform_defines:162
 */
export const TARGET_OS_IOS = 0;

/**
 * @from SDL_platform_defines:165
 */
export const TARGET_OS_IPHONE = 0;

/**
 * @from SDL_platform_defines:168
 */
export const TARGET_OS_TV = 0;

/**
 * @from SDL_platform_defines:171
 */
export const TARGET_OS_SIMULATOR = 0;

/**
 * @from SDL_platform_defines:174
 */
export const TARGET_OS_VISION = 0;

/**
 * A preprocessor macro that is only defined if compiling for tvOS.
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @sa SDL_PLATFORM_APPLE
 *
 * @from SDL_platform_defines.h:186
 */
export const SDL_PLATFORM_TVOS = 1;

/**
 * A preprocessor macro that is only defined if compiling for visionOS.
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @sa SDL_PLATFORM_APPLE
 *
 * @from SDL_platform_defines.h:198
 */
export const SDL_PLATFORM_VISIONOS = 1;

/**
 * A preprocessor macro that is only defined if compiling for iOS or visionOS.
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @sa SDL_PLATFORM_APPLE
 *
 * @from SDL_platform_defines.h:210
 */
export const SDL_PLATFORM_IOS = 1;

/**
 * A preprocessor macro that is only defined if compiling for macOS.
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @sa SDL_PLATFORM_APPLE
 *
 * @from SDL_platform_defines.h:221
 */
export const SDL_PLATFORM_MACOS = 1;

/**
 * A preprocessor macro that is only defined if compiling for Emscripten.
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @from SDL_platform_defines.h:236
 */
export const SDL_PLATFORM_EMSCRIPTEN = 1;

/**
 * A preprocessor macro that is only defined if compiling for NetBSD.
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @from SDL_platform_defines.h:246
 */
export const SDL_PLATFORM_NETBSD = 1;

/**
 * A preprocessor macro that is only defined if compiling for OpenBSD.
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @from SDL_platform_defines.h:256
 */
export const SDL_PLATFORM_OPENBSD = 1;

/**
 * A preprocessor macro that is only defined if compiling for OS/2.
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @from SDL_platform_defines.h:266
 */
export const SDL_PLATFORM_OS2 = 1;

/**
 * A preprocessor macro that is only defined if compiling for Tru64 (OSF/1).
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @from SDL_platform_defines.h:276
 */
export const SDL_PLATFORM_OSF = 1;

/**
 * A preprocessor macro that is only defined if compiling for QNX Neutrino.
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @from SDL_platform_defines.h:286
 */
export const SDL_PLATFORM_QNXNTO = 1;

/**
 * A preprocessor macro that is only defined if compiling for RISC OS.
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @from SDL_platform_defines.h:296
 */
export const SDL_PLATFORM_RISCOS = 1;

/**
 * A preprocessor macro that is only defined if compiling for SunOS/Solaris.
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @from SDL_platform_defines.h:306
 */
export const SDL_PLATFORM_SOLARIS = 1;

/**
 * A preprocessor macro that is only defined if compiling for Cygwin.
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @from SDL_platform_defines.h:316
 */
export const SDL_PLATFORM_CYGWIN = 1;

/**
 * A preprocessor macro that is only defined if compiling for Windows.
 *
 * This also covers several other platforms, like Microsoft GDK, Xbox, WinRT,
 * etc. Each will have their own more-specific platform macros, too.
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @sa SDL_PLATFORM_WIN32
 * @sa SDL_PLATFORM_XBOXONE
 * @sa SDL_PLATFORM_XBOXSERIES
 * @sa SDL_PLATFORM_WINGDK
 * @sa SDL_PLATFORM_GDK
 *
 * @from SDL_platform_defines.h:335
 */
export const SDL_PLATFORM_WINDOWS = 1;

/**
 * @from SDL_platform_defines:354
 */
export const WINAPI_FAMILY_WINRT = (!WINAPI_FAMILY_PARTITION(WINAPI_PARTITION_DESKTOP) && WINAPI_FAMILY_PARTITION(WINAPI_PARTITION_APP));

/**
 * @from SDL_platform_defines:356
 */
export const WINAPI_FAMILY_WINRT = 0;

/**
 * @from SDL_platform_defines:366
 */
export const SDL_WINAPI_FAMILY_PHONE = (WINAPI_FAMILY == WINAPI_FAMILY_PHONE_APP);

/**
 * @from SDL_platform_defines:369
 */
export const SDL_WINAPI_FAMILY_PHONE = (WINAPI_FAMILY == WINAPI_FAMILY_PHONE_APP);

/**
 * @from SDL_platform_defines:371
 */
export const SDL_WINAPI_FAMILY_PHONE = 0;

/**
 * A preprocessor macro that is only defined if compiling for Microsoft GDK
 * for Windows.
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @from SDL_platform_defines.h:385
 */
export const SDL_PLATFORM_WINGDK = 1;

/**
 * A preprocessor macro that is only defined if compiling for Xbox One.
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @from SDL_platform_defines.h:394
 */
export const SDL_PLATFORM_XBOXONE = 1;

/**
 * A preprocessor macro that is only defined if compiling for Xbox Series.
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @from SDL_platform_defines.h:403
 */
export const SDL_PLATFORM_XBOXSERIES = 1;

/**
 * A preprocessor macro that is only defined if compiling for desktop Windows.
 *
 * Despite the "32", this also covers 64-bit Windows; as an informal
 * convention, its system layer tends to still be referred to as "the Win32
 * API."
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @from SDL_platform_defines.h:416
 */
export const SDL_PLATFORM_WIN32 = 1;

/**
 * A preprocessor macro that is only defined if compiling for Microsoft GDK on
 * any platform.
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @from SDL_platform_defines.h:431
 */
export const SDL_PLATFORM_GDK = 1;

/**
 * A preprocessor macro that is only defined if compiling for Sony PSP.
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @from SDL_platform_defines.h:441
 */
export const SDL_PLATFORM_PSP = 1;

/**
 * A preprocessor macro that is only defined if compiling for Sony PlayStation
 * 2.
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @from SDL_platform_defines.h:452
 */
export const SDL_PLATFORM_PS2 = 1;

/**
 * A preprocessor macro that is only defined if compiling for Sony Vita.
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @from SDL_platform_defines.h:462
 */
export const SDL_PLATFORM_VITA = 1;

/**
 * A preprocessor macro that is only defined if compiling for Nintendo 3DS.
 *
 * @since This macro is available since SDL 3.2.0.
 *
 * @from SDL_platform_defines.h:472
 */
export const SDL_PLATFORM_3DS = 1;

/**
 * A preprocessor macro that is only defined if compiling for the Nokia
 * N-Gage.
 *
 * @since This macro is available since SDL 3.4.0.
 *
 * @from SDL_platform_defines.h:483
 */
export const SDL_PLATFORM_NGAGE = 1;

/**
 * A preprocessor macro that is only defined if compiling for GNU/Hurd.
 *
 * @since This macro is available since SDL 3.4.0.
 *
 * @from SDL_platform_defines.h:493
 */
export const SDL_PLATFORM_HURD = 1;

