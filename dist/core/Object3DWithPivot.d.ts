import { Vector3 } from 'three/src/math/Vector3.js';
import { Object3D } from 'three/src/core/Object3D.js';
declare module 'three/src/core/Object3D.js' {
    interface Object3D {
        pivot: Vector3;
    }
}
export declare class Object3DWithPivot extends Object3D {
    type: string;
    __pivot?: Vector3;
    get pivot(): Vector3;
    set pivot(v: Vector3);
    updateMatrix(): void;
}
//# sourceMappingURL=Object3DWithPivot.d.ts.map