import {Behavior} from './Behavior.js'
import {Element3D} from '../core/Element3D.js'
import {onCleanup} from 'solid-js'

/**
 * @class RenderableBehavior
 * Base class for element behaviors that provide rendering features (f.e. geometries, materials, etc).
 *
 * @extends HTMLElement
 */
export abstract class RenderableBehavior extends Behavior {
	declare readonly composedParent: Element3D | null

	override requiredParentType() {
		return [Element3D]
	}

	protected override _parentDefinedEffect(parent: NonNullable<this['composedParent']> = this.composedParent!) {
		super._parentDefinedEffect(parent)
		parent.needsUpdate()
		onCleanup(() => parent.needsUpdate())
	}
}
