/**
 * # CategoryMutex
 *
 * SDL offers several thread synchronization primitives. This document can't
 * cover the complicated topic of thread safety, but reading up on what each
 * of these primitives are, why they are useful, and how to correctly use them
 * is vital to writing correct and safe multithreaded programs.
 *
 * - Mutexes: SDL_CreateMutex()
 * - Read/Write locks: SDL_CreateRWLock()
 * - Semaphores: SDL_CreateSemaphore()
 * - Condition variables: SDL_CreateCondition()
 *
 * SDL also offers a datatype, SDL_InitState, which can be used to make sure
 * only one thread initializes/deinitializes some resource that several
 * threads might try to use for the first time simultaneously.
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
 * Create a new mutex.
 *
 * All newly-created mutexes begin in the _unlocked_ state.
 *
 * Calls to SDL_LockMutex() will not return while the mutex is locked by
 * another thread. See SDL_TryLockMutex() to attempt to lock without blocking.
 *
 * SDL mutexes are reentrant.
 *
 * @returns the initialized and unlocked mutex or NULL on failure; call
 *          SDL_GetError() for more information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_DestroyMutex
 * @sa SDL_LockMutex
 * @sa SDL_TryLockMutex
 * @sa SDL_UnlockMutex
 *
 * @from SDL_mutex.h:317 SDL_Mutex * SDL_CreateMutex(void);
 */
SDL_CreateMutex: {
      parameters: [],
      result: "pointer"
    },


/**
 * Lock the mutex.
 *
 * This will block until the mutex is available, which is to say it is in the
 * unlocked state and the OS has chosen the caller as the next thread to lock
 * it. Of all threads waiting to lock the mutex, only one may do so at a time.
 *
 * It is legal for the owning thread to lock an already-locked mutex. It must
 * unlock it the same number of times before it is actually made available for
 * other threads in the system (this is known as a "recursive mutex").
 *
 * This function does not fail; if mutex is NULL, it will return immediately
 * having locked nothing. If the mutex is valid, this function will always
 * block until it can lock the mutex, and return with it locked.
 *
 * @param mutex the mutex to lock.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_TryLockMutex
 * @sa SDL_UnlockMutex
 *
 * @from SDL_mutex.h:341 void SDL_LockMutex(SDL_Mutex *mutex) SDL_ACQUIRE(mutex);
 */
SDL_LockMutex: {
      parameters: ["pointer"],
      result: "void"
    },


/**
 * Try to lock a mutex without blocking.
 *
 * This works just like SDL_LockMutex(), but if the mutex is not available,
 * this function returns false immediately.
 *
 * This technique is useful if you need exclusive access to a resource but
 * don't want to wait for it, and will return to it to try again later.
 *
 * This function returns true if passed a NULL mutex.
 *
 * @param mutex the mutex to try to lock.
 * @returns true on success, false if the mutex would block.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_LockMutex
 * @sa SDL_UnlockMutex
 *
 * @from SDL_mutex.h:362 bool SDL_TryLockMutex(SDL_Mutex *mutex) SDL_TRY_ACQUIRE(0, mutex);
 */
SDL_TryLockMutex: {
      parameters: ["pointer"],
      result: "bool"
    },


/**
 * Unlock the mutex.
 *
 * It is legal for the owning thread to lock an already-locked mutex. It must
 * unlock it the same number of times before it is actually made available for
 * other threads in the system (this is known as a "recursive mutex").
 *
 * It is illegal to unlock a mutex that has not been locked by the current
 * thread, and doing so results in undefined behavior.
 *
 * @param mutex the mutex to unlock.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_LockMutex
 * @sa SDL_TryLockMutex
 *
 * @from SDL_mutex.h:381 void SDL_UnlockMutex(SDL_Mutex *mutex) SDL_RELEASE(mutex);
 */
SDL_UnlockMutex: {
      parameters: ["pointer"],
      result: "void"
    },


