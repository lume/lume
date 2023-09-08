var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { numberAttribute, reactive, stringAttribute } from '../../attribute.js';
import 'element-behaviors';
import { MeshPhysicalMaterial } from 'three/src/materials/MeshPhysicalMaterial.js';
import { StandardMaterialBehavior } from './StandardMaterialBehavior.js';
let PhysicalMaterialBehavior = class PhysicalMaterialBehavior extends StandardMaterialBehavior {
    clearcoat = 0;
    clearcoatRoughness = 0;
    refractiveIndex = 1.5;
    reflectivity = 0.5;
    transmission = 0;
    transmissionMap = '';
    _createComponent() {
        return new MeshPhysicalMaterial({});
    }
    loadGL() {
        super.loadGL();
        this.createEffect(() => {
            const mat = this.meshComponent;
            if (!mat)
                return;
            mat.clearcoat = this.clearcoat;
            mat.clearcoatRoughness = this.clearcoatRoughness;
            mat.ior = this.refractiveIndex;
            mat.reflectivity = this.reflectivity;
            mat.transmission = this.transmission;
            this.element.needsUpdate();
        });
        this._handleTexture(() => this.transmissionMap, (mat, tex) => (mat.transmissionMap = tex), mat => !!mat.transmissionMap);
    }
};
__decorate([
    numberAttribute(0),
    __metadata("design:type", Object)
], PhysicalMaterialBehavior.prototype, "clearcoat", void 0);
__decorate([
    numberAttribute(0),
    __metadata("design:type", Object)
], PhysicalMaterialBehavior.prototype, "clearcoatRoughness", void 0);
__decorate([
    numberAttribute(1.5),
    __metadata("design:type", Object)
], PhysicalMaterialBehavior.prototype, "refractiveIndex", void 0);
__decorate([
    numberAttribute(0.5),
    __metadata("design:type", Object)
], PhysicalMaterialBehavior.prototype, "reflectivity", void 0);
__decorate([
    numberAttribute(0),
    __metadata("design:type", Object)
], PhysicalMaterialBehavior.prototype, "transmission", void 0);
__decorate([
    stringAttribute(''),
    __metadata("design:type", Object)
], PhysicalMaterialBehavior.prototype, "transmissionMap", void 0);
PhysicalMaterialBehavior = __decorate([
    reactive
], PhysicalMaterialBehavior);
export { PhysicalMaterialBehavior };
if (globalThis.window?.document && !elementBehaviors.has('physical-material'))
    elementBehaviors.define('physical-material', PhysicalMaterialBehavior);
//# sourceMappingURL=PhysicalMaterialBehavior.js.map