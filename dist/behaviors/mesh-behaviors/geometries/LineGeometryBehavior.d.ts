import 'element-behaviors';
import { BufferGeometry } from 'three/src/core/BufferGeometry.js';
import { GeometryBehavior } from './GeometryBehavior.js';
export declare type LineGeometryBehaviorAttributes = 'points' | 'centerGeometry' | 'fitment';
export declare class LineGeometryBehavior extends GeometryBehavior {
    __points: number[];
    get points(): number[];
    set points(points: string | number[] | null);
    centerGeometry: boolean;
    fitment: 'none' | 'contain' | 'cover' | 'fill' | 'scale-down';
    _createComponent(): BufferGeometry<import("three/src/core/BufferGeometry.js").NormalBufferAttributes>;
}
//# sourceMappingURL=LineGeometryBehavior.d.ts.map