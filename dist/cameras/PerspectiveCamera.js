var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { createEffect, createRoot, untrack } from 'solid-js';
import { numberAttribute, booleanAttribute, element } from '@lume/element';
import { PerspectiveCamera as ThreePerspectiveCamera } from 'three/src/cameras/PerspectiveCamera.js';
import { Element3D } from '../core/Element3D.js';
import { autoDefineElements } from '../LumeConfig.js';
let PerspectiveCamera = class PerspectiveCamera extends Element3D {
    fov = 50;
    aspect = 0;
    near = 0.1;
    far = 3000;
    zoom = 1;
    active = false;
    connectedCallback() {
        super.connectedCallback();
        createRoot(dispose => {
            createEffect(() => {
                if (!this.scene)
                    return;
                untrack(() => {
                    this.#lastKnownScene = this.scene;
                    this.#setSceneCamera(this.active ? undefined : 'unset');
                    queueMicrotask(() => dispose());
                });
            });
        });
        this.createEffect(() => {
            this.three.fov = this.fov;
            this.three.updateProjectionMatrix();
            this.needsUpdate();
        });
        this.createEffect(() => {
            if (this.aspect !== 0) {
                this.three.aspect = this.aspect;
                this.three.updateProjectionMatrix();
                return;
            }
            let aspect = 0;
            if (this.scene)
                aspect = this.scene.calculatedSize.x / this.scene.calculatedSize.y;
            if (!aspect)
                aspect = 16 / 9;
            this.three.aspect = aspect;
            this.three.updateProjectionMatrix();
            this.needsUpdate();
        });
        this.createEffect(() => {
            this.three.near = this.near;
            this.three.updateProjectionMatrix();
            this.needsUpdate();
        });
        this.createEffect(() => {
            this.three.far = this.far;
            this.three.updateProjectionMatrix();
            this.needsUpdate();
        });
        this.createEffect(() => {
            this.three.zoom = this.zoom;
            this.three.updateProjectionMatrix();
            this.needsUpdate();
        });
        this.createEffect(() => {
            const active = this.active;
            untrack(() => {
                this.#setSceneCamera(active ? undefined : 'unset');
            });
            this.needsUpdate();
        });
    }
    makeThreeObject3d() {
        return new ThreePerspectiveCamera(75, 16 / 9, 1, 1000);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.#setSceneCamera('unset');
        this.#lastKnownScene = null;
    }
    #lastKnownScene = null;
    #setSceneCamera(unset) {
        if (unset) {
            if (this.#lastKnownScene)
                this.#lastKnownScene._removeCamera(this);
        }
        else {
            if (!this.scene || !this.isConnected)
                return;
            this.scene._addCamera(this);
        }
    }
};
__decorate([
    numberAttribute(50),
    __metadata("design:type", Object)
], PerspectiveCamera.prototype, "fov", void 0);
__decorate([
    numberAttribute(0),
    __metadata("design:type", Object)
], PerspectiveCamera.prototype, "aspect", void 0);
__decorate([
    numberAttribute(0.1),
    __metadata("design:type", Object)
], PerspectiveCamera.prototype, "near", void 0);
__decorate([
    numberAttribute(3000),
    __metadata("design:type", Object)
], PerspectiveCamera.prototype, "far", void 0);
__decorate([
    numberAttribute(1),
    __metadata("design:type", Object)
], PerspectiveCamera.prototype, "zoom", void 0);
__decorate([
    booleanAttribute(false),
    __metadata("design:type", Object)
], PerspectiveCamera.prototype, "active", void 0);
PerspectiveCamera = __decorate([
    element('lume-perspective-camera', autoDefineElements)
], PerspectiveCamera);
export { PerspectiveCamera };
//# sourceMappingURL=PerspectiveCamera.js.map