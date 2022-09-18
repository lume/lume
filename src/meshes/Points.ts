import {element} from '@lume/element'
import {Points as ThreePoints} from 'three/src/objects/Points.js'
import {Element3D} from '../core/Element3D.js'
import {autoDefineElements} from '../LumeConfig.js'

import type {Element3DAttributes} from '../core/Element3D.js'

export type PointsAttributes = Element3DAttributes

/**
 * @class Points -
 *
 * Element: `<lume-points>`
 *
 * Extends from `Mesh` to apply default behaviors of
 * [`box-geometry`](../behaviors/mesh-behaviors/geometries/BoxGeometryBehavior)
 * and
 * [`points-material`](../behaviors/mesh-behaviors/materials/PhongMaterialBehavior).
 *
 * A `<lume-points>` element is similar to a `<lume-mesh>` element, except that
 * the `points-material` is used by default, which renders any geometry's
 * verticies as points instead of filled triangles.
 *
 * It can be useful to have
 * [`ply-geometry`](../behaviors/mesh-behaviors/geometries/PlyGeometryBehavior)
 * behavior on this element to load a set of points from a file for example.
 *
 * @extends Mesh
 */
export {Points}
@element('lume-points', autoDefineElements)
class Points extends Element3D {
	static override defaultBehaviors: {[k: string]: any} = {
		'box-geometry': (initialBehaviors: any) => {
			return !initialBehaviors.some((b: any) => b.endsWith('-geometry'))
		},
		'points-material': (initialBehaviors: any) => {
			return !initialBehaviors.some((b: any) => b.endsWith('-material'))
		},
	}

	override makeThreeObject3d() {
		return new ThreePoints()
	}
}

import type {ElementAttributes} from '@lume/element'
import type {
	ElementWithBehaviors,
	LambertMaterialBehavior,
	LambertMaterialBehaviorAttributes,
	PhongMaterialBehavior,
	PhongMaterialBehaviorAttributes,
	PointsMaterialBehavior,
	PointsMaterialBehaviorAttributes,
} from '../index.js'

// CONTINUE export was removed from this statement, but still kept on the above
// class. Does the type still work?
interface Points
	extends ElementWithBehaviors<
		PointsMaterialBehavior & PhongMaterialBehavior & LambertMaterialBehavior,
		PointsMaterialBehaviorAttributes | PhongMaterialBehaviorAttributes | LambertMaterialBehaviorAttributes
	> {}

declare module 'solid-js' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-points': ElementAttributes<
				Points & PointsMaterialBehavior & PhongMaterialBehavior & LambertMaterialBehavior,
				| PointsAttributes
				| PointsMaterialBehaviorAttributes
				| PhongMaterialBehaviorAttributes
				| LambertMaterialBehaviorAttributes
			>
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'lume-points': Points
	}
}
