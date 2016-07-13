import Node from './Node'
import documentReady from 'awaitbox/dom/documentReady'

import MotorHTMLScene from '../motor-html/scene'

class Scene extends Node {
    constructor(options, _motorHtmlScene) {
        super(options, _motorHtmlScene)

        this._scene = this
        this._resolveScenePromise(this)

        // For now, Scenes are always proportionally sized by default.
        this._properties.sizeMode = { x: 'proportional', y: 'proportional', z: 'proportional' }
    }

    _init() {
        super._init()
    }

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
        await documentReady()

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
        this._el.element.parentNode.removeChild(this._el.element)
        this._mounted = false

        // a new promise to be resolved on the next mount.
        this._mountPromise = new Promise(r => this._resolveMountPromise = r)
    }

}

export {Scene as default}
