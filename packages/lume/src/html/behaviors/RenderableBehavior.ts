import {Behavior} from './Behavior.js'
import {Events} from '../../core/Events.js'
import Node from '../../core/Node.js'

/**
 * Base class for behaviors relating to rendering. This is for any behavior that renders with CSS or WebGL rendering.
 */
export abstract class RenderableBehavior extends Behavior {
	requiredElementType() {
		return [Node]
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

		this.element.off(Events.BEHAVIOR_GL_LOAD, this.loadGL, this)
		this.element.off(Events.BEHAVIOR_GL_UNLOAD, this.unloadGL, this)
	}

	get glLoaded() {
		return this._glLoaded
	}

	protected _glLoaded = false

	get cssLoaded() {
		return this._cssLoaded
	}

	protected _cssLoaded = false

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
}
