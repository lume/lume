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
import { signal } from 'classy-solid';
import { behavior } from '../Behavior.js';
import { RenderableBehavior } from '../RenderableBehavior.js';
import { Mesh } from '../../meshes/Mesh.js';
import { Points } from '../../meshes/Points.js';
import { InstancedMesh } from '../../meshes/InstancedMesh.js';
import { Line } from '../../meshes/Line.js';
/**
 * @class MeshBehavior
 *
 * @extends RenderableBehavior
 */
let MeshBehavior = (() => {
    let _classDecorators = [behavior];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = RenderableBehavior;
    let _instanceExtraInitializers = [];
    let _meshComponent_decorators;
    let _meshComponent_initializers = [];
    var MeshBehavior = class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _meshComponent_decorators = [signal];
            __esDecorate(null, null, _meshComponent_decorators, { kind: "field", name: "meshComponent", static: false, private: false, access: { has: obj => "meshComponent" in obj, get: obj => obj.meshComponent, set: (obj, value) => { obj.meshComponent = value; } }, metadata: _metadata }, _meshComponent_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            MeshBehavior = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        requiredElementType() {
            // At the moment, a "mesh" behavior can be used on Mesh, Points, or anything that has a geometry and a material.
            // XXX An alternative to using arrays with multiple types is we could branch the class
            // hierarchy to avoid arrays/unions.
            return [Mesh, Points, InstancedMesh, Line];
        }
        /**
         * @protected
         * @method _createComponent -
         * Subclasses override this to create either a Material or a BufferGeometry.
         * It is reactive, any reactive dependencies used in here will cause
         * re-creation of the instance. Use `untrack` for cases where a dependency
         * should not re-create the instance (in that case an additional effect may
         * update the instance instead, while in other cases constructing a new
         * object is the only (or easier) way).
         *
         * @returns {BufferGeometry | Material}
         */
        _createComponent() {
            throw new Error('`_createComponent()` is not implemented by subclass.');
        }
        /**
         * The component that this behavior manages, either a Material, or a
         * BufferGeometry.
         */
        meshComponent = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _meshComponent_initializers, null));
    };
    return MeshBehavior = _classThis;
})();
export { MeshBehavior };
//# sourceMappingURL=MeshBehavior.js.map