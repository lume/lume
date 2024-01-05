import {element, type ElementAttributes} from '@lume/element'
import {Mesh} from './Mesh.js'
import {autoDefineElements} from '../LumeConfig.js'
import type {MeshAttributes} from './Mesh.js'

export type BoxAttributes = MeshAttributes

/**
 * @class Box -
 *
 * Element: `<lume-box>`
 *
 * Extends from `Mesh` to apply default behaviors of
 * [`box-geometry`](../behaviors/mesh-behaviors/geometries/SphereGeometryBehavior)
 * and
 * [`phong-material`](../behaviors/mesh-behaviors/materials/PhongMaterialBehavior).
 *
 * The dimensions of the box are determined by the
 * [`size`](../core/Sizeable#size) of the element.
 *
 * @extends Mesh
 */
export
@element('lume-box', autoDefineElements)
class Box extends Mesh {
	override initialBehaviors = {geometry: 'box', material: 'physical'}
}

declare module 'solid-js' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-box': ElementAttributes<Box, BoxAttributes>
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'lume-box': Box
	}
}
