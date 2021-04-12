import {html} from '@lume/element/dist/html.js'
import DeclarativeBase, {initDeclarativeBase} from './DeclarativeBase.js'

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

		/*
		 * This trick is needed in Firefox to remove pointer events from the
		 * transparent cameraElement from interfering with pointer events on the
		 * scene objects. We do not wish to interact with this element anyway, as
		 * it serves only for positioning the view.
		 */
		.cameraElement {
			pointer-events: none;
		}
		.cameraElement > * {
			pointer-events: auto;
		}
	`

	template = () => html`
		<div ref=${(el: any) => (this._cssLayer = el)} class="lume-scene-CSS3DLayer">
			${
				/* WebGLRendererThree places the CSS3DRendererNested domElement
				here, which contains a <slot> element that child elements of
				a Scene are distributed into (rendered relative to).
				*/ ''
			}
		</div>
		<div ref=${(el: any) => (this._glLayer = el)} class="lume-scene-WebGLLayer">
			${/* WebGLRendererThree places the Three.js <canvas> element here. */ ''}
		</div>
		<div class="lume-scene-MiscellaneousLayer">
			${/* This layer is used by WebVR to insert some UI like the Enter VR button. */ ''}
			<slot name="misc"></slot>
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
	}

	disconnectedCallback() {
		super.disconnectedCallback()

		this.unmount!()
	}

	// WebGLRendererThree appends its content into here.
	protected _glLayer: HTMLDivElement | null = null

	// CSS3DRendererThree appends its content into here.
	protected _cssLayer: HTMLDivElement | null = null
}

export {HTMLScene}
