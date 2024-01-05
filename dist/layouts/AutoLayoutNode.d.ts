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
import { type ElementAttributes } from '@lume/element';
import { Autolayout, type AutolayoutAttributes } from './Autolayout.js';
/**
 * @deprecated `AutoLayoutNode` has been deprecated, use `AutolayoutAttributes`
 * from [`Autolayout`](./Autolayout) instead.
 */
export type AutoLayoutNodeAttributes = AutolayoutAttributes;
/**
 * @deprecated `AutoLayoutNode` and `<lume-autolayout-node>` have been renamed
 * to [`Autolayout`](./Autolayout) and `<lume-autolayout>`.
 */
export declare class AutoLayoutNode extends Autolayout {
}
declare module 'solid-js' {
    namespace JSX {
        interface IntrinsicElements {
            /**
             * @deprecated `AutoLayoutNode` and `<lume-autolayout-node>` have been renamed
             * to [`Autolayout`](./Autolayout) and `<lume-autolayout>`.
             */
            'lume-autolayout-node': ElementAttributes<AutoLayoutNode, AutoLayoutNodeAttributes>;
        }
    }
}
declare global {
    interface HTMLElementTagNameMap {
        /**
         * @deprecated `AutoLayoutNode` and `<lume-autolayout-node>` have been renamed
         * to [`Autolayout`](./Autolayout) and `<lume-autolayout>`.
         */
        'lume-autolayout-node': AutoLayoutNode;
    }
}
//# sourceMappingURL=AutoLayoutNode.d.ts.map