import {element} from '@lume/element'
import {Node, NodeAttributes} from '../core/Node.js'
import {autoDefineElements} from '../LumeConfig.js'

import type {ObjModelBehavior, ObjModelBehaviorAttributes} from '../behaviors/mesh-behaviors/models/ObjModelBehavior.js'

export type ObjModelAttributes = NodeAttributes

/**
 * @element lume-obj-model
 * @class ObjModel - Defines the `<lume-obj-model>` element, which is short for `<lume-node has="obj-model">`.
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
 * const model = new ObjModel
 * model.obj = 'path/to/model.obj'
 * model.mtl = 'path/to/model.mtl'
 * scene.add(model)
 * ```
 */
@element('lume-obj-model', autoDefineElements)
export class ObjModel extends Node {
	static defaultBehaviors = ['obj-model']
}

import type {ElementAttributes} from '@lume/element'
import type {ElementWithBehaviors} from '../index.js'

export interface ObjModel extends ElementWithBehaviors<ObjModelBehavior, ObjModelBehaviorAttributes> {}

declare global {
	interface HTMLElementTagNameMap {
		'lume-obj-model': ObjModel
	}
}

declare module '@lume/element' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-obj-model': JSX.IntrinsicElements['lume-node'] &
				ElementAttributes<ObjModelBehavior, ObjModelBehaviorAttributes>
		}
	}
}
