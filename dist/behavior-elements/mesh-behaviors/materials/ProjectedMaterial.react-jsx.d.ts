import type {ProjectedMaterial, ProjectedMaterialAttributes} from './ProjectedMaterial'
import type {ReactElementAttributes} from '@lume/element/src/react'

// React users can import this to have appropriate types for the element in their JSX markup.
declare global {
	namespace JSX {
		interface IntrinsicElements {
			'lume-projected-material': ReactElementAttributes<ProjectedMaterial, ProjectedMaterialAttributes>
		}
	}
}
