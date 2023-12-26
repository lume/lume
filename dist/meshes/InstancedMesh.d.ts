import { InstancedMesh as ThreeInstancedMesh } from 'three/src/objects/InstancedMesh.js';
import { Quaternion } from 'three/src/math/Quaternion.js';
import { Vector3 } from 'three/src/math/Vector3.js';
import { Matrix4 } from 'three/src/math/Matrix4.js';
import { Mesh, type MeshAttributes } from './Mesh.js';
export type InstancedMeshAttributes = MeshAttributes | 'count' | 'rotations' | 'positions' | 'scales' | 'colors';
/**
 * @element lume-instanced-mesh
 * @class InstancedMesh - This is similar to Mesh, but renders multiple
 * "instances" of a geometry (insead of only one) with a single draw call to
 * the GPU, as if all the instances were a single geometry. This is more
 * efficient in cases where multiple objects to be rendered are similar
 * (share the same geometry and material). Rendering multiple similar objects
 * as separate Mesh instances would otherwise incur one draw call to the GPU
 * per mesh which will be slower.
 *
 * For sake of simplicity, `<lume-instanced-mesh>` has a box-geometry and
 * phong-material by default.
 *
 * ## Example
 *
 * <live-code id="liveExample"></live-code>
 * <script>
 *   liveExample.content = instancedMeshExample
 * </script>
 *
 * @extends Mesh
 *
 */
export declare class InstancedMesh extends Mesh {
    #private;
    /**
     * @property {number} count - The number of instances to render.
     */
    count: number;
    /**
     * @property {number[]} rotations - The rotations for each instance.
     * Generally the array should have a length of `this.count * 3` because
     * each rotation consists of three numbers for X, Y, and Z axes. Every three
     * numbers is one X,Y,Z triplet. If the array has less rotations than
     * `this.count`, the missing rotations will be considered to have
     * values of zero. If it has more than `this.count` rotations, those
     * rotations are ignored.
     */
    get rotations(): number[];
    set rotations(v: number[] | string);
    /**
     * @property {number[]} positions - The positions for each instance.
     * Generally the array should have a length of `this.count * 3` because
     * each rotation consists of three numbers for X, Y, and Z axes. Every three
     * numbers is one X,Y,Z triplet. If the array has less positions than
     * `this.count`, the missing positions will be considered to have
     * values of zero. If it has more than `this.count` positions, those
     * positions are ignored.
     */
    get positions(): number[];
    set positions(v: number[]);
    /**
     * @property {number[]} scales - The scales for each instance.
     * Generally the array should have a length of `this.count * 3` because
     * each rotation consists of three numbers for X, Y, and Z axes. Every three
     * numbers is one X,Y,Z triplet. If the array has less scales than
     * `this.count`, the missing scales will be considered to have
     * values of zero. If it has more than `this.count` scales, those
     * scales are ignored.
     */
    get scales(): number[];
    set scales(v: number[]);
    /**
     * @property {number[]} colors - The colors for each instance.
     * Generally the array should have a length of `this.count * 3` because
     * each rotation consists of three numbers for R, G, and B color components. Every three
     * numbers is one R,G,B triplet. If the array has less colors than
     * `this.count`, the missing colors will be considered to have
     * values of zero (black). If it has more than `this.count` colors, those
     * colors are ignored.
     */
    get colors(): number[];
    set colors(v: number[]);
    initialBehaviors: {
        geometry: string;
        material: string;
    };
    makeThreeObject3d(): ThreeInstancedMesh<import("three").BufferGeometry<import("three").NormalBufferAttributes>, import("three").Material>;
    setInstancePosition(index: number, x: number, y: number, z: number): void;
    setInstanceScale(index: number, x: number, y: number, z: number): void;
    setInstanceRotation(index: number, x: number, y: number, z: number): void;
    setInstanceColor(index: number, r: number, g: number, b: number): void;
    updateAllMatrices(): void;
    updateAllColors(): void;
    /**
     * This is very similar to SharedAPI._calculateMatrix, without the threeCSS parts.
     */
    _calculateInstanceMatrix(pos: Vector3, quat: Quaternion, scale: Vector3, pivot: Vector3, result: Matrix4): void;
    connectedCallback(): void;
    update(t: number, dt: number): void;
}
import type { ElementAttributes } from '@lume/element';
declare module 'solid-js' {
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