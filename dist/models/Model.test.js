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
import { element } from '@lume/element';
import { Model } from './Model.js';
import { LoadEvent } from './LoadEvent.js';
import './GltfModel.js';
import '../core/Scene.js';
import html from 'solid-js/html';
import { ErrorEvent } from './ErrorEvent.js';
let rand = Math.random();
let TestModel = (() => {
    let _classDecorators = [element('test-el-' + rand)];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = Model;
    var TestModel = class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            TestModel = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        foo = 123;
    };
    return TestModel = _classThis;
})();
describe('Model', () => {
    it('dispatches a load event', () => {
        const el = new TestModel();
        // Type check (ensure these types are still present)
        el.addEventListener('click', function (event) {
            event.target;
        });
        // Type check (ensure these types are still present)
        el.addEventListener('pointerdown', function (event) {
            event.target;
        });
        let loadEvent = null;
        el.addEventListener('load', function (event) {
            event.target;
            this.position;
            this.rotation;
            this.foo;
            loadEvent = event;
        });
        const event = new LoadEvent();
        el.dispatchEvent(event);
        expect(loadEvent).toBe(event);
    });
    it('does not change type of other load events', () => {
        // Type check
        const img = document.createElement('img');
        img.addEventListener('load', function (event) {
            event.target;
            // @ts-expect-error not a Model element
            this.position;
        });
    });
    it('allows observing events with Solid html attributes', async () => {
        let loadDispatched = false;
        let errorDispatched = false;
        let progressDispatched = false;
        const model = html `
			<lume-gltf-model
				onload=${() => (loadDispatched = true)}
				onerror=${() => (errorDispatched = true)}
				onprogress=${() => (progressDispatched = true)}
			></lume-gltf-model>
		`;
        const event = new LoadEvent();
        model.dispatchEvent(event);
        expect(loadDispatched).toBe(true);
        const err = new ErrorEvent();
        model.dispatchEvent(err);
        expect(errorDispatched).toBe(true);
        const progress = new ProgressEvent('progress', {});
        model.dispatchEvent(progress);
        expect(progressDispatched).toBe(true);
        let error2Dispatched = false;
        let model2;
        const scene = html `
			<lume-scene webgl>
				<lume-gltf-model
					ref=${(e) => (model2 = e)}
					onerror=${() => (error2Dispatched = true)}
					src="foo://invalid-url"
				></lume-gltf-model>
			</lume-scene>
		`;
        document.body.append(scene);
        await new Promise(resolve => model2.addEventListener('error', resolve));
        scene.remove();
        expect(error2Dispatched).toBe(true);
    });
});
//# sourceMappingURL=Model.test.js.map