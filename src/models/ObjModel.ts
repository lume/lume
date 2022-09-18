import {element} from '@lume/element'
import {Element3D, Element3DAttributes} from '../core/Element3D.js'
import {autoDefineElements} from '../LumeConfig.js'

import type {ObjModelBehavior, ObjModelBehaviorAttributes} from '../behaviors/mesh-behaviors/models/ObjModelBehavior.js'

export type ObjModelAttributes = Element3DAttributes

/**
 * @element lume-obj-model
 * @class ObjModel - Defines the `<lume-obj-model>` element, which is short for `<lume-element3d has="obj-model">`.
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
export {ObjModel}
@element('lume-obj-model', autoDefineElements)
class ObjModel extends Element3D {
	static override defaultBehaviors = ['obj-model']
}

import type {ElementAttributes} from '@lume/element'
import type {ElementWithBehaviors} from '../index.js'

// CONTINUE export was removed from this statement, but still kept on the above
// class. Does the type still work? Maybe we need to just put the export
// directly on the class now that we're on TS 5 (and maybe there's a TS bug when
// that isn't the case).
interface ObjModel extends ElementWithBehaviors<ObjModelBehavior, ObjModelBehaviorAttributes> {}

declare global {
	interface HTMLElementTagNameMap {
		'lume-obj-model': ObjModel
	}
}

declare module 'solid-js' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-obj-model': JSX.IntrinsicElements['lume-element3d'] &
				ElementAttributes<ObjModelBehavior, ObjModelBehaviorAttributes>
		}
	}
}
