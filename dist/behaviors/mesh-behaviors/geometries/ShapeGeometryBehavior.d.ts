import 'element-behaviors';
import { ExtrudeGeometry } from 'three/src/geometries/ExtrudeGeometry.js';
import { Shape } from 'three/src/extras/core/Shape.js';
import { ShapeGeometry } from 'three/src/geometries/ShapeGeometry.js';
import { GeometryBehavior } from './GeometryBehavior.js';
export type ShapeGeometryBehaviorAttributes = 'shape' | 'curveSegments' | 'bevel' | 'bevelSegments' | 'bevelThickness' | 'centerGeometry' | 'fitment';
export declare class ShapeGeometryBehavior extends GeometryBehavior {
    __shape: Shape;
    get shape(): Shape;
    set shape(shape: string | number[] | Shape | null);
    curveSegments: number;
    bevel: boolean;
    bevelSegments: number;
    bevelThickness: number;
    centerGeometry: boolean;
    fitment: 'none' | 'contain' | 'cover' | 'fill' | 'scale-down';
    _createComponent(): ExtrudeGeometry | ShapeGeometry;
}
//# sourceMappingURL=ShapeGeometryBehavior.d.ts.map