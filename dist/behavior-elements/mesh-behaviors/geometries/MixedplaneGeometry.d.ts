import { BoxGeometry } from 'three/src/geometries/BoxGeometry.js';
import { type ElementAttributes } from '@lume/element';
import { GeometryBehaviorEl } from './GeometryBehaviorEl.js';
export type MixedplaneGeometryAttributes = never;
/**
 * @class MixedPlaneGeometryBehavior -
 *
 * Element: `<lume-mixedplane-geometry>`
 *
 * Used as the geometry for [`<lume-mixed-plane>`](../../../meshes/MixedPlane)
 * elements. The planes are thin boxes instead of actually planes, otherwise
 * Three.js cannot currently cast shadows from plane geometries.
 *
 * <live-code src="../../../../../examples/buttons-with-shadow/example.html"></live-code>
 *
 * @extends GeometryBehaviorEl
 * @element lume-mixedplane-geometry
 */
export declare class MixedplaneGeometry extends GeometryBehaviorEl {
    _createComponent(): BoxGeometry;
}
declare module 'solid-js' {
    namespace JSX {
        interface IntrinsicElements {
            'lume-mixedplane-geometry': ElementAttributes<MixedplaneGeometry, MixedplaneGeometryAttributes>;
        }
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'lume-mixedplane-geometry': MixedplaneGeometry;
    }
}
//# sourceMappingURL=MixedplaneGeometry.d.ts.map