
// TODO: write a test that imports public interfaces in every possible
// permutation to detect circular dependency errors.
// See: https://esdiscuss.org/topic/how-to-solve-this-basic-es6-module-circular-dependency-problem

import Class from 'lowclass'
import documentReady from '@awaitbox/document-ready'

import Mixin from './Mixin'
import Motor from './Motor'
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

    return Class('Scene').extends( Parent, ({ Super }) => ({

        static: {
            defaultElementName: 'i-scene',

            props: {
                ...Parent.props,
                backgroundColor: props.THREE.Color,
                backgroundOpacity: props.number,
                shadowmapType: props.string,
                vr: props.boolean,
                experimentalWebgl: props.boolean,
            },
        },

        constructor(options = {}) {
            const self = Super(this).constructor(options)

            // Used by the `scene` getter in ImperativeBase
            // Motor's loop checks _scene on Nodes and Scenes when determining
            // modified scenes.
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
        initWebGl() {
            // THREE
            // maybe keep this in sceneState in WebGLRendererThree
            Super(this).initWebGl()

            // We don't let Three update any matrices, we supply our own world
            // matrices.
            this.threeObject3d.autoUpdate = false

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
            //this.threeObject3d.add( ambientLight )

            // holds the renderer for this scene, renderers have scene-specific
            // settings so having this reference is okay.
            this._renderer = null

            // a default orange background color. Use the backgroundColor and
            // backgroundOpacity attributes to customize.
            this._glBackgroundColor = new Color( 0xff6600 )
            this._glBackgroundOpacity = 0

            // holds active cameras found in the DOM tree (if this is empty, it
            // means no camera elements are in the DOM, but this.threeCamera
            // will still have a reference to the default camera that scenes
            // are rendered with when no camera elements exist).
            this._activeCameras = new Set

            this._renderer = Motor.getWebGLRenderer(this, 'three')

            // set default colors
            this._renderer.setClearColor( this, this._glBackgroundColor, this._glBackgroundOpacity )
        },

        makeThreeObject3d() {
            return new ThreeScene
        },

        // TODO ability to init and destroy webgl for the whole scene.
        destroyWebGl() {
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
                this.threeCamera = camera.threeObject3d
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
                if (!document.body) await documentReady()
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
            Super(this).updated(oldProps, oldState, moddedProps)

            if (!this.isConnected) return

            if (moddedProps.experimentalWebgl) {
                if (this.experimentalWebgl) this.initWebGl()
                else this.disposeWebGL()
            }

            if (this.experimentalWebgl) {
                if (moddedProps.backgroundColor) {
                    this._renderer.setClearColor( this, this.backgroundColor, this.backgroundOpacity )
                    this._needsToBeRendered()
                }
                if (moddedProps.backgroundOpacity) {
                    this._renderer.setClearAlpha( this, this.backgroundOpacity )
                    this._needsToBeRendered()
                }
                if (moddedProps.shadowmapType) {
                    this._renderer.setShadowMapType(this, this.shadowmapType)
                    this._needsToBeRendered()
                }
                if (moddedProps.vr) {
                    this._renderer.enableVR( this, this.vr)

                    if ( this.vr ) {
                        Motor.setFrameRequester( fn => this._renderer.requestFrame( this, fn ) )
                        this._renderer.createDefaultWebVREntryUI( this )
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
