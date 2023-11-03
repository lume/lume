import 'element-behaviors';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js';
import { BufferGeometry } from 'three/src/core/BufferGeometry.js';
import { Points } from '../../../meshes/Points.js';
import { GeometryBehavior } from './GeometryBehavior.js';
export declare class PlyGeometryBehavior extends GeometryBehavior {
    #private;
    src: string;
    loader: PLYLoader | null;
    model: BufferGeometry | null;
    requiredElementType(): [typeof Points];
    _createComponent(): BufferGeometry<import("three/src/core/BufferGeometry.js").NormalBufferAttributes>;
    loadGL(): void;
    unloadGL(): void;
}
//# sourceMappingURL=PlyGeometryBehavior.d.ts.map