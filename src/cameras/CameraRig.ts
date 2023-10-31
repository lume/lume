// TODO the interaction in here can be separated into a DragFling class, then
// this class can apply DragFling to X and Y rotations. We can use DragFling for
// implementing a scrollable area.

import {batch, createEffect, onCleanup, untrack} from 'solid-js'
import html from 'solid-js/html'
import {element, numberAttribute, autorun, booleanAttribute, StopFunction, reactive} from '@lume/element'
import {autoDefineElements} from '../LumeConfig.js'
import {Element3D, Element3DAttributes} from '../core/Element3D.js'
import {FlingRotation, ScrollFling, PinchFling} from '../interaction/index.js'

import type {PerspectiveCamera} from './PerspectiveCamera.js'

export type CameraRigAttributes =
	| Element3DAttributes
	| 'initialPolarAngle' // deprecated
	| 'verticalAngle'
	| 'minPolarAngle' // deprecated
	| 'minVerticalAngle'
	| 'maxPolarAngle' // deprecated
	| 'maxVerticalAngle'
	| 'initialDistance' // deprecated
	| 'distance'
	| 'minDistance'
	| 'maxDistance'
	| 'active'
	| 'dollySpeed'
	| 'interactive'

// TODO allow overriding the camera props, and make the default camera overridable via <slot>

/**
 * @class CameraRig
 *
 * Element: `<lume-camera-rig>`
 *
 * The [`<lume-camera-rig>`](./CameraRig) element is much like a real-life
 * camera rig that contains a camera on it: it has controls to allow the user to
 * rotate and dolly the camera around in physical space more easily, in a
 * particular and specific. In the following example, try draging to rotate,
 * scrolling to zoom:
 *
 * <div id="cameraRigExample"></div>
 *
 * ## Slots
 *
 * - default (no name): Allows children of the camera rig to render as children
 * of the camera rig, like with elements that don't have a ShadowDOM.
 * - `camera-child`: Allows children of the camera rig to render relative to the
 * camera rig's underlying camera.
 */
@element('lume-camera-rig', autoDefineElements)
export class CameraRig extends Element3D {
	/**
	 * @property {true} hasShadow
	 *
	 * *override* *readonly*
	 *
	 * This is `true` because this element has a `ShadowRoot` with the mentioned
	 * [`slots`](#slots).
	 */
	override readonly hasShadow: true = true

	/**
	 * @property {number} verticalAngle
	 *
	 * *attribute*
	 *
	 * Default: `0`
	 *
	 * The vertical angle of the camera (rotation around a horizontal axis). When the user drags up or
	 * down, the camera will move up and down as it rotates around the center.
	 * The camera is always looking at the center.
	 */
	@numberAttribute(0) verticalAngle = 0

	/**
	 * @deprecated initialPolarAngle has been renamed to verticalAngle.
	 * @property {number} initialPolarAngle
	 *
	 * *deprecated*: initialPolarAngle has been renamed to verticalAngle.
	 */
	@numberAttribute(0) initialPolarAngle = 0

	/**
	 * @property {number} minVerticalAngle
	 *
	 * *attribute*
	 *
	 * Default: `-90`
	 *
	 * The lowest angle that the camera will rotate vertically.
	 */
	@numberAttribute(-90) minVerticalAngle = -90

	/**
	 * @deprecated minPolarAngle has been renamed to minVerticalAngle.
	 * @property {number} minPolarAngle
	 *
	 * *deprecated*: minPolarAngle has been renamed to minVerticalAngle.
	 */
	@numberAttribute(-90) minPolarAngle = -90

	/**
	 * @property {number} maxVerticalAngle
	 *
	 * *attribute*
	 *
	 * Default: `90`
	 *
	 * The highest angle that the camera will rotate vertically.
	 *
	 * <div id="verticalRotationExample"></div>
	 *
	 * <script>
	 *   new Vue({
	 *     el: '#cameraRigExample',
	 *     template: '<live-code :template="code" mode="html>iframe" :debounce="200" />',
	 *     data: { code: cameraRigExample },
	 *   })
	 *   new Vue({
	 *     el: '#verticalRotationExample',
	 *     template: '<live-code :template="code" mode="html>iframe" :debounce="200" />',
	 *     data: { code: cameraRigVerticalRotationExample },
	 *   })
	 * </script>
	 */
	@numberAttribute(90) maxVerticalAngle = 90

