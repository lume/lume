import { DirectionalLight as ThreeDirectionalLight } from 'three/src/lights/DirectionalLight.js';
import { LightWithShadow, type LightWithShadowAttributes } from './LightWithShadow.js';
export type DirectionalLightAttributes = LightWithShadowAttributes | 'shadowCameraTop' | 'shadowCameraRight' | 'shadowCameraBottom' | 'shadowCameraLeft';
/**
 * @element lume-directional-light
 * @class DirectionalLight -
 *
 * Element: `<lume-directional-light>`
 *
 * This creates light with a particular direction all over the world. Think of
 * it like a point light infinitely (or very) far away, and the emitted light
 * rays are effectively all parallel. An example use case could be emulating
 * the sun, which is far enough away that on earth all the rays seem to be
 * parallel.
 *
 * The direction of the light is the direction from the light's
 * `position` to the world origin (the center of a scene's viewport).
 *
 * When casting shadows, an orthographic camera is used, and shadows are limited
 * to be within the ortho box specified by the `shadowCamera*` properties. While
 * light color affects all objects in a scene, only objects within the shadow
 * camera limits will be affects by shadows.
 *
 * ## Example
 *
 * <live-code id="liveExample"></live-code>
 * <script>
 *   liveExample.content = directionalLightExample()
 * </script>
 *
 * @extends LightWithShadow
 */
export declare class DirectionalLight extends LightWithShadow {
    /**
     * @property {number} intensity -
     *
     * `override` `attribute`
     *
     * Default: `1`
     *
     * The intensity of the light.
     *
     * The intensity of this element does not change behavior when [physically
     * correct lighting](../core/Scene#physicallycorrectlights) is enabled.
     */
    intensity: number;
    shadowCameraTop: number;
    shadowCameraRight: number;
    shadowCameraBottom: number;
    shadowCameraLeft: number;
    _loadGL(): boolean;
    makeThreeObject3d(): ThreeDirectionalLight;
}
import type { ElementAttributes } from '@lume/element';
declare module 'solid-js' {
    namespace JSX {
        interface IntrinsicElements {
            'lume-directional-light': ElementAttributes<DirectionalLight, DirectionalLightAttributes>;
        }
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'lume-directional-light': DirectionalLight;
    }
}
//# sourceMappingURL=DirectionalLight.d.ts.map