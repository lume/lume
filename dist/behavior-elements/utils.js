import { createEffect, createSignal } from 'solid-js';
import { elementChildren } from '../utils/dom.js';
import { Behavior } from './Behavior.js';
import { MaterialBehavior } from './mesh-behaviors/materials/MaterialBehavior.js';
/**
 * Returns a signal that updates with the child behaviors of the given element,
 * excluding any elements in `skip`.
 */
export function behaviorElements(element, ...skip) {
    const children = elementChildren(element);
    const [behaviors, setBehaviors] = createSignal([]);
    createEffect(() => {
        const newBehaviors = [];
        for (const el of children())
            if (!skip.includes(el) && el instanceof Behavior)
                newBehaviors.push(el);
        setBehaviors(newBehaviors);
    });
    return behaviors;
}
/**
 * Returns a signal that updates with the child MaterialBehavior behaviors of the
 * given element, excluding any elements in `skip`.
 */
export function materialBehaviorElements(element, ...skip) {
    const behaviors = behaviorElements(element, ...skip);
    return () => behaviors().filter(b => b instanceof MaterialBehavior);
}
//# sourceMappingURL=utils.js.map