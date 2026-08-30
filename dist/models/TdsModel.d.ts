import { type ElementAttributes } from '@lume/element';
import { TDSLoader } from 'three/examples/jsm/loaders/TDSLoader.js';
import type { Group } from 'three/src/objects/Group.js';
import { Element3D, type Element3DAttributes } from '../core/Element3D.js';
export type TdsModelAttributes = Element3DAttributes | 'src';
/**
 * @element lume-3ds-model
 * @class TdsModel -
 *
 * Defines the `<lume-3ds-model>` element for loading 3D models in the
 * 3DS format (`.3ds` files).
 *
 * HTML Example:
 *
 * ```html
 * <lume-scene webgl>
 *   <lume-3ds-model id="myModel" src="path/to/model.3ds"></lume-3ds-model>
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
 * const model = new TdsModel
 * model.src = 'path/to/model.3ds'
 * model.on('MODEL_LOAD', () => console.log('loaded'))
 * scene.add(model)
 * ```
 */
export declare class TdsModel extends Element3D {
    #private;
    /** Path to a .3ds file. */
    src: string;
    loader: TDSLoader;
    model?: Group;
    connectedCallback(): void;
}
declare module 'solid-js' {
    namespace JSX {
        interface IntrinsicElements {
            'lume-3ds-model': ElementAttributes<TdsModel, TdsModelAttributes>;
        }
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'lume-3ds-model': TdsModel;
    }
}
//# sourceMappingURL=TdsModel.d.ts.map