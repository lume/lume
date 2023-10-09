var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { createEffect } from 'solid-js';
import { stringAttribute, reactive, booleanAttribute } from '../attribute.js';
import { ClipPlane } from '../../core/ClipPlane.js';
import { MeshBehavior } from './MeshBehavior.js';
let refCount = 0;
let ClipPlanesBehavior = class ClipPlanesBehavior extends MeshBehavior {
    clipIntersection = false;
    clipShadows = true;
    #clipPlanes = [];
    #rawClipPlanes = [];
    get clipPlanes() {
        return this.#clipPlanes;
    }
    set clipPlanes(value) {
        this.#rawClipPlanes = value;
        let array = [];
        if (typeof value === 'string') {
            array = [value.trim()];
        }
        else if (Array.isArray(value)) {
            array = value;
        }
        else {
            throw new TypeError('Invalid value for clipPlanes');
        }
        this.#clipPlanes = [];
        for (const v of array) {
            if (typeof v !== 'string') {
                if (v instanceof ClipPlane && v.scene)
                    this.#clipPlanes.push(v);
                continue;
            }
            else if (!v) {
                continue;
            }
            let root = this.element.getRootNode();
            while (root) {
                const els = root.querySelectorAll(v);
                for (let i = 0, l = els.length; i < l; i += 1) {
                    const el = els.item(i);
                    if (!el)
                        continue;
                    if (el instanceof ClipPlane && el.scene)
                        this.#clipPlanes.push(el);
                }
                root = root instanceof ShadowRoot ? root.host.getRootNode() : null;
            }
        }
    }
    flipClip = false;
    clipDisabled = false;
    get material() {
        const mat = this.element.behaviors.find(name => name.endsWith('-material'));
        return mat?.meshComponent ?? null;
    }
    #observer = null;
    loadGL() {
        this.createEffect(() => {
            if (!this.element.scene)
                return;
            this.clipPlanes = this.#rawClipPlanes;
            if (!refCount)
                this.element.scene.__localClipping = true;
            refCount++;
            this.#observer = new MutationObserver(() => {
                this.clipPlanes = this.#rawClipPlanes;
            });
            this.#observer.observe(this.element.getRootNode(), { childList: true, subtree: true });
            createEffect(() => {
                const { clipPlanes, clipIntersection, clipShadows, flipClip } = this;
                const mat = this.material;
                if (!mat)
                    return;
                this.element.needsUpdate();
                if (!clipPlanes.length || this.clipDisabled) {
                    mat.clippingPlanes = null;
                    mat.clipShadows = false;
                    return;
                }
                if (!mat.clippingPlanes)
                    mat.clippingPlanes = [];
                mat.clippingPlanes.length = 0;
                mat.clipIntersection = clipIntersection;
                mat.clipShadows = clipShadows;
                for (const plane of clipPlanes) {
                    if (!plane.__clip || !plane.__inverseClip)
                        continue;
                    mat.clippingPlanes.push(flipClip ? plane.__inverseClip : plane.__clip);
                }
            });
        });
    }
    unloadGL() {
        if (!this.element.scene)
            return;
        refCount--;
        if (!refCount)
            this.element.scene.__localClipping = false;
        this.#observer?.disconnect();
        this.#observer = null;
    }
};
__decorate([
    booleanAttribute(false),
    __metadata("design:type", Object)
], ClipPlanesBehavior.prototype, "clipIntersection", void 0);
__decorate([
    booleanAttribute(true),
    __metadata("design:type", Object)
], ClipPlanesBehavior.prototype, "clipShadows", void 0);
__decorate([
    stringAttribute(''),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], ClipPlanesBehavior.prototype, "clipPlanes", null);
__decorate([
    booleanAttribute(false),
    __metadata("design:type", Object)
], ClipPlanesBehavior.prototype, "flipClip", void 0);
__decorate([
    booleanAttribute(false),
    __metadata("design:type", Object)
], ClipPlanesBehavior.prototype, "clipDisabled", void 0);
ClipPlanesBehavior = __decorate([
    reactive
], ClipPlanesBehavior);
export { ClipPlanesBehavior };
if (globalThis.window?.document && !elementBehaviors.has('clip-planes'))
    elementBehaviors.define('clip-planes', ClipPlanesBehavior);
//# sourceMappingURL=ClipPlanesBehavior.js.map