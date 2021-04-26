import {element} from '@lume/element'
import {Points as ThreePoints} from 'three/src/objects/Points.js'
import {Node} from '../core/Node.js'
import {autoDefineElements} from '../LumeConfig.js'

// register behaviors that can be used on this element
import './mesh-behaviors.js'

import type {NodeAttributes} from '../core/Node.js'

export type PointsAttributes = NodeAttributes

@element('lume-points', autoDefineElements)
export class Points extends Node {
	static defaultBehaviors: {[k: string]: any} = {
		'box-geometry': (initialBehaviors: any) => {
			return !initialBehaviors.some((b: any) => b.endsWith('-geometry'))
		},
		'points-material': (initialBehaviors: any) => {
			return !initialBehaviors.some((b: any) => b.endsWith('-material'))
		},
	}

	makeThreeObject3d() {
		return new ThreePoints()
	}
}

import type {ElementAttributes} from '@lume/element'

declare module '@lume/element' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-points': ElementAttributes<Points, PointsAttributes>
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'lume-points': Points
	}
}
