import 'element-behaviors';
import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RenderableBehavior } from '../../RenderableBehavior.js';
export type GltfModelBehaviorAttributes = 'src' | 'dracoDecoder' | 'centerGeometry';
export declare class GltfModelBehavior extends RenderableBehavior {
    #private;
    /** @property {string | null} src - Path to a `.gltf` or `.glb` file. */
    src: string | null;
    /**
     * @property {string | null} dracoDecoder -
     *
     * `attribute`
     *
     * Path to the draco decoder that
     * will unpack decode compressed assets of the GLTF file. This does not need
     * to be supplied unless you explicitly know you need it.
     */
    dracoDecoder: string;
    /**
     * @property {boolean} centerGeometry -
     *
     * `attribute`
     *
     * When `true`, all geometry of the
     * loaded model will be centered at the local origin.
     *
     * Note, changing this value at runtime is expensive because the whole model
     * will be re-created. We improve this by tracking the initial center
     * position to revert to when centerGeometry goes back to `false` (PRs
     * welcome!).
     */
    centerGeometry: boolean;
    gltfLoader?: GLTFLoader;
    model: GLTF | null;
    loadGL(): void;
    unloadGL(): void;
}
//# sourceMappingURL=GltfModelBehavior.d.ts.map