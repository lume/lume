import {PerspectiveCamera as ThreePerspectiveCamera} from 'three/src/cameras/PerspectiveCamera.js'
import {numberAttribute, booleanAttribute, autorun, untrack, element} from '@lume/element'
import Node, {NodeAttributes} from './Node.js'
import {defer} from './Utility.js'

import type {Scene} from './Scene.js'

export type PerspectiveCameraAttributes = NodeAttributes | 'fov' | 'aspect' | 'near' | 'far' | 'zoom' | 'active'
// | 'lookAt' // TODO

@element
export default class PerspectiveCamera extends Node {
	static defaultElementName = 'lume-perspective-camera'

	@numberAttribute(50) fov = 50
	/** A value of 0 sets the aspect ratio to automatic, based on the scene dimensions. */
	@numberAttribute(0) aspect = 0
	@numberAttribute(0.1) near = 0.1
	@numberAttribute(3000) far = 3000
	@numberAttribute(1) zoom = 1
	@booleanAttribute(false) active = false

	// TODO lookat property
	// @attribute lookat: string | Node | null = null

	// declare three: ThreePerspectiveCamera

	connectedCallback() {
		super.connectedCallback()

		// We use an autorun to wait for the this.scene to exist.
		const stop = autorun(_ => {
			if (this.scene) {
				untrack(() => {
					this.__lastKnownScene = this.scene
					this.__setSceneCamera(this.active ? undefined : 'unset')
					defer(() => stop())
				})
			}
		})

		// TODO once(condition) to make the above simpler, F.e.:
		// once(() => this.scene).then(() => {
		// 	this.__lastKnownScene = this.scene
		// 	this.__setSceneCamera(this.active ? undefined : 'unset')
		// })

		this._stopFns.push(
			autorun(_ => {
				this.three.fov = this.fov
				this.three.updateProjectionMatrix()
				this.needsUpdate()
			}),
			autorun(_ => {
				// Any value other than zero means the user supplied an aspect
				// ratio manually. Stop auto-aspect in that case.
				if (this.aspect !== 0) {
					this.three.aspect = this.aspect
					this.three.updateProjectionMatrix()
					return
				}

				let aspect = 0

				if (this.scene) aspect = this.scene.calculatedSize.x / this.scene.calculatedSize.y

				// in case of a 0 or NaN (f.e. 0 / 0 == NaN)
				if (!aspect) aspect = 16 / 9

				this.three.aspect = aspect
				this.three.updateProjectionMatrix()
				this.needsUpdate()
			}),
			autorun(_ => {
				this.three.near = this.near
				this.three.updateProjectionMatrix()
				this.needsUpdate()
			}),
			autorun(_ => {
				this.three.far = this.far
				this.three.updateProjectionMatrix()
				this.needsUpdate()
			}),
			autorun(_ => {
				this.three.zoom = this.zoom
				this.three.updateProjectionMatrix()
				this.needsUpdate()
			}),
			autorun(_ => {
				const active = this.active
				untrack(() => {
					this.__setSceneCamera(active ? undefined : 'unset')
				})
				this.needsUpdate() // TODO need this? Cameras don't render as anything, maybe they don't need an update in this case.
			}),
		)
	}

	makeThreeObject3d() {
		return new ThreePerspectiveCamera(75, 16 / 9, 1, 1000)
	}

	// TODO make sure this works. Camera should switch to scene's default on
	// removal of last camera, etc.
	disconnectedCallback() {
		super.disconnectedCallback()

		// TODO we want to call this in the upcoming
		// unmountedCallback, but for now it's harmless but
		// will run unnecessary logic. #150
		this.__setSceneCamera('unset')
		this.__lastKnownScene = null
	}

	private __lastKnownScene: Scene | null = null

	private __setSceneCamera(unset?: 'unset') {
		if (unset) {
			// TODO: unset might be triggered before the scene was mounted, so
			// there might not be a last known scene. We won't need this check
			// when we add unmountedCallback. #150
			if (this.__lastKnownScene) this.__lastKnownScene._removeCamera(this)
		} else {
			if (!this.scene || !this.isConnected) return

			this.scene._addCamera(this)
		}
	}
}

export {PerspectiveCamera}

import type {ElementAttributes} from '@lume/element'

declare module '@lume/element' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-perspective-camera': ElementAttributes<PerspectiveCamera, PerspectiveCameraAttributes>
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'lume-perspective-camera': PerspectiveCamera
	}
}