/**
 * Destroy a mutex created with SDL_CreateMutex().
 *
 * This function must be called on any mutex that is no longer needed. Failure
 * to destroy a mutex will result in a system memory or resource leak. While
 * it is safe to destroy a mutex that is _unlocked_, it is not safe to attempt
 * to destroy a locked mutex, and may result in undefined behavior depending
 * on the platform.
 *
 * @param mutex the mutex to destroy.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_CreateMutex
 *
 * @from SDL_mutex.h:398 void SDL_DestroyMutex(SDL_Mutex *mutex);
 */
SDL_DestroyMutex: {
      parameters: ["pointer"],
      result: "void"
    },


/**
 * Create a new read/write lock.
 *
 * A read/write lock is useful for situations where you have multiple threads
 * trying to access a resource that is rarely updated. All threads requesting
 * a read-only lock will be allowed to run in parallel; if a thread requests a
 * write lock, it will be provided exclusive access. This makes it safe for
 * multiple threads to use a resource at the same time if they promise not to
 * change it, and when it has to be changed, the rwlock will serve as a
 * gateway to make sure those changes can be made safely.
 *
 * In the right situation, a rwlock can be more efficient than a mutex, which
 * only lets a single thread proceed at a time, even if it won't be modifying
 * the data.
 *
 * All newly-created read/write locks begin in the _unlocked_ state.
 *
 * Calls to SDL_LockRWLockForReading() and SDL_LockRWLockForWriting will not
 * return while the rwlock is locked _for writing_ by another thread. See
 * SDL_TryLockRWLockForReading() and SDL_TryLockRWLockForWriting() to attempt
 * to lock without blocking.
 *
 * SDL read/write locks are only recursive for read-only locks! They are not
 * guaranteed to be fair, or provide access in a FIFO manner! They are not
 * guaranteed to favor writers. You may not lock a rwlock for both read-only
 * and write access at the same time from the same thread (so you can't
 * promote your read-only lock to a write lock without unlocking first).
 *
 * @returns the initialized and unlocked read/write lock or NULL on failure;
 *          call SDL_GetError() for more information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_DestroyRWLock
 * @sa SDL_LockRWLockForReading
 * @sa SDL_LockRWLockForWriting
 * @sa SDL_TryLockRWLockForReading
 * @sa SDL_TryLockRWLockForWriting
 * @sa SDL_UnlockRWLock
 *
 * @from SDL_mutex.h:468 SDL_RWLock * SDL_CreateRWLock(void);
 */
SDL_CreateRWLock: {
      parameters: [],
      result: "pointer"
    },


/**
 * Lock the read/write lock for _write_ operations.
 *
 * This will block until the rwlock is available, which is to say it is not
 * locked for reading or writing by any other thread. Only one thread may hold
 * the lock when it requests write access; all other threads, whether they
 * also want to write or only want read-only access, must wait until the
 * writer thread has released the lock.
 *
 * It is illegal for the owning thread to lock an already-locked rwlock for
 * writing (read-only may be locked recursively, writing can not). Doing so
 * results in undefined behavior.
 *
 * It is illegal to request a write lock from a thread that already holds a
 * read-only lock. Doing so results in undefined behavior. Unlock the
 * read-only lock before requesting a write lock.
 *
 * This function does not fail; if rwlock is NULL, it will return immediately
 * having locked nothing. If the rwlock is valid, this function will always
 * block until it can lock the mutex, and return with it locked.
 *
 * @param rwlock the read/write lock to lock.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_LockRWLockForReading
 * @sa SDL_TryLockRWLockForWriting
 * @sa SDL_UnlockRWLock
 *
 * @from SDL_mutex.h:536 void SDL_LockRWLockForWriting(SDL_RWLock *rwlock) SDL_ACQUIRE(rwlock);
 */
SDL_LockRWLockForWriting: {
      parameters: ["pointer"],
      result: "void"
    },


