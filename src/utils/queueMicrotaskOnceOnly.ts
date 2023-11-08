const tasks = new Set<() => void>()
let microtask = false

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
export function queueMicrotaskOnceOnly(task: () => void) {
	tasks.add(task)
	if (microtask) return
	microtask = true

	queueMicrotask(() => {
		microtask = false

		// Grab the items, then clear the set before running tasks, so that we
		// allow tasks to queue again for the next microtask.
		const _tasks = [...tasks]
		tasks.clear()

		for (const task of _tasks) task()
	})
}
