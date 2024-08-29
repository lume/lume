import {createMemo} from 'solid-js'
import {Group} from 'three/src/objects/Group.js'
import type {Object3D} from 'three/src/core/Object3D.js'
import type {AnimationClip} from 'three/src/animation/AnimationClip.js'
import type {GLTF} from 'three/examples/jsm/loaders/GLTFLoader.js'
import type {Collada} from 'three/examples/jsm/loaders/ColladaLoader.js'
import {Model} from '../Model.js'
import {createBehaviorMemo} from './createBehaviorMemo.js'
import {ModelBehavior} from '../../behaviors/index.js'

export type ThreeModelAsset =
	| GLTF // GltfModel
	| Collada // ColladaModel
	| Group // the rest all use Group

export interface ThreeModel {
	root: Object3D
	clips: AnimationClip[]
}

/**
 * Given a Model element, returns a signal that will contain the element's
 * loaded model (undefined until loaded). The signal also changes any time the
 * element loads a new model.
 */
export function createThreeModelMemo(modelEl: Model) {
	const modelBehavior = createBehaviorMemo(
		modelEl,
		(name, behavior) => name.endsWith('-model') && behavior instanceof ModelBehavior,
	) as () => ModelBehavior | undefined

	return createMemo(() => {
		const behavior = modelBehavior()
		if (!behavior) return

		const model = behavior.model as ThreeModelAsset | undefined
		if (!model) return

		const root = model instanceof Group ? model : model.scene
		const clips = 'animations' in model ? model.animations : model.scene.animations

		return {root, clips} as ThreeModel
	})
}
