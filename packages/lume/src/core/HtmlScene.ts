import {html} from '@lume/element/dist/html.js'
import {ImperativeBase} from './ImperativeBase.js'

export class HtmlScene extends ImperativeBase {
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
				Defaults to [0.5,0.5,0.5] (the Z axis doesn't apply for DOM elements,
				but will for 3D objects in WebGL.)
			*/
			transform-origin: 50% 50% 0; /* default */

			transform-style: preserve-3d;
		}

		/* The purpose of this is to contain the position:absolute layers so they don't break out of the Scene layout. */
		.container {
			position: relative
		}

		.container,
		.CSS3DLayer,
		.MiscellaneousLayer,
		.WebGLLayer,
		.WebGLLayer > canvas  {
			margin: 0; padding: 0;
			width: 100%; height: 100%;
			display: block;
		}

		.CSS3DLayer,
		.MiscellaneousLayer,
		.WebGLLayer {
			/* make sure all layers are stacked on top of each other */
			position: absolute; top: 0; left: 0;
		}

		.CSS3DLayer {
			transform-style: preserve-3d;
		}

		.WebGLLayer,
		.MiscellaneousLayer {
			pointer-events: none;
		}

		.MiscellaneousLayer > * {
			/* Allow children of the Misc layer to have pointer events.	Needed for the WebXR button, for example */
			pointer-events: auto;
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
		<div class="container">
			<div ref=${(el: any) => (this._cssLayer = el)} class="CSS3DLayer">
				${
					/* WebGLRendererThree places the CSS3DRendererNested domElement
					here, which contains a <slot> element that child elements of
					a Scene are distributed into (rendered relative to).
					*/ ''
				}
			</div>
			<div ref=${(el: any) => (this._glLayer = el)} class="WebGLLayer">
				${/* WebGLRendererThree places the Three.js <canvas> element here. */ ''}
			</div>
			<div ref=${(el: any) => (this._miscLayer = el)} class="MiscellaneousLayer">
				${/* This layer is used by WebXR to insert UI like the Enter VR/AR button. */ ''}
				<slot name="misc"></slot>
			</div>
		</div>
	`

	// from Scene
	// TODO PossiblyScene type, or perhaps a mixin that can be applied to the
	// Scene class to make it gain the HTML interface
	_mounted = false
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
	_glLayer: HTMLDivElement | null = null

	// CSS3DRendererThree appends its content into here.
	_cssLayer: HTMLDivElement | null = null

	// Miscellaneous layer. The "Enter VR/AR" button is placed here by Scene, for example.
	_miscLayer: HTMLDivElement | null = null
}
