/**
 * Like queueMicrotask, except it will not allow the same function to be queued
 * more than once.
 *
 * Example:
 *
 * ```js
 * const logFoo = () => console.log('foo')
 *
 * // "foo" will be logged one time in the next microtask.
 * queueMicrotaskOnceOnly(logFoo)
 * queueMicrotaskOnceOnly(logFoo)
 * queueMicrotaskOnceOnly(logFoo)
 * queueMicrotaskOnceOnly(logFoo)
 * ```
 */
export declare function queueMicrotaskOnceOnly(task: () => void): void;
//# sourceMappingURL=queueMicrotaskOnceOnly.d.ts.map