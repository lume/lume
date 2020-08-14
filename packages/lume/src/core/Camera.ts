import {PerspectiveCamera as ThreePerspectiveCamera} from 'three'
import {reactive, numberAttribute, booleanAttribute, autorun} from '@lume/element'
import Node from './Node'
import {Scene} from './Scene'

// TODO: update this to have a CSS3D-perspective-like API like with the Scene's
// default camera.
export default class PerspectiveCamera extends Node {
	static defaultElementName = 'i-perspective-camera'

	@reactive @numberAttribute(50) fov = 50
	/** A value of 0 sets the internal aspect ratio to automatic, based on the scene dimensions. */
	@reactive @numberAttribute(0) aspect = 0
	@reactive @numberAttribute(0.1) near = 0.1
	@reactive @numberAttribute(3000) far = 3000
	@reactive @numberAttribute(1) zoom = 1
	@reactive @booleanAttribute(false) active = false

	three!: ThreePerspectiveCamera

	connectedCallback() {
		super.connectedCallback()

		// XXX This doesn't work becauwe this.scene returns null because it uses
		// this.parent which returns null because this.parent's internal
		// this._parent property isn't set yet at this point...
		// this.__lastKnownScene = this.scene

		// ... So instead we use an autorun to wait for the this.scene to exist.
		// TODO once(condition) to make this simler, F.e.:
		// once(() => this.scene).then(() => { ... })
		const stop = autorun(_ => {
			if (this.scene) {
				this.__lastKnownScene = this.scene
				this.__setSceneCamera(this.active ? undefined : 'unset')
				Promise.resolve().then(stop)
			}
		})

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
				this.__setSceneCamera(this.active ? undefined : 'unset')
				this.needsUpdate() // XXX need this?
			}),
		)
	}

	// TODO, unmountedCallback functionality. issue #150
	unmountedCallback() {}

	protected _makeThreeObject3d() {
		return new ThreePerspectiveCamera(75, 16 / 9, 1, 1000)
	}

	// TODO replace with unmountedCallback #150
	protected _deinit() {
		super._deinit && super._deinit()

		// TODO we want to call this in the upcoming
		// unmountedCallback, but for now it's harmless but
		// will run unnecessary logic. #150
		this.__setSceneCamera('unset')
		this.__lastKnownScene = null
	}

	private __lastKnownScene: Scene | null = null

	private __setSceneCamera(unset?: 'unset') {
		debugger
		if (unset) {
			console.log('Camera: unset cam', this.__lastKnownScene)

			// TODO: unset might be triggered before the scene was mounted, so
			// there might not be a last known scene. We won't need this check
			// when we add unmountedCallback. #150
			if (this.__lastKnownScene)
				this.__lastKnownScene
					// @ts-ignore: call protected method
					._removeCamera(this)
		} else {
			if (!this.scene || !this.isConnected) return
			console.log('Camera: set cam')

			this.scene
				// @ts-ignore: call protected method
				._addCamera(
					//
					this,
				)
		}
	}
}

export {PerspectiveCamera}
