import { type ElementAttributes } from '@lume/element';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js';
import { BufferGeometry } from 'three/src/core/BufferGeometry.js';
import { GeometryBehaviorEl } from './GeometryBehaviorEl.js';
export type PlyGeometryAttributes = 'src';
/**
 * @class PlyGeometry -
 *
 * Element: `<lume-ply-geometry>`
 *
 * This is useful for rendering a set of points from a `.ply` file.
 *
 * Given a `src` attribute that points to a `.ply` file, the behavior will load
 * a set of points from the file to use as geometry.
 *
 * It can be useful to use this behavior on a
 * [`<lume-points>`](../../../meshes/Points) element, which has a
 * [`<lume-points-material>`](../materials/PointsMaterialBehavior) behavior for
 * configuring how points are rendered.
 *
 * @extends GeometryBehaviorEl
 * @element lume-ply-geometry
 */
export declare class PlyGeometry extends GeometryBehaviorEl {
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
    loader: PLYLoader;
    model: BufferGeometry | null;
    _createComponent(): BufferGeometry<import("three/src/core/BufferGeometry.js").NormalBufferAttributes>;
    protected _parentDefinedEffect(parent?: NonNullable<this['composedParent']>): void;
}
declare module 'solid-js' {
    namespace JSX {
        interface IntrinsicElements {
            'lume-ply-geometry': ElementAttributes<PlyGeometry, PlyGeometryAttributes>;
        }
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'lume-ply-geometry': PlyGeometry;
    }
}
//# sourceMappingURL=PlyGeometry.d.ts.map