import {Mesh as ThreeMesh} from 'three/src/objects/Mesh'
import {autorun, booleanAttribute, element} from '@lume/element'
import {emits} from '@lume/eventful'
import Node from './Node'

import type {Material} from 'three/src/materials/Material'

// register behaviors that can be used on this element
// TODO: maybe useDefaultNames() should register these, otherwise the user can
// choose names for better flexibility. See TODO NAMING below.
import '../html/behaviors/BasicMaterialBehavior'
import '../html/behaviors/PhongMaterialBehavior'
import '../html/behaviors/ShaderMaterialBehavior'
import '../html/behaviors/DOMNodeMaterialBehavior'
import '../html/behaviors/BoxGeometryBehavior'
import '../html/behaviors/SphereGeometryBehavior'
import '../html/behaviors/PlaneGeometryBehavior'
import '../html/behaviors/DOMNodeGeometryBehavior'
import '../html/behaviors/RoundedRectangleGeometryBehavior'

// TODO:
// - [ ] API for registering new behaviors as they pertain to our API, built on top
//   of element-behaviors.

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
