import {BufferGeometry} from 'three/src/core/BufferGeometry.js'
import {GeometryOrMaterialBehavior} from '../GeometryOrMaterialBehavior.js'

import type {MeshComponentType} from '../MeshBehavior.js'

// base class for geometry behaviors
export abstract class GeometryBehavior extends GeometryOrMaterialBehavior {
	type: MeshComponentType = 'geometry'

	get size() {
		return this.element.size
	}
	set size(val) {
		this.element.size = val
	}

	get sizeMode() {
		return this.element.sizeMode
	}
	set sizeMode(val) {
		this.element.sizeMode = val
	}

	get geometry(): ReturnType<this['_createComponent']> | undefined {
		return this.meshComponent
	}

	override _createComponent(): BufferGeometry {
		return new BufferGeometry()
	}
}
