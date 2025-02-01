import type { Object3D } from 'three/src/core/Object3D.js';
export interface Disposable {
    dispose: () => void;
}
export declare function isDisposable(o: any): o is Disposable;
export declare function disposeMaterial(obj: Object3D): void;
export declare function disposeObject(obj: Object3D, removeFromParent?: boolean, destroyGeometry?: boolean, destroyMaterial?: boolean): void;
type DisposeOptions = Partial<{
    removeFromParent: boolean;
    destroyGeometry: boolean;
    destroyMaterial: boolean;
}>;
export declare function disposeObjectTree(obj: Object3D, disposeOptions?: DisposeOptions): void;
export {};
//# sourceMappingURL=dispose.d.ts.map