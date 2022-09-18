import {createSignal, untrack} from 'solid-js'
import {reactive} from '@lume/element'
import {Motor} from '../core/Motor.js'
import {clamp} from '../math/clamp.js'

import type {RenderTask} from '../core/index.js'
import {untrack} from 'solid-js'

type ScrollFlingOptions = Partial<
	Pick<ScrollFling, 'target' | 'x' | 'y' | 'minX' | 'maxX' | 'minY' | 'maxY' | 'scrollFactor'>
>

@reactive
export class ScrollFling {
	/**
	 * During scroll, this value will change. It is reactive so that it can be
	 * observed. Set this value initially if you want to start at a certain
	 * value.
	 */
	@reactive x = 0

	/**
	 * During scroll, this value will change. It is reactive so that it can be
	 * observed. Set this value initially if you want to start at a certain
	 * value.
	 */
	@reactive y = 0

	minX = -Infinity
	maxX = Infinity
	minY = -Infinity
	maxY = Infinity

	target: Document | ShadowRoot | Element = document

	scrollFactor = 1

	#task?: RenderTask

	#isStarted = (() => {
		const {0: get, 1: set} = createSignal(false)
		return {get, set}
	})()

	get isStarted() {
		return this.#isStarted.get()
	}

	constructor(options: ScrollFlingOptions) {
		Object.assign(this, options)
		// untrack(() => console.log('ScrollFling constructor -----> ', this.y))
		// debugger
	}

	#onWheel = (event: WheelEvent) => {
		event.preventDefault()

		let dx = event.deltaX * this.scrollFactor
		let dy = event.deltaY * this.scrollFactor

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
		// untrack(() => console.log('ScrollFling start -----> ', this.y))

		if (untrack(this.#isStarted.get)) return this
		this.#isStarted.set(true)

		// @ts-expect-error, whyyyyy TypeScript
		this.target.addEventListener('wheel', this.#onWheel)

		return this
	}

	stop(): this {
		if (!untrack(this.#isStarted.get)) return this
		this.#isStarted.set(false)

		// Stop any current animation, if any.
		if (this.#task) Motor.removeRenderTask(this.#task)

		// @ts-expect-error, whyyyyy TypeScript
		this.target.removeEventListener('wheel', this.#onWheel)

		// untrack(() => console.log('ScrollFling stop -----> ', this.y))

		return this
	}
}
