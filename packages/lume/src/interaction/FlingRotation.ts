import {clamp} from '../math/clamp.js'

import type {Node} from '../core/Node.js'

type FlingRotationOptions = Pick<FlingRotation, 'rotationYTarget'> &
	Partial<
		Pick<
			FlingRotation,
			| 'rotationXTarget'
			| 'interactionInitiator'
			| 'minFlingRotationX'
			| 'maxFlingRotationX'
			| 'interactionContainer'
		>
	>

export class FlingRotation {
	/** The object that will be rotated on Y. */
	readonly rotationYTarget!: Node

	/**
	 * The object that will be rotated on X. Defaults to the element inside the
	 * rotationYTarget (it's like a gimball).
	 */
	readonly rotationXTarget!: Node

	/**
	 * The element on which the pointer should be placed down on in order to
	 * initiate drag tracking. This defaults to rotationXTarget.
	 */
	readonly interactionInitiator!: Document | ShadowRoot | Element

	/**
	 * The X rotation can not go below this value. Defaults to -90 which means
	 * facing straight up.
	 */
	readonly minFlingRotationX: number = -90

	/**
	 * The X rotation can not go above this value. Defaults to 90 which means
	 * facing straight down.
	 */
	readonly maxFlingRotationX: number = 90

	/**
	 * The area in which drag tacking will happen. Defaults to document because
	 * usually you want to track in the whole viewport, otherwise if the pointer
	 * comes up outside of this area it will leave things in a bad state.
	 */
	readonly interactionContainer: Document | ShadowRoot | Element = document

	constructor(
		// {
		// rotationYTarget,
		// rotationXTarget = rotationYTarget.children[0] as Node,
		// interactionInitiator = rotationXTarget,
		// }
		options: FlingRotationOptions,
	) {
		Object.assign(this, options)

		// FlingRotation is dependent on tree structure (unless otherwise
		// specified by the input options), at least for now.
		if (!this.rotationXTarget) this.rotationXTarget = this.rotationYTarget.children[0] as Node
		if (!this.interactionInitiator) this.interactionInitiator = this.rotationXTarget

		this.start()
	}

	#onMove?: (event: PointerEvent) => void
	#onPointerUp?: (event: PointerEvent) => void

	#onPointerDown = () => {
		// Stop rotation if any.
		this.rotationYTarget.rotation = () => false

		let deltaX = 0
		let deltaY = 0

		this.#onMove = (event: PointerEvent) => {
			deltaX = event.movementY * 0.2
			this.rotationXTarget.getRotation().x = clamp(
				this.rotationXTarget.getRotation().x + deltaX,
				this.minFlingRotationX,
				this.maxFlingRotationX,
			)
			deltaY = -event.movementX * 0.2
			this.rotationYTarget.getRotation().y += deltaY
		}

		// @ts-ignore, whyyyy TypeScript TODO fix TypeScript lib.dom types.
		this.interactionContainer.addEventListener('pointermove', this.#onMove)

		this.interactionContainer.addEventListener(
			'pointerup',
			(this.#onPointerUp = () => {
				// stop dragging
				// @ts-ignore, whyyyy TypeScript TODO fix TypeScript lib.dom types.
				this.interactionContainer.removeEventListener('pointermove', this.#onMove)

				if (deltaX === 0 && deltaY === 0) return

				// slow the rotation down based on former drag speed
				this.rotationXTarget.rotation = (x, y, z) => {
					deltaX = deltaX * 0.95

					// stop rotation once the delta is small enough that we
					// no longer notice the rotation.
					if (Math.abs(deltaX) < 0.01) return false

					return [clamp(x + deltaX, this.minFlingRotationX, this.maxFlingRotationX), y, z]
				}

				this.rotationYTarget.rotation = (x, y, z) => {
					deltaY = deltaY * 0.95

					// stop rotation once the delta is small enough that we
					// no longer notice the rotation.
					if (Math.abs(deltaY) < 0.01) return false

					return [x, y + deltaY, z]
				}
			}),
			{once: true},
		)
	}

	#onDragStart = (event: DragEvent) => event.preventDefault()

	#isStarted = false

	start(): this {
		if (this.#isStarted) return this
		this.#isStarted = true

		this.interactionInitiator.addEventListener('pointerdown', this.#onPointerDown)

		// Hack needed for Chrome (works fine in Firefox) otherwise
		// pointercancel breaks the drag handling. See
		// https://crbug.com/1166044
		// @ts-ignore, whyyyy TypeScript TODO fix TypeScript lib.dom types.
		this.interactionInitiator.addEventListener('dragstart', this.#onDragStart)
		this.interactionInitiator.addEventListener('pointercancel', () => {
			throw new Error('Pointercancel should not be happening. If so, please open a bug report.')
		})

		return this
	}

	stop(): this {
		if (!this.#isStarted) return this
		this.#isStarted = false

		this.interactionInitiator.removeEventListener('pointerdown', this.#onPointerDown)
		// @ts-ignore, whyyyy TypeScript TODO fix TypeScript lib.dom types.
		this.interactionInitiator.addEventListener('dragstart', this.#onDragStart)
		// @ts-ignore, whyyyy TypeScript TODO fix TypeScript lib.dom types.
		if (this.#onMove) this.interactionContainer.removeEventListener('pointermove', this.#onMove)
		// @ts-ignore, whyyyy TypeScript TODO fix TypeScript lib.dom types.
		if (this.#onPointerUp) this.interactionContainer.addEventListener('pointerup', this.#onPointerUp)

		return this
	}
}
