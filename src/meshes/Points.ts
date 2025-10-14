import {attribute, element, type ElementAttributes} from '@lume/element'
import html from 'solid-js/html'
import {Points as ThreePoints} from 'three/src/objects/Points.js'
import {Element3D} from '../core/Element3D.js'
import {autoDefineElements} from '../LumeConfig.js'
import type {Element3DAttributes} from '../core/Element3D.js'
import type {ElementWithBehaviors} from '../behaviors/ElementWithBehaviors.js'
import type {
	ClipPlanesBehavior,
	ClipPlanesBehaviorAttributes,
	LambertMaterialBehavior,
	LambertMaterialBehaviorAttributes,
	PhongMaterialBehavior,
	PhongMaterialBehaviorAttributes,
	PointsMaterialBehavior,
	PointsMaterialBehaviorAttributes,
} from '../behaviors/index.js'
import {Show} from 'solid-js'

export type PointsAttributes = Element3DAttributes

// CONTINUE update jsdoc comments to point to new behavior classes
/**
 * @class Points -
 *
 * Element: `<lume-points>`
 *
 * Applies default behaviors of
 * [`<box-geometry>`](../behaviors/mesh-behaviors/geometries/BoxGeometryBehavior)
 * and
 * [`<points-material>`](../behaviors/mesh-behaviors/materials/PhongMaterialBehavior).
 *
 * A `<lume-points>` element is similar to a `<lume-mesh>` element, except that
 * the `points-material` is used by default, which renders any geometry's
 * vertices as points instead of filled triangles.
 *
 * It can be useful to have
 * [`ply-geometry`](../behaviors/mesh-behaviors/geometries/PlyGeometryBehavior)
 * behavior on this element to load a set of points from a file for example.
 *
 * @extends Element3D
 */
export
@element('lume-points', autoDefineElements)
class Points extends Element3D {
	// override initialBehaviors = {geometry: 'box', material: 'points'}

	override hasShadow = true

	// Legacy behavior support: if the has attribute has values, disable the
	// behavior element slots, so that explicitly-defined legacy behaviors
	// continue to work and take precedence, for now.
	@attribute has = ''

	override template = () => html`
		<${Show} when=${!this.has}>
			<slot name="geometry">
				<box-geometry></box-geometry>
			</slot>

			<slot name="material">
				<points-material></points-material>
			</slot>
		</>

		<slot></slot>
	`

	override makeThreeObject3d() {
		return new ThreePoints()
	}
}

export interface Points extends ElementWithBehaviors<BehaviorInstanceTypes, BehaviorAttributes> {}

type BehaviorInstanceTypes = PointsMaterialBehavior &
	PhongMaterialBehavior &
	LambertMaterialBehavior &
	ClipPlanesBehavior

type BehaviorAttributes =
	| PointsMaterialBehaviorAttributes
	| PhongMaterialBehaviorAttributes
	| LambertMaterialBehaviorAttributes
	| ClipPlanesBehaviorAttributes

declare module 'solid-js' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-points': ElementAttributes<Points, PointsAttributes>
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'lume-points': Points
	}
}
