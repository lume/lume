import {element, type ElementAttributes} from '@lume/element'
import {Mesh, type MeshAttributes} from './Mesh.js'
import {autoDefineElements} from '../LumeConfig.js'
import type {ElementWithBehaviors} from '../behaviors/ElementWithBehaviors.js'
import type {RoundedRectangleGeometryBehavior, RoundedRectangleGeometryBehaviorAttributes} from '../behaviors/index.js'

export type RoundedRectangleAttributes = MeshAttributes | RoundedRectangleGeometryBehaviorAttributes

export
@element('lume-rounded-rectangle', autoDefineElements)
class RoundedRectangle extends Mesh {
	override initialBehaviors = {geometry: 'rounded-rectangle', material: 'physical'}
}

export interface RoundedRectangle
	extends ElementWithBehaviors<RoundedRectangleGeometryBehavior, RoundedRectangleGeometryBehaviorAttributes> {}

declare module 'solid-js' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-rounded-rectangle': ElementAttributes<RoundedRectangle, RoundedRectangleAttributes>
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'lume-rounded-rectangle': RoundedRectangle
	}
}
