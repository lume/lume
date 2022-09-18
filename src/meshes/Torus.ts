import {element} from '@lume/element'
import {Mesh} from './Mesh.js'
import {autoDefineElements} from '../LumeConfig.js'

import type {MeshAttributes} from './Mesh.js'

export type TorusAttributes = MeshAttributes

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
export {Torus}
@element('lume-torus', autoDefineElements)
class Torus extends Mesh {
	static override defaultBehaviors = {
		'torus-geometry': (initialBehaviors: any) => {
			return !initialBehaviors.some((b: any) => b.endsWith('-geometry'))
		},
		'phong-material': (initialBehaviors: any) => {
			return !initialBehaviors.some((b: any) => b.endsWith('-material'))
		},
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'lume-torus': Torus
	}
}

declare module 'solid-js' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-torus': JSX.IntrinsicElements['lume-mesh']
		}
	}
}
