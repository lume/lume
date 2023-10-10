var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import 'element-behaviors';
import { MeshStandardMaterial } from 'three/src/materials/MeshStandardMaterial.js';
import { booleanAttribute, numberAttribute, reactive, stringAttribute } from '../../attribute.js';
import { MaterialBehavior } from './MaterialBehavior.js';
let StandardMaterialBehavior = class StandardMaterialBehavior extends MaterialBehavior {
    aoMap = '';
    aoMapIntensity = 1;
    bumpMap = '';
    bumpScale = 1;
    displacementMap = '';
    displacementScale = 1;
    displacementBias = 0;
    texture = '';
    normalMap = '';
    normalScale = 1;
    metalness = 0;
    metalnessMap = '';
    roughness = 1;
    roughnessMap = '';
    vertexTangents = false;
    morphTargets = false;
    morphNormals = false;
    _createComponent() {
        return new MeshStandardMaterial();
    }
    loadGL() {
        super.loadGL();
        this.createEffect(() => {
            const mat = this.meshComponent;
            if (!mat)
                return;
            mat.aoMapIntensity = this.aoMapIntensity;
            mat.bumpScale = this.bumpScale;
            mat.displacementScale = this.displacementScale;
            mat.displacementBias = this.displacementBias;
            mat.normalScale.set(this.normalScale, this.normalScale);
            mat.metalness = this.metalness;
            mat.roughness = this.roughness;
            this.element.needsUpdate();
        });
        this._handleTexture(() => this.aoMap, (mat, tex) => (mat.aoMap = tex), mat => !!mat.aoMap);
        this._handleTexture(() => this.bumpMap, (mat, tex) => (mat.bumpMap = tex), mat => !!mat.bumpMap);
        this._handleTexture(() => this.displacementMap, (mat, tex) => (mat.displacementMap = tex), mat => !!mat.displacementMap);
        this._handleTexture(() => this.texture, (mat, tex) => (mat.map = tex), mat => !!mat.map, () => { }, true);
        this._handleTexture(() => this.normalMap, (mat, tex) => (mat.normalMap = tex), mat => !!mat.normalMap);
        this._handleTexture(() => this.metalnessMap, (mat, tex) => (mat.metalnessMap = tex), mat => !!mat.metalnessMap);
        this._handleTexture(() => this.roughnessMap, (mat, tex) => (mat.roughnessMap = tex), mat => !!mat.roughnessMap);
    }
};
__decorate([
    stringAttribute(''),
    __metadata("design:type", Object)
], StandardMaterialBehavior.prototype, "aoMap", void 0);
__decorate([
    numberAttribute(1),
    __metadata("design:type", Object)
], StandardMaterialBehavior.prototype, "aoMapIntensity", void 0);
__decorate([
    stringAttribute(''),
    __metadata("design:type", Object)
], StandardMaterialBehavior.prototype, "bumpMap", void 0);
__decorate([
    numberAttribute(1),
    __metadata("design:type", Object)
], StandardMaterialBehavior.prototype, "bumpScale", void 0);
__decorate([
    stringAttribute(''),
    __metadata("design:type", Object)
], StandardMaterialBehavior.prototype, "displacementMap", void 0);
__decorate([
    numberAttribute(1),
    __metadata("design:type", Object)
], StandardMaterialBehavior.prototype, "displacementScale", void 0);
__decorate([
    numberAttribute(0),
    __metadata("design:type", Object)
], StandardMaterialBehavior.prototype, "displacementBias", void 0);
__decorate([
    stringAttribute(''),
    __metadata("design:type", Object)
], StandardMaterialBehavior.prototype, "texture", void 0);
__decorate([
    stringAttribute(''),
    __metadata("design:type", Object)
], StandardMaterialBehavior.prototype, "normalMap", void 0);
__decorate([
    numberAttribute(1),
    __metadata("design:type", Object)
], StandardMaterialBehavior.prototype, "normalScale", void 0);
__decorate([
    numberAttribute(0),
    __metadata("design:type", Object)
], StandardMaterialBehavior.prototype, "metalness", void 0);
__decorate([
    stringAttribute(''),
    __metadata("design:type", Object)
], StandardMaterialBehavior.prototype, "metalnessMap", void 0);
__decorate([
    numberAttribute(1),
    __metadata("design:type", Object)
], StandardMaterialBehavior.prototype, "roughness", void 0);
__decorate([
    stringAttribute(''),
    __metadata("design:type", Object)
], StandardMaterialBehavior.prototype, "roughnessMap", void 0);
__decorate([
    booleanAttribute(false),
    __metadata("design:type", Boolean)
], StandardMaterialBehavior.prototype, "vertexTangents", void 0);
__decorate([
    booleanAttribute(false),
    __metadata("design:type", Boolean)
], StandardMaterialBehavior.prototype, "morphTargets", void 0);
__decorate([
    booleanAttribute(false),
    __metadata("design:type", Boolean)
], StandardMaterialBehavior.prototype, "morphNormals", void 0);
StandardMaterialBehavior = __decorate([
    reactive
], StandardMaterialBehavior);
export { StandardMaterialBehavior };
if (globalThis.window?.document && !elementBehaviors.has('standard-material'))
    elementBehaviors.define('standard-material', StandardMaterialBehavior);
//# sourceMappingURL=StandardMaterialBehavior.js.map