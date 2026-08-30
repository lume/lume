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
 * @deprecated Legacy behavior system via `has=""` attribute is deprecated. Use child geometry/material elements instead. Legacy behaviors will be removed in a future version.
 */
export declare abstract class GeometryOrMaterialBehavior extends MeshBehavior {
    #private;
    abstract type: MeshComponentType;
    connectedCallback(): void;
    disconnectedCallback(): void;
    resetMeshComponent(): void;
    _createComponent(): BufferGeometry | Material;
}
//# sourceMappingURL=GeometryOrMaterialBehavior.d.ts.map