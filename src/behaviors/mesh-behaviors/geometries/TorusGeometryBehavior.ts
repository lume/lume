import 'element-behaviors'
import {numberAttribute, reactive} from '../../attribute.js'
import {TorusGeometry} from 'three/src/geometries/TorusGeometry.js'
import {GeometryBehavior} from './GeometryBehavior.js'
import {toRadians} from '../../../core/utils/index.js'

export type TorusGeometryBehaviorAttributes = 'tubeThickness' | 'radialSegments' | 'tubularSegments' | 'arc'

/**
 * @class TorusGeometryBehavior
 *
 * Creates a donut-shaped geometry for [`<lume-mesh>`](../../../meshes/Mesh)
 * elements. This is the geometry behavior of
 * [`<lume-torus>`](../../../meshes/Torus) elements by default.
 *
 * The outer diameter of the donut is determined by the element's
 * [`calculatedSize.x`](../../../core/Sizeable#calculatedsize). The inner diameter is
 * the element's `calculatedSize.x` minus the donut's
 * [`tubeThickness`](#tubethickness).
 *
 * @extends GeometryBehavior
 */
@reactive
export class TorusGeometryBehavior extends GeometryBehavior {
	// TODO tubeThicknessMode: literal or proportional

	/**
	 * @property {number} tubeThickness -
	 *
	 * `attribute`
	 *
	 * Default: `0.1`
	 *
	 * The thickness of the tube of the donut, as a fraction of the element's
	 * `x` size (as a fraction of the overall diameter also determined by the
	 * element's `x` size). The default `0.1` value means the donut's tube
	 * thickness is 10% of the overall diameter.
	 */
	@numberAttribute(0.1) tubeThickness = 0.1

	/**
	 * @property {number} radialSegments -
	 *
	 * `attribute`
	 *
	 * Default: `16`
	 *
	 * The number of segments (or edges) of the circular cross section of the
	 * donut tube.
	 */
	@numberAttribute(16) radialSegments = 16

	/**
	 * @property {number} tubularSegments -
	 *
	 * `attribute`
	 *
	 * Default: `32`
	 *
	 * The number of tube sections around the donut.
	 */
	@numberAttribute(32) tubularSegments = 32

	/**
	 * @property {number} arc -
	 *
	 * `attribute`
	 *
	 * Default: `360`
	 *
	 * The total angle in degrees around which the donut is constructed. The
	 * default value of `360` means the tubular segments go all the way around
	 * to form a whole donut. A value of `180` means we get a half of a donut
	 * shape.
	 */
	@numberAttribute(360) arc = 360

	override _createComponent() {
		const outerDiameter = this.element.calculatedSize.x
		const outerRadius = outerDiameter / 2
		const {tubeThickness, radialSegments, tubularSegments, arc} = this
		const literalThickness = tubeThickness * outerDiameter
		const radius = outerRadius - literalThickness / 2

		return new TorusGeometry(radius, literalThickness, radialSegments, tubularSegments, toRadians(arc))
	}
}

if (!elementBehaviors.has('torus-geometry')) elementBehaviors.define('torus-geometry', TorusGeometryBehavior)
