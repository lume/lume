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
import { Color } from 'three/src/math/Color.js';
import { MeshPhongMaterial } from 'three/src/materials/MeshPhongMaterial.js';
import { MaterialBehavior } from './MaterialBehavior.js';
import { numberAttribute, stringAttribute, booleanAttribute, reactive } from '../../attribute.js';
let PhongMaterialBehavior = class PhongMaterialBehavior extends MaterialBehavior {
    alphaMap = '';
    aoMap = '';
    aoMapIntensity = 1;
    bumpMap = '';
    bumpScale = 1;
    displacementMap = '';
    displacementScale = 1;
    displacementBias = 0;
    emissiveMap = '';
    get emissive() {
        return this.#emissive;
    }
    set emissive(val) {
        val = val ?? '';
        if (typeof val === 'string')
            this.#emissive.set(val);
        else if (typeof val === 'number')
            this.#emissive.set(val);
        else
            this.#emissive = val;
    }
    #emissive = new Color('black');
    emissiveIntensity = 1;
    envMap = '';
    flatShading = false;
    lightMap = '';
    lightMapIntensity = 1;
    texture = '';
    normalMap = '';
    normalScale = 1;
    reflectivity = 1;
    specularMap = '';
    get specular() {
        return this.#specular;
    }
    set specular(val) {
        val = val ?? '';
        if (typeof val === 'string')
            this.#specular.set(val);
        else if (typeof val === 'number')
            this.#specular.set(val);
        else
            this.#specular = val;
    }
    #specular = new Color('#111');
    shininess = 30;
    _createComponent() {
        return new MeshPhongMaterial({
            color: 0x00ff00,
        });
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
            mat.emissive = this.emissive;
            mat.emissiveIntensity = this.emissiveIntensity;
            mat.flatShading = this.flatShading;
            mat.lightMapIntensity = this.lightMapIntensity;
            mat.normalScale.set(this.normalScale, this.normalScale);
            mat.reflectivity = this.reflectivity;
            mat.specular = this.specular;
            mat.shininess = this.shininess;
            this.element.needsUpdate();
        });
        this._handleTexture(() => this.alphaMap, (mat, tex) => (mat.alphaMap = tex), mat => !!mat.alphaMap);
        this._handleTexture(() => this.aoMap, (mat, tex) => (mat.aoMap = tex), mat => !!mat.aoMap);
        this._handleTexture(() => this.bumpMap, (mat, tex) => (mat.bumpMap = tex), mat => !!mat.bumpMap);
        this._handleTexture(() => this.displacementMap, (mat, tex) => (mat.displacementMap = tex), mat => !!mat.displacementMap);
        this._handleTexture(() => this.emissiveMap, (mat, tex) => (mat.emissiveMap = tex), mat => !!mat.emissiveMap);
        this._handleTexture(() => this.envMap, (mat, tex) => (mat.envMap = tex), mat => !!mat.envMap);
        this._handleTexture(() => this.lightMap, (mat, tex) => (mat.lightMap = tex), mat => !!mat.lightMap);
        this._handleTexture(() => this.texture, (mat, tex) => (mat.map = tex), mat => !!mat.map);
        this._handleTexture(() => this.normalMap, (mat, tex) => (mat.normalMap = tex), mat => !!mat.normalMap);
        this._handleTexture(() => this.specularMap, (mat, tex) => (mat.specularMap = tex), mat => !!mat.specularMap);
    }
};
__decorate([
    stringAttribute(''),
    __metadata("design:type", Object)
], PhongMaterialBehavior.prototype, "alphaMap", void 0);
__decorate([
    stringAttribute(''),
    __metadata("design:type", Object)
], PhongMaterialBehavior.prototype, "aoMap", void 0);
__decorate([
    numberAttribute(1),
    __metadata("design:type", Object)
], PhongMaterialBehavior.prototype, "aoMapIntensity", void 0);
__decorate([
    stringAttribute(''),
    __metadata("design:type", Object)
], PhongMaterialBehavior.prototype, "bumpMap", void 0);
__decorate([
    numberAttribute(1),
    __metadata("design:type", Object)
], PhongMaterialBehavior.prototype, "bumpScale", void 0);
__decorate([
    stringAttribute(''),
    __metadata("design:type", Object)
], PhongMaterialBehavior.prototype, "displacementMap", void 0);
__decorate([
    numberAttribute(1),
    __metadata("design:type", Object)
], PhongMaterialBehavior.prototype, "displacementScale", void 0);
__decorate([
    numberAttribute(0),
    __metadata("design:type", Object)
], PhongMaterialBehavior.prototype, "displacementBias", void 0);
__decorate([
    stringAttribute(''),
    __metadata("design:type", Object)
], PhongMaterialBehavior.prototype, "emissiveMap", void 0);
__decorate([
    stringAttribute('black'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], PhongMaterialBehavior.prototype, "emissive", null);
__decorate([
    numberAttribute(1),
    __metadata("design:type", Object)
], PhongMaterialBehavior.prototype, "emissiveIntensity", void 0);
__decorate([
    stringAttribute(''),
    __metadata("design:type", Object)
], PhongMaterialBehavior.prototype, "envMap", void 0);
__decorate([
    booleanAttribute(false),
    __metadata("design:type", Object)
], PhongMaterialBehavior.prototype, "flatShading", void 0);
__decorate([
    stringAttribute(''),
    __metadata("design:type", Object)
], PhongMaterialBehavior.prototype, "lightMap", void 0);
__decorate([
    numberAttribute(1),
    __metadata("design:type", Object)
], PhongMaterialBehavior.prototype, "lightMapIntensity", void 0);
__decorate([
    stringAttribute(''),
    __metadata("design:type", Object)
], PhongMaterialBehavior.prototype, "texture", void 0);
__decorate([
    stringAttribute(''),
    __metadata("design:type", Object)
], PhongMaterialBehavior.prototype, "normalMap", void 0);
__decorate([
    numberAttribute(1),
    __metadata("design:type", Object)
], PhongMaterialBehavior.prototype, "normalScale", void 0);
__decorate([
    numberAttribute(1),
    __metadata("design:type", Object)
], PhongMaterialBehavior.prototype, "reflectivity", void 0);
__decorate([
    stringAttribute(''),
    __metadata("design:type", Object)
], PhongMaterialBehavior.prototype, "specularMap", void 0);
__decorate([
    stringAttribute('#111'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], PhongMaterialBehavior.prototype, "specular", null);
__decorate([
    numberAttribute(30),
    __metadata("design:type", Object)
], PhongMaterialBehavior.prototype, "shininess", void 0);
PhongMaterialBehavior = __decorate([
    reactive
], PhongMaterialBehavior);
export { PhongMaterialBehavior };
if (globalThis.window?.document && !elementBehaviors.has('phong-material'))
    elementBehaviors.define('phong-material', PhongMaterialBehavior);
//# sourceMappingURL=PhongMaterialBehavior.js.map