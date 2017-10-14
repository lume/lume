
// although Transformable is not used in this file, importing it first prevents
// a cyclical dependeny problem when an app entrypoint imports ./Scene.js
// before ./Node.js (Sizeable imports Motor which imports Transformable which
// imports Sizeable). See:
// https://esdiscuss.org/topic/how-to-solve-this-basic-es6-module-circular-dependency-problem
// TODO: write a test that imports public interfaces in every possible
// permutation to detect circular dependency errors.
//
// Transformable is not used in this file, but importing here solves the
// circular dependency problem.
import Transformable from './Transformable'
// Sizeable on the other hand is used in this file.
import Sizeable from './Sizeable'
import Motor from './Motor'

import ImperativeBase, {initImperativeBase} from './ImperativeBase'
import XYZValues from './XYZValues'
import { default as HTMLInterface } from '../html/HTMLScene'
import documentReady from 'awaitbox/dom/documentReady'

import {
    Scene as ThreeScene, // so as not to confuse with Infamous Scene.
    PerspectiveCamera,
} from 'three'

initImperativeBase()

const instanceofSymbol = Symbol('instanceofSymbol')

let Scene = null

const SceneMixin = base => {
    // Scene is Sizeable, which is currently a subset of Transformable.
    class _Scene extends ImperativeBase.mixin(Sizeable.mixin(base)) {
        static get defaultElementName() { return 'i-scene' }
        static get _Class() { return Scene }

        construct(options = {}) {
            super.construct(options)

            // Used by the this.scene getter in ImperativeBase
            // Motor's loop checks _scene on Nodes and Scenes when determining
            // modified scenes.
            this._scene = this

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

            this.threeCamera = new PerspectiveCamera( 75, 16/9, 0.1, 1000 ),

            // TODO: this needs to be cancelable too, search other codes for
            // "mountcancel" to see.
            await this.mountPromise

            this.webglEnabled = !!this.element.hasAttribute('experimental-webgl')
            if (!this.webglEnabled) return
            Motor.initWebGlRender(this, 'three')
        }

        makeThreeObject3d() {
            return new ThreeScene
        }

        // TODO
        destroyWebGl() {
        }

        _setDefaultProperties() {
            super._setDefaultProperties()

            Object.assign(this._properties, {
                sizeMode: new XYZValues('proportional', 'proportional', 'absolute'),
            })
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
