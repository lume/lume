/**
 * Throws the given error. Useful for throwing errors in expressions where
 * otherwise you can't use the `throw` statement.
 */
export function thro(error: unknown): never {
	throw error
}
