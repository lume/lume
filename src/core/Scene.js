
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
// Sizeable is used in this file.
import Sizeable from './Sizeable'

import ImperativeBase, {initImperativeBase} from './ImperativeBase'
import XYZValues from './XYZValues'
import MotorHTMLScene from '../html/scene'
import documentReady from 'awaitbox/dom/documentReady'

initImperativeBase()

// Scene is Sizeable, which is currently a subset of Transformable.
const ParentClass = ImperativeBase.mixin(Sizeable)
class Scene extends ParentClass {
    constructor(options = {}) {
        super(options)

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

    _setDefaultProperties() {
        super._setDefaultProperties()

        Object.assign(this._properties, {
            sizeMode: new XYZValues('proportional', 'proportional', 'absolute'),
        })
    }

    _startOrStopSizePolling() {
        if (
            this._mounted &&
            (this._properties.sizeMode.x == 'proportional'
            || this._properties.sizeMode.y == 'proportional'
            || this._properties.sizeMode.z == 'proportional')
        ) {
            this._startSizePolling()
        }
        else {
            this._stopSizePolling()
        }
    }

    // observe size changes on the scene element.
    _startSizePolling() {
        if (!this._elementManager) return
        this._elementManager.element._startSizePolling()
        this._elementManager.element.on('parentsizechange', this._onElementParentSizeChange)
    }

    // Don't observe size changes on the scene element.
    _stopSizePolling() {
        if (!this._elementManager) return
        this._elementManager.element.off('parentsizechange', this._onElementParentSizeChange)
        this._elementManager.element._stopSizePolling()
    }

    /** @override */
    _getParentSize() {
        return this._mounted ? this._elementParentSize : {x:0,y:0,z:0}
    }

    /**
     * @override
     */
    _makeElement() {
        return new MotorHTMLScene
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
    mount(mountPoint) {
        const mountLogic = () => {
            // if no mountPoint was provided, just mount onto the <body> element.
            if (mountPoint === undefined) mountPoint = document.body

            // if the user supplied a selector, mount there.
            else if (typeof mountPoint === 'string')
                mountPoint = document.querySelector(mountPoint)

            // if we have an actual mount point (the user may have supplied one)
            if (!(mountPoint instanceof window.HTMLElement))
                throw new Error('Invalid mount point specified in Scene.mount() call. Pass a selector, an actual HTMLElement, or don\'t pass anything to mount to <body>.')

            if (this._mounted) this.unmount()

            if (mountPoint !== this._elementManager.element.parentNode)
                mountPoint.appendChild(this._elementManager.element)

            this._mounted = true

            if (this._mountPromise) this._resolveMountPromise()

            this._elementManager.shouldRender()
            this._startOrStopSizePolling()
        }

        // Wait for the document to be ready before mounting, otherwise the
        // target mount point might not exist yet when this function is called.
        if (document.readyState == 'loading') return documentReady().then(mountLogic)
        else {
            mountLogic()
            return Promise.resolve()
        }
    }
    //async mount(mountPoint) {
        //// Wait for the document to be ready before mounting, otherwise the
        //// target mount point might not exist yet when this function is called.
        //if (document.readyState == 'loading') await documentReady()

        //// if no mountPoint was provided, just mount onto the <body> element.
        //if (mountPoint === undefined) mountPoint = document.body

        //// if the user supplied a selector, mount there.
        //else if (typeof mountPoint === 'string')
            //mountPoint = document.querySelector(mountPoint)

        //// if we have an actual mount point (the user may have supplied one)
        //if (!(mountPoint instanceof window.HTMLElement))
            //throw new Error('Invalid mount point specified in Scene.mount() call. Pass a selector, an actual HTMLElement, or don\'t pass anything to mount to <body>.')

        //if (this._mounted) this.unmount()

        //if (mountPoint !== this._elementManager.element.parentNode)
            //mountPoint.appendChild(this._elementManager.element)

        //this._mounted = true

        //if (this._mountPromise) this._resolveMountPromise()

        //this._elementManager.shouldRender()
        //this._startOrStopSizePolling()
    //}

    /**
     * Unmount the scene from it's mount point. Resets the Scene's
     * mountPromise.
     */
    unmount() {
        if (!this._mounted) return

        this._elementManager.shouldNotRender()
        this._stopSizePolling()

        if (this._elementManager.element.parentNode)
            this._elementManager.element.parentNode.removeChild(this._elementManager.element)

        if (this._mountPromise) this._rejectMountPromise('mountcancel')
        this._resetMountPromise()
    }

}

// Here we know that `super` is Sizeable
const {set: superSizeModeSet, get: superSizeModeGet} = Object.getOwnPropertyDescriptor(Sizeable.prototype, 'sizeMode')

Object.defineProperties(Scene.prototype, {

    // When we set the scene's size mode, we should start polling if it has
    // proportional sizing.
    sizeMode: {
        set: function(value) {
            superSizeModeSet.call(this, value)
            this._startOrStopSizePolling()
        },
        get: function() {
            return superSizeModeGet.call(this)
        },
        configurable: true,
        enumerable: true,
    }

})

export {Scene as default}
