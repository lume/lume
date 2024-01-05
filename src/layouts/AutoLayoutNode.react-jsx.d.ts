import type {AutoLayoutNode, AutoLayoutNodeAttributes} from './AutoLayoutNode'
import type {ReactElementAttributes} from '@lume/element/src/react'

// React users can import this to have appropriate types for the element in their JSX markup.
declare global {
	namespace JSX {
		interface IntrinsicElements {
			/**
			 * @deprecated `AutoLayoutNode` and `<lume-autolayout-node>` have been renamed
			 * to [`Autolayout`](./Autolayout) and `<lume-autolayout>`.
			 */
			'lume-autolayout-node': ReactElementAttributes<AutoLayoutNode, AutoLayoutNodeAttributes>
		}
	}
}
