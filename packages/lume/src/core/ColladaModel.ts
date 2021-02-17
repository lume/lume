import Node, {NodeAttributes} from './Node.js'

import type {ColladaModelBehavior, ColladaModelBehaviorAttributes} from '../html/index.js'

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
export default class ColladaModel extends Node {
	static defaultElementName = 'lume-collada-model'
	static defaultBehaviors = ['collada-model']

	// FIXME, without this accessor, the src property of the
	// ColladaModelBehavior may not be initially triggered when using JSX as in
	// <lume-collada-model src={"path/to/file.dae"}>. Why?
	// This accessor should not be required, because the behaviors already
	// set up the observation mechanism on their host elements.
	get src() {
		return this.__src
	}
	set src(v) {
		this.__src = v
	}

	private __src: string = ''
}

export {ColladaModel}

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
