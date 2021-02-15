import {clamp} from '../math'

import type {Node} from '../core/Node'
import {rotation} from '../core'

interface FlingRotationOptions {
	// The object that will be rotated on Y.
	rotationYTarget: Node
	// The object that will be rotated on X. Defaults to the element inside the rotationYTarget (it's like a gimball).
	rotationXTarget?: Node
	// The element on which the pointer should be placed down on in
	// order to initiate drag tracking. This defaults to rotationXTarget.
	interactionInitiator?: Document | ShadowRoot | Element
	// The X rotation can not go below this value. Defaults to -90
	// which means facing straight up.
	minFlingRotationX?: number
	// The X rotation can not go above this value. Defaults to 90 which
	// means facing straight down.
	maxFlingRotationX?: number
	// The area in which drag tacking will happen. Defaults to document
	// because usually you want to track in the whole viewport, otherwise
	// if the pointer comes up outside of this area it will leave things
	// in a bad state.
	interactionContainer?: Document | ShadowRoot | Element
}

export function flingRotation({
	rotationYTarget,
	rotationXTarget = rotationYTarget.children[0] as Node,
	interactionInitiator = rotationXTarget,
	minFlingRotationX = -90,
	maxFlingRotationX = 90,
	interactionContainer = document,
}: FlingRotationOptions) {
	interactionInitiator.addEventListener('pointerdown', () => {
		// Stop rotation if any.
		rotationYTarget.rotation = rotation(() => false)

		let deltaX = 0
		let deltaY = 0

		const onMove = (event: PointerEvent) => {
			deltaX = event.movementY * 0.2
			rotationXTarget.rotation.x = clamp(
				rotationXTarget.rotation.x + deltaX,
				minFlingRotationX,
				maxFlingRotationX,
			)
			deltaY = -event.movementX * 0.2
			rotationYTarget.rotation.y += deltaY
		}

		// @ts-ignore, whyyyy TypeScript
		interactionContainer.addEventListener('pointermove', onMove)

		interactionContainer.addEventListener(
			'pointerup',
			() => {
				// stop dragging
				// @ts-ignore, whyyyy TypeScript
				interactionContainer.removeEventListener('pointermove', onMove)

				if (deltaX === 0 && deltaY === 0) return

				// slow the rotation down based on former drag speed
				rotationXTarget.rotation = rotation((x, y, z) => {
					deltaX = deltaX * 0.95

					// stop rotation once the delta is small enough that we
					// no longer notice the rotation.
					if (Math.abs(deltaX) < 0.01) return false

					return [clamp(x + deltaX, minFlingRotationX, maxFlingRotationX), y, z]
				})

				rotationYTarget.rotation = rotation((x, y, z) => {
					deltaY = deltaY * 0.95

					// stop rotation once the delta is small enough that we
					// no longer notice the rotation.
					if (Math.abs(deltaY) < 0.01) return false

					return [x, y + deltaY, z]
				})
			},
			{once: true},
		)
	})
}
