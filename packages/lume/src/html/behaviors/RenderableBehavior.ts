import {Behavior} from './Behavior'
import {Events} from '../../core/Events'
import Node from '../../core/Node'

/**
 * Base class for behaviors relating to rendering
 */
export class RenderableBehavior extends Behavior {
	// Use a getter because Mesh is undefined at module evaluation time due
	// to a circular dependency.
	get requiredElementType() {
		return Node
	}

	connectedCallback() {
		super.connectedCallback()

		this.loadGL()

		this.element.on(Events.BEHAVIOR_GL_LOAD, this.loadGL, this)
		this.element.on(Events.BEHAVIOR_GL_UNLOAD, this.unloadGL, this)
	}

	disconnectedCallback() {
		super.disconnectedCallback()

		this.unloadGL()

		this.element.off(Events.BEHAVIOR_GL_LOAD, this.loadGL)
		this.element.off(Events.BEHAVIOR_GL_UNLOAD, this.unloadGL)
	}

	loadGL(): boolean {
		if (!this.element.three) return false

		if (this._glLoaded) return false
		this._glLoaded = true

		return true
	}

	unloadGL(): boolean {
		if (!this._glLoaded) return false
		this._glLoaded = false

		return true
	}

	protected _glLoaded = false
	protected _cssLoaded = false
}
