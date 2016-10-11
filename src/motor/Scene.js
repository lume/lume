import { makeAccessorsEnumerable } from './Utility'
import Sizeable from './Sizeable'
import ImperativeBase, {initImperativeBase} from './ImperativeBase'
import MotorHTMLScene from '../motor-html/scene'
import documentReady from 'awaitbox/dom/documentReady'

initImperativeBase()

// Scene is Sizeable, which is currently a subset of Transformable.
class Scene extends Sizeable.mixin(ImperativeBase) {
    constructor(options = {}) {
        super(options)

        this._elementParentSize = {x:0, y:0, z:0}

        this._onElementParentSizeChange = (newSize) => {
            this._elementParentSize = newSize
            this._calcSize()
            this._needsToBeRendered()
        }

        // TODO: remove, only Node needs scenePromise stuff.
        this._scene = this
        this._resolveScenePromise(this)

        // For now, Scenes are always proportionally sized by default.
        // TODO: Scene is not Transformable, it contains all the Transformable Nodes, so set sizing by CSS.
        this.sizeMode = { x: 'proportional', y: 'proportional' }

        // TODO: We need to render one time each time mountPromise is resolved,
        // not just this one time in the constructor.
        this._calcSize()
        this._needsToBeRendered()
    }

    // When we set the scene's size mode, we should start polling if it has
    // proportional sizing.
    set sizeMode(newValue) {
        super.sizeMode = newValue
        this._startOrStopSizePolling()
    }
    get sizeMode() {
        return super.sizeMode
    }

    _startOrStopSizePolling() {
        if (
            this._properties.sizeMode.x == 'proportional'
            || this._properties.sizeMode.y == 'proportional'
            || this._properties.sizeMode.z == 'proportional'
        ) {
            this._startSizePolling()
        }
        else {
            this._stopSizePolling()
        }
    }

    _startSizePolling() {
        // observe size changes on the scene element.
        this._el.element._startSizePolling()
        this._el.element.on('parentsizechange', this._onElementParentSizeChange)
    }

    _stopSizePolling() {
        // observe size changes on the scene element.
        this._el.element.off('parentsizechange', this._onElementParentSizeChange)
        this._el.element._stopSizePolling()
    }

    /**
     * @override
     */
    _calcSize() {
        const {x,y,z} = this._calculatedSize
        const previousSize = {x,y,z}

        if (this._properties.sizeMode._x == 'absolute') {
            this._calculatedSize.x = this._properties.absoluteSize._x
        }
        else { // proportional
            this._calculatedSize.x = Math.round(this._properties.proportionalSize._x * this._elementParentSize.x)
        }

        if (this._properties.sizeMode._y == 'absolute') {
            this._calculatedSize.y = this._properties.absoluteSize._y
        }
        else { // proportional
            this._calculatedSize.y = Math.round(this._properties.proportionalSize._y * this._elementParentSize.y)
        }

        if (this._properties.sizeMode._z == 'absolute') {
            this._calculatedSize.z = this._properties.absoluteSize._z
        }
        else { // proportional
            // XXX: z size is always 0, since the scene is always flat.
            this._calculatedSize.z = Math.round(this._properties.proportionalSize._z * this._elementParentSize.z)
        }

        if (
            previousSize.x !== this._calculatedSize.x
            || previousSize.y !== this._calculatedSize.y
            || previousSize.z !== this._calculatedSize.z
        ) {
            const {x,y,z} = this._calculatedSize
            this.triggerEvent('sizechange', {x,y,z})
        }
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
    async mount(mountPoint) {
        // Wait for the document to be ready before mounting, otherwise the
        // target mount point might not exist yet when this function is called.
        if (document.readyState == 'loading') await documentReady()

        // if no mountPoint was provided, just mount onto the <body> element.
        // XXX: Maybe we should just not mount the scene if no mountPoint is
        // provided, and expose a mount method.
        if (!mountPoint) {
            mountPoint = document.body
        }

        // if the user supplied a selector, mount there.
        else if (typeof mountPoint === 'string') {
            let selector = mountPoint
            mountPoint = document.querySelector(selector)
        }

        // if we have an actual mount point (the user may have supplied one)
        if (mountPoint instanceof window.HTMLElement) {
            if (mountPoint !== this._el.element.parentNode)
                mountPoint.appendChild(this._el.element)

            this._mounted = true
        }
        else {
            throw new Error('Invalid mount point specified in Scene.mount() call. Specify a selector, or pass an actual HTMLElement.')
        }

        this._startOrStopSizePolling()

        this._resolveMountPromise(this._mounted)
    }

    /**
     * Unmount the scene from it's mount point. Resets the Scene's
     * mountPromise.
     */
    unmount() {
        this._stopSizePolling()

        if (this._el.element.parentNode)
            this._el.element.parentNode.removeChild(this._el.element)

        this._mounted = false

        // a new promise to be resolved on the next mount.
        this._mountPromise = new Promise(r => this._resolveMountPromise = r)
    }

}

makeAccessorsEnumerable(Scene.prototype)

export {Scene as default}
