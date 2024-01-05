import { type ElementAttributes } from '@lume/element';
import { SharedAPI } from './SharedAPI.js';
import type { BaseAttributes } from './SharedAPI.js';
export type Element3DAttributes = BaseAttributes | 'visible';
/**
 * @class Element3D -
 *
 * Element: `<lume-element3d>`
 *
 * `Element3D` is the backing class for `<lume-element3d>` elements, the most
 * primitive of the LUME 3D elements.
 *
 * `Element3D` contains the basics that all elements in a 3D scene need, such as a
 * transform (position, rotation, scale, align-point, mount-point, origin),
 * size, and mechanisms of reactivity.
 *
 * All elements in a 3D scene are an instance of `Element3D`, including more advanced
 * elements that render different types of visuals. For example, `<lume-sphere>`
 * is an element that renders a sphere on the screen and is backed by the
 * [`Sphere`](./Sphere) class which extends from `Element3D`.
 *
 * All Nodes must be a child of a [`Scene`](/api/core/Scene) node (`<lume-scene>`
 * elements) or another `Element3D` (or anything that extends from `Element3D`).
 * If a `<lume-element3d>` element is a child of anything else, it will not do
 * anything currently.
 *
 * The `Element3D` class (backing `<lume-element3d>` elements) is useful for the following:
 *
 * - Transform a parent node in 3D space, and it will transform all its
 *   children and grandchildren along with it. For example, if you scale a
 *   parent `Element3D`, then all its children are scaled along too.
 * - Transform child Nodes relative to their parent.
 * - Render traditional HTML content by placing any regular HTML elements as
 *   children of a `<lume-element3d>` element. See the next example.
 * - Extend the `Element3D` class to make new types of 3D elements relying on the basic
 *   features that `Element3D` provides. Other classes that extend from `Element3D` may, for
 *   example, create [layouts](/examples/autolayout-declarative), or render
 *   [WebGL content](/examples/hello-world/).
 *
 * ## Example
 *
 * The following example shows traditional HTML content inside a 3D scene, as
 * well as the concept of a hierarchy of nodes called a "scene graph".
 *
 * Regular HTML content is places in each `<lume-element3d>` element. CSS is applied
 * to the nodes to give them rounded borders. Standard
 * [`<img />` elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img)
 * are used display the sun images.
 *
 * We create a hierarchy of nodes. We give each node further down in the
 * hiearchy a smaller size. We use `align` and `mount-point` attributes to
 * align Nodes to one corner of their parent. `align` controls where a node is
 * mounted relative to their parent, and `mount-point` specifies the point in
 * the child that is aligned in the parent. See the [alignment guide](TODO)
 * for how that works.
 *
 * Each node has the same amount of rotation directly applied to it. Due to the
 * hiearchy, the rotations add up. The parent most node has the least
 * amount of rotation, and the child-most nodes have the most rotation and also
 * are more displaced due to rotation of their parents. See the [scene graph
 * guide](TODO) for details on how the hierarchy works.
 *
 * Finally, we listen to mouse or finger movement events in order to apply a
 * rotation to the root node based on the current mouse or finger position.
 * See the [events guide](TODO) for how the event system works.
 *
 * <live-code src="../../examples/mini-galaxy/example.html"></live-code>
 *
 * @extends SharedAPI
 */
export { Element3D };
declare class Element3D extends SharedAPI {
    readonly hasShadow: boolean;
    /**
     * @property {true} isElement3D -
     *
     * *readonly*
     *
     * Always `true` for things that are or inherit from `Element3D`.
     */
    readonly isElement3D = true;
    /**
     * @property {boolean} visible -
     *
     * *attribute*
     *
     * Default: `true`
     *
     * Whether or not the node will be
     * visible (if it renders anything). For `<lume-element3d>` elements, this
     * only applies if the element has CSS styling or traditional HTML
     * content inside of it (children), otherwise `<lume-element3d>`
     * element's don't have any visual output by default.  Other nodes that
     * have default visual output like `<lume-box>` or `<lume-sphere>` will
     * not be visible if this is false, and their rendering mechanics will
     * be skipped.
     *
     * If an `Element3D` is not visible, its children are also not visible.
     */
    visible: boolean;
    /**
     * *reactive*
     */
    get parentSize(): {
        x: number;
        y: number;
        z: number;
    };
    /**
     * @constructor - Create a `Element3D` instance.
     *
     * The following examples calls `.set()` to set initial properties. Any
     * properties passed into `.set()` are applied to the instance. For
     * example, writing
     *
     * ```js
     * var node = new Element3D().set({
     *   size: {x:100, y:100, z:100},
     *   rotation: {x:30, y:20, z:25}
     * })
     * ```
     *
     * is the same as writing
     *
     * ```js
     * var node = new Element3D()
     * node.size = {x:100, y:100, z:100}
     * node.rotation = {x:30, y:20, z:25}
     * ```
     *
     * @example TODO
     */
    constructor();
    /**
     * @method traverseSceneGraph - This traverses the composed tree of
     * LUME 3D elements (the scene graph) including this element, in pre-order. It skips non-LUME elements.
     *
     * This is similar to
     * [`Scene#traverseSceneGraph`](./Scene.md#traversescenegraph) but traversal
     * includes the `Element3D` that this is called on.
     *
     * Example:
     *
     * ```js
     * node.traverseSceneGraph(n => {
     *   console.log(node === n) // true for the first call only
     *   console.log(n instanceof LUME.Element3D) // true
     * })
     * ```
     *
     * @param {(node: Element3D) => void} visitor - A function called for each
     * LUME node in the scene graph (the composed tree).
     * @param {boolean} waitForUpgrade - Defaults to `false`. If `true`,
     * the traversal will wait for custom elements to be defined (with
     * customElements.whenDefined) before traversing to them.
     * @returns {void | Promise<void>} - If `waitForUpgrade` is `false`,
     * the traversal will complete synchronously, and the return value will be
     * `undefined`. If `waitForUpgrade` is `true`, then traversal completes
     * asynchronously as soon as all custom elements are defined, and a Promise is
     * returned so that it is possible to wait for the traversal to complete.
     */
    traverseSceneGraph(visitor: (node: Element3D) => void, waitForUpgrade?: boolean): Promise<void> | void;
    connectedCallback(): void;
    static css: string;
}
declare module 'solid-js' {
    namespace JSX {
        interface IntrinsicElements {
            'lume-element3d': ElementAttributes<Element3D, Element3DAttributes>;
        }
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'lume-element3d': Element3D;
    }
}
//# sourceMappingURL=Element3D.d.ts.map