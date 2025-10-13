import { MeshBehavior } from './MeshBehavior.js';
export type ClipPlanesBehaviorAttributes = 'clipPlanes' | 'clipIntersection' | 'clipShadows' | 'flipClip' | 'clipDisabled';
/**
 * @class ClipPlanesBehavior
 *
 * Element: `clip-planes`
 *
 * When applied to an element with GL content, allows specifying one or more
 * [`<lume-clip-plane>`](../../core/ClipPlane) elements to clip the content with.
 *
 * This class extends from `MeshBehavior`, enforcing that the behavior can be used
 * only on elements that have a geometry and material.
 *
 * @extends MeshBehavior
 * @element clip-planes
 */
export declare class ClipPlanesBehavior extends MeshBehavior {
    /**
     * @property {boolean} clipIntersection
     *
     * `attribute`
     *
     * Default: 'false'
     *
     * Changes the behavior of clipping planes so that only their intersection
     * is clipped, rather than their union.
     */
    clipIntersection: boolean;
    /**
     * @property {boolean} clipShadows
     *
     * `attribute`
     *
     * Default: 'true'
     *
     * Defines whether clipping affects shadows casted by the object.
     */
    clipShadows: boolean;
    /**
     * @property {boolean} flipClip
     *
     * `attribute`
     *
     * Default: 'false'
     *
     * Defines whether to flip the clipped away area. When set to true, the
     * clipped away area is kept and the non-clipped area is removed.
     */
    flipClip: boolean;
    /**
     * @property {boolean} clipDisabled
     *
     * `attribute`
     *
     * Default: 'false'
     *
     * When `true`, disables clipping for this object.
     */
    clipDisabled: boolean;
    /**
     * @property {string} clipPlanes
     *
     * `attribute`
     *
     * Default: `""`
     *
     * A space-separated list of CSS-selector values used to select
     * ClipPlane elements to clip the object with.
     */
    clipPlanes: string;
    connectedCallback(): void;
}
//# sourceMappingURL=ClipPlanesBehavior.d.ts.map