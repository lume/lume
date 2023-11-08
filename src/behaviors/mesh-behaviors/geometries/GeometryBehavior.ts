import {BufferGeometry} from 'three/src/core/BufferGeometry.js'
import {GeometryOrMaterialBehavior} from '../GeometryOrMaterialBehavior.js'

import type {MeshComponentType} from '../MeshBehavior.js'

/**
 * @class GeometryBehavior -
 * An abstract base class for geometry behaviors.
 *
 * This implements `GeometryOrMaterialBehavior._createComponent` to return a
 * `THREE.BufferGeometry` by default.
 *
 * @extends GeometryOrMaterialBehavior
 */
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

	get geometry() {
		return this.meshComponent
	}

	override _createComponent(): BufferGeometry {
		return new BufferGeometry()
	}
}
