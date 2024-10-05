import { Vector3 } from 'three/src/math/Vector3.js';
import { Object3D } from 'three/src/core/Object3D.js';
const pivot = Symbol('pivot');
export class Object3DWithPivot extends Object3D {
    type = 'Object3DWithPivot';
    [pivot];
    get pivot() {
        if (!this[pivot])
            this[pivot] = new Vector3();
        return this[pivot];
    }
    set pivot(v) {
        this[pivot] = v;
    }
    // This overrides Object3D to have a `.pivot` property of type
    // THREE.Vector3 that allows the origin (pivot) of rotation and scale to be
    // specified in local coordinate space. For more info:
    // https://github.com/mrdoob/three.js/issues/15965
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
// Override updateMatrix for all Three.js Object3D derivatives.
Object3D.prototype.updateMatrix = Object3DWithPivot.prototype.updateMatrix;
// Give all Three.js Object3D derivatives the pivot property.
Object.defineProperty(Object3D.prototype, 'pivot', Object.getOwnPropertyDescriptor(Object3DWithPivot.prototype, 'pivot'));
//# sourceMappingURL=Object3DWithPivot.js.map