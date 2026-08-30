import { BufferGeometry } from 'three/src/core/BufferGeometry.js';
import { GeometryOrMaterialBehaviorEl } from '../GeometryOrMaterialBehaviorEl.js';
/**
 * @class GeometryBehaviorEl -
 * An abstract base class for geometry behavior elements.
 *
 * This implements `GeometryOrMaterialBehaviorEl._createComponent` to return a
 * `THREE.BufferGeometry` by default.
 *
 * @extends GeometryOrMaterialBehaviorEl
 */
export class GeometryBehaviorEl extends GeometryOrMaterialBehaviorEl {
    type = 'geometry';
    _createComponent() {
        return new BufferGeometry();
    }
}
//# sourceMappingURL=GeometryBehaviorEl.js.map