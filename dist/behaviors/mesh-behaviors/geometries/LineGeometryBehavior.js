var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { attribute, booleanAttribute, reactive, stringAttribute } from '../../attribute.js';
import 'element-behaviors';
import { BufferGeometry } from 'three/src/core/BufferGeometry.js';
import { GeometryBehavior } from './GeometryBehavior.js';
import { stringToNumberArray } from '../../../meshes/utils.js';
import { Float32BufferAttribute } from 'three/src/core/BufferAttribute.js';
let LineGeometryBehavior = class LineGeometryBehavior extends GeometryBehavior {
    __points = [];
    get points() {
        return this.__points;
    }
    set points(points) {
        if (!points) {
            this.__points.length = 0;
        }
        else if (typeof points === 'string' || Array.isArray(points)) {
            const _points = typeof points === 'string' ? stringToNumberArray(points, 'points') : points;
            if (!_points.length) {
                this.__points.length = 0;
            }
            else {
                if (_points.length % 3 !== 0)
                    throw new Error('The points array needs to have 3 numbers per point.');
                if (this.__points.length !== _points.length)
                    this.__points.length = _points.length;
                for (let i = 0, l = _points.length; i < l; i += 1)
                    this.__points[i] = _points[i];
            }
        }
    }
    centerGeometry = false;
    fitment = 'none';
    _createComponent() {
        const geometry = new BufferGeometry();
        const positions = new Float32BufferAttribute(this.points, 3);
        positions.needsUpdate = true;
        geometry.attributes['position'] = positions;
        if (this.centerGeometry)
            geometry.center();
        geometry.scale(1, -1, 1);
        if (this.fitment === 'none')
            return geometry;
        return geometry;
    }
};
__decorate([
    attribute,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], LineGeometryBehavior.prototype, "points", null);
__decorate([
    booleanAttribute(false),
    __metadata("design:type", Object)
], LineGeometryBehavior.prototype, "centerGeometry", void 0);
__decorate([
    stringAttribute('none'),
    __metadata("design:type", String)
], LineGeometryBehavior.prototype, "fitment", void 0);
LineGeometryBehavior = __decorate([
    reactive
], LineGeometryBehavior);
export { LineGeometryBehavior };
if (globalThis.window?.document && !elementBehaviors.has('line-geometry'))
    elementBehaviors.define('line-geometry', LineGeometryBehavior);
//# sourceMappingURL=LineGeometryBehavior.js.map