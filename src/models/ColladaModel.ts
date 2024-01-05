import {element, type ElementAttributes} from '@lume/element'
import {Element3D, type Element3DAttributes} from '../core/Element3D.js'
import {autoDefineElements} from '../LumeConfig.js'
import type {ElementWithBehaviors} from '../behaviors/ElementWithBehaviors.js'
import type {ColladaModelBehavior, ColladaModelBehaviorAttributes} from '../behaviors/index.js'

export type ColladaModelAttributes = Element3DAttributes | ColladaModelBehaviorAttributes

/**
 * @element lume-collada-model
 * @class ColladaModel -
 *
 * Defines the `<lume-collada-model>` element, short for `<lume-element3d
 * has="collada-model">`, for loading 3D models in the Collada format (`.dae`
 * files).
 *
 * See [`ColladaModelBehavior`](../behaviors/mesh-behaviors/models/ColladaModelBehavior)
 * for attributes/properties available on this element.
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
export
@element('lume-collada-model', autoDefineElements)
class ColladaModel extends Element3D {
	override initialBehaviors = {model: 'collada'}
}

export interface ColladaModel extends ElementWithBehaviors<ColladaModelBehavior, ColladaModelBehaviorAttributes> {}

declare module 'solid-js' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-collada-model': ElementAttributes<ColladaModel, ColladaModelAttributes>
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'lume-collada-model': ColladaModel
	}
}
