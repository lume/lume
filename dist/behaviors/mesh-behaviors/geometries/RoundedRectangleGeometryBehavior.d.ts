import 'element-behaviors';
import { GeometryBehavior } from './GeometryBehavior.js';
import type { BufferGeometry } from 'three/src/core/BufferGeometry.js';
export type RoundedRectangleGeometryBehaviorAttributes = 'cornerRadius' | 'thickness' | 'quadraticCorners';
/**
 * @deprecated Legacy behavior via `has=""` attribute is deprecated. Use `<lume-roundedrect-geometry>` child elements instead. Legacy behaviors will be removed in a future version.
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