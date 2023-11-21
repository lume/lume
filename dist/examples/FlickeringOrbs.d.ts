import { Element3D, type Element3DAttributes } from '../core/Element3D.js';
export type FlickeringOrbsAttributes = Element3DAttributes | 'shadowBias' | 'intensity';
export declare class FlickeringOrbs extends Element3D {
    shadowBias: number;
    intensity: number;
    flickerRange: number;
    color: string | null;
    template: () => Node | Node[];
}
import type { ElementAttributes } from '@lume/element';
declare module 'solid-js' {
    namespace JSX {
        interface IntrinsicElements {
            'flickering-orbs': ElementAttributes<FlickeringOrbs, FlickeringOrbsAttributes>;
        }
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'flickering-orbs': FlickeringOrbs;
    }
}
//# sourceMappingURL=FlickeringOrbs.d.ts.map