import 'element-behaviors';
import { GeometryBehavior } from './GeometryBehavior.js';
import type { BufferGeometry } from 'three/src/core/BufferGeometry.js';
export declare type RoundedRectangleGeometryBehaviorAttributes = 'cornerRadius' | 'thickness' | 'quadraticCorners';
export declare class RoundedRectangleGeometryBehavior extends GeometryBehavior {
    #private;
    cornerRadius: number;
    thickness: number;
    get quadraticCorners(): boolean;
    set quadraticCorners(val: boolean);
    _createComponent(): BufferGeometry<import("three/src/core/BufferGeometry.js").NormalBufferAttributes>;
}
//# sourceMappingURL=RoundedRectangleGeometryBehavior.d.ts.map