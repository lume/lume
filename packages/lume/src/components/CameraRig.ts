import {element, numberAttribute, untrack, autorun} from '@lume/element'
import {html} from '@lume/element/dist/html.js'
import {autoDefineElements} from '../LumeConfig.js'
import {Node} from '../core/Node.js'
import {flingRotation, ScrollFling} from '../interaction/index.js'

import type {PerspectiveCamera, NodeAttributes} from '../core/index.js'

export type CameraRigAttributes =
	| NodeAttributes
	| 'initialPolarAngle'
	| 'minPolarAngle'
	| 'maxPolarAngle'
	| 'initialDistance'
	| 'minDistance'
	| 'maxDistance'

@element('lume-camera-rig', autoDefineElements)
export class CameraRig extends Node {
	@numberAttribute(0) initialPolarAngle = 0
	@numberAttribute(-90) minPolarAngle = -90
	@numberAttribute(90) maxPolarAngle = 90
	@numberAttribute(1000) initialDistance = 1000
	@numberAttribute(200) minDistance = 200
	@numberAttribute(2000) maxDistance = 2000

	cam?: PerspectiveCamera

	template = () => html`
		<lume-node
			size="1 1 1"
			rotation=${() => untrack(() => [this.initialPolarAngle, 0, 0])}
			size-mode="proportional proportional proportional"
		>
			<lume-perspective-camera
				ref=${(cam: PerspectiveCamera) => (this.cam = cam)}
				active
				position=${() => untrack(() => [0, 0, this.initialDistance])}
				align-point="0.5 0.5 0.5"
				far="10000"
			></lume-perspective-camera>
		</lume-node>
	`

	scrollFling?: ScrollFling

	connectedCallback() {
		super.connectedCallback()

		// Uses initial attribute values only, changes not tracked at the moment.
		flingRotation({
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
		}).start()

		autorun(() => {
			this.scrollFling!.y

			untrack(() => {
				this.cam!.getPosition().z = this.scrollFling!.y
			})
		})
	}

	disconnectedCallback() {
		super.disconnectedCallback()
		this.scrollFling?.stop()
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
