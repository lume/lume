import {Object3D} from 'three/src/core/Object3D.js'
import {reactive, StopFunction, autorun, untrack, element} from '@lume/element'
import {Transformable} from './Transformable.js'
import {ElementOperations} from './ElementOperations.js'
import {Motor} from './Motor.js'
import {CSS3DObjectNested} from '../lib/three/CSS3DRendererNested.js'
import {disposeObject} from '../utils/three.js'
import {Events} from './Events.js'
import {Settable} from '../utils/Settable.js'
import {defer, toRadians} from './utils.js'

import type {Node} from './Node.js'
import type {Scene} from './Scene.js'
import type {ConnectionType} from './DeclarativeBase.js'
import type {TransformableAttributes} from './Transformable.js'

// The following isScene and isNode functions are used in order to avoid using
// instanceof, which would mean that we would need to import Node and Scene as
// references, which would cause a circular depdency problem. The problem exists
// only when compiling to CommonJS modules, where the initImperativeBase trick
// won't work because functions don't hoiste in CommonJS like they do with
// ES-Module-compliant builds like with Webpack. We can look into the "internal
// module" pattern to solve the issue if we wish to switch back to using
// instanceof:
// https://medium.com/visual-development/how-to-fix-nasty-circular-dependency-issues-once-and-for-all-in-javascript-typescript-a04c987cf0de

function isScene(s: HTMLElement & {isScene?: boolean}): s is Scene {
	return s.isScene!
}

function isNode(n: HTMLElement & {isNode?: boolean}): n is Node {
	return n.isNode!
}

const threeJsPostAdjustment = [0, 0, 0]
const alignAdjustment = [0, 0, 0]
const mountPointAdjustment = [0, 0, 0]
const appliedPosition = [0, 0, 0]

const elOps = new WeakMap<ImperativeBase, ElementOperations>()

export type BaseAttributes = TransformableAttributes

/**
 * @abstract
 * @class ImperativeBase - This is an abstract base class that provides common
 * properties and methods for the non-abstract [`Node`](./Node) and
 * [`Scene`](./Scene) custom element classes.
 *
 * This class is not intended for extension by end users. You'll want to extend
 * from [`Scene`](/api/core/Scene) or [`Node`](/api/core/Node) (or their
 * subclasses) instead of this class.
 *
 * For purposes of documentation it is still useful to know what properties and
 * methods subclasses inherit from here.
 *
 * @extends Settable
 * @extends Transformable
 */
// TODO @abstract jsdoc tag

// function makeImperativeBase() {
@element
export class ImperativeBase extends Settable(Transformable) {
	// TODO re-organize variables like isScene and isNode, so they come from
	// one place. f.e. isScene is currently also used in DeclarativeBase.

	/** @property {boolean} isScene - True if a subclass of this class is a Scene. */
	isScene = false

	/** @property {boolean} isNode - True if a subclass of this class is a Node. */
	isNode = false

	/**
	 * @property {boolean} glLoaded
	 *
	 * *readonly*
	 *
	 * Returns a boolean indicating whether or not the WebGL rendering features
	 * of a LUME element are loaded and ready.
	 *
	 * All nodes in a `<lume-scene>` element have WebGL rendering disabled by
	 * default.
	 *
	 * If a `<lume-scene>` element has the `webgl` attribute set to
	 * `"false"` (the default), then `glLoaded` will always return `false` for any LUME
	 * elements in the scene.
	 *
	 * If a `<lume-scene>` element has the `webgl` attribute set to
	 * `"true"`, then `glLoaded` will always return `true` for any LUME
	 * elements in the scene only *after* WebGL APIs have been loaded
	 * (otherwise `false` up until then).
	 */
	get glLoaded(): boolean {
		return this._glLoaded
	}

