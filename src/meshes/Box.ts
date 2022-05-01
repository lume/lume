import {element} from '@lume/element'
import {Mesh} from './Mesh.js'
import {autoDefineElements} from '../LumeConfig.js'

import type {MeshAttributes} from './Mesh.js'

export type BoxAttributes = MeshAttributes

@element('lume-box', autoDefineElements)
export class Box extends Mesh {
	static override defaultBehaviors = {
		'box-geometry': (initialBehaviors: any) => {
			return !initialBehaviors.some((b: any) => b.endsWith('-geometry'))
		},
		'phong-material': (initialBehaviors: any) => {
			return !initialBehaviors.some((b: any) => b.endsWith('-material'))
		},
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'lume-box': Box
	}
}

declare module '@lume/element' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-box': JSX.IntrinsicElements['lume-mesh']
		}
	}
}
