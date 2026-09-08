import { Element3D } from '../core/Element3D.js';
import type { TColor } from '../utils/three.js';
import type { Element3DAttributes } from '../core/Element3D.js';
export type LightAttributes = Element3DAttributes | 'color' | 'intensity';
declare const Light_base: {
    new (...a: any[]): {
        color: TColor;
        colorEffect(): void;
    };
} & typeof Element3D;
/**
 * @abstract
 * @class Light -
 *
 * `abstract`
 *
 * An abstract base class for light elements. This class has properties common
 * to all types of light.
 *
 * @extends Element3D
 */
export declare abstract class Light extends Light_base {
    /**
     * @property {string | number | THREE.Color | [number, number, number]} color -
     *
     * `attribute`
     *
     * Default: `"white"`
     *
     * The color of light that is emitted.
     *
     * See `Colorful.color` for detail on supported color values.
     */
    color: TColor;
    /**
     * @property {number} intensity -
     *
     * `abstract`
     *
     * Default: `1`
     *
     * The intensity of the light.
     *
     * When [physically correct lighting](../core/Scene#physicallycorrectlights)
     * is enabled, the units of intensity depend on the type of light (f.e.
     * [`PointLight`](./PointLight) or [`SpotLight`](./SpotLight)).
     */
    intensity: number;
    makeThreeObject3d(): any;
    intensityEffect(): void;
    private __init_effects_ignore;
}
export {};
//# sourceMappingURL=Light.d.ts.map