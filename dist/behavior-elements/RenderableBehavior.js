import { Behavior } from './Behavior.js';
import { Element3D } from '../core/Element3D.js';
import { onCleanup } from 'solid-js';
/**
 * @class RenderableBehavior
 * Base class for element behaviors that provide rendering features (f.e. geometries, materials, etc).
 *
 * @extends HTMLElement
 */
export class RenderableBehavior extends Behavior {
    requiredParentType() {
        return [Element3D];
    }
    _parentDefinedEffect(parent = this.composedParent) {
        super._parentDefinedEffect(parent);
        parent.needsUpdate();
        onCleanup(() => parent.needsUpdate());
    }
}
//# sourceMappingURL=RenderableBehavior.js.map