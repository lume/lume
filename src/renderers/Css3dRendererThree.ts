import {CSS3DRendererNested} from './CSS3DRendererNested.js'

import type {Scene} from '../core/Scene.js'

interface SceneState {
	renderer: CSS3DRendererNested
	sizeChangeHandler: () => void
}

let instance: Css3dRendererThree | null = null
let isCreatingSingleton = false

export class Css3dRendererThree {
	static singleton() {
		if (instance) return instance
		else {
			try {
				isCreatingSingleton = true
				return (instance = new Css3dRendererThree())
			} catch (e) {
				throw e
			} finally {
				isCreatingSingleton = false
			}
		}
	}

	private constructor() {
		if (!isCreatingSingleton)
			throw new Error('class is a singleton, use the static .singleton() method to get an instance')
	}

	sceneStates = new WeakMap<Scene, SceneState>()

	// TODO rename
	initialize(scene: Scene) {
		let sceneState = this.sceneStates.get(scene)

		if (sceneState) return

		this.sceneStates.set(
			scene,
			(sceneState = {
				renderer: new CSS3DRendererNested(),
				sizeChangeHandler: () => this.updateResolution(scene),
			}),
		)

		const {renderer} = sceneState

		this.updateResolution(scene)

		scene.on('sizechange', sceneState.sizeChangeHandler)

		scene._cssLayer!.appendChild(renderer.domElement)
	}

	uninitialize(scene: Scene) {
		const sceneState = this.sceneStates.get(scene)

		if (!sceneState) return

		scene.off('sizechange', sceneState.sizeChangeHandler)

		scene._cssLayer?.removeChild(sceneState.renderer.domElement)

		this.sceneStates.delete(scene)
	}

	drawScene(scene: Scene) {
		const sceneState = this.sceneStates.get(scene)

		if (!sceneState) throw new ReferenceError('Can not draw scene. Scene state should be initialized first.')

		const {renderer} = sceneState

		renderer.render(scene.threeCSS, scene.threeCamera)
	}

	updateResolution(scene: Scene) {
		const state = this.sceneStates.get(scene)

		if (!state) throw new ReferenceError('Unable to update resolution. Scene state should be initialized first.')

		scene._updateCameraAspect()
		scene._updateCameraPerspective()
		scene._updateCameraProjection()

		const {x, y} = scene.calculatedSize
		state.renderer.setSize(x, y)

		scene.needsUpdate()
	}

	requestFrame(_scene: Scene, fn: FrameRequestCallback) {
		requestAnimationFrame(fn)
	}
}

export function releaseCSS3DRendererThree() {
	instance = null
}
