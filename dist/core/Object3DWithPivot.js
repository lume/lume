import { Vector3 } from 'three/src/math/Vector3.js';
import { Object3D } from 'three/src/core/Object3D.js';
export class Object3DWithPivot extends Object3D {
    type = 'Object3DWithPivot';
    __pivot;
    get pivot() {
        if (!this.__pivot)
            this.__pivot = new Vector3();
        return this.__pivot;
    }
    set pivot(v) {
        this.__pivot = v;
    }
    updateMatrix() {
        this.matrix.compose(this.position, this.quaternion, this.scale);
        const pivot = this.pivot;
        if (pivot.x !== 0 || pivot.y !== 0 || pivot.z !== 0) {
            const px = pivot.x, py = pivot.y, pz = pivot.z;
            const te = this.matrix.elements;
            te[12] += px - te[0] * px - te[4] * py - te[8] * pz;
            te[13] += py - te[1] * px - te[5] * py - te[9] * pz;
            te[14] += pz - te[2] * px - te[6] * py - te[10] * pz;
        }
        this.matrixWorldNeedsUpdate = true;
    }
}
Object3D.prototype.updateMatrix = Object3DWithPivot.prototype.updateMatrix;
Object.defineProperty(Object3D.prototype, 'pivot', Object.getOwnPropertyDescriptor(Object3DWithPivot.prototype, 'pivot'));
//# sourceMappingURL=Object3DWithPivot.js.map