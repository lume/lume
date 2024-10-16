import { type ElementAttributes } from '@lume/element';
import { OrthographicCamera as ThreeOrthographicCamera } from 'three/src/cameras/OrthographicCamera.js';
import { Camera, type CameraAttributes } from './Camera.js';
export type OrthographicCameraAttributes = CameraAttributes | 'left' | 'right' | 'top' | 'bottom';
/**
 * @class OrthographicCamera
 *
 * Defines a viewport into the 3D scene as will be seen on screen.
 *
 * Camera that uses orthographic projection.
 *
 * In this projection mode, an object's size in the rendered image stays constant regardless of
 * its distance from the camera.
 *
 * This can be useful for rendering 2D scenes and UI elements, amongst other things.
 *
 * @extends Camera
 */
export declare class OrthographicCamera extends Camera {
    /**
     * @property {number} left
     *
     * *attribute*
     *
     * Default: `0`
     *
     * Camera frustum left plane.
     *
     * If `left`, `right`, `top`, and `bottom` are all `0`, the camera will be sized based on the
     * current Scene's [`.calculatedSize`](../core/Scene#calculatedsize).
     */
    left: number;
    /**
     * @property {number} right
     *
     * *attribute*
     *
     * Default: `0`
     *
     * Camera frustum right plane.
     *
     * If `left`, `right`, `top`, and `bottom` are all `0`, the camera will be sized based on the
     * current Scene's [`.calculatedSize`](../core/Scene#calculatedsize).
     */
    right: number;
    /**
     * @property {number} top
     *
     * *attribute*
     *
     * Default: `0`
     *
     * Camera frustum top plane.
     *
     * If `left`, `right`, `top`, and `bottom` are all `0`, the camera will be sized based on the
     * current Scene's [`.calculatedSize`](../core/Scene#calculatedsize).
     */
    top: number;
    /**
     * @property {number} bottom
     *
     * *attribute*
     *
     * Default: `0`
     *
     * Camera frustum bottom plane.
     *
     * If `left`, `right`, `top`, and `bottom` are all `0`, the camera will be sized based on the
     * current Scene's [`.calculatedSize`](../core/Scene#calculatedsize).
     */
    bottom: number;
    connectedCallback(): void;
    makeThreeObject3d(): ThreeOrthographicCamera;
}
declare module 'solid-js' {
    namespace JSX {
        interface IntrinsicElements {
            'lume-orthographic-camera': ElementAttributes<OrthographicCamera, OrthographicCameraAttributes>;
        }
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'lume-orthographic-camera': OrthographicCamera;
    }
}
//# sourceMappingURL=OrthographicCamera.d.ts.map