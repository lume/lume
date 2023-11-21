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
    get size(): import("../../../index.js").XYZNonNegativeValues;
    set size(val: import("../../../index.js").XYZNonNegativeValues);
    get sizeMode(): import("../../../index.js").XYZSizeModeValues;
    set sizeMode(val: import("../../../index.js").XYZSizeModeValues);
    get geometry(): ReturnType<this["_createComponent"]> | null;
    _createComponent(): BufferGeometry;
}
//# sourceMappingURL=GeometryBehavior.d.ts.map