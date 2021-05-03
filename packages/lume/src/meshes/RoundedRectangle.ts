import {Mesh, MeshAttributes} from './Mesh.js'

export type RoundedRectangleAttributes = MeshAttributes

export class RoundedRectangle extends Mesh {
	static defaultElementName = 'lume-rounded-rectangle'

	static defaultBehaviors = {
		'rounded-rectangle-geometry': (initialBehaviors: any) => {
			return !initialBehaviors.some((b: any) => b.endsWith('-geometry'))
		},
		'phong-material': (initialBehaviors: any) => {
			return !initialBehaviors.some((b: any) => b.endsWith('-material'))
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
			'lume-rounded-rectangle': ElementAttributes<
				RoundedRectangle,
				RoundedRectangleAttributes,
				ElementAttributes<PhongMaterialBehavior, PhongMaterialBehaviorAttributes>
			>
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'lume-rounded-rectangle': RoundedRectangle
	}
}
