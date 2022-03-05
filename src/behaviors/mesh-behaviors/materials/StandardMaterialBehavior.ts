import 'element-behaviors'
import {MeshStandardMaterial} from 'three/src/materials/MeshStandardMaterial.js'
import {booleanAttribute, numberAttribute, reactive, stringAttribute} from '../../attribute.js'
import {MaterialBehavior, MaterialBehaviorAttributes} from './MaterialBehavior.js'

export type StandardMaterialBehaviorAttributes =
	| MaterialBehaviorAttributes
	| 'bumpMap'
	| 'bumpScale'
	| 'texture' // map
	| 'normalMap'
	| 'normalScale'
	| 'metalness'
	| 'morphNormals'
	| 'morphTargets'
	| 'roughness'
	| 'roughnessMap'
	| 'vertexTangents'

@reactive
export class StandardMaterialBehavior extends MaterialBehavior {
	// TODO

	// alphaMap?: Texture | null;
	// aoMap?: Texture | null;
	// @numberAttribute(1) aoMapIntensity?: number
	@stringAttribute('') bumpMap = ''
	@numberAttribute(1) bumpScale = 1
	// displacementMap?: Texture | null;
	// @numberAttribute(1) displacementScale?: number
	// @numberAttribute(1) displacementBias?: number
	// emissive?: Color | string | number;
	// envMap?: Texture | null;
	// @numberAttribute(1) envMapIntensity?: number
	// @numberAttribute(1) emissiveIntensity?: number
	// emissiveMap?: Texture | null;
	// lightMap?: Texture | null;
	// @numberAttribute(1) lightMapIntensity?: number
	@stringAttribute('') texture = '' // map
	@stringAttribute('') normalMap = ''
	// normalMapType
	@numberAttribute(1) normalScale = 1
	@numberAttribute(0) metalness = 0
	// metalnessMap?: Texture | null;
	// @numberAttribute(1) refractionRatio?: number
	@numberAttribute(1) roughness = 1
	@stringAttribute('') roughnessMap = ''

	// wireframe?: boolean

	// @numberAttribute(1) wireframeLinewidth?: number // Not supported because the WebGL line width is always 1.

	// @booleanAttribute(false) skinning: boolean = false
	@booleanAttribute(false) vertexTangents: boolean = false
	@booleanAttribute(false) morphTargets: boolean = false
	@booleanAttribute(false) morphNormals: boolean = false

	_createComponent() {
		return new MeshStandardMaterial()
	}

	loadGL() {
		super.loadGL()

		const mat = this.meshComponent!

		this.createEffect(() => {
			mat.bumpScale = this.bumpScale
			mat.normalScale.set(this.normalScale, this.normalScale)
			mat.metalness = this.metalness
			mat.morphNormals = this.morphNormals
			mat.morphTargets = this.morphTargets
			mat.roughness = this.roughness
			mat.vertexTangents = this.vertexTangents

			// TODO Needed?
			// mat.needsUpdate = true

			this.element.needsUpdate()
		})

		this._handleTexture(
			() => this.bumpMap,
			tex => (mat.bumpMap = tex),
		)
		this._handleTexture(
			() => this.texture, // map
			tex => (mat.map = tex),
		)
		this._handleTexture(
			() => this.normalMap,
			tex => (mat.normalMap = tex),
		)
		this._handleTexture(
			() => this.roughnessMap,
			tex => (mat.roughnessMap = tex),
		)
	}
}

if (!elementBehaviors.has('standard-material')) elementBehaviors.define('standard-material', StandardMaterialBehavior)

// This prevents errors with mixins. https://discord.com/channels/508357248330760243/508357248330760249/954526657312604180
export type MixinBaseClass<T> = T extends new (..._: any) => infer I
	? {[K in keyof T]: T[K]} & (new (...args: any[]) => I)
	: new (...args: any[]) => T
