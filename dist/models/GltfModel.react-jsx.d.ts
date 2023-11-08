import type {GltfModel, GltfModelAttributes} from './GltfModel'
import type {ReactElementAttributes} from '@lume/element/src/react'

// React users can import this to have appropriate types for the element in their JSX markup.
declare global {
	namespace JSX {
		interface IntrinsicElements {
			'lume-gltf-model': ReactElementAttributes<GltfModel, GltfModelAttributes>
		}
	}
}
