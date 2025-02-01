// The `?? Event` is for Node.js serverside.
const _ErrorEvent = globalThis.ErrorEvent ?? Event

/**
 * @class ErrorEvent - An elements that loads any content will dispatch this
 * event if loading fails.
 * @extends globalThis.ErrorEvent
 */
export class ErrorEvent extends _ErrorEvent {
	static type = 'error'
	static defaultOptions: ErrorEventInit = {bubbles: false, cancelable: false}

	constructor(error: string | Error = '', options: ErrorEventInit = {}) {
		error = normalizeError(error)

		super(ErrorEvent.type, {
			...ErrorEvent.defaultOptions,
			error,
			message: error.message,
			...options,
		})
	}
}

export function normalizeError(error: unknown) {
	return error instanceof Error
		? error
		: error instanceof globalThis.ErrorEvent
		? error.error
			? error.error instanceof Error
				? error.error
				: new Error(String(error.error || 'unknown error'))
			: new Error(error.message || 'unknown error')
		: new Error(String(error || 'unknown error'))
}
