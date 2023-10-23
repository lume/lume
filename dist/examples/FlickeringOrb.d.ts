import { Element3D, Element3DAttributes } from '../core/Element3D.js';
import type { PointLight } from '../lights/PointLight.js';
import type { Sphere } from '../meshes/Sphere.js';
export declare type FlickeringOrbAttributes = Element3DAttributes | 'color' | 'intensity' | 'shadowBias';
export declare class FlickeringOrb extends Element3D {
    color: string;
    intensity: number;
    shadowBias: number;
    light?: PointLight;
    sphere?: Sphere;
    template: () => any;
    connectedCallback(): void;
}
import type { ElementAttributes } from '@lume/element';
declare module '@lume/element' {
    namespace JSX {
        interface IntrinsicElements {
            'flickering-orb': ElementAttributes<FlickeringOrb, FlickeringOrbAttributes>;
        }
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'flickering-orb': FlickeringOrb;
    }
}
//# sourceMappingURL=FlickeringOrb.d.ts.map