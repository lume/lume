// TODO the interaction in here can be separated into a DragFling class, then
// this class can apply DragFling to X and Y rotations. We can use DragFling for
// implementing a scrollable area.

import {onCleanup} from 'solid-js'
import html from 'solid-js/html'
import {signal, syncSignals} from 'classy-solid'
import {element, numberAttribute, booleanAttribute, type ElementAttributes} from '@lume/element'
import {autoDefineElements} from '../LumeConfig.js'
import {Element3D, type Element3DAttributes} from '../core/Element3D.js'
import {FlingRotation, ScrollFling, PinchFling} from '../interaction/index.js'
import {defaultScenePerspective} from '../constants.js'
import type {PerspectiveCamera} from './PerspectiveCamera.js'

export type CameraRigAttributes =
	| Element3DAttributes
	| 'verticalAngle'
	| 'minVerticalAngle'
	| 'maxVerticalAngle'
	| 'horizontalAngle'
	| 'minHorizontalAngle'
	| 'maxHorizontalAngle'
	| 'distance'
	| 'minDistance'
	| 'maxDistance'
	| 'active'
	| 'dollySpeed'
	| 'interactive'
	| 'dollyEpsilon'
	| 'dollyScrollLerp'
	| 'dollyPinchSlowdown'
	| 'rotationEpsilon'
	| 'rotationSlowdown'
	| 'initialPolarAngle' // deprecated
	| 'minPolarAngle' // deprecated
	| 'maxPolarAngle' // deprecated
	| 'initialDistance' // deprecated

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
 * <live-code id="example"></live-code>
 *
 * ## Slots
 *
 * - default (no name): Allows children of the camera rig to render as children
 * of the camera rig, like with elements that don't have a ShadowDOM.
 * - `camera-child`: Allows children of the camera rig to render relative to the
 * camera rig's underlying camera.
 */
export
@element('lume-camera-rig', autoDefineElements)
class CameraRig extends Element3D {
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
	@numberAttribute verticalAngle = 0

	/**
	 * @deprecated initialPolarAngle has been renamed to verticalAngle.
	 * @property {number} initialPolarAngle
	 *
	 * *deprecated*: initialPolarAngle has been renamed to verticalAngle.
	 */
	@numberAttribute
	get initialPolarAngle() {
		return this.verticalAngle
	}
	set initialPolarAngle(value) {
		this.verticalAngle = value
	}

	/**
	 * @property {number} minVerticalAngle
	 *
	 * *attribute*
	 *
	 * Default: `-90`
	 *
	 * The lowest angle that the camera will rotate vertically.
	 */
	@numberAttribute minVerticalAngle = -90

	/**
	 * @deprecated minPolarAngle has been renamed to minVerticalAngle.
	 * @property {number} minPolarAngle
	 *
	 * *deprecated*: minPolarAngle has been renamed to minVerticalAngle.
	 */
	@numberAttribute
	get minPolarAngle() {
		return this.minVerticalAngle
	}
	set minPolarAngle(value) {
		this.minVerticalAngle = value
	}

	/**
	 * @property {number} maxVerticalAngle
	 *
	 * *attribute*
	 *
	 * Default: `90`
	 *
	 * The highest angle that the camera will rotate vertically.
	 *
	 * <live-code id="verticalExample"></live-code>
	 *
	 * <script>
	 *   example.content = cameraRigExample
	 *   verticalExample.content = cameraRigVerticalRotationExample
	 * </script>
	 */
	@numberAttribute maxVerticalAngle = 90

	/**
	 * @deprecated maxPolarAngle has been renamed to maxVerticalAngle.
	 * @property {number} maxPolarAngle
	 *
	 * *deprecated*: maxPolarAngle has been renamed to maxVerticalAngle.
	 */
	@numberAttribute
	get maxPolarAngle() {
		return this.maxVerticalAngle
	}
	set maxPolarAngle(value) {
		this.maxVerticalAngle = value
	}

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
	@numberAttribute horizontalAngle = 0

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
	@numberAttribute minHorizontalAngle = -Infinity

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
	@numberAttribute maxHorizontalAngle = Infinity

	/**
	 * @property {number} distance
	 *
	 * *attribute*
	 *
	 * Default: `-1`
	 *
	 * The distance that the camera will be away from the center point.
	 * When the performing a scroll gesture, the camera will zoom by moving
	 * towards or away from the center point (i.e. dollying).
	 *
	 * A value of `-1` means automatic distance based on the current scene's
	 * [`.perspective`](../core/Scene#perspective), matching the behavior of
	 * [CSS `perspective`](https://developer.mozilla.org/en-US/docs/Web/CSS/perspective).
	 */
	@numberAttribute distance = -1

