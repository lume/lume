import {Element3D, type Element3DAttributes} from '../core/Element3D.js'
import {skeletonHelper} from '../utils/three/skeletonHelper.js'

export type ModelAttributes = Element3DAttributes

/**
 * @class Model - Base class for model elements (f.e. `<lume-gltf-model>`, `<lume-fbx-model>`, etc)
 * @extends Element3D
 */
export class Model extends Element3D {
	override connectedCallback() {
		super.connectedCallback()

		this.createEffect(() => {
			if (!this.scene) return
			if (this.debug) skeletonHelper(this)
		})
	}
}