	/**
	 * @property {boolean} cssLoaded
	 *
	 * *readonly*
	 *
	 * Returns a boolean indicating whether or not the CSS rendering features
	 * of a LUME element are loaded and ready.
	 *
	 * All nodes in a `<lume-scene>` element have CSS rendering enabled by
	 * default.
	 *
	 * If a `<lume-scene>` element has the `enableCss` attribute set to
	 * `"false"`, then `cssLoaded` will always return `false` for any LUME
	 * elements in the scene.
	 *
	 * If a `<lume-scene>` element has the `enableCss` attribute set to
	 * `"true"` (the default), then `cssLoaded` will always return `true` for
	 * any LUME elements in the scene only after CSS APIs have been loaded
	 * (otherwise 'false' up until then).
	 */
	get cssLoaded(): boolean {
		return this._cssLoaded
	}

	// stores a ref to this Node's root Scene when/if this Node is
	// in a scene.
	@reactive _scene: Scene | null = null

	/**
	 * @property {THREE.Scene} scene -
	 *
	 * *reactive*, *readonly*
	 *
	 * The `<lume-scene>` that the element is a child or grandchild of, `null`
	 * if the element is not a descendant of a Scene, `null` if the child is a
	 * descendant of a Scene that is not connected into the DOM, or `null` if
	 * the element is a descendant of a connected Scene but the element is not
	 * participating in the composed tree (i.e. the element is not distributed
	 * to a `<slot>` element of a ShadowRoot of the element's parent).
	 */
	get scene(): Scene | null {
		return this._scene
	}

	// We use F-Bounded Polymorphism in the following `three` and `threeCSS`
	// properties by referring to `this` in their type definitions to make
	// it possible for subclasses to define the types of the three and
	// threeCSS properties based on the return type of their
	// `makeThreeObject3d` and `makeThreeCSSObject` methods. A simple
	// example of the pattern is demonstrated here:
	// https://www.typescriptlang.org/play?#code/MYGwhgzhAECCB2BLAtmE0DeAoa0BmA9gdALzQCMATAMxYC+WWokMAwmAC7QCmAHh93gATGAhRpMOaACMwAJ1LQOcgK7d6jZlGgAFcPC7ZcsgF6KqtBk3DaAKnO7ce-QSN37DUkAQfJzNDSwwaQhlMGAuLRhbAAtEeABzABkCADduBSNoYNC5cK5UAGtuWPiEgAoASgAuaBV4QvgCAHd4RlwABzlEVM4nAH1+jjjEgH5agCVuDhU5eFsATw7uAB5hxAgAbQByIpKRhO2AXQA+dugAegvoACFIJyjoLrTEIW4YMGhwEwXoBzAhAR4CBfglpgI5AAaaAQFTSKLvGExAgqEBCaBNLjwRzojjEBwAWjeeHiTnWEAAdFIrtBSjANtB4gJhNx0YQFK46hAMjByssCB0QE5MdAimUYXCERBoSBEMVoAAJWwAWSSFwAIgB5ZWisBIDqozg+CCVKm4MFcdaJKqTaazeZLVbknZ7UqJY4nSS4XCIPDQcoAQnJFMGVoSlSUcUpoYOimDroOVWyMCmMzmi2WayjLrAxTdh1O51wNIppeggJhBGQTi6PT6MJmeD9zUQw0jGxD-T14nQMQyTlLVKkuAcafg7ejQwOUgYVhyYQi0EeYlQIBS6Q5LmE0QO64yXsu1zpjPpBlcrPwPgl8JsHxUw2NSmIaQy3TeZt1ecTNTgSFXB5HO05gxbhml-HsZ0CR52A4PdN2ZNwVzQOCDxpWEbxYJc9WgF85DfJw9iQ9A8SeOQXjebJrw4R0cL9IiPwTMokyyQCxxAsCYMgucQgXSJb3cPVYNw5wEJ3MoUKyGljwZJlzzZK90MeMB72ROQYBI3D8IY3N9iYn89EEgC-iA8dsTAgyDC4xhrEw9UCGSYS+FE8DVwk6lrgAUQmCZNQmf0EiIIRoWkbhgGU7lP24IjRRUUJjLY7Douo5ZKikRjrQjFj4vtdjaQcdRcFnTR+PsRwUKc1wYAsoSN1Q64ADliFfK9ygCgggpkULwoInTotHe0PiomiCD9arUtwdKKky4dsuAsy8scKymCBOLgEUeaYLg5b4DirgyHm0ruC2rAOApMNDwW9RgDO2MaRgoA
	// A limitation is that we can not make the `makeThreeObject3d` or
	// `makeThreeCSSObject` methods protected, because TypeScript does not allow
	// that with F-Bounded Types. To achieve pseudo-protectedness, we
	// could use Symbol for that as in this example:
	// https://www.typescriptlang.org/play?#code/MYGwhgzhAECCB2BLAtmE0DeAoa0BmA9gdALzQCMATAMxYC+WWokMAwmAC7QCmAHh93gATGAhRpMOaACMwAJ1LQOcgK7d6jYAXgQuqANbcxqdGQDKAT2TSCIABQBKTeChwkJgDIEAbtwXYpAAc5RG9ObmgAfUiwdzQAfgAuaAAlbg4VOXgAFQtA7gAeDgALRAgAbQ487gI8aAMjOJAAXQA+RlwAek7oACFICOZXYJ9EIW4YMGhwAC8LaDluMCFtEHmAc3SBOQAaaAgVaSGICf3ighUQIWh4Ai54bm5rjmJFgFpxvEQHpVKIADopN1oNk-tAyuD4AJhE98AQFIJrioTnIYHZ8gRAiAIrc9GB9N91vtDscJnsQIhDNAABLZACyHk6ABEAPJ0+qxRCBS6ceEQByA3CbLickyOZJpDJZXL5Ip-SrVWocwzGNBtSS4XCIOp2ACEJTK-2iorQDl+huNTUUBoqDVVLUc0EgqXSmRy1TlZQVGLqdqabQ6muBTOIEAIyAiwVC4RkA2gx32GTwdQA7ogSuaAZbxCBA7hFlL4JmjTEmlIGECeqCITWoYjYYQFAcji5JioSnzoHY8P9uP9oBisRFPt9CTduCmlNUYEraQzmWyeNiI1D+VJyn6c81xW4cxrNQW3ePJ-by4HdJxEMBlY0c8kqj6b-bFJuTBomK3oOwOF5fAj+IiohNL+fj7sCzYJsAsTQJiHCINoaBrDBf4hOMmZ7C80ArAO8hwcAPIKAa8DrDAaYZiUETfBe8DAH2672iBcj-K+ao7t++75q6WTHl+nBnhWWg6Fw15kA8k7foxmjaLoTqKMA-wmiAQA
	// Original documentation on F-Bounded Polymorphism in TypeScript:
	// https://www.typescriptlang.org/docs/handbook/advanced-types.html#polymorphic-this-types

