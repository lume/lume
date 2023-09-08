import { BufferGeometry } from 'three/src/core/BufferGeometry.js';
import { GeometryOrMaterialBehavior } from '../GeometryOrMaterialBehavior.js';
export class GeometryBehavior extends GeometryOrMaterialBehavior {
    type = 'geometry';
    get size() {
        return this.element.size;
    }
    set size(val) {
        this.element.size = val;
    }
    get sizeMode() {
        return this.element.sizeMode;
    }
    set sizeMode(val) {
        this.element.sizeMode = val;
    }
    get geometry() {
        return this.meshComponent;
    }
    _createComponent() {
        return new BufferGeometry();
    }
}
//# sourceMappingURL=GeometryBehavior.js.map