	@signal __appliedDistance = defaultScenePerspective

	/**
	 * @deprecated initialDistance has been renamed to distance.
	 * @property {number} initialDistance
	 *
	 * *deprecated*: initialDistance has been renamed to distance.
	 */
	@numberAttribute
	get initialDistance() {
		return this.distance
	}
	set initialDistance(value) {
		this.distance = value
	}

	/**
	 * @property {number} minDistance
	 *
	 * *attribute*
	 *
	 * Default: `-1`
	 *
	 * The smallest distance (a non-zero value) the camera can get to the center point when zooming
	 * by scrolling.
	 *
	 * A value of `-1` means the value will automatically be half of whatever
	 * the [`.distance`](#distance) value is.
	 */
	@numberAttribute minDistance = -1

	@signal __appliedMinDistance = 200

	/**
	 * @property {number} maxDistance
	 *
	 * *attribute*
	 *
	 * Default: `-1`
	 *
	 * The largest distance (a non-zero value) the camera can get from the
	 * center point when zooming out by scrolling or with pinch gesture.
	 *
	 * A value of `-1` means the value will automatically be double of whatever
	 * the [`.distance`](#distance) value is.
	 */
	@numberAttribute maxDistance = -1

	@signal __appliedMaxDistance = 800

	/**
	 * @property {boolean} active
	 *
	 * *attribute*
	 *
	 * Default: `true`
	 *
	 * When `true`, the underlying camera is set to [`active`](./PerspectiveCamera#active).
	 */
	@booleanAttribute active = true

	/**
	 * @property {number} dollySpeed
	 *
	 * *attribute*
	 *
	 * Default: `1`
	 */
	@numberAttribute dollySpeed = 1

	/**
	 * @property {boolean} interactive
	 *
	 * *attribute*
	 *
	 * Default: `true`
	 *
	 * When `false`, user interaction (ability to zoom or rotate the camera) is
	 * disabled, but the camera rig can still be manipulated programmatically.
	 */
	@booleanAttribute interactive = true

	/**
	 * @property {number} dollyEpsilon
	 *
	 * *attribute*
	 *
	 * Default: `0.01`
	 *
	 * The threshold for when to stop dolly smoothing animation (lerp). When the
	 * delta between actual dolly position and target dolly position is below
	 * this number, animation stops. Set this to a high value to prevent
	 * smoothing.
	 */
	@numberAttribute dollyEpsilon = 0.01

	/**
	 * @property {number} dollyScrollLerp
	 *
	 * *attribute*
	 *
	 * Default: `0.3`
	 *
	 * The portion to lerp towards the dolly target position each frame after
	 * scrolling to dolly the camera. Between 0 and 1.
	 */
	@numberAttribute dollyScrollLerp = 0.3

	/**
	 * @property {number} dollyPinchSlowdown
	 *
	 * *attribute*
	 *
	 * Default: `0.05`
	 *
	 * Portion of the dolly speed to remove each frame to slow down the dolly
	 * animation after pinching to dolly the camera. Between 0 and 1.
	 */
	@numberAttribute dollyPinchSlowdown = 0.05

	/**
	 * @property {number} rotationEpsilon
	 *
	 * *attribute*
	 *
	 * Default: `0.01`
	 *
	 * The threshold for when to stop intertial rotation slowdown animation.
	 * When the current frame's change in rotation goes below this number,
	 * animation stops. Set this to a high value to prevent inertial slowdown.
	 */
	@numberAttribute rotationEpsilon = 0.01

	/**
	 * @property {number} rotationSlowdown
	 *
	 * *attribute*
	 *
	 * Default: `0.05`
	 *
	 * Portion of the rotational speed to remove each frame to slow down the
	 * rotation after dragging to rotate the camera. Between 0 and 1.
	 */
	@numberAttribute rotationSlowdown = 0.05

	@signal threeCamera?: PerspectiveCamera

	/** @deprecated Use `.threeCamera` instead. */
	get cam() {
		return this.threeCamera
	}

	@signal rotationYTarget?: Element3D
	@signal rotationXTarget?: Element3D

	flingRotation = new FlingRotation()
	scrollFling = new ScrollFling()
	pinchFling = new PinchFling()

