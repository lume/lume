
import styles from './HTMLScene.style'
import Motor from '../core/Motor'
import DeclarativeBase, {initDeclarativeBase} from './DeclarativeBase'

initDeclarativeBase()

const HTMLScene = DeclarativeBase.subclass('HTMLScene', ({ Public, Private, Super }) => ({

    constructor() {
        const self = Super(this).constructor()
        const privateThis = Private(self)

        privateThis._root = self.attachShadow({ mode: 'open' })
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
                .i-scene-WebGLLayer,
                .i-scene-MiscellaneousLayer {
                    pointer-events: none;
                }
            </style>
            <div class="i-scene-CSS3DLayer">
                ${ /* WebGLRendererThree places the CSS3DRendererNested
                domElement here, which contains a <slot> element that child
                elements of a Scene are distributed into (rendered relative to).
                */ ''}
            </div>
            <div class="i-scene-WebGLLayer">
                ${ /* WebGLRendererThree places the Three.js <canvas> element here. */ ''}
            </div>
            <div class="i-scene-MiscellaneousLayer">
                <slot name="misc"></slot>
            </div>
        `

        // TODO make this similar to "package protected". It is public for now
        // because WebGLRendererThree accesses it.
        self._glLayer = privateThis._root.querySelector('.i-scene-WebGLLayer')
        self._cssLayer = privateThis._root.querySelector('.i-scene-CSS3DLayer')

        return self
    },

    /** @override */
    getStyles() {
        return styles
    },

    protected: {

        _init() {
            Super(this)._init()

            // When the HTMLScene gets addded to the DOM, make it be "mounted".
            if (!Public(this)._mounted)
                Public(this).mount(Public(this).parentNode)
        },

        _deinit() {
            Super(this)._deinit()

            Public(this).unmount()
        },

    },

    private: {
        _root: null,
    },

}))

export {HTMLScene as default}
