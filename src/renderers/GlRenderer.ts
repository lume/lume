import {Renderer, SceneState} from './Renderer.js'

import type {Texture} from 'three/src/textures/Texture.js'
import type {Scene} from '../core/Scene.js'

export interface GlSceneState extends SceneState {
	renderer: {}
}

/** @typedef {'pcf' | 'pcfsoft' | 'basic'} ShadowMapTypeString */
export type ShadowMapTypeString = 'pcf' | 'pcfsoft' | 'basic'

export abstract class GlRenderer extends Renderer {
	abstract localClippingEnabled: boolean
	abstract setClearColor(scene: Scene, color: any, opacity: number): void
	abstract setClearAlpha(scene: Scene, opacity: number): void
	abstract setShadowMapType(scene: Scene, type: ShadowMapTypeString | null): void
	abstract enableBackground(scene: Scene, isEquirectangular: boolean, cb: (tex: Texture | undefined) => void): void
	abstract disableBackground(scene: Scene): void
	abstract enableEnvironment(scene: Scene, cb: (tex: Texture) => void): void
	abstract disableEnvironment(scene: Scene): void
	abstract enableVR(scene: Scene, enable: boolean): void
	abstract createDefaultVRButton(scene: Scene): HTMLElement
}
