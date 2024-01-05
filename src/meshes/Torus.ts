import {element, type ElementAttributes} from '@lume/element'
import {Mesh} from './Mesh.js'
import {autoDefineElements} from '../LumeConfig.js'
import type {MeshAttributes} from './Mesh.js'
import type {ElementWithBehaviors, TorusGeometryBehavior, TorusGeometryBehaviorAttributes} from '../behaviors/index.js'

export type TorusAttributes = MeshAttributes | TorusGeometryBehaviorAttributes

/**
 * @class Torus -
 *
 * Element: `<lume-torus>`
 *
 * Extends from `Mesh` to apply default behaviors of
 * [`torus-geometry`](../behaviors/mesh-behaviors/geometries/TorusGeometryBehavior)
 * and
 * [`phong-material`](../behaviors/mesh-behaviors/materials/PhongMaterialBehavior).
 *
 * @extends Mesh
 */
export
@element('lume-torus', autoDefineElements)
class Torus extends Mesh {
	override initialBehaviors = {geometry: 'torus', material: 'physical'}
}

export interface Torus extends ElementWithBehaviors<TorusGeometryBehavior, TorusGeometryBehaviorAttributes> {}

declare module 'solid-js' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-torus': ElementAttributes<Torus, TorusAttributes>
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'lume-torus': Torus
	}
}
