var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { stringAttribute, reactive } from '../../attribute.js';
import 'element-behaviors';
import { MeshLambertMaterial } from 'three/src/materials/MeshLambertMaterial.js';
import { MaterialBehavior } from './MaterialBehavior.js';
let LambertMaterialBehavior = class LambertMaterialBehavior extends MaterialBehavior {
    texture = '';
    specularMap = '';
    _createComponent() {
        return new MeshLambertMaterial({ color: 0x00ff00 });
    }
    loadGL() {
        super.loadGL();
        this._handleTexture(() => this.texture, (mat, tex) => (mat.map = tex), mat => !!mat.map, () => { }, true);
        this._handleTexture(() => this.specularMap, (mat, tex) => (mat.specularMap = tex), mat => !!mat.specularMap, () => { }, true);
    }
};
__decorate([
    stringAttribute('')
], LambertMaterialBehavior.prototype, "texture", void 0);
__decorate([
    stringAttribute('')
], LambertMaterialBehavior.prototype, "specularMap", void 0);
LambertMaterialBehavior = __decorate([
    reactive
], LambertMaterialBehavior);
export { LambertMaterialBehavior };
if (globalThis.window?.document && !elementBehaviors.has('lambert-material'))
    elementBehaviors.define('lambert-material', LambertMaterialBehavior);
//# sourceMappingURL=LambertMaterialBehavior.js.map