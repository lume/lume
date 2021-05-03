import type {Points, PointsAttributes} from './Points'
import type {ReactElementAttributes} from '@lume/element'
import type {PhongMaterialBehavior, PhongMaterialBehaviorAttributes} from '../behaviors/materials/PhongMaterialBehavior'

// React users can import this to have appropriate types for the element in their JSX markup.
declare global {
	namespace JSX {
		interface IntrinsicElements {
			'lume-points': ReactElementAttributes<Points, PointsAttributes> &
				ReactElementAttributes<PhongMaterialBehavior, PhongMaterialBehaviorAttributes>
		}
	}
}
