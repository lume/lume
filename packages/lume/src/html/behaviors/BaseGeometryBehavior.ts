import {autorun} from '@lume/element'
import BaseMeshBehavior, {MeshComponentType} from './BaseMeshBehavior'

import type {StopFunction} from '@lume/element'

// base class for geometry behaviors
export default class BaseGeometryBehavior extends BaseMeshBehavior {
	type: MeshComponentType = 'geometry'

	// We don't use @reactive or @attribute in this class because the values
	// come from (or go to) the this.element.size property (via event
	// listeners), which itself already reacts to attribute changes.

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

	protected _stopFns: StopFunction[] = []

	loadGL() {
		if (!super.loadGL()) return false

		this._stopFns.push(
			autorun(() => {
				this.size
				this.sizeMode

				// NOTE we may use this.size's x, y, z values to calculate scale when/if we
				// implement size under the hood as an Object3D.scale.

				// TODO PERFORMANCE, resetMeshComponent creates a new geometry.
				// Re-creating geometries is wasteful, re-use them when possible, and
				// add instancing. Maybe we use Object3D.scale as an implementation
				// detail of our `size` prop.
				this.resetMeshComponent()
			}),
		)

		return true
	}

	unloadGL() {
		if (!super.unloadGL()) return false

		for (const stop of this._stopFns) stop()

		return true
	}
}

export {BaseGeometryBehavior}
