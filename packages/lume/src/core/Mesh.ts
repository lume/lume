import {Mesh as ThreeMesh} from 'three/src/objects/Mesh.js'
import {autorun, booleanAttribute, element} from '@lume/element'
import {emits} from '@lume/eventful'
import Node from './Node.js'

import type {Material} from 'three/src/materials/Material.js'
import type {NodeAttributes} from './Node.js'

// register behaviors that can be used on this element
// TODO: maybe useDefaultNames() should register these, otherwise the user can
// choose names for better flexibility. See TODO NAMING below.
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

// TODO:
// - [ ] API for registering new behaviors as they pertain to our API, built on
//   top of element-behaviors. Or maybe, we just allow people to use
//   elementBehaviors directly, and thus we're done (just make sure they know
//   what classes to use).

export type MeshAttributes = NodeAttributes | 'castShadow' | 'receiveShadow'

@element
export default class Mesh extends Node {
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

	protected _loadGL() {
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

export {Mesh}

import type {ElementAttributes} from '@lume/element'

declare module '@lume/element' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-mesh': ElementAttributes<Mesh, MeshAttributes>
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'lume-mesh': Mesh
	}
}
