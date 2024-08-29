import {createSignal, onCleanup, untrack} from 'solid-js'
import {Effects, reactive, signal} from 'classy-solid'
import {Motor} from '../core/Motor.js'
import {clamp} from '../math/clamp.js'
import type {RenderTask} from '../core/index.js'
import {Settable} from '../utils/Settable.js'

// @ts-ignore
window.debug = true

export
@reactive
class ScrollFling extends Settable(Effects) {
	@signal private _x = 0

	/**
	 * During scroll, this value will change. It is a signal so that it can be
	 * observed. Set this value initially if you want to start at a certain
	 * value. Setting the value immediately stops any smoothing animation.
	 */
	get x() {
		return this._x
	}
	set x(val) {
		this.#stopAnimation()
		this._x = val
		this.#targetX = val
	}

	@signal private _y = 0

	/**
	 * During scroll, this value will change. It is a signal so that it can be
	 * observed. Set this value initially if you want to start at a certain
	 * value. Setting the value immediately stops any smoothing animation.
	 */
	get y() {
		return this._y
	}
	set y(val) {
		this.#stopAnimation()
		this._y = val
		this.#targetY = val
	}

	minX = -Infinity
	maxX = Infinity
	minY = -Infinity
	maxY = Infinity

	target: Element = document.documentElement

	sensitivity = 1

	@signal hasInteracted = false

	epsilon = 0.01

	/**
	 * The portion to lerp towards the target values each frame. Between 0 and 1.
	 */
	lerpAmount = 0.3

	#targetX = 0
	#targetY = 0

	#task?: RenderTask

	#isStarted = (() => {
		const [get, set] = createSignal(false)
		return {get, set}
	})()

	get isStarted() {
		return this.#isStarted.get()
	}

	#aborter = new AbortController()

	#onWheel = (event: WheelEvent) => {
		this.hasInteracted = true

		event.preventDefault()

		const dx = event.deltaX * this.sensitivity
		const dy = event.deltaY * this.sensitivity

		this.#targetX = clamp(this.#targetX + dx, this.minX, this.maxX)
		this.#targetY = clamp(this.#targetY + dy, this.minY, this.maxY)

		this.#stopAnimation()

		// lerp towards the target values
		this.#task = Motor.addRenderTask((_t, dt): false | void => {
			const dx = this.#targetX - this._x
			const dy = this.#targetY - this._y
			const fpsRatio = dt / 16.6666

			// Multiply by fpsRatio so that the lerpAmount is consistent over time no matter the fps.
			this._x += dx * fpsRatio * this.lerpAmount
			this._y += dy * fpsRatio * this.lerpAmount

			// Stop the fling update loop once the deltas are small enough
			// that we no longer notice a change.
			if (Math.abs(dx) < this.epsilon && Math.abs(dy) < this.epsilon) return false
		})
	}

	start(): this {
		if (untrack(this.#isStarted.get)) return this
		this.#isStarted.set(true)

		this.createEffect(() => {
			this.target // any time the target changes make new events on that target

			this.#aborter = new AbortController()

			// @ts-expect-error, whyyyyy TypeScript
			this.target.addEventListener('wheel', this.#onWheel, {signal: this.#aborter.signal})

			onCleanup(() => {
				this.#stopAnimation()
				this.#aborter.abort()
			})
		})

		return this
	}

	stop(): this {
		if (!untrack(this.#isStarted.get)) return this
		this.#isStarted.set(false)

		this.stopEffects()

		return this
	}

	#stopAnimation() {
		// Stop any current animation, if any.
		if (this.#task) Motor.removeRenderTask(this.#task)
	}
}

// @ts-ignore
window.debug = false
