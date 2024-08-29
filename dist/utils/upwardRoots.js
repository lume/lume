/**
 * A generator to iterate upward roots of an element. Example:
 *
 * ```js
 * for (const root of upwardRoots(someEl)) console.log(root)
 * ```
 */
export function* upwardRoots(el) {
    let root = el.getRootNode();
    while (root) {
        yield root;
        root = root instanceof ShadowRoot ? root.host.getRootNode() : null;
    }
}
/**
 * Iterate all roots reachable from `el`.
 * This will make it possible to implement selector refs across the whole composed tree.
 */
export function* reachableRoots(_el) { }
//# sourceMappingURL=upwardRoots.js.map