// TODO: write a test that imports public interfaces in every possible
// permutation to detect circular dependency errors.
// See: https://esdiscuss.org/topic/how-to-solve-this-basic-es6-module-circular-dependency-problem

import {Mixin, MixinResult, Constructor} from 'lowclass'
import {reactive, autorun, booleanAttribute, attribute, numberAttribute, untrack, element} from '@lume/element'
import {emits} from '@lume/eventful'
import documentReady from '@awaitbox/document-ready'
import {Scene as ThreeScene} from 'three/src/scenes/Scene'
import {PerspectiveCamera as ThreePerspectiveCamera} from 'three/src/cameras/PerspectiveCamera'
// import {AmbientLight} from 'three/src/lights/AmbientLight'
import {Color} from 'three/src/math/Color'
import {WebGLRendererThree, ShadowMapTypeString} from './WebGLRendererThree'
import {CSS3DRendererThree} from './CSS3DRendererThree'
import ImperativeBase, {initImperativeBase} from './ImperativeBase'
import XYZSizeModeValues from './XYZSizeModeValues'
import XYZNonNegativeValues from './XYZNonNegativeValues'
import {default as HTMLInterface} from '../html/HTMLScene'
import {documentBody, thro, trim} from './Utility'
import {possiblyPolyfillResizeObserver} from './ResizeObserver'

import {TColor, isDisposable} from '../utils/three'
import type {PerspectiveCamera} from './Camera'
import type {XYZValuesObject} from './XYZValues'
import type Sizeable from './Sizeable'
import type TreeNode from './TreeNode'

initImperativeBase()

const _Scene = Mixin(SceneMixin)

/**
 * @class Scene - This is the backing class for `<lume-scene>` elements. All
 * [`Node`](TODO) elements must be inside of a `<lume-scene>` element. A `Scene`
 * establishes a visual area in a web application where a 3D scene will be
 * rendered.
 *
 * A Scene has some properties that apply to the scene as a whole and will have an effect on all LUME elements in the scene.
 *
 * The following example shows how to begin making a LUME scene within an HTML
 * file. To learn more about how to get started, see the [install guide](TODO).
 *
 * <div id="example1"></div> <script type="application/javascript">
 *   new Vue({
 *     el: '#example1',
 *     template: '<live-code :template="code" mode="html>iframe" :debounce="200" />',
 *     data: {
 *       code:
 * `<script src="${location.origin+location.pathname}/global.js"><\/script>
 *
 * <lume-scene id="scene">
 *   <lume-node size="100 100" align="0.5 0.5" mount-point="0.5 0.5" rotation="0 30 0">
 *   	I am centered in the scene, and I am rotated a bit.
 *   </lume-node>
 * </lume-scene>
 *
 * <style>
 *   html, body {
 *     margin: 0; padding: 0;
 *     height: 100%; width: 100%;
 *   }
 *   lume-node {
 *     padding: 5px;
 *     border: 1px solid skyblue;
 *   }
 * </style>
 *
 * <script>
 *   // Make sure you register LUME's custom elements with the
 *   // browser, or nothing will happen.
 *   LUME.useDefaultNames()
 * <\/script>
 * `
 *     },
 *   })
 * </script>
 *
 * @extends ImperativeBase
 */
// TODO For now we hard-mixin the HTMLInterface class, but later we'll do this
// automatically depending on if we have a DOM or not (f.e. in Node.js or
// Gnome Desktop's JS environment).
export const Scene = _Scene.mixin(HTMLInterface)
export interface Scene extends InstanceType<typeof Scene> {}
export default Scene

