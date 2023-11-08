import {element} from '@lume/element'
import {Mesh, type MeshAttributes} from './Mesh.js'
import {autoDefineElements} from '../LumeConfig.js'

export type RoundedRectangleAttributes = MeshAttributes

export {RoundedRectangle}
@element('lume-rounded-rectangle', autoDefineElements)
class RoundedRectangle extends Mesh {
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

// CONTINUE export was removed from this statement, but still kept on the above
// class. Does the type still work?
interface RoundedRectangle
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
