import {WebGLRenderer} from 'three/src/renderers/WebGLRenderer.js'
import {BasicShadowMap, PCFSoftShadowMap, PCFShadowMap} from 'three/src/constants.js'
import {PMREMGenerator} from 'three/src/extras/PMREMGenerator.js'
import {TextureLoader} from 'three'
// TODO update to WebXR
// import WEBVR from '../lib/three/WebVR.js'

import type {Scene} from './Scene.js'
import type {Texture} from 'three/src/textures/Texture.js'

interface SceneState {
	renderer: WebGLRenderer
	pmremgen?: PMREMGenerator
	backgroundIsEquirectangular?: boolean
	hasBackground?: boolean
	hasEnvironment?: boolean
	sizeChangeHandler: () => void
}

const sceneStates = new WeakMap<Scene, SceneState>()

let instance: WebGLRendererThree | null = null
let isCreatingSingleton = false

/** @typedef {'pcf' | 'pcfsoft' | 'basic'} ShadowMapTypeString */
export type ShadowMapTypeString = 'pcf' | 'pcfsoft' | 'basic'

/**
 * @internal
 * @class WebGLRendererThree - A singleton responsible for setting up and
 * drawing a WebGL scene for a given core/Scene using Three.js
 */
export class WebGLRendererThree {
	static singleton() {
		if (instance) return instance
		else {
			try {
				isCreatingSingleton = true
				return (instance = new WebGLRendererThree())
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

	initialize(scene: Scene) {
		let sceneState = sceneStates.get(scene)

		if (sceneState) return

		sceneStates.set(
			scene,
			(sceneState = {
				// TODO: options controlled by HTML attributes on scene elements.
				renderer: new WebGLRenderer({
					// TODO: how do we change alpha:true to alpha:false after the
					// fact?
					alpha: true,

					antialias: true,
				}),

				sizeChangeHandler: () => this.updateResolution(scene),
			}),
		)

		const {renderer} = sceneState

		// TODO: make configurable by property/attribute
		renderer.setPixelRatio(window.devicePixelRatio)
		renderer.shadowMap.enabled = true
		renderer.shadowMap.type = PCFSoftShadowMap // default PCFShadowMap

		this.updateResolution(scene)

		scene.on('sizechange', sceneState.sizeChangeHandler)

		// TODO? Maybe the html/scene.js element should be responsible for
		// making this, so that DOM logic is encapsulated there?
		scene._glLayer!.appendChild(renderer.domElement)
	}

	uninitialize(scene: Scene) {
		const sceneState = sceneStates.get(scene)

		if (!sceneState) return

		scene.off('sizechange', sceneState.sizeChangeHandler)

		scene._glLayer?.removeChild(sceneState.renderer.domElement)

		sceneState.renderer.dispose()
		sceneState.pmremgen?.dispose()

		sceneStates.delete(scene)
	}

	drawScene(scene: Scene) {
		const sceneState = sceneStates.get(scene)

		if (!sceneState) throw new ReferenceError('Can not draw scene. Scene state should be initialized first.')

		const {renderer} = sceneState

		renderer.render(scene.three, scene.threeCamera)
	}

	// TODO FIXME This is tied to the `sizechange` event of Scene, which means
	// camera and renderer resize happens outside of the animation loop, but as
	// with _calcSize, we want to see if we can put this in the animation loop
	// as well. Putting this logic in the loop depends on putting _calcSize in
	// the loop. #66
	updateResolution(scene: Scene) {
		const state = sceneStates.get(scene)

		if (!state) throw new ReferenceError('Unable to update resolution. Scene state should be initialized first.')

		scene._updateCameraAspect()
		scene._updateCameraPerspective()
		scene._updateCameraProjection()

		const {x, y} = scene.calculatedSize
		state.renderer.setSize(x, y)
		scene.needsUpdate()
	}

	setClearColor(scene: Scene, color: any, opacity: number) {
		const state = sceneStates.get(scene)
		if (!state) throw new ReferenceError('Unable to set clear color. Scene state should be initialized first.')
		state.renderer.setClearColor(color, opacity)
	}

	setClearAlpha(scene: Scene, opacity: number) {
		const state = sceneStates.get(scene)
		if (!state) throw new ReferenceError('Unable to set clear alpha. Scene state should be initialized first.')
		state.renderer.setClearAlpha(opacity)
	}

	setShadowMapType(scene: Scene, type: ShadowMapTypeString) {
		const state = sceneStates.get(scene)
		if (!state) throw new ReferenceError('Unable to set clear alpha. Scene state should be initialized first.')

		// TODO shouldn't need a cast here. Bug on TypeScript: https://github.com/microsoft/TypeScript/issues/32054
		type = type.toLowerCase() as ShadowMapTypeString

		if (type == 'pcf') {
			state.renderer.shadowMap.type = PCFShadowMap
		} else if (type == 'pcfsoft') {
			state.renderer.shadowMap.type = PCFSoftShadowMap
		} else if (type == 'basic') {
			state.renderer.shadowMap.type = BasicShadowMap
		} else {
			// default
			state.renderer.shadowMap.type = PCFShadowMap
		}
	}

	#bgVersion = 0

	/**
	 * @method enableBackground - Enable background texture handling for the given scene.
	 * @param {Scene} scene - The given scene.
	 * @param {boolean} isEquirectangular - True if the background is equirectangular (to use as an environment map), false for a static background image.
	 * @param {(t: Texture | undefined) => void} cb - A callback that is called
	 * when the background mechanics are done loading. The Callback receives the
	 * background Texture instance.
	 */
	enableBackground(scene: Scene, isEquirectangular: boolean, cb: (tex: Texture | undefined) => void): void {
		const state = sceneStates.get(scene)
		if (!state) throw new ReferenceError('Internal error: Scene not registered with WebGLRendererThree.')

		this.#bgVersion += 1
		state.backgroundIsEquirectangular = isEquirectangular

		if (isEquirectangular) {
			// Load the PMREM machinery only if needed.
			if (!state.pmremgen) {
				state.pmremgen = new PMREMGenerator(state.renderer)
				state.pmremgen.compileCubemapShader()
			}
		}

		state.hasBackground = true
		this.#loadBackgroundTexture(scene, cb)
	}

	/**
	 * @method disableBackground - Disable background for the given scene.
	 * @param {Scene} scene - The given scene.
	 */
	disableBackground(scene: Scene): void {
		const state = sceneStates.get(scene)
		if (!state) throw new ReferenceError('Internal error: Scene not registered with WebGLRendererThree.')

		this.#bgVersion += 1

		if (!state.hasBackground && !state.hasEnvironment) {
			state.pmremgen?.dispose()
			state.pmremgen = undefined
		}
	}

	/**
	 * @private
	 * @method #loadBackgroundTexture - Load the background texture for the given scene.
	 * @param {Scene} scene - The given scene.
	 * @param {(t: Texture | undefined) => void} cb - Callback called when the
	 * texture is done loading. It receives the Texture, or undefined if loading
	 * was canceled or if other issues.
	 */
	#loadBackgroundTexture(scene: Scene, cb: (texture: Texture) => void): void {
		const state = sceneStates.get(scene)
		if (!state) throw new ReferenceError('Internal error: Scene not registered with WebGLRendererThree.')

		const version = this.#bgVersion

		new TextureLoader().load(scene.background, tex => {
			// In case state changed during load, ignore a loaded texture that
			// corresponds to previous state:
			if (version !== this.#bgVersion) return

			if (state.backgroundIsEquirectangular) {
				cb(state.pmremgen!.fromEquirectangular(tex).texture)
			} else {
				cb(tex)
			}
		})
	}

	#envVersion = 0

	/**
	 * @method enableEnvironment - Enable environment texture handling for the given scene.
	 * @param {Scene} scene - The given scene.
	 * @param {(t: Texture | undefined) => void} cb - A callback that is called
	 * when the environment mechanics are done loading. The Callback receives the
	 * background Texture instance.
	 */
	enableEnvironment(scene: Scene, cb: (tex: Texture) => void): void {
		const state = sceneStates.get(scene)
		if (!state) throw new ReferenceError('Internal error: Scene not registered with WebGLRendererThree.')

		this.#envVersion += 1

		// Load the PMREM machinery only if needed.
		if (!state.pmremgen) {
			state.pmremgen = new PMREMGenerator(state.renderer)
			state.pmremgen.compileCubemapShader()
		}

		state.hasEnvironment = true
		this.#loadEnvironmentTexture(scene, cb)
	}

	/**
	 * @method disableEnvironment - Disable the environment map for the given scene.
	 * @param {Scene} scene - The given scene.
	 */
	disableEnvironment(scene: Scene): void {
		const state = sceneStates.get(scene)
		if (!state) throw new ReferenceError('Internal error: Scene not registered with WebGLRendererThree.')

		this.#envVersion += 1

		if (!state.hasBackground && !state.hasEnvironment) {
			state.pmremgen?.dispose()
			state.pmremgen = undefined
		}
	}

	/**
	 * @private
	 * @method #loadEnvironmentTexture - Load the environment texture for the given scene.
	 * @param {Scene} scene - The given scene.
	 * @param {(t: Texture | undefined) => void} cb - Callback called when the
	 * texture is done loading. It receives the Texture.
	 */
	#loadEnvironmentTexture(scene: Scene, cb: (texture: Texture) => void): void {
		const state = sceneStates.get(scene)
		if (!state) throw new ReferenceError('Internal error: Scene not registered with WebGLRendererThree.')

		const version = this.#envVersion

		new TextureLoader().load(scene.environment, tex => {
			// In case state changed during load, ignore a loaded texture that
			// corresponds to previous state:
			if (version !== this.#envVersion) return

			cb(state.pmremgen!.fromEquirectangular(tex).texture)
			tex.dispose() // Three.js demos do this. Not sure if it is really needed.
		})
	}

	requestFrame(scene: Scene, fn: FrameRequestCallback) {
		const state = sceneStates.get(scene)
		if (!state) throw new ReferenceError('Unable to request frame. Scene state should be initialized first.')

		const {renderer} = state

		if (renderer.setAnimationLoop)
			// >= r94
			renderer.setAnimationLoop(fn)
		else if (renderer.animate)
			// < r94
			renderer.animate(fn)
	}

	// TODO: at the moment this has only been tested toggling it on
	// once. Should we be able to turn it off too (f.e. the vr attribute is removed)?
	// TODO Update to WebXR
	// enableVR(scene: Scene, enable: boolean) {
	// 	const state = sceneStates.get(scene)
	// 	if (!state) throw new ReferenceError('Unable to enable VR. Scene state should be initialized first.')

	// 	const {renderer} = state

	// 	// TODO TESTME updated from .vr.enabled to .xr.enabled, ensure it works the same.
	// 	renderer.xr.enabled = enable
	// }

	// TODO the UI here should be configurable via HTML
	// TODO Update to WebXR
	// createDefaultWebVREntryUI(scene: Scene) {
	// 	const state = sceneStates.get(scene)
	// 	if (!state) throw new ReferenceError('Unable to create VR button. Scene state should be initialized first.')

	// 	const {renderer} = state

	// 	window.addEventListener('vrdisplaypointerrestricted', onPointerRestricted, false)
	// 	window.addEventListener('vrdisplaypointerunrestricted', onPointerUnrestricted, false)

	// 	function onPointerRestricted() {
	// 		var pointerLockElement = renderer.domElement
	// 		if (pointerLockElement && typeof pointerLockElement.requestPointerLock === 'function') {
	// 			pointerLockElement.requestPointerLock()
	// 		}
	// 	}

	// 	function onPointerUnrestricted() {
	// 		var currentPointerLockElement = document.pointerLockElement
	// 		var expectedPointerLockElement = renderer.domElement
	// 		if (
	// 			currentPointerLockElement &&
	// 			currentPointerLockElement === expectedPointerLockElement &&
	// 			typeof document.exitPointerLock === 'function'
	// 		) {
	// 			document.exitPointerLock()
	// 		}
	// 	}

	// 	const button = WEBVR.createButton(renderer)

	// 	button.setAttribute('id', 'vrButton')
	// 	button.style.color = 'black'
	// 	button.style.setProperty('border-color', 'black')

	// 	button.setAttribute('slot', 'misc')
	// 	scene.appendChild(button)

	// 	return button
	// }
}

export function releaseWebGLRendererThree() {
	instance = null
}
