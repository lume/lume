import type {Node, NodeAttributes} from './Node'
import type {ReactElementAttributes} from '@lume/element/src/react'

// React users can import this to have appropriate types for the element in their JSX markup.
declare module 'react' {
	namespace JSX {
		interface IntrinsicElements {
			/** @deprecated Use `<lume-element3d>` instead. */
			'lume-node': ReactElementAttributes<Node, NodeAttributes>
		}
	}
}
