import 'element-behaviors';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import type { Group } from 'three/src/objects/Group.js';
import { ModelBehavior } from './ModelBehavior.js';
import { FbxModel } from '../../../models/FbxModel.js';
export type FbxModelBehaviorAttributes = 'src' | 'centerGeometry';
/**
 * A behavior containing the logic that loads FBX models for `<lume-fbx-model>`
 * elements.
 * @deprecated Don't use this behavior directly, instead use a `<lume-fbx-model>` element.
 * @extends ModelBehavior
 */
export declare class FbxModelBehavior extends ModelBehavior {
    #private;
    /** Path to a .fbx file. */
    src: string;
    /**
     * @attribute
     * @property {boolean} centerGeometry - When `true`, all geometry of the
     * loaded model will be centered at the local origin.
     *
     * Note, changing this value at runtime is expensive because the whole model
     * will be re-created. We improve this by tracking the initial center
     * position to revert to when centerGeometry goes back to `false` (PRs
     * welcome!).
     */
    centerGeometry: boolean;
    loader: FBXLoader;
    model?: Group;
    element: FbxModel;
    requiredElementType(): (typeof FbxModel)[];
    connectedCallback(): void;
}
//# sourceMappingURL=FbxModelBehavior.d.ts.map