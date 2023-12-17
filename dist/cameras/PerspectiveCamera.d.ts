import { PerspectiveCamera as ThreePerspectiveCamera } from 'three/src/cameras/PerspectiveCamera.js';
import { Camera, type CameraAttributes } from './Camera.js';
export type PerspectiveCameraAttributes = CameraAttributes | 'fov';
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
 *   example.content = perspectiveCameraExample
 * </script>
 *
 * @extends Camera
 */
export declare class PerspectiveCamera extends Camera {
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
    connectedCallback(): void;
    makeThreeObject3d(): ThreePerspectiveCamera;
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