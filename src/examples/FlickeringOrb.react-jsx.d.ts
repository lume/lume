import type {FlickeringOrb, FlickeringOrbAttributes} from './FlickeringOrb'
import type {ReactElementAttributes} from '@lume/element/src/react'

// React users can import this to have appropriate types for the element in their JSX markup.
declare module 'react' {
	namespace JSX {
		interface IntrinsicElements {
			'flickering-orb': ReactElementAttributes<FlickeringOrb, FlickeringOrbAttributes>
		}
	}
}
