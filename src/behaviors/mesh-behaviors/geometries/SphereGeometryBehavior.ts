import 'element-behaviors'
import {SphereGeometry} from 'three/src/geometries/SphereGeometry.js'
import {GeometryBehavior} from './GeometryBehavior.js'

/**
 * @class SphereGeometryBehavior -
 *
 * Makes a sphere-shaped geometry on a [`<lume-mesh>`](../../../meshes/Mesh)
 * element. This is the default geometry behavior on
 * [`<lume-sphere>`](../../../meshes/Sphere) elements.
 *
 * The diameter of the sphere is determined by the `x` size of the element.
 *
 * @extends GeometryBehavior
 * @behavior sphere-geometry TODO @behavior jsdoc tag
 */
export class SphereGeometryBehavior extends GeometryBehavior {
	// TODO radial segment properties

	override _createComponent() {
		return new SphereGeometry(this.element.calculatedSize.x / 2, 32, 32)
	}
}

if (!elementBehaviors.has('sphere-geometry')) elementBehaviors.define('sphere-geometry', SphereGeometryBehavior)
