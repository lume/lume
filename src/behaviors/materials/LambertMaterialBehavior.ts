import 'element-behaviors'
import {MeshLambertMaterial} from 'three/src/materials/MeshLambertMaterial.js'
import {MaterialBehavior, MaterialBehaviorAttributes} from './MaterialBehavior.js'
import {MaterialTexture, MaterialTextureAttributes} from './MaterialTexture.js'

export type LambertMaterialBehaviorAttributes = MaterialTextureAttributes | MaterialBehaviorAttributes

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
 * @extends MaterialTexture
 * @extends MaterialBehavior
 */
export class LambertMaterialBehavior extends MaterialTexture(MaterialBehavior) {
	_createComponent() {
		return new MeshLambertMaterial({color: 0x00ff00})
	}
}

if (!elementBehaviors.has('lambert-material')) elementBehaviors.define('lambert-material', LambertMaterialBehavior)
