import { Behavior } from './Behavior.js';
import { MaterialBehavior } from './mesh-behaviors/materials/MaterialBehavior.js';
/**
 * Returns a signal that updates with the child behaviors of the given element,
 * excluding any elements in `skip`.
 */
export declare function behaviorElements(element: Element, ...skip: Element[]): import("solid-js").Accessor<Behavior[]>;
/**
 * Returns a signal that updates with the child MaterialBehavior behaviors of the
 * given element, excluding any elements in `skip`.
 */
export declare function materialBehaviorElements(element: Element, ...skip: Element[]): () => MaterialBehavior[];
//# sourceMappingURL=utils.d.ts.map