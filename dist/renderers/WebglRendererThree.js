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
import { reactive, signal, Effects } from 'classy-solid';
import { WebGLRenderer } from 'three/src/renderers/WebGLRenderer.js';
import { BasicShadowMap, PCFSoftShadowMap, PCFShadowMap } from 'three/src/constants.js';
import { PMREMGenerator } from 'three/src/extras/PMREMGenerator.js';
import { TextureLoader } from 'three/src/loaders/TextureLoader.js';
import { Motor } from '../core/Motor.js';
import { triangleBlurTexture } from '../utils/three/texture-blur.js';
import './handle-DOM-absence.js';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
let instance = null;
let isCreatingSingleton = false;
/**
 * @internal
 * A singleton responsible for setting up and
 * drawing a WebGL scene for a given core/Scene using Three.js
 */
let WebglRendererThree = (() => {
    let _classDecorators = [reactive];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _localClippingEnabled_decorators;
    let _localClippingEnabled_initializers = [];
    var WebglRendererThree = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _localClippingEnabled_decorators = [signal];
            __esDecorate(null, null, _localClippingEnabled_decorators, { kind: "field", name: "localClippingEnabled", static: false, private: false, access: { has: obj => "localClippingEnabled" in obj, get: obj => obj.localClippingEnabled, set: (obj, value) => { obj.localClippingEnabled = value; } }, metadata: _metadata }, _localClippingEnabled_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            WebglRendererThree = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        static singleton() {
            if (instance)
                return instance;
            else {
                try {
                    isCreatingSingleton = true;
                    return (instance = new WebglRendererThree());
                }
                catch (e) {
                    throw e;
                }
                finally {
                    isCreatingSingleton = false;
                }
            }
        }
        constructor() {
            if (!isCreatingSingleton)
                throw new Error('class is a singleton, use the static .singleton() method to get an instance');
        }
        sceneStates = (__runInitializers(this, _instanceExtraInitializers), new WeakMap());
        localClippingEnabled = __runInitializers(this, _localClippingEnabled_initializers, false);
        initialized(scene) {
            return this.sceneStates.has(scene);
        }
        initialize(scene) {
            let sceneState = this.sceneStates.get(scene);
            if (sceneState)
                return;
            // TODO: options controlled by HTML attributes on scene elements.
            const renderer = new WebGLRenderer({
                // TODO: how do we change alpha:true to alpha:false after the fact?
                alpha: true,
                premultipliedAlpha: true,
                antialias: true,
            });
            const effects = new Effects();
            effects.createEffect(() => {
                renderer.localClippingEnabled = this.localClippingEnabled;
            });
            // TODO: make some of the renderer options configurable by property/attribute.
            // Needs to be enabled first for it to work? If so, we need to destroy
            // and reinitialize renderes to toggle between XR or non-XR scenes.
            renderer.xr.enabled = true;
            renderer.setPixelRatio(globalThis.devicePixelRatio);
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = PCFSoftShadowMap; // default PCFShadowMap
            this.sceneStates.set(scene, (sceneState = {
                renderer,
                effects,
            }));
            // TODO? Maybe the html/scene.js element should be responsible for
            // making this, so that DOM logic is encapsulated there?
            scene._glLayer.appendChild(renderer.domElement);
        }
        uninitialize(scene) {
            const sceneState = this.sceneStates.get(scene);
            if (!sceneState)
                return;
            scene._glLayer?.removeChild(sceneState.renderer.domElement);
            sceneState.renderer.dispose();
            sceneState.pmremgen?.dispose();
            sceneState.effects.stopEffects();
            this.sceneStates.delete(scene);
        }
        drawScene(scene) {
            const sceneState = this.sceneStates.get(scene);
            if (!sceneState)
                throw new ReferenceError('Can not draw scene. Scene state should be initialized first.');
            const { renderer } = sceneState;
            renderer.render(scene.three, scene.threeCamera);
        }
        updateResolution(scene, x, y) {
            // There is a bug causing the canvas to flicker if this size change
            // handling happens during a `ResizeObserver` callback because a canvas
            // resize after having already rendered will clear the pixels before the
            // paint happens after resize observer callbacks. So we use `Motor.once`
            // to defer it by a frame so that the resize happens before the next
            // frame's render to canvas. It doesn't work with
            // `requestAnimationFrame` directly, only with `Motor.once`, for some
            // reason.  https://github.com/lume/lume/issues/253
            // requestAnimationFrame(() => {
            Motor.once(() => {
                if (!this.initialized(scene))
                    return;
                const state = this.sceneStates.get(scene);
                state.renderer.setSize(x, y);
            }, false);
        }
        setClearColor(scene, color, opacity) {
            const state = this.sceneStates.get(scene);
            if (!state)
                throw new ReferenceError('Unable to set clear color. Scene state should be initialized first.');
            state.renderer.setClearColor(color, opacity);
        }
        setClearAlpha(scene, opacity) {
            const state = this.sceneStates.get(scene);
            if (!state)
                throw new ReferenceError('Unable to set clear alpha. Scene state should be initialized first.');
            state.renderer.setClearAlpha(opacity);
        }
        setShadowMapType(scene, type) {
            const state = this.sceneStates.get(scene);
            if (!state)
                throw new ReferenceError('Unable to set clear alpha. Scene state should be initialized first.');
            // default
            if (!type) {
                state.renderer.shadowMap.type = PCFShadowMap;
                return;
            }
            // TODO shouldn't need a cast here. Bug on TypeScript: https://github.com/microsoft/TypeScript/issues/32054
            type = type.toLowerCase();
            if (type == 'pcf') {
                state.renderer.shadowMap.type = PCFShadowMap;
            }
            else if (type == 'pcfsoft') {
                state.renderer.shadowMap.type = PCFSoftShadowMap;
            }
            else if (type == 'basic') {
                state.renderer.shadowMap.type = BasicShadowMap;
            }
        }
        setPhysicallyCorrectLights(scene, value) {
            const state = this.sceneStates.get(scene);
            if (!state)
                throw new ReferenceError('Unable to set value. Scene state should be initialized first.');
            // @ts-expect-error legacy, FIXME legacy mode will be removed and only physical lights will remain, we shall remove this feature.
            state.renderer.physicallyCorrectLights = value; // <0.150
            // @ts-expect-error legacy, FIXME legacy mode will be removed and only physical lights will remain, we shall remove this feature.
            state.renderer.useLegacyLights = !value; // >=0.150
        }
        #bgVersion = 0;
        /**
         * @method enableBackground - Enable background texture handling for the given scene.
         * @param {Scene} scene - The given scene.
         * @param {boolean} isEquirectangular - True if the background is equirectangular (to use as an environment map), false for a static background image.
         * @param {(t: Texture | undefined) => void} cb - A callback that is called
         * when the background mechanics are done loading. The Callback receives the
         * background Texture instance.
         */
        enableBackground(scene, isEquirectangular, blurAmount, cb) {
            const state = this.sceneStates.get(scene);
            if (!state)
                throw new ReferenceError('Internal error: Scene not registered with WebGLRendererThree.');
            this.#bgVersion += 1;
            state.bgIsEquirectangular = isEquirectangular;
            if (isEquirectangular) {
                // Load the PMREM machinery only if needed.
                if (!state.pmremgen) {
                    state.pmremgen = new PMREMGenerator(state.renderer);
                    state.pmremgen.compileCubemapShader();
                }
            }
            state.hasBg = true;
            this.#loadBackgroundTexture(scene, blurAmount, cb);
        }
        /**
         * @method disableBackground - Disable background for the given scene.
         * @param {Scene} scene - The given scene.
         */
        disableBackground(scene) {
            const state = this.sceneStates.get(scene);
            if (!state)
                throw new ReferenceError('Internal error: Scene not registered with WebGLRendererThree.');
            this.#bgVersion += 1;
            if (!state.hasBg && !state.hasEnv) {
                state.pmremgen?.dispose();
                state.pmremgen = undefined;
            }
            state.bgTexture?.dispose();
            state.hasBg = false;
        }
        /**
         * @private
         * @method #loadBackgroundTexture - Load the background texture for the given scene.
         * @param {Scene} scene - The given scene.
         * @param {(t: Texture | undefined) => void} cb - Callback called when the
         * texture is done loading. It receives the Texture, or undefined if loading
         * was canceled or if other issues.
         */
        #loadBackgroundTexture(scene, blurAmount, cb) {
            const state = this.sceneStates.get(scene);
            if (!state)
                throw new ReferenceError('Internal error: Scene not registered with WebGLRendererThree.');
            const version = this.#bgVersion;
            new TextureLoader().load(scene.background ?? '', tex => {
                // In case state changed during load, ignore a loaded texture that
                // corresponds to previous state:
                if (version !== this.#bgVersion)
                    return;
                if (blurAmount > 0) {
                    // state.bgTexture = blurTexture(state.renderer, tex, 5) // Faster, but quality is not as good, has a pixelated effect. Perhaps we should provide a Scene attribute to easily pick which blur to use.
                    state.bgTexture = triangleBlurTexture(state.renderer, tex, blurAmount, 2);
                    tex.dispose();
                    tex = state.bgTexture;
                }
                if (state.bgIsEquirectangular) {
                    state.bgTexture = state.pmremgen.fromEquirectangular(tex).texture;
                    tex.dispose(); // might not be needed, but just in case.
                }
                else {
                    state.bgTexture = tex;
                }
                cb(state.bgTexture);
            });
        }
        #envVersion = 0;
        /**
         * @method enableEnvironment - Enable environment texture handling for the given scene.
         * @param {Scene} scene - The given scene.
         * @param {(t: Texture | undefined) => void} cb - A callback that is called
         * when the environment mechanics are done loading. The Callback receives the
         * background Texture instance.
         */
        enableEnvironment(scene, cb) {
            const state = this.sceneStates.get(scene);
            if (!state)
                throw new ReferenceError('Internal error: Scene not registered with WebGLRendererThree.');
            this.#envVersion += 1;
            // Load the PMREM machinery only if needed.
            if (!state.pmremgen) {
                state.pmremgen = new PMREMGenerator(state.renderer);
                state.pmremgen.compileCubemapShader();
            }
            state.hasEnv = true;
            this.#loadEnvironmentTexture(scene, cb);
        }
        /**
         * @method disableEnvironment - Disable the environment map for the given scene.
         * @param {Scene} scene - The given scene.
         */
        disableEnvironment(scene) {
            const state = this.sceneStates.get(scene);
            if (!state)
                throw new ReferenceError('Internal error: Scene not registered with WebGLRendererThree.');
            this.#envVersion += 1;
            if (!state.hasBg && !state.hasEnv) {
                state.pmremgen?.dispose();
                state.pmremgen = undefined;
            }
            state.envTexture?.dispose();
            state.hasEnv = false;
        }
        /**
         * @private
         * @method #loadEnvironmentTexture - Load the environment texture for the given scene.
         * @param {Scene} scene - The given scene.
         * @param {(t: Texture | undefined) => void} cb - Callback called when the
         * texture is done loading. It receives the Texture.
         */
        #loadEnvironmentTexture(scene, cb) {
            const state = this.sceneStates.get(scene);
            if (!state)
                throw new ReferenceError('Internal error: Scene not registered with WebGLRendererThree.');
            const version = this.#envVersion;
            new TextureLoader().load(scene.environment ?? '', tex => {
                // In case state changed during load, ignore a loaded texture that
                // corresponds to previous state:
                if (version !== this.#envVersion)
                    return;
                state.envTexture = state.pmremgen.fromEquirectangular(tex).texture;
                tex.dispose(); // might not be needed, but just in case.
                cb(state.envTexture);
            });
        }
        requestFrame(scene, fn) {
            const state = this.sceneStates.get(scene);
            if (!state)
                throw new ReferenceError('Unable to request frame. Scene state should be initialized first.');
            const { renderer } = state;
            if (renderer.setAnimationLoop)
                // >= r94
                renderer.setAnimationLoop(fn);
            else if (renderer.animate)
                // < r94
                renderer.animate(fn);
        }
        // TODO: at the moment this has only been tested toggling it on
        // once. Should we be able to turn it off too (f.e. the vr attribute is removed)?
        // TODO Update to WebXR (WebXRManager in Three)
        enableVR(scene, enable) {
            const state = this.sceneStates.get(scene);
            if (!state)
                throw new ReferenceError('Unable to enable VR. Scene state should be initialized first.');
            const { renderer } = state;
            renderer.xr.enabled = enable;
        }
        // TODO the UI here should be configurable via HTML
        // TODO Update to WebXR
        createDefaultVRButton(scene) {
            const state = this.sceneStates.get(scene);
            if (!state)
                throw new ReferenceError('Unable to create VR button. Scene state should be initialized first.');
            const { renderer } = state;
            return VRButton.createButton(renderer);
        }
    };
    return WebglRendererThree = _classThis;
})();
export { WebglRendererThree };
export function releaseWebGLRendererThree() {
    instance = null;
}
//# sourceMappingURL=WebglRendererThree.js.map