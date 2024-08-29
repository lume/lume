import {Effects, reactive, signal} from 'classy-solid'
import {createEffect, onCleanup} from 'solid-js'
import type {Element3D} from '../core/Element3D.js'
import {Settable} from '../utils/Settable.js'
import {DragFling} from './DragFling.js'

/**
 * Rotates the `rotationXTarget` element on X, and the `rotationYTarget` element
 * on Y, to make interactive rotation of an object.
 */
export
@reactive
class FlingRotation extends Settable(Effects) {
	/** The object that will be rotated on Y. Required. */
	@signal rotationYTarget!: Element3D

	/**
	 * The object that will be rotated on X. Defaults to the element inside the
	 * rotationYTarget (it's like a gimball).
	 */
	@signal rotationXTarget!: Element3D

	/**
	 * The element that will used for drag handling, defaults to
	 * rotationXTarget. You could set it to a <lume-scene>, for example, to make
	 * the rotation interaction start anywhere in a scene, not specifically on
	 * the object to be rotated.
	 */
	@signal target!: Element

	/**
	 * The X rotation can not go below this value. Defaults to -90 which means
	 * facing straight up.
	 */
	@signal minRotationX: number = -90

	/**
	 * The X rotation can not go above this value. Defaults to 90 which means
	 * facing straight down.
	 */
	@signal maxRotationX: number = 90

	/**
	 * The Y rotation can not go below this value. Defaults to -Infinity which
	 * means the camera can keep rotating laterally around the focus point
	 * indefinitely.
	 */
	@signal minRotationY: number = -Infinity

	/**
	 * The Y rotation can not go below this value. Defaults to Infinity which
	 * means the camera can keep rotating laterally around the focus point
	 * indefinitely.
	 */
	@signal maxRotationY: number = Infinity

	@signal sensitivity = 1

	@signal epsilon = 0.01

	/**
	 * Portion of the change in rotation that is removed each frame to
	 * cause slowdown. Between 0 and 1.
	 */
	@signal slowdownAmount = 0.05

	/**
	 * The allowed pointer types to use for dragging ('mouse', 'pen', or
	 * 'touch'). Default is all of them.
	 */
	@signal pointerTypes: ('mouse' | 'pen' | 'touch')[] = ['mouse', 'pen', 'touch']

	#isStarted = false

	start(): this {
		if (this.#isStarted) return this
		this.#isStarted = true

		this.createEffect(() => {
			// We need all these things for interaction to continue.
			if (!(this.rotationYTarget && this.rotationXTarget && this.target)) return

			const dragFling = new DragFling().set({target: this.target, pointerTypes: this.pointerTypes})

			dragFling.start()
			onCleanup(() => dragFling.stop())

			createEffect(() => {
				dragFling.set({
					minX: this.minRotationY,
					maxX: this.maxRotationY,
					minY: this.minRotationX,
					maxY: this.maxRotationX,
					sensitivity: this.sensitivity,
					epsilon: this.epsilon,
					slowdownAmount: this.slowdownAmount,
				})
			})

			createEffect(() => {
				this.rotationXTarget.rotation.x = dragFling.y
				this.rotationYTarget.rotation.y = -dragFling.x
			})
		})

		return this
	}

	stop(): this {
		if (!this.#isStarted) return this
		this.#isStarted = false

		this.stopEffects()

		return this
	}
}
