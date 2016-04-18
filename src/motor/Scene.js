import Node from './Node'
import {
    documentReady,
} from './Utility'

import '../motor-html/scene'

export default
class Scene extends Node {
    constructor(mountPoint, _motorHtmlScene) {
        super({}, _motorHtmlScene)

        this._scene = this
        this._resolveScenePromise(this)

        // For now, Scenes are always proportionally sized by default.
        this._properties.size.modes = ['proportional', 'proportional', 'proportional']

        // Resolves this.mountPromise, that the user can use to do something
        // once the scene is mounted.
        this._mount(mountPoint)
    }

    _init() {
        this._updateQueue = []
        this._nextUpdateQueue = []
        this._inFrame = false
        this._rAF = null // the current animation frame, or null.
        this._animationLoopStarted = false
        super._init()
    }

    makeElement() {
        return document.createElement('motor-scene')
    }

    async _startAnimationLoopWhenMounted() {
        this._animationLoopStarted = true
        console.log('# starting new animation loop')

        console.log = function() {}

        if (!this._mounted) await this.mountPromise

        // So now we can render after the scene is mounted.
        const loop = timestamp => {
            this._inFrame = true

            console.log(' --- animation frame')
            this._fireUpdates(timestamp)

            // If there are more updates requested from the updates we just
            // fired, continue the animation loop.
            if (this._nextUpdateQueue.length)
                this._rAF = requestAnimationFrame(loop)
            else {
                this._rAF = null
                this._animationLoopStarted = false
            }

            while (this._nextUpdateQueue.length)
                this._updateQueue.push(this._nextUpdateQueue.shift())

            this._inFrame = false
        }

        this._rAF = requestAnimationFrame(loop)
        console.log(' ---------- _rAF', this._rAF)
    }

    _queueUpdate(fn) {
        console.log('   - update request')
        if (typeof fn != 'function')
            throw new Error('Update must be a function.')

        if (!this._inFrame) this._updateQueue.push(fn)
        else this._nextUpdateQueue.push(fn)

        // If the render loop isn't started, start it.
        if (!this._animationLoopStarted)
            this._startAnimationLoopWhenMounted()
    }

    _fireUpdates(timestamp) {
        while (this._updateQueue.length) {
            let update = this._updateQueue.shift()
            console.log('  -- processing update', this._updateQueue.length, update)
            update(timestamp)
        }
    }

    async _mount(mountPoint) {
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
            throw new Error('Invalid mount point specified in Scene constructor. Specify a selector, or pass an actual HTMLElement.')
            return false
        }

        this._resolveMountPromise(this._mounted)
        return this._mounted
    }

}
