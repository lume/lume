import {reactive} from '@lume/variable' // TODO replace reactive with signal classy-solid
import {Effectful} from '../core/Effectful.js'
import {WebGLRenderer} from 'three/src/renderers/WebGLRenderer.js'
import {BasicShadowMap, PCFSoftShadowMap, PCFShadowMap} from 'three/src/constants.js'
import {PMREMGenerator} from 'three/src/extras/PMREMGenerator.js'
import {TextureLoader} from 'three/src/loaders/TextureLoader.js'

import {VRButton} from 'three/examples/jsm/webxr/VRButton.js'
// TODO import {ARButton}  from 'three/examples/jsm/webxr/ARButton.js'

import type {Scene} from '../core/Scene.js'
import type {Texture} from 'three/src/textures/Texture.js'

class SceneEffects extends Effectful(Object) {}

interface SceneState {
	renderer: WebGLRenderer
	pmremgen?: PMREMGenerator
	backgroundIsEquirectangular?: boolean
	hasBackground?: boolean
	hasEnvironment?: boolean
	sizeChangeHandler: () => void
	effects: SceneEffects
}

const sceneStates = new WeakMap<Scene, SceneState>()

let instance: WebglRendererThree | null = null
let isCreatingSingleton = false

/** @typedef {'pcf' | 'pcfsoft' | 'basic'} ShadowMapTypeString */
export type ShadowMapTypeString = 'pcf' | 'pcfsoft' | 'basic'

/**
 * @internal
 * A singleton responsible for setting up and
 * drawing a WebGL scene for a given core/Scene using Three.js
 */
@reactive
export class WebglRendererThree {
	static singleton() {
		if (instance) return instance
		else {
			try {
				isCreatingSingleton = true
				return (instance = new WebglRendererThree())
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

	@reactive localClippingEnabled = false

	initialize(scene: Scene) {
		let sceneState = sceneStates.get(scene)

		if (sceneState) return

		// TODO: options controlled by HTML attributes on scene elements.
		const renderer = new WebGLRenderer({
			// TODO: how do we change alpha:true to alpha:false after the fact?
			alpha: true,
			premultipliedAlpha: true,

			antialias: true,
		})

		const effects = new SceneEffects()

		effects.createEffect(() => {
			renderer.localClippingEnabled = this.localClippingEnabled
		})

		// TODO: make some of the renderer options configurable by property/attribute.

		// Needs to be enabled first for it to work? If so, we need to destroy
		// and reinitialize renderes to toggle between XR or non-XR scenes.
		renderer.xr.enabled = true

		renderer.setPixelRatio(globalThis.devicePixelRatio)
		renderer.shadowMap.enabled = true
		renderer.shadowMap.type = PCFSoftShadowMap // default PCFShadowMap

		sceneStates.set(
			scene,
			(sceneState = {
				renderer,
				sizeChangeHandler: () => this.updateResolution(scene),
				effects,
			}),
		)

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
		sceneState.effects.stopEffects()

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

	setShadowMapType(scene: Scene, type: ShadowMapTypeString | null) {
		const state = sceneStates.get(scene)
		if (!state) throw new ReferenceError('Unable to set clear alpha. Scene state should be initialized first.')

		// default
		if (!type) {
			state.renderer.shadowMap.type = PCFShadowMap
			return
		}

		// TODO shouldn't need a cast here. Bug on TypeScript: https://github.com/microsoft/TypeScript/issues/32054
		type = type.toLowerCase() as ShadowMapTypeString

		if (type == 'pcf') {
			state.renderer.shadowMap.type = PCFShadowMap
		} else if (type == 'pcfsoft') {
			state.renderer.shadowMap.type = PCFSoftShadowMap
		} else if (type == 'basic') {
			state.renderer.shadowMap.type = BasicShadowMap
		}
	}

	setPhysicallyCorrectLights(scene: Scene, value: boolean) {
		const state = sceneStates.get(scene)
		if (!state) throw new ReferenceError('Unable to set value. Scene state should be initialized first.')
		state.renderer.physicallyCorrectLights = value
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

		new TextureLoader().load(scene.background ?? '', tex => {
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

		new TextureLoader().load(scene.environment ?? '', tex => {
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
			renderer.animate(fn as () => void)
	}

	// TODO: at the moment this has only been tested toggling it on
	// once. Should we be able to turn it off too (f.e. the vr attribute is removed)?
	// TODO Update to WebXR (WebXRManager in Three)
	enableVR(scene: Scene, enable: boolean) {
		const state = sceneStates.get(scene)
		if (!state) throw new ReferenceError('Unable to enable VR. Scene state should be initialized first.')

		const {renderer} = state
		renderer.xr.enabled = enable
	}

	// TODO the UI here should be configurable via HTML
	// TODO Update to WebXR
	createDefaultVRButton(scene: Scene): HTMLElement {
		const state = sceneStates.get(scene)
		if (!state) throw new ReferenceError('Unable to create VR button. Scene state should be initialized first.')

		const {renderer} = state
		return VRButton.createButton(renderer)
	}
}

export function releaseWebGLRendererThree() {
	instance = null
}
