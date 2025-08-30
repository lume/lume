import {MeshStandardMaterial} from 'three/src/materials/MeshStandardMaterial.js'
import {booleanAttribute, numberAttribute, stringAttribute, element} from '@lume/element'
import {MaterialBehavior, type MaterialBehaviorAttributes} from './MaterialBehavior.js'
import {autoDefineElements} from '../../LumeConfig.js'

export type StandardMaterialBehaviorAttributes =
	| MaterialBehaviorAttributes
	| 'alphaMap'
	| 'aoMap'
	| 'aoMapIntensity'
	| 'bumpMap'
	| 'bumpScale'
	| 'displacementMap'
	| 'displacementScale'
	| 'displacementBias'
	| 'texture' // map
	| 'normalMap'
	| 'normalScale'
	| 'metalness'
	| 'metalnessMap'
	| 'morphNormals'
	| 'morphTargets'
	| 'roughness'
	| 'roughnessMap'
	| 'vertexTangents'

/**
 * @class StandardMaterialBehavior -
 *
 * Element: `standard-material`
 *
 * A standard physically based material, using Metallic-Roughness workflow.
 *
 * Backed by Three.js [`THREE.MeshStandardMaterial`](https://threejs.org/docs/index.html#api/en/materials/MeshStandardMaterial)
 *
 * @extends MaterialBehavior
 * @element standard-material
 */
export
@element('standard-material', autoDefineElements)
class StandardMaterialBehavior extends MaterialBehavior {
	@stringAttribute alphaMap = ''
	@stringAttribute aoMap = ''
	@numberAttribute aoMapIntensity = 1
	@stringAttribute bumpMap = ''
	@numberAttribute bumpScale = 1
	@stringAttribute displacementMap = ''
	@numberAttribute displacementScale = 1
	@numberAttribute displacementBias = 0
	@stringAttribute texture = '' // map
	@stringAttribute normalMap = ''
	@numberAttribute normalScale = 1
	@numberAttribute metalness = 0
	@stringAttribute metalnessMap = ''
	@numberAttribute roughness = 1
	@stringAttribute roughnessMap = ''
	@booleanAttribute vertexTangents: boolean = false
	@booleanAttribute morphTargets: boolean = false
	@booleanAttribute morphNormals: boolean = false

	override _createComponent() {
		return new MeshStandardMaterial()
	}

	override connectedCallback() {
		super.connectedCallback()

		this.createEffect(() => {
			const mat = this.meshComponent
			if (!mat) return

			mat.aoMapIntensity = this.aoMapIntensity
			mat.bumpScale = this.bumpScale
			mat.displacementScale = this.displacementScale
			mat.displacementBias = this.displacementBias
			mat.normalScale.set(this.normalScale, this.normalScale)
			mat.metalness = this.metalness
			mat.roughness = this.roughness

			this.parentElement?.needsUpdate()
		})

		this._handleTexture(
			() => this.alphaMap,
			(mat, tex) => (mat.alphaMap = tex),
			mat => !!mat.alphaMap,
		)
		this._handleTexture(
			() => this.aoMap,
			(mat, tex) => (mat.aoMap = tex),
			mat => !!mat.aoMap,
		)
		this._handleTexture(
			() => this.bumpMap,
			(mat, tex) => (mat.bumpMap = tex),
			mat => !!mat.bumpMap,
		)
		this._handleTexture(
			() => this.displacementMap,
			(mat, tex) => (mat.displacementMap = tex),
			mat => !!mat.displacementMap,
		)
		this._handleTexture(
			() => this.texture, // map
			(mat, tex) => (mat.map = tex),
			mat => !!mat.map,
			() => {},
			true,
		)
		this._handleTexture(
			() => this.normalMap,
			(mat, tex) => (mat.normalMap = tex),
			mat => !!mat.normalMap,
		)
		this._handleTexture(
			() => this.metalnessMap,
			(mat, tex) => (mat.metalnessMap = tex),
			mat => !!mat.metalnessMap,
		)
		this._handleTexture(
			() => this.roughnessMap,
			(mat, tex) => (mat.roughnessMap = tex),
			mat => !!mat.roughnessMap,
		)
	}
}