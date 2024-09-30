import { type ElementAttributes } from '@lume/element';
import { Plane } from 'three/src/math/Plane.js';
import { Element3D, type Element3DAttributes } from './Element3D.js';
export type ClipPlaneAttributes = Element3DAttributes;
/**
 * @class ClipPlane
 *
 * Element: `lume-clip-plane`
 *
 * An non-rendered plane that can be placed anywhere in 3D space to clip an
 * element on one side of the plane. The plane is infinite.
 *
 * To visualize a portion of the plane, we can place a `<lume-plane>` as a
 * child of a `<lume-clip-plane>`, as in the below example.
 *
 * To clip an element, add a
 * [`clip-planes`](../behaviors/mesh-behaviors/ClipPlanesBehavior) behavior to the
 * element with the `has=""` attribute, then assign any number of connected
 * `<lume-clip-plane>` elements to the element's `clipPlanes` property.
 *
 * <live-code id="clipExample"></live-code>
 * <script>
 *   clipExample.content = clipPlaneExample
 * </script>
 *
 * @extends Element3D
 */
export declare class ClipPlane extends Element3D {
    /**
     * *reactive* *readonly*
     *
     * Returns the underlying `THREE.Plane` if applicable: when WebGL rendering is enabled
     * for the scene and the element participates in rendering.
     * Used by `ClipPlanesBehavior`
     */
    threeClip: Plane;
    /**
     * *reactive* *readonly*
     *
     * Returns the inverse underlying `THREE.Plane` if applicable: when WebGL rendering is enabled
     * for the scene and the element participates in rendering.
     * Used by `ClipPlanesBehavior`
     */
    threeInverseClip: Plane;
    updateWorldMatrices(): void;
}
declare module 'solid-js' {
    namespace JSX {
        interface IntrinsicElements {
            'lume-clip-plane': ElementAttributes<ClipPlane, ClipPlaneAttributes>;
        }
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'lume-clip-plane': ClipPlane;
    }
}
//# sourceMappingURL=ClipPlane.d.ts.map