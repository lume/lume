import { type ElementAttributes } from '@lume/element';
import { Element3D, type Element3DAttributes } from '../core/Element3D.js';
import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
export type GltfModelAttributes = Element3DAttributes | 'src' | 'dracoDecoder' | 'centerGeometry';
/**
 * @element lume-gltf-model
 * @class GltfModel -
 *
 * Defines the `<lume-gltf-model>` element for loading 3D models in the
 * glTF format (`.gltf` or `.glb` files).
 *
 * HTML Example:
 *
 * ```html
 * <lume-scene webgl>
 *   <lume-gltf-model id="myModel" src="path/to/model.gltf"></lume-gltf-model>
 * </lume-scene>
 * <script>
 *   myModel.on('MODEL_LOAD', () => console.log('loaded'))
 * </script>
 * ```
 *
 * JavaScript Example:
 *
 * ```js
 * const scene = new Scene
 * scene.webgl = true
 * document.body.append(scene)
 * const model = new GltfModel
 * model.src = 'path/to/model.gltf'
 * model.on('MODEL_LOAD', () => console.log('loaded'))
 * scene.add(model)
 * ```
 */
export declare class GltfModel extends Element3D {
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
    model: GLTF | null;
    connectedCallback(): void;
}
declare module 'solid-js' {
    namespace JSX {
        interface IntrinsicElements {
            'lume-gltf-model': ElementAttributes<GltfModel, GltfModelAttributes>;
        }
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'lume-gltf-model': GltfModel;
    }
}
//# sourceMappingURL=GltfModel.d.ts.map