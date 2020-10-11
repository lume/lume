import {Object3D} from 'three/src/core/Object3D'
import {Mixin, MixinResult, Constructor} from 'lowclass'
import {reactive, StopFunction, autorun, untrack} from '@lume/element'
import Transformable from './Transformable'
import ElementOperations from './ElementOperations'
import Motor from './Motor'
import {CSS3DObjectNested} from '../lib/three/CSS3DRendererNested'
import {disposeObject} from '../utils/three'
import {Events} from './Events'
import Settable from '../utils/Settable'
import {defer} from './Utility'

import type {TreeNode} from './TreeNode'
import type {Node} from './Node'
import type {Scene} from './Scene'
import type {XYZValuesObject} from './XYZValues'
import type {ConnectionType} from '../html/DeclarativeBase'

window.addEventListener('error', event => {
	const error = event.error

	// sometimes it can be `null` (f.e. for ScriptErrors).
	if (!error) return

	if (/Illegal constructor/i.test(error.message)) {
		console.error(`
            One of the reasons the following error can happen is if a Custom
            Element is called with 'new' before being defined.
            For other reasons, see: https://www.google.com/search?q=chrome%20illegal%20constructor
        `)
	}
})

// The following isScene and isNode functions are used in order to avoid using
// instanceof, which would mean that we would need to import Node and Scene as
// references, which would cause a circular depdency problem. The problem exists
// only when compiling to CommonJS modules, where the initImperativeBase trick
// won't work because functions don't hoiste in CommonJS like they do with
// ES-Module-compliant builds like with Webpack. We can look into the "internal
// module" pattern to solve the issue if we wish to switch back to using
// instanceof:
// https://medium.com/visual-development/how-to-fix-nasty-circular-dependency-issues-once-and-for-all-in-javascript-typescript-a04c987cf0de

function isScene(s: ImperativeBase): s is Scene {
	return s.isScene
}

function isNode(n: ImperativeBase): n is Node {
	return n.isNode
}

// TODO replace with Partial<DeclarativeBase> instead of re-writing properties manually
// @prod-prune @dev-prune
class PossiblyWebComponent {
	// TODO re-organize properties from WebComponent/DeclarativeBase
	childConnectedCallback?(child: Element): void
	childDisconnectedCallback?(child: Element): void
	protected _isPossiblyDistributedToShadowRoot?: boolean
	protected _distributedParent?: TreeNode // ImperativeBase causes "is referenced directly or indirectly" error
	protected _shadowRootParent?: TreeNode // ImperativeBase causes "is referenced directly or indirectly" error
	protected _composedParent?: TreeNode // ImperativeBase causes "is referenced directly or indirectly" error
	protected _deinit?(): void
}

/**
 * @abstract
 * @class ImperativeBase - An abstract base class that makes up the foundation
 * for the APIs and functionalities provided by the non-abstract Scene and Node
 * base classes.
 */
