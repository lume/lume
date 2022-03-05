import {ImperativeBase} from './ImperativeBase.js'

export class HtmlNode extends ImperativeBase {
	override readonly hasShadow: boolean = false

	static css = /*css*/ `
		:host {
			/*
			 * All items of the scene graph are hidden until they are mounted in
			 * a scene (this changes to display:block). This gets toggled
			 * between "none" and "block" by ImperativeBase depending on if CSS
			 * rendering is enabled.
			 */
			display: none;

			/*
			Layout of a node's CSS rectangle is never affected by anything
			outside of it. We don't contain paint because CSS content can
			overflow if desired, or size because eventually we'll add natural
			sizing to let the node be sized by its content.
			*/
			contain: layout;

			/* TODO see how content-visibility affects CSS performance with nodes that are off-screen. */
			/* content-visibility: auto; implies contain:strict */

			box-sizing: border-box;
			position: absolute;
			top: 0;
			left: 0;

			/*
			 * Defaults to [0.5,0.5,0.5] (the Z axis doesn't apply for DOM
			 * elements, but does for 3D objects in WebGL that have any size
			 * along Z.)
			 */
			transform-origin: 50% 50% 0; /* default */

			transform-style: preserve-3d;
		}
	`
}
