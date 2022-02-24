// TODO: write a test that imports public interfaces in every possible
// permutation to detect circular dependency errors.
// See: https://esdiscuss.org/topic/how-to-solve-this-basic-es6-module-circular-dependency-problem

import {autorun, booleanAttribute, attribute, numberAttribute, untrack, element, stringAttribute} from '@lume/element'
import {emits} from '@lume/eventful'
import {Scene as ThreeScene} from 'three/src/scenes/Scene.js'
import {PerspectiveCamera as ThreePerspectiveCamera} from 'three/src/cameras/PerspectiveCamera.js'
// import {AmbientLight} from 'three/src/lights/AmbientLight.js'
import {Color} from 'three/src/math/Color.js'
import {Fog} from 'three/src/scenes/Fog.js'
import {FogExp2} from 'three/src/scenes/FogExp2.js'
import {WebglRendererThree, ShadowMapTypeString} from '../renderers/WebglRendererThree.js'
import {Css3dRendererThree} from '../renderers/Css3dRendererThree.js'
import {HtmlScene as HTMLInterface} from './HtmlScene.js'
import {defer, thro} from './utils.js'
import {possiblyPolyfillResizeObserver} from './ResizeObserver.js'
import {isDisposable} from '../utils/three.js'
import {Motor} from './Motor.js'
import {autoDefineElements} from '../LumeConfig.js'

import type {DeclarativeBase} from './DeclarativeBase.js'
import type {TColor} from '../utils/three.js'
import type {PerspectiveCamera} from '../cameras/PerspectiveCamera.js'
import type {XYZValuesObject} from '../xyz-values/XYZValues.js'
import type {Sizeable} from './Sizeable.js'
import type {SizeableAttributes} from './Sizeable.js'
import type {Node} from './Node.js'

export type SceneAttributes =
	// Don't expost TransformableAttributes here for now (although they exist). What should modifying those on a Scene do?
	| SizeableAttributes
	| 'shadowmapType'
	| 'vr'
	| 'webgl'
	| 'enableCss'
	| 'swapLayers'
	| 'backgroundColor'
	| 'backgroundOpacity'
	| 'background'
	| 'equirectangularBackground'
	| 'environment'
	| 'fogMode'
	| 'fogNear'
	| 'fogFar'
	| 'fogColor'
	| 'fogDensity'
	| 'cameraNear'
	| 'cameraFar'
	| 'perspective'

/**
 * @class Scene -
 * > :construction: :hammer: Under construction! :hammer: :construction:
 *
 * Element: `<lume-node>`
 *
 * This is the backing class for `<lume-scene>` elements. All
 * [`Node`](/api/core/Node.md) elements must be inside of a `<lume-scene>` element. A `Scene`
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
 * <div id="example1"></div>
 *
 * <script type="application/javascript">
 *   new Vue({
 *     el: '#example1',
 *     template: '<live-code :template="code" mode="html>iframe" :debounce="200" />',
 *     data: { code: sceneExample() },
 *   })
 * </script>
 *
 * @extends HTMLScene
 */
// TODO @element jsdoc tag
@element('lume-scene', autoDefineElements)
export class Scene extends HTMLInterface {
	/**
	 * @property {true} isScene -
	 *
	 * *readonly*
	 *
	 * Always `true` for things that are or inherit from `Scene`.
	 */
	// TODO @readonly jsdoc tag
	readonly isScene = true

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
	// TODO @attribute jsdoc tag
	// TODO @default jsdoc tag
	@emits('propertychange') @booleanAttribute(true) enableCss = true

	/**
	 * @property {boolean} webgl -
	 *
	 * *attribute*
	 *
	 * Default: `false`
	 *
	 * When `true`, enables WebGL rendering.
	 */
	@emits('propertychange') @booleanAttribute(false) webgl = false

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
	@emits('propertychange') @booleanAttribute(false) swapLayers = false

