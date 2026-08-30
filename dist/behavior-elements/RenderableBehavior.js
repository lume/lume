import { BehaviorEl } from './Behavior.js';
import { Element3D } from '../core/Element3D.js';
import { createEffect, onCleanup } from 'solid-js';
/**
 * @class RenderableBehavior
 * Base class for element behaviors that provide rendering features (f.e. geometries, materials, etc).
 *
 * @extends HTMLElement
 */
export class RenderableBehaviorEl extends BehaviorEl {
    requiredParentType() {
        return [Element3D];
    }
    _parentDefinedEffect(parent = this.composedParent) {
        super._parentDefinedEffect(parent);
        parent.needsUpdate();
        onCleanup(() => parent.needsUpdate());
        // Trigger parent.needsUpdate() for any reactive keys by default, as
        // anything that changes in these RenderableBehaviorEl elements
        // typically needs re-rendering of the Lume Element3D parent. This
        // catches only own properties.
        const keys = Object.keys(this);
        createEffect(() => {
            for (const k of keys)
                this[k];
            parent.needsUpdate();
        });
    }
}
//# sourceMappingURL=RenderableBehavior.js.map