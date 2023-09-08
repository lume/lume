import { Line as ThreeLine } from 'three/src/objects/Line.js';
import { Element3D } from '../core/Element3D.js';
import type { Element3DAttributes } from '../core/Element3D.js';
export declare type LineAttributes = Element3DAttributes;
export declare class Line extends Element3D {
    static defaultBehaviors: {
        [k: string]: any;
    };
    makeThreeObject3d(): ThreeLine<import("three").BufferGeometry<import("three").NormalBufferAttributes>, import("three").Material | import("three").Material[]>;
}
import type { ElementAttributes } from '@lume/element';
import type { ElementWithBehaviors, PhongMaterialBehavior, PhongMaterialBehaviorAttributes, LambertMaterialBehavior, LambertMaterialBehaviorAttributes, PhysicalMaterialBehavior, PhysicalMaterialBehaviorAttributes, StandardMaterialBehavior, StandardMaterialBehaviorAttributes, PointsMaterialBehavior, PointsMaterialBehaviorAttributes, ClipPlanesBehavior, ClipPlanesBehaviorAttributes } from '../index.js';
declare type BehaviorInstanceTypes = PhongMaterialBehavior & LambertMaterialBehavior & StandardMaterialBehavior & PhysicalMaterialBehavior & PointsMaterialBehavior & ClipPlanesBehavior;
declare type BehaviorAttributes = PhongMaterialBehaviorAttributes | LambertMaterialBehaviorAttributes | StandardMaterialBehaviorAttributes | PhysicalMaterialBehaviorAttributes | PointsMaterialBehaviorAttributes | ClipPlanesBehaviorAttributes;
export interface Line extends ElementWithBehaviors<BehaviorInstanceTypes, BehaviorAttributes> {
}
declare module '@lume/element' {
    namespace JSX {
        interface IntrinsicElements {
            'lume-line': ElementAttributes<Line & BehaviorInstanceTypes, LineAttributes | BehaviorAttributes>;
        }
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'lume-line': Line;
    }
}
export {};
//# sourceMappingURL=Line.d.ts.map