/**
 * Try to lock a read/write lock _for writing_ without blocking.
 *
 * This works just like SDL_LockRWLockForWriting(), but if the rwlock is not
 * available, then this function returns false immediately.
 *
 * This technique is useful if you need exclusive access to a resource but
 * don't want to wait for it, and will return to it to try again later.
 *
 * It is illegal for the owning thread to lock an already-locked rwlock for
 * writing (read-only may be locked recursively, writing can not). Doing so
 * results in undefined behavior.
 *
 * It is illegal to request a write lock from a thread that already holds a
 * read-only lock. Doing so results in undefined behavior. Unlock the
 * read-only lock before requesting a write lock.
 *
 * This function returns true if passed a NULL rwlock.
 *
 * @param rwlock the rwlock to try to lock.
 * @returns true on success, false if the lock would block.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_LockRWLockForWriting
 * @sa SDL_TryLockRWLockForReading
 * @sa SDL_UnlockRWLock
 *
 * @from SDL_mutex.h:591 bool SDL_TryLockRWLockForWriting(SDL_RWLock *rwlock) SDL_TRY_ACQUIRE(0, rwlock);
 */
SDL_TryLockRWLockForWriting: {
      parameters: ["pointer"],
      result: "bool"
    },


/**
 * Destroy a read/write lock created with SDL_CreateRWLock().
 *
 * This function must be called on any read/write lock that is no longer
 * needed. Failure to destroy a rwlock will result in a system memory or
 * resource leak. While it is safe to destroy a rwlock that is _unlocked_, it
 * is not safe to attempt to destroy a locked rwlock, and may result in
 * undefined behavior depending on the platform.
 *
 * @param rwlock the rwlock to destroy.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_CreateRWLock
 *
 * @from SDL_mutex.h:633 void SDL_DestroyRWLock(SDL_RWLock *rwlock);
 */
SDL_DestroyRWLock: {
      parameters: ["pointer"],
      result: "void"
    },


/**
 * Create a semaphore.
 *
 * This function creates a new semaphore and initializes it with the value
 * `initial_value`. Each wait operation on the semaphore will atomically
 * decrement the semaphore value and potentially block if the semaphore value
 * is 0. Each post operation will atomically increment the semaphore value and
 * wake waiting threads and allow them to retry the wait operation.
 *
 * @param initial_value the starting value of the semaphore.
 * @returns a new semaphore or NULL on failure; call SDL_GetError() for more
 *          information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_DestroySemaphore
 * @sa SDL_SignalSemaphore
 * @sa SDL_TryWaitSemaphore
 * @sa SDL_GetSemaphoreValue
 * @sa SDL_WaitSemaphore
 * @sa SDL_WaitSemaphoreTimeout
 *
 * @from SDL_mutex.h:681 SDL_Semaphore * SDL_CreateSemaphore(Uint32 initial_value);
 */
SDL_CreateSemaphore: {
      parameters: ["u32"],
      result: "pointer"
    },


/**
 * Destroy a semaphore.
 *
 * It is not safe to destroy a semaphore if there are threads currently
 * waiting on it.
 *
 * @param sem the semaphore to destroy.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_CreateSemaphore
 *
 * @from SDL_mutex.h:695 void SDL_DestroySemaphore(SDL_Semaphore *sem);
 */
SDL_DestroySemaphore: {
      parameters: ["pointer"],
      result: "void"
    },


/**
 * Wait until a semaphore has a positive value and then decrements it.
 *
 * This function suspends the calling thread until the semaphore pointed to by
 * `sem` has a positive value, and then atomically decrement the semaphore
 * value.
 *
 * This function is the equivalent of calling SDL_WaitSemaphoreTimeout() with
 * a time length of -1.
 *
 * @param sem the semaphore wait on.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_SignalSemaphore
 * @sa SDL_TryWaitSemaphore
 * @sa SDL_WaitSemaphoreTimeout
 *
 * @from SDL_mutex.h:715 void SDL_WaitSemaphore(SDL_Semaphore *sem);
 */
SDL_WaitSemaphore: {
      parameters: ["pointer"],
      result: "void"
    },


/**
 * See if a semaphore has a positive value and decrement it if it does.
 *
 * This function checks to see if the semaphore pointed to by `sem` has a
 * positive value and atomically decrements the semaphore value if it does. If
 * the semaphore doesn't have a positive value, the function immediately
 * returns false.
 *
 * @param sem the semaphore to wait on.
 * @returns true if the wait succeeds, false if the wait would block.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_SignalSemaphore
 * @sa SDL_WaitSemaphore
 * @sa SDL_WaitSemaphoreTimeout
 *
 * @from SDL_mutex.h:734 bool SDL_TryWaitSemaphore(SDL_Semaphore *sem);
 */
