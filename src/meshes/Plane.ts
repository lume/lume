import {element} from '@lume/element'
import {Mesh, MeshAttributes} from './Mesh.js'
import {autoDefineElements} from '../LumeConfig.js'

export type PlaneAttributes = MeshAttributes

/**
 * @class Plane -
 *
 * Element: `<lume-plane>`
 *
 * Extends from `Mesh` to apply default behaviors of
 * [`plane-geometry`](../behaviors/mesh-behaviors/geometries/PlaneGeometryBehavior)
 * and
 * [`phong-material`](../behaviors/mesh-behaviors/materials/PhongMaterialBehavior).
 *
 * The dimensions of the plane are determined by the
 * [`size`](../core/Sizeable#size) of the element on `x` and `y`.
 *
 * @extends Mesh
 */
@element('lume-plane', autoDefineElements)
export class Plane extends Mesh {
	static override defaultBehaviors = {
		'plane-geometry': (initialBehaviors: string[]) => {
			return !initialBehaviors.some(b => b.endsWith('-geometry'))
		},
		'phong-material': (initialBehaviors: string[]) => {
			return !initialBehaviors.some(b => b.endsWith('-material'))
		},
	}
}

declare module '@lume/element' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-plane': JSX.IntrinsicElements['lume-mesh']
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'lume-plane': Plane
	}
}
