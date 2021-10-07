import type {Mesh, MeshAttributes} from './Mesh'
import type {ReactElementAttributes} from '@lume/element'
import type {PhongMaterialBehavior, PhongMaterialBehaviorAttributes} from '../behaviors/materials/PhongMaterialBehavior'
import type {
	LambertMaterialBehavior,
	LambertMaterialBehaviorAttributes,
} from '../behaviors/materials/LambertMaterialBehavior'

// React users can import this to have appropriate types for the element in their JSX markup.
declare global {
	namespace JSX {
		interface IntrinsicElements {
			'lume-mesh': ReactElementAttributes<Mesh, MeshAttributes> &
				ReactElementAttributes<PhongMaterialBehavior, PhongMaterialBehaviorAttributes> &
				ReactElementAttributes<LambertMaterialBehavior, LambertMaterialBehaviorAttributes>
		}
	}
}
