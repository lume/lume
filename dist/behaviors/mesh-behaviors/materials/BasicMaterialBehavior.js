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
import { stringAttribute, reactive } from '../../attribute.js';
import { MeshBasicMaterial } from 'three/src/materials/MeshBasicMaterial.js';
import { MaterialBehavior } from './MaterialBehavior.js';
let BasicMaterialBehavior = class BasicMaterialBehavior extends MaterialBehavior {
    texture = '';
    specularMap = '';
    _createComponent() {
        return new MeshBasicMaterial();
    }
    loadGL() {
        super.loadGL();
        this._handleTexture(() => this.texture, (mat, tex) => (mat.map = tex), mat => !!mat.map, () => { }, true);
        this._handleTexture(() => this.specularMap, (mat, tex) => (mat.specularMap = tex), mat => !!mat.specularMap, () => { }, true);
    }
};
__decorate([
    stringAttribute(''),
    __metadata("design:type", Object)
], BasicMaterialBehavior.prototype, "texture", void 0);
__decorate([
    stringAttribute(''),
    __metadata("design:type", Object)
], BasicMaterialBehavior.prototype, "specularMap", void 0);
BasicMaterialBehavior = __decorate([
    reactive
], BasicMaterialBehavior);
export { BasicMaterialBehavior };
if (globalThis.window?.document && !elementBehaviors.has('basic-material'))
    elementBehaviors.define('basic-material', BasicMaterialBehavior);
//# sourceMappingURL=BasicMaterialBehavior.js.map