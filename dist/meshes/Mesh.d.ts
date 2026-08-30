import { Mesh as ThreeMesh } from 'three/src/objects/Mesh.js';
import { type ElementAttributes } from '@lume/element';
import { MeshLike } from './MeshLike.js';
import type { Material } from 'three/src/materials/Material.js';
import type { Element3DAttributes } from '../core/Element3D.js';
import type { ElementWithBehaviors } from '../behaviors/ElementWithBehaviors.js';
import type { PhongMaterialBehavior, PhongMaterialBehaviorAttributes, LambertMaterialBehavior, LambertMaterialBehaviorAttributes, ClipPlanesBehavior, ClipPlanesBehaviorAttributes, PhysicalMaterialBehavior, PhysicalMaterialBehaviorAttributes, StandardMaterialBehavior, StandardMaterialBehaviorAttributes } from '../behaviors/index.js';
export type MeshAttributes = Element3DAttributes | BehaviorAttributes | 'castShadow' | 'receiveShadow';
/**
 * @class Mesh -
 *
 * Element: `<lume-mesh>`
 *
 * An element that renders a particular 3D shape (a geometry formed by a set of
 * vertices) along with a particular style (a material). Every three vertices in
 * the shape are drawn as a triangle.
 *
 * It defaults to having a box geometry (using a `<lume-box-geometry>` child
 * element) and a physical material (using a `<lume-physical-material>` child
 * element), unless otherwise specified.
 *
 * Elements like `<lume-box>` extend from `Mesh` in order to define different
 * default geometry or material. For example a `<lume-sphere>` element
 * (implemented by the [`Sphere`](./Sphere) class) extends from `Mesh` and
 * applies a
 * [`<lume-sphere-geometry>`](../behavior-elements/mesh-behaviors/geometries/SphereGeometry)
 * child element to override the default `<lume-box-geometry>`.
 *
 * ```html
 * <!-- This renders a box with a physical material colored white by default. -->
 * <lume-mesh size="10 20 30"></lume-mesh>
 *
 * <!-- This renders a sphere with a phong material specifically colored blue. -->
 * <lume-mesh size="10">
 *   <lume-sphere-geometry></lume-sphere-geometry>
 *   <lume-phong-material color="blue"></lume-phong-material>
 * </lume-mesh>

 * <!-- This renders a sphere with a phong material specifically colored blue (shortcut). -->
 * <lume-sphere size="10">
 *   <lume-phong-material color="blue"></lume-phong-material>
 * </lume-sphere>
 * ```
 *
 * ## Example
 *
 * <live-code id="liveExample"></live-code>
 * <script>
 *   liveExample.content = meshExample()
 * </script>
 *
 * @extends MeshLike
 * @element lume-mesh TODO @element jsdoc tag
 *
 */
export declare class Mesh extends MeshLike {
    /**
     * @property {boolean} castShadow
     *
     * `boolean` `attribute`
     *
     * Default: `true`
     *
     * When `true`, the mesh casts shadows onto other objects when under the
     * presence of a light such as a
     * [`<lume-point-light>`](../lights/PointLight).
     */
    castShadow: boolean;
    /**
     * @property {boolean} receiveShadow
     *
     * `boolean` `attribute`
     *
     * Default: `true`
     *
     * When `true`, the mesh receives shadows from other objects when under the
     * presence of a light such as a
     * [`<lume-point-light>`](../lights/PointLight).
     */
    receiveShadow: boolean;
    connectedCallback(): void;
    makeThreeObject3d(): ThreeMesh<import("three").BufferGeometry<import("three").NormalBufferAttributes>, Material | Material[], import("three").Object3DEventMap>;
}
export interface Mesh extends ElementWithBehaviors<BehaviorInstanceTypes, BehaviorAttributes> {
}
type BehaviorInstanceTypes = PhongMaterialBehavior & LambertMaterialBehavior & StandardMaterialBehavior & PhysicalMaterialBehavior & ClipPlanesBehavior;
type BehaviorAttributes = PhongMaterialBehaviorAttributes | LambertMaterialBehaviorAttributes | StandardMaterialBehaviorAttributes | PhysicalMaterialBehaviorAttributes | ClipPlanesBehaviorAttributes;
declare module 'solid-js' {
    namespace JSX {
        interface IntrinsicElements {
            'lume-mesh': ElementAttributes<Mesh, MeshAttributes>;
        }
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'lume-mesh': Mesh;
    }
}
export {};
//# sourceMappingURL=Mesh.d.ts.map