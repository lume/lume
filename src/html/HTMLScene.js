import styles from './HTMLScene.style'
import Motor from '../core/Motor'
import DeclarativeBase, {initDeclarativeBase} from './DeclarativeBase'

initDeclarativeBase()

export default DeclarativeBase.subclass('HTMLScene', ({Public, Protected, Private, Super}) => ({
    constructor() {
        const self = super()
        const privateThis = this

        privateThis.__root = self.attachShadow({mode: 'open'})
        privateThis.__root.innerHTML = `
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
                .i-scene-WebGLLayer,
                .i-scene-MiscellaneousLayer {
                    pointer-events: none;
                }
            </style>
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
        `

        // TODO make this similar to "package protected". It is public for now
        // because WebGLRendererThree accesses it.
        // TODO move these things (and others) out of the HTML interfaces, and
        // enable them when the HTML interfaces are present, so that we can
        // decouple HTML interfaces being present from functionality. We can
        // make these things private if they are in the Scene class, and expose
        // the private helper from there to friend modules.
        this._glLayer = privateThis.__root.querySelector('.i-scene-WebGLLayer')
        this._cssLayer = privateThis.__root.querySelector('.i-scene-CSS3DLayer')

        return self
    },

    /** @override */
    getStyles() {
        return styles
    },

    connectedCallback() {
        super.connectedCallback()

        // When the HTMLScene gets addded to the DOM, make it be "mounted".
        if (!this._mounted) this.mount(this.parentNode)
    },

    disconnectedCallback() {
        super.disconnectedCallback()

        this.unmount()
    },

    protected: {
        _glLayer: null, // HTMLDivElement
        _cssLayer: null, // HTMLDivElement
    },

    private: {
        __root: null,
    },
}))
