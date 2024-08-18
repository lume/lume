import 'element-behaviors';
import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { ModelBehavior } from './ModelBehavior.js';
import { GltfModel } from '../../../models/GltfModel.js';
export type GltfModelBehaviorAttributes = 'src' | 'dracoDecoder' | 'centerGeometry';
/**
 * A behavior containing the logic that loads glTF models for `<lume-gltf-model>`
 * elements.
 * @deprecated Don't use this behavior directly, instead use a `<lume-gltf-model>` element.
 * @extends ModelBehavior
 */
export declare class GltfModelBehavior extends ModelBehavior {
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
    loader: GLTFLoader;
    /** @deprecated access `.threeModel` on the lume-gltf-model element instead. */
    model: GLTF | null;
    element: GltfModel;
    requiredElementType(): (typeof GltfModel)[];
    connectedCallback(): void;
}
//# sourceMappingURL=GltfModelBehavior.d.ts.map