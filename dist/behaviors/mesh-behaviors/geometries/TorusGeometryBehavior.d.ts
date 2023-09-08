import 'element-behaviors';
import { TorusGeometry } from 'three/src/geometries/TorusGeometry.js';
import { GeometryBehavior } from './GeometryBehavior.js';
export declare type TorusGeometryBehaviorAttributes = 'tubeThickness' | 'radialSegments' | 'tubularSegments' | 'arc';
export declare class TorusGeometryBehavior extends GeometryBehavior {
    tubeThickness: number;
    radialSegments: number;
    tubularSegments: number;
    arc: number;
    _createComponent(): TorusGeometry;
}
//# sourceMappingURL=TorusGeometryBehavior.d.ts.map