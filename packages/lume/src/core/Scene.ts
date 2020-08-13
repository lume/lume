// TODO: write a test that imports public interfaces in every possible
// permutation to detect circular dependency errors.
// See: https://esdiscuss.org/topic/how-to-solve-this-basic-es6-module-circular-dependency-problem

import {Mixin, MixinResult, Constructor} from 'lowclass'
import {reactive, autorun, booleanAttribute, attribute, numberAttribute} from '@lume/element'
import {emits} from '@lume/eventful'
import documentReady from '@awaitbox/document-ready'
import {
	Scene as ThreeScene,
	PerspectiveCamera as ThreePerspectiveCamera,
	//AmbientLight,
	Color,
} from 'three'
import Motor, {RenderTask} from './Motor'
import {WebGLRendererThree, ShadowMapTypeString} from './WebGLRendererThree'
import {CSS3DRendererThree} from './CSS3DRendererThree'
import ImperativeBase, {initImperativeBase} from './ImperativeBase'
import XYZSizeModeValues from './XYZSizeModeValues'
import XYZNonNegativeValues from './XYZNonNegativeValues'
import {default as HTMLInterface} from '../html/HTMLScene'
import {documentBody} from './Utility'
import {PerspectiveCamera} from './Camera'
import {XYZValuesObject} from './XYZValues'
import Sizeable from './Sizeable'
import TreeNode from './TreeNode'

import type {TColor} from '../utils/three'

initImperativeBase()

