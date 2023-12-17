import {element} from '@lume/element'
import {Mesh, type MeshAttributes} from './Mesh.js'
import {autoDefineElements} from '../LumeConfig.js'

export type SphereAttributes = MeshAttributes

/**
 * @class Sphere -
 *
 * Element: `<lume-sphere>`
 *
 * Extends from `Mesh` to apply default behaviors of
 * [`sphere-geometry`](../behaviors/mesh-behaviors/geometries/SphereGeometryBehavior)
 * and
 * [`phong-material`](../behaviors/mesh-behaviors/materials/PhongMaterialBehavior).
 *
 * The diameter of the sphere is determined by the `x` size of the element.
 *
 * @extends Mesh
 */
export
@element('lume-sphere', autoDefineElements)
class Sphere extends Mesh {
	override initialBehaviors = {geometry: 'sphere', material: 'physical'}
}

declare global {
	interface HTMLElementTagNameMap {
		'lume-sphere': Sphere
	}
}

declare module 'solid-js' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-sphere': JSX.IntrinsicElements['lume-mesh']
		}
	}
}
