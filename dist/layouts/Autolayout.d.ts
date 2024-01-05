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
import AutoLayout from '@lume/autolayout';
import { type ElementAttributes } from '@lume/element';
import { Element3D, type Element3DAttributes } from '../core/Element3D.js';
export { AutoLayout };
export type AutolayoutAttributes = Element3DAttributes | 'visualFormat';
/**
 * An Element3D that lays children out based on an Apple AutoLayout VFL layout
 * description.
 */
export declare class Autolayout extends Element3D {
    #private;
    static DEFAULT_PARSE_OPTIONS: {
        extended: boolean;
        strict: boolean;
    };
    visualFormat: string | null;
    /**
     * Constructor
     *
     * @param {Object} [options] options to set.
     * @param {String|Array} [options.visualFormat] String or array of strings containing VFL.
     * @param {Object} [options.layoutOptions] Options such as viewport, spacing, etc... TODO make this a reactive property.
     * @return {Autolayout} this
     */
    constructor(options: any);
    connectedCallback(): void;
    childConnectedCallback(child: Element3D): void;
    childDisconnectedCallback(child: Element3D): void;
    /**
     * Forces a reflow of the layout.
     *
     * @return {Autolayout} this
     */
    reflowLayout(): this;
    /**
     * Sets the visual-format string.
     *
     * @param {String|Array} visualFormat String or array of strings containing VFL.
     * @param {Object} [parseOptions] Specify to override the parse options for the VFL.
     * @return {Autolayout} this
     */
    setVisualFormat(visualFormat: string, parseOptions?: any): this;
    /**
     * Sets the options such as viewport, spacing, etc...
     *
     * @param {Object} options Layout-options to set.
     * @return {Autolayout} this
     */
    setLayoutOptions(options: any): this;
    /**
     * Adds a new child to this node. If this method is called with no argument it will
     * create a new node, however it can also be called with an existing node which it will
     * append to the node that this method is being called on. Returns the new or passed in node.
     *
     * @param {Element3D|void} child The node to appended or no node to create a new node.
     * @param {String} id Unique id of the node which matches the id used in the Visual format.
     * @return {Element3D} the appended node.
     */
    addToLayout(child: Element3D, id: string): Element3D;
    /**
     * Removes a child node from another node. The passed in node must be
     * a child of the node that this method is called upon.
     *
     * @param {Element3D} [child] node to be removed
     * @param {String} [id] Unique id of the node which matches the id used in the Visual format.
     */
    removeFromLayout(child: Element3D, id: string): void;
}
declare module 'solid-js' {
    namespace JSX {
        interface IntrinsicElements {
            'lume-autolayout': ElementAttributes<Autolayout, AutolayoutAttributes>;
        }
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'lume-autolayout': Autolayout;
    }
}
//# sourceMappingURL=Autolayout.d.ts.map