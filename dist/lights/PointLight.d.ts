import { PointLight as ThreePointLight } from 'three/src/lights/PointLight.js';
import { LightWithShadow, type LightWithShadowAttributes } from './LightWithShadow.js';
export type PointLightAttributes = LightWithShadowAttributes | 'distance' | 'decay';
export declare class PointLight extends LightWithShadow {
    shadowCameraFov: number;
    constructor();
    distance: number;
    decay: number;
    get power(): number;
    set power(power: number);
    _loadGL(): boolean;
    makeThreeObject3d(): ThreePointLight;
}
import type { ElementAttributes } from '@lume/element';
declare module '@lume/element' {
    namespace JSX {
        interface IntrinsicElements {
            'lume-point-light': ElementAttributes<PointLight, PointLightAttributes>;
        }
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'lume-point-light': PointLight;
    }
}
//# sourceMappingURL=PointLight.d.ts.map