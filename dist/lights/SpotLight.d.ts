import { SpotLight as ThreeSpotLight } from 'three/src/lights/SpotLight.js';
import { PointLight, type PointLightAttributes } from './PointLight.js';
import { Element3D } from '../core/index.js';
export type SpotLightAttributes = PointLightAttributes;
export declare class SpotLight extends PointLight {
    #private;
    angle: number;
    penumbra: number;
    get target(): Element3D | null;
    set target(value: string | Element3D | null | Array<Element3D | string>);
    debug: boolean;
    updateWorldMatrices(traverse?: boolean): void;
    _loadGL(): boolean;
    _unloadGL(): boolean;
    makeThreeObject3d(): ThreeSpotLight;
}
import type { ElementAttributes } from '@lume/element';
declare module '@lume/element' {
    namespace JSX {
        interface IntrinsicElements {
            'lume-spot-light': ElementAttributes<SpotLight, SpotLightAttributes>;
        }
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'lume-spot-light': SpotLight;
    }
}
//# sourceMappingURL=SpotLight.d.ts.map