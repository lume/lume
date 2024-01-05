import { type ElementAttributes } from '@lume/element';
import { Element3D, type Element3DAttributes } from '../core/Element3D.js';
import type { ElementWithBehaviors } from '../behaviors/ElementWithBehaviors.js';
import type { FbxModelBehavior, FbxModelBehaviorAttributes } from '../behaviors/index.js';
export type FbxModelAttributes = Element3DAttributes | FbxModelBehaviorAttributes;
/**
 * @element lume-fbx-model
 * @class FbxModel -
 *
 * Defines the `<lume-fbx-model>` element, short for `<lume-element3d
 * has="fbx-model">`, for loading 3D models in the FBX format (`.fbx`
 * files).
 *
 * See [`FbxModelBehavior`](../behaviors/mesh-behaviors/models/FbxModelBehavior)
 * for attributes/properties available on this element.
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
    initialBehaviors: {
        model: string;
    };
}
export interface FbxModel extends ElementWithBehaviors<FbxModelBehavior, FbxModelBehaviorAttributes> {
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