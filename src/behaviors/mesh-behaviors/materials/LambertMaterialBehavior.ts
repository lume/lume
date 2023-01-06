import {stringAttribute, reactive} from '../../attribute.js'
import 'element-behaviors'
import {MeshLambertMaterial} from 'three/src/materials/MeshLambertMaterial.js'
import {MaterialBehavior, MaterialBehaviorAttributes} from './MaterialBehavior.js'

export type LambertMaterialBehaviorAttributes = MaterialBehaviorAttributes | 'texture' | 'specularMap'

/**
 * @behavior lambert-material
 * @class LambertMaterialBehavior -
 * The `lambert-material` behavior gives any mesh a [Lambertian lighting model](https://en.wikipedia.org/wiki/Lambertian_reflectance)
 * for its material. It uses a
 * [THREE.MeshLambertMaterial](https://threejs.org/docs/index.html?q=lambert#api/en/materials/MeshLambertMaterial) under the hood.
 *
 * ## Example
 *
 * <div id="example"></div>
 *
 * <script type="application/javascript">
 *   new Vue({
 *     el: '#example',
 *     template: '<live-code :template="code" mode="html>iframe" :debounce="200" />',
 *     data: { code: meshExample({material: 'lambert', color: 'skyblue'}) },
 *   })
 * </script>
 *
 * @extends MaterialBehavior
 */
@reactive
export class LambertMaterialBehavior extends MaterialBehavior {
	@stringAttribute('') texture = ''
	@stringAttribute('') specularMap = ''

	override _createComponent() {
		return new MeshLambertMaterial({color: 0x00ff00})
	}

	override loadGL() {
		super.loadGL()

		this._handleTexture(
			() => this.texture,
			(mat, tex) => (mat.map = tex),
			mat => !!mat.map,
		)
		this._handleTexture(
			() => this.specularMap,
			(mat, tex) => (mat.specularMap = tex),
			mat => !!mat.specularMap,
		)
	}
}

if (globalThis.window?.document && !elementBehaviors.has('lambert-material'))
	elementBehaviors.define('lambert-material', LambertMaterialBehavior)