function SceneMixin<T extends Constructor>(Base: T) {
	// NOTE For now, we assume Scene is mixed with its HTMLInterface.
	const Parent = ImperativeBase.mixin(Constructor<HTMLInterface>(Base))

	@element
	class Scene extends Parent {
		static defaultElementName = 'lume-scene'

		/**
		 * @readonly
		 * @property {true} isNode - Always true for things that are or inherit from `Scene`.
		 */
		readonly isScene = true

		/** @property {'pcf' | 'pcfsoft' | 'basic'} shadowmapType */
		@emits('propertychange') @attribute shadowmapType: ShadowMapTypeString = 'basic'

		/** @property {boolean} vs */
		@emits('propertychange') @booleanAttribute(false) vr = false

		/** @property {boolean} webgl */
		@emits('propertychange') @booleanAttribute(false) webgl = false

		/** @property {boolean} enableCss */
		@emits('propertychange') @booleanAttribute(true) enableCss = true

		/**
		 * @property {Color | string | number} backgroundColor - The color of
		 * the scene's background when WebGL rendering is enabled. If the
		 * [`background`](TODO) property is set also, then `backgroundColor` is ignored.
		 */
		@emits('propertychange') @attribute backgroundColor: TColor = new Color('white')

		/**
		 * @property {number} backgroundOpacity - A number between `0` and `1`
		 * that defines the opacity of the `backgroundColor` WebGL is enabled.
		 * If the value is less than 1, it means that any DOM contend behind
		 * the `<lume-scene>` element will be visible. This is ignored if the
		 * [`background`](TODO) property is set.
		 */
		@emits('propertychange') @numberAttribute(0) backgroundOpacity = 0

		/**
		 * @property {string} background - Set an image as the scene's
		 * background. If the image is an [equirectangular environment
		 * map](TODO), then set the value of
		 * [`equirectangularBackground`](TODO) to `true`, otherwise the image
		 * will be treated as a 2D background image. The value should be a path
		 * to a jpeg, jpg, or png. Other types not supported yet. This value
		 * takes priority over the [`backgroundColor`](TODO) and
		 * [`backgroundOpacity`](TODO) properties; those properties will be
		 * ignored. Any transparent parts of the image will be rendered
		 * as color white.
		 */
		@emits('propertychange') @attribute background = ''

		/**
		 * @property {string} equirectangularBackground - If the `background`
		 * is equirectangular, set this to `true` so use it like a skybox,
		 * otherwise the image will be used as a regular 2D background image.
		 */
		@emits('propertychange') @booleanAttribute(false) equirectangularBackground = false

		/**
		 * @property {string} environment - The environment can be a path to a
		 * jpeg, jpg, or png (other format not yet supported). It is assumed to
		 * be an equirectangular image used for env maps for things like
		 * reflections on metallic objects in the scene.
		 */
		@emits('propertychange') @attribute environment = ''

		@reactive private __threeCamera!: ThreePerspectiveCamera

		get threeCamera(): ThreePerspectiveCamera {
			return this.__threeCamera
		}

		// Used by the `scene` getter in ImperativeBase
		protected _scene: this | null = this

		constructor(...args: any[]) {
			super(...args)

			// this.sizeMode and this.size have to be overriden here inside the
			// constructor in TS 4. This is because class properties on a
			// subclass are no longer allowed to be defined outside the
			// constructor if a base class has the same properties as
			// accessors.

			/**
			 * @override
			 * @property {XYZSizeModeValues} sizeMode - This overrides the
			 * [`Sizeable.sizeMode`](TODO) property to make the default values for the X and
			 * Y axes both "proportional".
			 */
			this.sizeMode.set('proportional', 'proportional', 'literal')

			/**
			 * @override
			 *
			 * @property {XYZNonNegativeValues} size - This overrides the
			 * [`Sizeable.size`](TODO) property to make the default values for the
			 * X and Y axes both `1`.
			 */
			this.size.set(1, 1, 0)

			// The scene should always render CSS properties (it needs to always
			// be rendered or resized, for example, because it contains the
			// WebGL canvas which also needs to be resized). Namely, we still
			// want to apply size values to the scene so that it can size
			// relative to it's parent container, or literally if size mode is
			// "literal".
			this._elementOperations.shouldRender = true

			// size of the element where the Scene is mounted
			// NOTE: z size is always 0, since native DOM elements are always flat.
			this._elementParentSize = {x: 0, y: 0, z: 0}

			this._cameraSetup()

			this._calcSize()
			this.needsUpdate()
		}

		drawScene() {
			this.__glRenderer && this.__glRenderer.drawScene(this)
			this.__cssRenderer && this.__cssRenderer.drawScene(this)
		}

		private __perspective = 400

		@numberAttribute(400)
		set perspective(value) {
			this.__perspective = value
			this._updateCameraPerspective()
			this._updateCameraProjection()
			this.needsUpdate()
		}
		get perspective() {
			return this.__perspective
		}

		/**
		 * Mount the scene into the given target.
		 * Resolves the Scene's mountPromise, which can be use to do something once
		 * the scene is mounted.
		 *
		 * @param {string|HTMLElement} [mountPoint=document.body] If a string selector is provided,
		 * the mount point will be selected from the DOM. If an HTMLElement is
		 * provided, that will be the mount point. If no mount point is provided,
		 * the scene will be mounted into document.body.
		 */
		// TODO move some mount/unmount logic to connected/disconnectedCallback.
		// mount() is just a tool for specifying where to connect the scene
		// element to.
		async mount(mountPoint?: string | Element | null) {
			// if no mountPoint was provided, just mount onto the <body> element.
			if (mountPoint === undefined) {
				if (!document.body) await documentBody()
				mountPoint = document.body
			}

			// if the user supplied a selector, mount there.
			else if (typeof mountPoint === 'string') {
				const selector = mountPoint

				mountPoint = document.querySelector(selector)
				if (!mountPoint && document.readyState === 'loading') {
					// maybe the element wasn't parsed yet, check again when the
					// document is ready.
					await documentReady()
					mountPoint = document.querySelector(selector)
				}
			}

			// At this point we should have an actual mount point (the user may have passed it in)
			if (!(mountPoint instanceof HTMLElement || mountPoint instanceof ShadowRoot)) {
				throw new Error(
					trim(`
						Invalid mount point specified in Scene.mount() call
						(${mountPoint}). Pass a selector or an HTMLElement. Not
						passing any argument will cause the Scene to be mounted
						to the <body>.
					`),
				)
			}

			// The user can mount to a new location without calling unmount
			// first. Call it automatically in that case.
			if (this._mounted) this.unmount()

			if (mountPoint !== this.parentNode) mountPoint.appendChild(this)

			this._mounted = true

			// this.__startOrStopParentSizeObservation()
		}

		/**
		 * Unmount the scene from it's mount point. Resets the Scene's
		 * mountPromise.
		 */
		unmount() {
			if (!this._mounted) return

			this.__stopParentSizeObservation()

			if (this.parentNode) this.parentNode.removeChild(this)

			this._mounted = false
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
						this.__glRenderer?.disableBackground(this)
						return
					}

					if (this.background.match(/\.(jpg|jpeg|png)$/)) {
						// Dispose each time we switch to a new one.
						if (isDisposable(this.three.background)) this.three.background.dispose()

						// destroy the previous one, if any.
						this.__glRenderer!.disableBackground(this)

						console.log('enable background!!')
						this.__glRenderer!.enableBackground(this, this.equirectangularBackground, texture => {
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
						this.__glRenderer?.disableEnvironment(this)
						return
					}

					if (this.environment.match(/\.(jpg|jpeg|png)$/)) {
						// Dispose each time we switch to a new one.
						if (isDisposable(this.three.environment)) this.three.environment.dispose()

						// destroy the previous one, if any.
						this.__glRenderer!.disableEnvironment(this)

						this.__glRenderer!.enableEnvironment(this, texture => {
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
					this.__startOrStopParentSizeObservation()
				}),
			)
		}

		disconnectedCallback() {
			super.disconnectedCallback()
			this.__stopParentSizeObservation()
		}

		protected _mounted = false
		protected _elementParentSize: XYZValuesObject<number>

		makeThreeObject3d() {
			return new ThreeScene()
		}

		makeThreeCSSObject() {
			return new ThreeScene()
		}

		protected _cameraSetup() {
			// this.__threeCamera holds the active camera. There can be many
			// cameras in the scene tree, but the last one with active="true"
			// will be the one referenced here.
			// If there are no cameras in the tree, a virtual default camera is
			// referenced here, who's perspective is that of the scene's
			// perspective attribute.
			// this.__threeCamera = null
			this._createDefaultCamera()
		}

		protected _createDefaultCamera() {
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

		// TODO can this be moved to a render task like _calcSize? It depends
		// on size values.
		protected _updateCameraPerspective() {
			const perspective = this.__perspective
			this.__threeCamera.fov = (180 * (2 * Math.atan(this.calculatedSize.y / 2 / perspective))) / Math.PI
			this.__threeCamera.position.z = perspective
		}

		protected _updateCameraAspect() {
			this.__threeCamera.aspect = this.calculatedSize.x / this.calculatedSize.y || 1
		}

		protected _updateCameraProjection() {
			this.__threeCamera.updateProjectionMatrix()
		}

		// holds active cameras found in the DOM tree (if this is empty, it
		// means no camera elements are in the DOM, but this.__threeCamera
		// will still have a reference to the default camera that scenes
		// are rendered with when no camera elements exist).
		private __activeCameras: Set<PerspectiveCamera> = new Set()

		protected _addCamera(camera: PerspectiveCamera) {
			this.__activeCameras.add(camera)
			this.__setCamera(camera)
		}

		protected _removeCamera(camera: PerspectiveCamera) {
			this.__activeCameras.delete(camera)

			if (this.__activeCameras.size) {
				// get the last camera in the Set
				this.__activeCameras.forEach(c => (camera = c))
				this.__setCamera(camera)
			} else {
				this.__setCamera()
			}
		}

		/** @override */
		protected _getParentSize(): XYZValuesObject<number> {
			return this.parent ? (this.parent as Sizeable).calculatedSize : this._elementParentSize
		}

		// For now, use the same program (with shaders) for all objects.
		// Basically it has position, frag colors, point light, directional
		// light, and ambient light.
		protected _loadGL() {
			// THREE
			// maybe keep this in sceneState in WebGLRendererThree
			if (!super._loadGL()) return false

			this._composedChildren

			// We don't let Three update any matrices, we supply our own world
			// matrices.
			this.three.autoUpdate = false

			// TODO: default ambient light when no AmbientLight elements are
			// present in the Scene.
			//const ambientLight = new AmbientLight( 0x353535 )
			//this.three.add( ambientLight )

			this.__glRenderer = this.__getGLRenderer('three')

			this._glStopFns.push(
				autorun(() => {
					// if this.webgl is true, then _loadGL will have fired,
					// therefore this.__glRenderer must be defined.
					this.__glRenderer!.setClearColor(this, this.backgroundColor, this.backgroundOpacity)
					this.needsUpdate()
				}),
				autorun(() => {
					this.__glRenderer!.setClearAlpha(this, this.backgroundOpacity)
					this.needsUpdate()
				}),
				autorun(() => {
					this.__glRenderer!.setShadowMapType(this, this.shadowmapType)
					this.needsUpdate()
				}),
				autorun(() => {
					// TODO Update to WebXR
					// this.__glRenderer!.enableVR(this, this.vr)
					// if (this.vr) {
					// 	Motor.setFrameRequester(fn => this.__glRenderer!.requestFrame(this, fn))
					// 	this.__glRenderer!.createDefaultWebVREntryUI(this)
					// } else {
					// 	// TODO else return back to normal requestAnimationFrame
					// }
				}),
			)

			this.traverse((node: TreeNode) => {
				// skip `this`, we already handled it above
				if (node === this) return

				if (isImperativeBase(node))
					// @ts-ignore: access protected member
					node._triggerLoadGL()
			})

			return true
		}

		protected _unloadGL() {
			if (!super._unloadGL()) return false

			if (this.__glRenderer) {
				this.__glRenderer.uninitialize(this)
				this.__glRenderer = null
			}

			this.traverse((node: TreeNode) => {
				// skip `this`, we already handled it above
				if (node === this) return

				if (isImperativeBase(node))
					// @ts-ignore: access protected member
					node._triggerUnloadGL()
			})

			// Not all things are loaded in _loadGL (they may be loaded
			// depending on property/attribute values), but all things, if any, should
			// still be disposed in _unloadGL.
			{
				this.three.environment?.dispose()
				if (isDisposable(this.three.background)) this.three.background.dispose()
			}

			return true
		}

		protected _loadCSS() {
			if (!super._loadCSS()) return false

			this.__cssRenderer = this.__getCSSRenderer('three')

			this.traverse((node: TreeNode) => {
				// skip `this`, we already handled it above
				if (node === this) return

				if (isImperativeBase(node))
					// @ts-ignore: access protected member
					node._loadCSS()
			})

			return true
		}

		protected _unloadCSS() {
			if (!super._unloadCSS()) return false

			if (this.__cssRenderer) {
				this.__cssRenderer.uninitialize(this)
				this.__cssRenderer = null
			}

			this.traverse((node: TreeNode) => {
				// skip `this`, we already handled it above
				if (node === this) return

				if (isImperativeBase(node))
					// @ts-ignore: access protected member
					node._unloadCSS()
			})

			return true
		}

		private __glRenderer: WebGLRendererThree | null = null
		private __cssRenderer: CSS3DRendererThree | null = null

		// The idea here is that in the future we might have "babylon",
		// "playcanvas", etc, on a per scene basis. We'd needed to abstract the
		// renderer more, have abstract base classes to define the common
		// interfaces.
		private __getGLRenderer(type: 'three'): WebGLRendererThree {
			if (this.__glRenderer) return this.__glRenderer

			let renderer: WebGLRendererThree

			if (type === 'three') renderer = WebGLRendererThree.singleton()
			else throw new Error('invalid WebGL renderer')

			renderer.initialize(this)

			return renderer
		}

		private __getCSSRenderer(type: 'three') {
			if (this.__cssRenderer) return this.__cssRenderer

			let renderer: CSS3DRendererThree

			if (type === 'three') renderer = CSS3DRendererThree.singleton()
			else throw new Error('invalid CSS renderer. The only type supported is currently "three" (i.e. Three.js).')

			renderer.initialize(this)

			return renderer
		}

		// TODO FIXME: manual camera doesn't work after we've added the
		// default-camera feature.
		private __setCamera(camera?: PerspectiveCamera) {
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

		// private __sizePollTask: RenderTask | null = null
		private __parentSize: XYZValuesObject<number> = {x: 0, y: 0, z: 0}

		// HTM-API
		private __startOrStopParentSizeObservation() {
			if (
				// If we will be rendering something...
				(this.enableCss || this.webgl) &&
				// ...and if one size dimension is proportional...
				(this.sizeMode.x == 'proportional' || this.sizeMode.y == 'proportional')
				// Note, we don't care about the Z dimension, because Scenes are flat surfaces.
			) {
				// ...then observe the parent element size (it may not be a LUME
				// element, so we observe with ResizeObserver).
				this.__startParentSizeObservation()
			} else {
				this.__stopParentSizeObservation()
			}
		}

		private __resizeObserver: ResizeObserver | null = null

		// observe size changes on the scene element.
		// HTM-API
		private __startParentSizeObservation() {
			const parent =
				this.parentNode instanceof HTMLElement
					? this.parentNode
					: this.parentNode instanceof ShadowRoot
					? this.parentNode.host
					: thro('A Scene can only be child of an HTMLElement or ShadowRoot (and f.e. not an SVGElement).')

			// TODO use a single ResizeObserver for all scenes.

			possiblyPolyfillResizeObserver()

			this.__resizeObserver = new ResizeObserver(changes => {
				for (const change of changes) {
					// Use the newer API if available.
					// NOTE We care about the contentBoxSize (not the
					// borderBoxSize) because the content box is the area in
					// which we're rendering visuals.
					if (change.contentBoxSize) {
						// If change.contentBoxSize is an array with more than
						// one item, it means the observed element is split
						// across multiple CSS columns.
						// TODO If the Scene is used as display:inline{-block},
						// ensure that it is the size of the column in which it
						// is located.
						const {inlineSize, blockSize} = Array.isArray(change.contentBoxSize)
							? (change.contentBoxSize[0] as ResizeObserverEntryBoxSize)
							: change.contentBoxSize

						const isHorizontal = getComputedStyle(parent).writingMode.includes('horizontal')

						// If the text writing mode is horizontal, then inlinSize is
						// the width, otherwise in vertical modes it is the height.
						// For more details: https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserverEntry/contentBoxSize#Syntax
						if (isHorizontal) this.__checkSize(inlineSize, blockSize)
						else this.__checkSize(blockSize, inlineSize)
					}
					// Otherwise use the older API (possibly polyfilled)
					else {
						const {width, height} = change.contentRect
						this.__checkSize(width, height)
					}
				}
			})

			this.__resizeObserver.observe(parent)
		}

		// HTM-API
		private __stopParentSizeObservation() {
			this.__resizeObserver?.disconnect()
			this.__resizeObserver = null
		}

		// NOTE, the Z dimension of a scene doesn't matter, it's a flat plane, so
		// we haven't taken that into consideration here.
		// HTM-API
		private __checkSize(x: number, y: number) {
			const parentSize = this.__parentSize

			// if we have a size change, emit parentsizechange
			if (parentSize.x != x || parentSize.y != y) {
				parentSize.x = x
				parentSize.y = y

				this.__onElementParentSizeChange(parentSize)
			}
		}

		// HTM-API
		private __onElementParentSizeChange(newSize: XYZValuesObject<number>) {
			this._elementParentSize = newSize
			// TODO #66 defer _calcSize to an animation frame (via needsUpdate),
			// unless explicitly requested by a user (f.e. they read a prop so
			// the size must be calculated). https://github.com/lume/lume/issues/66
			this._calcSize()
			this.needsUpdate()
		}
	}

	return Scene as MixinResult<typeof Scene, T>
}

function isImperativeBase(_n: TreeNode): _n is ImperativeBase {
	// TODO make sure instanceof works. For all intents and purposes, we assume
	// to always have an ImperativeNode where we use this.
	// return n instanceof ImperativeBase
	return true
}
