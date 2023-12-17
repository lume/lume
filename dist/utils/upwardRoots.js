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
//# sourceMappingURL=upwardRoots.js.map