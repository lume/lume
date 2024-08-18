import { type ElementAttributes } from '@lume/element';
import type { Group } from 'three/src/objects/Group.js';
import { Model, type ModelAttributes } from './Model.js';
import type { ElementWithBehaviors } from '../behaviors/ElementWithBehaviors.js';
import type { ObjModelBehavior, ObjModelBehaviorAttributes } from '../behaviors/index.js';
export type ObjModelAttributes = ModelAttributes | ObjModelBehaviorAttributes;
/**
 * @element lume-obj-model
 * @class ObjModel -
 *
 * Defines the `<lume-obj-model>` element, short for `<lume-element3d
 * has="obj-model">`, for loading 3D models in the OBJ format (`.obj` files
 * paired with `.mtl` files).
 *
 * HTML Example:
 *
 * ```html
 * <lume-scene>
 *   <lume-obj-model id="myModel" obj="path/to/model.obj" mtl="path/to/model.mtl"></lume-obj-model>
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
 * const model = new ObjModel
 * model.obj = 'path/to/model.obj'
 * model.mtl = 'path/to/model.mtl'
 * model.on('MODEL_LOAD', () => console.log('loaded'))
 * scene.add(model)
 * ```
 *
 * @extends Model
 */
export declare class ObjModel extends Model {
    initialBehaviors: {
        model: string;
    };
    /**
     * @property {Group | null} threeModel - The loaded OBJ model, or null when
     * not loaded or while loading.
     *
     * `signal`
     */
    threeModel: Group | null;
}
export interface ObjModel extends ElementWithBehaviors<ObjModelBehavior, ObjModelBehaviorAttributes> {
}
declare module 'solid-js' {
    namespace JSX {
        interface IntrinsicElements {
            'lume-obj-model': ElementAttributes<ObjModel, ObjModelAttributes>;
        }
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'lume-obj-model': ObjModel;
    }
}
//# sourceMappingURL=ObjModel.d.ts.map