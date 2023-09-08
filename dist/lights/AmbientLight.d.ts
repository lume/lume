import { Light } from './Light.js';
import { AmbientLight as ThreeAmbientLight } from 'three/src/lights/AmbientLight.js';
import type { LightAttributes } from './Light.js';
export declare type AmbientLightAttributes = LightAttributes;
export declare class AmbientLight extends Light {
    constructor();
    makeThreeObject3d(): ThreeAmbientLight;
}
import type { ElementAttributes } from '@lume/element';
declare module '@lume/element' {
    namespace JSX {
        interface IntrinsicElements {
            'lume-ambient-light': ElementAttributes<AmbientLight, AmbientLightAttributes>;
        }
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'lume-ambient-light': AmbientLight;
    }
}
//# sourceMappingURL=AmbientLight.d.ts.map