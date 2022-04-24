// WIP

import 'element-behaviors'
import {ProjectedMaterial} from '@lume/three-projected-material/dist/ProjectedMaterial.js'
import {PerspectiveCamera} from 'three/src/cameras/PerspectiveCamera.js'
import {MaterialBehavior, MaterialBehaviorAttributes} from './MaterialBehavior.js'

export type ProjectedMaterialBehaviorAttributes = MaterialBehaviorAttributes

export class ProjectedMaterialBehavior extends MaterialBehavior {
	#camera = new PerspectiveCamera(50, 1, 0.1, 2000)

	get camera() {
		return this.#camera
	}
	set camera(v: any) {
		this.#camera = v
	}

	// override texture?: number

	// textureScale?: number
	// textureOffset?: Vector2
	// cover?: boolean

	_createComponent() {
		this.#camera.position.set(0, 0, 500)
		return new ProjectedMaterial({color: 0x0000ff, texture: this._actualTexture ?? undefined, camera: this.camera})
	}

	override loadGL() {
		super.loadGL()

		this.createEffect(() => {
			this._actualTexture
			this.resetMeshComponent()
		})
	}
}

if (!elementBehaviors.has('projected-material'))
	elementBehaviors.define('projected-material', ProjectedMaterialBehavior)