function SceneMixin<T extends Constructor>(Base: T) {
	// NOTE for now, we assume Scene is mixed with its HTMLInterface.
	const Parent = ImperativeBase.mixin(Constructor<HTMLInterface>(Base))

	class Scene extends Parent {
		static defaultElementName = 'i-scene'

		isScene = true

		@reactive @emits('propertychange') @attribute backgroundColor: TColor = new Color('white')
		@reactive @emits('propertychange') @numberAttribute(0) backgroundOpacity = 0
		@reactive @emits('propertychange') @attribute shadowmapType: ShadowMapTypeString = 'basic'
		@reactive @emits('propertychange') @booleanAttribute(false) vr = false
		@reactive @emits('propertychange') @booleanAttribute(false) experimentalWebgl = false
		@reactive @emits('propertychange') @booleanAttribute(false) disableCss = false

		/** @override */
		sizeMode = new XYZSizeModeValues('proportional', 'proportional', 'literal')
		/** @override */
		size = new XYZNonNegativeValues(1, 1, 0)

		three!: ThreeScene
		threeCSS!: ThreeScene

		@reactive private __threeCamera!: ThreePerspectiveCamera

		get threeCamera(): ThreePerspectiveCamera {
			return this.__threeCamera
		}

		// Used by the `scene` getter in ImperativeBase
		protected _scene: Scene | null = this
		// protected _scene: this | null = this

		constructor(...args: any[]) {
			super(...args)

			// The scene should always render CSS properties (it needs to always
			// be rendered on resized, for example, because it contains the
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

		@reactive
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
			if (!mountPoint) {
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
			if (!(mountPoint instanceof HTMLElement)) {
				throw new Error(`
                    Invalid mount point specified in Scene.mount() call. Pass a
                    selector, an actual HTMLElement, or don\'t pass anything to
                    mount to <body>.
                `)
			}

			// The user can mount to a new location without calling unmount
			// first. Call it automatically in that case.
			if (this._mounted) this.unmount()

			if (mountPoint !== this.parentNode) mountPoint.appendChild(this)

			this._mounted = true

			this.__startOrStopSizePolling()
		}

		/**
		 * Unmount the scene from it's mount point. Resets the Scene's
		 * mountPromise.
		 */
		unmount() {
			if (!this._mounted) return

			this.__stopSizePolling()

			if (this.parentNode) this.parentNode.removeChild(this)

			this._mounted = false
		}

		connectedCallback() {
			super.connectedCallback()

			this._stopFns.push(
				autorun(() => {
					if (this.experimentalWebgl) this._triggerLoadGL()
					else this._triggerUnloadGL()
				}),
				autorun(() => {
					if (!this.disableCss) this._triggerLoadCSS()
					else this._triggerUnloadCSS()
				}),
				autorun(() => {
					if (this.disableCss && !this.experimentalWebgl) return this.__stopSizePolling()

					this.sizeMode
					this.__startOrStopSizePolling()
				}),
			)
		}

		protected _mounted = false
		protected _elementParentSize: XYZValuesObject<number>

		protected _makeThreeObject3d() {
			return new ThreeScene()
		}

		protected _makeThreeCSSObject() {
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
			const size = this.calculatedSize
			// THREE-COORDS-TO-DOM-COORDS
			// We apply Three perspective the same way as CSS3D perspective here.
			// TODO CAMERA-DEFAULTS, get defaults from somewhere common.
			// TODO the "far" arg will be auto-calculated to encompass the furthest objects (like CSS3D).
			// TODO update with calculatedSize in autorun
			this.__threeCamera = new ThreePerspectiveCamera(45, size.x / size.y || 1, 0.1, 10000)
			this.perspective = this.perspective
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

			console.log('    ---------------------------- LOAD SCENE GL')
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
					// if this.experimentalWebgl is true, then this.__glRenderer must be defined
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
					this.__glRenderer!.enableVR(this, this.vr)

					if (this.vr) {
						Motor.setFrameRequester(fn => this.__glRenderer!.requestFrame(this, fn))
						this.__glRenderer!.createDefaultWebVREntryUI(this)
					} else {
						// TODO else return back to normal requestAnimationFrame
					}
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

			console.log('    ---------------------------- UNLOAD SCENE GL')

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

			return true
		}

		protected _loadCSS() {
			if (!super._loadCSS()) return false

			console.log('    ---------------------------- LOAD SCENE CSS')

			this.__cssRenderer = this.__getCSSRenderer('three')

			this.traverse((node: TreeNode) => {
				// skip `this`, we already handled it above
				if (node === this) return

				if (isImperativeBase(node))
					// @ts-ignore: access protected member
					node._loadCSS()
			})

			console.log([].map.call(this.children, (n: any) => [n.constructor.name, n.parent, n.position]))

			setTimeout(() => {
				console.log([].map.call(this.children, (n: any) => [n.constructor.name, n.parent, n.position]))
			}, 1000)

			return true
		}

		protected _unloadCSS() {
			if (!super._unloadCSS()) return false

			console.log('    ---------------------------- UNLOAD SCENE CSS')

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

		private __sizePollTask: RenderTask | null = null
		private __parentSize: XYZValuesObject<number> = {x: 0, y: 0, z: 0}

		// HTM-API
		private __startOrStopSizePolling() {
			if (
				this._mounted &&
				(this.sizeMode.x == 'proportional' ||
					this.sizeMode.y == 'proportional' ||
					this.sizeMode.z == 'proportional')
			) {
				this.__startSizePolling()
			} else {
				this.__stopSizePolling()
			}
		}

		// observe size changes on the scene element.
		// HTM-API
		private __startSizePolling() {
			// NOTE Polling is currently required because there's no other way to do this
			// reliably, not even with MutationObserver. ResizeObserver hasn't
			// landed in browsers yet.
			if (!this.__sizePollTask) this.__sizePollTask = Motor.addRenderTask(this.__checkSize.bind(this))
			this.on('parentsizechange', this.__onElementParentSizeChange, this)
		}

		// HTM-API
		private __stopSizePolling() {
			this.off('parentsizechange', this.__onElementParentSizeChange, this)
			Motor.removeRenderTask(this.__sizePollTask!)
			this.__sizePollTask = null
		}

		// NOTE, the Z dimension of a scene doesn't matter, it's a flat plane, so
		// we haven't taken that into consideration here.
		// HTM-API
		private __checkSize() {
			const parent = this.parentNode! as Element
			const parentSize = this.__parentSize
			const style = getComputedStyle(parent)
			const width = parseFloat(style.width || '0')
			const height = parseFloat(style.height || '0')

			// if we have a size change, emit parentsizechange
			if (parentSize.x != width || parentSize.y != height) {
				parentSize.x = width
				parentSize.y = height

				this.emit('parentsizechange', Object.assign({}, parentSize))
			}
		}

		// HTM-API
		private __onElementParentSizeChange(newSize: XYZValuesObject<number>) {
			this._elementParentSize = newSize
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

// TODO cleanup above parentsizechange code

const _Scene = Mixin(SceneMixin)
// TODO for now, hard-mixin the HTMLInterface class. We'll do this automatically later.
export const Scene = _Scene.mixin(HTMLInterface)
export interface Scene extends InstanceType<typeof Scene> {}
// export interface Scene extends InstanceType<typeof _Scene> {}
export default Scene
