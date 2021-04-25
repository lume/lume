import {Mesh, MeshAttributes} from './Mesh.js'

// TODO Is this accurate? Or do we have different attributes from the behaviors?
export type DOMPlaneAttributes = MeshAttributes

/** See DOMNodeGeometryBehavior and DOMNodeMaterialBehavior for available properties. */
export class DOMPlane extends Mesh {
	static defaultElementName = 'lume-dom-plane'

	static defaultBehaviors = {
		'domnode-geometry': (initialBehaviors: any) => {
			return !initialBehaviors.some((b: any) => b.endsWith('-geometry'))
		},
		'domnode-material': (initialBehaviors: any) => {
			return !initialBehaviors.some((b: any) => b.endsWith('-material'))
		},
	}

	get isDOMNode() {
		return true
	}
}

import type {ElementAttributes} from '@lume/element'

declare module '@lume/element' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-dom-plane': ElementAttributes<DOMPlane, DOMPlaneAttributes>
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'lume-dom-plane': DOMPlane
	}
}
