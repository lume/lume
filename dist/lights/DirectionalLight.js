var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { DirectionalLight as ThreeDirectionalLight } from 'three/src/lights/DirectionalLight.js';
import { numberAttribute, element } from '@lume/element';
import { LightWithShadow } from './LightWithShadow.js';
import { autoDefineElements } from '../LumeConfig.js';
let DirectionalLight = class DirectionalLight extends LightWithShadow {
    constructor() {
        super();
        this.intensity = 1;
    }
    shadowCameraTop = 1000;
    shadowCameraRight = 1000;
    shadowCameraBottom = -1000;
    shadowCameraLeft = -1000;
    _loadGL() {
        if (!super._loadGL())
            return false;
        this.createGLEffect(() => {
            const light = this.three;
            const shadow = light.shadow;
            shadow.camera.top = this.shadowCameraTop;
            shadow.camera.right = this.shadowCameraRight;
            shadow.camera.bottom = this.shadowCameraBottom;
            shadow.camera.left = this.shadowCameraLeft;
            shadow.needsUpdate = true;
            this.needsUpdate();
        });
        return true;
    }
    makeThreeObject3d() {
        return new ThreeDirectionalLight();
    }
};
__decorate([
    numberAttribute(1)
], DirectionalLight.prototype, "shadowCameraTop", void 0);
__decorate([
    numberAttribute(1)
], DirectionalLight.prototype, "shadowCameraRight", void 0);
__decorate([
    numberAttribute(1)
], DirectionalLight.prototype, "shadowCameraBottom", void 0);
__decorate([
    numberAttribute(1)
], DirectionalLight.prototype, "shadowCameraLeft", void 0);
DirectionalLight = __decorate([
    element('lume-directional-light', autoDefineElements)
], DirectionalLight);
export { DirectionalLight };
//# sourceMappingURL=DirectionalLight.js.map