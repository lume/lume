import {html as _html} from '@lume/element'
import DeclarativeBase, {initDeclarativeBase} from './DeclarativeBase'

// TODO This type cast not needed on the next lit-dom-expressions release after v0.19.10.
const html = _html as any

initDeclarativeBase()

export default class HTMLScene extends DeclarativeBase {
	static css = /*css*/ `
		:host {
			/*
			 * All items of the scene graph are hidden until they are mounted in
			 * a scene (this changes to display:block). 'display' gets toggled
			 * between "none" and "block" by ImperativeBase depending on if CSS
			 * rendering is enabled.
			 */
			display: none;

			box-sizing: border-box;
			position: static;
			overflow: hidden;
			top: 0;
			left: 0;

			/*
			// Defaults to [0.5,0.5,0.5] (the Z axis doesn't apply for DOM elements,
			// but will for 3D objects in WebGL.)
			*/
			transform-origin: 50% 50% 0; /* default */

			transform-style: preserve-3d;
		}

		.lume-scene-inner {
			position: relative
		}

		.lume-scene-inner,
		.lume-scene-CSS3DLayer,
		.lume-scene-MiscellaneousLayer,
		.lume-scene-WebGLLayer,
		.lume-scene-WebGLLayer > canvas  {
			margin: 0; padding: 0;
			width: 100%; height: 100%;
			display: block;
		}

		.lume-scene-CSS3DLayer,
		.lume-scene-MiscellaneousLayer,
		.lume-scene-WebGLLayer {
			/* make sure all layers are stacked on top of each other */
			position: absolute; top: 0; left: 0;
		}

		.lume-scene-CSS3DLayer {
			transform-style: preserve-3d;
		}

		.lume-scene-WebGLLayer,
		.lume-scene-MiscellaneousLayer {
			pointer-events: none;
		}
	`

	template = () => html`
		<div class="lume-scene-inner">
			<div ref=${(el: any) => (this._cssLayer = el)} class="lume-scene-CSS3DLayer">
				${/* WebGLRendererThree places the CSS3DRendererNested domElement
				here, which contains a <slot> element that child elements of
				a Scene are distributed into (rendered relative to).
				*/ ''}
			</div>
			<div ref=${(el: any) => (this._glLayer = el)} class="lume-scene-WebGLLayer">
				${/* WebGLRendererThree places the Three.js <canvas> element here. */ ''}
			</div>
			<div class="lume-scene-MiscellaneousLayer">
				<slot name="misc"></slot>
			</div>
		</div>
	`

	// from Scene
	// TODO PossiblyScene type, or perhaps a mixin that can be applied to the
	// Scene class to make it gain the HTML interface
	protected _mounted = false
	mount?(f?: string | Element | null): void
	unmount?(): void

	connectedCallback() {
		super.connectedCallback()

		// When the HTMLScene gets addded to the DOM, make it be "mounted".
		if (!this._mounted) this.mount!(this.parentNode as Element)

		const root = this._cssLayer!.attachShadow({mode: 'open'})
		root.append(html`
			<style>
				.lume-scene-CSS3DLayer-inner {
					/*
					 * make sure CSS3D rendering is contained inside of the
					 * CSS3DLayer (all 3D elements have position:absolute,
					 * which will be relative to this container)
					 */
					position: relative;
				}
			</style>
		`)
		root.append(html`
			<div class="lume-scene-CSS3DLayer-inner">
				<slot></slot>
			</div>
		`)
	}

	disconnectedCallback() {
		super.disconnectedCallback()

		this.unmount!()
	}

	protected _glLayer: HTMLDivElement | null = null
	protected _cssLayer: HTMLDivElement | null = null
}

export {HTMLScene}
