import { Element3D, Element3DAttributes } from '../core/Element3D.js';
export declare type FlickeringOrbsAttributes = Element3DAttributes | 'shadowBias';
export declare class FlickeringOrbs extends Element3D {
    shadowBias: number;
    template: () => any;
}
import type { ElementAttributes } from '@lume/element';
declare module '@lume/element' {
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