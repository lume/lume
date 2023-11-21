import { SpotLight as ThreeSpotLight } from 'three/src/lights/SpotLight.js';
import { PointLight, type PointLightAttributes } from './PointLight.js';
import { Element3D } from '../core/index.js';
export type SpotLightAttributes = PointLightAttributes;
/**
 * @element lume-spot-light
 * @class SpotLight -
 *
 * Element: `<lume-spot-light>`
 *
 * This emits light from a single point in one direction along a cone shape that increases in size the further the light goes.
 *
 * This creates light that frays outward as it travels in a particular
 * direction, just like a real-life spot light, unlike a point light that emits
 * light in all directions.
 *
 * ## Example
 *
 * <div id="example"></div>
 *
 * <script type="application/javascript">
 *   new Vue({
 *     el: '#example',
 *     template: '<live-code :template="code" mode="html>iframe" :debounce="200" />',
 *     data: { code: spotLightExample() },
 *   })
 * </script>
 *
 * @extends PointLight
 */
export declare class SpotLight extends PointLight {
    #private;
    /**
     * @property {number} angle -
     *
     * `attribute`
     *
     * Default: `60`
     *
     * The angle of the cone shape in which light propagates. Should be no more
     * than 90. This value affects the fov of the light's shadow camera
     */
    angle: number;
    /**
     * @property {number} penumbra -
     *
     * `attribute`
     *
     * Default: `1`
     *
     * The value should be between 0 and 1.
     *
     * The percent of the spotlight cone that is attenuated due to a
     * [penumbra](https://en.wikipedia.org/wiki/Umbra,_penumbra_and_antumbra#Penumbra).
     * To give the edge of the spotlight's oval a soft fadein from the edge of
     * the oval, increase this from 0. 1 means that the light fades in from the
     * oval edge all the way to the center, 0.5 means the light is faded in at
     * half way to the center, and 0 means that there is no fade in which gives
     * the oval a sharp/crisp outline.
     */
    penumbra: number;
    get target(): Element3D | null;
    set target(value: string | Element3D | null | Array<Element3D | string>);
    debug: boolean;
    updateWorldMatrices(traverse?: boolean): void;
    _loadGL(): boolean;
    _unloadGL(): boolean;
    makeThreeObject3d(): ThreeSpotLight;
}
import type { ElementAttributes } from '@lume/element';
declare module 'solid-js' {
    namespace JSX {
        interface IntrinsicElements {
            'lume-spot-light': ElementAttributes<SpotLight, SpotLightAttributes>;
        }
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'lume-spot-light': SpotLight;
    }
}
//# sourceMappingURL=SpotLight.d.ts.map