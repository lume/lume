import Node, {NodeAttributes} from './Node.js'

import type {GltfModelBehavior, GltfModelBehaviorAttributes} from '../html/index.js'

export type GltfModelAttributes = NodeAttributes

/**
 * @element lume-gltf-model
 * @class GltfModel - Defines the `<lume-gltf-model>` element, for loading 3D
 * models in the glTF format. It is similar to an `<img>` tag, but for 3D.
 *
 * HTML Example:
 *
 * ```html
 * <lume-scene webgl>
 *   <lume-gltf-model src="path/to/model.gltf"></lume-gltf-model>
 * </lume-scene>
 * ```
 *
 * JavaScript Example:
 *
 * ```js
 * const scene = new Scene
 * document.body.append(scene)
 * const model = new GltfModel
 * model.src = 'path/to/model.gltf'
 * scene.add(model)
 * ```
 */
export default class GltfModel extends Node {
	static defaultElementName = 'lume-gltf-model'
	static defaultBehaviors = ['gltf-model']

	// FIXME, without the following accessors, the src and dracoDecoder
	// properties of the GltfModelBehavior may not be initially triggered when
	// using JSX as in <lume-gltf-model src={"path/to/file.gltf"}>. Why?
	// These accessors should not be required, because the behaviors already
	// set up the observation mechanism on their host elements.

	get src() {
		return this.__src
	}
	set src(v) {
		this.__src = v
	}

	private __src: string = ''

	get dracoDecoder() {
		return this.__dracoDecoder
	}
	set dracoDecoder(v) {
		this.__dracoDecoder = v
	}

	private __dracoDecoder: string = ''
}

export {GltfModel}

import type {ElementAttributes} from '@lume/element'

declare module '@lume/element' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-gltf-model': ElementAttributes<
				GltfModel,
				GltfModelAttributes,
				ElementAttributes<GltfModelBehavior, GltfModelBehaviorAttributes>
			>
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'lume-gltf-model': GltfModel
	}
}
