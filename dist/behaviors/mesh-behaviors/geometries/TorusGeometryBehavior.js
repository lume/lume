var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import 'element-behaviors';
import { numberAttribute, reactive } from '../../attribute.js';
import { TorusGeometry } from 'three/src/geometries/TorusGeometry.js';
import { GeometryBehavior } from './GeometryBehavior.js';
import { toRadians } from '../../../core/utils/index.js';
let TorusGeometryBehavior = class TorusGeometryBehavior extends GeometryBehavior {
    tubeThickness = 0.1;
    radialSegments = 16;
    tubularSegments = 32;
    arc = 360;
    _createComponent() {
        const outerDiameter = this.element.calculatedSize.x;
        const outerRadius = outerDiameter / 2;
        const { tubeThickness, radialSegments, tubularSegments, arc } = this;
        const literalThickness = tubeThickness * outerDiameter;
        const radius = outerRadius - literalThickness / 2;
        return new TorusGeometry(radius, literalThickness, radialSegments, tubularSegments, toRadians(arc));
    }
};
__decorate([
    numberAttribute(0.1)
], TorusGeometryBehavior.prototype, "tubeThickness", void 0);
__decorate([
    numberAttribute(16)
], TorusGeometryBehavior.prototype, "radialSegments", void 0);
__decorate([
    numberAttribute(32)
], TorusGeometryBehavior.prototype, "tubularSegments", void 0);
__decorate([
    numberAttribute(360)
], TorusGeometryBehavior.prototype, "arc", void 0);
TorusGeometryBehavior = __decorate([
    reactive
], TorusGeometryBehavior);
export { TorusGeometryBehavior };
if (globalThis.window?.document && !elementBehaviors.has('torus-geometry'))
    elementBehaviors.define('torus-geometry', TorusGeometryBehavior);
//# sourceMappingURL=TorusGeometryBehavior.js.map