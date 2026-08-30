import { type ElementAttributes } from '@lume/element';
import { Element3D, type Element3DAttributes } from '../core/Element3D.js';
import { ColladaLoader, type Collada } from 'three/examples/jsm/loaders/ColladaLoader.js';
export type ColladaModelAttributes = Element3DAttributes | 'src';
/**
 * @element lume-collada-model
 * @class ColladaModel -
 *
 * Defines the `<lume-collada-model>` element for loading 3D models in the
 * Collada format (`.dae` files).
 *
 * HTML Example:
 *
 * ```html
 * <lume-scene webgl>
 *   <lume-collada-model id="myModel" src="path/to/model.dae"></lume-collada-model>
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
 * const model = new ColladaModel
 * model.src = 'path/to/model.dae'
 * model.on('MODEL_LOAD', () => console.log('loaded'))
 * scene.add(model)
 * ```
 *
 * @extends Element3D
 */
export declare class ColladaModel extends Element3D {
    #private;
    /** Path to a .dae file. */
    src: string;
    loader: ColladaLoader;
    model?: Collada;
    connectedCallback(): void;
}
declare module 'solid-js' {
    namespace JSX {
        interface IntrinsicElements {
            'lume-collada-model': ElementAttributes<ColladaModel, ColladaModelAttributes>;
        }
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'lume-collada-model': ColladaModel;
    }
}
//# sourceMappingURL=ColladaModel.d.ts.map