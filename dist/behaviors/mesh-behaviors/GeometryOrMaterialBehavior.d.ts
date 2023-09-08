import { MeshBehavior, MeshComponentType } from './MeshBehavior.js';
import type { Material } from 'three/src/materials/Material.js';
import type { BufferGeometry } from 'three/src/core/BufferGeometry.js';
export declare abstract class GeometryOrMaterialBehavior extends MeshBehavior {
    #private;
    abstract type: MeshComponentType;
    loadGL(): void;
    resetMeshComponent(): void;
    _createComponent(): BufferGeometry | Material;
}
//# sourceMappingURL=GeometryOrMaterialBehavior.d.ts.map