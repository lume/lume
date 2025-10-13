import { GeometryBehavior } from './GeometryBehavior.js';
import type { BufferGeometry } from 'three/src/core/BufferGeometry.js';
export type RoundedRectangleGeometryBehaviorAttributes = 'cornerRadius' | 'thickness' | 'quadraticCorners';
/**
 * @class RoundedRectangleGeometryBehavior -
 *
 * Element: `rounded-rectangle-geometry`
 *
 * @extends GeometryBehavior
 * @element rounded-rectangle-geometry
 */
export declare class RoundedRectangleGeometryBehavior extends GeometryBehavior {
    #private;
    cornerRadius: number;
    thickness: number;
    get quadraticCorners(): boolean;
    set quadraticCorners(val: boolean);
    _createComponent(): BufferGeometry<import("three/src/core/BufferGeometry.js").NormalBufferAttributes>;
}
//# sourceMappingURL=RoundedRectangleGeometryBehavior.d.ts.map