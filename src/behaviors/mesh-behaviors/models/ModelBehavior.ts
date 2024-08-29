import {signal} from 'classy-solid'
import {Model} from '../../../models/Model.js'
import {RenderableBehavior} from '../../RenderableBehavior.js'
import {behavior} from '../../Behavior.js'

/** Base class for model behaviors. */
export
@behavior
abstract class ModelBehavior extends RenderableBehavior {
	declare element: Model

	override requiredElementType() {
		return [Model]
	}

	@signal isLoading = false
	@signal model?: unknown
}
