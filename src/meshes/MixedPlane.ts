import {Mesh, MeshAttributes} from './Mesh.js'

// TODO We need attributes from behaviors too.
export type MixedPlaneAttributes = MeshAttributes

/** See MixedPlaneGeometryBehavior and MixedPlaneMaterialBehavior for available properties. */
export class MixedPlane extends Mesh {
	static defaultElementName = 'lume-mixed-plane'

	static defaultBehaviors = {
		'mixedplane-geometry': (initialBehaviors: any) => {
			return !initialBehaviors.some((b: any) => b.endsWith('-geometry'))
		},
		'mixedplane-material': (initialBehaviors: any) => {
			return !initialBehaviors.some((b: any) => b.endsWith('-material'))
		},
	}

	get isMixedPlane() {
		return true
	}
}

import type {ElementAttributes} from '@lume/element'
import type {
	PhongMaterialBehavior,
	PhongMaterialBehaviorAttributes,
} from '../behaviors/materials/PhongMaterialBehavior.js'

declare module '@lume/element' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-mixed-plane': ElementAttributes<
				MixedPlane,
				MixedPlaneAttributes,
				ElementAttributes<PhongMaterialBehavior, PhongMaterialBehaviorAttributes>
			>
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'lume-mixed-plane': MixedPlane
	}
}
