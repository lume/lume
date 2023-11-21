import { Element3D, type Element3DAttributes } from '../core/Element3D.js';
import type { PointLight } from '../lights/PointLight.js';
import type { Sphere } from '../meshes/Sphere.js';
export type FlickeringOrbAttributes = Element3DAttributes | 'color' | 'intensity' | 'shadowBias' | 'flickerRange' | 'shadowMapWidth' | 'shadowMapHeight';
export declare class FlickeringOrb extends Element3D {
    color: string;
    intensity: number;
    shadowBias: number;
    flickerRange: number;
    shadowMapWidth: number;
    shadowMapHeight: number;
    light?: PointLight;
    sphere?: Sphere;
    template: () => Node | Node[];
    connectedCallback(): void;
}
import type { ElementAttributes } from '@lume/element';
declare module 'solid-js' {
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