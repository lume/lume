import {GlRenderer, GlSceneState, ShadowMapTypeString} from './GlRenderer.js'

import {sphereProjection} from '@here/harp-geoutils'
import {MapControls, MapControlsUI} from '@here/harp-map-controls'
import {
	// CopyrightElementHandler,
	MapView,
} from '@here/harp-mapview'
import {VectorTileDataSource} from '@here/harp-vectortile-datasource'

export const apikey = 'xpAjPxiB0OxFnxGsE2PgX6U1fSVTbawMVEahb-eaT1g'

import type {Scene} from '../core/Scene.js'
import type {Texture} from 'three/src/textures/Texture.js'

export interface HarpSceneState extends GlSceneState {
	renderer: MapView
}

const sceneStates = new WeakMap<Scene, HarpSceneState>()

let instance: HarpRenderer | null = null
let isCreatingSingleton = false

export class HarpRenderer extends GlRenderer {
	static singleton() {
		if (instance) return instance
		else {
			try {
				isCreatingSingleton = true
				return (instance = new HarpRenderer())
			} catch (e) {
				throw e
			} finally {
				isCreatingSingleton = false
			}
		}
	}

	private constructor() {
		super()

		if (!isCreatingSingleton)
			throw new Error('class is a singleton, use the static .singleton() method to get an instance')
	}

	// TODO rename
	initialize(scene: Scene) {
		let sceneState = sceneStates.get(scene)

		if (sceneState) return

		const div = document.createElement('div')
		const canvas = document.createElement('canvas')
		div.append(canvas)

		scene._glLayer!.appendChild(div)

		sceneStates.set(
			scene,
			(sceneState = {
				renderer: initializeMapView(canvas),
				sizeChangeHandler: () => this.updateResolution(scene),
			}),
		)

		// this.updateResolution(scene)

		scene.on('sizechange', sceneState.sizeChangeHandler)
	}

	uninitialize(scene: Scene) {
		const sceneState = sceneStates.get(scene)

		if (!sceneState) return

		scene.off('sizechange', sceneState.sizeChangeHandler)

		sceneState.renderer.dispose(true)
		scene._glLayer?.removeChild(sceneState.renderer.canvas.parentElement!)

		sceneStates.delete(scene)
	}

	drawScene(scene: Scene) {
		const sceneState = sceneStates.get(scene)

		if (!sceneState) throw new ReferenceError('Can not draw scene. Scene state should be initialized first.')

		// const {renderer} = sceneState

		// renderer.render(scene.three, scene.threeCamera)
	}

	updateResolution(scene: Scene) {
		const state = sceneStates.get(scene)

		if (!state) throw new ReferenceError('Unable to update resolution. Scene state should be initialized first.')

		scene._updateCameraAspect()
		scene._updateCameraPerspective()
		scene._updateCameraProjection()

		const {x, y} = scene.calculatedSize
		state.renderer.resize(x, y)

		scene.needsUpdate()
	}

	requestFrame(_scene: Scene, fn: FrameRequestCallback) {
		requestAnimationFrame(fn)
	}

	//////

	// unimplemented, noops
	localClippingEnabled = false // unused
	setClearColor(_scene: Scene, _color: any, _opacity: number): void {}
	setClearAlpha(_scene: Scene, _opacity: number): void {}
	setShadowMapType(_scene: Scene, _type: ShadowMapTypeString | null): void {}
	enableBackground(_scene: Scene, _isEquirectangular: boolean, _cb: (tex: Texture | undefined) => void): void {}
	disableBackground(_scene: Scene): void {}
	enableEnvironment(_scene: Scene, _cb: (tex: Texture) => void): void {}
	disableEnvironment(_scene: Scene): void {}
	enableVR(_scene: Scene, _enable: boolean): void {}
	createDefaultVRButton(_scene: Scene): HTMLElement {
		return document.createElement('div') // unused.
	}
}

function initializeMapView(canvas: HTMLCanvasElement): MapView {
	const mapView = new MapView({
		canvas,
		projection: sphereProjection,
		theme: 'resources/berlin_tilezen_base_globe.json',
	})

	// CopyrightElementHandler.install('copyrightNotice', mapView)

	const omvDataSource = new VectorTileDataSource({
		baseUrl: 'https://vector.hereapi.com/v2/vectortiles/base/mc',
		authenticationCode: apikey,
	})

	mapView.addDataSource(omvDataSource)

	const mapControls = new MapControls(mapView)
	mapControls.maxTiltAngle = 90
	const ui = new MapControlsUI(mapControls, {zoomLevel: 'input'})
	mapView.canvas.parentElement!.appendChild(ui.domElement)

	return mapView
}
