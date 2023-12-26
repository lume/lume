export interface ObserveChildrenOptions {
    /** The target element to observe children on. */
    target: Element | ShadowRoot | Document;
    /** Called when a child is added to `target`. */
    onConnect: (this: Element, child: Element) => void;
    /** Called when a child is removed from `target`. */
    onDisconnect: (this: Element, child: Element) => void;
    /**
     * By default onConnect and onDisconnect are called only for elements, not
     * text nodes or comment nodes. Set to `true` to include text nodes and
     * comment nodes.
     *
     * Default: `false`
     */
    includeTextNodes?: boolean;
    /**
     * If `true`, onConnect and onDisconnect will only be called based on the
     * child's final position, and any intermediate mutation records will be ignored. For
     * example, this means that if a child is disconnected and then immediately
     * (synchronously) connected back to the same parent, onDisconnect and
     * onConnect (respectively) will not be called because the final result is
     * that the element did not move and is still connected to the same parent, therefore there is nothing to do.
     *
     * Similarly, if a child was moved around to several parents synchronously
     * and ends up at a different parent than the original, onDisconnect and
     * onConnect will be called only once each, in that order, and they will not
     * be called for every intermediate parent because the end result is that
     * the child moved from one parent to another. This avoids doing extra unnecessary work.
     *
     * If `false`, then onConnect and onDisconnect are called for every mutation
     * record, for example if a child is disconnected and reconnected
     * synchronously to the same parent the onDisconnect and onConnect will fire
     * in that order, or if a child moved to several parents then onDisconnect
     * and onConnect will be called for each parent.
     *
     * Default: `false`
     */
    weighted?: boolean;
}
export declare function observeChildren({ target, onConnect, onDisconnect, includeTextNodes, weighted, }: ObserveChildrenOptions): () => void;
/**
 * NOTE: If a child is synchronously disconnected then connected to the same parent in the
 * same tick when weighted is true, then the onConnect and onDisconnect callbacks won't be called
 * because the DOM tree will be back in the exact state as before (this is
 * possible thanks to the logic associated with weightsPerTarget).
 */
export declare function createChildObserver(onConnect: any, onDisconnect: any, includeTextNodes?: boolean, weighted?: boolean): MutationObserver;
//# sourceMappingURL=observeChildren.d.ts.map