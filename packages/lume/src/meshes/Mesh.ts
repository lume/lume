import {Mesh as ThreeMesh} from 'three/src/objects/Mesh.js'
import {autorun, booleanAttribute, element} from '@lume/element'
import {emits} from '@lume/eventful'
import {Node} from '../core/Node.js'

import type {Material} from 'three/src/materials/Material.js'
import type {NodeAttributes} from '../core/Node.js'

export type MeshAttributes = NodeAttributes | 'castShadow' | 'receiveShadow'

@element
export class Mesh extends Node {
	static defaultElementName = 'lume-mesh'

	// TODO NAMING: It would be neat to be able to return an array of classes
	// as well, so that it can be agnostic of the naming. Either way should
	// work.
	static defaultBehaviors: {[k: string]: any} = {
		'box-geometry': (initialBehaviors: any) => {
			return !initialBehaviors.some((b: any) => b.endsWith('-geometry'))
		},
		'phong-material': (initialBehaviors: any) => {
			return !initialBehaviors.some((b: any) => b.endsWith('-material'))
		},
	}

	@booleanAttribute(true) @emits('propertychange') castShadow = true
	@booleanAttribute(true) @emits('propertychange') receiveShadow = true

	_loadGL() {
		if (!super._loadGL()) return false

		this._glStopFns.push(
			autorun(() => {
				this.three.castShadow = this.castShadow
				this.needsUpdate()
			}),
			autorun(() => {
				this.three.receiveShadow = this.receiveShadow
				// TODO handle material arrays
				;(this.three.material as Material).needsUpdate = true
				this.needsUpdate()
			}),
		)

		return true
	}

	makeThreeObject3d() {
		return new ThreeMesh()
	}
}

import type {ElementAttributes} from '@lume/element'
import type {
	PhongMaterialBehavior,
	PhongMaterialBehaviorAttributes,
} from '../behaviors/materials/PhongMaterialBehavior.js'
import type {
	LambertMaterialBehavior,
	LambertMaterialBehaviorAttributes,
} from '../behaviors/materials/LambertMaterialBehavior'

declare module '@lume/element' {
	namespace JSX {
		interface IntrinsicElements {
			// TODO Can we improve ElementAttributes so we don't have to nest them when we want to mix more properties in?
			'lume-mesh': ElementAttributes<
				Mesh,
				MeshAttributes,
				ElementAttributes<
					PhongMaterialBehavior,
					PhongMaterialBehaviorAttributes,
					ElementAttributes<LambertMaterialBehavior, LambertMaterialBehaviorAttributes>
				>
			>
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'lume-mesh': Mesh
	}
}
