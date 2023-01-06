import 'element-behaviors'
import {SphereGeometry} from 'three/src/geometries/SphereGeometry.js'
import {numberAttribute, reactive} from '../../attribute.js'
import {GeometryBehavior} from './GeometryBehavior.js'

/**
 * @class SphereGeometryBehavior -
 *
 * Behavior: `sphere-geometry`
 *
 * Makes a sphere-shaped geometry on a [`<lume-mesh>`](../../../meshes/Mesh)
 * element. This is the default geometry behavior on
 * [`<lume-sphere>`](../../../meshes/Sphere) elements.
 *
 * The diameter of the sphere is determined by the `x`
 * [`size`](../../../core/Sizeable#size) of the element.
 *
 * @extends GeometryBehavior
 * @behavior sphere-geometry TODO @behavior jsdoc tag
 */
@reactive
export class SphereGeometryBehavior extends GeometryBehavior {
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
	@numberAttribute(32) horizontalSegments = 32

	/**
	 * @property {number} verticalSegments -
	 *
	 * `attribute`
	 *
	 * Default: `32`
	 *
	 * The number of divisions across the height of the plane. A plane with 10
	 * width segments and 10 height segments is essentially made up of 100 cells
	 * (or 10 rows and 10 columns of smaller planes)
	 */
	@numberAttribute(32) verticalSegments = 32

	override _createComponent() {
		return new SphereGeometry(this.element.calculatedSize.x / 2, this.horizontalSegments, this.verticalSegments)
	}
}

if (globalThis.window?.document && !elementBehaviors.has('sphere-geometry'))
	elementBehaviors.define('sphere-geometry', SphereGeometryBehavior)
