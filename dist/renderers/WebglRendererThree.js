var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var WebglRendererThree_1;
import { reactive } from '@lume/variable';
import { Effectful } from '../core/Effectful.js';
import { WebGLRenderer } from 'three/src/renderers/WebGLRenderer.js';
import { BasicShadowMap, PCFSoftShadowMap, PCFShadowMap } from 'three/src/constants.js';
import { PMREMGenerator } from 'three/src/extras/PMREMGenerator.js';
import { TextureLoader } from 'three/src/loaders/TextureLoader.js';
import { Motor } from '../core/Motor.js';
import './handle-DOM-absence.js';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
class SceneEffects extends Effectful(Object) {
}
let instance = null;
let isCreatingSingleton = false;
let WebglRendererThree = WebglRendererThree_1 = class WebglRendererThree {
    static singleton() {
        if (instance)
            return instance;
        else {
            try {
                isCreatingSingleton = true;
                return (instance = new WebglRendererThree_1());
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
    sceneStates = new WeakMap();
    localClippingEnabled = false;
    initialize(scene) {
        let sceneState = this.sceneStates.get(scene);
        if (sceneState)
            return;
        const renderer = new WebGLRenderer({
            alpha: true,
            premultipliedAlpha: true,
            antialias: true,
        });
        const effects = new SceneEffects();
        effects.createEffect(() => {
            renderer.localClippingEnabled = this.localClippingEnabled;
        });
        renderer.xr.enabled = true;
        renderer.setPixelRatio(globalThis.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = PCFSoftShadowMap;
        this.sceneStates.set(scene, (sceneState = {
            renderer,
            sizeChangeHandler: () => this.updateResolution(scene),
            effects,
        }));
        this.updateResolution(scene);
        scene.on('sizechange', sceneState.sizeChangeHandler);
        scene._glLayer.appendChild(renderer.domElement);
    }
    uninitialize(scene) {
        const sceneState = this.sceneStates.get(scene);
        if (!sceneState)
            return;
        scene.off('sizechange', sceneState.sizeChangeHandler);
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
    updateResolution(scene) {
        Motor.once(() => {
            const state = this.sceneStates.get(scene);
            if (!state)
                throw new ReferenceError('Unable to update resolution. Scene state should be initialized first.');
            scene._updateCameraAspect();
            scene._updateCameraPerspective();
            scene._updateCameraProjection();
            const { x, y } = scene.calculatedSize;
            state.renderer.setSize(x, y);
            scene.needsUpdate();
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
        if (!type) {
            state.renderer.shadowMap.type = PCFShadowMap;
            return;
        }
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
        state.renderer.physicallyCorrectLights = value;
        state.renderer.useLegacyLights = !value;
    }
    #bgVersion = 0;
    enableBackground(scene, isEquirectangular, cb) {
        const state = this.sceneStates.get(scene);
        if (!state)
            throw new ReferenceError('Internal error: Scene not registered with WebGLRendererThree.');
        this.#bgVersion += 1;
        state.backgroundIsEquirectangular = isEquirectangular;
        if (isEquirectangular) {
            if (!state.pmremgen) {
                state.pmremgen = new PMREMGenerator(state.renderer);
                state.pmremgen.compileCubemapShader();
            }
        }
        state.hasBackground = true;
        this.#loadBackgroundTexture(scene, cb);
    }
    disableBackground(scene) {
        const state = this.sceneStates.get(scene);
        if (!state)
            throw new ReferenceError('Internal error: Scene not registered with WebGLRendererThree.');
        this.#bgVersion += 1;
        if (!state.hasBackground && !state.hasEnvironment) {
            state.pmremgen?.dispose();
            state.pmremgen = undefined;
        }
    }
    #loadBackgroundTexture(scene, cb) {
        const state = this.sceneStates.get(scene);
        if (!state)
            throw new ReferenceError('Internal error: Scene not registered with WebGLRendererThree.');
        const version = this.#bgVersion;
        new TextureLoader().load(scene.background ?? '', tex => {
            if (version !== this.#bgVersion)
                return;
            if (state.backgroundIsEquirectangular) {
                cb(state.pmremgen.fromEquirectangular(tex).texture);
            }
            else {
                cb(tex);
            }
        });
    }
    #envVersion = 0;
    enableEnvironment(scene, cb) {
        const state = this.sceneStates.get(scene);
        if (!state)
            throw new ReferenceError('Internal error: Scene not registered with WebGLRendererThree.');
        this.#envVersion += 1;
        if (!state.pmremgen) {
            state.pmremgen = new PMREMGenerator(state.renderer);
            state.pmremgen.compileCubemapShader();
        }
        state.hasEnvironment = true;
        this.#loadEnvironmentTexture(scene, cb);
    }
    disableEnvironment(scene) {
        const state = this.sceneStates.get(scene);
        if (!state)
            throw new ReferenceError('Internal error: Scene not registered with WebGLRendererThree.');
        this.#envVersion += 1;
        if (!state.hasBackground && !state.hasEnvironment) {
            state.pmremgen?.dispose();
            state.pmremgen = undefined;
        }
    }
    #loadEnvironmentTexture(scene, cb) {
        const state = this.sceneStates.get(scene);
        if (!state)
            throw new ReferenceError('Internal error: Scene not registered with WebGLRendererThree.');
        const version = this.#envVersion;
        new TextureLoader().load(scene.environment ?? '', tex => {
            if (version !== this.#envVersion)
                return;
            cb(state.pmremgen.fromEquirectangular(tex).texture);
            tex.dispose();
        });
    }
    requestFrame(scene, fn) {
        const state = this.sceneStates.get(scene);
        if (!state)
            throw new ReferenceError('Unable to request frame. Scene state should be initialized first.');
        const { renderer } = state;
        if (renderer.setAnimationLoop)
            renderer.setAnimationLoop(fn);
        else if (renderer.animate)
            renderer.animate(fn);
    }
    enableVR(scene, enable) {
        const state = this.sceneStates.get(scene);
        if (!state)
            throw new ReferenceError('Unable to enable VR. Scene state should be initialized first.');
        const { renderer } = state;
        renderer.xr.enabled = enable;
    }
    createDefaultVRButton(scene) {
        const state = this.sceneStates.get(scene);
        if (!state)
            throw new ReferenceError('Unable to create VR button. Scene state should be initialized first.');
        const { renderer } = state;
        return VRButton.createButton(renderer);
    }
};
__decorate([
    reactive
], WebglRendererThree.prototype, "localClippingEnabled", void 0);
WebglRendererThree = WebglRendererThree_1 = __decorate([
    reactive
], WebglRendererThree);
export { WebglRendererThree };
export function releaseWebGLRendererThree() {
    instance = null;
}
//# sourceMappingURL=WebglRendererThree.js.map