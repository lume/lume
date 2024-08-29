import type { PossibleBehaviorInstance } from 'element-behaviors';
/**
 * The set of behaviors that an element has (`el.behaviors`) is a reactive
 * object (powered by Solid signals). Use this function to get a reactive memo
 * that gives you a particular behavior based on a find function. Example:
 *
 * ```js
 * const someBehavior = createBehaviorMemo(someEl, behavior => behavior.name === 'some-behavior')
 *
 * createEffect(() => {
 *   // If the element does not currently have the behavior,
 *   // return (the effect will re-run if the behavior is added
 *   // or removed later).
 *   if (!someBehavior()) return
 *
 *   doSomethingWithBehavior(someBehavior())
 * })
 * ```
 */
export declare function createBehaviorMemo(el: HTMLElement, filter: (name: string, behavior: PossibleBehaviorInstance) => boolean): import("solid-js").Accessor<PossibleBehaviorInstance | undefined>;
//# sourceMappingURL=createBehaviorMemo.d.ts.map