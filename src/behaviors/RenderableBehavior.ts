import {Behavior} from './Behavior.js'
import {Events} from '../core/Events.js'
import {Element3D} from '../core/Element3D.js'
import {Effectful} from '../core/Effectful.js'

/**
 * @class RenderableBehavior
 * Base class for element behaviors that provide rendering features (f.e. geometries, materials, etc).
 *
 * Subclasses should provide loadGL and unloadGL methods in order to load or
 * unload WebGL resources when GL is enabled or disabled in a scene.
 *
 * @extends Behavior
 */
export abstract class RenderableBehavior extends Effectful(Behavior) {
	override requiredElementType() {
		return [Element3D]
	}

	override connectedCallback() {
		super.connectedCallback()

		this.#triggerLoadGL()

		this.element.on(Events.BEHAVIOR_GL_LOAD, this.#triggerLoadGL, this)
		this.element.on(Events.BEHAVIOR_GL_UNLOAD, this.#triggerUnloadGL, this)
	}

	override disconnectedCallback() {
		super.disconnectedCallback()

		this.#triggerUnloadGL()

		this.element.off(Events.BEHAVIOR_GL_LOAD, this.#triggerLoadGL, this)
		this.element.off(Events.BEHAVIOR_GL_UNLOAD, this.#triggerUnloadGL, this)
	}

	get glLoaded() {
		return this._glLoaded
	}

	_glLoaded = false

	get cssLoaded() {
		return this._cssLoaded
	}

	_cssLoaded = false

	#triggerLoadGL() {
		// .three will be undefined if an element is not upgraded yet.
		if (!this.element.three) return

		if (this._glLoaded) return
		this._glLoaded = true

		this.loadGL()
		this.element.needsUpdate()
	}

	#triggerUnloadGL() {
		if (!this._glLoaded) return
		this._glLoaded = false

		this.stopEffects()
		this.unloadGL()
		this.element.needsUpdate()
	}

	// Subclasses override these
	loadGL(): void {}
	unloadGL(): void {}
}
