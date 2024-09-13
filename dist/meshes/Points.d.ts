import { type ElementAttributes } from '@lume/element';
import { Points as ThreePoints } from 'three/src/objects/Points.js';
import { Element3D } from '../core/Element3D.js';
import type { Element3DAttributes } from '../core/Element3D.js';
import type { ElementWithBehaviors } from '../behaviors/ElementWithBehaviors.js';
import type { ClipPlanesBehavior, ClipPlanesBehaviorAttributes, LambertMaterialBehavior, LambertMaterialBehaviorAttributes, PhongMaterialBehavior, PhongMaterialBehaviorAttributes, PointsMaterialBehavior, PointsMaterialBehaviorAttributes } from '../behaviors/index.js';
export type PointsAttributes = Element3DAttributes;
/**
 * @class Points -
 *
 * Element: `<lume-points>`
 *
 * Applies default behaviors of
 * [`box-geometry`](../behaviors/mesh-behaviors/geometries/BoxGeometryBehavior)
 * and
 * [`points-material`](../behaviors/mesh-behaviors/materials/PhongMaterialBehavior).
 *
 * A `<lume-points>` element is similar to a `<lume-mesh>` element, except that
 * the `points-material` is used by default, which renders any geometry's
 * verticies as points instead of filled triangles.
 *
 * It can be useful to have
 * [`ply-geometry`](../behaviors/mesh-behaviors/geometries/PlyGeometryBehavior)
 * behavior on this element to load a set of points from a file for example.
 *
 * @extends Element3D
 */
export declare class Points extends Element3D {
    initialBehaviors: {
        geometry: string;
        material: string;
    };
    makeThreeObject3d(): ThreePoints<import("three").BufferGeometry<import("three").NormalBufferAttributes>, import("three").Material | import("three").Material[], import("three").Object3DEventMap>;
}
export interface Points extends ElementWithBehaviors<BehaviorInstanceTypes, BehaviorAttributes> {
}
type BehaviorInstanceTypes = PointsMaterialBehavior & PhongMaterialBehavior & LambertMaterialBehavior & ClipPlanesBehavior;
type BehaviorAttributes = PointsMaterialBehaviorAttributes | PhongMaterialBehaviorAttributes | LambertMaterialBehaviorAttributes | ClipPlanesBehaviorAttributes;
declare module 'solid-js' {
    namespace JSX {
        interface IntrinsicElements {
            'lume-points': ElementAttributes<Points, PointsAttributes>;
        }
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'lume-points': Points;
    }
}
export {};
//# sourceMappingURL=Points.d.ts.map