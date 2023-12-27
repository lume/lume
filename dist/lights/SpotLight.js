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
import { numberAttribute, element, stringAttribute } from '@lume/element';
import { SpotLight as ThreeSpotLight } from 'three/src/lights/SpotLight.js';
import { SpotLightHelper } from 'three/src/helpers/SpotLightHelper.js';
import { CameraHelper } from 'three/src/helpers/CameraHelper.js';
import { Object3D } from 'three/src/core/Object3D.js';
import { createEffect, onCleanup } from 'solid-js';
import { PointLight } from './PointLight.js';
import { autoDefineElements } from '../LumeConfig.js';
import { Element3D, toRadians } from '../core/index.js';
/**
 * @element lume-spot-light
 * @class SpotLight -
 *
 * Element: `<lume-spot-light>`
 *
 * This emits light from a single point in one direction along a cone shape that increases in size the further the light goes.
 *
 * This creates light that frays outward as it travels in a particular
 * direction, just like a real-life spot light, unlike a point light that emits
 * light in all directions.
 *
 * ## Example
 *
 * <live-code src="../../examples/spotlight.html"></live-code>
 *
 * @extends PointLight
 */
let SpotLight = (() => {
    let _classDecorators = [element('lume-spot-light', autoDefineElements)];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = PointLight;
    let _instanceExtraInitializers = [];
    let _angle_decorators;
    let _angle_initializers = [];
    let _penumbra_decorators;
    let _penumbra_initializers = [];
    let _get_target_decorators;
    var SpotLight = class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _angle_decorators = [numberAttribute];
            _penumbra_decorators = [numberAttribute];
            _get_target_decorators = [stringAttribute];
            __esDecorate(this, null, _get_target_decorators, { kind: "getter", name: "target", static: false, private: false, access: { has: obj => "target" in obj, get: obj => obj.target }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, null, _angle_decorators, { kind: "field", name: "angle", static: false, private: false, access: { has: obj => "angle" in obj, get: obj => obj.angle, set: (obj, value) => { obj.angle = value; } }, metadata: _metadata }, _angle_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _penumbra_decorators, { kind: "field", name: "penumbra", static: false, private: false, access: { has: obj => "penumbra" in obj, get: obj => obj.penumbra, set: (obj, value) => { obj.penumbra = value; } }, metadata: _metadata }, _penumbra_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            SpotLight = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        /**
         * @property {number} angle -
         *
         * `attribute`
         *
         * Default: `60`
         *
         * The angle of the cone shape in which light propagates. Should be no more
         * than 90. This value affects the fov of the light's shadow camera
         */
        angle = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _angle_initializers, 60
        /**
         * @property {number} penumbra -
         *
         * `attribute`
         *
         * Default: `1`
         *
         * The value should be between 0 and 1.
         *
         * The percent of the spotlight cone that is attenuated due to a
         * [penumbra](https://en.wikipedia.org/wiki/Umbra,_penumbra_and_antumbra#Penumbra).
         * To give the edge of the spotlight's oval a soft fadein from the edge of
         * the oval, increase this from 0. 1 means that the light fades in from the
         * oval edge all the way to the center, 0.5 means the light is faded in at
         * half way to the center, and 0 means that there is no fade in which gives
         * the oval a sharp/crisp outline.
         */
        ));
        /**
         * @property {number} penumbra -
         *
         * `attribute`
         *
         * Default: `1`
         *
         * The value should be between 0 and 1.
         *
         * The percent of the spotlight cone that is attenuated due to a
         * [penumbra](https://en.wikipedia.org/wiki/Umbra,_penumbra_and_antumbra#Penumbra).
         * To give the edge of the spotlight's oval a soft fadein from the edge of
         * the oval, increase this from 0. 1 means that the light fades in from the
         * oval edge all the way to the center, 0.5 means the light is faded in at
         * half way to the center, and 0 means that there is no fade in which gives
         * the oval a sharp/crisp outline.
         */
        penumbra = __runInitializers(this, _penumbra_initializers, 1
        // TODO color map, like an old-school projector. We need to further abstract
        // _handleTexture from the behaviors (f.e. make it a mixin so we can pull it
        // in here, or make a new material behavior just for this light).
        // @stringAttribute colorMap = ""
        );
        // TODO color map, like an old-school projector. We need to further abstract
        // _handleTexture from the behaviors (f.e. make it a mixin so we can pull it
        // in here, or make a new material behavior just for this light).
        // @stringAttribute colorMap = ""
        #target = [];
        #rawTarget = '';
        #observer = null;
        // TODO Consolidate target selector functionality with similar clipPlanes
        // functionality in ClipPlanesBehavior.
        get target() {
            return this.#target[0] ?? null;
        }
        set target(value) {
            this.#rawTarget = value;
            let array = [];
            if (typeof value === 'string') {
                array.push(value.trim());
            }
            else if (Array.isArray(value)) {
                array = value;
            }
            else if (typeof value === 'object') {
                if (value)
                    array.push(value);
            }
            else {
                throw new TypeError('Invalid value for target');
            }
            this.#target = [];
            for (const v of array) {
                if (typeof v !== 'string') {
                    // TODO #279: This setter is non-reactive to v.scene, so it will
                    // not update if the element becomes composed into a Lume scene.
                    if (v instanceof Element3D && v.scene)
                        this.#target.push(v);
                    continue;
                }
                else if (!v) {
                    // skip empty strings, they cause an error with querySelectorAll
                    continue;
                }
                let root = this.getRootNode();
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
                        if (el instanceof Element3D && el.scene)
                            this.#target.push(el);
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
        updateWorldMatrices(traverse = true) {
            super.updateWorldMatrices(traverse);
            this.#helper?.update();
            this.#camHelper?.update();
        }
        #helper = null;
        #camHelper = null;
        connectedCallback() {
            super.connectedCallback();
            this.createEffect(() => {
                if (!(this.scene && this.debug))
                    return;
                const scene = this.scene;
                this.#helper = new SpotLightHelper(this.three);
                scene.three.add(this.#helper);
                this.#camHelper = new CameraHelper(this.three.shadow.camera);
                scene.three.add(this.#camHelper);
                this.needsUpdate();
                onCleanup(() => {
                    this.#helper.dispose();
                    scene.three.remove(this.#helper);
                    this.#helper = null;
                    this.#camHelper.dispose();
                    scene.three.remove(this.#camHelper);
                    this.#camHelper = null;
                });
            });
            this.createEffect(() => {
                const light = this.three;
                light.angle = toRadians(this.angle);
                light.penumbra = this.penumbra;
                this.#helper?.update();
                this.needsUpdate();
            });
            // TODO consolidate selector observation with the one in ClipPlanes
            this.createEffect(() => {
                if (!this.scene)
                    return;
                // Trigger the setter again in case it returned early if there was
                // no scene. Depending on code load order, el.scene inside of set
                // clipPlanes might be null despite that it is a valid Lume element.
                // TODO #279: Instead of this hack, move away
                // from getters/setters, make all logic fully reactive to avoid
                // worrying about code execution order. https://github.com/lume/lume/issues/279
                this.target = this.#rawTarget;
                // TODO we need to observe all the way up the composed tree, or we
                // should make the querying scoped only to the nearest root, for
                // consistency. This covers most cases, for now.
                this.#observer = new MutationObserver(() => {
                    // TODO this could be more efficient if we check the added nodes directly, but for now we re-run the query logic.
                    // This triggers the setter logic.
                    this.target = this.#rawTarget;
                });
                this.#observer.observe(this.getRootNode(), { childList: true, subtree: true });
                createEffect(() => {
                    const target = this.target;
                    if (target)
                        this.three.target = target.three;
                    else
                        this.three.target = new Object3D(); // point at world origin
                    this.needsUpdate();
                });
                onCleanup(() => {
                    this.#observer?.disconnect();
                    this.#observer = null;
                });
            });
        }
        // @ts-expect-error FIXME probably better for spotlight not to extend from pointlight, make a common shared class if needed.
        makeThreeObject3d() {
            return new ThreeSpotLight();
        }
    };
    return SpotLight = _classThis;
})();
export { SpotLight };
//# sourceMappingURL=SpotLight.js.map