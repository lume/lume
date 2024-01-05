import type {Box, BoxAttributes} from './Box'
import type {ReactElementAttributes} from '@lume/element/src/react'

// React users can import this to have appropriate types for the element in their JSX markup.
declare global {
	namespace JSX {
		interface IntrinsicElements {
			'lume-box': ReactElementAttributes<Box, BoxAttributes>
		}
	}
}
