import {element} from '@lume/element'
import {Mesh, type MeshAttributes} from './Mesh.js'
import {autoDefineElements} from '../LumeConfig.js'

export type RoundedRectangleAttributes = MeshAttributes

export
@element('lume-rounded-rectangle', autoDefineElements)
class RoundedRectangle extends Mesh {
	override initialBehaviors = {geometry: 'rounded-rectangle', material: 'physical'}
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

declare module 'solid-js' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-rounded-rectangle': JSX.IntrinsicElements['lume-mesh'] &
				ElementAttributes<RoundedRectangleGeometryBehavior, RoundedRectangleGeometryBehaviorAttributes>
		}
	}
}