	// TODO make this reactive, so that if we replace the three object outside
	// code will know to clean up anything relying on the old object and adapt
	// to the new object?
	__three?: ReturnType<this['makeThreeObject3d']>

	/**
	 * @property {Object3D} three -
	 *
	 * *readonly*
	 *
	 * The WebGL rendering content of this element. Useful if you know Three.js
	 * APIs. See
	 * [`Object3D`](https://threejs.org/docs/index.html#api/en/core/Object3D).
	 */
	get three(): ReturnType<this['makeThreeObject3d']> {
		if (!this.__three) this.__three = this.__makeThreeObject3d()

		return this.__three
	}

	__makeThreeObject3d(): ReturnType<this['makeThreeObject3d']> {
		const o = this.makeThreeObject3d() as ReturnType<this['makeThreeObject3d']>
		// Helpful for debugging when looking in devtools.
		// @prod-prune
		o.name = `${this.tagName}${this.id ? '#' + this.id : ''} (webgl, ${o.type})`
		return o
	}

	__disposeThree() {
		this.__three && disposeObject(this.__three)
		this.__three = undefined
	}

	/**
	 * @method recreateThree - Replaces the current three object with a new
	 * one, reconnecting it to the same parent and children. This can be useful
	 * in scenarios where a property of a three object needs to be updated but the property
	 * can only be updated via the constructor, requiring us to make a new object.
	 */
	recreateThree() {
		const children = this.__three?.children
		this.__disposeThree()
		// The three getter is used here, which makes a new instance
		this._connectThree()

		// Three.js crashes on arrays of length 0.
		if (children && children.length) this.three.add(...children)
	}

