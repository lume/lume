const {Class} = infamous

const BasicHTMLRendererBrand = {}

function BasicHTMLRenderer(Base = {}) {
    // prettier-ignore
    return Class('BasicHTMLRenderer').extends(Base, ({Super, Public, Protected, Private}) => ({
        static: {
            // "shadow" means it renders to a shadow root, "replace" means it
            // uses innerHTML, and "append" means it appends with
            // insertAdjacentHTML('beforeend')
            htmlRenderMode: 'shadow', // 'shadow' | 'replace' | 'append'
        },

        connectedCallback() {
            Super(this).connectedCallback()
            this.shouldRender()
        },

        disconnectedCallback() {
            Super(this).disconnectedCallback()

            cancelAnimationFrame(Private(this).__frame)
            Private(this).__frame = null
        },

        shouldRender() {
            if (Private(this).__frame) return

            Private(this).__frame = requestAnimationFrame(() => {
                Private(this).__frame = null

                const {__renderMode} = Private(this)

                if (['replace', 'shadow'].includes(Private(this).__renderMode))
                    Protected(this)._root.innerHTML = Protected(this)._render()
                else if (Private(this).__renderMode === 'append')
                    Protected(this)._root.insertAdjacentHTML('beforeend', Protected(this)._render())
            })
        },

        private: {
            get __renderMode() {
                return Public(this).constructor.htmlRenderMode || "shadow"
            },
        },

        protected: {
            // subclasses should override this, returning HTML to render
            _render() {
                return html``
            },

            get _root() {
                if (['replace', 'append'].includes(Private(this).__renderMode))
                    return Public(this)

                if (Private(this).__renderMode === 'shadow')
                    return Private(this).__root || (Private(this).__root = Public(this).attachShadow({mode: 'open'}))
            },
        },
    }), BasicHTMLRendererBrand)
}

const NodeWithRenderer = BasicHTMLRenderer(infamous.Node)

const ShimmerSurface = Class('ShimmerSurface').extends(NodeWithRenderer, ({Super, Public}) => ({
    static: {
        props: {
            // TODO log a warning if Node or Scene props are missing (most
            // likely someone extended props wrong)
            ...infamous.Node.props,
            color: infamous.props.props.THREE.Color,
        },
        // htmlRenderMode: 'replace',
        htmlRenderMode: 'shadow',
    },

    updated(oldProps, modifiedProps) {
        Super(this).updated(oldProps, modifiedProps)

        if (modifiedProps.color) {
            this.shouldRender()
        }
    },

    protected: {
        _render() {
            // const {r, g, b} = { r: 244/255, g: 196/255, b: 48/255 }
            const {r, g, b} = Public(this).color

            // prettier-ignore
            return html`
                <style>
                    @keyframes ShimmerEffect {
                        0% { transform: translate3d(-15%, -15%, 30px) }
                        100% { transform: translate3d(-60%, -60%, 30px) }
                    }
                    :host {
                        overflow: hidden;
                        perspective: 100000px
                    }
                    .shimmerSurfaceContent {
                        transform-style: preserve-3d;
                        background: linear-gradient(
                            -45deg,
                            rgba(0,0,0,0) 40%,
                            rgba(${r*255}, ${g*255}, ${b*255}, 0.2) 50%,
                            rgba(0,0,0,0) 60%
                        );
                        background-repeat: repeat;
                        background-size: 100% 100%;
                        width: 400%; height: 400%;

                        animation: ShimmerEffect 1.8s cubic-bezier(0.75, 0.000, 0.25, 1.000) infinite;
                    }
                </style>

                <div class="shimmerSurfaceContent"></div>
            `
        },
    },
}))

customElements.define('shimmer-surface', ShimmerSurface)

const ShimmerCube = Class('ShimmerCube').extends(NodeWithRenderer, ({ Super, Public }) => ({
    static: {
        props: {
            ...infamous.Node.props,
            color: infamous.props.props.THREE.Color,
        },
        // htmlRenderMode: 'replace',
        htmlRenderMode: 'shadow',
    },

    updated(oldProps, modifiedProps) {
        Super(this).updated(oldProps, modifiedProps)

        if (modifiedProps.color) {
            this.shouldRender()
        }
    },

    protected: {

        _render() {
            const {r, g, b} = Public(this).color

            // prettier-ignore
            const cubeFaceOrientations = [
                [0, 180, 0],
                [0, 0, 0],
                [0, 90, 0],
                [0, 270, 0],
                [90, 0, 0],
                [270, 0, 0],
            ]

            // prettier-ignore
            return html`
                <i-box
                    ${Public(this).id ? `id="${Public(this).id}-box"` : ``}
                    color="#364659"
                    size-mode="proportional proportional proportional"
                    size="1 1 1"
                    opacity="0.2"
                >
                    <slot></slot>
                </i-box>

                ${cubeFaceOrientations.map(orientation => html`
                    <shimmer-surface
                        ${Public(this).id ? `id="${Public(this).id}-shimmer-surface"` : ``}
                        color="rgb(${r*255}, ${g*255}, ${b*255})"
                        size-mode="proportional proportional proportional"
                        size="1 1 1"
                        origin="0.5 0.5 0"
                        align="0 0 0.5"
                        rotation="${orientation}"
                    >
                    </shimmer-surface>
                `)}
            `

            // root.querySelector('i-box').three.material.opacity = 0.2
        },
    },
}))

customElements.define('shimmer-cube', ShimmerCube)
