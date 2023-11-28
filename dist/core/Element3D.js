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
import { booleanAttribute, element } from '@lume/element';
import { SharedAPI } from './SharedAPI.js';
import { autoDefineElements } from '../LumeConfig.js';
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
 * <live-code id="liveExample"></live-code>
 * <script>
 *   liveExample.code = miniGalaxyDemo()
 * </script>
 *
 * @extends SharedAPI
 */
export { Element3D };
let Element3D = (() => {
    let _classDecorators = [element('lume-element3d', autoDefineElements)];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = SharedAPI;
    let _instanceExtraInitializers = [];
    let _visible_decorators;
    let _visible_initializers = [];
    var Element3D = class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _visible_decorators = [booleanAttribute];
            __esDecorate(null, null, _visible_decorators, { kind: "field", name: "visible", static: false, private: false, access: { has: obj => "visible" in obj, get: obj => obj.visible, set: (obj, value) => { obj.visible = value; } }, metadata: _metadata }, _visible_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            Element3D = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        hasShadow = (__runInitializers(this, _instanceExtraInitializers), false);
        /**
         * @property {true} isElement3D -
         *
         * *readonly*
         *
         * Always `true` for things that are or inherit from `Element3D`.
         */
        isElement3D = true;
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
        visible = __runInitializers(this, _visible_initializers, true
        /**
         * *reactive*
         */
        );
        /**
         * *reactive*
         */
        get parentSize() {
            const composedLumeParent = this.composedLumeParent;
            if (this.scene && this.scene === this.parentElement)
                return this.scene.calculatedSize;
            return composedLumeParent?.calculatedSize ?? { x: 0, y: 0, z: 0 };
        }
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
        // TODO @example jsdoc tag
        constructor() {
            super();
            // The `parent` property can already be set if this instance is
            // already in the DOM and wwhile being upgraded into a custom
            // element.
            // TODO Remove this after we make _calcSize lazy and deferred to a
            // render task.
            if (this.composedLumeParent) {
                this._calcSize();
                // No harm deferring, plus we need to because this may end up
                // calling a super method of a super class that relies on a private
                // field that is not initialized yet, causing an error. Welcome to
                // TC39's vision of inheritance for JavaScript.
                queueMicrotask(() => this.needsUpdate());
            }
        }
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
        traverseSceneGraph(visitor, waitForUpgrade = false) {
            visitor(this);
            if (!waitForUpgrade) {
                for (const child of this.composedLumeChildren)
                    child.traverseSceneGraph(visitor, waitForUpgrade);
                return;
            }
            // if waitForUpgrade is true, we make a promise chain so that
            // traversal order is still the same as when waitForUpgrade is false.
            let promise = Promise.resolve();
            for (const child of this.composedLumeChildren) {
                const isUpgraded = child.matches(':defined');
                if (isUpgraded) {
                    promise = promise.then(() => child.traverseSceneGraph(visitor, waitForUpgrade));
                }
                else {
                    promise = promise
                        .then(() => customElements.whenDefined(child.tagName.toLowerCase()))
                        .then(() => child.traverseSceneGraph(visitor, waitForUpgrade));
                }
            }
            return promise;
        }
        _loadCSS() {
            if (!super._loadCSS())
                return false;
            this.createCSSEffect(() => {
                this._elementOperations.shouldRender = this.visible;
                this.needsUpdate();
            });
            return true;
        }
        _loadGL() {
            if (!super._loadGL())
                return false;
            this.createGLEffect(() => {
                this.three.visible = this.visible;
                this.needsUpdate();
            });
            return true;
        }
    };
    return Element3D = _classThis;
})();
// Put initial value on the prototype to make it available during construction
// in a super() call.
// @ts-expect-error readonly
Element3D.prototype.isElement3D = true;
//# sourceMappingURL=Element3D.js.map