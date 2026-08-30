import { BoxGeometry as ThreeBoxGeometry } from 'three/src/geometries/BoxGeometry.js';
import { type ElementAttributes } from '@lume/element';
import { GeometryBehaviorEl } from './GeometryBehaviorEl.js';
export type BoxGeometryAttributes = never;
/**
 * @class BoxGeometry -
 *
 * Element: `<lume-box-geometry>`
 *
 * @extends GeometryBehaviorEl
 * @element lume-box-geometry
 */
export declare class BoxGeometry extends GeometryBehaviorEl {
    _createComponent(): ThreeBoxGeometry;
}
declare module 'solid-js' {
    namespace JSX {
        interface IntrinsicElements {
            'lume-box-geometry': ElementAttributes<BoxGeometry, BoxGeometryAttributes>;
        }
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'lume-box-geometry': BoxGeometry;
    }
}
//# sourceMappingURL=BoxGeometry.d.ts.map