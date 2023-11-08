import type {Line, LineAttributes} from './Line'
import type {ReactElementAttributes} from '@lume/element/src/react'
import type {
	PhongMaterialBehavior,
	PhongMaterialBehaviorAttributes,
} from '../behaviors/mesh-behaviors/materials/PhongMaterialBehavior'
import type {
	LambertMaterialBehavior,
	LambertMaterialBehaviorAttributes,
} from '../behaviors/mesh-behaviors/materials/LambertMaterialBehavior'

// React users can import this to have appropriate types for the element in their JSX markup.
declare global {
	namespace JSX {
		interface IntrinsicElements {
			'lume-line': ReactElementAttributes<Line, LineAttributes> &
				ReactElementAttributes<PhongMaterialBehavior, PhongMaterialBehaviorAttributes> &
				ReactElementAttributes<LambertMaterialBehavior, LambertMaterialBehaviorAttributes>
		}
	}
}
