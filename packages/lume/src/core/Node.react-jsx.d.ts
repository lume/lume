import type {Node, NodeAttributes} from './Node'
import type {ReactElementAttributes} from '@lume/element'
import type {} from './ImperativeBase.react-jsx'
import type * as React from 'react'

// React users can import this to have appropriate types for the element in their JSX markup.
declare global {
	namespace JSX {
		interface IntrinsicElements {
			'lume-node': ReactElementAttributes<Node, NodeAttributes>
		}
	}
}

// TODO move this to the elemet-behaviors package.
declare global {
	namespace React {
		// Attributes for all elements.
		interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
			has?: string
		}
	}
}
