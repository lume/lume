import { Element3D } from '../core/Element3D.js';
import type { TColor } from '../utils/three.js';
import type { Element3DAttributes } from '../core/Element3D.js';
export declare type LightAttributes = Element3DAttributes | 'color' | 'intensity';
export declare abstract class Light extends Element3D {
    color: TColor;
    intensity: number;
    makeThreeObject3d(): any;
    _loadGL(): boolean;
}
//# sourceMappingURL=Light.d.ts.map