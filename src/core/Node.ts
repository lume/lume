import {autorun, booleanAttribute, element} from '@lume/element'
import {emits} from '@lume/eventful'
import {HtmlNode as HtmlInterface} from './HtmlNode.js'
import {defer} from './utils.js'
import {autoDefineElements} from '../LumeConfig.js'

import type {BaseAttributes} from './ImperativeBase.js'

// TODO Make a way to link to examples that are in separate source files so as
// not to clutter the inline-documentation when viewing source files.

export type NodeAttributes = BaseAttributes | 'visible'

/**
 * @class Node -
 * > :construction: :hammer: Under construction! :hammer: :construction:
 *
 * Element: `<lume-node>`
 *
 * `Node` is the backing class for `<lume-node>` elements, the most
 * primitive of the LUME 3D elements.
 *
 * Node contains the basics that all objects in a 3D scene need, such as a
 * transform (position, rotation, scale, align-point, mount-point, origin),
 * size, and mechanisms of reactivity.
 *
 * All objects in a 3D scene are an instance of `Node`, including more advanced
 * elements that render different types of visuals. For example, `<lume-sphere>`
 * is an element that renders a sphere on the screen and is backed by the
 * [`Sphere`](./Sphere) class which extends from `Node`.
 *
 * All Nodes must be a child of a [`Scene`](/api/core/Scene) node (`<lume-scene>`
 * elements) or another `Node` (or anything that extends from `Node`).
 * If a `<lume-node>` element is a child of anything else, it will not do
 * anything currently.
 *
 * The Node class (`<lume-node>` elements) is useful for the following:
 *
 * - Transform a parent node in 3D space, and it will transform all its
 *   children and grandchildren along with it. For example, if you scale a
 *   parent Node, then all its children are scaled along too.
 * - Transform child Nodes relative to their parent.
 * - Render traditional HTML content by placing any regular HTML elements as
 *   children of a `<lume-node>` element. See the next example.
 * - Extend the Node class to make new types of 3D objects relying on the basic
 *   features that Node provides. Other classes that extend from Node may, for
 *   example, create [layouts](/examples/autolayout-declarative), or render
 *   [WebGL content](/examples/hello-world/).
 *
 * ## Example
 *
 * The following example shows traditional HTML content inside a 3D scene, as
 * well as the concept of a hierarchy of nodes called a "scene graph".
 *
 * Regular HTML content is places in each `<lume-node>` element. CSS is applied
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
 * <div id="example1"></div>
 *
 * <script type="application/javascript">
 *   new Vue({
 *     el: '#example1',
 *     template: '<live-code :template="code" mode="html>iframe" :debounce="200" />',
 *     data: { code: miniGalaxyDemo() },
 *   })
 * </script>
 *
 * @extends ImperativeBase
 * @extends HTMLNode
 */
@element('lume-node', autoDefineElements)
export class Node extends HtmlInterface {
	/**
	 * @property {true} isNode -
	 *
	 * *readonly*
	 *
	 * Always `true` for things that are or inherit from `Node`.
	 */
	readonly isNode = true

	/**
	 * @property {boolean} visible -
	 *
	 * *attribute*
	 *
	 * Default: `true`
	 *
	 * Whether or not the node will be
	 * visible (if it renders anything). For `<lume-node>` elements, this
	 * only applies if the element has CSS styling or traditional HTML
	 * content inside of it (children), otherwise `<lume-node>`
	 * element's don't have any visual output by default.  Other nodes that
	 * have default visual output like `<lume-box>` or `<lume-sphere>` will
	 * not be visible if this is false, and their rendering mechanics will
	 * be skipped.
	 *
	 * If a `Node` is not visible, its children are also not visible.
	 */
	@booleanAttribute(true) @emits('propertychange') visible = true

