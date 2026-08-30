import { BehaviorEl } from './Behavior.js';
import { MaterialBehaviorEl } from './mesh-behaviors/materials/MaterialBehaviorEl.js';
/**
 * Returns a signal that updates with the child behaviors of the given element,
 * excluding any elements in `skip`.
 */
export declare function behaviorChildren(element: Element, ...skip: Element[]): import("solid-js").Accessor<BehaviorEl[]>;
/**
 * Returns a signal that updates with the child MaterialBehavior behaviors of
 * the given element, excluding any elements in `skip`.
 */
export declare function materialBehaviorChildren(element: Element, ...skip: Element[]): () => MaterialBehaviorEl[];
//# sourceMappingURL=utils.d.ts.map