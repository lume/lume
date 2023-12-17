/**
 * A generator to iterate upward roots of an element. Example:
 *
 * ```js
 * for (const root of upwardRoots(someEl)) console.log(root)
 * ```
 */
export function* upwardRoots(el: Element) {
	let root = el.getRootNode() as Document | ShadowRoot | null

	while (root) {
		yield root
		root = root instanceof ShadowRoot ? (root.host.getRootNode() as Document | ShadowRoot) : null
	}
}
