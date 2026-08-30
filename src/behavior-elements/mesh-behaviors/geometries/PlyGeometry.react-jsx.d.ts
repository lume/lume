import type {PlyGeometry, PlyGeometryAttributes} from './PlyGeometry'
import type {ReactElementAttributes} from '@lume/element/src/react'

// React users can import this to have appropriate types for the element in their JSX markup.
declare global {
	namespace JSX {
		interface IntrinsicElements {
			'lume-ply-geometry': ReactElementAttributes<PlyGeometry, PlyGeometryAttributes>
		}
	}
}
