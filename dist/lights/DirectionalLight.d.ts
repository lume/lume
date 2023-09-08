import { DirectionalLight as ThreeDirectionalLight } from 'three/src/lights/DirectionalLight.js';
import { LightWithShadow, LightWithShadowAttributes } from './LightWithShadow.js';
export declare type DirectionalLightAttributes = LightWithShadowAttributes | 'shadowCameraTop' | 'shadowCameraRight' | 'shadowCameraBottom' | 'shadowCameraLeft';
export declare class DirectionalLight extends LightWithShadow {
    constructor();
    shadowCameraTop: number;
    shadowCameraRight: number;
    shadowCameraBottom: number;
    shadowCameraLeft: number;
    _loadGL(): boolean;
    makeThreeObject3d(): ThreeDirectionalLight;
}
import type { ElementAttributes } from '@lume/element';
declare module '@lume/element' {
    namespace JSX {
        interface IntrinsicElements {
            'lume-directional-light': ElementAttributes<DirectionalLight, DirectionalLightAttributes>;
        }
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'lume-directional-light': DirectionalLight;
    }
}
//# sourceMappingURL=DirectionalLight.d.ts.map