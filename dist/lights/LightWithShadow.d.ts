import { Light, type LightAttributes } from './Light.js';
export type LightWithShadowAttributes = LightAttributes | 'castShadow' | 'shadowMapWidth' | 'shadowMapHeight' | 'shadowRadius' | 'shadowBias' | 'shadowNormalBias' | 'shadowCameraNear' | 'shadowCameraFar';
/**
 * @abstract
 * @class LightWithShadow -
 *
 * `abstract`
 *
 * An abstract base class for light elements that can cast shadows, such as
 * [PointLight](./PointLight), [SpotLight](./SpotLight), and
 * [DirectionalLight](./DirectionalLight).
 *
 * Lights that can have shadows have a shadow camera for shadow projection. The
 * camera can be a perspective camera or an orthographic camera depending on the
 * type of light. The properties in this class are common for either type of
 * shadow camera.
 *
 * @extends Light
 */
export declare abstract class LightWithShadow extends Light {
    /**
     * @property {boolean} castShadow -
     *
     * `attribute`
     *
     * Default: `true`
     *
     * When `true` a light will cast dynamic shadows from objects that cast
     * shadow onto objects that receive shadow.
     *
     * Note: Lights are expensive (requires rendering the scene once per light),
     * and qill require adjustments to a light's shadow camera to get it right
     * and to avoid shadow on unnecessary objects. By default, all objects cast
     * and receive shadows, but it can be useful to turn off shadow features for
     * objects that don't need shadow features to get more performance (f.e. see
     * [`Mesh.castShadow`](../meshes/Mesh#castShadow) and
     * [`Mesh.receiveShadow`](../meshes/Mesh#receiveShadow)).
     */
    castShadow: boolean;
    /**
     * @property {number} shadowMapWidth -
     *
     * `attribute`
     *
     * Default: `512`
     *
     * The width of the shadow map used for projecting shadows.
     *
     * Higher values give better quality shadows at the cost of computation
     * time. Values must be powers of 2 (256, 512, 1024, etc), up to the
     * [`WebGLRenderer.capabilities.maxTextureSize`](https://threejs.org/docs/index.html?q=lightshadow#api/en/renderers/WebGLRenderer.capabilities)
     * for a given device, although the width and height don't have to be the
     * same (for example (512, 1024) is valid).
     */
    shadowMapWidth: number;
    /**
     * @property {number} shadowMapHeight -
     *
     * `attribute`
     *
     * Default: `512`
     *
     * The height of the shadow map used for projecting shadows.
     *
     * Higher values give better quality shadows at the cost of computation
     * time. Values must be powers of 2 (256, 512, 1024, etc), up to the
     * [`WebGLRenderer.capabilities.maxTextureSize`](https://threejs.org/docs/index.html?q=lightshadow#api/en/renderers/WebGLRenderer.capabilities)
     * for a given device, although the width and height don't have to be the
     * same (for example (512, 1024) is valid).
     */
    shadowMapHeight: number;
    /**
     * @property {number} shadowRadius -
     *
     * `attribute`
     *
     * Default: `3`
     *
     * Setting this to values greater than `1` will blur the edges of the shadow.
     * High values will cause unwanted banding effects in the shadows - a
     * greater width and height of the shadow map will allow for a higher radius
     * to be used before these effects become visible.
     *
     * When [Scene.shadowmapType](../core/Scene#shadowmapType) is set to
     * `"pcfsoft"`, the radius has no effect and it is recommended to increase
     * softness by decreasing the shadow map width and height instead.
     *
     * When [Scene.shadowmapType](../core/Scene#shadowmapType) is set to
     * `"basic"`, radius also has no effect, and there is no further way to
     * adjust shadow softness.
     */
    shadowRadius: number;
    /**
     * @property {number} shadowBias -
     *
     * `attribute`
     *
     * Default: `0`
     *
     * Shadow bias adjusts the depth of a shadow pixel, which is useful for
     * avoiding shadow rendering artifacts (f.e. "shadow acne" when a
     * surface both creates and receives a shadow on itself). Very tiny
     * adjustments (in the order of 0.0001) may help reduce these artifacts..
     *
     * This topic is too complex to explain in a paragraph. Here are several
     * nice resources for understanding this:
     *
     * - https://learnopengl.com/Advanced-Lighting/Shadows/Shadow-Mapping
     * - https://docs.unity3d.com/540/Documentation/Manual/ShadowOverview.html
     * - https://digitalrune.github.io/DigitalRune-Documentation/html/3f4d959e-9c98-4a97-8d85-7a73c26145d7.htm
     * - https://learn.microsoft.com/en-us/windows/win32/dxtecharts/common-techniques-to-improve-shadow-depth-maps
     */
    shadowBias: number;
    /**
     * @property {number} shadowNormalBias -
     *
     * `attribute`
     *
     * Default: `0`
     *
     * This is similarly useful for the same reason as
     * [`shadowBias`](#shadowBias) in preventing visual self-shadowing
     * artifacts. This moves shadow pixels into a surface based on the surface
     * normal.
     *
     * Increasing this value can be used to reduce shadow acne especially in
     * large scenes where light shines onto geometry at a shallow angle. The
     * downside is that shadows may appear warped with larger values.
     */
    shadowNormalBias: number;
    /**
     * @property {number} shadowCameraNear -
     *
     * `attribute`
     *
     * Default: `1`
     *
     * Adjusts the near plane of the internal camera used for shadow projection.
     */
    shadowCameraNear: number;
    /**
     * @property {number} shadowCameraFar -
     *
     * `attribute`
     *
     * Default: `2000`
     *
     * Adjusts the far plane of the internal camera used for shadow projection.
     */
    shadowCameraFar: number;
    _loadGL(): boolean;
}
//# sourceMappingURL=LightWithShadow.d.ts.map