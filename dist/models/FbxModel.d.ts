import { type ElementAttributes } from '@lume/element';
import type { Group } from 'three/src/objects/Group.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { Element3D, type Element3DAttributes } from '../core/Element3D.js';
export type FbxModelAttributes = Element3DAttributes | 'src' | 'centerGeometry';
/**
 * @element lume-fbx-model
 * @class FbxModel -
 *
 * Defines the `<lume-fbx-model>` element for loading 3D models in the
 * FBX format (`.fbx` files).
 *
 * HTML Example:
 *
 * ```html
 * <lume-scene webgl>
 *   <lume-fbx-model id="myModel" src="path/to/model.fbx"></lume-fbx-model>
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
 * const model = new FbxModel
 * model.src = 'path/to/model.fbx'
 * model.on('MODEL_LOAD', () => console.log('loaded'))
 * scene.add(model)
 * ```
 */
export declare class FbxModel extends Element3D {
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
    connectedCallback(): void;
}
declare module 'solid-js' {
    namespace JSX {
        interface IntrinsicElements {
            'lume-fbx-model': ElementAttributes<FbxModel, FbxModelAttributes>;
        }
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'lume-fbx-model': FbxModel;
    }
}
//# sourceMappingURL=FbxModel.d.ts.map