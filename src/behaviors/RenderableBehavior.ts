import {Effectful} from 'classy-solid'
import {Behavior} from './Behavior.js'
import {Element3D} from '../core/Element3D.js'

/**
 * @class RenderableBehavior
 * Base class for element behaviors that provide rendering features (f.e. geometries, materials, etc).
 *
 * @extends Behavior
 * @deprecated Legacy behavior system via `has=""` attribute is deprecated. Use child behavior elements instead. Legacy behaviors will be removed in a future version.
 */
export abstract class RenderableBehavior extends Effectful(Behavior) {
	declare element: Element3D

	override requiredElementType() {
		return [Element3D]
	}

	override connectedCallback() {
		super.connectedCallback()

		this.element.needsUpdate()
	}

	override disconnectedCallback() {
		super.disconnectedCallback()

		this.element.needsUpdate()
	}
}