	/**
	 * @constructor - Create a Node instance.
	 *
	 * The following examples calls `.set()` to set initial properties. Any
	 * properties passed into .set() are applied to the instance. For
	 * example, writing
	 *
	 * ```js
	 * var node = new Node().set({
	 *   size: {x:100, y:100, z:100},
	 *   rotation: {x:30, y:20, z:25}
	 * })
	 * ```
	 *
	 * is the same as writing
	 *
	 * ```js
	 * var node = new Node()
	 * node.size = {x:100, y:100, z:100}
	 * node.rotation = {x:30, y:20, z:25}
	 * ```
	 *
	 * @param {Object} props - An object with initial property values for the Node instance.@
	 * TODO describe the overall format and reactivity of the properties.
	 *
	 * @example
	 */
	// TODO @example jsdoc tag
	constructor() {
		super()

		// The `parent` property can already be set if this instance is
		// already in the DOM and wwhile being upgraded into a custom
		// element.
		// TODO Remove this after we make _calcSize lazy and deferred to a
		// render task.
		if (this.composedLumeParent) {
			this._calcSize()

			// No harm deferring, plus we need to because this may end up
			// calling a super method of a super class that relies on a private
			// field that is not initialized yet, causing an error. Welcome to
			// TC39's vision of inheritance for JavaScript.
			defer(() => this.needsUpdate())
		}
	}

	get composedLumeChildren(): Node[] {
		const result: Node[] = []
		for (const child of super.composedLumeChildren) if (isNode(child)) result.push(child)
		return result
	}

	/**
	 * @method traverseSceneGraph - This traverses the composed tree of
	 * LUME 3D elements (the scene graph) including this element, in pre-order. It skips non-LUME elements.
	 *
	 * This is similar to
	 * [`Scene#traverseSceneGraph`](./Scene.md#traversescenegraph) but traversal
	 * includes the Node that this is called on.
	 *
	 * Example:
	 *
	 * ```js
	 * node.traverseSceneGraph(n => {
	 *   console.log(node === n) // true for the first call only
	 *   console.log(n instanceof LUME.Node) // true
	 * })
	 * ```
	 *
	 * @param {(node: Node) => void} visitor - A function called for each
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
	override traverseSceneGraph(visitor: (node: Node) => void, waitForUpgrade = false): Promise<void> | void {
		visitor(this)

		if (!waitForUpgrade) {
			for (const child of this.composedLumeChildren) child.traverseSceneGraph(visitor, waitForUpgrade)
			return
		}

		// if waitForUpgrade is true, we make a promise chain so that
		// traversal order is still the same as when waitForUpgrade is false.
		let promise: Promise<any> = Promise.resolve()

		for (const child of this.composedLumeChildren) {
			const isUpgraded = child.matches(':defined')

			if (isUpgraded) {
				promise = promise!.then(() => child.traverseSceneGraph(visitor, waitForUpgrade))
			} else {
				promise = promise!
					.then(() => customElements.whenDefined(child.tagName.toLowerCase()))
					.then(() => child.traverseSceneGraph(visitor, waitForUpgrade))
			}
		}

		return promise
	}

	_loadCSS() {
		if (!super._loadCSS()) return false

		this._cssStopFns.push(
			autorun(() => {
				this._elementOperations.shouldRender = this.visible
				this.needsUpdate()
			}),
		)

		return true
	}

	_loadGL() {
		if (!super._loadGL()) return false

		this._glStopFns.push(
			autorun(() => {
				this.three.visible = this.visible
				this.needsUpdate()
			}),
		)

		return true
	}
}

// Put initial value on the prototype to make it available during construction
// in a super() call.
// @ts-ignore
Node.prototype.isNode = true

import type {ElementAttributes} from '@lume/element'

declare module '@lume/element' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-node': ElementAttributes<Node, NodeAttributes>
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'lume-node': Node
	}
}

// Exposes the `has=""` attribute type definition for all elements in TypeScript JSX templates.
import type {} from 'element-behaviors/src/attribute-types'

function isNode(n: any): n is Node {
	return n.isNode
}
