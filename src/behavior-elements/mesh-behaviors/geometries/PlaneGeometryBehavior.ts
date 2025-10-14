import {PlaneGeometry} from 'three/src/geometries/PlaneGeometry.js'
import {element, numberAttribute} from '@lume/element'
import {GeometryBehavior} from './GeometryBehavior.js'
import {autoDefineElements} from '../../../LumeConfig.js'

/**
 * @class PlaneGeometryBehavior -
 *
 * Element: `plane-geometry`
 *
 * Makes a flat rectangle-shaped geometry on a [`<lume-mesh>`](../../../meshes/Mesh)
 * element. This is the default geometry behavior on
 * [`<lume-plane>`](../../../meshes/Plane) elements.
 *
 * The size of the sphere is determined by the `x` and `y`
 * [`size`](../../../core/Sizeable#size) of the element.
 *
 * @extends GeometryBehavior
 * @element plane-geometry TODO @element jsdoc tag
 */
export
@element('plane-geometry', autoDefineElements)
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
	@numberAttribute widthSegments = 1

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
	@numberAttribute heightSegments = 1

	override _createComponent() {
		return new PlaneGeometry(
			this.composedParent!.calculatedSize.x,
			this.composedParent!.calculatedSize.y,
			this.widthSegments,
			this.heightSegments,
		)
	}
}
