import { RenderableBehavior } from '../RenderableBehavior.js';
import { Mesh } from '../../meshes/Mesh.js';
import { Points } from '../../meshes/Points.js';
import { InstancedMesh } from '../../meshes/InstancedMesh.js';
import { Line } from '../../meshes/Line.js';
import type { BufferGeometry, Material } from 'three';
export type MeshComponentType = 'geometry' | 'material';
export declare abstract class MeshBehavior extends RenderableBehavior {
    element: Mesh | Points | InstancedMesh | Line;
    requiredElementType(): (typeof Mesh | typeof Points | typeof InstancedMesh | typeof Line)[];
    _createComponent(): BufferGeometry | Material;
    meshComponent: ReturnType<this['_createComponent']> | null;
}
//# sourceMappingURL=MeshBehavior.d.ts.map