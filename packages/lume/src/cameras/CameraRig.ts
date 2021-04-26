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

// TODO allow overriding the camera props, or when ShadowDOM is complete make the default camera overridable via <slot>

@element('lume-camera-rig', autoDefineElements)
export class CameraRig extends Node {
	@numberAttribute(0) initialPolarAngle = 0
	@numberAttribute(-90) minPolarAngle = -90
	@numberAttribute(90) maxPolarAngle = 90
	@numberAttribute(1000) initialDistance = 1000
	@numberAttribute(200) minDistance = 200
	@numberAttribute(2000) maxDistance = 2000
	@booleanAttribute(true) active = true
	@numberAttribute(1) dollySpeed = 1

	cam?: PerspectiveCamera

	template = () => html`
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
			></lume-perspective-camera>
		</lume-node>
	`

	flingRotation?: FlingRotation
	scrollFling?: ScrollFling
	stopAutorun?: StopFunction

	connectedCallback() {
		super.connectedCallback()

		// Uses initial attribute values only, changes not tracked at the moment.
		this.flingRotation = new FlingRotation({
			interactionInitiator: this.scene,
			rotationYTarget: this,
			minFlingRotationX: this.minPolarAngle,
			maxFlingRotationX: this.maxPolarAngle,
		})

		this.scrollFling = new ScrollFling({
			target: this.scene,
			y: this.initialDistance,
			minY: this.minDistance,
			maxY: this.maxDistance,
			scrollFactor: this.dollySpeed,
		}).start()

		this.stopAutorun = autorun(() => {
			this.scrollFling!.y

			untrack(() => (this.cam!.getPosition().z = this.scrollFling!.y))
		})
	}

	disconnectedCallback() {
		super.disconnectedCallback()

		this.flingRotation?.stop()
		this.scrollFling?.stop()
		this.stopAutorun?.()
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
