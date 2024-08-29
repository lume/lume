import {createSignal, onCleanup, untrack} from 'solid-js'
import {Effects, reactive, signal} from 'classy-solid'
import {Motor, type RenderTask} from '../core/Motor.js'
import {Settable} from '../utils/Settable.js'
import {clamp} from '../math/clamp.js'

@reactive
export class DragFling extends Settable(Effects) {
	@signal private _x = 0

	/**
	 * During drag, this value will change. It is a signal so that it can be
	 * observed. Set this value initially if you want to start at a certain
	 * value.
	 */
	get x() {
		return this._x
	}
	set x(val) {
		this.#stopAnimation()
		this._x = val
	}

	@signal private _y = 0

	/**
	 * During drag, this value will change. It is a signal so that it can be
	 * observed. Set this value initially if you want to start at a certain
	 * value.
	 */
	get y() {
		return this._y
	}
	set y(val) {
		this.#stopAnimation()
		this._y = val
	}

	minX = -Infinity
	maxX = Infinity
	minY = -Infinity
	maxY = Infinity

	@signal target: Element = document.documentElement

	sensitivity = 1

	epsilon = 0.01

	/**
	 * Portion of the change in value that is removed each frame to
	 * cause slowdown. Between 0 and 1.
	 */
	slowdownAmount = 0.05

	invertY = false
	invertX = false

	/**
	 * The allowed pointer types to use for dragging ('mouse', 'pen', or
	 * 'touch'). Default is all of them.
	 */
	@signal pointerTypes: ('mouse' | 'pen' | 'touch')[] = ['mouse', 'pen', 'touch']

	#task?: RenderTask

	#interacting = (() => {
		const [get, set] = createSignal(false)
		return {get, set}
	})()

	get interacting() {
		return this.#interacting.get()
	}

	#isStarted = (() => {
		const [get, set] = createSignal(false)
		return {get, set}
	})()

	get isStarted() {
		return this.#isStarted.get()
	}

	#aborter = new AbortController()

	#mainPointer = -1
	#pointerCount = 0

	// The last X/Y only for a single pointer (the rest are ignored).
	#lastX = 0
	#lastY = 0

	#deltaX = 0
	#deltaY = 0

	#moveTimestamp = 0

	#onDown = (event: PointerEvent) => {
		// @ts-expect-error event.pointerTypes is just 'string'
		if (!this.pointerTypes.includes(event.pointerType)) return

		// When using a mouse, drag only with left button (TODO: make it configurable)
		if (event.pointerType === 'mouse' && event.button !== 0) return

		this.#pointerCount++
		if (this.#pointerCount === 1) this.#mainPointer = event.pointerId
		else return

		// Capture for mouse only because it can go outside the window, and
		// letting go outside the window will cause pointerup not to be handled.
		// On mobile the pointer doesn't go out of the window, and is basically
		// already captured within the whole display. Plus if we capture on
		// mobile then the tilt card won't tilt, and the links won't be
		// clickable, because capture will prevent pointerdown from happening on
		// the cards.
		if (event.pointerType === 'mouse') this.target.setPointerCapture(this.#mainPointer)

		this.#stopAnimation()

		this.#lastX = event.x
		this.#lastY = event.y
		this.#deltaX = 0
		this.#deltaY = 0

		// @ts-expect-error, whyyyy TypeScript It says that event type is Event instead of PointerEvent
		this.target.addEventListener('pointermove', this.#onMove, {signal: this.#aborter.signal})
		this.target.addEventListener('pointerup', this.#onUp, {signal: this.#aborter.signal})

		this.#interacting.set(true)
	}

	#onMove = (event: PointerEvent) => {
		if (event.pointerId !== this.#mainPointer) return

		this.#moveTimestamp = performance.now()

		// We're not simply using event.movementX and event.movementY
		// because of a Safari bug:
		// https://bugs.webkit.org/show_bug.cgi?id=248119
		const movementX = event.x - this.#lastX
		const movementY = event.y - this.#lastY
		this.#lastX = event.x
		this.#lastY = event.y

		this.#deltaX = movementX * this.sensitivity * (this.invertX ? -1 : 1)
		this._x = clamp(this._x + this.#deltaX, this.minX, this.maxX)

		this.#deltaY = movementY * this.sensitivity * (this.invertY ? -1 : 1)
		this._y = clamp(this._y + this.#deltaY, this.minY, this.maxY)
	}

	#onUp = () => {
		this.#pointerCount--

		if (this.#pointerCount === 0) {
			if (this.target.hasPointerCapture(this.#mainPointer)) this.target.releasePointerCapture(this.#mainPointer)
			this.#mainPointer = -1
			this.target.removeEventListener('pointerup', this.#onUp)
		}

		// stop dragging
		// @ts-expect-error, whyyyy TypeScript It says that event type is Event instead of PointerEvent
		this.target.removeEventListener('pointermove', this.#onMove)

		this.#interacting.set(false)

		if ((this.#deltaX === 0 && this.#deltaY === 0) || performance.now() - this.#moveTimestamp > 100) return

		// slow the rotation down based on former drag speed
		Motor.addRenderTask((_t, dt) => {
			const fpsRatio = dt / 16.6666

			// Multiply by fpsRatio so that the slowdownAmount is consistent over time no matter the fps.
			this.#deltaX *= 1 - fpsRatio * this.slowdownAmount
			this.#deltaY *= 1 - fpsRatio * this.slowdownAmount

			// stop rotation once the delta is small enough that we
			// no longer notice the rotation.
			if (Math.abs(this.#deltaX) < this.epsilon && Math.abs(this.#deltaY) < this.epsilon) return false

			this._x = clamp(this._x + this.#deltaX, this.minX, this.maxX)
			this._y = clamp(this._y + this.#deltaY, this.minY, this.maxY)

			return
		})
	}

	#onDragStart = (event: DragEvent) => event.preventDefault()

	start(): this {
		if (untrack(this.#isStarted.get)) return this
		this.#isStarted.set(true)

		this.createEffect(() => {
			// any time the these change restart event handling
			this.target
			this.pointerTypes

			this.#aborter = new AbortController()

			// any time the target changes make new events on that target
			// @ts-expect-error, whyyyy TypeScript TODO fix TypeScript lib.dom types.
			this.target.addEventListener('pointerdown', this.#onDown, {signal: this.#aborter.signal})

			// Hack needed for Chrome (works fine in Firefox) otherwise
			// pointercancel breaks the drag handling. See
			// https://crbug.com/1166044
			// @ts-expect-error, whyyyy TypeScript It says that event type is Event instead of PointerEvent
			this.target.addEventListener('dragstart', this.#onDragStart, {signal: this.#aborter.signal})
			this.target.addEventListener(
				'pointercancel',
				() => {
					console.error(
						'Pointercancel should not be happening. If so, please kindly open an issue at https://github.com/lume/lume/issues.',
					)
				},
				{signal: this.#aborter.signal},
			)

			onCleanup(() => {
				this.#mainPointer = -1
				this.#pointerCount = 0

				this.#stopAnimation()

				this.#aborter.abort()
				this.#interacting.set(false)
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
		if (this.#task) Motor.removeRenderTask(this.#task)
	}
}
