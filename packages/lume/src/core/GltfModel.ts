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
