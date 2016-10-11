
import styles from './scene-style'
import Motor from '../motor/Motor'
import Scene from '../motor/Scene'
import Observable from '../motor/Observable'
import MotorHTMLBase, {initMotorHTMLBase} from './base'

initMotorHTMLBase()

let privates = new WeakMap()
let _ = instance => {
    if (!privates.get(instance)) privates.set(instance, {})
    return privates.get(instance)
}

class MotorHTMLScene extends Observable.mixin(MotorHTMLBase) {

    createdCallback() {
        super.createdCallback()

        // TODO move to DOMRenderer
        this._sizePollTask = null
        this._parentSize = {x:0, y:0, z:0}
    }

    init() {
        super.init() // indirectly triggers this._makeImperativeCounterpart...

        // ... then we can reference it.
        this.imperativeCounterpart.mount(this.parentNode)
    }

    _startSizePolling() {
        // XXX Polling is required because there's no other way to do this
        // reliably, not even with MutationObserver. ResizeObserver hasn't
        // landed in browsers yet.
        // TODO: detect when ResizeObserver exists and use it instead of
        // polling.
        if (!this._sizePollTask)
            this._sizePollTask = Motor.addRenderTask(this._checkSize.bind(this))
    }

    // XXX, the Z dimension of a scene doesn't matter, it's a flat plane, so
    // we haven't taken that into consideration here.
    _checkSize() {

        // The scene has a parent by the time this is called (see
        // src/motor/Scene#mount where _startSizePolling is called)
        const parent = this.parentNode

        // TODO: Should we use getComputedStyle or clientWidth/Height, or
        // something else? See http://stackoverflow.com/questions/39963699 for
        // detail on why it would matter.
        const width = parent.clientWidth
        const height = parent.clientHeight

        // if we have a size change, trigger parentsizechange
        if (this._parentSize.x != width || this._parentSize.y != height) {
            this._parentSize.x = width
            this._parentSize.y = height

            const {x,y,z} = this._parentSize
            this.triggerEvent('parentsizechange', {x,y,z})
        }
    }

    _makeImperativeCounterpart() {
        return new Scene({
            _motorHtmlCounterpart: this
        })
    }

    /** @override */
    getStyles() {
        return styles
    }

    deinit() {
        super.deinit()

        this.imperativeCounterpart.unmount()
    }

    _stopSizePolling() {
        Motor.removeRenderTask(this._sizePollTask)
        this._sizePollTask = null
    }
}

import 'document-register-element'
MotorHTMLScene = document.registerElement('motor-scene', MotorHTMLScene)

export {MotorHTMLScene as default}
