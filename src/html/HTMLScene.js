
import styles from './HTMLScene.style'
import Motor from '../core/Motor'
import Observable from '../core/Observable'
import Sizeable from '../core/Sizeable'
import DeclarativeBase, {initDeclarativeBase, proxyGettersSetters} from './DeclarativeBase'
import sleep from 'awaitbox/timers/sleep'

initDeclarativeBase()

class HTMLScene extends DeclarativeBase {

    construct() {
        super.construct()

        this._sizePollTask = null
        this._parentSize = {x:0, y:0, z:0}

        // If the scene is already in the DOM, make it be "mounted".
        if (!this.imperativeCounterpart._mounted && this.parentNode) {

            // defer so that the construct() call stack can finish
            //
            // TODO: clean up the code so that this isn't required. It's
            // just that combining the imperative/declarative classes
            // into a single class has introduced a small difference in
            // logic order.
            Promise.resolve().then(() =>
                this.imperativeCounterpart.mount(this.parentNode)
            )
        }
    }

    __startSizePolling() {
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
        // src/core/Scene#mount where _startSizePolling is called)
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

    /** @override */
    getStyles() {
        return styles
    }

    deinit() {
        super.deinit()

        this.imperativeCounterpart.unmount()
    }

    __stopSizePolling() {
        Motor.removeRenderTask(this._sizePollTask)
        this._sizePollTask = null
    }

    connectedCallback() {
        super.connectedCallback()

        // When the HTMLScene gets addded to the DOM, make it be "mounted".
        if (!this.imperativeCounterpart._mounted)
            this.imperativeCounterpart.mount(this.parentNode)
    }
}

// This associates the Transformable getters/setters with the HTML-API classes,
// so that the same getters/setters can be called from HTML side of the API.
proxyGettersSetters(Sizeable, HTMLScene)

export {HTMLScene as default}
