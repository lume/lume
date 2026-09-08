import { type ElementAttributes } from '@lume/element';
import { Points as ThreePoints } from 'three/src/objects/Points.js';
import { MeshLike } from './MeshLike.js';
import type { Element3DAttributes } from '../core/Element3D.js';
import type { ElementWithBehaviors } from '../behaviors/ElementWithBehaviors.js';
import type { ClipPlanesBehavior, ClipPlanesBehaviorAttributes, LambertMaterialBehavior, LambertMaterialBehaviorAttributes, PhongMaterialBehavior, PhongMaterialBehaviorAttributes, PointsMaterialBehavior, PointsMaterialBehaviorAttributes } from '../behaviors/index.js';
export type PointsAttributes = Element3DAttributes;
/**
 * @class Points -
 *
 * Element: `<lume-points>`
 *
 * A `<lume-points>` element is similar to a `<lume-mesh>` element, except that
 * the `<lume-points-material>` is used by default, which renders any geometry's
 * vertices as points instead of filled triangles.
 *
 * Applies default behaviors of
 * [`<lume-box-geometry>`](../behavior-elements/mesh-behaviors/geometries/BoxGeometry)
 * and
 * [`<lume-points-material>`](../behavior-elements/mesh-behaviors/materials/PointsMaterial).
 *
 * It can be useful along with a
 * [`<lume-ply-geometry>`](../behavior-elements/mesh-behaviors/geometries/PlyGeometry)
 * child element to load a set of points from a file. For example:
 *
 * <live-code src="../../examples/shelby-gt350-points/example.html"></live-code>
 *
 * @extends MeshLike
 */
export declare class Points extends MeshLike {
    protected _defaultMaterial: () => Node | Node[];
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