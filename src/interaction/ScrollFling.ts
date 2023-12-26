import {createSignal, onCleanup, untrack} from 'solid-js'
import {Effects, reactive, signal} from 'classy-solid'
import {Motor} from '../core/Motor.js'
import {clamp} from '../math/clamp.js'

import type {RenderTask} from '../core/index.js'

type Options = Partial<
	Pick<ScrollFling, 'target' | 'x' | 'y' | 'minX' | 'maxX' | 'minY' | 'maxY' | 'sensitivity' | 'hasInteracted'>
>

// @ts-ignore
window.debug = true

export
@reactive
class ScrollFling extends Effects {
	/**
	 * During scroll, this value will change. It is a signal so that it can be
	 * observed. Set this value initially if you want to start at a certain
	 * value.
	 */
	@signal x = 0

	/**
	 * During scroll, this value will change. It is a signal so that it can be
	 * observed. Set this value initially if you want to start at a certain
	 * value.
	 */
	@signal y = 0

	minX = -Infinity
	maxX = Infinity
	minY = -Infinity
	maxY = Infinity

	target: Element = document.documentElement

	sensitivity = 1

	@signal hasInteracted = false

	#task?: RenderTask

	#isStarted = (() => {
		const {0: get, 1: set} = createSignal(false)
		return {get, set}
	})()

	get isStarted() {
		return this.#isStarted.get()
	}

	#aborter = new AbortController()

	constructor(options: Options = {}) {
		super()
		Object.assign(this, options)
	}

	#onWheel = (event: WheelEvent) => {
		this.hasInteracted = true

		event.preventDefault()

		let dx = event.deltaX * this.sensitivity
		let dy = event.deltaY * this.sensitivity

		this.x = clamp(this.x + dx, this.minX, this.maxX)
		this.y = clamp(this.y + dy, this.minY, this.maxY)

		if (dx === 0 && dy === 0) return

		if (this.#task) Motor.removeRenderTask(this.#task)

		// slow the rotation down based on former drag speed
		this.#task = Motor.addRenderTask((): false | void => {
			dx = dx * 0.95
			dy = dy * 0.95

			this.x = clamp(this.x + dx, this.minX, this.maxX)
			this.y = clamp(this.y + dy, this.minY, this.maxY)

			// Stop the rotation update loop once the deltas are small enough
			// that we no longer notice a change.
			if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) return false
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
				// Stop any current animation, if any.
				if (this.#task) Motor.removeRenderTask(this.#task)

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
}

// @ts-ignore
window.debug = false
