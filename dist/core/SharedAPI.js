var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
import { untrack } from 'solid-js';
import { signal } from 'classy-solid';
import { Object3D } from 'three/src/core/Object3D.js';
import { element, booleanAttribute, numberAttribute } from '@lume/element';
import { Transformable } from './Transformable.js';
import { ElementOperations } from './ElementOperations.js';
import { Motor } from './Motor.js';
import { CSS3DObjectNested } from '../renderers/CSS3DRendererNested.js';
import { disposeObject } from '../utils/three.js';
import { Settable } from '../utils/Settable.js';
import { toRadians } from './utils/index.js';
import { ChildTracker } from './ChildTracker.js';
import { InitialBehaviors } from '../behaviors/InitialBehaviors.js';
import { isDomEnvironment, isElement3D } from './utils/isThisOrThat.js';
import { triggerChildComposedCallback, triggerChildUncomposedCallback, } from './CompositionTracker.js';
const threeJsPostAdjustment = [0, 0, 0];
const alignAdjustment = [0, 0, 0];
const mountPointAdjustment = [0, 0, 0];
const appliedPosition = [0, 0, 0];
const elOps = new WeakMap();
const ourThreeObjects = new WeakSet();
const isManagedByUs = (obj) => ourThreeObjects.has(obj);
const opacity = new WeakMap();
// TODO @abstract jsdoc tag
/**
 * @abstract
 * @class SharedAPI - This is an abstract base class that provides common
 * properties and methods for the non-abstract [`Element3D`](./Element3D) and
 * [`Scene`](./Scene) custom element classes.
 *
 * This class is not intended for extension by end users. You'll want to extend
 * from [`Scene`](./Scene) or [`Element3D`](./Element3D) (or their
 * subclasses) instead of this class.
 *
 * For purposes of documentation it is still useful to know what properties and
 * methods subclasses inherit from here.
 *
 * @extends Settable
 * @extends Transformable
 */
