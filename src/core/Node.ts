import {Mixin, MixinResult, Constructor} from 'lowclass'
import 'geometry-interfaces'
import ImperativeBase, {initImperativeBase} from './ImperativeBase'
import {default as HTMLInterface} from '../html/HTMLNode'
import {props, mapPropTo} from './props'

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
 * <i-scene>
 *   <i-node
 *     id="container"
 *     size="100 100"
 *     position="100 100"
 *   >
 *     Hello 3D World!
 *   </i-node>
 * </i-scene>
 *
 * <style>
 *   html, body {
 *     margin: 0; padding: 0;
 *     height: 100%; width: 100%;
 *   }
 *   i-scene { background: #333 }
 *   i-node { background: royalblue }
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

	class Node extends Parent {
		static defaultElementName = 'i-node'

		static props = {
			...(Parent.props || {}),
			visible: {...mapPropTo(props.boolean, (self: ImperativeBase) => self.three), default: true},
		}

		visible!: boolean

		isNode = true

		/**
		 * @constructor - Create a Node instance with the given `props`.
		 *
		 * Each option maps to a property on the instance. For example, writing
		 *
		 * ```js
		 * var node = new Node({
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
		 * The `props` property inherited from
		 * [`WithUpdate`](../html/WithUpdate) also works for setting multiple
		 * properties at once:
		 *
		 * ```js
		 * var node = new Node()
		 * node.props = {
		 *   size: {x:100, y:100, z:100},
		 *   rotation: {x:30, y:20, z:25}
		 * }
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

			// This was when using my `multiple()` implementation, we could call
			// specific constructors using specific arguments. But, we're using
			// class-factory style mixins for now, so we don't have control over the
			// specific arguments we can pass to the constructors, so we're just
			// using a single `options` parameter in all the constructors.
			//this.callSuperConstructor(Transformable, options)
			//this.callSuperConstructor(TreeNode)
			//this.callSuperConstructor(ImperativeBase)

			// `parent` can exist if this instance is in the DOM and being
			// upgraded.
			if (this.parent) {
				// if (this.isConnected) {
				this._calcSize()
				this.needsUpdate()
			}
		}

		// @method foo(v: number): boolean
		// a cool method to do cool stuff
		updated(oldProps: any, modifiedProps: any) {
			super.updated(oldProps, modifiedProps)

			if (modifiedProps.visible) {
				console.log(
					'                           visibility change',
					this.constructor.name,
					this._cssLoaded,
					this.visible,
				)
				setTimeout(() => {
					console.log(
						'                           visibility later',
						this.constructor.name,
						this._cssLoaded,
						this.visible,
					)
				}, 1000)
				this._elementOperations.shouldRender = this._cssLoaded && this.visible
				this.needsUpdate()
			}
		}

		// See ImperativeBase#add and ImperativeBase#remove.
		protected _onParentSizeChange() {
			// We only need to recalculate sizing and matrices if this node has
			// properties that depend on parent sizing (proportional size,
			// align, and mountPoint). mountPoint isn't obvious: if this node
			// is proportionally sized, then the mountPoint will depend on the
			// size of this element which depends on the size of this element's
			// parent. Align also depends on parent sizing.
			if (
				this._properties.sizeMode.x === 'proportional' ||
				this._properties.sizeMode.y === 'proportional' ||
				this._properties.sizeMode.z === 'proportional' ||
				this._properties.align.x !== 0 ||
				this._properties.align.y !== 0 ||
				this._properties.align.z !== 0
			) {
				this._calcSize()
				this.needsUpdate()
			}
		}

		protected _loadCSS() {
			if (this._cssLoaded) return
			console.log('                ----------------------------- LOAD NODE CSS')
			super._loadCSS()
			this.triggerUpdateForProp('visible')
		}

		protected _unloadCSS() {
			if (!this._cssLoaded) return
			console.log('                ----------------------------- UNLOAD NODE CSS')
			super._unloadCSS()
			this.triggerUpdateForProp('visible')
		}
	}

	return Node as MixinResult<typeof Node, T>
}

// const n: Node = new Node(1, 2, 3)
// n.asdfasdf
// n.calculatedSize = 123
// n.innerHTML = 123
// n.innerHTML = 'asdf'
// n.emit('asfasdf', 1, 2, 3)
// n.removeNode('asfasdf')
// n.updated(1, 2, 3, 4)
// n.blahblah
// n.sizeMode
// n._render(1, 2, 3)
// n.qwerqwer
// n.rotation
// n.three.sdf
// n.threeCSS.sdf
// n.possiblyLoadThree(new ImperativeBase!())
// n.possiblyLoadThree(1)
// n.visible = false
// n.visible = 123123
