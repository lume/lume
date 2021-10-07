import {Node, NodeAttributes} from '../core/Node.js'

import type {ObjModelBehavior, ObjModelBehaviorAttributes} from '../behaviors/models/ObjModelBehavior.js'

export type ObjModelAttributes = NodeAttributes

/**
 * @element lume-obj-model
 * @class GltfModel - Defines the `<lume-obj-model>` element, which is short for `<lume-node has="obj-model">`.
 *
 * HTML Example:
 *
 * ```html
 * <lume-scene>
 *   <lume-obj-model obj="path/to/model.obj" mtl="path/to/model.mtl"></lume-obj-model>
 * </lume-scene>
 * ```
 *
 * JavaScript Example:
 *
 * ```js
 * const scene = new Scene
 * document.body.append(scene)
 * const model = new GltfModel
 * model.obj = 'path/to/model.obj'
 * model.mtl = 'path/to/model.mtl'
 * scene.add(model)
 * ```
 */
export class ObjModel extends Node {
	static defaultElementName = 'lume-obj-model'
	static defaultBehaviors = ['obj-model']
}

import type {ElementAttributes} from '@lume/element'

declare module '@lume/element' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-obj-model': ElementAttributes<
				ObjModel,
				ObjModelAttributes,
				ElementAttributes<ObjModelBehavior, ObjModelBehaviorAttributes>
			>
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'lume-obj-model': ObjModel
	}
}
