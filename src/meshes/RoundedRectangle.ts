import {element} from '@lume/element'
import {Mesh, MeshAttributes} from './Mesh.js'
import {autoDefineElements} from '../LumeConfig.js'

export type RoundedRectangleAttributes = MeshAttributes

@element('lume-rounded-rectangle', autoDefineElements)
export class RoundedRectangle extends Mesh {
	static override defaultBehaviors = {
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
	ElementWithBehaviors,
	RoundedRectangleGeometryBehavior,
	RoundedRectangleGeometryBehaviorAttributes,
} from '../index.js'

export interface RoundedRectangle
	extends ElementWithBehaviors<RoundedRectangleGeometryBehavior, RoundedRectangleGeometryBehaviorAttributes> {}

declare global {
	interface HTMLElementTagNameMap {
		'lume-rounded-rectangle': RoundedRectangle
	}
}

declare module '@lume/element' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-rounded-rectangle': JSX.IntrinsicElements['lume-mesh'] &
				ElementAttributes<RoundedRectangleGeometryBehavior, RoundedRectangleGeometryBehaviorAttributes>
		}
	}
}