	/**
	 * @property {'pcf' | 'pcfsoft' | 'basic'} shadowmapType -
	 *
	 * *attribute*
	 *
	 * Default: `'basic'`
	 *
	 * Specifies the type of shadows to use. The value can be 'pcf', 'pcfsoft',
	 * or 'basic'. See the "Shadow Types" section in Three.js [Renderer
	 * Constants](https://threejs.org/docs/#api/en/constants/Renderer) for
	 * descriptions.
	 *
	 * Applies only if `webgl` is `true`.
	 */
	@emits('propertychange') @attribute shadowmapType: ShadowMapTypeString | null = 'basic'

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
	 * Applies only if `webgl` is `true`. CSS content can not be natively
	 * rendered with the browser's WebXR. There exist some tricks to import CSS
	 * rendering in the form of an SVG image to use as a texture in WebGL and
	 * hence WebXR, but it has some limitations including low performance if
	 * animating CSS features; we may add this feature later.
	 */
	@emits('propertychange') @booleanAttribute(false) vr = false

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
	 * Applies only if `webgl` is `true`.
	 */
	@emits('propertychange') @attribute backgroundColor: TColor | null = new Color('white')

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
	 * Applies only if `webgl` is `true`.
	 */
	@emits('propertychange') @numberAttribute(0) backgroundOpacity = 0

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
	 * Applies only if `webgl` is `true`.
	 */
	@emits('propertychange') @attribute background: string | null = null

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
	 * Applies only if `webgl` is `true`.
	 */
	@emits('propertychange') @booleanAttribute(false) equirectangularBackground = false

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
	 * Applies only if `webgl` is `true`.
	 */
	@emits('propertychange') @attribute environment: string | null = null

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
	 * Applies only if `webgl` is `true`.
	 */
	@stringAttribute('none') fogMode: FogMode = 'none'

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
	 * Applies only if `webgl` is `true`.
	 */
	@numberAttribute(0) fogNear = 0

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
	 * Applies only if `webgl` is `true`.
	 */
	@numberAttribute(1000) fogFar = 1000

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
	 * Applies only if `webgl` is `true`.
	 */
	@stringAttribute('gray') fogColor: string = 'gray'

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
	 * Applies only if `webgl` is `true`.
	 */
	@numberAttribute(0.0025) fogDensity = 0.0025

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
	@numberAttribute(0.1) cameraNear = 0.1

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
	@numberAttribute(10000) cameraFar = 10000

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
	@numberAttribute(400)
	set perspective(value) {
		this.#perspective = value
		this._updateCameraPerspective()
		this._updateCameraProjection()
		this.needsUpdate()
	}
	get perspective() {
		return this.#perspective
	}

	#perspective = 400

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
	get threeCamera(): ThreePerspectiveCamera {
		return this.__threeCamera
	}

	// this.#threeCamera holds the active camera. There can be many
	// cameras in the scene tree, but the last one with active="true"
	// will be the one referenced here.
	// If there are no cameras in the tree, a virtual default camera is
	// referenced here, who's perspective is that of the scene's
	// perspective attribute.
	__threeCamera!: ThreePerspectiveCamera

