import {Geometry} from 'three/src/core/Geometry.js'
import {GeometryOrMaterialBehavior} from '../GeometryOrMaterialBehavior.js'

import type {MeshComponentType} from '../MeshBehavior.js'
import type {BufferGeometry} from 'three'

// base class for geometry behaviors
export abstract class GeometryBehavior extends GeometryOrMaterialBehavior {
	type: MeshComponentType = 'geometry'

	// We don't use @reactive or @attribute in this class because the values
	// come from (or go to) the this.element, which itself already reacts to
	// attribute changes.

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

	override _createComponent(): BufferGeometry | Geometry {
		return new Geometry()
	}

	loadGL() {
		super.loadGL()

		this.createEffect(() => {
			this.size
			this.sizeMode

			// NOTE we may use this.size's x, y, z values to calculate scale when/if we
			// implement size under the hood as an Object3D.scale.

			// TODO PERFORMANCE, resetMeshComponent creates a new geometry.
			// Re-creating geometries is wasteful, re-use them when possible, and
			// add instancing. Maybe we use Object3D.scale as an implementation
			// detail of our `size` prop.
			this.resetMeshComponent()
		})
	}
}
