import 'element-behaviors';
import { BoxGeometry } from 'three/src/geometries/BoxGeometry.js';
import { GeometryBehavior } from './GeometryBehavior.js';
/**
 * @class MixedPlaneGeometryBehavior -
 *
 * Used as the geometry for [`<lume-mixed-plane>`](../../../meshes/MixedPlane)
 * elements. The planes are thin boxes instead of actually planes, otherwise
 * Three.js cannot currently cast shadows from plane geometries.
 *
 * <live-code src="../../../../../examples/buttons-with-shadow/example.html"></live-code>
 *
 * @extends GeometryBehavior
 * @deprecated Legacy behavior via `has=""` attribute is deprecated. Use `<lume-mixed-plane-geometry>` child elements instead. Legacy behaviors will be removed in a future version.
 */
export declare class MixedPlaneGeometryBehavior extends GeometryBehavior {
    _createComponent(): BoxGeometry;
}
//# sourceMappingURL=MixedPlaneGeometryBehavior.d.ts.map