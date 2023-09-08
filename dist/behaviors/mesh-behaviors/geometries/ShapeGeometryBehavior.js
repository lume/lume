var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { attribute, booleanAttribute, numberAttribute, reactive, stringAttribute } from '../../attribute.js';
import 'element-behaviors';
import { ExtrudeGeometry } from 'three/src/geometries/ExtrudeGeometry.js';
import { Shape } from 'three/src/extras/core/Shape.js';
import { ShapeGeometry } from 'three/src/geometries/ShapeGeometry.js';
import { GeometryBehavior } from './GeometryBehavior.js';
import { stringToNumberArray } from '../../../meshes/utils.js';
import { handleInvertedGeometry } from './utils/handleInvertedGeometry.js';
import { parseSvgPathDAttribute } from './utils/svg.js';
const defaultShape = new Shape();
defaultShape.moveTo(5, 5);
defaultShape.bezierCurveTo(5, 5, 4, 0, 0, 0);
defaultShape.bezierCurveTo(-6, 0, -6, 7, -6, 7);
defaultShape.bezierCurveTo(-6, 11, -3, 15.4, 5, 19);
defaultShape.bezierCurveTo(12, 15.4, 16, 11, 16, 7);
defaultShape.bezierCurveTo(16, 7, 16, 0, 10, 0);
defaultShape.bezierCurveTo(7, 0, 5, 5, 5, 5);
const emptyShape = new Shape();
const isPathStringRe = /^[mlhvcsqtaz][^a-z]/i;
let ShapeGeometryBehavior = class ShapeGeometryBehavior extends GeometryBehavior {
    __shape = new Shape().copy(defaultShape);
    get shape() {
        return this.__shape;
    }
    set shape(shape) {
        if (!shape) {
            this.__shape.copy(defaultShape);
        }
        else if (typeof shape === 'string' &&
            (shape = shape.trim()) &&
            shape.match(isPathStringRe)) {
            const shapePath = parseSvgPathDAttribute(shape);
            this.__shape.copy(shapePath.toShapes(true)[0] ?? defaultShape);
        }
        else if (typeof shape === 'string' && !shape.match(/^-?[0-9]/)) {
            console.error('Unsupported shape path: ', shape);
            this.__shape.copy(defaultShape);
        }
        else if (typeof shape === 'string' || Array.isArray(shape)) {
            const points = typeof shape === 'string' ? stringToNumberArray(shape, 'shape') : shape;
            if (!points.length) {
                this.__shape.copy(defaultShape);
            }
            else {
                if (points.length % 2 !== 0)
                    throw new Error('shape path must have an even number of numbers, each pair of numbers being a point.');
                this.__shape.copy(emptyShape);
                this.__shape.moveTo(points[0], points[1]);
                if (points.length > 2)
                    for (let i = 2; i < points.length; i += 2)
                        this.__shape.lineTo(points[i], points[i + 1]);
            }
        }
        else {
            if (this.__shape !== shape) {
                this.__shape.copy(shape);
            }
        }
        this.__shape.updateArcLengths();
    }
    curveSegments = 8;
    bevel = false;
    bevelSegments = 4;
    bevelThickness = 4;
    centerGeometry = true;
    fitment = 'none';
    _createComponent() {
        let geometry;
        if (this.element.calculatedSize.z === 0) {
            geometry = new ShapeGeometry(this.shape, this.curveSegments);
        }
        else {
            geometry = new ExtrudeGeometry(this.shape, {
                curveSegments: this.curveSegments,
                bevelSegments: this.bevelSegments,
                bevelThickness: this.bevelThickness,
                bevelEnabled: this.bevel,
                depth: this.element.calculatedSize.z,
            });
        }
        if (this.centerGeometry)
            geometry.center();
        geometry.scale(1, -1, 1);
        handleInvertedGeometry(geometry);
        if (this.fitment === 'none')
            return geometry;
        let minX = Number.MAX_VALUE;
        let maxX = -Number.MAX_VALUE;
        let minY = Number.MAX_VALUE;
        let maxY = -Number.MAX_VALUE;
        const verts = geometry.attributes.position.array;
        const stride = 3;
        for (let i = 0, l = verts.length / stride; i < l; i++) {
            const x = verts[i * stride + 0];
            const y = verts[i * stride + 1];
            if (x < minX)
                minX = x;
            if (x > maxX)
                maxX = x;
            if (y < minY)
                minY = y;
            if (y > maxY)
                maxY = y;
        }
        const shapeSizeX = maxX - minX;
        const shapeSizeY = maxY - minY;
        const scaleX = shapeSizeX / this.element.calculatedSize.x;
        const scaleY = shapeSizeY / this.element.calculatedSize.y;
        if (this.fitment === 'fill')
            return geometry.scale(1 / scaleX, 1 / scaleY, 1);
        const shapeAspect = shapeSizeX / shapeSizeY;
        const sizeAspect = this.element.calculatedSize.x / this.element.calculatedSize.y;
        if (this.fitment === 'contain') {
            if (shapeAspect < sizeAspect)
                geometry.scale(1 / scaleY, 1 / scaleY, 1);
            else
                geometry.scale(1 / scaleX, 1 / scaleX, 1);
        }
        else if (this.fitment === 'cover') {
            if (shapeAspect < sizeAspect)
                geometry.scale(1 / scaleX, 1 / scaleX, 1);
            else
                geometry.scale(1 / scaleY, 1 / scaleY, 1);
        }
        else if (this.fitment === 'scale-down') {
            if (!(shapeSizeX <= this.element.calculatedSize.x && shapeSizeY <= this.element.calculatedSize.y)) {
                if (shapeAspect < sizeAspect)
                    geometry.scale(1 / scaleY, 1 / scaleY, 1);
                else
                    geometry.scale(1 / scaleX, 1 / scaleX, 1);
            }
        }
        return geometry;
    }
};
__decorate([
    attribute,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], ShapeGeometryBehavior.prototype, "shape", null);
__decorate([
    numberAttribute(8),
    __metadata("design:type", Object)
], ShapeGeometryBehavior.prototype, "curveSegments", void 0);
__decorate([
    booleanAttribute(false),
    __metadata("design:type", Object)
], ShapeGeometryBehavior.prototype, "bevel", void 0);
__decorate([
    numberAttribute(4),
    __metadata("design:type", Object)
], ShapeGeometryBehavior.prototype, "bevelSegments", void 0);
__decorate([
    numberAttribute(4),
    __metadata("design:type", Object)
], ShapeGeometryBehavior.prototype, "bevelThickness", void 0);
__decorate([
    booleanAttribute(true),
    __metadata("design:type", Object)
], ShapeGeometryBehavior.prototype, "centerGeometry", void 0);
__decorate([
    stringAttribute('none'),
    __metadata("design:type", String)
], ShapeGeometryBehavior.prototype, "fitment", void 0);
ShapeGeometryBehavior = __decorate([
    reactive
], ShapeGeometryBehavior);
export { ShapeGeometryBehavior };
if (globalThis.window?.document && !elementBehaviors.has('shape-geometry'))
    elementBehaviors.define('shape-geometry', ShapeGeometryBehavior);
//# sourceMappingURL=ShapeGeometryBehavior.js.map