SDL_TryWaitSemaphore: {
      parameters: ["pointer"],
      result: "bool"
    },


/**
 * Wait until a semaphore has a positive value and then decrements it.
 *
 * This function suspends the calling thread until either the semaphore
 * pointed to by `sem` has a positive value or the specified time has elapsed.
 * If the call is successful it will atomically decrement the semaphore value.
 *
 * @param sem the semaphore to wait on.
 * @param timeoutMS the length of the timeout, in milliseconds, or -1 to wait
 *                  indefinitely.
 * @returns true if the wait succeeds or false if the wait times out.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_SignalSemaphore
 * @sa SDL_TryWaitSemaphore
 * @sa SDL_WaitSemaphore
 *
 * @from SDL_mutex.h:754 bool SDL_WaitSemaphoreTimeout(SDL_Semaphore *sem, Sint32 timeoutMS);
 */
SDL_WaitSemaphoreTimeout: {
      parameters: ["pointer", "i32"],
      result: "bool"
    },


/**
 * Atomically increment a semaphore's value and wake waiting threads.
 *
 * @param sem the semaphore to increment.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_TryWaitSemaphore
 * @sa SDL_WaitSemaphore
 * @sa SDL_WaitSemaphoreTimeout
 *
 * @from SDL_mutex.h:767 void SDL_SignalSemaphore(SDL_Semaphore *sem);
 */
SDL_SignalSemaphore: {
      parameters: ["pointer"],
      result: "void"
    },


/**
 * Get the current value of a semaphore.
 *
 * @param sem the semaphore to query.
 * @returns the current value of the semaphore.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @from SDL_mutex.h:777 Uint32 SDL_GetSemaphoreValue(SDL_Semaphore *sem);
 */
SDL_GetSemaphoreValue: {
      parameters: ["pointer"],
      result: "u32"
    },


/**
 * Create a condition variable.
 *
 * @returns a new condition variable or NULL on failure; call SDL_GetError()
 *          for more information.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_BroadcastCondition
 * @sa SDL_SignalCondition
 * @sa SDL_WaitCondition
 * @sa SDL_WaitConditionTimeout
 * @sa SDL_DestroyCondition
 *
 * @from SDL_mutex.h:816 SDL_Condition * SDL_CreateCondition(void);
 */
SDL_CreateCondition: {
      parameters: [],
      result: "pointer"
    },


/**
 * Destroy a condition variable.
 *
 * @param cond the condition variable to destroy.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_CreateCondition
 *
 * @from SDL_mutex.h:827 void SDL_DestroyCondition(SDL_Condition *cond);
 */
SDL_DestroyCondition: {
      parameters: ["pointer"],
      result: "void"
    },


/**
 * Restart one of the threads that are waiting on the condition variable.
 *
 * @param cond the condition variable to signal.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_BroadcastCondition
 * @sa SDL_WaitCondition
 * @sa SDL_WaitConditionTimeout
 *
 * @from SDL_mutex.h:842 void SDL_SignalCondition(SDL_Condition *cond);
 */
SDL_SignalCondition: {
      parameters: ["pointer"],
      result: "void"
    },


/**
 * Restart all threads that are waiting on the condition variable.
 *
 * @param cond the condition variable to signal.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_SignalCondition
 * @sa SDL_WaitCondition
 * @sa SDL_WaitConditionTimeout
 *
 * @from SDL_mutex.h:857 void SDL_BroadcastCondition(SDL_Condition *cond);
 */
SDL_BroadcastCondition: {
      parameters: ["pointer"],
      result: "void"
    },


