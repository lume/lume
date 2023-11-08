import { Color } from 'three/src/math/Color.js';
import type { Object3D } from 'three/src/core/Object3D.js';
import type { Material } from 'three/src/materials/Material.js';
import type { RenderItem } from 'three/src/renderers/webgl/WebGLRenderLists.js';
import type { Quaternion } from 'three/src/math/Quaternion.js';
import type { Camera } from 'three/src/cameras/Camera.js';
import type { OrthographicCamera } from 'three/src/cameras/OrthographicCamera.js';
import type { PerspectiveCamera } from 'three/src/cameras/PerspectiveCamera.js';
export type TColor = Color | string | number;
export declare function isRenderItem(obj: any): obj is RenderItem;
export declare function disposeMaterial(obj: Object3D): void;
export declare function disposeObject(obj: Object3D, removeFromParent?: boolean, destroyGeometry?: boolean, destroyMaterial?: boolean): void;
type DisposeOptions = Partial<{
    removeFromParent: boolean;
    destroyGeometry: boolean;
    destroyMaterial: boolean;
}>;
export declare function disposeObjectTree(obj: Object3D, disposeOptions?: DisposeOptions): void;
export declare function quaternionApproximateEquals(a: Quaternion, b: Quaternion, epsilon: number): boolean;
export declare function applyMaterial(obj: Object3D, material: Material, dispose?: boolean): void;
export declare function setRandomColorPhongMaterial(obj: Object3D, dispose?: boolean, traverse?: boolean): void;
export declare function setColorPhongMaterial(obj: Object3D, color: TColor, dispose?: boolean, traverse?: boolean): void;
export declare function isPerspectiveCamera(camera: Camera): camera is PerspectiveCamera;
export declare function isOrthographicCamera(camera: Camera): camera is OrthographicCamera;
export interface Disposable {
    dispose: () => void;
}
export declare function isDisposable(o: any): o is Disposable;
export {};
//# sourceMappingURL=three.d.ts.map