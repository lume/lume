import type {MixedPlane, MixedPlaneAttributes} from './MixedPlane'
import type {ReactElementAttributes} from '@lume/element/src/react'
import type {
	PhongMaterialBehavior,
	PhongMaterialBehaviorAttributes,
} from '../behaviors/mesh-behaviors/materials/PhongMaterialBehavior'

// React users can import this to have appropriate types for the element in their JSX markup.
declare global {
	namespace JSX {
		interface IntrinsicElements {
			'lume-mixed-plane': ReactElementAttributes<MixedPlane, MixedPlaneAttributes> &
				ReactElementAttributes<PhongMaterialBehavior, PhongMaterialBehaviorAttributes>
		}
	}
}
