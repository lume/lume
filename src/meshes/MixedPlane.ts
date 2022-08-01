import {element} from '@lume/element'
import {Mesh, MeshAttributes} from './Mesh.js'
import {autoDefineElements} from '../LumeConfig.js'

// TODO We need attributes from behaviors too.
export type MixedPlaneAttributes = MeshAttributes

/** See MixedPlaneGeometryBehavior and MixedPlaneMaterialBehavior for available properties. */
@element('lume-mixed-plane', autoDefineElements)
export class MixedPlane extends Mesh {
	static override defaultBehaviors = {
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

	// This property is observed by MaterialBehavior
	// 0.3 gives mixed planes a nice default for viewing DOM content behind.
	override materialOpacity = 0.3
}

declare module '@lume/element' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-mixed-plane': JSX.IntrinsicElements['lume-mesh']
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'lume-mixed-plane': MixedPlane
	}
}
