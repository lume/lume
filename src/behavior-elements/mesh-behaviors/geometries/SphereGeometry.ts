import {SphereGeometry as ThreeSphereGeometry} from 'three/src/geometries/SphereGeometry.js'
import {numberAttribute, element, type ElementAttributes} from '@lume/element'
import {GeometryBehaviorEl} from './GeometryBehaviorEl.js'
import {autoDefineElements} from '../../../LumeConfig.js'

export type SphereGeometryAttributes = 'horizontalSegments' | 'verticalSegments'

/**
 * @class SphereGeometryBehavior -
 *
 * Element: `<lume-sphere-geometry>`
 *
 * Makes a sphere-shaped geometry on a [`<lume-mesh>`](../../../meshes/Mesh)
 * element. This is the default geometry behavior on
 * [`<lume-sphere>`](../../../meshes/Sphere) elements.
 *
 * The diameter of the sphere is determined by the `x`
 * [`size`](../../../core/Sizeable#size) of the element.
 *
 * @extends GeometryBehaviorEl
 * @element lume-sphere-geometry
 */
export
@element('lume-sphere-geometry', autoDefineElements)
class SphereGeometry extends GeometryBehaviorEl {
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
		return new ThreeSphereGeometry(
			this.composedParent!.calculatedSize.x / 2,
			this.horizontalSegments,
			this.verticalSegments,
		)
	}
}

declare module 'solid-js' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-sphere-geometry': ElementAttributes<SphereGeometry, SphereGeometryAttributes>
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'lume-sphere-geometry': SphereGeometry
	}
}
