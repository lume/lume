import {Mesh} from './Mesh.js'

import type {MeshAttributes} from './Mesh.js'

export type BoxAttributes = MeshAttributes

export class Box extends Mesh {
	static defaultElementName = 'lume-box'

	static defaultBehaviors = {
		'box-geometry': (initialBehaviors: any) => {
			return !initialBehaviors.some((b: any) => b.endsWith('-geometry'))
		},
		'phong-material': (initialBehaviors: any) => {
			return !initialBehaviors.some((b: any) => b.endsWith('-material'))
		},
	}
}

import type {ElementAttributes} from '@lume/element'

declare module '@lume/element' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-box': ElementAttributes<Box, BoxAttributes>
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'lume-box': Box
	}
}
