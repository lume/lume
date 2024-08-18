import {Model} from '../../../models/Model.js'
import {RenderableBehavior} from '../../RenderableBehavior.js'

/**
 * Base class for model behaviors. This is temporary as we transition to
 * elements instead of behaviors for some features such as models.
 * @deprecated Don't use model behaviors directly, instead use `<lume-*-model>` elements (f.e. `<lume-gltf-model>`)
 * @extends RenderableBehavior
 */
export class ModelBehavior extends RenderableBehavior {
	declare element: Model

	override requiredElementType() {
		return [Model]
	}

	/** @deprecated access `.threeModel` on the model element instead. */
	model?: object | null = null
}
