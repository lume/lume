import { Mesh as ThreeMesh } from 'three/src/objects/Mesh.js';
import { Element3D } from '../core/Element3D.js';
import type { Material } from 'three/src/materials/Material.js';
import type { Element3DAttributes } from '../core/Element3D.js';
export type MeshAttributes = Element3DAttributes | 'castShadow' | 'receiveShadow';
export declare class Mesh extends Element3D {
    static defaultBehaviors: {
        [k: string]: any;
    };
    castShadow: boolean;
    receiveShadow: boolean;
    _loadGL(): boolean;
    makeThreeObject3d(): ThreeMesh<import("three").BufferGeometry<import("three").NormalBufferAttributes>, Material | Material[], import("three").Object3DEventMap>;
}
import type { ElementAttributes } from '@lume/element';
import type { PhongMaterialBehavior, PhongMaterialBehaviorAttributes, LambertMaterialBehavior, LambertMaterialBehaviorAttributes, ElementWithBehaviors, ClipPlanesBehavior, ClipPlanesBehaviorAttributes, PhysicalMaterialBehavior, PhysicalMaterialBehaviorAttributes, StandardMaterialBehavior, StandardMaterialBehaviorAttributes } from '../index.js';
type BehaviorInstanceTypes = PhongMaterialBehavior & LambertMaterialBehavior & StandardMaterialBehavior & PhysicalMaterialBehavior & ClipPlanesBehavior;
type BehaviorAttributes = PhongMaterialBehaviorAttributes | LambertMaterialBehaviorAttributes | StandardMaterialBehaviorAttributes | PhysicalMaterialBehaviorAttributes | ClipPlanesBehaviorAttributes;
export interface Mesh extends ElementWithBehaviors<BehaviorInstanceTypes, BehaviorAttributes> {
}
declare module '@lume/element' {
    namespace JSX {
        interface IntrinsicElements {
            'lume-mesh': ElementAttributes<Mesh & BehaviorInstanceTypes, MeshAttributes | BehaviorAttributes>;
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