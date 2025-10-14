import { BoxGeometry } from 'three/src/geometries/BoxGeometry.js';
import { GeometryBehavior } from './GeometryBehavior.js';
/**
 * @class MixedPlaneGeometryBehavior -
 *
 * Element: `mixedplane-geometry`
 *
 * Used as the geometry for [`<lume-mixed-plane>`](../../../meshes/MixedPlane)
 * elements. The planes are thin boxes instead of actually planes, otherwise
 * Three.js cannot currently cast shadows from plane geometries.
 *
 * <live-code src="../../../../../examples/buttons-with-shadow/example.html"></live-code>
 *
 * @extends GeometryBehavior
 * @element mixedplane-geometry
 */
export declare class MixedPlaneGeometryBehavior extends GeometryBehavior {
    _createComponent(): BoxGeometry;
}
//# sourceMappingURL=MixedPlaneGeometryBehavior.d.ts.map