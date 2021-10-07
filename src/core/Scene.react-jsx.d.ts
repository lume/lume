import type {Scene, SceneAttributes} from './Scene'
import type {ReactElementAttributes} from '@lume/element'

// React users can import this to have appropriate types for the element in their JSX markup.
declare global {
	namespace JSX {
		interface IntrinsicElements {
			'lume-scene': ReactElementAttributes<Scene, SceneAttributes>
		}
	}
}
