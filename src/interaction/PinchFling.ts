import {createSignal, onCleanup, untrack} from 'solid-js'
import {Effects, reactive, signal} from 'classy-solid'
import {Motor} from '../core/Motor.js'
import {clamp} from '../math/clamp.js'

import type {RenderTask} from '../core/index.js'

type Options = Partial<Pick<PinchFling, 'target' | 'x' | 'minX' | 'maxX' | 'sensitivity' | 'hasInteracted'>>

export
@reactive
class PinchFling extends Effects {
	/**
	 * During pinch, this value will change. It is a signal so that it can be
	 * observed. Set this value initially if you want to start at a certain
	 * value.
	 */
	@signal x = 0

	minX = -Infinity
	maxX = Infinity

	@signal target: Element = document.documentElement

	sensitivity = 1

	@signal hasInteracted = false

	#task?: RenderTask

	#interacting = (() => {
		const {0: get, 1: set} = createSignal(false)
		return {get, set}
	})()

	get interacting() {
		return this.#interacting.get()
	}

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

	#onPinch = (dx: number) => {
		this.hasInteracted = true

		dx = dx * this.sensitivity

		this.x = clamp(this.x + dx, this.minX, this.maxX)

		if (dx === 0) return

		if (this.#task) Motor.removeRenderTask(this.#task)

		// slow the rotation down based on former drag speed
		this.#task = Motor.addRenderTask((): false | void => {
			dx = dx * 0.95

			this.x = clamp(this.x + dx, this.minX, this.maxX)

			// Stop the rotation update loop once the deltas are small enough
			// that we no longer notice a change.
			if (Math.abs(dx) < 0.01) return false
		})
	}

	#pointers: Map<number, {id: number; x: number; y: number}> = new Map()

	#onDown = (event: PointerEvent) => {
		event.clientX

		this.#pointers.set(event.pointerId, {
			id: event.pointerId,
			x: event.clientX,
			y: event.clientY,
		})

		if (this.#pointers.size === 2) {
			// go two fingers

			// @ts-expect-error TypeScript type for `event` is wrong
			this.target.addEventListener('pointermove', this.#onMove, {signal: this.#aborter.signal})
			this.#interacting.set(true)
		}
	}

	#lastDistance = -1

	#onMove = (event: PointerEvent) => {
		if (!this.#pointers.has(event.pointerId)) return
		if (this.#pointers.size < 2) return

		const [one, two] = this.#pointers.values()

		if (event.pointerId === one.id) {
			one.x = event.clientX
			one.y = event.clientY
		} else {
			two.x = event.clientX
			two.y = event.clientY
		}

		const distance = Math.abs(Math.sqrt((two.x - one.x) ** 2 + (two.y - one.y) ** 2))
		if (this.#lastDistance === -1) this.#lastDistance = distance
		const dx = this.#lastDistance - distance
		this.#onPinch(dx)
		this.#lastDistance = distance
	}

	#onUp = (event: PointerEvent) => {
		if (!this.#pointers.has(event.pointerId)) return

		this.#pointers.delete(event.pointerId)
		this.#lastDistance = -1

		if (this.#pointers.size === 1) {
			// @ts-expect-error TypeScript type for `event` is wrong
			this.target.removeEventListener('pointermove', this.#onMove)
			this.#interacting.set(false)
		}
	}

	start(): this {
		if (untrack(this.#isStarted.get)) return this
		this.#isStarted.set(true)

		this.createEffect(() => {
			this.target // any time the target changes make new events on that target

			this.#aborter = new AbortController()

			// @ts-expect-error, whyyyyy TypeScript
			this.target.addEventListener('pointerdown', this.#onDown, {signal: this.#aborter.signal})
			// @ts-expect-error, whyyyyy TypeScript
			this.target.addEventListener('pointerup', this.#onUp, {signal: this.#aborter.signal})

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
