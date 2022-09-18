import 'element-behaviors'
import {PlaneGeometry} from 'three/src/geometries/PlaneGeometry.js'
import {numberAttribute} from '@lume/element'
import {behavior} from '../../Behavior.js'
import {receiver} from '../../PropReceiver.js'
import {GeometryBehavior} from './GeometryBehavior.js'

/**
 * @class PlaneGeometryBehavior -
 *
 * Behavior: `plane-geometry`
 *
 * Makes a flat rectangle-shaped geometry on a [`<lume-mesh>`](../../../meshes/Mesh)
 * element. This is the default geometry behavior on
 * [`<lume-plane>`](../../../meshes/Plane) elements.
 *
 * The size of the sphere is determined by the `x` and `y`
 * [`size`](../../../core/Sizeable#size) of the element.
 *
 * @extends GeometryBehavior
 * @behavior plane-geometry TODO @behavior jsdoc tag
 */
export {PlaneGeometryBehavior}
@behavior
class PlaneGeometryBehavior extends GeometryBehavior {
	/**
	 * @property {number} widthSegments -
	 *
	 * `attribute`
	 *
	 * Default: `1`
	 *
	 * The number of divisions across the width of the plane. A plane with 10
	 * width segments and 10 height segments is essentially made up of 100 cells
	 * (or 10 rows and 10 columns of smaller planes)
	 */
	@numberAttribute @receiver widthSegments = 1

	/**
	 * @property {number} heightSegments -
	 *
	 * `attribute`
	 *
	 * Default: `1`
	 *
	 * The number of divisions across the height of the plane. A plane with 10
	 * width segments and 10 height segments is essentially made up of 100 cells
	 * (or 10 rows and 10 columns of smaller planes)
	 */
	@numberAttribute @receiver heightSegments = 1

	override _createComponent() {
		return new PlaneGeometry(
			this.element.calculatedSize.x,
			this.element.calculatedSize.y,
			this.widthSegments,
			this.heightSegments,
		)
	}
}

if (!elementBehaviors.has('plane-geometry')) elementBehaviors.define('plane-geometry', PlaneGeometryBehavior)
