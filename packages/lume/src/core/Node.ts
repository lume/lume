import {autorun, reactive, booleanAttribute} from '@lume/element'
import {emits} from '@lume/eventful'
import {Mixin, MixinResult, Constructor} from 'lowclass'
import ImperativeBase, {initImperativeBase} from './ImperativeBase'
import {default as HTMLInterface} from '../html/HTMLNode'

// register behaviors that can be used on this element
import '../html/behaviors/ObjModelBehavior'

initImperativeBase()

const _Node = Mixin(NodeMixin)

/**
 * @extends ImperativeBase
 * @extends HTMLNode
 * @class Node - All objects in a 3D scene are an instance of Node. In other
 * words, the classes for anything that will be in a 3D scene are subclasses of
 * this class. Node contains the basics that all objects in a 3D scene need,
 * for example a transform (position, rotation, scale, etc) and a size.
 *
 * Instances of Node can be used for simple CSS
 * rendering by placing HTML content inside of them, for example:
 *
 * <div id="example1"></div>
 * <script type="application/javascript">
 *   new Vue({
 *     el: '#example1',
 *     template: '<live-code :template="code" mode="html>iframe" :debounce="200" />',
 *     data: {
 *       code:
 * `<script src="${location.origin+location.pathname}/global.js"><\/script>
 *
 * <lume-scene>
 *   <lume-node
 *     id="container"
 *     size="100 100"
 *     position="100 100"
 *   >
 *     Hello 3D World!
 *   </lume-node>
 * </lume-scene>
 *
 * <style>
 *   html, body {
 *     margin: 0; padding: 0;
 *     height: 100%; width: 100%;
 *   }
 *   lume-scene { background: #333 }
 *   lume-node { background: royalblue }
 * </style>
 *
 * <script>
 *   LUME.useDefaultNames()
 *   container.rotation = (x, y, z) => [x, ++y, z]
 * <\/script>
 * `
 *     },
 *   })
 * </script>
 *
 * Nodes can also be used as non-rendered parents that apply transforms to
 * their children. Here's an [example](/examples/hello3d-parent-transforms).
 *
 * Other classes that extend from Node may create [layouts](/examples/autolayout-declarative), or
 * may render [WebGL content](/examples/material-texture), etc.
 */
// TODO for now, hard-mixin the HTMLInterface class. We'll do this automatically later.
export const Node = _Node.mixin(HTMLInterface)
export interface Node extends InstanceType<typeof Node> {}
export default Node

function NodeMixin<T extends Constructor>(Base: T) {
	// NOTE for now, we assume Node is mixed with its HTMLInterface.
	const Parent = ImperativeBase.mixin(Constructor<HTMLInterface>(Base))

	@reactive
	class Node extends Parent {
		static defaultElementName = 'lume-node'

		@reactive @booleanAttribute(true) @emits('propertychange') visible = true

		isNode = true

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
		 * // TODO handle @example blocks
		 */
		constructor(...args: any[]) {
			super(...args)

			// The `parent` property can already be set if this instance is
			// already in the DOM and wwhile being upgraded into a custom
			// element.
			// TODO Remove this after we make it lazy and deferred this to a
			// render task.
			if (this.parent) {
				this._calcSize()
				this.needsUpdate()
			}
		}

		protected _onParentSizeChange() {
			// We only need to recalculate sizing and matrices if this node has
			// properties that depend on parent sizing (proportional size,
			// align, and mountPoint). mountPoint isn't obvious: if this node
			// is proportionally sized, then the mountPoint will depend on the
			// size of this element which depends on the size of this element's
			// parent. Align also depends on parent sizing.
			if (
				this.sizeMode.x === 'proportional' ||
				this.sizeMode.y === 'proportional' ||
				this.sizeMode.z === 'proportional' ||
				this.align.x !== 0 ||
				this.align.y !== 0 ||
				this.align.z !== 0
			) {
				this._calcSize()
				this.needsUpdate()
			}
		}

		protected _loadCSS() {
			if (!super._loadCSS()) return false

			this._cssStopFns.push(
				autorun(() => {
					this._elementOperations.shouldRender = this.visible
					this.needsUpdate()
				}),
			)

			return true
		}

		protected _loadGL() {
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

	return Node as MixinResult<typeof Node, T>
}
