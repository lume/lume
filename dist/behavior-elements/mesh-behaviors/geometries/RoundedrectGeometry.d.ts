import { type ElementAttributes } from '@lume/element';
import { GeometryBehaviorEl } from './GeometryBehaviorEl.js';
import type { BufferGeometry } from 'three/src/core/BufferGeometry.js';
export type RoundedrectGeometryAttributes = 'cornerRadius' | 'thickness' | 'quadraticCorners';
/**
 * @class RoundedRectangleGeometry -
 *
 * Element: `<lume-roundedrect-geometry>`
 *
 * @extends GeometryBehaviorEl
 * @element lume-roundedrect-geometry
 */
export declare class RoundedrectGeometry extends GeometryBehaviorEl {
    cornerRadius: number;
    thickness: number;
    quadraticCorners: boolean;
    _createComponent(): BufferGeometry<import("three/src/core/BufferGeometry.js").NormalBufferAttributes>;
}
declare module 'solid-js' {
    namespace JSX {
        interface IntrinsicElements {
            'lume-roundedrect-geometry': ElementAttributes<RoundedrectGeometry, RoundedrectGeometryAttributes>;
        }
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'lume-roundedrect-geometry': RoundedrectGeometry;
    }
}
//# sourceMappingURL=RoundedrectGeometry.d.ts.map