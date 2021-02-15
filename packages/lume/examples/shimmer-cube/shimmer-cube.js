// TODO replace this with ES Module `import`
const {Node, reactify, html, For} = LUME

// FIXME: If this script is not ran as type=module, then the above `Node`
// variable ovarwrites the global `window.Node` variable, which causes the
// `html` template tag to break (because it has `instanceof Node` in its code
// expecting the original window.Node class). We should rename `Node` to
// something else. Perhaps `Node3D` or `Element3D`.

class ShimmerSurface extends Node {
	static reactiveProperties = ['color']

	root = this.attachShadow({mode: 'open'})

	constructor() {
		super()
		reactify(this, ShimmerSurface)
	}

	static observedAttributes = this.reactiveProperties
	attributeChangedCallback(attr, oldValue, newValue) {
		this[attr] = newValue
	}

	__color = new THREE.Color('deeppink')

	get color() {
		return this.__color
	}
	set color(val) {
		val = val ?? ''
		if (typeof val === 'string') this.__color.set(val)
		else if (typeof val === 'number') this.__color.set(val)
		else if (val instanceof THREE.Color) this.__color = val
		else throw new Error('Invalid value')
	}

	// prettier-ignore
	template = () => html`
		<style>${() => /*css*/`
			@keyframes ShimmerEffect {
				0% { transform: translate3d(-15%, -15%, 30px) }
				100% { transform: translate3d(-60%, -60%, 30px) }
			}
			:host {
				overflow: hidden;
				perspective: 100000px
			}
			.shimmerSurface {
				transform-style: preserve-3d;
				background: linear-gradient(
					-45deg,
					rgba(0,0,0,0) 40%,
					rgba(${this.color.r*255}, ${this.color.g*255}, ${this.color.b*255}, 0.2) 50%,
					rgba(0,0,0,0) 60%
				);
				background-repeat: repeat;
				background-size: 100% 100%;
				width: 400%; height: 400%;

				animation: ShimmerEffect 1.8s cubic-bezier(0.75, 0.000, 0.25, 1.000) infinite;
			}
		`}</style>
		<div class="shimmerSurface"></div>
	`

	// css = /* css */`
	// `
}

customElements.define('shimmer-surface', ShimmerSurface)

class ShimmerCube extends Node {
	static reactiveProperties = ['color']

	// root = this

	constructor() {
		super()
		reactify(this, ShimmerCube)
	}

	static observedAttributes = this.reactiveProperties
	attributeChangedCallback(attr, oldValue, newValue) {
		this[attr] = newValue
	}

	__color = new THREE.Color('deeppink')

	get color() {
		return this.__color
	}
	set color(val) {
		val = val ?? ''
		if (typeof val === 'string') this.__color.set(val)
		else if (typeof val === 'number') this.__color.set(val)
		else if (val instanceof THREE.Color) this.__color = val
		else throw new Error('Invalid value')
	}

	template() {
		const cubeFaceOrientations = [
			[0, 180, 0],
			[0, 0, 0],
			[0, 90, 0],
			[0, 270, 0],
			[90, 0, 0],
			[270, 0, 0],
		]

		// <lume-box
		// 	${this.id ? `id="${this.id}-box"` : ``}
		// 	color="#364659"
		// 	size-mode="proportional proportional proportional"
		// 	size="1 1 1"
		// 	opacity="0.2"
		// >
		// 	<slot></slot>
		// </lume-box>
		// box.three.material.opacity = 0.2

		// prettier-ignore
		// return html`
		// 	<${For} each=${() => cubeFaceOrientations}>
		// 		${orientation => html`
		// 			<shimmer-surface
		// 				color=${() => this.color}
		// 				size-mode="proportional proportional proportional"
		// 				size="1 1 1"
		// 				origin="0.5 0.5 0"
		// 				align="0 0 0.5"
		// 				rotation=${orientation}
		// 			>
		// 			</shimmer-surface>
		// 		`}
		// 	<//>
		// `

		// ${this.id ? `id="${this.id}-shimmer-surface"` : ``}
		return cubeFaceOrientations.map(orientation => html`
			<shimmer-surface
				color=${() => this.color}
				size-mode="proportional proportional proportional"
				size="1 1 1"
				origin="0.5 0.5 0"
				align="0 0 0.5"
				rotation=${orientation}
			>
			</shimmer-surface>
		`)
	}
}

customElements.define('shimmer-cube', ShimmerCube)
