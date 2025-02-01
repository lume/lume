import type {ReactElementAttributes} from '@lume/element/src/react'
import type {InstancedMesh, InstancedMeshAttributes} from './InstancedMesh.js'

// React users can import this to have appropriate types for the element in their JSX markup.
declare module 'react' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-instanced-mesh': ReactElementAttributes<InstancedMesh, InstancedMeshAttributes>
		}
	}
}
