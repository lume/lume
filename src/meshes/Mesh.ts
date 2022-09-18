import {Mesh as ThreeMesh} from 'three/src/objects/Mesh.js'
import {/*attribute,*/ booleanAttribute, element} from '@lume/element'
import {Element3D} from '../core/Element3D.js'
import {autoDefineElements} from '../LumeConfig.js'

import type {Material} from 'three/src/materials/Material.js'
import type {Element3DAttributes} from '../core/Element3D.js'

export type MeshAttributes = Element3DAttributes | 'castShadow' | 'receiveShadow'

/**
 * @class Mesh -
 *
 * Element: `<lume-mesh>`
 *
 * An element that renders a particular 3D shape (geometry) along with a
 * particular style (material). This is a generic element with no particular
 * shape. Elements like `<lume-box>` extend from `Mesh` in order to set define
 * behaviors they ship with by default. For example a `<lume-box>` element
 * (backed by the [`Box`](./Box) class) extends from this `Mesh` class and
 * applies two default behaviors:
 * [`box-geometry`](../behaviors/mesh-behaviors/geometries/BoxGeometryBehavior)
 * and
 * [`phong-material`](../behaviors/mesh-behaviors/materials/PhongMaterialBehavior).
 *
 * For sake of simplicity, `<lume-mesh>` has a `box-geometry` and
 * `phong-material` by default, just like a `<lume-box>`.
 *
 * ## Example
 *
 * <div id="example"></div>
 *
 * <script type="application/javascript">
 *   new Vue({
 *     el: '#example',
 *     template: '<live-code :template="code" mode="html>iframe" :debounce="200" />',
 *     data: { code: meshExample() },
 *   })
 * </script>
 *
 * @extends Element3D
 * @element lume-mesh TODO @element jsdoc tag
 *
 */
@element('lume-mesh', autoDefineElements)
export class Mesh extends Element3D {
	// TODO NAMING: It would be neat to be able to return an array of classes
	// as well, so that it can be agnostic of the naming. Either way should
	// work.
	static override defaultBehaviors: {[k: string]: any} = {
		'box-geometry': (initialBehaviors: string[]) => {
			return !initialBehaviors.some(b => b.endsWith('-geometry'))
		},
		'phong-material': (initialBehaviors: string[]) => {
			return !initialBehaviors.some(b => b.endsWith('-material'))
		},
	}

	// TODO should these be here? Or via the ShaderMaterialBehavior behavior types?
	// @attribute uniforms?: string = ''
	// @attribute vertexShader?: string = ''
	// @attribute fragmentShader?: string = ''

	/**
	 * @property {boolean} castShadow
	 *
	 * `boolean` `attribute`
	 *
	 * Default: `true`
	 *
	 * When `true`, the mesh casts shadows onto other objects when under the
	 * presence of a light such as a
	 * [`<lume-point-light>`](../lights/PointLight).
	 */
	@booleanAttribute(true) castShadow = true

	/**
	 * @property {boolean} receiveShadow
	 *
	 * `boolean` `attribute`
	 *
	 * Default: `true`
	 *
	 * When `true`, the mesh receives shadows from other objects when under the
	 * presence of a light such as a
	 * [`<lume-point-light>`](../lights/PointLight).
	 */
	@booleanAttribute(true) receiveShadow = true

	override _loadGL() {
		if (!super._loadGL()) return false

		this.createGLEffect(() => {
			this.three.castShadow = this.castShadow
			this.needsUpdate()
		})

		this.createGLEffect(() => {
			this.three.receiveShadow = this.receiveShadow
			// TODO handle material arrays
			;(this.three.material as Material).needsUpdate = true
			this.needsUpdate()
		})

		return true
	}

	override makeThreeObject3d() {
		return new ThreeMesh()
	}
}

import type {ElementAttributes} from '@lume/element'
import type {
	PhongMaterialBehavior,
	PhongMaterialBehaviorAttributes,
	LambertMaterialBehavior,
	LambertMaterialBehaviorAttributes,
	ElementWithBehaviors,
	ClipPlanesBehavior,
	ClipPlanesBehaviorAttributes,
	PhysicalMaterialBehavior,
	PhysicalMaterialBehaviorAttributes,
	StandardMaterialBehavior,
	StandardMaterialBehaviorAttributes,
} from '../index.js'

type BehaviorInstanceTypes = PhongMaterialBehavior &
	LambertMaterialBehavior &
	StandardMaterialBehavior &
	PhysicalMaterialBehavior &
	ClipPlanesBehavior

type BehaviorAttributes =
	| PhongMaterialBehaviorAttributes
	| LambertMaterialBehaviorAttributes
	| StandardMaterialBehaviorAttributes
	| PhysicalMaterialBehaviorAttributes
	| ClipPlanesBehaviorAttributes

export interface Mesh extends ElementWithBehaviors<BehaviorInstanceTypes, BehaviorAttributes> {}

declare module '@lume/element' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-mesh': ElementAttributes<Mesh & BehaviorInstanceTypes, MeshAttributes | BehaviorAttributes>
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'lume-mesh': Mesh
	}
}
