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
import html from 'solid-js/html';
import { element, attribute, numberAttribute } from '@lume/element';
import { autoDefineElements } from '../LumeConfig.js';
import { Element3D } from '../core/Element3D.js';
let FlickeringOrbs = (() => {
    let _classDecorators = [element('flickering-orbs', autoDefineElements)];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = Element3D;
    let _shadowBias_decorators;
    let _shadowBias_initializers = [];
    let _shadowBias_extraInitializers = [];
    let _intensity_decorators;
    let _intensity_initializers = [];
    let _intensity_extraInitializers = [];
    let _flickerRange_decorators;
    let _flickerRange_initializers = [];
    let _flickerRange_extraInitializers = [];
    let _color_decorators;
    let _color_initializers = [];
    let _color_extraInitializers = [];
    var FlickeringOrbs = class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _shadowBias_decorators = [numberAttribute];
            _intensity_decorators = [numberAttribute];
            _flickerRange_decorators = [numberAttribute];
            _color_decorators = [attribute];
            __esDecorate(null, null, _shadowBias_decorators, { kind: "field", name: "shadowBias", static: false, private: false, access: { has: obj => "shadowBias" in obj, get: obj => obj.shadowBias, set: (obj, value) => { obj.shadowBias = value; } }, metadata: _metadata }, _shadowBias_initializers, _shadowBias_extraInitializers);
            __esDecorate(null, null, _intensity_decorators, { kind: "field", name: "intensity", static: false, private: false, access: { has: obj => "intensity" in obj, get: obj => obj.intensity, set: (obj, value) => { obj.intensity = value; } }, metadata: _metadata }, _intensity_initializers, _intensity_extraInitializers);
            __esDecorate(null, null, _flickerRange_decorators, { kind: "field", name: "flickerRange", static: false, private: false, access: { has: obj => "flickerRange" in obj, get: obj => obj.flickerRange, set: (obj, value) => { obj.flickerRange = value; } }, metadata: _metadata }, _flickerRange_initializers, _flickerRange_extraInitializers);
            __esDecorate(null, null, _color_decorators, { kind: "field", name: "color", static: false, private: false, access: { has: obj => "color" in obj, get: obj => obj.color, set: (obj, value) => { obj.color = value; } }, metadata: _metadata }, _color_initializers, _color_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            FlickeringOrbs = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        shadowBias = __runInitializers(this, _shadowBias_initializers, 0);
        intensity = (__runInitializers(this, _shadowBias_extraInitializers), __runInitializers(this, _intensity_initializers, 1.3));
        flickerRange = (__runInitializers(this, _intensity_extraInitializers), __runInitializers(this, _flickerRange_initializers, 0.4));
        color = (__runInitializers(this, _flickerRange_extraInitializers), __runInitializers(this, _color_initializers, null
        // prettier-ignore
        ));
        // prettier-ignore
        template = (__runInitializers(this, _color_extraInitializers), () => html `
		<flickering-orb flicker-range=${() => this.flickerRange} intensity=${() => this.intensity} shadow-bias=${() => this.shadowBias} color=${() => this.color ?? "yellow"} position="500 0 0"></flickering-orb>
		<flickering-orb flicker-range=${() => this.flickerRange} intensity=${() => this.intensity} shadow-bias=${() => this.shadowBias} color=${() => this.color ?? "deeppink"} position="-500 0 0"></flickering-orb>
		<flickering-orb flicker-range=${() => this.flickerRange} intensity=${() => this.intensity} shadow-bias=${() => this.shadowBias} color=${() => this.color ?? "cyan"} position="0 0 500"></flickering-orb>
		<flickering-orb flicker-range=${() => this.flickerRange} intensity=${() => this.intensity} shadow-bias=${() => this.shadowBias} color=${() => this.color ?? "limegreen"} position="0 0 -500"></flickering-orb>
		<flickering-orb flicker-range=${() => this.flickerRange} intensity=${() => this.intensity} shadow-bias=${() => this.shadowBias} color=${() => this.color ?? "white"} position="0 -500 0"></flickering-orb>
		<flickering-orb flicker-range=${() => this.flickerRange} intensity=${() => this.intensity} shadow-bias=${() => this.shadowBias} color=${() => this.color ?? "white"} position="0 250 0"></flickering-orb>
	`);
    };
    return FlickeringOrbs = _classThis;
})();
export { FlickeringOrbs };
//# sourceMappingURL=FlickeringOrbs.js.map