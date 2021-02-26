import {element} from '@lume/element'
import {Points as ThreePoints} from 'three/src/objects/Points.js'
import {Node} from './Node.js'
import {autoDefineElements} from '../LumeConfig.js'

import type {NodeAttributes} from './Node.js'

// register behaviors that can be used on this element
import '../html/behaviors/BasicMaterialBehavior.js'
import '../html/behaviors/PhongMaterialBehavior.js'
import '../html/behaviors/ShaderMaterialBehavior.js'
import '../html/behaviors/DOMNodeMaterialBehavior.js'
import '../html/behaviors/BoxGeometryBehavior.js'
import '../html/behaviors/SphereGeometryBehavior.js'
import '../html/behaviors/PlaneGeometryBehavior.js'
import '../html/behaviors/DOMNodeGeometryBehavior.js'
import '../html/behaviors/RoundedRectangleGeometryBehavior.js'
import '../html/behaviors/PLYGeometryBehavior.js'

export type PointsAttributes = NodeAttributes

@element('lume-points', autoDefineElements)
export class Points extends Node {
	static defaultBehaviors: {[k: string]: any} = {
		'box-geometry': (initialBehaviors: any) => {
			return !initialBehaviors.some((b: any) => b.endsWith('-geometry'))
		},
		// TODO replace this with a new default points-material
		// (PointsMaterialBehavior that uses THREE.PointsMaterial), which
		// includes features like point size attenuation, etc.
		'phong-material': (initialBehaviors: any) => {
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
