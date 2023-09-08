var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { booleanAttribute, numberAttribute, reactive, stringAttribute } from '../../attribute.js';
import 'element-behaviors';
import { PointsMaterial } from 'three/src/materials/PointsMaterial.js';
import { MaterialBehavior } from './MaterialBehavior.js';
let PointsMaterialBehavior = class PointsMaterialBehavior extends MaterialBehavior {
    texture = '';
    sizeAttenuation = true;
    pointSize = 1;
    _createComponent() {
        return new PointsMaterial({ color: 0x00ff00 });
    }
    loadGL() {
        super.loadGL();
        this.createEffect(() => {
            const mat = this.meshComponent;
            if (!mat)
                return;
            mat.sizeAttenuation = this.sizeAttenuation;
            mat.size = this.pointSize;
            this.element.needsUpdate();
        });
        this._handleTexture(() => this.texture, (mat, tex) => (mat.map = tex), mat => !!mat.map);
    }
};
__decorate([
    stringAttribute(''),
    __metadata("design:type", Object)
], PointsMaterialBehavior.prototype, "texture", void 0);
__decorate([
    booleanAttribute(true),
    __metadata("design:type", Object)
], PointsMaterialBehavior.prototype, "sizeAttenuation", void 0);
__decorate([
    numberAttribute(1),
    __metadata("design:type", Object)
], PointsMaterialBehavior.prototype, "pointSize", void 0);
PointsMaterialBehavior = __decorate([
    reactive
], PointsMaterialBehavior);
export { PointsMaterialBehavior };
if (globalThis.window?.document && !elementBehaviors.has('points-material'))
    elementBehaviors.define('points-material', PointsMaterialBehavior);
//# sourceMappingURL=PointsMaterialBehavior.js.map