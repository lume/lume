var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import 'element-behaviors';
import { PlaneGeometry } from 'three/src/geometries/PlaneGeometry.js';
import { numberAttribute, reactive } from '../../attribute.js';
import { GeometryBehavior } from './GeometryBehavior.js';
let PlaneGeometryBehavior = class PlaneGeometryBehavior extends GeometryBehavior {
    widthSegments = 1;
    heightSegments = 1;
    _createComponent() {
        return new PlaneGeometry(this.element.calculatedSize.x, this.element.calculatedSize.y, this.widthSegments, this.heightSegments);
    }
};
__decorate([
    numberAttribute(1)
], PlaneGeometryBehavior.prototype, "widthSegments", void 0);
__decorate([
    numberAttribute(1)
], PlaneGeometryBehavior.prototype, "heightSegments", void 0);
PlaneGeometryBehavior = __decorate([
    reactive
], PlaneGeometryBehavior);
export { PlaneGeometryBehavior };
if (globalThis.window?.document && !elementBehaviors.has('plane-geometry'))
    elementBehaviors.define('plane-geometry', PlaneGeometryBehavior);
//# sourceMappingURL=PlaneGeometryBehavior.js.map