/**
 * Wait until a condition variable is signaled.
 *
 * This function unlocks the specified `mutex` and waits for another thread to
 * call SDL_SignalCondition() or SDL_BroadcastCondition() on the condition
 * variable `cond`. Once the condition variable is signaled, the mutex is
 * re-locked and the function returns.
 *
 * The mutex must be locked before calling this function. Locking the mutex
 * recursively (more than once) is not supported and leads to undefined
 * behavior.
 *
 * This function is the equivalent of calling SDL_WaitConditionTimeout() with
 * a time length of -1.
 *
 * @param cond the condition variable to wait on.
 * @param mutex the mutex used to coordinate thread access.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_BroadcastCondition
 * @sa SDL_SignalCondition
 * @sa SDL_WaitConditionTimeout
 *
 * @from SDL_mutex.h:885 void SDL_WaitCondition(SDL_Condition *cond, SDL_Mutex *mutex);
 */
SDL_WaitCondition: {
      parameters: ["pointer", "pointer"],
      result: "void"
    },


/**
 * Wait until a condition variable is signaled or a certain time has passed.
 *
 * This function unlocks the specified `mutex` and waits for another thread to
 * call SDL_SignalCondition() or SDL_BroadcastCondition() on the condition
 * variable `cond`, or for the specified time to elapse. Once the condition
 * variable is signaled or the time elapsed, the mutex is re-locked and the
 * function returns.
 *
 * The mutex must be locked before calling this function. Locking the mutex
 * recursively (more than once) is not supported and leads to undefined
 * behavior.
 *
 * @param cond the condition variable to wait on.
 * @param mutex the mutex used to coordinate thread access.
 * @param timeoutMS the maximum time to wait, in milliseconds, or -1 to wait
 *                  indefinitely.
 * @returns true if the condition variable is signaled, false if the condition
 *          is not signaled in the allotted time.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_BroadcastCondition
 * @sa SDL_SignalCondition
 * @sa SDL_WaitCondition
 *
 * @from SDL_mutex.h:915 bool SDL_WaitConditionTimeout(SDL_Condition *cond, SDL_Mutex *mutex, Sint32 timeoutMS);
 */
SDL_WaitConditionTimeout: {
      parameters: ["pointer", "pointer", "i32"],
      result: "bool"
    },


/**
 * Return whether initialization should be done.
 *
 * This function checks the passed in state and if initialization should be
 * done, sets the status to `SDL_INIT_STATUS_INITIALIZING` and returns true.
 * If another thread is already modifying this state, it will wait until
 * that's done before returning.
 *
 * If this function returns true, the calling code must call
 * SDL_SetInitialized() to complete the initialization.
 *
 * @param state the initialization state to check.
 * @returns true if initialization needs to be done, false otherwise.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_SetInitialized
 * @sa SDL_ShouldQuit
 *
 * @from SDL_mutex.h:1022 bool SDL_ShouldInit(SDL_InitState *state);
 */
SDL_ShouldInit: {
      parameters: ["pointer"],
      result: "bool"
    },


/**
 * Return whether cleanup should be done.
 *
 * This function checks the passed in state and if cleanup should be done,
 * sets the status to `SDL_INIT_STATUS_UNINITIALIZING` and returns true.
 *
 * If this function returns true, the calling code must call
 * SDL_SetInitialized() to complete the cleanup.
 *
 * @param state the initialization state to check.
 * @returns true if cleanup needs to be done, false otherwise.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_SetInitialized
 * @sa SDL_ShouldInit
 *
 * @from SDL_mutex.h:1043 bool SDL_ShouldQuit(SDL_InitState *state);
 */
SDL_ShouldQuit: {
      parameters: ["pointer"],
      result: "bool"
    },


/**
 * Finish an initialization state transition.
 *
 * This function sets the status of the passed in state to
 * `SDL_INIT_STATUS_INITIALIZED` or `SDL_INIT_STATUS_UNINITIALIZED` and allows
 * any threads waiting for the status to proceed.
 *
 * @param state the initialization state to check.
 * @param initialized the new initialization state.
 *
 * @threadsafety It is safe to call this function from any thread.
 *
 * @since This function is available since SDL 3.2.0.
 *
 * @sa SDL_ShouldInit
 * @sa SDL_ShouldQuit
 *
 * @from SDL_mutex.h:1062 void SDL_SetInitialized(SDL_InitState *state, bool initialized);
 */
SDL_SetInitialized: {
      parameters: ["pointer", "bool"],
      result: "void"
    },

} as const satisfies Deno.ForeignLibraryInterface;
