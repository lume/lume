import {CSS3DRendererNested} from './CSS3DRendererNested.js'
import {Motor} from '../core/Motor.js'

import type {Scene} from '../core/Scene.js'

interface SceneState {
	renderer: CSS3DRendererNested
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

	constructor() {
		if (!isCreatingSingleton)
			throw new Error('class is a singleton, use the static .singleton() method to get an instance')
	}

	sceneStates = new WeakMap<Scene, SceneState>()

	initialized(scene: Scene) {
		return this.sceneStates.has(scene)
	}

	// TODO rename
	initialize(scene: Scene) {
		let sceneState = this.sceneStates.get(scene)

		if (sceneState) return

		this.sceneStates.set(
			scene,
			(sceneState = {
				renderer: new CSS3DRendererNested(),
			}),
		)

		const {renderer} = sceneState

		scene._cssLayer!.appendChild(renderer.domElement)
	}

	uninitialize(scene: Scene) {
		const sceneState = this.sceneStates.get(scene)

		if (!sceneState) return

		scene._cssLayer?.removeChild(sceneState.renderer.domElement)

		this.sceneStates.delete(scene)
	}

	drawScene(scene: Scene) {
		const sceneState = this.sceneStates.get(scene)

		if (!sceneState) throw new ReferenceError('Can not draw scene. Scene state should be initialized first.')

		const {renderer} = sceneState

		renderer.render(scene.threeCSS, scene.threeCamera)
	}

	updateResolution(scene: Scene, x: number, y: number) {
		// We don't need to defer here like we do in the webgl renderer (see the
		// WebglRendererThree.updateResolution comment for more info on why we
		// need to defer), but we do it so that the CSS visual stays in sync
		// with the GL visual on resize, otherwise the resized CSS visual will
		// always be one frame ahead of the resized GL visual.
		Motor.once(() => {
			if (!this.initialized(scene)) return

			const state = this.sceneStates.get(scene)!
			state.renderer.setSize(x, y)
		})
	}

	requestFrame(_scene: Scene, fn: FrameRequestCallback) {
		requestAnimationFrame(fn)
	}
}

export function releaseCSS3DRendererThree() {
	instance = null
}
