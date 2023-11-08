import {element} from '@lume/element'
import {Element3D, type Element3DAttributes} from '../core/Element3D.js'
import {autoDefineElements} from '../LumeConfig.js'

import type {FbxModelBehavior, FbxModelBehaviorAttributes} from '../behaviors/mesh-behaviors/models/FbxModelBehavior.js'

export type FbxModelAttributes = Element3DAttributes

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
 * const model = new FbxModel
 * model.src = 'path/to/model.fbx'
 * scene.add(model)
 * ```
 */
export {FbxModel}
@element('lume-fbx-model', autoDefineElements)
class FbxModel extends Element3D {
	static override defaultBehaviors = ['fbx-model']
}

import type {ElementAttributes} from '@lume/element'
import type {ElementWithBehaviors} from '../index.js'

// CONTINUE export was removed from this statement, but still kept on the above
// class. Does the type still work? Maybe we need to just put the export
// directly on the class now that we're on TS 5 (and maybe there's a TS bug when
// that isn't the case).
interface FbxModel extends ElementWithBehaviors<FbxModelBehavior, FbxModelBehaviorAttributes> {}

declare global {
	interface HTMLElementTagNameMap {
		'lume-fbx-model': FbxModel
	}
}

declare module 'solid-js' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-fbx-model': JSX.IntrinsicElements['lume-element3d'] &
				ElementAttributes<FbxModelBehavior, FbxModelBehaviorAttributes>
		}
	}
}