	/**
	 * @deprecated maxPolarAngle has been renamed to maxVerticalAngle.
	 * @property {number} maxPolarAngle
	 *
	 * *deprecated*: maxPolarAngle has been renamed to maxVerticalAngle.
	 */
	@numberAttribute(90) maxPolarAngle = 90

	/**
	 * @property {number} horizontalAngle
	 *
	 * *attribute*
	 *
	 * Default: `0`
	 *
	 * The horizontal angle of the camera (rotation around a vertical axis). When the user drags left or
	 * right, the camera will move left or right as it rotates around the center.
	 * The camera is always looking at the center.
	 */
	@numberAttribute(0) horizontalAngle = 0

	/**
	 * @property {number} minHorizontalAngle
	 *
	 * *attribute*
	 *
	 * Default: `-Infinity`
	 *
	 * The smallest angle that the camera will be allowed to rotate to
	 * horizontally. The default of `-Infinity` means the camera will rotate
	 * laterally around the focus point indefinitely.
	 */
	@numberAttribute(-Infinity) minHorizontalAngle = -Infinity

	/**
	 * @property {number} maxHorizontalAngle
	 *
	 * *attribute*
	 *
	 * Default: `Infinity`
	 *
	 * The largest angle that the camera will be allowed to rotate to
	 * horizontally. The default of `Infinity` means the camera will rotate
	 * laterally around the focus point indefinitely.
	 */
	@numberAttribute(Infinity) maxHorizontalAngle = Infinity

	/**
	 * @property {number} distance
	 *
	 * *attribute*
	 *
	 * Default: `1000`
	 *
	 * The distance that the camera will be away from the center point.
	 * When the performing a scroll gesture, the camera will zoom by moving
	 * towards or away from the center point (i.e. dollying).
	 */
	@numberAttribute(1000) distance = 1000

	/**
	 * @deprecated initialDistance has been renamed to distance.
	 * @property {number} initialDistance
	 *
	 * *deprecated*: initialDistance has been renamed to distance.
	 */
	@numberAttribute(1000) initialDistance = 1000

	/**
	 * @property {number} minDistance
	 *
	 * *attribute*
	 *
	 * Default: `200`
	 *
	 * The smallest distance the camera can get to the center point when zooming
	 * by scrolling.
	 */
	@numberAttribute(200) minDistance = 200

	/**
	 * @property {number} maxDistance
	 *
	 * *attribute*
	 *
	 * Default: `2000`
	 *
	 * The largest distance the camera can get from the center point when
	 * zooming by scrolling.
	 */
	@numberAttribute(2000) maxDistance = 2000

	/**
	 * @property {boolean} active
	 *
	 * *attribute*
	 *
	 * Default: `true`
	 *
	 * When `true`, the underlying camera is set to [`active`](./PerspectiveCamera#active).
	 */
	@booleanAttribute(true) active = true

	/**
	 * @property {number} dollySpeed
	 *
	 * *attribute*
	 *
	 * Default: `1`
	 */
	@numberAttribute(1) dollySpeed = 1

	/**
	 * @property {boolean} interactive
	 *
	 * *attribute*
	 *
	 * When `false`, user interaction (ability to zoom or rotate the camera) is
	 * disabled, but the camera rig can still be manipulated programmatically.
	 */
	@booleanAttribute(true) interactive = true

	@reactive cam?: PerspectiveCamera

	@reactive rotationYTarget?: Element3D

