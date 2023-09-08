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
import { reactive, attribute } from '../../attribute.js';
import { Shape } from 'three/src/extras/core/Shape.js';
import { ExtrudeGeometry } from 'three/src/geometries/ExtrudeGeometry.js';
import { ShapeGeometry } from 'three/src/geometries/ShapeGeometry.js';
import { GeometryBehavior } from './GeometryBehavior.js';
let RoundedRectangleGeometryBehavior = class RoundedRectangleGeometryBehavior extends GeometryBehavior {
    cornerRadius = 0;
    thickness = 0;
    #quadraticCorners = false;
    get quadraticCorners() {
        return this.#quadraticCorners;
    }
    set quadraticCorners(val) {
        if (val === null || val === 'false')
            this.#quadraticCorners = false;
        else
            this.#quadraticCorners = true;
    }
    _createComponent() {
        let thickness = this.thickness;
        let geom;
        const roundedRectShape = new RoundedRectShape(0, 0, this.element.calculatedSize.x, this.element.calculatedSize.y, this.cornerRadius, this.quadraticCorners);
        if (thickness > 0) {
            geom = new ExtrudeGeometry(roundedRectShape, {
                bevelEnabled: true,
                steps: 1,
                bevelSegments: 1,
                bevelSize: 0,
                bevelThickness: 0,
                depth: thickness,
            });
        }
        else {
            geom = new ShapeGeometry(roundedRectShape);
        }
        geom.translate(-this.element.calculatedSize.x / 2, -this.element.calculatedSize.y / 2, -thickness / 2);
        return geom;
    }
};
__decorate([
    attribute({ from: Number }),
    __metadata("design:type", Object)
], RoundedRectangleGeometryBehavior.prototype, "cornerRadius", void 0);
__decorate([
    attribute({ from: Number }),
    __metadata("design:type", Object)
], RoundedRectangleGeometryBehavior.prototype, "thickness", void 0);
__decorate([
    attribute,
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [Boolean])
], RoundedRectangleGeometryBehavior.prototype, "quadraticCorners", null);
RoundedRectangleGeometryBehavior = __decorate([
    reactive
], RoundedRectangleGeometryBehavior);
export { RoundedRectangleGeometryBehavior };
if (globalThis.window?.document && !elementBehaviors.has('rounded-rectangle-geometry'))
    elementBehaviors.define('rounded-rectangle-geometry', RoundedRectangleGeometryBehavior);
class RoundedRectShape extends Shape {
    constructor(x, y, width, height, radius, quadraticCorners = false) {
        super();
        if (quadraticCorners) {
            this.moveTo(x, y + radius);
            this.lineTo(x, y + height - radius);
            this.quadraticCurveTo(x, y + height, x + radius, y + height);
            this.lineTo(x + width - radius, y + height);
            this.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
            this.lineTo(x + width, y + radius);
            this.quadraticCurveTo(x + width, y, x + width - radius, y);
            this.lineTo(x + radius, y);
            this.quadraticCurveTo(x, y, x, y + radius);
            return;
        }
        this.absarc(x + width - radius, y + radius, radius, -Math.PI / 2, 0, false);
        this.absarc(x + width - radius, y + height - radius, radius, 0, Math.PI / 2, false);
        this.absarc(x + radius, y + height - radius, radius, Math.PI / 2, Math.PI, false);
        this.absarc(x + radius, y + radius, radius, Math.PI, Math.PI + Math.PI / 2, false);
        this.lineTo(x + width - radius, y);
    }
}
//# sourceMappingURL=RoundedRectangleGeometryBehavior.js.map