import type {Scene} from '../core/Scene.js'

export interface SceneState {
	sizeChangeHandler: () => void
}

export abstract class Renderer {
	abstract initialize(scene: Scene): void
	abstract uninitialize(scene: Scene): void
	abstract drawScene(scene: Scene): void
	abstract updateResolution(scene: Scene): void
	abstract requestFrame(scene: Scene, fn: FrameRequestCallback): void
}
