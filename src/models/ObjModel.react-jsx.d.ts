import type {ObjModel, ObjModelAttributes} from './ObjModel'
import type {ReactElementAttributes} from '@lume/element'

// React users can import this to have appropriate types for the element in their JSX markup.
declare global {
	namespace JSX {
		interface IntrinsicElements {
			'lume-obj-model': ReactElementAttributes<ObjModel, ObjModelAttributes>
		}
	}
}
