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
// import {Show} from 'solid-js'
import html from 'solid-js/html';
import { element } from '@lume/element';
import { Element3D } from '../core/Element3D.js';
import { effect, memo } from 'classy-solid';
// Import these lazily just in case the user is importing this class
// directly. We can't do it at the top level because it creates a
// circular dependency error during module execution.
import('../behavior-elements/mesh-behaviors/geometries/BoxGeometry.js');
import('../behavior-elements/mesh-behaviors/materials/PhysicalMaterial.js');
// These imported async to also avoid a circular import error with regular import.
const Classes = Promise.all([
    import('../behavior-elements/mesh-behaviors/geometries/GeometryBehaviorEl.js'),
    import('../behavior-elements/mesh-behaviors/materials/MaterialBehaviorEl.js'),
]).then(([{ GeometryBehaviorEl }, { MaterialBehaviorEl }]) => ({ GeometryBehaviorEl, MaterialBehaviorEl }));
/**
 * @abstract
 * @class MeshLike -
 *
 * `abstract`
 *
 * An abstract base class for elements that render a shape (a geometry) with a
 * style (a material) — namely `Mesh`, `Points`, and `Line` elements. It renders
 * default geometry and material behavior child elements into named slots,
 * unless subclasses override the defaults via `_defaultGeometry` and
 * `_defaultMaterial`, or unless the user provides their own child behavior
 * elements.
 *
 * The default geometry is [`<lume-box-geometry>`](../behavior-elements/mesh-behaviors/geometries/BoxGeometry)
 * and the default material is [`<lume-physical-material>`](../behavior-elements/mesh-behaviors/materials/PhysicalMaterial).
 *
 * @extends Element3D
 */
let MeshLike = (() => {
    let _classDecorators = [element({ autoDefine: false })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = Element3D;
    let _instanceExtraInitializers = [];
    let _get_hasLegacyGeometry_decorators;
    let _get_hasLegacyMaterial_decorators;
    let ___hasEffect_decorators;
    var MeshLike = class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _get_hasLegacyGeometry_decorators = [memo];
            _get_hasLegacyMaterial_decorators = [memo];
            ___hasEffect_decorators = [effect];
            __esDecorate(this, null, _get_hasLegacyGeometry_decorators, { kind: "getter", name: "hasLegacyGeometry", static: false, private: false, access: { has: obj => "hasLegacyGeometry" in obj, get: obj => obj.hasLegacyGeometry }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _get_hasLegacyMaterial_decorators, { kind: "getter", name: "hasLegacyMaterial", static: false, private: false, access: { has: obj => "hasLegacyMaterial" in obj, get: obj => obj.hasLegacyMaterial }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, ___hasEffect_decorators, { kind: "method", name: "__hasEffect", static: false, private: false, access: { has: obj => "__hasEffect" in obj, get: obj => obj.__hasEffect }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            MeshLike = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        /** @protected */
        _defaultGeometry = (__runInitializers(this, _instanceExtraInitializers), () => html `<lume-box-geometry></lume-box-geometry>`);
        /** @protected */
        _defaultMaterial = () => html `<lume-physical-material></lume-physical-material>`;
        get hasLegacyGeometry() {
            return this.has.split(/\s+/).some(v => v.endsWith('-geometry'));
        }
        get hasLegacyMaterial() {
            return this.has.split(/\s+/).some(v => v.endsWith('-material'));
        }
        hasShadow = true;
        shadowOptions = { mode: 'open', slotAssignment: 'manual' };
        childConnectedCallback() {
            this.#queueSlotAssignment();
        }
        childDisconnectedCallback() {
            this.#queueSlotAssignment();
        }
        connectedCallback() {
            super.connectedCallback();
            this.#queueSlotAssignment();
        }
        __hasEffect() {
            this.hasLegacyGeometry;
            this.hasLegacyMaterial;
            this.#queueSlotAssignment();
        }
        template = () => html `
		<slot name="geometry" ref=${(el) => (this.#geometrySlot = el)}>
			${() => !this.hasLegacyGeometry && this._defaultGeometry()}
		</slot>

		<slot name="material" ref=${(el) => (this.#materialSlot = el)}>
			${() => !this.hasLegacyMaterial && this._defaultMaterial()}
		</slot>

		<slot ref=${(el) => (this.#defaultSlot = el)}></slot>
	`;
        #geometrySlot = null;
        #materialSlot = null;
        #defaultSlot = null;
        #slotAssignmentQueued = false;
        /**
         * Queue slot assignment to the next microtask.
         * Not only is it important to queue slot assignment so that multiple effect
         * or child connected callback runs don't trigger assignment logic too many
         * times in the same tick, but this also ensures that slot fallback content
         * is in place before we run assignment (otherwise fallback content in the
         * template could be added *after* assignment and thus not get assigned in
         * some browsers).
         */
        #queueSlotAssignment() {
            if (!this.#slotAssignmentQueued) {
                this.#slotAssignmentQueued = true;
                Classes.then(this.#updateSlotAssignment);
            }
        }
        /**
         * We use manual slot assignment so that we don't have to explicitly mark
         * all geometry and material behavior elements with slot attributes. Any
         * elements that are geometry or material behavior elements get
         * automatically slotted to respective slots to replace default geometry or
         * material behaviors, while all other nodes get assigned to the default
         * slot.
         */
        #updateSlotAssignment = ({ GeometryBehaviorEl, MaterialBehaviorEl }) => {
            this.#slotAssignmentQueued = false;
            if (!this.isConnected)
                return;
            let geom;
            let mat;
            const rest = [];
            for (const child of this.childNodes) {
                if (child instanceof GeometryBehaviorEl)
                    geom = child;
                else if (child instanceof MaterialBehaviorEl)
                    mat = child;
                else if (child.nodeType === Node.ELEMENT_NODE || child.nodeType === Node.TEXT_NODE)
                    rest.push(child);
            }
            if (!this.hasLegacyGeometry && geom)
                this.#geometrySlot?.assign(geom);
            else
                this.#geometrySlot?.assign(); // assign slot fallback content
            if (!this.hasLegacyMaterial && mat)
                this.#materialSlot?.assign(mat);
            else
                this.#materialSlot?.assign(); // assign slot fallback content
            this.#defaultSlot?.assign(...rest);
        };
    };
    return MeshLike = _classThis;
})();
export { MeshLike };
//# sourceMappingURL=MeshLike.js.map