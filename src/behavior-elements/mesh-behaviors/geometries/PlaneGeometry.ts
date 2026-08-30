import {PlaneGeometry as ThreePlaneGeometry} from 'three/src/geometries/PlaneGeometry.js'
import {element, numberAttribute, type ElementAttributes} from '@lume/element'
import {GeometryBehaviorEl} from './GeometryBehaviorEl.js'
import {autoDefineElements} from '../../../LumeConfig.js'

export type PlaneGeometryAttributes = 'widthSegments' | 'heightSegments'

/**
 * @class PlaneGeometryBehavior -
 *
 * Element: `<lume-plane-geometry>`
 *
 * Makes a flat rectangle-shaped geometry on a [`<lume-mesh>`](../../../meshes/Mesh)
 * element. This is the default geometry behavior on
 * [`<lume-plane>`](../../../meshes/Plane) elements.
 *
 * The size of the sphere is determined by the `x` and `y`
 * [`size`](../../../core/Sizeable#size) of the element.
 *
 * @extends GeometryBehaviorEl
 * @element lume-plane-geometry TODO @element jsdoc tag
 */
export
@element('lume-plane-geometry', autoDefineElements)
class PlaneGeometry extends GeometryBehaviorEl {
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
		return new ThreePlaneGeometry(
			this.composedParent!.calculatedSize.x,
			this.composedParent!.calculatedSize.y,
			this.widthSegments,
			this.heightSegments,
		)
	}
}

declare module 'solid-js' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-plane-geometry': ElementAttributes<PlaneGeometry, PlaneGeometryAttributes>
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'lume-plane-geometry': PlaneGeometry
	}
}
