import {BufferGeometry} from 'three/src/core/BufferGeometry.js'
import {GeometryOrMaterialBehaviorEl} from '../GeometryOrMaterialBehaviorEl.js'

/**
 * @class GeometryBehaviorEl -
 * An abstract base class for geometry behavior elements.
 *
 * This implements `GeometryOrMaterialBehaviorEl._createComponent` to return a
 * `THREE.BufferGeometry` by default.
 *
 * @extends GeometryOrMaterialBehaviorEl
 */
export abstract class GeometryBehaviorEl extends GeometryOrMaterialBehaviorEl {
	readonly type = 'geometry'

	override _createComponent(): BufferGeometry {
		return new BufferGeometry()
	}
}