	override template = () => html`
		<lume-element3d
			id="cameraY"
			ref=${(el: Element3D) => (this.rotationYTarget = el)}
			size="1 1 1"
			size-mode="proportional proportional proportional"
			rotation=${() => untrack(() => [0, this.horizontalAngle, 0])}
		>
			<lume-element3d
				id="cameraX"
				size="1 1 1"
				rotation=${() => untrack(() => [this.verticalAngle, 0, 0])}
				size-mode="proportional proportional proportional"
			>
				<slot
					name="camera"
					TODO="determine semantics for overriding the internal camera (this slot is not documented yet)"
				>
					<lume-perspective-camera
						ref=${(cam: PerspectiveCamera) => (this.cam = cam)}
						active=${() => this.active}
						position=${[0, 0, this.distance]}
						align-point="0.5 0.5 0.5"
						far="10000"
					>
						<slot name="camera-child"></slot>
					</lume-perspective-camera>
				</slot>
			</lume-element3d>
		</lume-element3d>

		<slot></slot>
	`

	@reactive flingRotation: FlingRotation | null = null
	@reactive scrollFling: ScrollFling | null = null
	@reactive pinchFling: PinchFling | null = null

	autorunStoppers?: StopFunction[]

	#startedInteraction = false

	startInteraction() {
		if (this.#startedInteraction) return
		this.#startedInteraction = true

		this.autorunStoppers = []

		this.autorunStoppers.push(
			autorun(() => {
				batch(() => {
					this.verticalAngle = this.initialPolarAngle
					this.minVerticalAngle = this.minPolarAngle
					this.maxVerticalAngle = this.maxPolarAngle
					this.distance = this.initialDistance
				})
			}),
			autorun(() => {
				if (!(this.scene && this.rotationYTarget)) return

				const flingRotation = (this.flingRotation = new FlingRotation({
					interactionInitiator: this.scene,
					rotationYTarget: this.rotationYTarget,
					minFlingRotationX: this.minVerticalAngle,
					maxFlingRotationX: this.maxVerticalAngle,
					minFlingRotationY: this.minHorizontalAngle,
					maxFlingRotationY: this.maxHorizontalAngle,
				}).start())

				createEffect(() => {
					if (this.interactive && !this.pinchFling?.interacting) flingRotation.start()
					else flingRotation.stop()
				})

				onCleanup(() => flingRotation?.stop())
			}),
			autorun(() => {
				if (!this.scene) return

				const scrollFling = (this.scrollFling = new ScrollFling({
					target: this.scene,
					y: this.distance,
					minY: this.minDistance,
					maxY: this.maxDistance,
					scrollFactor: this.dollySpeed,
				}).start())

				const pinchFling = (this.pinchFling = new PinchFling({
					target: this.scene,
					x: this.distance,
					minX: this.minDistance,
					maxX: this.maxDistance,
					factor: this.dollySpeed,
				}).start())

				createEffect(() => {
					const cam = this.cam
					if (!cam) return

					untrack(() => cam.position).z = scrollFling.y
				})

				createEffect(() => {
					const cam = this.cam
					if (!cam) return

					untrack(() => cam.position).z = pinchFling.x
				})

				createEffect(() => {
					if (this.interactive) {
						scrollFling.start()
						pinchFling.start()
					} else {
						scrollFling.stop()
						pinchFling.stop()
					}
				})

				onCleanup(() => {
					scrollFling.stop()
					pinchFling.stop()
				})
			}),
		)
	}

	stopInteraction() {
		if (!this.#startedInteraction) return
		this.#startedInteraction = false

		if (this.autorunStoppers) for (const stop of this.autorunStoppers) stop()
	}

	override _loadGL(): boolean {
		if (!super._loadGL()) return false
		this.startInteraction()
		return true
	}

	override _loadCSS(): boolean {
		if (!super._loadCSS()) return false
		this.startInteraction()
		return true
	}

	override _unloadGL(): boolean {
		if (!super._unloadGL()) return false
		if (!this.glLoaded && !this.cssLoaded) this.stopInteraction()
		return true
	}

	override _unloadCSS(): boolean {
		if (!super._unloadCSS()) return false
		if (!this.glLoaded && !this.cssLoaded) this.stopInteraction()
		return true
	}

	override disconnectedCallback() {
		super.disconnectedCallback()
		this.stopInteraction()
	}
}

import type {ElementAttributes} from '@lume/element'

declare module '@lume/element' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-camera-rig': ElementAttributes<CameraRig, CameraRigAttributes>
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'lume-camera-rig': CameraRig
	}
}