let SharedAPI = (() => {
    let _classDecorators = [element({ autoDefine: false })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = InitialBehaviors(ChildTracker(Settable(Transformable)));
    let _instanceExtraInitializers = [];
    let _set_opacity_decorators;
    let _get_opacity_decorators;
    let _debug_decorators;
    let _debug_initializers = [];
    let _debug_extraInitializers = [];
    let _private_scene_decorators;
    let _private_scene_initializers = [];
    let _private_scene_extraInitializers = [];
    let _private_scene_descriptor;
    let _version_decorators;
    let _version_initializers = [];
    let _version_extraInitializers = [];
    var SharedAPI = class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _set_opacity_decorators = [numberAttribute];
            _get_opacity_decorators = [numberAttribute];
            _debug_decorators = [booleanAttribute];
            _private_scene_decorators = [signal];
            _version_decorators = [signal];
            __esDecorate(this, null, _set_opacity_decorators, { kind: "setter", name: "opacity", static: false, private: false, access: { has: obj => "opacity" in obj, set: (obj, value) => { obj.opacity = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _get_opacity_decorators, { kind: "getter", name: "opacity", static: false, private: false, access: { has: obj => "opacity" in obj, get: obj => obj.opacity }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, _private_scene_descriptor = { get: __setFunctionName(function () { return this.#scene_accessor_storage; }, "#scene", "get"), set: __setFunctionName(function (value) { this.#scene_accessor_storage = value; }, "#scene", "set") }, _private_scene_decorators, { kind: "accessor", name: "#scene", static: false, private: true, access: { has: obj => #scene in obj, get: obj => obj.#scene, set: (obj, value) => { obj.#scene = value; } }, metadata: _metadata }, _private_scene_initializers, _private_scene_extraInitializers);
            __esDecorate(null, null, _debug_decorators, { kind: "field", name: "debug", static: false, private: false, access: { has: obj => "debug" in obj, get: obj => obj.debug, set: (obj, value) => { obj.debug = value; } }, metadata: _metadata }, _debug_initializers, _debug_extraInitializers);
            __esDecorate(null, null, _version_decorators, { kind: "field", name: "version", static: false, private: false, access: { has: obj => "version" in obj, get: obj => obj.version, set: (obj, value) => { obj.version = value; } }, metadata: _metadata }, _version_initializers, _version_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            SharedAPI = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        /** @deprecated use `.defineElement()` instead */
        static define(name) {
            this.defineElement(name);
        }
        // TODO re-organize variables like isScene and isElement3D, so they come from a
        // proper place. f.e. they are currently also used in CompositionTracker
        // where they don't belong (see TODO there).
        /** @property {boolean} isScene - True if a subclass of this class is a Scene. */
        isScene = (__runInitializers(this, _instanceExtraInitializers), false);
        /**
         * @property {boolean} isElement3D - True if a subclass of this class is an `Element3D`.
         */
        isElement3D = false;
        /**
         * @property {string | number | null} opacity -
         *
         * *attribute*
         *
         * Default: `1`
         *
         * Set the object's opacity.
         *
         * The value should be a number from `0` to `1`. `0` is fully transparent, and `1` is fully opaque.
         */
        // TODO convert opacity to multiplicative down the tree for gl materials.
        set opacity(newValue) {
            if (!opacity.has(this))
                opacity.set(this, 1);
            this._setPropertySingle('opacity', v => opacity.set(this, v), newValue);
        }
        get opacity() {
            if (!opacity.has(this))
                opacity.set(this, 1);
            return opacity.get(this);
        }
        /**
         * @property {boolean} debug -
         *
         * `attribute`
         *
         * Default: `false`
         *
         * When `true`, show debug visuals for the object. Not all objects implement
         * debug visuals yet.
         */
        debug = __runInitializers(this, _debug_initializers, false
        /**
         * @deprecated
         * @property {boolean} glLoaded
         *
         * DEPRECATED Now always true. For logic depending on this in an effect (f.e. returning early when false), instead init things when an element is connected, and uninit when an element is disconnected.
         *
         * *readonly*
         */
        );
        /**
         * @deprecated
         * @property {boolean} glLoaded
         *
         * DEPRECATED Now always true. For logic depending on this in an effect (f.e. returning early when false), instead init things when an element is connected, and uninit when an element is disconnected.
         *
         * *readonly*
         */
        get glLoaded() {
            return true;
        }
        /**
         * @deprecated
         * @property {boolean} cssLoaded
         *
         * DEPRECATED Now always true. For logic depending on this in an effect (f.e. returning early when false), instead init things when an element is connected, and uninit when an element is disconnected.
         *
         * *readonly*
         */
        get cssLoaded() {
            return true;
        }
        #scene_accessor_storage = (__runInitializers(this, _debug_extraInitializers), __runInitializers(this, _private_scene_initializers, null
        /**
         * @property {THREE.Scene} scene -
         *
         * *signal*, *readonly*
         *
         * The `<lume-scene>` that the element is a child or grandchild of, `null`
         * if the element is not a descendant of a Scene, `null` if the child is a
         * descendant of a Scene that is not connected into the DOM, or `null` if
         * the element is a descendant of a connected Scene but the element is not
         * participating in the composed tree (i.e. the element is not distributed
         * to a `<slot>` element of a ShadowRoot of the element's parent).
         */
        ));
        // stores a ref to this element's root Scene when/if this element is
        // in a scene.
        get #scene() { return _private_scene_descriptor.get.call(this); }
        set #scene(value) { return _private_scene_descriptor.set.call(this, value); }
        /**
         * @property {THREE.Scene} scene -
         *
         * *signal*, *readonly*
         *
         * The `<lume-scene>` that the element is a child or grandchild of, `null`
         * if the element is not a descendant of a Scene, `null` if the child is a
         * descendant of a Scene that is not connected into the DOM, or `null` if
         * the element is a descendant of a connected Scene but the element is not
         * participating in the composed tree (i.e. the element is not distributed
         * to a `<slot>` element of a ShadowRoot of the element's parent).
         */
        get scene() {
            return this.#scene;
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
        #three = __runInitializers(this, _private_scene_extraInitializers);
        /**
         * @property {Object3D} three -
         *
         * *readonly*
         *
         * The WebGL rendering content of this element. Useful if you know Three.js
         * APIs. See
         * [`Object3D`](https://threejs.org/docs/index.html#api/en/core/Object3D).
         */
        get three() {
            if (!this.#three)
                this.#three = this.#makeThreeObject3d();
            return this.#three;
        }
        #makeThreeObject3d() {
            const o = this.makeThreeObject3d();
            // Helpful for debugging when looking in devtools.
            // @prod-prune
            o.name = `${this.tagName}${this.id ? '#' + this.id : ''} (webgl, ${o.type})`;
            ourThreeObjects.add(o);
            // we don't let Three update local matrices automatically, we do
            // it ourselves in _calculateMatrix and _calculateWorldMatricesInSubtree
            o.matrixAutoUpdate = false;
            return o;
        }
        #disposeThree() {
            if (!this.#three)
                return;
            disposeObject(this.#three);
            ourThreeObjects.delete(this.#three);
            this.#three = undefined;
        }
        /**
         * @method recreateThree - Replaces the current three object with a new
         * one, reconnecting it to the same parent and children. This can be useful
         * in scenarios where a property of a three object needs to be updated but the property
         * can only be updated via the constructor, requiring us to make a new object.
         */
        recreateThree() {
            const children = this.#three?.children;
            this.#disposeThree();
            // The three getter is used here, which makes a new instance
            this.#reconnectThree();
            // Three.js crashes on arrays of length 0.
            if (children && children.length)
                this.three.add(...children);
        }
        #threeCSS;
        /**
         * @property {Object3D} threeCSS -
         *
         * *readonly*
         *
         * The CSS rendering content of this element. Useful if you know Three.js
         * APIs. See
         * [`THREE.Object3D`](https://threejs.org/docs/index.html#api/en/core/Object3D).
         */
        get threeCSS() {
            if (!this.#threeCSS)
                this.#threeCSS = this.#makeThreeCSSObject();
            return this.#threeCSS;
        }
        #makeThreeCSSObject() {
            const o = this.makeThreeCSSObject();
            // @prod-prune
            o.name = `${this.tagName}${this.id ? '#' + this.id : ''} (css3d, ${o.type})`;
            ourThreeObjects.add(o);
            // we don't let Three update local matrices automatically, we do
            // it ourselves in _calculateMatrix and _calculateWorldMatricesInSubtree
            o.matrixAutoUpdate = false;
            return o;
        }
        #disposeThreeCSS() {
            if (!this.#threeCSS)
                return;
            disposeObject(this.#threeCSS);
            ourThreeObjects.delete(this.#threeCSS);
            this.#threeCSS = undefined;
        }
        /**
         * @method recreateThreeCSS - Replaces the current threeCSS object with a new
         * one, reconnecting it to the same parent and children. This can be useful
         * in scenarios where a property of a threeCSS object needs to be updated but the property
         * can only be updated via the constructor, requiring us to make a new object.
         */
        recreateThreeCSS() {
            const children = this.#threeCSS?.children;
            this.#disposeThreeCSS();
            // The threeCSS getter is used here, which makes a new instance
            this.#reconnectThreeCSS();
            // Three.js crashes on arrays of length 0.
            if (children && children.length)
                this.threeCSS.add(...children);
        }
        connectedCallback() {
            super.connectedCallback();
            this.createEffect(() => {
                this.scene;
                this.sizeMode.asDependency();
                this.size.asDependency();
                untrack(() => {
                    // TODO: Size calculation should happen in a render task
                    // just like _calculateMatrix, instead of on each property
                    // change, unless the calculatedSize prop is acessed by the
                    // user in which case it should trigger a calculation (sort
                    // of like DOM properties that cause re-layout). We should
                    // document to prefer not to force calculation, and instead
                    // observe the property changes (f.e. with createEffect()).
                    this._calcSize();
                    this.needsUpdate();
                });
            });
            this.createEffect(() => {
                // If the parent size changes,
                this.parentSize;
                untrack(() => {
                    const { x, y, z } = this.sizeMode;
                    if (
                    // then we only need to update if any size dimension is proportional,
                    x === 'proportional' ||
                        x === 'p' ||
                        y === 'proportional' ||
                        y === 'p' ||
                        z === 'proportional' ||
                        z === 'p') {
                        // TODO #66 defer _calcSize to an animation frame (via needsUpdate),
                        // unless explicitly requested by a user (f.e. they read a prop so
                        // the size must be calculated). https://github.com/lume/lume/issues/66
                        this._calcSize();
                    }
                });
                // update regardless if we calculated size, in order to update
                // matrices (align-point depends on parent size).
                this.needsUpdate();
            });
            this.createEffect(() => {
                this.position.asDependency();
                this.rotation.asDependency();
                this.scale.asDependency();
                this.origin.asDependency();
                this.alignPoint.asDependency();
                this.mountPoint.asDependency();
                this.opacity;
                this.needsUpdate();
            });
        }
        disconnectedCallback() {
            super.disconnectedCallback();
            this.stopEffects();
            // TODO Keep the .three object around (dispose it, but no need to delete
            // it and recreate it, it will be GC'd with the element if the element
            // is unref'd)
            this.#disposeThree();
            this.#disposeThreeCSS();
            this.#scene = null;
        }
        composedCallback(composedParent, compositionType) {
            super.composedCallback?.(composedParent, compositionType);
            if (this.isScene) {
                console.warn('Composing `<lume-scene>` elements directly into other `<lume-*>` elements is not currently supported. To nest a scene inside a scene, wrap it with a `<div>` inside of a `<lume-mixed-plane>`.');
            }
            this.composedSceneGraphParent.three.add(this.three);
            this.composedSceneGraphParent.threeCSS.add(this.threeCSS);
            this.#scene = this.composedSceneGraphParent.scene;
            if (this.#scene)
                this.#giveSceneToChildren();
        }
        uncomposedCallback(uncomposedParent, compositionType) {
            super.uncomposedCallback?.(uncomposedParent, compositionType);
            this.three.parent?.remove(this.three);
            this.threeCSS.parent?.remove(this.threeCSS);
            this.#scene = null;
            this.#giveSceneToChildren(); // remove from children
        }
        #giveSceneToChildren() {
            this.traverseSceneGraph(el => {
                if (el === this)
                    return;
                if (el.#scene === this.#scene)
                    return;
                el.#scene = this.#scene;
            });
        }
        /**
         * Called whenever a child element is composed to this element.
         * This is called with a `compositionType` argument that tells us how the element is
         * composed relative to the ["composed tree"](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM).
         *
         * @param  {"root" | "slot" | "actual"} compositionType - If the value is
         * `"root"`, then the child was composed as a child of a shadow root of the
         * current element. If the value is `"slot"`, then the child was composed (i.e. distributed, or assigned) to
         * the current element via a [`<slot>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/slot) element.
         * If the value is `"actual"`, then the child was composed to the current
         * element as a regular child (`childComposedCallback` with `"actual"` passed
         * in is essentially the same as [`ChildTracker`](./ChildTracker)'s [`childConnectedCallback`](./ChildTracker#childconnectedcallback)).
         */
        // TODO update MDN docs on "composed trees", https://github.com/mdn/content/pull/20703
        childComposedCallback(child, _compositionType) {
            if (!(child instanceof SharedAPI))
                return;
            this.needsUpdate(); // Maybe not needed but its a no-op if called extra times.
        }
        childUncomposedCallback(child, _compositionType) {
            if (!(child instanceof SharedAPI))
                return;
            // Update the parent because the child is gone, but the scene needs a
            // redraw, and we can't update the child because it is already gone.
            this.needsUpdate();
        }
        /** @abstract */
        traverseSceneGraph(_visitor, _waitForUpgrade = false) {
            throw 'Element3D and Scene implement this';
        }
        /**
         * Overrides [`TreeNode.parentLumeElement`](./TreeNode?id=parentLumeElement) to assert
         * that parents are `SharedAPI` (`Element3D` or `Scene`) instances.
         */
        // This override serves to change the type of `parentLumeElement` for
        // subclasses of SharedAPI.
        // Element3D instances (f.e. Mesh, Sphere, etc) and Scenes should always have parents
        // that are Element3Ds or Scenes (at least for now).
        // @prod-prune
        get parentLumeElement() {
            const parent = super.parentLumeElement;
            // @prod-prune
            if (parent && !(parent instanceof SharedAPI))
                throw new TypeError('Parent must be type SharedAPI.');
            return parent;
        }
        /**
         * @method needsUpdate - Schedules a rendering update for the element.
         * Usually you don't need to call this when using the outer APIs, as setting
         * attributes or properties will queue an update.
         *
         * But if you're doing something special to an Element3D or a Scene, f.e.
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
        needsUpdate() {
            Motor.needsUpdate(this);
        }
        get _elementOperations() {
            if (!elOps.has(this))
                elOps.set(this, new ElementOperations(this));
            return elOps.get(this);
        }
        // Overrides to filter out any non-Element3Ds (f.e. Scenes).
        get composedLumeChildren() {
            const result = [];
            for (const child of super.composedLumeChildren)
                if (isElement3D(child))
                    result.push(child);
            return result;
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
        makeThreeObject3d() {
            return new Object3D();
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
        makeThreeCSSObject() {
            // @prod-prune, this will be only allowed in a DOM environment with CSS
            // rendering. WebGL APIs will eventually work outside a DOM
            // environment.
            if (!(this instanceof HTMLElement))
                throw 'API available only in DOM environment.';
            return new CSS3DObjectNested(this);
        }
        #reconnectThree() {
            this.composedSceneGraphParent?.three.add(this.three);
            for (const child of this.composedLumeChildren) {
                this.three.add(child.three);
            }
            this.needsUpdate();
        }
        #reconnectThreeCSS() {
            this.composedSceneGraphParent?.threeCSS.add(this.threeCSS);
            for (const child of this.composedLumeChildren) {
                this.threeCSS.add(child.threeCSS);
            }
            this.needsUpdate();
        }
        get composedLumeParent() {
            const result = super.composedLumeParent;
            if (!(result instanceof SharedAPI))
                return null;
            return result;
        }
        get composedSceneGraphParent() {
            // read first, to track the dependency
            const composedLumeParent = this.composedLumeParent;
            // check if parentLumeElement is a Scene because Scenes always have shadow
            // roots as part of their implementation (users will not be adding
            // shadow roots to them), and we treat distribution into a Scene shadow
            // root different than with all other Element3Ds (users can add shadow roots
            // to those). Otherwise _distributedParent for a lume-element3d that is
            // child of a lume-scene will be a non-LUME element that is inside of
            // the lume-scene's ShadowRoot, and things will not work in that case
            // because the top-level Element3D elements will not be composed to
            // the Scene element itself. TODO: perhaps the Scene can make the
            // connection by observing the children in its ShadowRoot.
            if (this.parentLumeElement?.isScene)
                return this.parentLumeElement;
            return composedLumeParent;
        }
        /**
         * Takes all the current component values (position, rotation, etc) and
         * calculates a transformation matrix from them (currently a THREE.Matrix4,
         * but it used to be a DOMMatrix).
         *
         * TODO #66: make sure this is called after size calculations when we
         * move _calcSize to a render task.
         */
        _calculateMatrix() {
            const align = this.alignPoint;
            const mountPoint = this.mountPoint;
            const position = this.position;
            const origin = this.origin;
            const size = this.calculatedSize;
            // THREE-COORDS-TO-DOM-COORDS
            // translate the "mount point" back to the top/left/back of the object
            // (in Three.js it is in the center of the object).
            threeJsPostAdjustment[0] = size.x / 2;
            threeJsPostAdjustment[1] = size.y / 2;
            threeJsPostAdjustment[2] = size.z / 2;
            const parentSize = this.parentSize;
            // THREE-COORDS-TO-DOM-COORDS
            // translate the "align" back to the top/left/back of the parent element.
            // We offset this in ElementOperations#applyTransform. The Y
            // value is inverted because we invert it below.
            threeJsPostAdjustment[0] += -parentSize.x / 2;
            threeJsPostAdjustment[1] += -parentSize.y / 2;
            threeJsPostAdjustment[2] += -parentSize.z / 2;
            alignAdjustment[0] = parentSize.x * align.x;
            alignAdjustment[1] = parentSize.y * align.y;
            alignAdjustment[2] = parentSize.z * align.z;
            mountPointAdjustment[0] = size.x * mountPoint.x;
            mountPointAdjustment[1] = size.y * mountPoint.y;
            mountPointAdjustment[2] = size.z * mountPoint.z;
            appliedPosition[0] = position.x + alignAdjustment[0] - mountPointAdjustment[0];
            appliedPosition[1] = position.y + alignAdjustment[1] - mountPointAdjustment[1];
            appliedPosition[2] = position.z + alignAdjustment[2] - mountPointAdjustment[2];
            // NOTE We negate Y translation in several places below so that Y
            // goes downward like in DOM's CSS transforms.
            this.three.position.set(appliedPosition[0] + threeJsPostAdjustment[0], 
            // THREE-COORDS-TO-DOM-COORDS negate the Y value so that
            // Three.js' positive Y is downward like DOM.
            -(appliedPosition[1] + threeJsPostAdjustment[1]), appliedPosition[2] + threeJsPostAdjustment[2]);
            const childOfScene = this.composedSceneGraphParent?.isScene;
            // FIXME we shouldn't need this conditional check. See the next XXX.
            if (childOfScene) {
                this.threeCSS.position.set(appliedPosition[0] + threeJsPostAdjustment[0], 
                // THREE-COORDS-TO-DOM-COORDS negate the Y value so that
                // Three.js' positive Y is downward like DOM.
                -(appliedPosition[1] + threeJsPostAdjustment[1]), appliedPosition[2] + threeJsPostAdjustment[2]);
            }
            else {
                // XXX CSS objects that aren't direct child of a scene are
                // already centered on X and Y (not sure why, but maybe
                // CSS3DObjectNested has clues, which is based on
                // THREE.CSS3DObject)
                this.threeCSS.position.set(appliedPosition[0], -appliedPosition[1], appliedPosition[2] + threeJsPostAdjustment[2]);
            }
            if (origin.x !== 0.5 || origin.y !== 0.5 || origin.z !== 0.5) {
                // Here we multiply by size to convert from a ratio to a range
                // of units, then subtract half because Three.js origin is
                // centered around (0,0,0) meaning Three.js origin goes from
                // -0.5 to 0.5 instead of from 0 to 1.
                this.three.pivot.set(origin.x * size.x - size.x / 2, 
                // THREE-COORDS-TO-DOM-COORDS negate the Y value so that
                // positive Y means down instead of up (because Three,js Y
                // values go up).
                -(origin.y * size.y - size.y / 2), origin.z * size.z - size.z / 2);
                this.threeCSS.pivot.set(origin.x * size.x - size.x / 2, 
                // THREE-COORDS-TO-DOM-COORDS negate the Y value so that
                // positive Y means down instead of up (because Three,js Y
                // values go up).
                -(origin.y * size.y - size.y / 2), origin.z * size.z - size.z / 2);
            }
            // otherwise, use default Three.js origin of (0,0,0) which is
            // equivalent to our (0.5,0.5,0.5), by removing the pivot value.
            else {
                this.three.pivot.set(0, 0, 0);
                this.threeCSS.pivot.set(0, 0, 0);
            }
            this.three.updateMatrix();
            this.threeCSS.updateMatrix();
        }
        _updateRotation() {
            const { x, y, z } = this.rotation;
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
            this.three.rotation.set(-toRadians(x), toRadians(y), -toRadians(z));
            // @ts-ignore duck typing with use of isScene
            const childOfScene = this.composedSceneGraphParent?.isScene;
            // TODO write a comment as to why we needed the childOfScne check to
            // alternate rotation directions here. It's been a while, I forgot
            // why. I should've left a comment when I wrote this!
            this.threeCSS.rotation.set((childOfScene ? -1 : 1) * toRadians(x), toRadians(y), (childOfScene ? -1 : 1) * toRadians(z));
        }
        _updateScale() {
            const { x, y, z } = this.scale;
            this.three.scale.set(x, y, z);
            this.threeCSS.scale.set(x, y, z);
        }
        /**
         * @property {number} version -
         *
         * `signal`
         *
         * Default: `0`
         *
         * Incremented any time the element has been updated for rendering in an
         * animation frame. Any time this changes, it means the underlying Three.js
         * world matrices for this element and its sub tree have been calculated.
         */
        version = __runInitializers(this, _version_initializers, 0);
        updateWorldMatrices(traverse = true) {
            this.three.updateWorldMatrix(false, false);
            for (const child of this.three.children)
                if (!isManagedByUs(child))
                    child.updateMatrixWorld(true);
            this.threeCSS.updateWorldMatrix(false, false);
            for (const child of this.threeCSS.children)
                if (!isManagedByUs(child))
                    child.updateMatrixWorld(true);
            if (traverse)
                this.traverseSceneGraph(n => n !== this && n.updateWorldMatrices(false), false);
            untrack(() => this.version++);
        }
        /**
         * This is called by Motor on each update before the GL or CSS renderers
         * will re-render. This does not fire repeatedly endlessly, it only fires
         * (in the next animation frame) as a response to modifying any of an
         * Element3D's properties/attributes (modifying a property enqueues a render
         * task that calls update).
         */
        update(_timestamp, _deltaTime) {
            this._updateRotation();
            this._updateScale();
            // TODO: only run this when necessary (f.e. not if only opacity
            // changed, only if position/align/mountPoint changed, etc)
            this._calculateMatrix();
            this._elementOperations.applyProperties();
        }
        /** @deprecated Use `addEventListener()` instead. */
        on(eventName, callback, context) {
            super.on(eventName, callback, context);
        }
        /** @deprecated Use `dispatchEvent()` instead. */
        emit(eventName, data) {
            super.emit(eventName, data);
        }
        #this = (__runInitializers(this, _version_extraInitializers), this);
        // TODO this needs to be moved into CompositionTracker so that triggering
        // childComposedCallback is generic, and filtering of element types needs
        // to be done by subclasses.
        childConnectedCallback(child) {
            // This code handles two cases: the element has a ShadowRoot
            // ("composed children" are children of the ShadowRoot), or it has a
            // <slot> child ("composed children" are elements that may be
            // distributed to the <slot>).
            if (isElement3D(child)) {
                // We skip Scene here because we know it already has a
                // ShadowRoot that serves a different purpose than for Element3Ds. A
                // Scene child's three objects will always be connected to the
                // scene's three object regardless of its ShadowRoot.
                if (!this.isScene && this.exposedShadowRoot) {
                    child.isPossiblySlotted = true;
                    // We don't call childComposedCallback here because that
                    // will be called indirectly due to a slotchange event on a
                    // <slot> element if the added child will be distributed to
                    // a slot.
                }
                else {
                    // If there's no shadow root, call the childComposedCallback
                    // with connection type "actual". This is effectively a
                    // regular parent-child composition (no distribution, no
                    // children of a ShadowRoot).
                    this.#this[triggerChildComposedCallback](child, 'actual');
                }
            }
            else if (child instanceof HTMLSlotElement) {
                // COMPOSED TREE TRACKING: Detecting slots here is part of composed
                // tree tracking (detecting when a child is distributed to an element).
                child.addEventListener('slotchange', this.__onChildSlotChange);
                // XXX Do we need __handleSlottedChildren for initial slotted
                // elements? The answer seems to be "yes, sometimes". When slots are
                // appended, their slotchange events will fire. However, this
                // `childConnectedCallback` is fired later from when a child is
                // actually connected, in a MutationObserver task. Because of this,
                // an appended slot's slotchange event *may* have already fired,
                // and we will not have had the chance to add a slotchange event
                // handler yet, therefore we need to fire
                // __handleSlottedChildren here to handle that missed
                // opportunity.
                //
                // Also we need to defer() here because otherwise, this
                // childConnectedCallback will fire once for when a child is
                // connected into the light DOM and run the logic in the `if
                // (isElement3D(child))` branch *after* childConnectedCallback is fired
                // and executes this __handleSlottedChildren call for a shadow
                // DOM slot, and in that case the distribution will not be detected
                // (why is that?).  By deferring, this __handleSlottedChildren
                // call correctly happens *after* the above `if (isElement3D(child))`
                // branch and then things will work as expected. This is all due to
                // using MutationObserver, which fires event in a later task than
                // when child connections actually happen.
                //
                // TODO ^, Can we make WithChildren call this callback right when
                // children are added, synchronously?  If so then we could rely on
                // a slot's slotchange event upon it being connected without having
                // to call __handleSlottedChildren here (which means also not
                // having to use defer for anything).
                queueMicrotask(() => this.__handleSlottedChildren(child));
            }
        }
        childDisconnectedCallback(child) {
            if (isElement3D(child)) {
                if (!this.isScene && this.exposedShadowRoot) {
                    child.isPossiblySlotted = false;
                }
                else {
                    // If there's no shadow root, call the
                    // childUncomposedCallback with connection type "actual".
                    // This is effectively similar to childDisconnectedCallback.
                    this.#this[triggerChildUncomposedCallback](child, 'actual');
                }
            }
            else if (child instanceof HTMLSlotElement) {
                // COMPOSED TREE TRACKING:
                child.removeEventListener('slotchange', this.__onChildSlotChange, { capture: true });
                this.__handleSlottedChildren(child);
                this.__previousSlotAssignedNodes.delete(child);
            }
        }
        // TODO: make setAttribute accept non-string values.
        setAttribute(attr, value) {
            super.setAttribute(attr, value);
        }
        // FIXME This object/array spreading and cloning is sloooooooow, and becomes
        // apparent the more ShadowRoots a tree has.
        get _composedChildren() {
            if (!this.isScene && this.exposedShadowRoot) {
                // FIXME why is TypeScript requiring a cast here when I've clearly filtered the elements for the correct type?
                return [
                    ...this._distributedShadowRootChildren.filter(n => n instanceof SharedAPI),
                    ...this._shadowRootChildren.filter(n => n instanceof SharedAPI),
                ];
            }
            else {
                // FIXME why is TypeScript requiring a cast here when I've clearly filtered the elements for the correct type?
                return [
                    // TODO perhaps use slot.assignedElements instead?
                    ...[...(this.slottedChildren || [])].filter(n => n instanceof SharedAPI),
                    // We only care about other elements of the same type.
                    ...Array.from(this.children).filter((n) => n instanceof SharedAPI),
                ];
            }
        }
        static css = /*css*/ `
		:host {
			/*
			 * All items of the scene graph are hidden until they are mounted in
			 * a scene (this changes to display:block). This gets toggled
			 * between "none" and "block" by SharedAPI depending on if CSS
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

			/*
			 * Defaults to [0.5,0.5,0.5] (the Z axis doesn't apply for DOM
			 * elements, but does for 3D objects in WebGL that have any size
			 * along Z.)
			 */
			transform-origin: 50% 50% 0; /* default */

			transform-style: preserve-3d;

			/*
			 * Force anti-aliasing of 3D element edges using an invisible shadow.
			 * https://stackoverflow.com/questions/6492027
			 * TODO allow to be configured with an antialiased attribute or similar.
			 */
			/*box-shadow: 0 0 1px rgba(255, 255, 255, 0); currently is very very slow, https://crbug.com/1405629*/
		}
	`;
        static {
            __runInitializers(_classThis, _classExtraInitializers);
        }
    };
    return SharedAPI = _classThis;
})();
export { SharedAPI };
if (isDomEnvironment()) {
    globalThis.addEventListener('error', event => {
        const error = event.error;
        // sometimes it can be `null` (f.e. for ScriptErrors).
        if (!error)
            return;
        if (/Illegal constructor/i.test(error.message)) {
            console.error(`
				One of the reasons the following error can happen is if a Custom
				Element is called with 'new' before being defined. Did you set
				window.$lume.autoDefineElements to false and then forget to call
				'LUME.defineElements()' or to call '.defineElement()' on
				individual Lume classes?  For other reasons, see:
				https://www.google.com/search?q=chrome%20illegal%20constructor
			`);
        }
    });
}
//# sourceMappingURL=SharedAPI.js.map