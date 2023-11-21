import 'element-behaviors';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { RenderableBehavior } from '../../RenderableBehavior.js';
import type { Group } from 'three/src/objects/Group.js';
export type FbxModelBehaviorAttributes = 'src' | 'centerGeometry';
export declare class FbxModelBehavior extends RenderableBehavior {
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
    loader?: FBXLoader;
    model?: Group;
    loadGL(): void;
    unloadGL(): void;
}
//# sourceMappingURL=FbxModelBehavior.d.ts.map