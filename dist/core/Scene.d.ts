import { Scene as ThreeScene } from 'three/src/scenes/Scene.js';
import { PerspectiveCamera as ThreePerspectiveCamera } from 'three/src/cameras/PerspectiveCamera.js';
import { type ShadowMapTypeString } from '../renderers/WebglRendererThree.js';
import { SharedAPI } from './SharedAPI.js';
import type { TColor } from '../utils/three.js';
import type { PerspectiveCamera } from '../cameras/PerspectiveCamera.js';
import type { XYZValuesObject } from '../xyz-values/XYZValues.js';
import type { SizeableAttributes } from './Sizeable.js';
import type { Element3D } from './Element3D.js';
export type SceneAttributes = SizeableAttributes | 'shadowmapType' | 'vr' | 'webgl' | 'enableCss' | 'swapLayers' | 'backgroundColor' | 'backgroundOpacity' | 'background' | 'equirectangularBackground' | 'environment' | 'fogMode' | 'fogNear' | 'fogFar' | 'fogColor' | 'fogDensity' | 'physicallyCorrectLights' | 'cameraNear' | 'cameraFar' | 'perspective';
/**
 * @class Scene -
 *
 * Element: `<lume-scene>`
 *
 * This is the backing class for `<lume-scene>` elements. All
 * [`Element3D`](./Element3D.md)s must be inside of a `<lume-scene>` element. A `Scene`
 * establishes a visual area in a web application where a 3D scene will be
 * rendered.
 *
 * A Scene has some properties that apply to the scene as a whole and will have
 * an effect on all LUME elements in the scene. For example, `fog-mode` defines fog
 * rendering that changes the color of all WebGL objects in the scene to make them
 * have the appearance of being obscured by a haze.
 *
 * ## Example
 *
 * The following example shows how to begin making a LUME scene within an HTML
 * file. To learn more about how to get started, see the [install guide](../../guide/install.md).
 *
 * <live-code id="liveExample"></live-code>
 * <script>
 *   liveExample.code = sceneExample()
 * </script>
 *
 * @extends SharedAPI
 */
