
// TODO: write a test that imports public interfaces in every possible
// permutation to detect circular dependency errors.
// See: https://esdiscuss.org/topic/how-to-solve-this-basic-es6-module-circular-dependency-problem

import Transformable from './Transformable'
import Motor from './Motor'

import ImperativeBase, {initImperativeBase} from './ImperativeBase'
import XYZValues from './XYZValues'
import XYZNonNegativeValues from './XYZNonNegativeValues'
import { default as HTMLInterface } from '../html/HTMLScene'
import documentReady from 'awaitbox/dom/documentReady'

import {
    Scene as ThreeScene, // so as not to confuse with Infamous Scene.
    PerspectiveCamera,
    AmbientLight,
    Color,
} from 'three'

initImperativeBase()

const instanceofSymbol = Symbol('instanceofSymbol')

let Scene = null

const SceneMixin = base => {
    class _Scene extends ImperativeBase.mixin(Transformable.mixin(base)) {
        static get defaultElementName() { return 'i-scene' }
        static get _Class() { return Scene }

        construct(options = {}) {
            super.construct(options)

            // Used by the this.scene getter in ImperativeBase
            // Motor's loop checks _scene on Nodes and Scenes when determining
            // modified scenes.
            this._scene = this

            // TODO get default camera values from somewhere.
            this._perspective = 1000

            // NOTE: z size is always 0, since native DOM elements are always flat.
            this._elementParentSize = {x:0, y:0, z:0}

            this._onElementParentSizeChange = (newSize) => {
                this._elementParentSize = newSize
                this._calcSize()
                this._needsToBeRendered()
            }

            this._calcSize()
            this._needsToBeRendered()
        }

        // For now, use the same program (with shaders) for all objects.
        // Basically it has position, frag colors, point light, directional
        // light, and ambient light.
        // TODO: maybe call this in `init()`, and destroy webgl stuff in
        // `deinit()`.
        // TODO: The user might enable this by setting the attribute later, so
        // we can't simply rely on having it in constructor, we need a
        // getter/setter like node properties.
        // TODO: we need to deinit webgl too.
        async initWebGl() {
            // THREE
            // maybe keep this in sceneState in WebGLRendererThree
            super.initWebGl()

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

            const ambientLight = new AmbientLight( 0x353535 )
            this.threeObject3d.add( ambientLight )

            // holds the renderer for this scene, renderers have scene-specific
            // settings so having this reference is okay.
            this._renderer = null

            // a default orange background color. Use the backgroundColor and
            // backgroundOpacity attributes to customize.
            this._glBackgroundColor = new Color( 0xff6600 )
            this._glBackgroundOpacity = 1

            // holds active cameras found in the DOM tree (if this is empty, it
            // means no camera elements are in the DOM, but this.threeCamera
            // will still have a reference to the default camera that scenes
            // are rendered with when no camera elements exist).
            this._activeCameras = new Set

            // TODO: this needs to be cancelable too, search other codes for
            // "mountcancel" to see.
            await this.mountPromise

            this.webglEnabled = !!this.element.hasAttribute('experimental-webgl')
            if (!this.webglEnabled) return

            this._renderer = Motor.getWebGLRenderer(this, 'three')

            // set default colors
            this._renderer.setClearColor( this, this._glBackgroundColor, this._glBackgroundOpacity )
        }

        makeThreeObject3d() {
            return new ThreeScene
        }

        // TODO ability to init and destroy webgl for the whole scene.
        destroyWebGl() {
        }

        // TODO PERFORMANCE: make this static for better performance.
        _setDefaultProperties() {
            super._setDefaultProperties()

            Object.assign(this._properties, {
                sizeMode: new XYZValues('proportional', 'proportional', 'proportional'),
                size: new XYZNonNegativeValues(1, 1, 1),
            })
        }

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
        }

        _createDefaultCamera() {
            const size = this._calculatedSize
            // THREE-COORDS-TO-DOM-COORDS
            // We apply Three perspective the same way as CSS3D perspective here.
            // TODO CAMERA-DEFAULTS, get defaults from somewhere common.
            // TODO the "far" arg will be auto-calculated to encompass the furthest objects (like CSS3D).
            this.threeCamera = new PerspectiveCamera( 45, size.x / size.y || 1, 0.1, 10000 )
            this.perspective = 1000
        }

        // TODO can this be moved to a render task like _calcSize? It depends
        // on size values.
        _updateCameraPerspective() {
            const perspective = this._perspective
            this.threeCamera.fov = 180 * ( 2 * Math.atan( this._calculatedSize.y / 2 / perspective ) ) / Math.PI
            this.threeCamera.position.z = perspective
        }

        set perspective(value) {
            this._perspective = value
            this._updateCameraPerspective()
            this._updateCameraProjection()
            this._needsToBeRendered()
        }
        get perspective() {
            return this._perspective
        }

        _updateCameraAspect() {
            this.threeCamera.aspect = this._calculatedSize.x / this._calculatedSize.y || 1
        }

        _updateCameraProjection() {
            this.threeCamera.updateProjectionMatrix()
        }

        _addCamera( camera ) {
            this._activeCameras.add( camera )
            this._setCamera( camera )
        }

        _removeCamera( camera ) {
            this._activeCameras.delete( camera )

            if ( this._activeCameras.size ) {
                // get the last camera in the Set
                this._activeCameras.forEach(c => camera = c)
            }
            else camera = null

            this._setCamera( camera )
        }

        /** @override */
        _getParentSize() {
            return this._mounted ? this._elementParentSize : {x:0,y:0,z:0}
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
        async mount(mountPoint) {
            // Wait for the document to be ready before mounting, otherwise the
            // target mount point might not exist yet when this function is called.
            if (document.readyState == 'loading') await documentReady()

            // if no mountPoint was provided, just mount onto the <body> element.
            if (mountPoint === undefined) mountPoint = document.body

            // if the user supplied a selector, mount there.
            else if (typeof mountPoint === 'string')
                mountPoint = document.querySelector(mountPoint)

            // if we have an actual mount point (the user may have supplied one)
            if (!(mountPoint instanceof window.HTMLElement))
                throw new Error('Invalid mount point specified in Scene.mount() call. Pass a selector, an actual HTMLElement, or don\'t pass anything to mount to <body>.')

            if (this._mounted) this.unmount()

            if (mountPoint !== this.parentNode)
                mountPoint.appendChild(this)

            this._mounted = true

            if (this._mountPromise) this._resolveMountPromise()

            this._elementOperations.shouldRender()
            this._startOrStopSizePolling()
        }

        /**
         * Unmount the scene from it's mount point. Resets the Scene's
         * mountPromise.
         */
        unmount() {
            if (!this._mounted) return

            this._elementOperations.shouldNotRender()
            this._stopSizePolling()

            if (this.parentNode)
                this.parentNode.removeChild(this)

            if (this._mountPromise) this._rejectMountPromise('mountcancel')
            this._resetMountPromise()
        }

        set sizeMode(value) {
            super.sizeMode = value
            this._startOrStopSizePolling()
        }

        static get observedAttributes() {
            const superAttrs = super.observedAttributes || []
            return superAttrs.concat( [
                'backgroundcolor',
                'background-color',
                'backgroundopacity',
                'background-opacity',
                'shadowmaptype',
                'shadowmap-type',
            ] )
        }

        async attributeChangedCallback(attr, oldVal, newVal) {
            super.attributeChangedCallback(attr, oldVal, newVal)

            // We need to await mountPromise here so that we set values *after*
            // values are set in initWebGl
            //
            // TODO: this needs to be cancelable too, search other codes for
            // "mountcancel" to see.
            await this.mountPromise

            if ( attr == 'backgroundcolor' ) {

                // TODO: generic type system for attributes. It will eliminate
                // duplication here.

                this.processClearColorValue( attr, newVal )
                this._needsToBeRendered()

            }
            else if ( attr == 'backgroundopacity' ) {
                this.processClearAlphaValue( attr, newVal )
                this._needsToBeRendered()
            }
            else if ( attr == 'shadowmaptype' || attr == 'shadowmap-type' ) {
                this._renderer.setShadowMapType(this, newVal)
                this._needsToBeRendered()
            }
        }

        processClearColorValue( attr, value ) {

            // if a triplet of space-separated RGB numbers
            if ( value.match( /^\s*\d+\s+\d+\s+\d+\s*$/ ) ) {
                value = value.trim().split( /\s+/ ).map( n => parseFloat(n)/255 )
                this._glBackgroundColor = new Color( ...value )
            }
            // otherwise a CSS-style color string
            else {
                this._glBackgroundColor = new Color( value )
            }

            this._renderer.setClearColor( this, this._glBackgroundColor, this._glBackgroundOpacity )

        }

        // TODO this is mostly duplicated from PointLight.processNumberValue, consolidate, needs typing.
        processClearAlphaValue( attr, value ) {
            const alpha = this._glBackgroundOpacity = parseFloat( value )

            if ( ! value.match( /^\s*(\d+|\d*(.\d+)|(\d+.)\d*)\s*$/ ) ) {

                console.warn( (
                    `The value for the "${ attr }" attribute should be a
                    number. It will be passed to window.parseFloat. Your value
                    ("${ value }") will be converted to the number ${ alpha }.`
                ).replace( /\s+/g, ' ' ) )

            }

            this._renderer.setClearAlpha( this, alpha)
        }

    }

    Object.defineProperty(_Scene, Symbol.hasInstance, {
        value: function(obj) {
            if (this !== _Scene) return Object.getPrototypeOf(_Scene)[Symbol.hasInstance].call(this, obj)

            let currentProto = obj

            while(currentProto) {
                const desc = Object.getOwnPropertyDescriptor(currentProto, "constructor")

                if (desc && desc.value && desc.value.hasOwnProperty(instanceofSymbol))
                    return true

                currentProto = Object.getPrototypeOf(currentProto)
            }

            return false
        }
    })

    _Scene[instanceofSymbol] = true

    return _Scene
}

Scene = SceneMixin(class{})
Scene.mixin = SceneMixin

// TODO for now, hard-mixin the HTMLInterface class. We'll do this automatically later.
Scene = Scene.mixin(HTMLInterface)

export {Scene as default}
