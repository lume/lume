import {element} from '@lume/element'
import {Mesh, MeshAttributes} from './Mesh.js'
import {autoDefineElements} from '../LumeConfig.js'

export type PlaneAttributes = MeshAttributes

@element('lume-plane', autoDefineElements)
export class Plane extends Mesh {
	static defaultBehaviors = {
		'plane-geometry': (initialBehaviors: string[]) => {
			return !initialBehaviors.some(b => b.endsWith('-geometry'))
		},
		'phong-material': (initialBehaviors: string[]) => {
			return !initialBehaviors.some(b => b.endsWith('-material'))
		},
	}
}

import type {ElementAttributes} from '@lume/element'
import type {
	PhongMaterialBehavior,
	PhongMaterialBehaviorAttributes,
} from '../behaviors/materials/PhongMaterialBehavior.js'

declare module '@lume/element' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-plane': ElementAttributes<
				Plane,
				PlaneAttributes,
				ElementAttributes<PhongMaterialBehavior, PhongMaterialBehaviorAttributes>
			>
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'lume-plane': Plane
	}
}
