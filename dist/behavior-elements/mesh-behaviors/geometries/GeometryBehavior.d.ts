import { BufferGeometry } from 'three/src/core/BufferGeometry.js';
import { GeometryOrMaterialBehavior } from '../GeometryOrMaterialBehavior.js';
import type { MeshComponentType } from '../MeshBehavior.js';
/**
 * @class GeometryBehavior -
 * An abstract base class for geometry behaviors.
 *
 * This implements `GeometryOrMaterialBehavior._createComponent` to return a
 * `THREE.BufferGeometry` by default.
 *
 * @extends GeometryOrMaterialBehavior
 */
export declare abstract class GeometryBehavior extends GeometryOrMaterialBehavior {
    type: MeshComponentType;
    _createComponent(): BufferGeometry;
}
//# sourceMappingURL=GeometryBehavior.d.ts.map