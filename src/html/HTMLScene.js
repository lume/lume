
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
        if (!this._mounted && this.parentNode) {

            // defer so that the construct() call stack can finish
            //
            // TODO: clean up the code so that this isn't required. It's
            // just that combining the imperative/declarative classes
            // into a single class has introduced a small difference in
            // logic order.
            Promise.resolve().then(() =>
                this.mount(this.parentNode)
            )
        }

        this._root = this.attachShadow({ mode: 'open' })
        this._root.innerHTML = `
            <style>
                div {
                    margin: 0;
                    padding: 0;
                }
                .i-scene-dom {
                    position: absolute; top: 0; left: 0;
                    width: 100%; height: 100%;
                }
                .i-scene-canvas {
                    position: absolute; top: 0; left: 0;
                    width: 100%; height: 100%;
                }
                ::slotted(canvas) {
                    display: block;
                    width: 100%; height: 100%;
                    pointer-events: none;
                }
            </style>
            <div class="i-scene-dom">
                <slot></slot>
            </div>
            <div class="i-scene-canvas"></div>
        `
        this._canvasContainer = this._root.querySelector('.i-scene-canvas')
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
    // HTML
    _startSizePolling() {
        // NOTE Polling is currently required because there's no other way to do this
        // reliably, not even with MutationObserver. ResizeObserver hasn't
        // landed in browsers yet.
        if (!this._sizePollTask)
            this._sizePollTask = Motor.addRenderTask(this._checkSize.bind(this))
        this.on('parentsizechange', this._onElementParentSizeChange)
    }

    // Don't observe size changes on the scene element.
    // HTML
    _stopSizePolling() {
        this.off('parentsizechange', this._onElementParentSizeChange)
        Motor.removeRenderTask(this._sizePollTask)
        this._sizePollTask = null
    }

    // NOTE, the Z dimension of a scene doesn't matter, it's a flat plane, so
    // we haven't taken that into consideration here.
    // HTML
    _checkSize() {
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

        this.unmount()
    }

    connectedCallback() {
        super.connectedCallback()

        // When the HTMLScene gets addded to the DOM, make it be "mounted".
        if (!this._mounted)
            this.mount(this.parentNode)
    }
}

// This associates the Transformable getters/setters with the HTML-API classes,
// so that the same getters/setters can be called from HTML side of the API.
proxyGettersSetters(Sizeable, HTMLScene)

export {HTMLScene as default}