	__threeCSS?: ReturnType<this['makeThreeCSSObject']>

	/**
	 * @property {Object3D} threeCSS -
	 *
	 * *readonly*
	 *
	 * The CSS rendering content of this element. Useful if you know Three.js
	 * APIs. See
	 * [`THREE.Object3D`](https://threejs.org/docs/index.html#api/en/core/Object3D).
	 */
	get threeCSS(): ReturnType<this['makeThreeCSSObject']> {
		if (!this.__threeCSS) this.__threeCSS = this.__makeThreeCSSObject()

		return this.__threeCSS
	}

	__makeThreeCSSObject() {
		const o = this.makeThreeCSSObject() as ReturnType<this['makeThreeCSSObject']>
		// @prod-prune
		o.name = `${this.tagName}${this.id ? '#' + this.id : ''} (css3d, ${o.type})`
		return o
	}

	__disposeThreeCSS() {
		this.__threeCSS && disposeObject(this.__threeCSS)
		this.__threeCSS = undefined
	}

	/**
	 * @method recreateThreeCSS - Replaces the current threeCSS object with a new
	 * one, reconnecting it to the same parent and children. This can be useful
	 * in scenarios where a property of a threeCSS object needs to be updated but the property
	 * can only be updated via the constructor, requiring us to make a new object.
	 */
	recreateThreeCSS() {
		const children = this.__threeCSS?.children
		this.__disposeThreeCSS()
		// The threeCSS getter is used here, which makes a new instance
		this._connectThreeCSS()
		if (children) this.threeCSS.add(...children)
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
					// TODO: Size calculation should happen in a render task
					// just like _calculateMatrix, instead of on each property
					// change, unless the calculatedSize prop is acessed by the
					// user in which case it should trigger a calculation (sort
					// of like DOM properties that cause re-layout). We should
					// document to prefer not to force calculation, and instead
					// observe the property changes (f.e. with autorun()).
					this._calcSize()
				})
			}),
			autorun(() => {
				const composedParent = this.composedSceneGraphParent

				if (!composedParent) return

				composedParent.calculatedSize

				untrack(() => {
					if (
						this.sizeMode.x === 'proportional' ||
						this.sizeMode.y === 'proportional' ||
						this.sizeMode.z === 'proportional' ||
						this.alignPoint.x !== 0 ||
						this.alignPoint.y !== 0 ||
						this.alignPoint.z !== 0
					) {
						this._calcSize()
						this.needsUpdate()
					}
				})
			}),
			autorun(() => {
				this.sizeMode
				this.size
				this.position
				this.rotation
				this.scale
				this.origin
				this.alignPoint
				this.mountPoint
				this.opacity

				this.needsUpdate()
			}),
		)
	}

	disconnectedCallback(): void {
		super.disconnectedCallback()

		this.__possiblyUnloadThree(this)
		this._scene = null
	}

	/**
	 * Called whenever a node is connected. This is called with
	 * a connectionType that tells us how the node is connected
	 * (relative to the "flat tree" or "composed tree").
	 *
	 * @param  {"root" | "slot" | "actual"} connectionType - If the value is
	 * "root", then the child was connected as a child of a shadow root of the
	 * current node. If the value is "slot", then the child was distributed to
	 * the current node via a slot. If the value is "actual", then the
	 * child was connected to the current node as a regular child
	 * (childComposedCallback with "actual" being passed in is essentially the
	 * same as childConnectedCallback).
	 */
	childComposedCallback(child: Element, _connectionType: ConnectionType): void {
		if (!(child instanceof ImperativeBase)) return

		// This code may run during a super constructor (f.e. while constructing
		// a Scene and it calls `super()`), therefore a Scene's _scene property
		// will not be set yet, hence the use of `isScene(this) && this` here as
		// an alternative.
		const scene = this._scene ?? (isScene(this) && this)

		if (scene) this.__giveSceneToChildrenAndMaybeLoadThree(child, scene)
	}

	childUncomposedCallback(child: Element, _connectionType: ConnectionType): void {
		if (!(child instanceof ImperativeBase)) return
		this.__possiblyUnloadThree(child)
		child._scene = null
	}

	__giveSceneToChildrenAndMaybeLoadThree(node: ImperativeBase, scene: Scene) {
		node.traverseSceneGraph(subnode => {
			subnode._scene = scene

			// Calculate sizing because proportional size might depend on
			// the new parent.
			subnode._calcSize()
			subnode.needsUpdate()

			this.__possiblyLoadThree(subnode)
		})
	}

	/** @abstract */
	traverseSceneGraph(_visitor: (node: Node) => void, _waitForUpgrade = false): Promise<void> | void {
		throw 'Node and Scene implement this'
	}

	__possiblyLoadThree(node: ImperativeBase): void {
		// Skip scenes because scenes call their own _trigger* methods based on
		// values of their webgl or enabled-css attributes.
		if (!isNode(node)) return

		node._triggerLoadGL()
		node._triggerLoadCSS()
	}

	__possiblyUnloadThree(node: ImperativeBase): void {
		// Skip scenes because scenes call their own _trigger* methods based on
		// values of their webgl or enabled-css attributes.
		if (!isNode(node)) return

		node._triggerUnloadGL()
		node._triggerUnloadCSS()
	}

	/**
	 * Overrides [`TreeNode.lumeParent`](./TreeNode?id=lumeparent) to assert
	 * that parents are `ImperativeBase` (`Node` or `Scene`) instances.
	 */
	// This override serves to change the type of `lumeParent` for
	// subclasses of ImperativeBase.
	// Nodes (f.e. Mesh, Sphere, etc) and Scenes should always have parents
	// that are Nodes or Scenes (at least for now).
	// @prod-prune
	override get lumeParent(): ImperativeBase | null {
		const parent = super.lumeParent

		// @prod-prune
		if (parent && !(parent instanceof ImperativeBase)) throw new TypeError('Parent must be type ImperativeBase.')

		return parent
	}

	/**
	 * @method needsUpdate - Schedules a rendering update for the element.
	 * Usually you don't need to call this when using the outer APIs, as setting
	 * attributes or properties will queue an update.
	 *
	 * But if you're doing something special to a Node or a Scene, f.e.
	 * modifying the [`.three`](#three) or [`.threeCSS`](#threeCSS) properties
	 * whose updates are not tracked (are not reactive), you should call this so
	 * that LUME will know to re-render the visuals for the element.
	 *
	 * Example:
	 *
	 * ```js
	 * const mesh = document.querySelector('lume-mesh')
	 *
	 * // Custom modification of underlying Three.js objects:
	 * mesh.three.material.transparent = true
	 * mesh.three.material.opacity = 0.4
	 * mesh.three.add(new THREE.Mesh(...))
	 *
	 * // Tell LUME the elements needs to be re-rendered.
	 * mesh.needsUpdate()
	 * ```
	 */
	needsUpdate(): void {
		// we don't need to render until we're connected into a tree with a scene.
		// if (!this.scene || !this.isConnected) return
		// TODO make sure we render when connected into a tree with a scene

		// TODO, we already call Motor.setNodeToBeRendered(node), so instead
		// of having a __willBeRendered property, we can have a
		// Motor.nodeWillBeRendered(node) method.
		this.__willBeRendered = true

		Motor.setNodeToBeRendered(this)
	}

	_glLoaded = false
	@reactive _cssLoaded = false
	__willBeRendered = false

	get _elementOperations(): ElementOperations {
		if (!elOps.has(this)) elOps.set(this, new ElementOperations(this))
		return elOps.get(this)!
	}

	/**
	 * @method makeThreeObject3d -
	 *
	 * *protected*
	 *
	 * Creates a LUME element's Three.js object for
	 * WebGL rendering. `<lume-mesh>` elements override this to create and return
	 * [THREE.Mesh](https://threejs.org/docs/index.html?q=mesh#api/en/objects/Mesh) instances,
	 * for example.
	 */
	// TODO @protected jsdoc tag
	makeThreeObject3d(): Object3D {
		return new Object3D()
	}

	/**
	 * @method makeThreeCSSObject -
	 *
	 * *protected*
	 *
	 * Creates a LUME element's Three.js object
	 * for CSS rendering. At the moment this is not overriden by any
	 * subclasses, and always creates `CSS3DObjectNested` instances for CSS
	 * rendering, which is a modified version of
	 * [THREE.CSS3DObject](https://github.com/mrdoob/three.js/blob/b13eccc8bf1b6aeecf6e5652ba18d2425f6ec22f/examples/js/renderers/CSS3DRenderer.js#L7).
	 */
	makeThreeCSSObject(): Object3D {
		// @prod-prune, this will be only allowed in a DOM environment with CSS
		// rendering. WebGL APIs will eventually work outside a DOM
		// environment.
		if (!(this instanceof HTMLElement)) throw 'API available only in DOM environment.'

		return new CSS3DObjectNested(this)
	}

	_connectThree(): void {
		this.composedSceneGraphParent?.three.add(this.three)
		this.needsUpdate()
	}

	_connectThreeCSS(): void {
		this.composedSceneGraphParent?.threeCSS.add(this.threeCSS)
		this.needsUpdate()
	}

	get composedLumeParent(): ImperativeBase | null {
		const result = super.composedLumeParent
		if (!(result instanceof ImperativeBase)) return null
		return result
	}

	get composedSceneGraphParent(): ImperativeBase | null {
		// check if lumeParent is a Scene because Scenes always have shadow
		// roots as part of their implementation (users will not be adding
		// shadow roots to them), and we treat distribution into a Scene shadow
		// root different than with all other Nodes (users can add shadow roots
		// to those). Otherwise _distributedParent for a lume-node that is
		// child of a lume-scene will be a non-LUME element that is inside of
		// the lume-scene's ShadowRoot, and things will not work in that case
		// because the top-level Node elements will seem to not be composed to
		// any Scene element.
		if (this.lumeParent?.isScene) return this.lumeParent

		return this.composedLumeParent
	}

	_glStopFns: StopFunction[] = []

	_loadGL(): boolean {
		if (!(this.scene && this.scene.webgl)) return false

		if (this._glLoaded) return false
		this._glLoaded = true

		// we don't let Three update local matrices automatically, we do
		// it ourselves in _calculateMatrix and _calculateWorldMatricesInSubtree
		this.three.matrixAutoUpdate = false

		this._connectThree()
		this.needsUpdate()

		return true
	}

	_unloadGL(): boolean {
		if (!this._glLoaded) return false
		this._glLoaded = false

		for (const stop of this._glStopFns) stop()
		this._glStopFns.length = 0

		this.__disposeThree()
		this.needsUpdate()

		return true
	}

	_cssStopFns: StopFunction[] = []

	_loadCSS(): boolean {
		const cssIsEnabled = this.scene && this.scene.enableCss

		if (!cssIsEnabled) return false

		if (this._cssLoaded) return false
		this._cssLoaded = true

		// We don't let Three update local matrices automatically, we do
		// it ourselves in _calculateMatrix and _calculateWorldMatricesInSubtree.
		this.threeCSS.matrixAutoUpdate = false

		this._connectThreeCSS()
		this.needsUpdate()

		return true
	}

	_unloadCSS(): boolean {
		if (!this._cssLoaded) return false
		this._cssLoaded = false

		for (const stop of this._cssStopFns) stop()
		this._cssStopFns.length = 0

		this.__disposeThreeCSS()
		this.needsUpdate()

		return true
	}

	_triggerLoadGL(): void {
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
	}

	_triggerUnloadGL(): void {
		if (!this._unloadGL()) return
		this.emit(Events.BEHAVIOR_GL_UNLOAD, this)
		defer(() => this.emit(Events.GL_UNLOAD, this))
	}

	_triggerLoadCSS(): void {
		if (!this._loadCSS()) return

		this.emit(Events.CSS_LOAD, this)
	}

	_triggerUnloadCSS(): void {
		if (!this._unloadCSS()) return
		this.emit(Events.CSS_UNLOAD, this)
	}

	/**
	 * Takes all the current component values (position, rotation, etc) and
	 * calculates a transformation DOMMatrix from them. See "W3C Geometry
	 * Interfaces" to learn about DOMMatrix.
	 *
	 * @method
	 * @private
	 * @memberOf Node
	 *
	 * TODO #66: make sure this is called after size calculations when we
	 * move _calcSize to a render task.
	 */
	_calculateMatrix(): void {
		const align = this.alignPoint
		const mountPoint = this.mountPoint
		const position = this.position
		const origin = this.origin

		const size = this.calculatedSize

		// THREE-COORDS-TO-DOM-COORDS
		// translate the "mount point" back to the top/left/back of the object
		// (in Three.js it is in the center of the object).
		threeJsPostAdjustment[0] = size.x / 2
		threeJsPostAdjustment[1] = size.y / 2
		threeJsPostAdjustment[2] = size.z / 2

		const parentSize = this._getParentSize()

		// THREE-COORDS-TO-DOM-COORDS
		// translate the "align" back to the top/left/back of the parent element.
		// We offset this in ElementOperations#applyTransform. The Y
		// value is inverted because we invert it below.
		threeJsPostAdjustment[0] += -parentSize.x / 2
		threeJsPostAdjustment[1] += -parentSize.y / 2
		threeJsPostAdjustment[2] += -parentSize.z / 2

		alignAdjustment[0] = parentSize.x * align.x
		alignAdjustment[1] = parentSize.y * align.y
		alignAdjustment[2] = parentSize.z * align.z

		mountPointAdjustment[0] = size.x * mountPoint.x
		mountPointAdjustment[1] = size.y * mountPoint.y
		mountPointAdjustment[2] = size.z * mountPoint.z

		appliedPosition[0] = position.x + alignAdjustment[0] - mountPointAdjustment[0]
		appliedPosition[1] = position.y + alignAdjustment[1] - mountPointAdjustment[1]
		appliedPosition[2] = position.z + alignAdjustment[2] - mountPointAdjustment[2]

		// NOTE We negate Y translation in several places below so that Y
		// goes downward like in DOM's CSS transforms.

		// TODO Make an option that configures whether Y goes up or down.

		this.three.position.set(
			appliedPosition[0] + threeJsPostAdjustment[0],
			// THREE-COORDS-TO-DOM-COORDS negate the Y value so that
			// Three.js' positive Y is downward like DOM.
			-(appliedPosition[1] + threeJsPostAdjustment[1]),
			appliedPosition[2] + threeJsPostAdjustment[2],
		)

		// TODO Besides that Transformable shouldn't know about Three.js
		// objects, it should also not know about Scene.
		const childOfScene = this.threeCSS.parent && this.threeCSS.parent.type === 'Scene'

		// FIXME we shouldn't need this conditional check. See the next XXX.
		if (childOfScene) {
			this.threeCSS.position.set(
				appliedPosition[0] + threeJsPostAdjustment[0],
				// THREE-COORDS-TO-DOM-COORDS negate the Y value so that
				// Three.js' positive Y is downward like DOM.
				-(appliedPosition[1] + threeJsPostAdjustment[1]),
				appliedPosition[2] + threeJsPostAdjustment[2],
			)
		} else {
			// XXX CSS objects that aren't direct child of a scene are
			// already centered on X and Y (not sure why, but maybe
			// CSS3DObjectNested has clues, which is based on
			// THREE.CSS3DObject)
			this.threeCSS.position.set(
				appliedPosition[0],
				-appliedPosition[1],
				appliedPosition[2] + threeJsPostAdjustment[2], // only apply Z offset
			)
		}

		if (origin.x !== 0.5 || origin.y !== 0.5 || origin.z !== 0.5) {
			// Here we multiply by size to convert from a ratio to a range
			// of units, then subtract half because Three.js origin is
			// centered around (0,0,0) meaning Three.js origin goes from
			// -0.5 to 0.5 instead of from 0 to 1.

			this.three.pivot.set(
				origin.x * size.x - size.x / 2,
				// THREE-COORDS-TO-DOM-COORDS negate the Y value so that
				// positive Y means down instead of up (because Three,js Y
				// values go up).
				-(origin.y * size.y - size.y / 2),
				origin.z * size.z - size.z / 2,
			)
			this.threeCSS.pivot.set(
				origin.x * size.x - size.x / 2,
				// THREE-COORDS-TO-DOM-COORDS negate the Y value so that
				// positive Y means down instead of up (because Three,js Y
				// values go up).
				-(origin.y * size.y - size.y / 2),
				origin.z * size.z - size.z / 2,
			)
		}
		// otherwise, use default Three.js origin of (0,0,0) which is
		// equivalent to our (0.5,0.5,0.5), by removing the pivot value.
		else {
			this.three.pivot.set(0, 0, 0)
			this.threeCSS.pivot.set(0, 0, 0)
		}

		this.three.updateMatrix()
		this.threeCSS.updateMatrix()
	}

	_updateRotation(): void {
		const {x, y, z} = this.rotation

		// Currently rotation is left-handed as far as values inputted into
		// the LUME APIs. This method converts them to Three's right-handed
		// system.

		// TODO Make an option to use left-handed or right-handed rotation,
		// where right-handed will match with Three.js transforms, while
		// left-handed matches with CSS transforms (but in the latter case
		// using Three.js APIs will not match the same paradigm because the
		// option changes only the LUME API).

		// TODO Make the rotation unit configurable (f.e. use degrees or
		// radians)

		// TODO Make the handedness configurable (f.e. left handed or right
		// handed rotation)

		// We don't negate Y rotation here, but we negate Y translation
		// in _calculateMatrix so that it has the same effect.
		this.three.rotation.set(-toRadians(x), toRadians(y), -toRadians(z))

		// @ts-ignore duck typing with use of isScene
		const childOfScene = this.composedSceneGraphParent?.isScene

		// TODO write a comment as to why we needed the childOfScne check to
		// alternate rotation directions here. It's been a while, I forgot
		// why. I should've left a comment when I wrote this!
		this.threeCSS.rotation.set(
			(childOfScene ? -1 : 1) * toRadians(x),
			toRadians(y),
			(childOfScene ? -1 : 1) * toRadians(z),
		)
	}

	_updateScale(): void {
		const {x, y, z} = this.scale
		this.three.scale.set(x, y, z)
		this.threeCSS.scale.set(x, y, z)
	}

	updateWorldMatrices(): void {
		this.three.updateMatrixWorld()
		this.threeCSS.updateMatrixWorld()
		this.emit('worldMatrixUpdate')
	}

	/**
	 * This is called by Motor on each update before the GL or CSS renderers
	 * will re-render. This does not fire repeatedly endlessly, it only fires
	 * (in the next animation frame) as a response to modifying any of a node's
	 * properties/attributes (modifying a property enqueues a render task which
	 * calls update).
	 */
	update(_timestamp: number, _deltaTime: number): void {
		this._updateRotation()
		this._updateScale()

		// TODO: only run this when necessary (f.e. not if only opacity
		// changed, only if position/align/mountPoint changed, etc)
		this._calculateMatrix()

		// TODO, pass the needed data into the elementOperations calls,
		// instead of relying on ElementOperations knowing about
		// non-HTMLElement features. See the TODOs in __applyStyle and
		// __applyOpacity there.
		this._elementOperations.applyProperties()
	}

	// This method is used by Motor._renderNodes().
	getNearestAncestorThatShouldBeRendered(): ImperativeBase | null {
		let composedParent = this.composedSceneGraphParent

		while (composedParent) {
			if (composedParent.__willBeRendered) return composedParent
			composedParent = composedParent.composedSceneGraphParent
		}

		return null
	}
}

window.addEventListener('error', event => {
	const error = event.error

	// sometimes it can be `null` (f.e. for ScriptErrors).
	if (!error) return

	if (/Illegal constructor/i.test(error.message)) {
		console.error(`
			One of the reasons the following error can happen is if a Custom
			Element is called with 'new' before being defined. Did you forget
			to call 'LUME.defineElements()'?  For other reasons, see:
			https://www.google.com/search?q=chrome%20illegal%20constructor
        `)
	}
})
