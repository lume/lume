import {Node, NodeAttributes} from '../core/Node.js'

import type {ColladaModelBehavior, ColladaModelBehaviorAttributes} from '../behaviors/models/ColladaModelBehavior.js'

// TODO FIXME Type error because this property comes from a behavior.
// new ColladaModel().src

export type ColladaModelAttributes = NodeAttributes

/**
 * @element lume-collada-model
 * @class ColladaModel - Defines the `<lume-collada-model>` element, for loading 3D
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
export class ColladaModel extends Node {
	static defaultElementName = 'lume-collada-model'
	static defaultBehaviors = ['collada-model']
}

import type {ElementAttributes} from '@lume/element'

declare module '@lume/element' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-collada-model': ElementAttributes<
				ColladaModel,
				ColladaModelAttributes,
				ElementAttributes<ColladaModelBehavior, ColladaModelBehaviorAttributes>
			>
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'lume-collada-model': ColladaModel
	}
}
