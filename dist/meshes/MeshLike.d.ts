import { Element3D } from '../core/Element3D.js';
/**
 * @abstract
 * @class MeshLike -
 *
 * `abstract`
 *
 * An abstract base class for elements that render a shape (a geometry) with a
 * style (a material) — namely `Mesh`, `Points`, and `Line` elements. It renders
 * default geometry and material behavior child elements into named slots,
 * unless subclasses override the defaults via `_defaultGeometry` and
 * `_defaultMaterial`, or unless the user provides their own child behavior
 * elements.
 *
 * The default geometry is [`<lume-box-geometry>`](../behavior-elements/mesh-behaviors/geometries/BoxGeometry)
 * and the default material is [`<lume-physical-material>`](../behavior-elements/mesh-behaviors/materials/PhysicalMaterial).
 *
 * @extends Element3D
 */
export declare abstract class MeshLike extends Element3D {
    #private;
    /** @protected */
    protected _defaultGeometry: () => Node | Node[];
    /** @protected */
    protected _defaultMaterial: () => Node | Node[];
    get hasLegacyGeometry(): boolean;
    get hasLegacyMaterial(): boolean;
    hasShadow: boolean;
    shadowOptions: ShadowRootInit;
    childConnectedCallback(): void;
    childDisconnectedCallback(): void;
    connectedCallback(): void;
    __hasEffect(): void;
    template: () => Node | Node[];
}
//# sourceMappingURL=MeshLike.d.ts.map