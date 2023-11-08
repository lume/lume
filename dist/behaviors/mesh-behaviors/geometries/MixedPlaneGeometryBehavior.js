import 'element-behaviors';
import { BoxGeometry } from 'three/src/geometries/BoxGeometry.js';
import { GeometryBehavior } from './GeometryBehavior.js';
export class MixedPlaneGeometryBehavior extends GeometryBehavior {
    _createComponent() {
        return new BoxGeometry(this.element.calculatedSize.x, this.element.calculatedSize.y, 1);
    }
}
if (globalThis.window?.document && !elementBehaviors.has('mixedplane-geometry'))
    elementBehaviors.define('mixedplane-geometry', MixedPlaneGeometryBehavior);
//# sourceMappingURL=MixedPlaneGeometryBehavior.js.map