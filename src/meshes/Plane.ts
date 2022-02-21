import {element} from '@lume/element'
import {Mesh, MeshAttributes} from './Mesh.js'
import {autoDefineElements} from '../LumeConfig.js'

export type PlaneAttributes = MeshAttributes

@element('lume-plane', autoDefineElements)
export class Plane extends Mesh {
	static defaultBehaviors = {
		'plane-geometry': (initialBehaviors: string[]) => {
			return !initialBehaviors.some(b => b.endsWith('-geometry'))
		},
		'phong-material': (initialBehaviors: string[]) => {
			return !initialBehaviors.some(b => b.endsWith('-material'))
		},
	}
}

declare module '@lume/element' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-plane': JSX.IntrinsicElements['lume-mesh']
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'lume-plane': Plane
	}
}
