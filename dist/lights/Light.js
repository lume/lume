var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Color } from 'three/src/math/Color.js';
import { Light as ThreeLight } from 'three/src/lights/Light.js';
import { attribute, element, numberAttribute } from '@lume/element';
import { Element3D } from '../core/Element3D.js';
let Light = class Light extends Element3D {
    color = 'white';
    intensity = 1;
    makeThreeObject3d() {
        return new ThreeLight();
    }
    _loadGL() {
        if (!super._loadGL())
            return false;
        this.createGLEffect(() => {
            if (typeof this.color === 'object')
                this.three.color = this.color;
            this.three.color = new Color(this.color);
            this.needsUpdate();
        });
        this.createGLEffect(() => {
            this.three.intensity = this.intensity;
            this.needsUpdate();
        });
        return true;
    }
};
__decorate([
    attribute,
    __metadata("design:type", Object)
], Light.prototype, "color", void 0);
__decorate([
    numberAttribute(1),
    __metadata("design:type", Number)
], Light.prototype, "intensity", void 0);
Light = __decorate([
    element
], Light);
export { Light };
//# sourceMappingURL=Light.js.map