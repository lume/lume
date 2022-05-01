import {element} from '@lume/element'
import {Mesh, MeshAttributes} from './Mesh.js'
import {autoDefineElements} from '../LumeConfig.js'

export type SphereAttributes = MeshAttributes

@element('lume-sphere', autoDefineElements)
export class Sphere extends Mesh {
	static override defaultBehaviors = {
		'sphere-geometry': (initialBehaviors: string[]) => {
			return !initialBehaviors.some(b => b.endsWith('-geometry'))
		},
		'phong-material': (initialBehaviors: string[]) => {
			return !initialBehaviors.some(b => b.endsWith('-material'))
		},
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'lume-sphere': Sphere
	}
}

declare module '@lume/element' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-sphere': JSX.IntrinsicElements['lume-mesh']
		}
	}
}
