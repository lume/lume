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
import { Mesh as ThreeMesh } from 'three/src/objects/Mesh.js';
import { booleanAttribute, element } from '@lume/element';
import { Element3D } from '../core/Element3D.js';
import { autoDefineElements } from '../LumeConfig.js';
/**
 * @class Mesh -
 *
 * Element: `<lume-mesh>`
 *
 * An element that renders a particular 3D shape (geometry) along with a
 * particular style (material). This is a generic element with no particular
 * shape. Elements like `<lume-box>` extend from `Mesh` in order to set define
 * behaviors they ship with by default. For example a `<lume-box>` element
 * (backed by the [`Box`](./Box) class) extends from this `Mesh` class and
 * applies two default behaviors:
 * [`box-geometry`](../behaviors/mesh-behaviors/geometries/BoxGeometryBehavior)
 * and
 * [`phong-material`](../behaviors/mesh-behaviors/materials/PhongMaterialBehavior).
 *
 * For sake of simplicity, `<lume-mesh>` has a `box-geometry` and
 * `phong-material` by default, just like a `<lume-box>`.
 *
 * ## Example
 *
 * <live-code id="liveExample"></live-code>
 * <script>
 *   liveExample.code = meshExample()
 * </script>
 *
 * @extends Element3D
 * @element lume-mesh TODO @element jsdoc tag
 *
 */
let Mesh = (() => {
    let _classDecorators = [element('lume-mesh', autoDefineElements)];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = Element3D;
    let _instanceExtraInitializers = [];
    let _castShadow_decorators;
    let _castShadow_initializers = [];
    let _receiveShadow_decorators;
    let _receiveShadow_initializers = [];
    var Mesh = class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _castShadow_decorators = [booleanAttribute];
            _receiveShadow_decorators = [booleanAttribute];
            __esDecorate(null, null, _castShadow_decorators, { kind: "field", name: "castShadow", static: false, private: false, access: { has: obj => "castShadow" in obj, get: obj => obj.castShadow, set: (obj, value) => { obj.castShadow = value; } }, metadata: _metadata }, _castShadow_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _receiveShadow_decorators, { kind: "field", name: "receiveShadow", static: false, private: false, access: { has: obj => "receiveShadow" in obj, get: obj => obj.receiveShadow, set: (obj, value) => { obj.receiveShadow = value; } }, metadata: _metadata }, _receiveShadow_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            Mesh = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        // TODO NAMING: It would be neat to be able to return an array of classes
        // as well, so that it can be agnostic of the naming. Either way should
        // work.
        static defaultBehaviors = {
            'box-geometry': (initialBehaviors) => {
                return !initialBehaviors.some(b => b.endsWith('-geometry'));
            },
            'phong-material': (initialBehaviors) => {
                return !initialBehaviors.some(b => b.endsWith('-material'));
            },
        };
        /**
         * @property {boolean} castShadow
         *
         * `boolean` `attribute`
         *
         * Default: `true`
         *
         * When `true`, the mesh casts shadows onto other objects when under the
         * presence of a light such as a
         * [`<lume-point-light>`](../lights/PointLight).
         */
        castShadow = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _castShadow_initializers, true
        /**
         * @property {boolean} receiveShadow
         *
         * `boolean` `attribute`
         *
         * Default: `true`
         *
         * When `true`, the mesh receives shadows from other objects when under the
         * presence of a light such as a
         * [`<lume-point-light>`](../lights/PointLight).
         */
        ));
        /**
         * @property {boolean} receiveShadow
         *
         * `boolean` `attribute`
         *
         * Default: `true`
         *
         * When `true`, the mesh receives shadows from other objects when under the
         * presence of a light such as a
         * [`<lume-point-light>`](../lights/PointLight).
         */
        receiveShadow = __runInitializers(this, _receiveShadow_initializers, true);
        _loadGL() {
            if (!super._loadGL())
                return false;
            this.createGLEffect(() => {
                this.three.castShadow = this.castShadow;
                this.needsUpdate();
            });
            this.createGLEffect(() => {
                this.three.receiveShadow = this.receiveShadow;
                this.three.material.needsUpdate = true;
                this.needsUpdate();
            });
            return true;
        }
        makeThreeObject3d() {
            return new ThreeMesh();
        }
        static {
            __runInitializers(_classThis, _classExtraInitializers);
        }
    };
    return Mesh = _classThis;
})();
export { Mesh };
//# sourceMappingURL=Mesh.js.map