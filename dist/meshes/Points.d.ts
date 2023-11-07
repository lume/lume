import { Points as ThreePoints } from 'three/src/objects/Points.js';
import { Element3D } from '../core/Element3D.js';
import type { Element3DAttributes } from '../core/Element3D.js';
export type PointsAttributes = Element3DAttributes;
export declare class Points extends Element3D {
    static defaultBehaviors: {
        [k: string]: any;
    };
    makeThreeObject3d(): ThreePoints<import("three").BufferGeometry<import("three").NormalBufferAttributes>, import("three").Material | import("three").Material[]>;
}
import type { ElementAttributes } from '@lume/element';
import type { ElementWithBehaviors, LambertMaterialBehavior, LambertMaterialBehaviorAttributes, PhongMaterialBehavior, PhongMaterialBehaviorAttributes, PointsMaterialBehavior, PointsMaterialBehaviorAttributes } from '../index.js';
export interface Points extends ElementWithBehaviors<PointsMaterialBehavior & PhongMaterialBehavior & LambertMaterialBehavior, PointsMaterialBehaviorAttributes | PhongMaterialBehaviorAttributes | LambertMaterialBehaviorAttributes> {
}
declare module '@lume/element' {
    namespace JSX {
        interface IntrinsicElements {
            'lume-points': ElementAttributes<Points & PointsMaterialBehavior & PhongMaterialBehavior & LambertMaterialBehavior, PointsAttributes | PointsMaterialBehaviorAttributes | PhongMaterialBehaviorAttributes | LambertMaterialBehaviorAttributes>;
        }
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'lume-points': Points;
    }
}
//# sourceMappingURL=Points.d.ts.map