export declare class Scene extends SharedAPI {
    #private;
    /**
     * @property {true} isScene -
     *
     * *readonly*
     *
     * Always `true` for things that are or inherit from `Scene`.
     */
    readonly isScene = true;
    skipShadowObservation: boolean;
    /**
     * @property {boolean} enableCss -
     *
     * *attribute*
     *
     * Default: `true`
     *
     * When `true`, CSS transforms are applied
     * to all LUME elements. This allows regular HTML content placed inside LUME
     * elements to be positioned in the scene's 3D space. Set this to `false` if
     * you will render only WebGL content and do not need to listen to
     * pointer events on the elements; the elements will have the CSS property
     * `display:none`. When rendering only WebGL content, leaving this enabled is useful for
     * debugging, as the elements are placed in the same locations in 3D
     * space as the WebGL graphics, and thus devtools will highlight the
     * positions of WebGL objects on the screen when hovering on them in the element inspector.
     */
    enableCss: boolean;
    /**
     * @property {boolean} webgl -
     *
     * *attribute*
     *
     * Default: `false`
     *
     * When `true`, enables WebGL rendering.
     */
    webgl: boolean;
    /**
     * @property {boolean} swapLayers -
     *
     * *attribute*
     *
     * Default: `false`
     *
     * This is only useful when both CSS and
     * WebGL render modes are enabled. When `true`, the CSS layer will render on
     * top of the WebGL layer instead of below.
     */
    swapLayers: boolean;
    /**
     * @property {'basic' | 'pcf' | 'pcfsoft' | 'vsm'} shadowmapType -
     *
     * *attribute*
     *
     * Default: `'basic'`
     *
     * Specifies the type of shadows to use. The value can be `'basic'`,
     * `'pcf'`, `'pcfsoft'`, or `'vsm'`. See the "Shadow Types" section in
     * Three.js [Renderer
     * Constants](https://threejs.org/docs/#api/en/constants/Renderer) for
     * descriptions.
     *
     * Applies only if [`webgl`](#webgl) is `true`.
     */
    shadowmapType: ShadowMapTypeString | null;
    /**
     * @property {boolean} vr -
     *
     * *attribute*
     *
     * Default: `false`
     *
     * When `true`, enables VR capabilities. The user
     * can click a button to enter VR mode.
     *
     * Applies only if [`webgl`](#webgl) is `true`. CSS content can not be natively
     * rendered with the browser's WebXR. There exist some tricks to import CSS
     * rendering in the form of an SVG image to use as a texture in WebGL and
     * hence WebXR, but it has some limitations including low performance if
     * animating CSS features; we may add this feature later.
     */
    vr: boolean;
    /**
     * @property {Color | string | number | null} backgroundColor -
     *
     * *attribute*
     *
     * Default: `'white'`
     *
     * The color of the
     * scene's background when WebGL rendering is enabled. If the
     * [`background`](#background) property is also set, then `backgroundColor` is
     * ignored. Make sure to set `backgroundOpacity` to a higher value than the
     * default of `0` or the color won't be visible and instead only the color of
     * whatever is behind the `<lume-scene>` will be visible.
     *
     * Applies only if [`webgl`](#webgl) is `true`.
     */
    backgroundColor: TColor | null;
    /**
     * @property {number} backgroundOpacity -
     *
     * *attribute*
     *
     * Default: `0`
     *
     * A number between `0` and `1` that
     * defines the opacity (opposite of transparency) of the `backgroundColor`
     * when WebGL is enabled. If the value is less than 1, it means that any DOM
     * contend behind the `<lume-scene>` element will be visible. A value of `0`
     * means the background is fully transparent. This is ignored if the
     * [`background`](#background) property is set.
     *
     * Applies only if [`webgl`](#webgl) is `true`.
     */
    backgroundOpacity: number;
    /**
     * @property {string | null} background -
     *
     * *attribute*
     *
     * Default: `null`
     *
     * Set an image as the scene's
     * background. If the image is an [equirectangular environment
     * map](https://coeleveld.com/spherical-equirectangular-environment-textures-and-hdri), then set the value of
     * [`equirectangularBackground`](#equirectangularbackground) to `true`, otherwise the image
     * will be treated as a 2D background image. The value should be a path
     * to a jpeg, jpg, or png. Other types not supported yet. This value
     * takes priority over the [`backgroundColor`](#backgroundcolor) and
     * [`backgroundOpacity`](#backgroundopacity) properties; those properties will be
     * ignored. Any transparent parts of the image will be rendered
     * as color white.
     *
     * Applies only if [`webgl`](#webgl) is `true`.
     */
    background: string | null;
    /**
     * @property {string} equirectangularBackground -
     *
     * *attribute*
     *
     * Default: `false`
     *
     * If the `background`
     * is equirectangular, set this to `true` so use it like a skybox,
     * otherwise the image will be used as a regular 2D background image.
     *
     * Applies only if [`webgl`](#webgl) is `true`.
     */
    equirectangularBackground: boolean;
    /**
     * @property {string | null} environment -
     *
     * *attribute*
     *
     * Default: `null`
     *
     * The environment can be a path to a
     * jpeg, jpg, or png (other format not yet supported). It is assumed to
     * be an equirectangular image used for env maps for things like
     * reflections on metallic objects in the scene.
     *
     * Applies only if [`webgl`](#webgl) is `true`.
     */
    environment: string | null;
    /**
     * @property {'none' | 'linear' | 'expo2'} fogMode -
     *
     * *attribute*
     *
     * Default: `'none'`
     *
     * The fog mode to render
     * the scene with.
     *
     * A value of `'none'` means no fog.
     *
     * A value of `'linear'`
     * makes a fog that gets reduces visibility of objects with distance from the camera.
     * The `fogNear` and `fogFar` properties specify the distance from the camera when
     * linear fog starts being applied to objects and when objects are fully invisible,
     * respectively. Any objects before the near point will be fully visible, and any
     * objects beyond the far point will be fully invisible.
     *
     * A value of `'expo2'` creates an exponential squared fog. Unlike linear fog, the near
     * and far cannot be configured. Instead, expo2 fog is more realistic, and only it's
     * overall "physical" density can be configured with the `fogDensity` property.
     *
     * Applies only if [`webgl`](#webgl) is `true`.
     */
    fogMode: FogMode;
    /**
     * @property {number} fogNear -
     *
     * *attribute*
     *
     * Default: `0`
     *
     * When `fogMode` is `'linear'`, this controls
     * the distance from the camera where fog starts to appear and objects start
     * to be less visible.
     *
     * Applies only if [`webgl`](#webgl) is `true`.
     */
    fogNear: number;
    /**
     * @property {number} fogFar -
     *
     * *attribute*
     *
     * Default: `1000`
     *
     * When `fogMode` is `'linear'`, this controls
     * the distance from the camera where fog reaches maximum density and
     * objects are no longer visible.
     *
     * Applies only if [`webgl`](#webgl) is `true`.
     */
    fogFar: number;
    /**
     * @property {string} fogColor -
     *
     * *attribute*
     *
     * Default: `'gray'`
     *
     * If `fogMode` is not `'none'`, this
     * configures the fog color. The value should be any valid CSS color string.
     *
     * You will want to change the value to match that of, or be similar to,
     * your scene's `backgroundColor`.
     *
     * Applies only if [`webgl`](#webgl) is `true`.
     */
    fogColor: string;
    /**
     * @property {number} fogDensity -
     *
     * *attribute*
     *
     * Default: `0.0025`
     *
     * If `fogMode` is set to `'expo2'`, this
     * configures the fog density.
     *
     * Applies only if [`webgl`](#webgl) is `true`.
     */
    fogDensity: number;
    /**
     * @deprecated This property/attribute will be removed when Three.js r165 is
     * released (estimated), and physically correct lighting will become the
     * default option for enhanced interoperability with other graphics engines
     * (f.e. Blender).  To be ready for the removal, set this to true, and
     * adjust lighting (intensity values may need to be notably higher as they
     * are now in candela units assuming world units are in meters) to achieve a
     * similar effect as before.
     *
     * @property {boolean} physicallyCorrectLights -
     *
     * `attribute`
     *
     * Default: `false`
     *
     * Whether to use physically correct lighting mode or not. This affects only
     * [`PointLight`](../lights/PointLight) <!-- and `SpotLight` --> elements
     * <!-- ; `RectArea` lights do this automatically -->. See the [lights /
     * physical example](https://threejs.org/examples/#webgl_lights_physical)
     * from Three.js and "physicallyCorrectLights" in the Three.js manual's
     * [Lights](https://threejs.org/manual/?q=lig#en/lights) doc.
     */
    physicallyCorrectLights: boolean;
    /**
     * @property {number} cameraNear -
     *
     * *attribute*
     *
     * Default: `0.1`
     *
     * When not using a custom camera, this
     * configures the distance from the default camera of a plane perpendicular
     * to the camera's line of sight after which objects objects are visible. Anything between
     * the plane and the camera will not be visible. This should be smaller than `cameraFar`. Also see `cameraFar`.
     *
     * Applies in both CSS and WebGL rendering. Note that the near and far
     * values apply only to WebGL rendering and are otherwise infinitely small and
     * infinitely big (respectively) when it comes to CSS rendering.
     */
    cameraNear: number;
    /**
     * @property {number} cameraFar -
     *
     * *attribute*
     *
     * Default: `10000`
     *
     * When not using a custom camera, this
     * configures the distance from the default camera of a plane perpendicular
     * to the camera's line of sight before which objects are visible. Anything further than
     * the plane will not be visible. This should be bigger than `cameraNear`. Also see `cameraNear`.
     *
     * Applies in both CSS and WebGL rendering. Note that the near and far
     * values apply only to WebGL rendering and are otherwise infinitely small and
     * infinitely big (respectively) when it comes to CSS rendering.
     */
    cameraFar: number;
    /**
     * @property {number} perspective -
     *
     * *attribute*
     *
     * Default: `400`
     *
     * This property behaves just like CSS perspective
     * when using CSS transforms, but also applies to LUME's WebGL rendering when using a scene's
     * default camera. If using a custom camera (for example a `<lume-perspective-camera>` element) then this
     * value does not (currently) have any effect.
     *
     * The value sets the default camera's Z position to the given value (relative to the world
     * origin, 0,0,0). Note that the default camera points in the -z direction, therefore a value
     * of 800 means the camera is at position 0,0,800 looking directly at the world origin
     * at 0,0,0. Furthermore, based on the chosen value, the camera's aspect ratio and zoom
     * will be adjusted such that if there were a plane positioned at 0,0,0, perpendicular
     * to the camera's line of sight, and having the same dimensions as the scene's viewport
     * in screen pixels, then the plane would fit perfectly in the view, and one unit on that
     * plane would coincide with one pixel on the screen; essentially that plane would be lined
     * up perfectly with the screen surface. This is the same meaning that CSS perspective has.
     *
     * Applies with both CSS and WebGL rendering.
     */
    set perspective(value: number);
    get perspective(): number;
    /**
     * @property {THREE.Camera} threeCamera -
     *
     * *readonly*
     *
     * The current active THREE.Camera being
     * used by the scene. It will be a default camera if no camera was manually
     * specified by a camera element such as `<lume-perspective-camera>`, in
     * which case the scene's `perspective` property is used for configuring the
     * default camera. If a manual camera element is set active with an
     * `active` attribute, then this property will return the currently
     * active THREE.Camera represented by the active camera element.
     *
     * Applies with both CSS and WebGL rendering.
     */
    get threeCamera(): ThreePerspectiveCamera;
    __threeCamera: ThreePerspectiveCamera;
    /**
     * @property {PerspectiveCamera} camera
     *
     * *readonly*, *signal*
     *
     * Returns the currently active camera that is within the scene, or `null`
     * if there is none and the scene is using its internal default camera. The
     * `.threeCamera` property will always return a Three.js camera, whether
     * from the active camera element, or the scene's internal camera.
     *
     * When the scene is using its default camera, the X and Y size of the scene
     * fits perfectly within the camera view, at a distance from the camera
     * matching the value of the `.perspective` property. In practice, this
     * means that anything positioned within a scene with a default camera is
     * positioned based on CSS pixels, and those items will be sized with CSS
     * pixels. The default camera makes a scene useful for writing apps based on
     * the document space, just like with regular DOM+CSS where everything is
     * positioned starting at the top/left.
     */
    get camera(): PerspectiveCamera | null;
    /**
     * @property {THREE.WebGLRenderer} glRenderer
     *
     * *readonly*
     *
     * Returns the scene's underlying
     * [THREE.WebGLRenderer](https://threejs.org/docs/index.html#api/en/renderers/WebGLRenderer)
     * for custom uses, or `null` when GL rendering is not enabled.
     */
    get glRenderer(): import("three").WebGLRenderer | undefined;
    /**
     * @property {CSS3DRendererNested} glRenderer
     *
     * *readonly*
     *
     * Returns the scene's underlying `CSS3DRendererNested` (a forked version of
     * [THREE.CSS3DRenderer](https://threejs.org/docs/index.html#examples/en/renderers/CSS3DRenderer)
     * that allows us to have a nested DOM structure instead of a flat DOM
     * structure) for custom uses, or `null` when CSS rendering is not enabled.
     */
    get cssRenderer(): import("../renderers/CSS3DRendererNested.js").CSS3DRendererNested | undefined;
    __camera: PerspectiveCamera | null;
    __localClipping: boolean;
    constructor();
    _glLayer: HTMLDivElement | null;
    _cssLayer: HTMLDivElement | null;
    _miscLayer: HTMLDivElement | null;
    drawScene(): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    static observedAttributes: string[];
    attributeChangedCallback(name: string, oldVal: string | null, newVal: string | null): void;
    makeThreeObject3d(): ThreeScene;
    makeThreeCSSObject(): ThreeScene;
    /**
     * @method traverseSceneGraph - This traverses the composed tree of LUME 3D
     * elements (the scene graph) not including the scene element, starting from
     * the scene's children, in pre-order. It skips non-LUME elements. The given
     * callback will be called for each element in the traversal.
     *
     * This is similar to
     * [`Element3D#traverseSceneGraph`](./Element3D.md#traversescenegraph) but traversal
     * does not include the Scene that this is called on, because a Scene is not
     * something that is rendered, but a container of things that are rendered.
     *
     * Example:
     *
     * ```js
     * scene.traverseSceneGraph(el => {
     *   console.log(scene === el) // never true
     *   console.log(el instanceof LUME.Element3D) // true
     * })
     * ```
     *
     * @param {(el: Element3D) => void} visitor - A function called for each
     * LUME element in the scene graph (the composed tree).
     * @param {boolean} waitForUpgrade - Defaults to `false`. If `true`,
     * the traversal will wait for custom elements to be defined (with
     * customElements.whenDefined) before traversing to them.
     * @returns {void | Promise<void>} - If `waitForUpgrade` is `false`,
     * the traversal will complete synchronously, and the return value will be
     * `undefined`. If `waitForUpgrade` is `true`, then traversal completes
     * asynchronously once all custom elements are defined, and a Promise is
     * returned so that it is possible to wait for the traversal to complete.
     */
    traverseSceneGraph(visitor: (el: Element3D) => void, waitForUpgrade?: boolean): Promise<void> | void;
    _createDefaultCamera(): void;
    _updateCameraPerspective(): void;
    _updateCameraAspect(): void;
    _updateCameraProjection(): void;
    __activeCameras?: Set<PerspectiveCamera>;
    _addCamera(camera: PerspectiveCamera): void;
    _removeCamera(camera: PerspectiveCamera): void;
    /**
     * @property {{x: number, y: number, z: number}} parentSize
     *
     * `override` `signal` `readonly`
     *
     * Overrides [`Sizeable.parentSize`](./Sizeable#parentSize) in order to return the size of a Scene's
     * non-LUME parent element where the scene is connected.
     * NOTE: `z` size of a non-LUME element is always `0`, since regular DOM
     * elements don't have the concept of Z size and are always flat.
     */
    get parentSize(): XYZValuesObject<number>;
    _loadGL(): boolean;
    _unloadGL(): boolean;
    _loadCSS(): boolean;
    _unloadCSS(): boolean;
    __setCamera(camera?: PerspectiveCamera): void;
    __elementParentSize: XYZValuesObject<number>;
    template: () => Node | Node[];
    static css: string;
}
import type { ElementAttributes } from '@lume/element';
declare module 'solid-js' {
    namespace JSX {
        interface IntrinsicElements {
            'lume-scene': ElementAttributes<Scene, SceneAttributes>;
        }
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'lume-scene': Scene;
    }
}
type FogMode = 'none' | 'linear' | 'expo2';
export {};
//# sourceMappingURL=Scene.d.ts.map