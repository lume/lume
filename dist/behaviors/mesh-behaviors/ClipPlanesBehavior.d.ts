import { ClipPlane } from '../../core/ClipPlane.js';
import { MeshBehavior } from './MeshBehavior.js';
export type ClipPlanesBehaviorAttributes = 'clipPlanes' | 'clipIntersection' | 'clipShadows' | 'flipClip' | 'clipDisabled';
/**
 * @class ClipPlanesBehavior
 *
 * When applied to an element with GL content, allows specifying one or more
 * [`<lume-clip-plane>`](../../core/ClipPlane) elements to clip the content with.
 *
 * This class extends from `MeshBehavior`, enforcing that the behavior can be used
 * only on elements that have a geometry and material.
 *
 * <div id="clipPlaneExample"></div>
 *
 * <script type="application/javascript">
 *   new Vue({ el: '#clipPlaneExample', data: { code: clipPlaneExample }, template: '<live-code :template="code" mode="html>iframe" :debounce="200" />' })
 * </script>
 *
 * @extends MeshBehavior
 */
export declare class ClipPlanesBehavior extends MeshBehavior {
    #private;
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
     * Default: `false`
     *
     * Defines whether to clip shadows
     * according to the clipping planes specified on this material. Default is
     * false.
     */
    clipShadows: boolean;
    /**
     * @property {string | Array<ClipPlane | string | null>} clipPlanes
     *
     * *attribute*
     *
     * Default: `[]`
     *
     * The `clip-planes` attribute accepts one or more selectors, comma
     * separated, that define which [`<lume-clip-plane>`](../../core/ClipPlane)
     * elements are to be used as clip planes. If a selector matches an element
     * that is not a `<lume-clip-plane>`, it is ignored. If a selector matches
     * more than one element, all of them that are clip planes are used.
     *
     * ```html
     * <lume-box has="clip-planes" clip-planes=".foo, .bar, #baz"></lume-box>
     * ```
     *
     * The property can also be set with a string (comma separated selectors),
     * or a mixed array of strings (selectors) or `<lume-clip-plane>` element
     * instances.
     *
     * ```js
     * el.clipPlanes = ".some-plane"
     * // or
     * const plane = document.querySelector('.some-clip-plane')
     * el.clipPlanes = [plane, "#someOtherPlane"]
     * ```
     *
     * The property getter returns the currently applicable collection of
     * `<lume-clip-plane>` instances, not the original string or array of values
     * passed into the attribute or setter. Applicable planes are those that are
     * connected into the document, and that participate in rendering (composed,
     * either in the top level document, in a ShadowRoot, or distributed to a
     * slot in a ShadowRoot).
     */
    get clipPlanes(): Array<ClipPlane>;
    set clipPlanes(value: string | Array<ClipPlane | string>);
    /**
     * @property {boolean} flipClip
     *
     * *attribute*
     *
     * Default: `false`
     *
     * By default, the side of a plane that is clipped is in its positive Z
     * direction. Setting this to `true` will reverse clipping to the other
     * side.
     */
    flipClip: boolean;
    /**
     * @property {boolean} clipDisabled
     *
     * *attribute*
     *
     * Default: `false`
     *
     * If `true`, clipping is not applied.
     */
    clipDisabled: boolean;
    /**
     * `reactive`
     */
    get material(): import("three").Material | null;
    loadGL(): void;
    unloadGL(): void;
}
//# sourceMappingURL=ClipPlanesBehavior.d.ts.map