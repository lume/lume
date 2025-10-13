import { untrack, onCleanup, createEffect } from 'solid-js';
import { MeshBehavior } from './MeshBehavior.js';
/**
 * @class GeometryOrMaterialBehavior
 * Abstract base class for Geometry and Material behaviors, not intended for direct use.
 *
 * Subclasses should implement:
 * _createComponent() - return a BufferGeometry or Material instance.
 *
 * @extends MeshBehavior
 */
export class GeometryOrMaterialBehavior extends MeshBehavior {
    connectedCallback() {
        super.connectedCallback();
        this.createEffect(() => {
            if (!this._parentIsDefined)
                return;
            createEffect(() => this.resetMeshComponent());
        });
    }
    resetMeshComponent() {
        this.#setMeshComponent();
        this.parentElement?.needsUpdate();
        onCleanup(this.#disposeMeshComponent);
    }
    _createComponent() {
        throw new Error('`_createComponent()` is not implemented by subclass.');
    }
    // records the initial size of the geometry, so that we have a
    // reference for how much scale to apply when accepting new sizes from
    // the user.
    // TODO
    // #initialSize: null,
    #disposeMeshComponent = () => {
        // TODO handle material arrays
        this.meshComponent?.dispose();
        this.meshComponent = null;
    };
    #setMeshComponent() {
        const newComponent = this._createComponent();
        // untrack in case we make .three reactive later
        // CONTINUE remove untrack if not needed
        untrack(() => {
            // @ts-expect-error FIXME
            this.parentElement.three[this.type] = newComponent;
        });
        // @ts-expect-error
        this.meshComponent = newComponent;
    }
}
//# sourceMappingURL=GeometryOrMaterialBehavior.js.map