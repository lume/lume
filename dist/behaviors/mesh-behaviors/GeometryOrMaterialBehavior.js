import { untrack, onCleanup } from 'solid-js';
import { MeshBehavior } from './MeshBehavior.js';
export class GeometryOrMaterialBehavior extends MeshBehavior {
    loadGL() {
        this.createEffect(() => this.resetMeshComponent());
    }
    resetMeshComponent() {
        this.#setMeshComponent();
        this.element.needsUpdate();
        onCleanup(this.#disposeMeshComponent);
    }
    _createComponent() {
        throw new Error('`_createComponent()` is not implemented by subclass.');
    }
    #disposeMeshComponent = () => {
        this.meshComponent?.dispose();
        this.meshComponent = null;
    };
    #setMeshComponent() {
        const newComponent = this._createComponent();
        untrack(() => {
            this.element.three[this.type] = newComponent;
        });
        this.meshComponent = newComponent;
    }
}
//# sourceMappingURL=GeometryOrMaterialBehavior.js.map