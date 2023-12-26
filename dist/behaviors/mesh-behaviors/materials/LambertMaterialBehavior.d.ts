import 'element-behaviors';
import { MeshLambertMaterial } from 'three/src/materials/MeshLambertMaterial.js';
import { MaterialBehavior, type MaterialBehaviorAttributes } from './MaterialBehavior.js';
export type LambertMaterialBehaviorAttributes = MaterialBehaviorAttributes | 'texture' | 'specularMap';
/**
 * @behavior lambert-material
 * @class LambertMaterialBehavior -
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
 */
export declare class LambertMaterialBehavior extends MaterialBehavior {
    texture: string;
    specularMap: string;
    _createComponent(): MeshLambertMaterial;
    connectedCallback(): void;
}
//# sourceMappingURL=LambertMaterialBehavior.d.ts.map