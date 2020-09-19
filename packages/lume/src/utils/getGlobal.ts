/**
 * @return {typeof Window} - the global object. We assume it is a `Window`
 * because this lib is designed for the web. In theory it can run in Node.js in
 * the future, but it may need the some of the same globals as in the web.
 */
export function getGlobal() {
	if (typeof globalThis !== 'undefined') return globalThis
	else if (typeof window !== 'undefined') return window
	else if (typeof global !== 'undefined') return global
	else return Function('return this')()
}