	constructor() {
		super()

		// Used by the `scene` getter in ImperativeBase
		// TODO set this in connectedCallback, unset in disconnectedCallback, so
		// it has the same semantics as with Node (this.scene is not null when
		// scene is connected and has webgl or css rendering turned on)
		this._scene = this

		// this.sizeMode and this.size have to be overriden here inside the
		// constructor in TS 4. This is because class fields on a
		// subclass are no longer allowed to be defined outside the
		// constructor if a base class has the same properties already defined as
		// accessors.

		/**
		 * @property {XYZSizeModeValues} sizeMode -
		 *
		 * *override*, *attribute*
		 *
		 * Default: ['proportional', 'proportional', 'literal']
		 *
		 * This overrides the
		 * [`Sizeable.sizeMode`](/api/core/Sizeable.md#sizeMode) property to make the default values for the X and
		 * Y axes both "proportional".
		 */
		this.sizeMode.set('proportional', 'proportional', 'literal')

		/**
		 * @property {XYZNonNegativeValues} size -
		 *
		 * *override*, *attribute*
		 *
		 * Default: [1, 1, 0]
		 *
		 * This overrides the [`Sizeable.size`](/api/core/Sizeable.md#size)
		 * property to make the default values for the X and Y axes both `1`.
		 */
		this.size.set(1, 1, 0)

		// The scene should always render CSS properties (it needs to always
		// be rendered or resized, for example, because it contains the
		// WebGL canvas which also needs to be resized). Namely, we still
		// want to apply size values to the scene so that it can size
		// relative to it's parent container, or literally if size mode is
		// "literal".
		this._elementOperations.shouldRender = true

		this._createDefaultCamera()

		this._calcSize()
		this.needsUpdate()
	}

	// size of the element where the Scene is mounted
	// NOTE: z size is always 0, since native DOM elements are always flat.
	_elementParentSize: XYZValuesObject<number> = {x: 0, y: 0, z: 0}

	static css = /*css*/ `
		${HTMLInterface.css}
		.vrButton {
			color: black;
			border-color: black;
		}
	`

	drawScene() {
		this.#glRenderer && this.#glRenderer.drawScene(this)
		this.#cssRenderer && this.#cssRenderer.drawScene(this)
	}

