import { /*untrack,*/ onCleanup, createEffect } from 'solid-js';
import { MeshBehaviorEl } from './MeshBehaviorEl.js';
/**
 * @class GeometryOrMaterialBehaviorEl
 * Abstract base class for Geometry and Material behaviors, not intended for direct use.
 *
 * Subclasses should implement:
 * _createComponent() - return a BufferGeometry or Material instance.
 *
 * @extends MeshBehaviorEl
 */
export class GeometryOrMaterialBehaviorEl extends MeshBehaviorEl {
    _parentDefinedEffect(parent = this.composedParent) {
        super._parentDefinedEffect(parent);
        // Any reactive dependencies used in making the .three object can
        // trigger re-creation. This is useful for certain objects that have to
        // be re-created to have new settings, for example those that accept
        // certain values only via constructor.
        createEffect(() => this.resetMeshComponent());
        // Any time .three changes (f.e. due to .reacreateThree() calls on the
        // parent mesh element), or meshComponent changes, this sub-effect will
        // re-assign geometry or material mesh component to .three.
        createEffect(() => {
            const geometryOrMaterial = this.meshComponent;
            // @ts-expect-error FIXME geometry not assignable to
            // geometry&material due to dynamic usage of this.type with
            // geometryOrMaterial being geometry|material
            this.composedParent.three[this.type] = geometryOrMaterial;
        });
    }
    resetMeshComponent() {
        this.#setMeshComponent();
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
        const geometryOrMaterial = this._createComponent();
        // @ts-expect-error
        this.meshComponent = geometryOrMaterial;
    }
}
//# sourceMappingURL=GeometryOrMaterialBehaviorEl.js.map