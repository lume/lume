import type {Torus, TorusAttributes} from './Torus'
import type {ReactElementAttributes} from '@lume/element/src/react'
import type {PhongMaterialBehavior, PhongMaterialBehaviorAttributes} from '../behaviors/index'

// React users can import this to have appropriate types for the element in their JSX markup.
declare global {
	namespace JSX {
		interface IntrinsicElements {
			'lume-torus': ReactElementAttributes<Torus, TorusAttributes> &
				ReactElementAttributes<PhongMaterialBehavior, PhongMaterialBehaviorAttributes>
		}
	}
}
