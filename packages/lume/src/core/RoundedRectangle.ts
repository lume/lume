import {Mesh, MeshAttributes} from './Mesh.js'

import type {PhongMaterialBehavior, PhongMaterialBehaviorAttributes} from '../html/index.js'

export type RoundedRectangleAttributes = MeshAttributes

export default class RoundedRectangle extends Mesh {
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

export {RoundedRectangle}

import type {ElementAttributes} from '@lume/element'

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
