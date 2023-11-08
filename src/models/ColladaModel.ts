import {element} from '@lume/element'
import {Element3D, type Element3DAttributes} from '../core/Element3D.js'
import {autoDefineElements} from '../LumeConfig.js'

import type {
	ColladaModelBehavior,
	ColladaModelBehaviorAttributes,
} from '../behaviors/mesh-behaviors/models/ColladaModelBehavior.js'

// TODO FIXME Type error because this property comes from a behavior.
// new ColladaModel().src

export type ColladaModelAttributes = Element3DAttributes

/**
 * @element lume-collada-model
 * @class ColladaModel -
 * > :construction: :hammer: Under construction! :hammer: :construction:
 *
 * Defines the `<lume-collada-model>` element, for loading 3D
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
export {ColladaModel}
@element('lume-collada-model', autoDefineElements)
class ColladaModel extends Element3D {
	static override defaultBehaviors = ['collada-model']
}

import type {ElementAttributes} from '@lume/element'
import type {ElementWithBehaviors} from '../index.js'

// CONTINUE export was removed from this statement, but still kept on the above
// class. Does the type still work? Maybe we need to just put the export
// directly on the class now that we're on TS 5 (and maybe there's a TS bug when
// that isn't the case).
interface ColladaModel extends ElementWithBehaviors<ColladaModelBehavior, ColladaModelBehaviorAttributes> {}

declare global {
	interface HTMLElementTagNameMap {
		'lume-collada-model': ColladaModel
	}
}

declare module 'solid-js' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-collada-model': JSX.IntrinsicElements['lume-element3d'] &
				ElementAttributes<ColladaModelBehavior, ColladaModelBehaviorAttributes>
		}
	}
}
