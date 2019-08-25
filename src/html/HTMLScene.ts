import styles from './HTMLScene.style'
import DeclarativeBase, {initDeclarativeBase} from './DeclarativeBase'

initDeclarativeBase()

export default class HTMLScene extends DeclarativeBase {
    constructor() {
        super()

        this.__root = this.attachShadow({mode: 'open'})
        this.__root.innerHTML = `
            <style>
                .i-scene-inner {
                    position: relative
                }

                .i-scene-inner,
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
                    /* make sure all layers are stacked on top of each other */
                    position: absolute; top: 0; left: 0;
                }

                .i-scene-CSS3DLayer {
                    transform-style: preserve-3d;
                }

                .i-scene-WebGLLayer,
                .i-scene-MiscellaneousLayer {
                    pointer-events: none;
                }
            </style>

            <div class="i-scene-inner">
                <div class="i-scene-CSS3DLayer">
                    ${
                        /* WebGLRendererThree places the CSS3DRendererNested
                        domElement here, which contains a <slot> element that child
                        elements of a Scene are distributed into (rendered relative to).
                        */ ''
                    }
                </div>
                <div class="i-scene-WebGLLayer">
                    ${/* WebGLRendererThree places the Three.js <canvas> element here. */ ''}
                </div>
                <div class="i-scene-MiscellaneousLayer">
                    <slot name="misc"></slot>
                </div>
            </div>
        `

        // TODO make this similar to "package protected". It is public for now
        // because WebGLRendererThree accesses it.
        // TODO move these things (and others) out of the HTML interfaces, and
        // enable them when the HTML interfaces are present, so that we can
        // decouple HTML interfaces being present from functionality. We can
        // make these things private if they are in the Scene class, and expose
        // the private helper from there to friend modules.
        this._glLayer = this.__root.querySelector('.i-scene-WebGLLayer')
        this._cssLayer = this.__root.querySelector('.i-scene-CSS3DLayer')

        const root = this._cssLayer!.attachShadow({mode: 'open'})
        root.innerHTML = `
            <style>
                .i-scene-CSS3DLayer-inner {
                    /* make sure CSS3D rendering is contained inside of the CSS3DLayer
                        (all 3D elements have position:absolute, which will be relative
                        to this container) */
                    position: relative;
                }
            </style>
            <div class="i-scene-CSS3DLayer-inner">
                <slot></slot>
            </div>
        `
    }

    /** @override */
    getStyles() {
        return styles
    }

    // from Scene
    // TODO PossiblyScene type, or perhaps a mixin that can be applied to the
    // Scene class to make it gain the HTML interface
    protected _mounted!: boolean
    mount?(f?: string | Element | null): void
    unmount?(): void

    connectedCallback() {
        super.connectedCallback()

        // When the HTMLScene gets addded to the DOM, make it be "mounted".
        if (!this._mounted) this.mount!(this.parentNode as Element)
    }

    async disconnectedCallback() {
        super.disconnectedCallback()

        this.unmount!()
    }

    protected _glLayer: HTMLDivElement | null = null
    protected _cssLayer: HTMLDivElement | null = null

    private __root: ShadowRoot
}

export {HTMLScene}
