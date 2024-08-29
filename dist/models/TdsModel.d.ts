import { type ElementAttributes } from '@lume/element';
import { Model, type ModelAttributes } from './Model.js';
import type { ElementWithBehaviors } from '../behaviors/ElementWithBehaviors.js';
import type { TdsModelBehavior, TdsModelBehaviorAttributes } from '../behaviors/index.js';
export type TdsModelAttributes = ModelAttributes | TdsModelBehaviorAttributes;
/**
 * @element lume-3ds-model
 * @class TdsModel -
 *
 * Defines the `<lume-3ds-model>` element, short for `<lume-element3d
 * has="3ds-model">`, for loading 3D models in the 3DS format (`.3ds`
 * files).
 *
 * See [`TdsModelBehavior`](../behaviors/mesh-behaviors/models/TdsModelBehavior)
 * for attributes/properties available on this element.
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
 *
 * @extends Model
 */
export declare class TdsModel extends Model {
    initialBehaviors: {
        model: string;
    };
}
export interface TdsModel extends ElementWithBehaviors<TdsModelBehavior, TdsModelBehaviorAttributes> {
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