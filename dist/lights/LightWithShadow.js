var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { numberAttribute, booleanAttribute, element } from '@lume/element';
import { Light } from './Light.js';
let LightWithShadow = class LightWithShadow extends Light {
    castShadow = true;
    shadowMapWidth = 512;
    shadowMapHeight = 512;
    shadowRadius = 3;
    shadowBias = 0;
    shadowNormalBias = 0;
    shadowCameraNear = 1;
    shadowCameraFar = 2000;
    _loadGL() {
        if (!super._loadGL())
            return false;
        this.createGLEffect(() => {
            const light = this.three;
            light.castShadow = this.castShadow;
            const shadow = this.three.shadow;
            shadow.mapSize.width = this.shadowMapWidth;
            shadow.mapSize.height = this.shadowMapHeight;
            shadow.radius = this.shadowRadius;
            shadow.bias = this.shadowBias;
            shadow.normalBias = this.shadowNormalBias;
            const camera = shadow.camera;
            camera.near = this.shadowCameraNear;
            camera.far = this.shadowCameraFar;
            shadow.needsUpdate = true;
            this.needsUpdate();
        });
        return true;
    }
};
__decorate([
    booleanAttribute(true)
], LightWithShadow.prototype, "castShadow", void 0);
__decorate([
    numberAttribute(512)
], LightWithShadow.prototype, "shadowMapWidth", void 0);
__decorate([
    numberAttribute(512)
], LightWithShadow.prototype, "shadowMapHeight", void 0);
__decorate([
    numberAttribute(3)
], LightWithShadow.prototype, "shadowRadius", void 0);
__decorate([
    numberAttribute(0)
], LightWithShadow.prototype, "shadowBias", void 0);
__decorate([
    numberAttribute(0)
], LightWithShadow.prototype, "shadowNormalBias", void 0);
__decorate([
    numberAttribute(1)
], LightWithShadow.prototype, "shadowCameraNear", void 0);
__decorate([
    numberAttribute(2000)
], LightWithShadow.prototype, "shadowCameraFar", void 0);
LightWithShadow = __decorate([
    element
], LightWithShadow);
export { LightWithShadow };
//# sourceMappingURL=LightWithShadow.js.map