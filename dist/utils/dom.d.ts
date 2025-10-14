/**
 * Returns a signal with the latest mutations for a given target and options.
 */
export declare function nodeMutations(target: Node, options: MutationObserverInit): import("solid-js").Accessor<MutationRecord[]>;
/**
 * Returns a signal with an HTMLCollection of an element's children. When
 * element's children change, the signal is triggered with the same
 * HTMLCollection, in the next microtask after children have changed.
 */
export declare function elementChildren(element: Element): import("solid-js").Accessor<HTMLCollection>;
//# sourceMappingURL=dom.d.ts.map