import { Light, type LightAttributes } from './Light.js';
export type LightWithShadowAttributes = LightAttributes | 'castShadow' | 'shadowMapWidth' | 'shadowMapHeight' | 'shadowRadius' | 'shadowBias' | 'shadowNormalBias' | 'shadowCameraNear' | 'shadowCameraFar';
export declare abstract class LightWithShadow extends Light {
    castShadow: boolean;
    shadowMapWidth: number;
    shadowMapHeight: number;
    shadowRadius: number;
    shadowBias: number;
    shadowNormalBias: number;
    shadowCameraNear: number;
    shadowCameraFar: number;
    _loadGL(): boolean;
}
//# sourceMappingURL=LightWithShadow.d.ts.map