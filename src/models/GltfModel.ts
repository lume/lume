import {element} from '@lume/element'
import {Element3D, Element3DAttributes} from '../core/Element3D.js'
import {autoDefineElements} from '../LumeConfig.js'

import type {
	GltfModelBehavior,
	GltfModelBehaviorAttributes,
} from '../behaviors/mesh-behaviors/models/GltfModelBehavior.js'

export type GltfModelAttributes = Element3DAttributes

/**
 * @element lume-gltf-model
 * @class GltfModel -
 * > :construction: :hammer: Under construction! :hammer: :construction:
 *
 * Defines the `<lume-gltf-model>` element, for loading 3D
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
@element('lume-gltf-model', autoDefineElements)
export class GltfModel extends Element3D {
	static override defaultBehaviors = ['gltf-model']
}

import type {ElementAttributes} from '@lume/element'
import type {ElementWithBehaviors} from '../index.js'

export interface GltfModel extends ElementWithBehaviors<GltfModelBehavior, GltfModelBehaviorAttributes> {}

declare global {
	interface HTMLElementTagNameMap {
		'lume-gltf-model': GltfModel
	}
}

declare module '@lume/element' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-gltf-model': JSX.IntrinsicElements['lume-element3d'] &
				ElementAttributes<GltfModelBehavior, GltfModelBehaviorAttributes>
		}
	}
}
