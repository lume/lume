import {Mesh, MeshAttributes} from './Mesh.js'

import type {PhongMaterialBehavior, PhongMaterialBehaviorAttributes} from '../html/index.js'

export type PlaneAttributes = MeshAttributes

export class Plane extends Mesh {
	static defaultElementName = 'lume-plane'

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
