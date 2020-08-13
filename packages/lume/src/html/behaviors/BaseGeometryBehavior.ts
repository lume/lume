import BaseMeshBehavior, {MeshComponentType} from './BaseMeshBehavior'

import type XYZNonNegativeValues from '../../core/XYZNonNegativeValues'

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
		// This causes this.element's 'sizechange' or 'valuechanged' events to fire.
		this.element.size = val
	}

	get sizeMode() {
		return this.element.sizeMode
	}
	set sizeMode(val) {
		// This causes this.element's 'sizechange' or 'valuechanged' events to fire.
		this.element.sizeMode = val
	}

	loadGL() {
		if (!super.loadGL()) return false

		// TODO the following three events can be replaced with a single propchange:size event
		this.element.on('sizechange', this.__onSizeValueChanged, this)
		this.element.size.on('valuechanged', this.__onSizeValueChanged, this)
		this.element.sizeMode.on('valuechanged', this.__onSizeValueChanged, this)

		return true
	}

	unloadGL() {
		if (!super.unloadGL()) return false

		this.element.off('sizechange', this.__onSizeValueChanged, this)
		this.element.size.off('valuechanged', this.__onSizeValueChanged, this)
		this.element.sizeMode.off('valuechanged', this.__onSizeValueChanged, this)

		return true
	}

	private __onSizeValueChanged() {
		this.__updateGeometryOnSizeChange(this.size)
	}

	// NOTE we may use the x, y, z args to calculate scale when/if we
	// implement size under the hood as an Object3D.scale.
	private __updateGeometryOnSizeChange(_size: XYZNonNegativeValues) {
		// TODO PERFORMANCE, resetMeshComponent creates a new geometry.
		// Re-creating geometries is wasteful, re-use them when possible, and
		// add instancing. Maybe we use Object3D.scale as an implementation
		// detail of our `size` prop.
		this.resetMeshComponent()
	}
}

export {BaseGeometryBehavior}
