
import styles from './HTMLScene.style'
import Motor from '../core/Motor'
import Scene from '../core/Scene'
import Observable from '../core/Observable'
import Sizeable from '../core/Sizeable'
import getWebGlRenderer from '../core/WebGLRenderer'
import DeclarativeBase, {initDeclarativeBase, proxyGettersSetters} from './DeclarativeBase'
import sleep from 'awaitbox/timers/sleep'

//import * as PIXI from 'pixi.js' // also sets the PIXI global.
//import SVG from 'pixi-svg' // uses the PIXI global, won't work if you don't import the main `pixi.js module`.
import Two from 'two.js/build/two'

initDeclarativeBase()

const privates = new WeakMap()
const _ = instance => {
    if (!privates.get(instance)) privates.set(instance, {})
    return privates.get(instance)
}

class HTMLScene extends Observable.mixin(DeclarativeBase) {
    static define(name) {
        customElements.define(name || 'i-scene', HTMLScene)
    }

    constructor() {
        super()

        this._sizePollTask = null
        this._parentSize = {x:0, y:0, z:0}

        // After the imperativeCounterpart is available it needs to register
        // mount into DOM. This is only for MotorHTMLScenes because their
        // imperativeCounterparts are not added to a parent Node.
        // MotorHTMLNodes get their parent connection from their parent in
        // childConnectedCallback.
        this._imperativeCounterpartPromise
            .then(() => {
                if (this.imperativeCounterpart._mounted) return

                if (this.parentNode)
                    this.imperativeCounterpart.mount(this.parentNode)
            })

        // For now, use the same program (with shaders) for all objects.
        // Basically it has position, frag colors, point light, directional
        // light, and ambient light.
        // TODO: maybe call this in `init()`, and destroy webgl stuff in
        // `deinit()`.
        // TODO: The user might enable this by setting the attribute later, so
        // we can't simply rely on having it in constructor, we need a
        // getter/setter like node properties.
        this.initWebGl()
    }

    // TODO: we need to deinit webgl too.
    initWebGl() {
        // TODO: this needs to be cancelable too, search other codes for
        // "mountcancel" to see.
        this.mountPromise.then(() => {
            this.webglEnabled = !!this.getAttribute('webglenabled')
            if (!this.webglEnabled) return
            this.webGlRendererState = {}
            getWebGlRenderer().initGl(this)
        })
    }
    //async initWebGl() {
        //// TODO: this needs to be cancelable too, search other codes for
        //// "mountcancel" to see.
        //await this.mountPromise
        //this.webglEnabled = !!this.getAttribute('webglenabled')
        //if (!this.webglEnabled) return
        //this.webGlRendererState = {}
        //getWebGlRenderer().initGl(this)
    //}

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
proxyGettersSetters(Sizeable, HTMLScene)

export {HTMLScene as default}
