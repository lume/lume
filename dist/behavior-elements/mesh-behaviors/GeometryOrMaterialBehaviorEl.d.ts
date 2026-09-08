import { MeshBehaviorEl } from './MeshBehaviorEl.js';
import type { Material } from 'three/src/materials/Material.js';
import type { BufferGeometry } from 'three/src/core/BufferGeometry.js';
type MeshComponentType = 'geometry' | 'material';
/**
 * @class GeometryOrMaterialBehaviorEl
 * Abstract base class for Geometry and Material behaviors, not intended for direct use.
 *
 * Subclasses should implement:
 * _createComponent() - return a BufferGeometry or Material instance.
 *
 * @extends MeshBehaviorEl
 */
export declare abstract class GeometryOrMaterialBehaviorEl extends MeshBehaviorEl {
    #private;
    abstract readonly type: MeshComponentType;
    protected _parentDefinedEffect(parent?: NonNullable<this['composedParent']>): void;
    resetMeshComponent(): void;
    _createComponent(): BufferGeometry | Material;
}
export {};
//# sourceMappingURL=GeometryOrMaterialBehaviorEl.d.ts.map