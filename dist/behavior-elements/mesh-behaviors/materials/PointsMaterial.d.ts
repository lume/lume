import { type ElementAttributes } from '@lume/element';
import { PointsMaterial as ThreePointsMaterial } from 'three/src/materials/PointsMaterial.js';
import { MaterialBehaviorEl, type MaterialBehaviorElAttributes } from './MaterialBehaviorEl.js';
export type PointsMaterialAttributes = MaterialBehaviorElAttributes | 'texture' | 'sizeAttenuation' | 'pointSize';
/**
 * @class PointsMaterial -
 *
 * Element: `<lume-points-material>`
 *
 * @extends MaterialBehaviorEl
 * @element lume-points-material
 */
export declare class PointsMaterial extends MaterialBehaviorEl {
    /**
     * @property {string} texture - The URL of a color texture to use for the
     * points.  Defaults to an empty string, which means no texture.
     */
    texture: string;
    /**
     * @property {boolean} sizeAttenuation - Whether the size of the points is
     * attenuated by the camera depth (i.e. whether the points have a size in 3D
     * space, rather than in screen pixels). Defaults to `false`.
     */
    sizeAttenuation: boolean;
    /**
     * @property {number} pointSize - The size of the points. Defaults to `1`
     * CSS pixel.
     */
    pointSize: number;
    _createComponent(): ThreePointsMaterial;
    protected _parentDefinedEffect(parent?: NonNullable<this['composedParent']>): void;
}
declare module 'solid-js' {
    namespace JSX {
        interface IntrinsicElements {
            'lume-points-material': ElementAttributes<PointsMaterial, PointsMaterialAttributes>;
        }
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'lume-points-material': PointsMaterial;
    }
}
//# sourceMappingURL=PointsMaterial.d.ts.map