import { Element3D, type Element3DAttributes } from '../core/Element3D.js';
import type { ColladaModelBehavior, ColladaModelBehaviorAttributes } from '../behaviors/mesh-behaviors/models/ColladaModelBehavior.js';
export type ColladaModelAttributes = Element3DAttributes;
/**
 * @element lume-collada-model
 * @class ColladaModel -
 * > :construction: :hammer: Under construction! :hammer: :construction:
 *
 * Defines the `<lume-collada-model>` element, for loading 3D
 * models in the Collada format (.dae files). It is similar to an `<img>` tag, but for 3D.
 *
 * HTML Example:
 *
 * ```html
 * <lume-scene webgl>
 *   <lume-collada-model src="path/to/model.dae"></lume-collada-model>
 * </lume-scene>
 * ```
 *
 * JavaScript Example:
 *
 * ```js
 * const scene = new Scene
 * document.body.append(scene)
 * const model = new ColladaModel
 * model.src = 'path/to/model.dae'
 * scene.add(model)
 * ```
 */
export declare class ColladaModel extends Element3D {
    static defaultBehaviors: string[];
}
import type { ElementAttributes } from '@lume/element';
import type { ElementWithBehaviors } from '../index.js';
export interface ColladaModel extends ElementWithBehaviors<ColladaModelBehavior, ColladaModelBehaviorAttributes> {
}
declare global {
    interface HTMLElementTagNameMap {
        'lume-collada-model': ColladaModel;
    }
}
declare module 'solid-js' {
    namespace JSX {
        interface IntrinsicElements {
            'lume-collada-model': JSX.IntrinsicElements['lume-element3d'] & ElementAttributes<ColladaModelBehavior, ColladaModelBehaviorAttributes>;
        }
    }
}
//# sourceMappingURL=ColladaModel.d.ts.map