import { MeshBehavior, type MeshComponentType } from './MeshBehavior.js';
import type { Material } from 'three/src/materials/Material.js';
import type { BufferGeometry } from 'three/src/core/BufferGeometry.js';
/**
 * @class GeometryOrMaterialBehavior
 * Abstract base class for Geometry and Material behaviors, not intended for direct use.
 *
 * Subclasses should implement:
 * _createComponent() - return a BufferGeometry or Material instance.
 *
 * @extends MeshBehavior
 */
export declare abstract class GeometryOrMaterialBehavior extends MeshBehavior {
    #private;
    abstract type: MeshComponentType;
    loadGL(): void;
    resetMeshComponent(): void;
    _createComponent(): BufferGeometry | Material;
}
//# sourceMappingURL=GeometryOrMaterialBehavior.d.ts.map