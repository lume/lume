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
import { SphereGeometry } from 'three/src/geometries/SphereGeometry.js';
import { numberAttribute, reactive } from '../../attribute.js';
import { GeometryBehavior } from './GeometryBehavior.js';
let SphereGeometryBehavior = class SphereGeometryBehavior extends GeometryBehavior {
    horizontalSegments = 32;
    verticalSegments = 32;
    _createComponent() {
        return new SphereGeometry(this.element.calculatedSize.x / 2, this.horizontalSegments, this.verticalSegments);
    }
};
__decorate([
    numberAttribute(32),
    __metadata("design:type", Object)
], SphereGeometryBehavior.prototype, "horizontalSegments", void 0);
__decorate([
    numberAttribute(32),
    __metadata("design:type", Object)
], SphereGeometryBehavior.prototype, "verticalSegments", void 0);
SphereGeometryBehavior = __decorate([
    reactive
], SphereGeometryBehavior);
export { SphereGeometryBehavior };
if (globalThis.window?.document && !elementBehaviors.has('sphere-geometry'))
    elementBehaviors.define('sphere-geometry', SphereGeometryBehavior);
//# sourceMappingURL=SphereGeometryBehavior.js.map