	get #derivedInputDistance() {
		return this.distance !== -1 ? this.distance : this.scene?.perspective ?? defaultScenePerspective
	}

	override connectedCallback() {
		super.connectedCallback()

		this.createEffect(() => {
			// We start interaction if we have a scene (we're in the composed
			// tree) and have the needed DOM nodes.
			if (!(this.scene && this.rotationYTarget && this.rotationXTarget && this.threeCamera)) return

			// TODO replace with @memo once that's out in classy-solid
			this.createEffect(() => {
				this.__appliedDistance = this.#derivedInputDistance
				this.__appliedMinDistance = this.minDistance !== -1 ? this.minDistance : this.#derivedInputDistance / 2
				this.__appliedMaxDistance = this.maxDistance !== -1 ? this.maxDistance : this.#derivedInputDistance * 2
			})

			// We set position here instead of in the template, otherwise
			// pre-upgrade values from the template running before element
			// upgrade (due to how Solid templates using cloneNode making them
			// non-upgraded until connected) will override the initial
			// __appliedDistance value.
			this.createEffect(() => (this.threeCamera!.position.z = this.__appliedDistance))

			const {scrollFling, pinchFling, flingRotation} = this

			flingRotation.interactionInitiator = this.scene
			flingRotation.interactionContainer = this.scene
			flingRotation.rotationYTarget = this.rotationYTarget
			flingRotation.rotationXTarget = this.rotationXTarget
			scrollFling.target = this.scene
			pinchFling.target = this.scene

			// Sync __appliedDistance to scrollFling.y and vice versa
			syncSignals(
				() => this.__appliedDistance,
				(d: number) => (this.__appliedDistance = d),
				() => this.scrollFling!.y,
				(y: number) => (this.scrollFling!.y = y),
			)
			// Sync scrollFling.y to pinchFling.x and vice versa
			syncSignals(
				() => this.scrollFling.y,
				(y: number) => (this.scrollFling.y = y),
				() => this.pinchFling.x,
				(x: number) => (this.pinchFling.x = x),
			)

			this.createEffect(() => {
				flingRotation.minFlingRotationX = this.minVerticalAngle
				flingRotation.maxFlingRotationX = this.maxVerticalAngle
				flingRotation.minFlingRotationY = this.minHorizontalAngle
				flingRotation.maxFlingRotationY = this.maxHorizontalAngle
				flingRotation.epsilon = this.rotationEpsilon
				flingRotation.slowdownAmount = this.rotationSlowdown

				scrollFling.minY = pinchFling.minX = this.__appliedMinDistance
				scrollFling.maxY = pinchFling.maxX = this.__appliedMaxDistance
				scrollFling.sensitivity = pinchFling.sensitivity = this.dollySpeed
				scrollFling.epsilon = pinchFling.epsilon = this.dollyEpsilon
				scrollFling.lerpAmount = this.dollyScrollLerp
				pinchFling.slowdownAmount = this.dollyPinchSlowdown
			})

			this.createEffect(() => {
				if (this.interactive && !this.pinchFling?.interacting) flingRotation.start()
				else flingRotation.stop()
			})

			this.createEffect(() => {
				if (this.interactive) {
					scrollFling.start()
					pinchFling.start()
				} else {
					scrollFling.stop()
					pinchFling.stop()
				}
			})

			onCleanup(() => {
				this.flingRotation.stop()
				this.scrollFling.stop()
				this.pinchFling.stop()
			})
		})
	}

	override template = () => html`
		<lume-element3d
			id="cameraY"
			ref=${(el: Element3D) => (this.rotationYTarget = el)}
			size="1 1 1"
			size-mode="proportional proportional proportional"
			rotation=${() => [0, this.horizontalAngle, 0]}
		>
			<lume-element3d
				id="cameraX"
				ref=${(el: Element3D) => (this.rotationXTarget = el)}
				size="1 1 1"
				rotation=${() => [this.verticalAngle, 0, 0]}
				size-mode="proportional proportional proportional"
			>
				<slot
					name="camera"
					TODO="determine semantics for overriding the internal camera (this slot is not documented yet)"
				>
					<lume-perspective-camera
						ref=${(cam: PerspectiveCamera) => (this.threeCamera = cam)}
						id="camera-rig-perspective-camera"
						active=${() => this.active}
						comment="We don't set position here because it triggers the pre-upgrade handling due to the template running before perspective-camera is upgraded (due to Solid specifics) which causes the initial value to override the initial position calculated from scene.perspective."
						xposition=${() => [0, 0, this.__appliedDistance]}
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
}

declare module 'solid-js' {
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
