import { InstancedMesh as ThreeInstancedMesh } from 'three/src/objects/InstancedMesh.js';
import { Quaternion } from 'three/src/math/Quaternion.js';
import { Vector3 } from 'three/src/math/Vector3.js';
import { Matrix4 } from 'three/src/math/Matrix4.js';
import { Mesh, MeshAttributes } from './Mesh.js';
export declare type InstancedMeshAttributes = MeshAttributes | 'count' | 'rotations' | 'positions' | 'scales' | 'colors';
export declare class InstancedMesh extends Mesh {
    #private;
    count: number;
    get rotations(): number[];
    set rotations(v: number[] | string);
    get positions(): number[];
    set positions(v: number[]);
    get scales(): number[];
    set scales(v: number[]);
    get colors(): number[];
    set colors(v: number[]);
    static defaultBehaviors: {
        [k: string]: any;
    };
    makeThreeObject3d(): ThreeInstancedMesh<import("three").BufferGeometry<import("three").NormalBufferAttributes>, import("three").Material>;
    setInstancePosition(index: number, x: number, y: number, z: number): void;
    setInstanceScale(index: number, x: number, y: number, z: number): void;
    setInstanceRotation(index: number, x: number, y: number, z: number): void;
    setInstanceColor(index: number, r: number, g: number, b: number): void;
    updateAllMatrices(): void;
    updateAllColors(): void;
    _calculateInstanceMatrix(pos: Vector3, quat: Quaternion, scale: Vector3, pivot: Vector3, result: Matrix4): void;
    _loadGL(): boolean;
    update(t: number, dt: number): void;
}
import type { ElementAttributes } from '@lume/element';
declare module '@lume/element' {
    namespace JSX {
        interface IntrinsicElements {
            'lume-instanced-mesh': JSX.IntrinsicElements['lume-mesh'] & ElementAttributes<InstancedMesh, InstancedMeshAttributes>;
        }
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'lume-instanced-mesh': InstancedMesh;
    }
}
//# sourceMappingURL=InstancedMesh.d.ts.map