function ImperativeBaseMixin<T extends Constructor>(Base: T) {
	const Parent = Settable.mixin(Transformable.mixin(Constructor<PossiblyWebComponent>(Base)))

	@reactive
	class ImperativeBase extends Parent {
		// we don't need this, keep for backward compatibility (mainly
		// all my demos at trusktr.io).
		imperativeCounterpart = this

		// TODO re-organize variables like isScene and isNode, so they come from
		// one place. f.e. isScene is currently also used in DeclarativeBase.

		// for Scene instances
		isScene = false

		// for Node instances
		isNode = false

		constructor(...args: any[]) {
			super(...args)

			// See Transformable/Sizeable propertychange event.
			this.on('propertychange', this.__onPropertyChange, this)
		}

		private __onPropertyChange(): void {
			// if (this.parent) this._calcSize()
			this.needsUpdate()
		}

		get glLoaded(): boolean {
			return this._glLoaded
		}

		get cssLoaded(): boolean {
			return this._cssLoaded
		}

		private __three?: Object3D

		get three(): Object3D {
			// if (!(this.scene && this.scene.experimentalWebgl)) return null

			if (!this.__three) this.__three = this._makeThreeObject3d()

			return this.__three
		}

		private __threeCSS?: Object3D // TODO possible to constrain this to THREE.Scene or CSS3DObjectNested? Maybe with StrictUnion.

		get threeCSS(): Object3D {
			// if (!(this.scene && !this.scene.disableCss)) return null

			if (!this.__threeCSS) this.__threeCSS = this._makeThreeCSSObject()

			return this.__threeCSS!
		}

		connectedCallback() {
			super.connectedCallback()

			this._stopFns.push(
				autorun(() => {
					this.sizeMode
					this.size

					// Code wrapped with `untrack` causes dependencies not to be
					// tracked within that code, so it won't register more
					// dependencies for this autorun.
					untrack(() => {
						// TODO: size calculation should happen in a render task
						// just like _calculateMatrix, instead of on each property
						// change, unless the calculatedSize prop is acessed by the
						// user in which case it should trigger a calculation (sort
						// of like DOM properties that cause re-layout). We should
						// document to prefer not to force calculation, and instead
						// observe the property changes (f.e. with autorun()).
						if (this.parent) this._calcSize()
					})
				}),
				autorun(() => {
					this.sizeMode
					this.size
					this.position
					this.rotation
					this.scale
					this.origin
					this.align
					this.mountPoint
					this.opacity

					this.needsUpdate()
				}),
			)
		}

		possiblyLoadThree(child: ImperativeBase): void {
			// children can be non-lib DOM nodes (f.e. div, h1, etc)
			if (isNode(child)) {
				child._triggerLoadGL()
				child._triggerLoadCSS()
			}
		}

		possiblyUnloadThree(child: ImperativeBase): void {
			// children can be non-lib DOM nodes (f.e. div, h1, etc)
			// TODO, this check is redundant because call site already checks
			// for ImperativeBase? Or do we not want to run this on Scene
			// instances?
			if (isNode(child)) {
				child._triggerUnloadGL()
				child._triggerUnloadCSS()
			}
		}

		protected _onParentSizeChange?(size: XYZValuesObject<number>): void

		/**
		 * Called whenever a node is connected, but this is called with
		 * a connectionType that tells us how the node is connected
		 * (relative to the "flat tree" or "composed tree").
		 *
		 * @param  {"root" | "slot" | "actual"} connectionType - If the
		 * value is "root", then the child was connected as a child of a
		 * shadow root of the current node. If the value is "slot", then
		 * the child was distributed to the current node via a slot. If
		 * the value is "actual", then the child was connect to the
		 * current node as a regular child ("actual" is the same as
		 * childConnectedCallback).
		 */
		childComposedCallback(child: Element, connectionType: ConnectionType): void {
			if (child instanceof ImperativeBase) {
				// If ImperativeBase#add was called first, child's
				// `parent` will already be set, so prevent recursion.
				if (!child.parent) {
					// mirror the DOM connections in the imperative API's virtual scene graph.
					const __updateDOMConnection = connectionType === 'actual'
					this.add(child, __updateDOMConnection)
				}

				// Calculate sizing because proportional size might depend on
				// the new parent.
				child._calcSize()
				child.needsUpdate()

				// child should watch the parent for size changes.
				if (child._onParentSizeChange) this.on('sizechange', child._onParentSizeChange, child)

				this.possiblyLoadThree(child)
			}
		}

		childUncomposedCallback(child: Element, connectionType: ConnectionType): void {
			if (child instanceof ImperativeBase) {
				// If ImperativeBase#removeNode was called first, child's
				// `parent` will already be null, so prevent recursion.
				if (child.parent) {
					// mirror the connection in the imperative API's virtual scene graph.
					const __updateDOMConnection = connectionType === 'actual'
					this.removeNode(child, __updateDOMConnection)
				}

				this.off('sizechange', child._onParentSizeChange!, child)

				// Unload GL/CSS on _deinit instead of here, but change
				// Object3D hierarchy here.
				this.possiblyUnloadThree(child)
			}
		}

		/**
		 * Get the Scene that this Node is in, null if no Scene. This traverses up recursively
		 * at first, then the value is cached.
		 *
		 * @readonly
		 */
		get scene(): Scene {
			// NOTE: this._scene is initally null.

			const parent = this.parent
			// const parent = this.parent || this._composedParent

			// if already cached, return it. Or if no parent, return it (it'll be null).
			// Additionally, Scenes have this._scene already set to themselves.
			if (this._scene || !parent) return this._scene!

			if (!(parent instanceof ImperativeBase)) throw new Error('Expected instance of ImperativeBase')

			// if the parent node already has a ref to the scene, use that.
			if (parent._scene) {
				this._scene = parent._scene
			} else if (isScene(parent)) {
				// we could use instanceof here, but that causes a circular dependency
				this._scene = parent
			}
			// otherwise call the scene getter on the parent, which triggers
			// traversal up the scene graph in order to find the root scene (null
			// if none).
			else {
				this._scene = parent.scene
			}

			return this._scene!
		}

		/**
		 * @override
		 */
		// @ts-ignore: strict function types normally prevent differing subclass method signatures.
		add(
			// prettier-ignore
			childNode: ImperativeBase,
			__updateDOMConnection = true,
		): this {
			if (!(childNode instanceof ImperativeBase)) return this

			// We cannot add Scenes to Nodes, for now.
			if (isScene(childNode)) {
				return this

				// TODO Figure how to handle nested scenes. We were throwing
				// this error, but it has been harmless not to throw in the
				// existing demos.
				// throw new TypeError(`
				//     A Scene cannot be added to another Node or Scene (at
				//     least for now). To place a Scene in a Node, just mount
				//     a new Scene onto an HTMLNode with Scene.mount().
				// `)
			}

			super.add(childNode)

			// // Calculate sizing because proportional size might depend on
			// // the new parent.
			// childNode._calcSize()
			// childNode.needsUpdate()
			//
			// // child should watch the parent for size changes.
			// this.on('sizechange', childNode._onParentSizeChange, childNode)

			// FIXME remove the type cast here and modify it so it is
			// DOM-agnostic for when we run thsi in a non-DOM environment.
			if (__updateDOMConnection)
				this._elementOperations.connectChildElement((childNode as unknown) as HTMLElement)

			return this
		}

		removeNode(childNode: ImperativeBase, /* private */ __updateDOMConnection = true): this {
			if (!isNode(childNode)) return this

			super.removeNode(childNode)

			// this.off('sizechange', childNode._onParentSizeChange, childNode)

			if (__updateDOMConnection) this._elementOperations.disconnectChildElement(childNode)

			return this
		}

		needsUpdate(): void {
			// we don't need to render until we're connected into a tree with a scene.
			// if (!this.scene || !this.isConnected) return
			// TODO make sure we render when connected into a tree with a scene

			this._willBeRendered = true

			Motor.setNodeToBeRendered(this)
		}

		protected _glLoaded = false
		@reactive protected _cssLoaded = false
		protected _willBeRendered = false

		private __elOps?: ElementOperations

		// TODO Remove this type cast, see all the errors, then figure out how
		// to polyfill the APIs for use in a non-DOM environment (most likely in
		// the TreeNode base class).
		protected get _elementOperations(): ElementOperations {
			if (!this.__elOps) this.__elOps = new ElementOperations((this as unknown) as HTMLElement)
			return this.__elOps
		}

		// stores a ref to this Node's root Scene when/if this Node is
		// in a scene.
		@reactive protected _scene: Scene | null = null

		protected _makeThreeObject3d(): Object3D {
			return new Object3D()
		}

		protected _makeThreeCSSObject(): Object3D {
			// @prod-prune
			if (!(this instanceof HTMLElement)) throw 'API available only in DOM environment.'

			return new CSS3DObjectNested(this)
		}

		protected _connectThree(): void {
			if (
				this._isPossiblyDistributedToShadowRoot &&
				// check parent isn't a Scene because Scenes always
				// have shadow roots, and we treat distribution into
				// the Scene shacow root different than with all
				// other Nodes.
				this.parent !== this.scene
			) {
				if (this._distributedParent) {
					// TODO make sure this check works.
					// @prod-prune
					// if (!(this._distributedParent instanceof ImperativeBase))
					// 	throw new Error('expected _distributedParent to be ImperativeBase')

					;(this._distributedParent as ImperativeBase).three.add(this.three)
				}
			} else if (this._shadowRootParent) {
				// TODO make sure this check works.
				// @prod-prune
				// if (!(this._shadowRootParent instanceof ImperativeBase))
				// 	throw new Error('expected _distributedParent to be ImperativeBase')

				;(this._shadowRootParent as ImperativeBase).three.add(this.three)
			} else {
				// TODO make sure this check works.
				// @prod-prune
				// TODO instanceof check doesn't work here. Investigate Symbol.hasInstance feature in Mixin.
				// if (!(this.parent instanceof ImperativeBase)) throw new Error('expected parent to be ImperativeBase')

				this.parent && (this.parent as ImperativeBase).three.add(this.three)
			}

			this.needsUpdate()
		}

		protected _connectThreeCSS(): void {
			// @ts-ignore
			if (
				this._isPossiblyDistributedToShadowRoot &&
				// check parent isn't a Scene because Scenes always
				// have shadow roots, and we treat distribution into
				// the Scene shacow root different than with all
				// other Nodes.
				this.parent !== this.scene
			) {
				if (this._distributedParent) {
					// TODO make sure this check works.
					// @prod-prune
					// if (!(this._distributedParent instanceof ImperativeBase))
					// 	throw new Error('Expected _distributedParent to be a LUME Node.')

					;(this._distributedParent as ImperativeBase).threeCSS.add(this.threeCSS)
				}
			} else if (this._shadowRootParent) {
				// TODO make sure this check works.
				// @prod-prune
				// if (!(this._shadowRootParent instanceof ImperativeBase))
				// 	throw new Error('Expected _distributedParent to be a LUME Node.')

				;(this._shadowRootParent as ImperativeBase).threeCSS.add(this.threeCSS)
			} else {
				// TODO make sure this check works.
				// @prod-prune
				// if (!(this.parent instanceof ImperativeBase)) throw new Error('Expected parent to be a LUME Node.')

				this.parent && (this.parent as ImperativeBase).threeCSS.add(this.threeCSS)
			}

			this.needsUpdate()
		}

		protected _glStopFns: StopFunction[] = []

		protected _loadGL(): boolean {
			if (!(this.scene && this.scene.experimentalWebgl)) return false

			if (this._glLoaded) return false

			this._glLoaded = true

			// we don't let Three update local matrices automatically, we do
			// it ourselves in Transformable._calculateMatrix and
			// Transformable._calculateWorldMatricesInSubtree
			this.three.matrixAutoUpdate = false

			// NOTE, this.parent works here because _loadGL
			// is called by childConnectedCallback (or when
			// distributed to a shadow root) at which point a child
			// is already upgraded and thus has this.parent
			// API ready. Only a Scene has no parent.
			//
			// this.parent && this.parent.three.add(this.three)
			this._connectThree()

			this.needsUpdate()

			return true
		}

		protected _unloadGL(): boolean {
			if (!this._glLoaded) return false

			this._glLoaded = false

			for (const stop of this._glStopFns) stop()

			this.__three && disposeObject(this.__three)
			this.__three = undefined

			this.needsUpdate()

			return true
		}

		protected _cssStopFns: StopFunction[] = []

		protected _loadCSS(): boolean {
			const cssIsEnabled = this.scene && !this.scene.disableCss

			if (!cssIsEnabled) return false

			if (this._cssLoaded) return false
			this._cssLoaded = true

			// we don't let Three update local matrices automatically, we do
			// it ourselves in Transformable._calculateMatrix and
			// Transformable._calculateWorldMatricesInSubtree
			this.threeCSS.matrixAutoUpdate = false

			// NOTE, this.parent works here because _loadCSS
			// is called by childConnectedCallback (or when
			// distributed to a shadow root) at which point a child
			// is already upgraded and thus has this.parent
			// API ready. Only a Scene has no parent.
			// this.parent && this.parent.threeCSS.add(this.threeCSS)
			this._connectThreeCSS()

			this.needsUpdate()

			return true
		}

		protected _unloadCSS(): boolean {
			if (!this._cssLoaded) return false

			this._cssLoaded = false

			for (const stop of this._cssStopFns) stop()

			this.__threeCSS && disposeObject(this.__threeCSS)
			this.__threeCSS = undefined

			this.needsUpdate()

			return true
		}

		protected _triggerLoadGL(): void {
			if (!this._loadGL()) return

			this.emit(Events.BEHAVIOR_GL_LOAD, this)

			defer(async () => {
				// FIXME Can we get rid of the code deferral here? Without the
				// deferral of a total of three microtasks, then GL_LOAD may
				// fire before behaviors have loaded GL (when their
				// connectedCallbacks fire) due to ordering of when custom
				// elements and element-behaviors life cycle methods fire, and
				// thus the user code that relies on GL_LOAD will modify
				// Three.js object properties and then once the behaviors load
				// the behaviors overwrite the users' values.
				await null
				await null

				this.emit(Events.GL_LOAD, this)
			})

			for (const child of this.subnodes) (child as ImperativeBase)._triggerLoadGL()
		}

		protected _triggerUnloadGL(): void {
			this._unloadGL()
			this.emit(Events.BEHAVIOR_GL_UNLOAD, this)
			defer(() => this.emit(Events.GL_UNLOAD, this))
		}

		protected _triggerLoadCSS(): void {
			if (!this._loadCSS()) return

			this.emit(Events.CSS_LOAD, this)
			for (const child of this.subnodes) (child as ImperativeBase)._triggerLoadCSS()
		}

		protected _triggerUnloadCSS(): void {
			this._unloadCSS()
			this.emit(Events.CSS_UNLOAD, this)
		}

		protected _render(timestamp: number): void {
			super._render(timestamp)

			// TODO, pass the needed data into the elementOperations calls,
			// instead of relying on ElementOperations knowing about
			// non-HTMLElement features. See the TODOs in __applyStyle and
			// __applyOpacity there.
			this._elementOperations.applyImperativeNodeProperties()
		}

		// This method is used by Motor._renderNodes().
		protected _getNearestAncestorThatShouldBeRendered(): ImperativeBase | false {
			let parent = this.parent

			while (parent) {
				// TODO it'd be nice to have a way to prune away runtime type checks in prod mode.
				// @prod-prune
				if (!(parent instanceof ImperativeBase)) throw new Error('expected ImperativeBase')

				if (parent._willBeRendered) return parent
				parent = parent.parent
			}

			return false
		}
	}

	return ImperativeBase as MixinResult<typeof ImperativeBase, T>

	// TODO see "function MixinResult" below
	// return MixinResult<T>(class ImperativeBase extends Parent {
	//     // ...
	// })
}

