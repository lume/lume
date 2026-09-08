import { untrack, onCleanup } from 'solid-js';
import { MeshBehavior } from './MeshBehavior.js';
/**
 * @class GeometryOrMaterialBehavior
 * Abstract base class for Geometry and Material behaviors, not intended for direct use.
 *
 * Subclasses should implement:
 * _createComponent() - return a BufferGeometry or Material instance.
 *
 * @extends MeshBehavior
 * @deprecated Legacy behavior system via `has=""` attribute is deprecated. Use child geometry/material elements instead. Legacy behaviors will be removed in a future version.
 */
export class GeometryOrMaterialBehavior extends MeshBehavior {
    connectedCallback() {
        super.connectedCallback();
        this.createEffect(() => this.resetMeshComponent());
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        console.warn('Dynamically removing legacy has-attribute mesh behaviors is deprecated, quirky, and will be eventually removed. Migrate to element-based mesh behaviors.');
    }
    resetMeshComponent() {
        this.#setMeshComponent();
        this.element.needsUpdate();
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
        untrack(() => {
            // @ts-expect-error FIXME
            this.element.three[this.type] = newComponent;
        });
        // @ts-expect-error
        this.meshComponent = newComponent;
    }
}
//# sourceMappingURL=GeometryOrMaterialBehavior.js.map