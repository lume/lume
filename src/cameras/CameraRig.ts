import {element, numberAttribute, untrack, autorun, booleanAttribute, StopFunction} from '@lume/element'
import {html} from '@lume/element/dist/html.js'
import {autoDefineElements} from '../LumeConfig.js'
import {Node, NodeAttributes} from '../core/Node.js'
import {FlingRotation, ScrollFling} from '../interaction/index.js'

import type {PerspectiveCamera} from './PerspectiveCamera.js'

export type CameraRigAttributes =
	| NodeAttributes
	| 'initialPolarAngle'
	| 'minPolarAngle'
	| 'maxPolarAngle'
	| 'initialDistance'
	| 'minDistance'
	| 'maxDistance'
	| 'active'
	| 'dollySpeed'
	| 'interactive'

// TODO allow overriding the camera props, or when ShadowDOM is complete make the default camera overridable via <slot>

@element('lume-camera-rig', autoDefineElements)
export class CameraRig extends Node {
	override readonly hasShadow: boolean = true

	@numberAttribute(0) initialPolarAngle = 0
	@numberAttribute(-90) minPolarAngle = -90
	@numberAttribute(90) maxPolarAngle = 90
	@numberAttribute(1000) initialDistance = 1000
	@numberAttribute(200) minDistance = 200
	@numberAttribute(2000) maxDistance = 2000
	@booleanAttribute(true) active = true
	@numberAttribute(1) dollySpeed = 1

	/**
	 * @property {boolean} interactive - When false, the user can zoom or
	 * rotate the camera, useful for static positioning of the camera
	 * programmatically.
	 */
	@booleanAttribute(true) interactive = true

	cam?: PerspectiveCamera

	rotationYTarget?: Node

	template = () => html`
		<lume-node
			size="1 1 1"
			ref=${(el: Node) => (this.rotationYTarget = el)}
			size-mode="proportional proportional proportional"
		>
			<lume-node
				size="1 1 1"
				rotation=${() => untrack(() => [this.initialPolarAngle, 0, 0])}
				size-mode="proportional proportional proportional"
			>
				<lume-perspective-camera
					ref=${(cam: PerspectiveCamera) => (this.cam = cam)}
					active=${() => this.active}
					position=${[0, 0, this.initialDistance]}
					align-point="0.5 0.5 0.5"
					far="10000"
				>
					<slot name="camera-child"></slot>
				</lume-perspective-camera>
			</lume-node>
		</lume-node>

		<slot></slot>
	`

	flingRotation?: FlingRotation
	scrollFling?: ScrollFling
	autorunStoppers?: StopFunction[]

	#startedInteraction = false

	startInteraction() {
		if (this.#startedInteraction) return
		this.#startedInteraction = true

		// Uses initial attribute values only, changes not tracked at the moment.
		this.flingRotation = new FlingRotation({
			interactionInitiator: this.scene!,
			rotationYTarget: this.rotationYTarget!,
			minFlingRotationX: this.minPolarAngle,
			maxFlingRotationX: this.maxPolarAngle,
		}).start()

		this.scrollFling = new ScrollFling({
			target: this.scene!,
			y: this.initialDistance,
			minY: this.minDistance,
			maxY: this.maxDistance,
			scrollFactor: this.dollySpeed,
		}).start()

		this.autorunStoppers = []

		this.autorunStoppers.push(
			autorun(() => {
				this.scrollFling!.y

				untrack(() => (this.cam!.position.z = this.scrollFling!.y))
			}),
			autorun(() => {
				if (this.interactive) {
					this.flingRotation!.start()
					this.scrollFling!.start()
				} else {
					this.flingRotation!.stop()
					this.scrollFling!.stop()
				}
			}),
		)
	}

	stopInteraction() {
		if (!this.#startedInteraction) return

		this.flingRotation?.stop()
		this.scrollFling?.stop()
		if (this.autorunStoppers) for (const stop of this.autorunStoppers) stop()
	}

	_loadGL(): boolean {
		if (!super._loadGL()) return false
		this.startInteraction()
		return true
	}

	_loadCSS(): boolean {
		if (!super._loadCSS()) return false
		this.startInteraction()
		return true
	}

	disconnectedCallback() {
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
