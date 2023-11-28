import { PerspectiveCamera as ThreePerspectiveCamera } from 'three/src/cameras/PerspectiveCamera.js';
import { Element3D, type Element3DAttributes } from '../core/Element3D.js';
export type PerspectiveCameraAttributes = Element3DAttributes | 'fov' | 'aspect' | 'near' | 'far' | 'zoom' | 'active';
/**
 * @class PerspectiveCamera
 *
 * Defines a viewport into the 3D scene as will be seen on screen.
 *
 * A perspective camera is very similar to a camera in the real world: it has a
 * field of view (fov) such that more things in the world are visible further away from
 * the camera, while less can fit into view closer to the camera.
 *
 * <live-code id="example"></live-code>
 * <script>
 *   example.code = perspectiveCameraExample
 * </script>
 *
 * @extends Element3D
 */
export declare class PerspectiveCamera extends Element3D {
    #private;
    /**
     * @property {number} fov
     *
     * *attribute*
     *
     * Default: `50`
     *
     * The camera's field of view angle, in degrees, when [`zoom`](#zoom) level
     * is `1`.
     */
    fov: number;
    /**
     * @property {number} aspect
     *
     * *attribute*
     *
     * Default: `0`
     *
     * A value of `0` sets the aspect ratio to automatic, based on the
     * dimensions of a scene.  You normally don't want to modify this, but in
     * case of stretched or squished display, this can be adjusted appropriately
     * to unstretch or unsquish the view of the 3d world.
     */
    aspect: number;
    /**
     * @property {number} near
     *
     * *attribute*
     *
     * Default: `1`
     *
     * Anything closer to the camera than this value will not be rendered.
     */
    near: number;
    /**
     * @property {number} far
     *
     * *attribute*
     *
     * Default: `3000`
     *
     * Anything further from the camera than this value will not be rendered.
     */
    far: number;
    /**
     * @property {number} zoom
     *
     * *attribute*
     *
     * Default: `1`
     *
     * The zoom level of the camera modifies the effective field of view.
     * Increasing the zoom will decrease the effective field of view, and vice
     * versa. At zoom level `1`, the effective field of view is equivalent to
     * [`fov`](#fov).
     */
    zoom: number;
    /**
     * @property {boolean} active
     *
     * *attribute*
     *
     * Default: `false`
     *
     * When `true`, the camera will be used as the viewport into the 3D scene,
     * instead of the scene's default camera. When set back to `false`, the last
     * camera that was set (and is still) active will be used, or if no other
     * cameras are active the scene's default camera will be used.
     */
    active: boolean;
    connectedCallback(): void;
    makeThreeObject3d(): ThreePerspectiveCamera;
    disconnectedCallback(): void;
}
import type { ElementAttributes } from '@lume/element';
declare module 'solid-js' {
    namespace JSX {
        interface IntrinsicElements {
            'lume-perspective-camera': ElementAttributes<PerspectiveCamera, PerspectiveCameraAttributes>;
        }
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'lume-perspective-camera': PerspectiveCamera;
    }
}
//# sourceMappingURL=PerspectiveCamera.d.ts.map