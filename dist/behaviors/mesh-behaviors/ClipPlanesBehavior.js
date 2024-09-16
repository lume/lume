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
import { createEffect, onCleanup } from 'solid-js';
// import {stringAttribute, booleanAttribute} from '../attribute.js'
import { stringAttribute, booleanAttribute } from '@lume/element';
import { behavior } from '../Behavior.js';
import { receiver } from '../PropReceiver.js';
import { ClipPlane } from '../../core/ClipPlane.js';
import { MeshBehavior } from './MeshBehavior.js';
let refCount = 0;
/**
 * @class ClipPlanesBehavior
 *
 * When applied to an element with GL content, allows specifying one or more
 * [`<lume-clip-plane>`](../../core/ClipPlane) elements to clip the content with.
 *
 * This class extends from `MeshBehavior`, enforcing that the behavior can be used
 * only on elements that have a geometry and material.
 *
 * <live-code id="example"></live-code>
 * <script>
 *   example.content = clipPlaneExample
 * </script>
 *
 * @extends MeshBehavior
 */
let ClipPlanesBehavior = (() => {
    let _classDecorators = [behavior];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = MeshBehavior;
    let _instanceExtraInitializers = [];
    let _clipIntersection_decorators;
    let _clipIntersection_initializers = [];
    let _clipIntersection_extraInitializers = [];
    let _clipShadows_decorators;
    let _clipShadows_initializers = [];
    let _clipShadows_extraInitializers = [];
    let _get_clipPlanes_decorators;
    let _flipClip_decorators;
    let _flipClip_initializers = [];
    let _flipClip_extraInitializers = [];
    let _clipDisabled_decorators;
    let _clipDisabled_initializers = [];
    let _clipDisabled_extraInitializers = [];
    var ClipPlanesBehavior = class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _clipIntersection_decorators = [booleanAttribute, receiver];
            _clipShadows_decorators = [booleanAttribute, receiver];
            _get_clipPlanes_decorators = [stringAttribute, receiver];
            _flipClip_decorators = [booleanAttribute, receiver];
            _clipDisabled_decorators = [booleanAttribute, receiver];
            __esDecorate(this, null, _get_clipPlanes_decorators, { kind: "getter", name: "clipPlanes", static: false, private: false, access: { has: obj => "clipPlanes" in obj, get: obj => obj.clipPlanes }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, null, _clipIntersection_decorators, { kind: "field", name: "clipIntersection", static: false, private: false, access: { has: obj => "clipIntersection" in obj, get: obj => obj.clipIntersection, set: (obj, value) => { obj.clipIntersection = value; } }, metadata: _metadata }, _clipIntersection_initializers, _clipIntersection_extraInitializers);
            __esDecorate(null, null, _clipShadows_decorators, { kind: "field", name: "clipShadows", static: false, private: false, access: { has: obj => "clipShadows" in obj, get: obj => obj.clipShadows, set: (obj, value) => { obj.clipShadows = value; } }, metadata: _metadata }, _clipShadows_initializers, _clipShadows_extraInitializers);
            __esDecorate(null, null, _flipClip_decorators, { kind: "field", name: "flipClip", static: false, private: false, access: { has: obj => "flipClip" in obj, get: obj => obj.flipClip, set: (obj, value) => { obj.flipClip = value; } }, metadata: _metadata }, _flipClip_initializers, _flipClip_extraInitializers);
            __esDecorate(null, null, _clipDisabled_decorators, { kind: "field", name: "clipDisabled", static: false, private: false, access: { has: obj => "clipDisabled" in obj, get: obj => obj.clipDisabled, set: (obj, value) => { obj.clipDisabled = value; } }, metadata: _metadata }, _clipDisabled_initializers, _clipDisabled_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ClipPlanesBehavior = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        /**
         * @property {boolean} clipIntersection
         *
         * `attribute`
         *
         * Default: 'false'
         *
         * Changes the behavior of clipping planes so that only their intersection
         * is clipped, rather than their union.
         */
        clipIntersection = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _clipIntersection_initializers, false
        /**
         * @property {boolean} clipShadows
         *
         * `attribute`
         *
         * Default: `false`
         *
         * Defines whether to clip shadows
         * according to the clipping planes specified on this material. Default is
         * false.
         */
        ));
        /**
         * @property {boolean} clipShadows
         *
         * `attribute`
         *
         * Default: `false`
         *
         * Defines whether to clip shadows
         * according to the clipping planes specified on this material. Default is
         * false.
         */
        clipShadows = (__runInitializers(this, _clipIntersection_extraInitializers), __runInitializers(this, _clipShadows_initializers, true
        // TODO reactive array?
        ));
        // TODO reactive array?
        #clipPlanes = (__runInitializers(this, _clipShadows_extraInitializers), []);
        #rawClipPlanes = [];
        /**
         * @property {string | Array<ClipPlane | string | null>} clipPlanes
         *
         * *attribute*
         *
         * Default: `[]`
         *
         * The `clip-planes` attribute accepts one or more selectors, comma
         * separated, that define which [`<lume-clip-plane>`](../../core/ClipPlane)
         * elements are to be used as clip planes. If a selector matches an element
         * that is not a `<lume-clip-plane>`, it is ignored. If a selector matches
         * more than one element, all of them that are clip planes are used.
         *
         * ```html
         * <lume-box has="clip-planes" clip-planes=".foo, .bar, #baz"></lume-box>
         * ```
         *
         * The property can also be set with a string (comma separated selectors),
         * or a mixed array of strings (selectors) or `<lume-clip-plane>` element
         * instances.
         *
         * ```js
         * el.clipPlanes = ".some-plane"
         * // or
         * const plane = document.querySelector('.some-clip-plane')
         * el.clipPlanes = [plane, "#someOtherPlane"]
         * ```
         *
         * The property getter returns the currently applicable collection of
         * `<lume-clip-plane>` instances, not the original string or array of values
         * passed into the attribute or setter. Applicable planes are those that are
         * connected into the document, and that participate in rendering (composed,
         * either in the top level document, in a ShadowRoot, or distributed to a
         * slot in a ShadowRoot).
         */
        // TODO #279, move setter logic into an effect like we did with ProjectedMaterialBehavior.
        get clipPlanes() {
            return this.#clipPlanes;
        }
        set clipPlanes(value) {
            this.#rawClipPlanes = value;
            let array = [];
            if (typeof value === 'string') {
                array = [value.trim()];
            }
            else if (Array.isArray(value)) {
                array = value;
            }
            else {
                throw new TypeError('Invalid value for clipPlanes');
            }
            this.#clipPlanes = [];
            for (const v of array) {
                if (typeof v !== 'string') {
                    // TODO #279: This setter is non-reactive to v.scene, so it will
                    // not update if the element becomes composed into a Lume scene.
                    if (v instanceof ClipPlane && v.scene)
                        this.#clipPlanes.push(v);
                    continue;
                }
                else if (!v) {
                    // skip empty strings, they cause an error with querySelectorAll
                    continue;
                }
                let root = this.element.getRootNode();
                // TODO Should we not search up the composed tree, and stay only
                // in the current ShadowRoot?
                while (root) {
                    const els = root.querySelectorAll(v);
                    for (let i = 0, l = els.length; i < l; i += 1) {
                        const el = els.item(i);
                        if (!el)
                            continue;
                        // Find only planes participating in rendering (i.e. in the
                        // composed tree, noting that .scene is null when not
                        // composed)
                        // TODO #279: This setter is non-reactive to el.scene, so it will
                        // not update if the element becomes composed into a Lume scene.
                        if (el instanceof ClipPlane && el.scene)
                            this.#clipPlanes.push(el);
                        // TODO check the target is in the same scene
                        // TODO We aren't observing el.scene, so if the element
                        // becomes a particpant in the scene later nothing will
                        // happen.
                        // TODO If an element was not yet upgraded, it will not
                        // be found here. We need to wait for upgrade.
                        // TODO We need to also react to added/removed elements.
                    }
                    root = root instanceof ShadowRoot ? root.host.getRootNode() : null;
                }
            }
        }
        /**
         * @property {boolean} flipClip
         *
         * *attribute*
         *
         * Default: `false`
         *
         * By default, the side of a plane that is clipped is in its positive Z
         * direction. Setting this to `true` will reverse clipping to the other
         * side.
         */
        flipClip = __runInitializers(this, _flipClip_initializers, false
        /**
         * @property {boolean} clipDisabled
         *
         * *attribute*
         *
         * Default: `false`
         *
         * If `true`, clipping is not applied.
         */
        );
        /**
         * @property {boolean} clipDisabled
         *
         * *attribute*
         *
         * Default: `false`
         *
         * If `true`, clipping is not applied.
         */
        clipDisabled = (__runInitializers(this, _flipClip_extraInitializers), __runInitializers(this, _clipDisabled_initializers, false
        /**
         * `reactive`
         */
        ));
        /**
         * `reactive`
         */
        get material() {
            const mat = this.element.behaviors.find(name => name.endsWith('-material'));
            return mat?.meshComponent ?? null;
        }
        #observer = (__runInitializers(this, _clipDisabled_extraInitializers), null);
        connectedCallback() {
            super.connectedCallback();
            let lastScene = null;
            this.createEffect(() => {
                if (!this.element.scene)
                    return;
                lastScene = this.element.scene;
                // Trigger the setter again in case it returned early if there was
                // no scene. Depending on code load order, el.scene inside of set
                // clipPlanes might be null despite that it is a valid Lume element.
                // TODO #279: Instead of this hack, move away
                // from getters/setters, make all logic fully reactive to avoid
                // worrying about code execution order. https://github.com/lume/lume/issues/279
                this.clipPlanes = this.#rawClipPlanes;
                if (!refCount)
                    this.element.scene.__localClipping = true;
                refCount++;
                // TODO we need to observe all the way up the composed tree, or we
                // should make the querying scoped only to the nearest root, for
                // consistency. This covers most cases, for now.
                this.#observer = new MutationObserver(() => {
                    // TODO this could be more efficient if we check the added nodes directly, but for now we re-run the query logic.
                    // This triggers the setter logic.
                    this.clipPlanes = this.#rawClipPlanes;
                });
                this.#observer.observe(this.element.getRootNode(), { childList: true, subtree: true });
                createEffect(() => {
                    const { clipPlanes, clipIntersection, clipShadows, flipClip } = this;
                    const mat = this.material;
                    if (!mat)
                        return;
                    this.element.needsUpdate();
                    if (!clipPlanes.length || this.clipDisabled) {
                        mat.clippingPlanes = null;
                        // FIXME upstream: don't forget this or Three.js has a bug that
                        // still attempts to perform clipping even if clippingPlanes is
                        // null. https://github.com/munrocket/three.js/pull/5
                        mat.clipShadows = false;
                        return;
                    }
                    if (!mat.clippingPlanes)
                        mat.clippingPlanes = [];
                    mat.clippingPlanes.length = 0;
                    mat.clipIntersection = clipIntersection;
                    mat.clipShadows = clipShadows;
                    for (const plane of clipPlanes) {
                        mat.clippingPlanes.push(flipClip ? plane.__inverseClip : plane.__clip);
                    }
                });
                onCleanup(() => {
                    this.#observer?.disconnect();
                    this.#observer = null;
                    refCount--;
                    if (!refCount)
                        lastScene.__localClipping = false;
                    lastScene = null;
                });
            });
        }
    };
    return ClipPlanesBehavior = _classThis;
})();
export { ClipPlanesBehavior };
if (globalThis.window?.document && !elementBehaviors.has('clip-planes'))
    elementBehaviors.define('clip-planes', ClipPlanesBehavior);
//# sourceMappingURL=ClipPlanesBehavior.js.map