// TODO Once we get type-inference on generic types with partially-elided args,
// then we can use this MixinResult function to make the defintions more terse.
// See: https://github.com/microsoft/TypeScript/pull/26349#issuecomment-511222214
// function MixinResult<TBase extends Constructor, TClass extends Constructor = Constructor>(Class: TClass) {
//     return Class as Constructor<InstanceType<TClass> & InstanceType<TBase>> & TClass & TBase
// }

type _ImperativeBase = ReturnType<typeof makeMixin>

// We explicitly use `var` instead of `let` here because it is hoisted for the
// Node and Scene modules. This, along with the following initImperativeBase
// function, allows the circular dependency between this module and the Node and
// Scene modules to work. For details on why, see
// https://esdiscuss.org/topic/how-to-solve-this-basic-es6-module-circular-dependency-problem.
export var ImperativeBase: _ImperativeBase
export interface ImperativeBase extends InstanceType<_ImperativeBase> {}

// Here we wrap the definition of the ImperativeBase class with this function in
// order to solve the circular depdendency problem caused by the
// Node<->ImperativeBase and Scene<->ImperativeBase circles. The Node and Scene
// modules call initImperativeBase to ensure that the ImperativeBase declaration
// happens first, and then those modules can use the live binding in their
// declarations.
initImperativeBase()
export function initImperativeBase() {
	/**
	 * The ImperativeBase class is the base class for the Imperative version of the
	 * API, for people who chose to take the all-JavaScript approach and who will
	 * not use the HTML-based API.
	 *
	 * In the future when there is an option to disable the HTML-DOM rendering (and
	 * render only WebGL, for example) then the imperative API will be the only API
	 * available since the HTML API will be turned off as a result of disabling
	 * HTML rendering. Disabling both WebGL and HTML won't make sense, as we'll need
	 * at least one of those to render with.
	 */
	if (!ImperativeBase) ImperativeBase = makeMixin()
}

function makeMixin() {
	return Mixin(ImperativeBaseMixin)
}

// "as default" form is required here, otherwise it'll break.
export {ImperativeBase as default}
