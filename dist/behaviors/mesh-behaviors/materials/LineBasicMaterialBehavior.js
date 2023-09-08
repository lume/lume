var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { reactive, stringAttribute } from '../../attribute.js';
import 'element-behaviors';
import { LineBasicMaterial } from 'three/src/materials/LineBasicMaterial.js';
import { MaterialBehavior } from './MaterialBehavior.js';
let LineBasicMaterialBehavior = class LineBasicMaterialBehavior extends MaterialBehavior {
    texture = '';
    _createComponent() {
        return new LineBasicMaterial();
    }
    loadGL() {
        super.loadGL();
        this._handleTexture(() => this.texture, (mat, tex) => (mat.map = tex), mat => !!mat.map);
    }
};
__decorate([
    stringAttribute(''),
    __metadata("design:type", Object)
], LineBasicMaterialBehavior.prototype, "texture", void 0);
LineBasicMaterialBehavior = __decorate([
    reactive
], LineBasicMaterialBehavior);
export { LineBasicMaterialBehavior };
if (globalThis.window?.document && !elementBehaviors.has('line-material'))
    elementBehaviors.define('line-material', LineBasicMaterialBehavior);
//# sourceMappingURL=LineBasicMaterialBehavior.js.map