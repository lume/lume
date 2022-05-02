import {element} from '@lume/element'
import {Scene, SceneAttributes} from '../core/Scene.js'
import {autoDefineElements} from '../LumeConfig.js'
import {HarpRenderer} from '../renderers/HarpRenderer.js'

export type HarpSceneAttributes =
	// Don't expost TransformableAttributes here for now (although they exist). What should modifying those on a Scene do?
	SceneAttributes

@element('lume-harp-scene', autoDefineElements)
export class HarpScene extends Scene {
	override createGlRenderer() {
		return HarpRenderer.singleton()
	}
}
