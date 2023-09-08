import type {ReactElementAttributes} from '@lume/element/src/react'
import type {ShapeGeometryBehavior, ShapeGeometryBehaviorAttributes} from '../index'
import type {} from './Mesh.react-jsx'

// React users can import this to have appropriate types for the element in their JSX markup.
declare global {
	namespace JSX {
		interface IntrinsicElements {
			'lume-shape': JSX.IntrinsicElements['lume-mesh'] &
				ReactElementAttributes<ShapeGeometryBehavior, ShapeGeometryBehaviorAttributes>
		}
	}
}
