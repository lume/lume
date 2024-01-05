/**
 * This Source Code is licensed under the MIT license. If a copy of the
 * MIT-license was not distributed with this file, You can obtain one at:
 * http://opensource.org/licenses/mit-license.html.
 *
 * @author: Hein Rutjes (IjzerenHein) and Joe Pea (trusktr)
 * @license MIT
 * @copyright Gloey Apps, 2015
 * @copyright Joe Pea, 2018
 */

// TODO:
// - Use MutationObserver to watch for className changes and update laid-out nodes.
// - Perhaps once we get to the ShadowDOM stuff we can use slots instead. It'll
// be more powerful, letting us distribute any number of nodes into each layout
// slot. Also it eliminated edge cases that we'll have to handle with the
// className approach.
// - Make an <lume-visual-format> element that can contain visual format code to
// re-use in multiple layouts.
// - Allow visual-format to be fetch by path (like img src attribute).

import {element, type ElementAttributes} from '@lume/element'
import {autoDefineElements} from '../LumeConfig.js'
import {Autolayout, type AutolayoutAttributes} from './Autolayout.js'

/**
 * @deprecated `AutoLayoutNode` has been deprecated, use `AutolayoutAttributes`
 * from [`Autolayout`](./Autolayout) instead.
 */
export type AutoLayoutNodeAttributes = AutolayoutAttributes

/**
 * @deprecated `AutoLayoutNode` and `<lume-autolayout-node>` have been renamed
 * to [`Autolayout`](./Autolayout) and `<lume-autolayout>`.
 */
export
@element('lume-autolayout-node', autoDefineElements)
class AutoLayoutNode extends Autolayout {}

declare module 'solid-js' {
	namespace JSX {
		interface IntrinsicElements {
			/**
			 * @deprecated `AutoLayoutNode` and `<lume-autolayout-node>` have been renamed
			 * to [`Autolayout`](./Autolayout) and `<lume-autolayout>`.
			 */
			'lume-autolayout-node': ElementAttributes<AutoLayoutNode, AutoLayoutNodeAttributes>
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		/**
		 * @deprecated `AutoLayoutNode` and `<lume-autolayout-node>` have been renamed
		 * to [`Autolayout`](./Autolayout) and `<lume-autolayout>`.
		 */
		'lume-autolayout-node': AutoLayoutNode
	}
}
