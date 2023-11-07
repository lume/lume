var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { SpotLight as ThreeSpotLight } from 'three/src/lights/SpotLight.js';
import { SpotLightHelper } from 'three/src/helpers/SpotLightHelper.js';
import { numberAttribute, element, booleanAttribute, stringAttribute } from '@lume/element';
import { createEffect, onCleanup } from 'solid-js';
import { PointLight } from './PointLight.js';
import { autoDefineElements } from '../LumeConfig.js';
import { Element3D, toRadians } from '../core/index.js';
let SpotLight = class SpotLight extends PointLight {
    angle = 60;
    penumbra = 1;
    #target = [];
    #rawTarget = '';
    #observer = null;
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
                if (v instanceof Element3D && v.scene)
                    this.#target.push(v);
                continue;
            }
            else if (!v) {
                continue;
            }
            let root = this.getRootNode();
            while (root) {
                const els = root.querySelectorAll(v);
                for (let i = 0, l = els.length; i < l; i += 1) {
                    const el = els.item(i);
                    if (!el)
                        continue;
                    if (el instanceof Element3D && el.scene)
                        this.#target.push(el);
                }
                root = root instanceof ShadowRoot ? root.host.getRootNode() : null;
            }
        }
    }
    debug = false;
    updateWorldMatrices(traverse = true) {
        super.updateWorldMatrices(traverse);
        this.#helper?.update();
    }
    #helper = null;
    _loadGL() {
        if (!super._loadGL())
            return false;
        this.createGLEffect(() => {
            if (!(this.scene && this.debug))
                return;
            const scene = this.scene;
            this.#helper = new SpotLightHelper(this.three);
            scene.three.add(this.#helper);
            this.needsUpdate();
            onCleanup(() => scene.three.remove(this.#helper));
        });
        this.createGLEffect(() => {
            const light = this.three;
            light.angle = toRadians(this.angle);
            light.penumbra = this.penumbra;
            this.#helper?.update();
            this.needsUpdate();
        });
        this.createEffect(() => {
            if (!this.scene)
                return;
            this.target = this.#rawTarget;
            this.#observer = new MutationObserver(() => {
                this.target = this.#rawTarget;
            });
            this.#observer.observe(this.getRootNode(), { childList: true, subtree: true });
            createEffect(() => {
                const target = this.target;
                if (target)
                    this.three.target = target.three;
                else
                    this.three.target = new Object3D();
                this.needsUpdate();
            });
        });
        return true;
    }
    _unloadGL() {
        if (!super._unloadGL())
            return false;
        this.#observer?.disconnect();
        this.#observer = null;
        return true;
    }
    makeThreeObject3d() {
        return new ThreeSpotLight();
    }
};
__decorate([
    numberAttribute(60)
], SpotLight.prototype, "angle", void 0);
__decorate([
    numberAttribute(1)
], SpotLight.prototype, "penumbra", void 0);
__decorate([
    stringAttribute('')
], SpotLight.prototype, "target", null);
__decorate([
    booleanAttribute(false)
], SpotLight.prototype, "debug", void 0);
SpotLight = __decorate([
    element('lume-spot-light', autoDefineElements)
], SpotLight);
export { SpotLight };
import { Object3D } from 'three';
//# sourceMappingURL=SpotLight.js.map