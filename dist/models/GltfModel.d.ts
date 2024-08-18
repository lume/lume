import { type ElementAttributes } from '@lume/element';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Model, type ModelAttributes } from './Model.js';
import type { ElementWithBehaviors } from '../behaviors/ElementWithBehaviors.js';
import type { GltfModelBehavior, GltfModelBehaviorAttributes } from '../behaviors/index.js';
export type GltfModelAttributes = ModelAttributes | GltfModelBehaviorAttributes;
/**
 * @element lume-gltf-model
 * @class GltfModel -
 *
 * Defines the `<lume-gltf-model>` element, short for `<lume-element3d
 * has="gltf-model">`, for loading 3D models in the glTF format (`.gltf` or
 * `.glb` files).
 *
 * See [`GltfModelBehavior`](../behaviors/mesh-behaviors/models/GltfModelBehavior)
 * for attributes/properties available on this element.
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
 *
 * @extends Model
 */
export declare class GltfModel extends Model {
    initialBehaviors: {
        model: string;
    };
    /**
     * @property {GLTF | null} threeModel - The loaded GLTF model, or null when
     * not loaded or while loading.
     *
     * `signal`
     */
    threeModel: GLTF | null;
}
export interface GltfModel extends ElementWithBehaviors<GltfModelBehavior, GltfModelBehaviorAttributes> {
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