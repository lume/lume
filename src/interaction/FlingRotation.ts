// TODO FlingRotation's interaction and tree structure are horribly coupled.
// Instead we can implement DragFling, similar to ScrollFling and PinchFling,
// and use that for rotation. Then if we even keep FlingRotation, we can just
// have it accept a single element to rotate, and it would apply DragFling (or
// whichever fling is provided, easy to compose things).

import {effect, Effects, signal} from 'classy-solid'
import {onCleanup, untrack} from 'solid-js'
import {clamp} from '../math/clamp.js'
import type {Element3D} from '../core/Element3D.js'

type Options = Partial<
	Pick<
		FlingRotation,
		| 'rotationXTarget'
		| 'rotationYTarget'
		| 'interactionInitiator'
		| 'interactionContainer'
		| 'minFlingRotationX'
		| 'maxFlingRotationX'
		| 'minFlingRotationY'
		| 'maxFlingRotationY'
		| 'factor'
		| 'epsilon'
		| 'slowdownAmount'
	>
>

type DraggableTargets = HTMLElement | SVGElement | MathMLElement | Document | Window

export class FlingRotation extends Effects {
	/** The object that will be rotated on Y. Required. */
	@signal rotationYTarget!: Element3D

	/**
	 * The object that will be rotated on X. Defaults to the element inside the
	 * rotationYTarget (it's like a gimball).
	 */
	@signal rotationXTarget!: Element3D

	/**
	 * The element on which the pointer should be placed down on in order to
	 * initiate drag tracking. This falls back to interactionContainer if not
	 * specified.
	 */
	@signal interactionInitiator?: DraggableTargets

	/**
	 * The area in which drag tacking will happen. Defaults to
	 * document.documentElement for tracking in the whole viewport.
	 */
	// TODO we only need the initiator (just call it target) and we can remove
	// this in favor of pointer capture.
	@signal interactionContainer: DraggableTargets = document.documentElement

	/**
	 * The X rotation can not go below this value. Defaults to -90 which means
	 * facing straight up.
	 */
	minFlingRotationX: number = -90

	/**
	 * The X rotation can not go above this value. Defaults to 90 which means
	 * facing straight down.
	 */
	maxFlingRotationX: number = 90

	/**
	 * The Y rotation can not go below this value. Defaults to -Infinity which
	 * means the camera can keep rotating laterally around the focus point
	 * indefinitely.
	 */
	minFlingRotationY: number = -Infinity

	/**
	 * The Y rotation can not go below this value. Defaults to Infinity which
	 * means the camera can keep rotating laterally around the focus point
	 * indefinitely.
	 */
	maxFlingRotationY: number = Infinity

	factor = 1

	epsilon = 0.01

	/**
	 * Portion of the change in rotation that is removed each frame to
	 * cause slowdown. Between 0 and 1.
	 */
	slowdownAmount = 0.05

	#aborter = new AbortController()

	constructor(options: Options = {}) {
		super()
		Object.assign(this, options)
	}

	#firstPointer = -1

	// The last X/Y only for a single pointer (the rest are ignored).
	#lastX = 0
	#lastY = 0

	#deltaX = 0
	#deltaY = 0

	#moveTimestamp = 0

	@signal accessor #isStarted = false

	get isStarted() {
		return this.#isStarted
	}

