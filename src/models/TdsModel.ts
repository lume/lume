import {element} from '@lume/element'
import {Node, NodeAttributes} from '../core/Node.js'
import {autoDefineElements} from '../LumeConfig.js'

import type {TdsModelBehavior, TdsModelBehaviorAttributes} from '../behaviors/mesh-behaviors/models/TdsModelBehavior.js'

export type TdsModelAttributes = NodeAttributes

/**
 * @element lume-3ds-model
 * @class TdsModel -
 * > :construction: :hammer: Under construction! :hammer: :construction:
 *
 * Defines the `<lume-3ds-model>` element, for loading 3D
 * models in the 3DS format (.3ds files). It is similar to an `<img>` tag, but for 3D.
 *
 * HTML Example:
 *
 * ```html
 * <lume-scene webgl>
 *   <lume-3ds-model src="path/to/model.3ds"></lume-3ds-model>
 * </lume-scene>
 * ```
 *
 * JavaScript Example:
 *
 * ```js
 * const scene = new Scene
 * document.body.append(scene)
 * const model = new TdsModel
 * model.src = 'path/to/model.3ds'
 * scene.add(model)
 * ```
 */
@element('lume-3ds-model', autoDefineElements)
export class TdsModel extends Node {
	static override defaultBehaviors = ['3ds-model']
}

import type {ElementAttributes} from '@lume/element'
import type {ElementWithBehaviors} from '../index.js'

export interface TdsModel extends ElementWithBehaviors<TdsModelBehavior, TdsModelBehaviorAttributes> {}

declare global {
	interface HTMLElementTagNameMap {
		'lume-3ds-model': TdsModel
	}
}

declare module '@lume/element' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-3ds-model': JSX.IntrinsicElements['lume-node'] &
				ElementAttributes<TdsModelBehavior, TdsModelBehaviorAttributes>
		}
	}
}
