
import styles from './scene-style'
import Motor from '../motor/Motor'
import Scene from '../motor/Scene'
import Observable from '../motor/Observable'
import Sizeable from '../motor/Sizeable'
import MotorHTMLBase, {initMotorHTMLBase, proxyGettersSetters} from './base'

initMotorHTMLBase()

const privates = new WeakMap()
const _ = instance => {
    if (!privates.get(instance)) privates.set(instance, {})
    return privates.get(instance)
}

class MotorHTMLScene extends Observable.mixin(MotorHTMLBase) {

    createdCallback() {
        super.createdCallback()

        this._sizePollTask = null
        this._parentSize = {x:0, y:0, z:0}

        // After the imperativeCounterpart is available it needs to register
        // mount into DOM. This is only for MotorHTMLScenes because their
        // imperativeCounterparts are not added to a parent Node.
        // MotorHTMLNodes get their parent connection from their parent in
        // childConnectedCallback.
        this._imperativeCounterpartPromise
            .then(() => {

                // return if
                if (this.imperativeCounterpart._mounted) return

                if (this.parentNode)
                    this.imperativeCounterpart.mount(this.parentNode)
            })
    }

    _startSizePolling() {
        // NOTE Polling is currently required because there's no other way to do this
        // reliably, not even with MutationObserver. ResizeObserver hasn't
        // landed in browsers yet.
        if (!this._sizePollTask)
            this._sizePollTask = Motor.addRenderTask(this._checkSize.bind(this))
    }

    // NOTE, the Z dimension of a scene doesn't matter, it's a flat plane, so
    // we haven't taken that into consideration here.
    _checkSize() {

        // The scene has a parent by the time this is called (see
        // src/motor/Scene#mount where _startSizePolling is called)
        const parent = this.parentNode
        const parentSize = this._parentSize
        const style = getComputedStyle(parent)
        const width = parseFloat(style.width)
        const height = parseFloat(style.height)

        // if we have a size change, trigger parentsizechange
        if (parentSize.x != width || parentSize.y != height) {
            parentSize.x = width
            parentSize.y = height

            this.triggerEvent('parentsizechange', Object.assign({}, parentSize))
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

// This associates the Transformable getters/setters with the HTML-API classes,
// so that the same getters/setters can be called from HTML side of the API.
proxyGettersSetters(Sizeable, MotorHTMLScene)

import 'document-register-element'
MotorHTMLScene = document.registerElement('motor-scene', MotorHTMLScene)

export {MotorHTMLScene as default}