	#onPointerDown = (event: PointerEvent) => {
		if (this.#firstPointer !== -1) return

		this.#firstPointer = event.pointerId

		event.preventDefault()

		captureTarget(this.interactionContainer).setPointerCapture(this.#firstPointer)

		this.#stopAnimation()

		this.#lastX = event.x
		this.#lastY = event.y
		this.#deltaX = 0
		this.#deltaY = 0

		// @ts-expect-error, whyyyy TypeScript It says that event type is Event instead of PointerEvent
		this.interactionContainer.addEventListener('pointermove', this.#onMove, {signal: this.#aborter.signal})

		// @ts-expect-error, whyyyy TypeScript It says that event type is Event instead of PointerEvent
		this.interactionContainer.addEventListener('pointerup', this.#onPointerUp, {signal: this.#aborter.signal})

		// Chrome bug workaround: pointerleave is fired after pointerup
		// normally, after letting go outside the target element and when
		// pointer capture was used. But in Chrome the pointerup event fails to
		// fire if a pointermove happened in the same tick as the pointerup, so
		// we also run onPointerUp in pointerleave to catch the Chrome edge
		// case. https://issues.chromium.org/issues/40919532
		// @ts-expect-error, whyyyy TypeScript It says that event type is Event instead of PointerEvent
		this.interactionContainer.addEventListener('pointerleave', this.#onPointerUp, {signal: this.#aborter.signal})

		// @ts-expect-error, whyyyy TypeScript It says that event type is Event instead of PointerEvent
		this.interactionContainer.addEventListener( 'pointercancel', this.#onInteractionLost, {signal: this.#aborter.signal} )
		// @ts-expect-error, whyyyy TypeScript It says that event type is Event instead of PointerEvent
		this.interactionContainer.addEventListener( 'lostpointercapture', this.#onPointerUp, {signal: this.#aborter.signal} )
	}

	#onMove = (event: PointerEvent) => {
		if (this.#firstPointer === -1) return
		if (event.pointerId !== this.#firstPointer) return

		this.#moveTimestamp = performance.now()

		// We're not simply using event.movementX and event.movementY
		// because of a Safari bug:
		// https://bugs.webkit.org/show_bug.cgi?id=248119
		const movementX = event.x - this.#lastX
		const movementY = event.y - this.#lastY
		this.#lastX = event.x
		this.#lastY = event.y

		this.#deltaX = movementY * 0.15 * this.factor
		this.rotationXTarget.rotation.x = clamp(
			this.rotationXTarget.rotation.x + this.#deltaX,
			this.minFlingRotationX,
			this.maxFlingRotationX,
		)

		this.#deltaY = -movementX * 0.15 * this.factor
		this.rotationYTarget.rotation.y = clamp(
			this.rotationYTarget.rotation.y + this.#deltaY,
			this.minFlingRotationY,
			this.maxFlingRotationY,
		)
	}

	#onPointerUp = (event: PointerEvent) => {
		if (this.#firstPointer === -1) return
		if (event.pointerId !== this.#firstPointer) return

		this.#firstPointer = -1

		// TODO this may not be needed, capture is automatically released if
		// the capture pointer goes up. Test and confirm.
		if (captureTarget(this.interactionContainer).hasPointerCapture(this.#firstPointer))
			captureTarget(this.interactionContainer).releasePointerCapture(this.#firstPointer)

		// stop dragging
		// @ts-expect-error, whyyyy TypeScript It says that event type is Event instead of PointerEvent
		this.interactionContainer.removeEventListener('pointermove', this.#onMove)
		// @ts-expect-error, whyyyy TypeScript It says that event type is Event instead of PointerEvent
		this.interactionContainer.removeEventListener('pointerup', this.#onPointerUp)
		// @ts-expect-error, whyyyy TypeScript It says that event type is Event instead of PointerEvent
		this.interactionContainer.removeEventListener('pointerleave', this.#onPointerUp)
		// @ts-expect-error, whyyyy TypeScript It says that event type is Event instead of PointerEvent
		this.interactionContainer.removeEventListener('pointercancel', this.#onInteractionLost)
		// @ts-expect-error, whyyyy TypeScript It says that event type is Event instead of PointerEvent
		this.interactionContainer.removeEventListener('lostpointercapture', this.#onPointerUp)

		if ((this.#deltaX === 0 && this.#deltaY === 0) || performance.now() - this.#moveTimestamp > 100) return

		// slow the rotation down based on former drag speed
		this.rotationXTarget.rotation = (x, y, z, _t, dt) => {
			const fpsRatio = dt / 16.6666

			// Multiply by fpsRatio so that the slowdownAmount is consistent over time no matter the fps.
			this.#deltaX *= 1 - fpsRatio * this.slowdownAmount

			// stop rotation once the delta is small enough that we
			// no longer notice the rotation.
			if (Math.abs(this.#deltaX) < this.epsilon) return false

			return [clamp(x + this.#deltaX, this.minFlingRotationX, this.maxFlingRotationX), y, z]
		}

		this.rotationYTarget.rotation = (x, y, z, _t, dt) => {
			const fpsRatio = dt / 16.6666

			// Multiply by fpsRatio so that the slowdownAmount is consistent over time no matter the fps.
			this.#deltaY *= 1 - fpsRatio * this.slowdownAmount

			// stop rotation once the delta is small enough that we
			// no longer notice the rotation.
			if (Math.abs(this.#deltaY) < this.epsilon) return false

			return [x, clamp(y + this.#deltaY, this.minFlingRotationY, this.maxFlingRotationY), z]
		}
	}

	// Hack needed for Chrome (works fine in Firefox) otherwise
	// pointercancel breaks the drag handling. See
	// https://crbug.com/1166044
	#onInteractionLost = (event: PointerEvent) => {
		console.error(
			'Pointer interaction lost. If this happened while the app was focused, please kindly open an issue at https://github.com/lume/lume/issues.',
		)
		this.#onPointerUp(event)
	}

	#onDragStart = (event: DragEvent) => event.preventDefault()

	start(): this {
		if (untrack(() => this.#isStarted)) return this
		this.#isStarted = true

		this.startEffects()

		return this
	}

	@effect flingRotationEffect() {
		// We need all these things for interaction to continue.
		if (!(this.rotationYTarget && this.rotationXTarget && this.interactionContainer))
			return

		this.#aborter = new AbortController()

		const initiator = this.interactionInitiator ?? this.interactionContainer
		// @ts-expect-error, whyyyy TypeScript It says that event type is Event instead of PointerEvent. TODO fix TypeScript lib.dom types.
		initiator.addEventListener('pointerdown', this.#onPointerDown, {signal: this.#aborter.signal})
		// @ts-expect-error, whyyyy TypeScript It says that event type is Event instead of PointerEvent
		initiator.addEventListener('dragstart', this.#onDragStart, {signal: this.#aborter.signal})

		onCleanup(() => {
			this.#firstPointer = -1
			this.#stopAnimation()
			this.#aborter.abort()
		})
	}

	stop(): this {
		if (!untrack(() => this.#isStarted)) return this
		this.#isStarted = false

		// CONTINUE Fix/update/delete all stopEffects() usage.
		this.stopEffects()

		return this
	}

	#stopAnimation() {
		// Stop any current animation.
		this.rotationXTarget.rotation = () => false
		this.rotationYTarget.rotation = () => false
	}

	// @ts-expect-error Dummy signal field finalizes effects after private fields to prevent TDZ
	@signal private __init_effects_ignore = 0
}

function captureTarget(target: DraggableTargets) {
	return target instanceof Window || target instanceof Document
		? document.documentElement
		: target
}
