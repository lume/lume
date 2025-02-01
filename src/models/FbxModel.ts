import {element, type ElementAttributes} from '@lume/element'
import type {Group} from 'three/src/objects/Group.js'
import {Model, type ModelAttributes} from './Model.js'
import {autoDefineElements} from '../LumeConfig.js'
import type {ElementWithBehaviors} from '../behaviors/ElementWithBehaviors.js'
import type {FbxModelBehavior, FbxModelBehaviorAttributes} from '../behaviors/index.js'

export type FbxModelAttributes = ModelAttributes | FbxModelBehaviorAttributes

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
 *   myModel.addEventListener('load', () => console.log('loaded'))
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
 * model.addEventListener('load', () => console.log('loaded'))
 * scene.add(model)
 * ```
 *
 * @extends Model
 */
export
@element('lume-fbx-model', autoDefineElements)
class FbxModel extends Model {
	override initialBehaviors = {model: 'fbx'}

	/**
	 * @property {FbxModel | null} threeModel - The loaded FBX model, or null
	 * when not loaded or while loading.
	 *
	 * `signal`
	 */
	declare threeModel: Group | null
}

export interface FbxModel extends ElementWithBehaviors<FbxModelBehavior, FbxModelBehaviorAttributes> {}

declare module 'solid-js' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-fbx-model': ElementAttributes<FbxModel, FbxModelAttributes>
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'lume-fbx-model': FbxModel
	}
}
