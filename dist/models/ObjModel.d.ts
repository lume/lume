import { type ElementAttributes } from '@lume/element';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import type { Group } from 'three/src/objects/Group.js';
import { Element3D, type Element3DAttributes } from '../core/Element3D.js';
export type ObjModelAttributes = Element3DAttributes | 'obj' | 'mtl';
/**
 * @element lume-obj-model
 * @class ObjModel -
 *
 * Defines the `<lume-obj-model>` element for loading 3D models in the OBJ
 * format (`.obj` files paired with `.mtl` files).
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
 */
export declare class ObjModel extends Element3D {
    #private;
    obj: string;
    mtl: string;
    model?: Group;
    objLoader: OBJLoader;
    mtlLoader: MTLLoader;
    connectedCallback(): void;
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