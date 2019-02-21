
// TODO: write a test that imports public interfaces in every possible
// permutation to detect circular dependency errors.
// See: https://esdiscuss.org/topic/how-to-solve-this-basic-es6-module-circular-dependency-problem

import Class from 'lowclass'
import documentReady from '@awaitbox/document-ready'

import Mixin from './Mixin'
import Motor from './Motor'
import {getWebGLRendererThree, destroyWebGLRendererThree} from './WebGLRendererThree'
import {getCSS3DRendererThree, destroyCSS3DRendererThree} from './CSS3DRendererThree'
import ImperativeBase, {initImperativeBase} from './ImperativeBase'
import XYZSizeModeValues from './XYZSizeModeValues'
import XYZNonNegativeValues from './XYZNonNegativeValues'
import { default as HTMLInterface } from '../html/HTMLScene'
import { props } from './props'

import {
    Scene as ThreeScene, // so as not to confuse with Infamous Scene.
    PerspectiveCamera,
    //AmbientLight,
    Color,
} from 'three'

initImperativeBase()

let Scene = Mixin(Base => {

    const Parent = ImperativeBase.mixin( Base )

    return Class('Scene').extends( Parent, ({ Super, Public, Protected, Private }) => ({

        static: {
            defaultElementName: 'i-scene',

            props: {
                ...Parent.props,
                backgroundColor: props.THREE.Color,
                backgroundOpacity: props.number,
                shadowmapType: props.string,
                vr: props.boolean,
                experimentalWebgl: props.boolean,
                disableCss: props.boolean,
            },
        },

        constructor(options = {}) {
            const self = Super(this).constructor(options)

            // Used by the `scene` getter in ImperativeBase
            self._scene = self

            self._mounted = false

            // TODO get default camera values from somewhere.
            self._perspective = 1000

            // size of the element where the Scene is mounted
            // NOTE: z size is always 0, since native DOM elements are always flat.
            self._elementParentSize = {x:0, y:0, z:0}

            self._calcSize()
            self._needsToBeRendered()

            return self
        },

        _onElementParentSizeChange(newSize) {
            this._elementParentSize = newSize
            this._calcSize()
            this._needsToBeRendered()
        },

        // For now, use the same program (with shaders) for all objects.
        // Basically it has position, frag colors, point light, directional
        // light, and ambient light.
        // TODO: maybe call this in `init()`, and destroy webgl stuff in
        // `deinit()`.
        // TODO: The user might enable this by setting the attribute later, so
        // we can't simply rely on having it in constructor, we need a
        // getter/setter like node properties.
        // TODO: we need to deinit webgl too.
        initWebGL() {
            if (Protected(this).__glLoaded) return

            // THREE
            // maybe keep this in sceneState in WebGLRendererThree
            Super(this).initWebGL()

            // We don't let Three update any matrices, we supply our own world
            // matrices.
            this.three.autoUpdate = false

            // this.threeCamera holds the active camera. There can be many
            // cameras in the scene tree, but the last one with active="true"
            // will be the one referenced here.
            // If there are no cameras in the tree, a virtual default camera is
            // referenced here, who's perspective is that of the scene's
            // perspective attribute.
            this.threeCamera = null
            this._createDefaultCamera()

            // TODO: default ambient light when no AmbientLight elements are
            // present in the Scene.
            //const ambientLight = new AmbientLight( 0x353535 )
            //this.three.add( ambientLight )

            // a default orange background color. Use the backgroundColor and
            // backgroundOpacity attributes to customize.
            this._glBackgroundColor = new Color( 0xff6600 )
            this._glBackgroundOpacity = 0

            // holds active cameras found in the DOM tree (if this is empty, it
            // means no camera elements are in the DOM, but this.threeCamera
            // will still have a reference to the default camera that scenes
            // are rendered with when no camera elements exist).
            this._activeCameras = new Set

            Private(this).__glRenderer = Private(this).__getRenderer('three')

            // set default colors
            Private(this).__glRenderer.setClearColor( this, this._glBackgroundColor, this._glBackgroundOpacity )

            this.traverse((node) => {
                // skip `this`, we already handled it above
                if (node === this) return

                node.initWebGL()
            })
        },

        makeThreeObject3d() {
            return new ThreeScene
        },

        initCSS() {
            if (Protected(this).__cssLoaded) return

            Super(this).initCSS()

            Private(this).__cssRenderer = Private(this).__getCSSRenderer('three')

            this.traverse((node) => {
                // skip `this`, we already handled it above
                if (node === this) return

                node.initCSS()
            })
        },

        makeThreeCSSObject() {
            return new ThreeScene
        },

        drawScene() {
            // if (scene.experimentalWebgl)
                Private(this).__glRenderer.drawScene(this)
            Private(this).__cssRenderer.drawScene(this)
        },

        private: {
            __glRenderer: null,
            __cssRenderer: null,

            // The idea here is that in the future we might have "babylon",
            // "playcanvas", etc, on a per scene basis.
            __getRenderer(type) {
                const scene = Public(this)

                if (this.__glRenderer) return this.__glRenderer

                let rendererGetter = null

                if (type === "three")
                    rendererGetter = getWebGLRendererThree
                else throw new Error('invalid WebGL renderer')

                const renderer = rendererGetter(scene)
                renderer.initialize(scene)

                return renderer
            },

            __getCSSRenderer(type) {
                const scene = Public(this)

                if (this.__cssRenderer) return this.__cssRenderer

                let rendererGetter = null

                if (type === "three")
                    rendererGetter = getCSS3DRendererThree
                else throw new Error('invalid WebGL renderer')

                const renderer = rendererGetter(scene)
                renderer.initialize(scene)

                return renderer
            },
        },

        // TODO ability to init and destroy webgl for the whole scene based on prop change
        destroyWebGl() {
            // destroyWebGLRendererThree
            // destroyCSS3DRendererThree
        },

        // TODO PERFORMANCE: make this static for better performance.
        _setDefaultProperties() {
            Super(this)._setDefaultProperties()

            Object.assign(this._properties, {
                sizeMode: new XYZSizeModeValues('proportional', 'proportional', 'proportional'),
                size: new XYZNonNegativeValues(1, 1, 1),
            })
        },

        // TODO FIXME: manual camera doesn't work after we've added the
        // default-camera feature.
        _setCamera( camera ) {
            if ( !camera ) {
                this._createDefaultCamera()
            }
            else {
                // TODO?: implement an changecamera event/method and emit/call
                // that here, then move this logic to the renderer
                // handler/method?
                this.threeCamera = camera.three
                this._updateCameraAspect()
                this._updateCameraProjection()
                this._needsToBeRendered()
            }
        },

        _createDefaultCamera() {
            const size = this._calculatedSize
            // THREE-COORDS-TO-DOM-COORDS
            // We apply Three perspective the same way as CSS3D perspective here.
            // TODO CAMERA-DEFAULTS, get defaults from somewhere common.
            // TODO the "far" arg will be auto-calculated to encompass the furthest objects (like CSS3D).
            this.threeCamera = new PerspectiveCamera( 45, size.x / size.y || 1, 0.1, 10000 )
            this.perspective = 1000
        },

        // TODO can this be moved to a render task like _calcSize? It depends
        // on size values.
        _updateCameraPerspective() {
            const perspective = this._perspective
            this.threeCamera.fov = 180 * ( 2 * Math.atan( this._calculatedSize.y / 2 / perspective ) ) / Math.PI
            this.threeCamera.position.z = perspective
        },

        // TODO perspective SkateJS prop
        set perspective(value) {
            this._perspective = value
            this._updateCameraPerspective()
            this._updateCameraProjection()
            this._needsToBeRendered()
        },
        get perspective() {
            return this._perspective
        },

        _updateCameraAspect() {
            this.threeCamera.aspect = this._calculatedSize.x / this._calculatedSize.y || 1
        },

        _updateCameraProjection() {
            this.threeCamera.updateProjectionMatrix()
        },

        _addCamera( camera ) {
            this._activeCameras.add( camera )
            this._setCamera( camera )
        },

        _removeCamera( camera ) {
            this._activeCameras.delete( camera )

            if ( this._activeCameras.size ) {
                // get the last camera in the Set
                this._activeCameras.forEach(c => camera = c)
            }
            else camera = null

            this._setCamera( camera )
        },

        /** @override */
        _getParentSize() {
            return this.parent ? this.parent._calculatedSize : this._elementParentSize
        },

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
        async mount(mountPoint) {
            // if no mountPoint was provided, just mount onto the <body> element.
            if (mountPoint === undefined) {
                if (!document.body) await documentBody()
                mountPoint = document.body
            }

            // if the user supplied a selector, mount there.
            else if (typeof mountPoint === 'string') {
                mountPoint = document.querySelector(mountPoint)
                if (!mountPoint && document.readyState === 'loading') {
                    // maybe the element wasn't parsed yet, check again when the
                    // document is ready.
                    await documentReady()
                    mountPoint = document.querySelector(mountPoint)
                }
            }

            // if we have an actual mount point (the user may have supplied one)
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

            if (mountPoint !== this.parentNode)
                mountPoint.appendChild(this)

            this._mounted = true

            this._startOrStopSizePolling()
        },

        /**
         * Unmount the scene from it's mount point. Resets the Scene's
         * mountPromise.
         */
        unmount() {
            if (!this._mounted) return

            this._stopSizePolling()

            if (this.parentNode)
                this.parentNode.removeChild(this)

            this._mounted = false
        },

        updated(oldProps, oldState, moddedProps) {
            if (!this.isConnected) return

            if (moddedProps.experimentalWebgl) {
                if (this.experimentalWebgl) this.initWebGL()
                else this.disposeWebGL() // <-- TODO, currently a no-op
            }

            if (moddedProps.disableCss) {
                if (!this.disableCss) this.initCSS()
                else this.disposeCSS() // <-- TODO, currently a no-op
            }

            // call super.updated() after the above initWebGL() so that WebGL
            // stuff will be ready in super.updated()
            Super(this).updated(oldProps, oldState, moddedProps)

            if (this.experimentalWebgl) {
                if (moddedProps.backgroundColor) {
                    Private(this).__glRenderer.setClearColor( this, this.backgroundColor, this.backgroundOpacity )
                    this._needsToBeRendered()
                }
                if (moddedProps.backgroundOpacity) {
                    Private(this).__glRenderer.setClearAlpha( this, this.backgroundOpacity )
                    this._needsToBeRendered()
                }
                if (moddedProps.shadowmapType) {
                    Private(this).__glRenderer.setShadowMapType(this, this.shadowmapType)
                    this._needsToBeRendered()
                }
                if (moddedProps.vr) {
                    Private(this).__glRenderer.enableVR( this, this.vr)

                    if ( this.vr ) {
                        Motor.setFrameRequester( fn => Private(this).__glRenderer.requestFrame( this, fn ) )
                        Private(this).__glRenderer.createDefaultWebVREntryUI( this )
                    }
                    else {
                        // TODO else return back to normal requestAnimationFrame
                    }
                }
            }

            if (moddedProps.sizeMode) {
                this._startOrStopSizePolling()
            }
        },

    }))

})

// TODO for now, hard-mixin the HTMLInterface class. We'll do this automatically later.
Scene = Scene.mixin(HTMLInterface)

export {Scene as default}

function documentBody() {
    return new Promise(resolve => {
        if (document.body) return resolve()

        const observer = new MutationObserver(() => {
            if (document.body) {
                resolve()
                observer.disconnect()
            }
        })

        observer.observe(document.documentElement, {childList: true})
    })
}
