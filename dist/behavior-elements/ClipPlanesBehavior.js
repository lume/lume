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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
import { createEffect, onCleanup } from 'solid-js';
import { stringAttribute, booleanAttribute, element } from '@lume/element';
import { ClipPlane } from '../core/ClipPlane.js';
import { MeshBehavior } from './MeshBehavior.js';
import { autoDefineElements } from '../LumeConfig.js';
let refCount = 0;
/**
 * @class ClipPlanesBehavior
 *
 * Element: `clip-planes`
 *
 * When applied to an element with GL content, allows specifying one or more
 * [`<lume-clip-plane>`](../../core/ClipPlane) elements to clip the content with.
 *
 * This class extends from `MeshBehavior`, enforcing that the behavior can be used
 * only on elements that have a geometry and material.
 *
 * @extends MeshBehavior
 * @element clip-planes
 */
let ClipPlanesBehavior = (() => {
    let _classDecorators = [element('clip-planes', autoDefineElements)];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = MeshBehavior;
    let _clipIntersection_decorators;
    let _clipIntersection_initializers = [];
    let _clipIntersection_extraInitializers = [];
    let _clipShadows_decorators;
    let _clipShadows_initializers = [];
    let _clipShadows_extraInitializers = [];
    let _flipClip_decorators;
    let _flipClip_initializers = [];
    let _flipClip_extraInitializers = [];
    let _clipDisabled_decorators;
    let _clipDisabled_initializers = [];
    let _clipDisabled_extraInitializers = [];
    let _clipPlanes_decorators;
    let _clipPlanes_initializers = [];
    let _clipPlanes_extraInitializers = [];
    var ClipPlanesBehavior = class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _clipIntersection_decorators = [booleanAttribute];
            _clipShadows_decorators = [booleanAttribute];
            _flipClip_decorators = [booleanAttribute];
            _clipDisabled_decorators = [booleanAttribute];
            _clipPlanes_decorators = [stringAttribute];
            __esDecorate(null, null, _clipIntersection_decorators, { kind: "field", name: "clipIntersection", static: false, private: false, access: { has: obj => "clipIntersection" in obj, get: obj => obj.clipIntersection, set: (obj, value) => { obj.clipIntersection = value; } }, metadata: _metadata }, _clipIntersection_initializers, _clipIntersection_extraInitializers);
            __esDecorate(null, null, _clipShadows_decorators, { kind: "field", name: "clipShadows", static: false, private: false, access: { has: obj => "clipShadows" in obj, get: obj => obj.clipShadows, set: (obj, value) => { obj.clipShadows = value; } }, metadata: _metadata }, _clipShadows_initializers, _clipShadows_extraInitializers);
            __esDecorate(null, null, _flipClip_decorators, { kind: "field", name: "flipClip", static: false, private: false, access: { has: obj => "flipClip" in obj, get: obj => obj.flipClip, set: (obj, value) => { obj.flipClip = value; } }, metadata: _metadata }, _flipClip_initializers, _flipClip_extraInitializers);
            __esDecorate(null, null, _clipDisabled_decorators, { kind: "field", name: "clipDisabled", static: false, private: false, access: { has: obj => "clipDisabled" in obj, get: obj => obj.clipDisabled, set: (obj, value) => { obj.clipDisabled = value; } }, metadata: _metadata }, _clipDisabled_initializers, _clipDisabled_extraInitializers);
            __esDecorate(null, null, _clipPlanes_decorators, { kind: "field", name: "clipPlanes", static: false, private: false, access: { has: obj => "clipPlanes" in obj, get: obj => obj.clipPlanes, set: (obj, value) => { obj.clipPlanes = value; } }, metadata: _metadata }, _clipPlanes_initializers, _clipPlanes_extraInitializers);
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
        clipIntersection = __runInitializers(this, _clipIntersection_initializers, false
        /**
         * @property {boolean} clipShadows
         *
         * `attribute`
         *
         * Default: 'true'
         *
         * Defines whether clipping affects shadows casted by the object.
         */
        );
        /**
         * @property {boolean} clipShadows
         *
         * `attribute`
         *
         * Default: 'true'
         *
         * Defines whether clipping affects shadows casted by the object.
         */
        clipShadows = (__runInitializers(this, _clipIntersection_extraInitializers), __runInitializers(this, _clipShadows_initializers, true
        /**
         * @property {boolean} flipClip
         *
         * `attribute`
         *
         * Default: 'false'
         *
         * Defines whether to flip the clipped away area. When set to true, the
         * clipped away area is kept and the non-clipped area is removed.
         */
        ));
        /**
         * @property {boolean} flipClip
         *
         * `attribute`
         *
         * Default: 'false'
         *
         * Defines whether to flip the clipped away area. When set to true, the
         * clipped away area is kept and the non-clipped area is removed.
         */
        flipClip = (__runInitializers(this, _clipShadows_extraInitializers), __runInitializers(this, _flipClip_initializers, false
        /**
         * @property {boolean} clipDisabled
         *
         * `attribute`
         *
         * Default: 'false'
         *
         * When `true`, disables clipping for this object.
         */
        ));
        /**
         * @property {boolean} clipDisabled
         *
         * `attribute`
         *
         * Default: 'false'
         *
         * When `true`, disables clipping for this object.
         */
        clipDisabled = (__runInitializers(this, _flipClip_extraInitializers), __runInitializers(this, _clipDisabled_initializers, false
        /**
         * @property {string} clipPlanes
         *
         * `attribute`
         *
         * Default: `""`
         *
         * A space-separated list of CSS-selector values used to select
         * ClipPlane elements to clip the object with.
         */
        ));
        /**
         * @property {string} clipPlanes
         *
         * `attribute`
         *
         * Default: `""`
         *
         * A space-separated list of CSS-selector values used to select
         * ClipPlane elements to clip the object with.
         */
        clipPlanes = (__runInitializers(this, _clipDisabled_extraInitializers), __runInitializers(this, _clipPlanes_initializers, ''));
        connectedCallback() {
            super.connectedCallback();
            this.createEffect(() => {
                // TODO: Implement clipping plane logic
                // For now this is just a placeholder to demonstrate the structure
                this.parentElement?.needsUpdate();
            });
        }
        constructor() {
            super(...arguments);
            __runInitializers(this, _clipPlanes_extraInitializers);
        }
    };
    return ClipPlanesBehavior = _classThis;
})();
export { ClipPlanesBehavior };
//# sourceMappingURL=ClipPlanesBehavior.js.map