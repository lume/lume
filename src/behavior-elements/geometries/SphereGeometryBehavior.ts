import {SphereGeometry} from 'three/src/geometries/SphereGeometry.js'
import {numberAttribute, element} from '@lume/element'
import {GeometryBehavior} from './GeometryBehavior.js'
import {autoDefineElements} from '../../LumeConfig.js'

export type SphereGeometryBehaviorAttributes = 'horizontalSegments' | 'verticalSegments'

/**
 * @class SphereGeometryBehavior -
 *
 * Element: `sphere-geometry`
 *
 * Makes a sphere-shaped geometry on a [`<lume-mesh>`](../../../meshes/Mesh)
 * element. This is the default geometry behavior on
 * [`<lume-sphere>`](../../../meshes/Sphere) elements.
 *
 * The diameter of the sphere is determined by the `x`
 * [`size`](../../../core/Sizeable#size) of the element.
 *
 * @extends GeometryBehavior
 * @element sphere-geometry
 */
export
@element('sphere-geometry', autoDefineElements)
class SphereGeometryBehavior extends GeometryBehavior {
	/**
	 * @property {number} horizontalSegments -
	 *
	 * `attribute`
	 *
	 * Default: `32`
	 *
	 * The number of divisions around the equator of the sphere. A sphere with 10
	 * horizontal segments and 10 vertical segments is made up of 100 flat faces.
	 */
	@numberAttribute horizontalSegments = 32

	/**
	 * @property {number} verticalSegments -
	 *
	 * `attribute`
	 *
	 * Default: `32`
	 *
	 * The number of divisions across the height of the sphere. A sphere with 10
	 * horizontal segments and 10 vertical segments is made up of 100 flat faces.
	 */
	@numberAttribute verticalSegments = 32

	override _createComponent() {
		return new SphereGeometry(
			this.parentElement!.calculatedSize.x / 2, 
			this.horizontalSegments, 
			this.verticalSegments
		)
	}
}