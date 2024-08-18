import type React from 'react'
import type {LoadingIcon} from './LoadingIcon'

// React users can import this to have appropriate types for the element in their JSX markup.
declare module 'react' {
	namespace JSX {
		interface IntrinsicElements {
			// LoadingIcon has no props currently, so this is how to provide the default set in React.
			'loading-icon': React.DetailedHTMLProps<React.HTMLAttributes<LoadingIcon>, LoadingIcon>
			// Otherwise use the following if we add props:
			// 'loading-icon': ReactElementAttributes<LoadingIcon, LoadingIconAttributes>
		}
	}
}
