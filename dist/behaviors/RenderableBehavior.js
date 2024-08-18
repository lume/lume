import { Effectful } from 'classy-solid';
import { Behavior } from './Behavior.js';
import { Element3D } from '../core/Element3D.js';
/**
 * @class RenderableBehavior
 * Base class for element behaviors that provide rendering features (f.e. geometries, materials, etc).
 *
 * @extends Behavior
 */
export class RenderableBehavior extends Effectful(Behavior) {
    requiredElementType() {
        return [Element3D];
    }
    connectedCallback() {
        super.connectedCallback();
        this.element.needsUpdate();
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.element.needsUpdate();
    }
}
//# sourceMappingURL=RenderableBehavior.js.map