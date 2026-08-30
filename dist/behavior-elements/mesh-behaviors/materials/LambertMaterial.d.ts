import { type ElementAttributes } from '@lume/element';
import { MeshLambertMaterial } from 'three/src/materials/MeshLambertMaterial.js';
import { MaterialBehaviorEl, type MaterialBehaviorElAttributes } from './MaterialBehaviorEl.js';
export type LambertMaterialAttributes = MaterialBehaviorElAttributes | 'texture' | 'specularMap';
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
export declare class LambertMaterial extends MaterialBehaviorEl {
    texture: string;
    specularMap: string;
    _createComponent(): MeshLambertMaterial;
    protected _parentDefinedEffect(parent?: NonNullable<this['composedParent']>): void;
}
declare module 'solid-js' {
    namespace JSX {
        interface IntrinsicElements {
            'lume-lambert-material': ElementAttributes<LambertMaterial, LambertMaterialAttributes>;
        }
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'lume-lambert-material': LambertMaterial;
    }
}
//# sourceMappingURL=LambertMaterial.d.ts.map