import 'element-behaviors';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js';
import { BufferGeometry } from 'three/src/core/BufferGeometry.js';
import { GeometryBehavior } from './GeometryBehavior.js';
/**
 * @class PlyGeometryBehavior -
 *
 * Behavior: `ply-geometry`
 *
 * This is useful for rendering a set of points from a `.ply` file.
 *
 * Given a `src` attribute that points to a `.ply` file, the behavior will load
 * a set of points from the file to use as geometry.
 *
 * It can be useful to use this behavior on a
 * [`<lume-points>`](../../../meshes/Points) element, which has a
 * [`points-material`](../materials/PointsMaterialBehavior) behavior for
 * configuring how points are rendered.
 *
 * @extends GeometryBehavior
 */
export declare class PlyGeometryBehavior extends GeometryBehavior {
    #private;
    /**
     * @property {string} src
     *
     * `string` `attribute`
     *
     * Default: `''`
     *
     * Path to a `.ply` file to load points from.
     */
    src: string;
    loader: PLYLoader | null;
    model: BufferGeometry | null;
    _createComponent(): BufferGeometry<import("three/src/core/BufferGeometry.js").NormalBufferAttributes>;
    loadGL(): void;
    unloadGL(): void;
}
//# sourceMappingURL=PlyGeometryBehavior.d.ts.map