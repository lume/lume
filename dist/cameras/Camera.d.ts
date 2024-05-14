import { Camera as ThreeCamera } from 'three/src/cameras/Camera.js';
import { Element3D, type Element3DAttributes } from '../core/Element3D.js';
export type CameraAttributes = Element3DAttributes | 'aspect' | 'near' | 'far' | 'active' | 'zoom';
/**
 * @class Camera
 *
 * Base class for all camera elements, f.e. [`<lume-perspective-camera>`](./PerspectiveCamera).
 *
 * @extends Element3D
 */
export declare class Camera extends Element3D {
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
    connectedCallback(): void;
    makeThreeObject3d(): ThreeCamera;
}
//# sourceMappingURL=Camera.d.ts.map