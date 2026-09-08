import { RenderableBehaviorEl } from '../RenderableBehavior.js';
import { Mesh } from '../../meshes/Mesh.js';
import { Points } from '../../meshes/Points.js';
import { InstancedMesh } from '../../meshes/InstancedMesh.js';
import { Line } from '../../meshes/Line.js';
import type { BufferGeometry, Material } from 'three';
/**
 * @class MeshBehaviorEl
 *
 * @extends RenderableBehaviorEl
 */
export declare abstract class MeshBehaviorEl extends RenderableBehaviorEl {
    /**
     * @property {Mesh | Points | InstancedMesh | Line | null} composedParent
     */
    readonly composedParent: Mesh | Points | InstancedMesh | Line | null;
    /**
     * @protected
     * @method requiredParentType
     * @returns {(typeof Mesh | typeof Points | typeof InstancedMesh | typeof Line)[]}
     */
    requiredParentType(): (typeof Mesh | typeof Points | typeof InstancedMesh | typeof Line)[];
    /**
     * @protected
     * @method _createComponent -
     * Subclasses override this to create either a Material or a BufferGeometry.
     * It is reactive, any reactive dependencies used in here will cause
     * re-creation of the instance. Use `untrack` for cases where a dependency
     * should not re-create the instance (in that case an additional effect may
     * update the instance instead, while in other cases constructing a new
     * object is the only (or easier) way).
     *
     * @returns {BufferGeometry | Material}
     */
    _createComponent(): BufferGeometry | Material;
    /**
     * @property {BufferGeometry | Material | null} meshComponent
     *
     * The component that this behavior manages, either a Material, or a
     * BufferGeometry.
     */
    meshComponent: ReturnType<this['_createComponent']> | null;
}
//# sourceMappingURL=MeshBehaviorEl.d.ts.map