	connectedCallback() {
		super.connectedCallback()

		this._stopFns.push(
			autorun(() => {
				if (this.webgl) this._triggerLoadGL()
				else this._triggerUnloadGL()

				// TODO Need this?
				this.needsUpdate()
			}),
			autorun(() => {
				if (!this.webgl || !this.background) {
					if (isDisposable(this.three.background)) this.three.background.dispose()
					this.#glRenderer?.disableBackground(this)
					return
				}

				if (this.background.match(/\.(jpg|jpeg|png)$/)) {
					// Dispose each time we switch to a new one.
					if (isDisposable(this.three.background)) this.three.background.dispose()

					// destroy the previous one, if any.
					this.#glRenderer!.disableBackground(this)

					this.#glRenderer!.enableBackground(this, this.equirectangularBackground, texture => {
						this.three.background = texture || null
						this.needsUpdate()

						// TODO emit background load event.
					})
				} else {
					console.warn(
						`<${this.tagName.toLowerCase()}> background attribute ignored, the given image type is not currently supported.`,
					)
				}
			}),
			autorun(() => {
				if (!this.webgl || !this.environment) {
					if (isDisposable(this.three.environment)) this.three.environment.dispose()
					this.#glRenderer?.disableEnvironment(this)
					return
				}

				if (this.environment.match(/\.(jpg|jpeg|png)$/)) {
					// Dispose each time we switch to a new one.
					if (isDisposable(this.three.environment)) this.three.environment.dispose()

					// destroy the previous one, if any.
					this.#glRenderer!.disableEnvironment(this)

					this.#glRenderer!.enableEnvironment(this, texture => {
						this.three.environment = texture
						this.needsUpdate()

						// TODO emit background load event.
					})
				} else {
					console.warn(
						`<${this.tagName.toLowerCase()}> environment attribute ignored, the given image type is not currently supported.`,
					)
				}
			}),
			autorun(() => {
				if (this.enableCss) this._triggerLoadCSS()
				else this._triggerUnloadCSS()

				// Do we need this? Doesn't hurt to have it just in case.
				this.needsUpdate()
			}),
			autorun(() => {
				this.sizeMode
				this.#startOrStopParentSizeObservation()
			}),
		)
	}

	disconnectedCallback() {
		super.disconnectedCallback()
		this.#stopParentSizeObservation()
	}

	static observedAttributes = ['slot']

	attributeChangedCallback(name: string, oldV: string | null, newV: string | null) {
		super.attributeChangedCallback!(name, oldV, newV)

		if (name === 'slot') {
			defer(() => {
				throw new Error(
					'Assigning a <lume-scene> to a slot is not currently supported and may not work as expected. Instead, wrap the <lume-scene> in another element like a <div>, then assign the wrapper to the slot.',
				)
			})
		}
	}

	makeThreeObject3d() {
		return new ThreeScene()
	}

	makeThreeCSSObject() {
		return new ThreeScene()
	}

	// Overrides to filter out any non-Nodes (f.e. Scenes).
	get composedLumeChildren(): Node[] {
		const result: Node[] = []
		for (const child of super.composedLumeChildren) if (isNode(child)) result.push(child)
		return result
	}

	/**
	 * @method traverseSceneGraph - This traverses the composed tree of LUME 3D
	 * elements (the scene graph) not including the scene node, starting from
	 * the scene's children, in pre-order. It skips non-LUME elements. The given
	 * callback will be called for each node in the traversal.
	 *
	 * This is similar to
	 * [`Node#traverseSceneGraph`](./Node.md#traversescenegraph) but traversal
	 * does not include the Scene that this is called on, because a Scene is not
	 * something that is rendered, but a container of things that are rendered.
	 *
	 * Example:
	 *
	 * ```js
	 * scene.traverseSceneGraph(node => {
	 *   console.log(scene === node) // never true
	 *   console.log(node instanceof LUME.Node) // true
	 * })
	 * ```
	 *
	 * @param {(node: Node) => void} visitor - A function called for each
	 * LUME node in the scene graph (the composed tree).
	 * @param {boolean} waitForUpgrade - Defaults to `false`. If `true`,
	 * the traversal will wait for custom elements to be defined (with
	 * customElements.whenDefined) before traversing to them.
	 * @returns {void | Promise<void>} - If `waitForUpgrade` is `false`,
	 * the traversal will complete synchronously, and the return value will be
	 * `undefined`. If `waitForUpgrade` is `true`, then traversal completes
	 * asynchronously once all custom elements are defined, and a Promise is
	 * returned so that it is possible to wait for the traversal to complete.
	 */
	override traverseSceneGraph(visitor: (node: Node) => void, waitForUpgrade = false): Promise<void> | void {
		if (!waitForUpgrade) {
			for (const child of this.composedLumeChildren) child.traverseSceneGraph(visitor, waitForUpgrade)

			return
		}

		// if waitForUpgrade is true, we make a promise chain so that
		// traversal order is still the same as when waitForUpgrade is false.
		let promise: Promise<any> = Promise.resolve()

		for (const child of this.composedLumeChildren) {
			const isUpgraded = child.matches(':defined')

			if (isUpgraded) {
				promise = promise!.then(() => child.traverseSceneGraph(visitor, waitForUpgrade))
			} else {
				promise = promise!
					.then(() => customElements.whenDefined(child.tagName.toLowerCase()))
					.then(() => child.traverseSceneGraph(visitor, waitForUpgrade))
			}
		}

		return promise
	}

	_createDefaultCamera() {
		// Use untrack so this method is non-reactive.
		untrack(() => {
			const size = this.calculatedSize
			// THREE-COORDS-TO-DOM-COORDS
			// We apply Three perspective the same way as CSS3D perspective here.
			// TODO CAMERA-DEFAULTS, get defaults from somewhere common.
			// TODO the "far" arg will be auto-calculated to encompass the furthest objects (like CSS3D).
			// TODO update with calculatedSize in autorun
			this.__threeCamera = new ThreePerspectiveCamera(45, size.x / size.y || 1, 0.1, 10000)
			this.perspective = this.perspective
		})
	}

	// TODO can this be moved to a render task like _calcSize should also be?
	// It depends on size values.
	_updateCameraPerspective() {
		const perspective = this.#perspective

		// This math is what sets the FOV of the default camera so that a
		// viewport-sized plane will fit exactly within the view when it is
		// positioned at the world origin, as described for in the
		// `perspective` property's description.
		// For more details: https://discourse.threejs.org/t/269/28
		this.__threeCamera.fov = (180 * (2 * Math.atan(this.calculatedSize.y / 2 / perspective))) / Math.PI

		this.__threeCamera.position.z = perspective
	}

	_updateCameraAspect() {
		this.__threeCamera.aspect = this.calculatedSize.x / this.calculatedSize.y || 1
	}

	_updateCameraProjection() {
		this.__threeCamera.updateProjectionMatrix()
	}

	// holds active cameras found in the DOM tree (if this is empty, it
	// means no camera elements are in the DOM, but this.#threeCamera
	// will still have a reference to the default camera that scenes
	// are rendered with when no camera elements exist).
	__activeCameras?: Set<PerspectiveCamera>

	_addCamera(camera: PerspectiveCamera) {
		if (!this.__activeCameras) this.__activeCameras = new Set()

		this.__activeCameras.add(camera)
		this.__setCamera(camera)
	}

	_removeCamera(camera: PerspectiveCamera) {
		if (!this.__activeCameras) return

		this.__activeCameras.delete(camera)

		if (this.__activeCameras.size) {
			// get the last camera in the Set
			this.__activeCameras.forEach(c => (camera = c))
			this.__setCamera(camera)
		} else {
			this.__activeCameras = undefined
			this.__setCamera()
		}
	}

	/** @override */
	_getParentSize(): XYZValuesObject<number> {
		return this.composedLumeParent ? (this.composedLumeParent as Sizeable).calculatedSize : this._elementParentSize
	}

	// For now, use the same program (with shaders) for all objects.
	// Basically it has position, frag colors, point light, directional
	// light, and ambient light.
	_loadGL() {
		// THREE
		// maybe keep this in sceneState in WebGLRendererThree
		if (!super._loadGL()) return false

		// We don't let Three update any matrices, we supply our own world
		// matrices.
		this.three.autoUpdate = false

		// TODO: default ambient light when no AmbientLight elements are
		// present in the Scene.
		//const ambientLight = new AmbientLight( 0x353535 )
		//this.three.add( ambientLight )

		this.#glRenderer = this.#getGLRenderer('three')

		// If _loadGL is firing, then this.webgl must be true, therefore
		// this.#glRenderer must be defined in any of the below autoruns.

		this._glStopFns.push(
			autorun(() => {
				if (this.fogMode === 'none') {
					this.three.fog = null
				} else if (this.fogMode === 'linear') {
					this.three.fog = new Fog('deeppink')
				} else if (this.fogMode === 'expo2') {
					this.three.fog = new FogExp2(new Color('deeppink').getHex())
				}

				this.needsUpdate()
			}),
			autorun(() => {
				if (this.fogMode === 'none') {
					// Nothing to do.
				} else if (this.fogMode === 'linear') {
					const fog = this.three.fog! as Fog
					fog.near = this.fogNear
					fog.far = this.fogFar
					fog.color.set(this.fogColor)
				} else if (this.fogMode === 'expo2') {
					const fog = this.three.fog! as FogExp2
					fog.color.set(this.fogColor)
					fog.density = this.fogDensity
				}
			}),
			autorun(() => {
				this.#glRenderer!.setClearColor(this, this.backgroundColor, this.backgroundOpacity)
				this.needsUpdate()
			}),
			autorun(() => {
				this.#glRenderer!.setClearAlpha(this, this.backgroundOpacity)
				this.needsUpdate()
			}),
			autorun(() => {
				this.#glRenderer!.setShadowMapType(this, this.shadowmapType)
				this.needsUpdate()
			}),
			autorun(() => {
				this.#glRenderer!.enableVR(this, this.vr)

				if (this.vr) {
					console.log('set vr frame requester!')

					Motor.setFrameRequester(fn => {
						this.#glRenderer!.requestFrame(this, fn)

						// Mock rAF return value for Motor.setFrameRequester.
						return 0
					})

					const button = this.#glRenderer!.createDefaultVRButton(this)
					button.classList.add('vrButton')

					this._miscLayer!.appendChild(button)
				} else if ((this as any).xr) {
					// TODO
				} else {
					// TODO else exit the WebXR headset, return back to normal requestAnimationFrame.
				}
			}),
			autorun(() => {
				this.__threeCamera.near = this.cameraNear
				this.__threeCamera.far = this.cameraFar
				this.needsUpdate()
			}),
		)

		this.traverseSceneGraph((node: Node) => node._triggerLoadGL(), true)

		return true
	}

	_unloadGL() {
		if (!super._unloadGL()) return false

		if (this.#glRenderer) {
			this.#glRenderer.uninitialize(this)
			this.#glRenderer = null
		}

		this.traverseSceneGraph((node: Node) => node._triggerUnloadGL())

		// Not all things are loaded in _loadGL (they may be loaded
		// depending on property/attribute values), but all things, if any, should
		// still be disposed in _unloadGL.
		{
			this.three.environment?.dispose()
			if (isDisposable(this.three.background)) this.three.background.dispose()
		}

		return true
	}

	_loadCSS() {
		if (!super._loadCSS()) return false

		this.#cssRenderer = this.#getCSSRenderer('three')

		this.traverseSceneGraph((node: Node) => node._loadCSS(), true)

		return true
	}

	_unloadCSS() {
		if (!super._unloadCSS()) return false

		if (this.#cssRenderer) {
			this.#cssRenderer.uninitialize(this)
			this.#cssRenderer = null
		}

		this.traverseSceneGraph((node: Node) => node._unloadCSS())

		return true
	}

	#glRenderer: WebglRendererThree | null = null
	#cssRenderer: Css3dRendererThree | null = null

	// The idea here is that in the future we might have "babylon",
	// "playcanvas", etc, on a per scene basis. We'd needed to abstract the
	// renderer more, have abstract base classes to define the common
	// interfaces.
	#getGLRenderer(type: 'three'): WebglRendererThree {
		if (this.#glRenderer) return this.#glRenderer

		let renderer: WebglRendererThree

		if (type === 'three') renderer = WebglRendererThree.singleton()
		else throw new Error('invalid WebGL renderer')

		renderer.initialize(this)

		return renderer
	}

	#getCSSRenderer(type: 'three') {
		if (this.#cssRenderer) return this.#cssRenderer

		let renderer: Css3dRendererThree

		if (type === 'three') renderer = Css3dRendererThree.singleton()
		else throw new Error('invalid CSS renderer. The only type supported is currently "three" (i.e. Three.js).')

		renderer.initialize(this)

		return renderer
	}

	__setCamera(camera?: PerspectiveCamera) {
		if (!camera) {
			this._createDefaultCamera()
		} else {
			// TODO?: implement an changecamera event/method and emit/call
			// that here, then move this logic to the renderer
			// handler/method?
			this.__threeCamera = camera.three
			this._updateCameraAspect()
			this._updateCameraProjection()
			this.needsUpdate()
		}
	}

	// TODO move the following parent size change stuff to a separate re-usable class.

	#parentSize: XYZValuesObject<number> = {x: 0, y: 0, z: 0}

	#startOrStopParentSizeObservation() {
		if (
			// If we will be rendering something...
			(this.enableCss || this.webgl) &&
			// ...and if one size dimension is proportional...
			(this.sizeMode.x == 'proportional' || this.sizeMode.y == 'proportional')
			// Note, we don't care about the Z dimension, because Scenes are flat surfaces.
		) {
			// ...then observe the parent element size (it may not be a LUME
			// element, so we observe with ResizeObserver).
			this.#startParentSizeObservation()
		} else {
			this.#stopParentSizeObservation()
		}
	}

	#resizeObserver: ResizeObserver | null = null

	// observe size changes on the scene's parent.
	#startParentSizeObservation() {
		const parentError = 'A Scene can only be child of HTMLElement or ShadowRoot (f.e. not an SVGElement).'

		// TODO SLOTS use of _composedParent here won't fully work until we
		// detect composed parent changes when the parent is not one of our own
		// elements (f.e. when a scene is distributed via slot to a div). The only way
		// to do this without polling is with a combination of monkey patching
		// attachShadow and using MutationObserver in all trees to observe slot
		// elements for slotchange.
		// https://github.com/WICG/webcomponents/issues/941
		const parent = this._composedParent

		// This shouldn't be possible.
		// @prod-prune
		if (!parent) thro(parentError)

		// TODO use a single ResizeObserver for all scenes.

		possiblyPolyfillResizeObserver()

		this.#resizeObserver = new ResizeObserver(changes => {
			for (const change of changes) {
				// Use the newer API if available.
				// NOTE We care about the contentBoxSize (not the
				// borderBoxSize) because the content box is the area in
				// which we're rendering visuals.
				if (change.contentBoxSize) {
					// If change.contentBoxSize is an array with more than one
					// item, it means the observed element is split across
					// multiple CSS columns. But not all browsers support the Array
					// form yet (f.e. Firefox) so fallback in that case:
					const contentBoxSize = change.contentBoxSize[0] || change.contentBoxSize

					// TODO If the Scene is used as display:inline{-block},
					// ensure that it is the size of the column in which it is
					// located. For now, we only grab the first item in the
					// array, assuming that the Scene in not used inside a
					// layout with columns.
					const {inlineSize, blockSize} = contentBoxSize

					const isHorizontal = getComputedStyle(parent).writingMode.includes('horizontal')

					// If the text writing mode is horizontal, then inlinSize is
					// the width, otherwise in vertical writing mode it is the height.
					// For more details: https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserverEntry/contentBoxSize#Syntax
					if (isHorizontal) this.#checkSize(inlineSize, blockSize)
					else this.#checkSize(blockSize, inlineSize)
				}
				// Otherwise use the older API (possibly polyfilled)
				else {
					const {width, height} = change.contentRect
					this.#checkSize(width, height)
				}
			}
		})

		this.#resizeObserver.observe(parent)
	}

	#stopParentSizeObservation() {
		this.#resizeObserver?.disconnect()
		this.#resizeObserver = null
	}

	// NOTE, the Z dimension of a scene doesn't matter, it's a flat plane, so
	// we haven't taken that into consideration here.
	#checkSize(x: number, y: number) {
		const parentSize = this.#parentSize

		// if we have a size change
		if (parentSize.x != x || parentSize.y != y) {
			parentSize.x = x
			parentSize.y = y

			this.#onElementParentSizeChange(parentSize)
		}
	}

	#onElementParentSizeChange(newSize: XYZValuesObject<number>) {
		this._elementParentSize = newSize
		// TODO #66 defer _calcSize to an animation frame (via needsUpdate),
		// unless explicitly requested by a user (f.e. they read a prop so
		// the size must be calculated). https://github.com/lume/lume/issues/66
		this._calcSize()
		this.needsUpdate()
	}
}

// Put initial value on the prototype to make it available during construction
// in a super() call.
// @ts-ignore
Scene.prototype.isScene = true

import type {ElementAttributes} from '@lume/element'

declare module '@lume/element' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-scene': ElementAttributes<Scene, SceneAttributes>
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'lume-scene': Scene
	}
}

type FogMode = 'none' | 'linear' | 'expo2'

function isNode(n: DeclarativeBase): n is Node {
	return n.isNode
}
