import type {ColladaModel, ColladaModelAttributes} from './ColladaModel'
import type {ColladaModelBehavior, ColladaModelBehaviorAttributes} from '../behaviors/models/ColladaModelBehavior'
import type {ReactElementAttributes} from '@lume/element/src/react'

// React users can import this to have appropriate types for the element in their JSX markup.
declare global {
	namespace JSX {
		interface IntrinsicElements {
			'lume-collada-model': ReactElementAttributes<ColladaModel, ColladaModelAttributes> &
				ReactElementAttributes<ColladaModelBehavior, ColladaModelBehaviorAttributes>
		}
	}
}
