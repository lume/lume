import Sizeable from './Sizeable'
import ImperativeBase, {initImperativeBase} from './ImperativeBase'
import MotorHTMLScene from '../motor-html/scene'
import documentReady from 'awaitbox/dom/documentReady'

initImperativeBase()

// Scene is Sizeable, which is currently a subset of Transformable.
class Scene extends Sizeable.mixin(ImperativeBase) {
    constructor(options = {}) {
        super(options)

        // TODO: remove, only Node needs scenePromise stuff.
        this._scene = this
        this._resolveScenePromise(this)

        // For now, Scenes are always proportionally sized by default.
        // TODO: Scene is not Transformable, it contains all the Transformable Nodes, so set sizing by CSS.
        this._properties.sizeMode = { x: 'proportional', y: 'proportional', z: 'proportional' }

        // TODO: We need to render one time each time mountPromise is resolved,
        // not just this one time in the constructor.
        // TODO: Does Scene need this call?
        this._needsToBeRendered()
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

        this._resolveMountPromise(this._mounted)
    }

    /**
     * Unmount the scene from it's mount point. Resets the Scene's
     * mountPromise.
     */
    unmount() {
        if (this._el.element.parentNode)
            this._el.element.parentNode.removeChild(this._el.element)

        this._mounted = false

        // a new promise to be resolved on the next mount.
        this._mountPromise = new Promise(r => this._resolveMountPromise = r)
    }

}

export {Scene as default}
