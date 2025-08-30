import {stringAttribute, element} from '@lume/element'
import {MeshLambertMaterial} from 'three/src/materials/MeshLambertMaterial.js'
import {MaterialBehavior, type MaterialBehaviorAttributes} from './MaterialBehavior.js'
import {autoDefineElements} from '../../LumeConfig.js'

export type LambertMaterialBehaviorAttributes = MaterialBehaviorAttributes | 'texture' | 'specularMap'

/**
 * @class LambertMaterialBehavior -
 *
 * Element: `lambert-material`
 * 
 * The `lambert-material` behavior gives any mesh a [Lambertian lighting model](https://en.wikipedia.org/wiki/Lambertian_reflectance)
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
 * @extends MaterialBehavior
 * @element lambert-material
 */
export
@element('lambert-material', autoDefineElements)
class LambertMaterialBehavior extends MaterialBehavior {
	@stringAttribute texture = ''
	@stringAttribute specularMap = ''

	override _createComponent() {
		return new MeshLambertMaterial({color: 0x00ff00})
	}

	override connectedCallback() {
		super.connectedCallback()

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