import type {FlickeringOrbs, FlickeringOrbsAttributes} from './FlickeringOrbs'
import type {ReactElementAttributes} from '@lume/element'

// React users can import this to have appropriate types for the element in their JSX markup.
declare global {
	namespace JSX {
		interface IntrinsicElements {
			'flickering-orbs': ReactElementAttributes<FlickeringOrbs, FlickeringOrbsAttributes>
		}
	}
}
