/**
 * A generator to iterate upward roots of an element. Example:
 *
 * ```js
 * for (const root of upwardRoots(someEl)) console.log(root)
 * ```
 */
export declare function upwardRoots(el: Element): Generator<ShadowRoot | Document, void, unknown>;
/**
 * Iterate all roots reachable from `el`.
 * This will make it possible to implement selector refs across the whole composed tree.
 */
export declare function reachableRoots(_el: Element): Generator<never, void, unknown>;
//# sourceMappingURL=upwardRoots.d.ts.map