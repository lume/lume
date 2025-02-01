import type {ReactElementAttributes} from '@lume/element/src/react'
import type {Shape, ShapeAttributes} from '../index'

// React users can import this to have appropriate types for the element in their JSX markup.
declare module 'react' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-shape': ReactElementAttributes<Shape, ShapeAttributes>
		}
	}
}
