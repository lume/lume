
import styles from './HTMLScene.style'
import Motor from '../core/Motor'
//import Sizeable from '../core/Sizeable'
import DeclarativeBase, {initDeclarativeBase, proxyGettersSetters} from './DeclarativeBase'

initDeclarativeBase()

const HTMLScene = DeclarativeBase.subclass('HTMLScene', ({ Public, Private, Super }) => ({

    construct() {
        Super(this).construct()

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

        const privateThis = Private(this)

        privateThis._root = this.attachShadow({ mode: 'open' })
        privateThis._root.innerHTML = `
            <style>
                .i-scene-CSS3DLayer,
                .i-scene-MiscellaneousLayer,
                .i-scene-WebGLLayer,
                .i-scene-WebGLLayer > canvas  {
                    margin: 0; padding: 0;
                    width: 100%; height: 100%;
                    display: block;
                }
                .i-scene-CSS3DLayer,
                .i-scene-MiscellaneousLayer,
                .i-scene-WebGLLayer {
                    position: absolute; top: 0; left: 0;
                }
                .i-scene-CSS3DLayer {
                    transform-style: preserve-3d;
                }
                .i-scene-WebGLLayer {
                    pointer-events: none;
                }
            </style>
            <div class="i-scene-CSS3DLayer">
                <slot></slot>
            </div>
            <div class="i-scene-WebGLLayer"></div>
            <div class="i-scene-MiscellaneousLayer">
                <slot name="misc"></slot>
            </div>
        `

        // TODO make this similar to "package protected". It is public for now
        // because WebGLRendererThree accesses it.
        this._canvasContainer = privateThis._root.querySelector('.i-scene-WebGLLayer')
    },

    /** @override */
    getStyles() {
        return styles
    },

    deinit() {
        Super(this).deinit()

        this.unmount()
    },

    connectedCallback() {
        Super(this).connectedCallback()

        // When the HTMLScene gets addded to the DOM, make it be "mounted".
        if (!this._mounted)
            this.mount(this.parentNode)
    },

    // TODO make these next two size-polling at least protected once we convert
    // the Scene class, or perhaps move the size polling stuff from Scene to
    // here where it can be colocated with this code.
    _startOrStopSizePolling() {
        const publicThis = Public(this)

        if (
            publicThis._mounted &&
            (publicThis._properties.sizeMode.x == 'proportional'
            || publicThis._properties.sizeMode.y == 'proportional'
            || publicThis._properties.sizeMode.z == 'proportional')
        ) {
            Private(this)._startSizePolling()
        }
        else {
            Private(this)._stopSizePolling()
        }
    },

    // Don't observe size changes on the scene element.
    // HTML
    //
    // TODO make this at least protected once we convert the Scene class
    _stopSizePolling() {
        const publicThis = Public(this)
        const privateThis = Private(this)

        publicThis.off('parentsizechange', publicThis._onElementParentSizeChange)
        Motor.removeRenderTask(privateThis._sizePollTask)
        privateThis._sizePollTask = null
    },

    private: {

        _sizePollTask: null,
        _parentSize: {x:0, y:0, z:0},
        _root: null,

        // observe size changes on the scene element.
        // HTML
        _startSizePolling() {
            const publicThis = Public(this)

            // NOTE Polling is currently required because there's no other way to do this
            // reliably, not even with MutationObserver. ResizeObserver hasn't
            // landed in browsers yet.
            if (!this._sizePollTask)
                this._sizePollTask = Motor.addRenderTask(this._checkSize.bind(this))
            publicThis.on('parentsizechange', publicThis._onElementParentSizeChange, publicThis)
        },

        // NOTE, the Z dimension of a scene doesn't matter, it's a flat plane, so
        // we haven't taken that into consideration here.
        // HTML
        _checkSize() {
            const publicThis = Public(this)

            const parent = publicThis.parentNode
            const parentSize = this._parentSize
            const style = getComputedStyle(parent)
            const width = parseFloat(style.width)
            const height = parseFloat(style.height)

            // if we have a size change, trigger parentsizechange
            if (parentSize.x != width || parentSize.y != height) {
                parentSize.x = width
                parentSize.y = height

                publicThis.trigger('parentsizechange', Object.assign({}, parentSize))
            }
        },

    },

}))

// This associates the Transformable getters/setters with the HTML-API classes,
// so that the same getters/setters can be called from HTML side of the API.
//proxyGettersSetters(Sizeable, HTMLScene)

export {HTMLScene as default}
