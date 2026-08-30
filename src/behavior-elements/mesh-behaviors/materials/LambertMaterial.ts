import {stringAttribute, element, type ElementAttributes} from '@lume/element'
import {MeshLambertMaterial} from 'three/src/materials/MeshLambertMaterial.js'
import {MaterialBehaviorEl, type MaterialBehaviorElAttributes} from './MaterialBehaviorEl.js'
import {autoDefineElements} from '../../../LumeConfig.js'

export type LambertMaterialAttributes = MaterialBehaviorElAttributes | 'texture' | 'specularMap'

/**
 * @class LambertMaterial -
 *
 * Element: `<lume-lambert-material>`
 *
 * The `lume-lambert-material` behavior gives any mesh a [Lambertian lighting model](https://en.wikipedia.org/wiki/Lambertian_reflectance)
 * for its material. It uses a
 * [THREE.MeshLambertMaterial](https://threejs.org/docs/index.html?q=lambert#api/en/materials/MeshLambertMaterial) under the hood.
 *
 * ## Example
 *
 * <live-code id="liveExample"></live-code>
 * <script>
 *   liveExample.content = meshExample({material: 'lambert', color: 'skyblue'})
 * </script>
 *
 * @extends MaterialBehaviorEl
 * @element lume-lambert-material
 */
export
@element('lume-lambert-material', autoDefineElements)
class LambertMaterial extends MaterialBehaviorEl {
	@stringAttribute texture = ''
	@stringAttribute specularMap = ''

	override _createComponent() {
		return new MeshLambertMaterial({color: 0x00ff00})
	}

	protected override _parentDefinedEffect(parent: NonNullable<this['composedParent']> = this.composedParent!) {
		super._parentDefinedEffect(parent)

		this._handleTexture(
			() => this.texture,
			(mat, tex) => (mat.map = tex),
			mat => !!mat.map,
			() => {},
			true,
		)
		this._handleTexture(
			() => this.specularMap,
			(mat, tex) => (mat.specularMap = tex),
			mat => !!mat.specularMap,
			() => {},
			true,
		)
	}
}

declare module 'solid-js' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-lambert-material': ElementAttributes<LambertMaterial, LambertMaterialAttributes>
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'lume-lambert-material': LambertMaterial
	}
}
