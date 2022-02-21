import {element} from '@lume/element'
import {Node, NodeAttributes} from '../core/Node.js'
import {autoDefineElements} from '../LumeConfig.js'

import type {FbxModelBehavior, FbxModelBehaviorAttributes} from '../behaviors/models/FbxModelBehavior.js'

export type FbxModelAttributes = NodeAttributes

/**
 * @element lume-fbx-model
 * @class FbxModel -
 * > :construction: :hammer: Under construction! :hammer: :construction:
 *
 * Defines the `<lume-fbx-model>` element, for loading 3D
 * models in the FBX format (.fbx files). It is similar to an `<img>` tag, but for 3D.
 *
 * HTML Example:
 *
 * ```html
 * <lume-scene webgl>
 *   <lume-fbx-model src="path/to/model.fbx"></lume-fbx-model>
 * </lume-scene>
 * ```
 *
 * JavaScript Example:
 *
 * ```js
 * const scene = new Scene
 * document.body.append(scene)
 * const model = new FBXModel
 * model.src = 'path/to/model.fbx'
 * scene.add(model)
 * ```
 */
@element('lume-fbx-model', autoDefineElements)
export class FbxModel extends Node {
	static defaultBehaviors = ['fbx-model']
}

import type {ElementAttributes} from '@lume/element'
import type {ElementWithBehaviors} from '../index.js'

export interface FbxModel extends ElementWithBehaviors<FbxModelBehavior, FbxModelBehaviorAttributes> {}

declare global {
	interface HTMLElementTagNameMap {
		'lume-fbx-model': FbxModel
	}
}

declare module '@lume/element' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-fbx-model': JSX.IntrinsicElements['lume-node'] &
				ElementAttributes<FbxModelBehavior, FbxModelBehaviorAttributes>
		}
	}
}
