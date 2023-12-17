import { Element3D, type Element3DAttributes } from '../core/Element3D.js';
import { FlingRotation, ScrollFling, PinchFling } from '../interaction/index.js';
import type { PerspectiveCamera } from './PerspectiveCamera.js';
export type CameraRigAttributes = Element3DAttributes | 'verticalAngle' | 'minVerticalAngle' | 'maxVerticalAngle' | 'horizontalAngle' | 'minHorizontalAngle' | 'maxHorizontalAngle' | 'distance' | 'minDistance' | 'maxDistance' | 'active' | 'dollySpeed' | 'interactive' | 'initialPolarAngle' | 'minPolarAngle' | 'maxPolarAngle' | 'initialDistance';
/**
 * @class CameraRig
 *
 * Element: `<lume-camera-rig>`
 *
 * The [`<lume-camera-rig>`](./CameraRig) element is much like a real-life
 * camera rig that contains a camera on it: it has controls to allow the user to
 * rotate and dolly the camera around in physical space more easily, in a
 * particular and specific. In the following example, try draging to rotate,
 * scrolling to zoom:
 *
 * <live-code id="example"></live-code>
 *
 * ## Slots
 *
 * - default (no name): Allows children of the camera rig to render as children
 * of the camera rig, like with elements that don't have a ShadowDOM.
 * - `camera-child`: Allows children of the camera rig to render relative to the
 * camera rig's underlying camera.
 */
export declare class CameraRig extends Element3D {
    #private;
    /**
     * @property {true} hasShadow
     *
     * *override* *readonly*
     *
     * This is `true` because this element has a `ShadowRoot` with the mentioned
     * [`slots`](#slots).
     */
    readonly hasShadow: true;
    /**
     * @property {number} verticalAngle
     *
     * *attribute*
     *
     * Default: `0`
     *
     * The vertical angle of the camera (rotation around a horizontal axis). When the user drags up or
     * down, the camera will move up and down as it rotates around the center.
     * The camera is always looking at the center.
     */
    verticalAngle: number;
    /**
     * @deprecated initialPolarAngle has been renamed to verticalAngle.
     * @property {number} initialPolarAngle
     *
     * *deprecated*: initialPolarAngle has been renamed to verticalAngle.
     */
    get initialPolarAngle(): number;
    set initialPolarAngle(value: number);
    /**
     * @property {number} minVerticalAngle
     *
     * *attribute*
     *
     * Default: `-90`
     *
     * The lowest angle that the camera will rotate vertically.
     */
    minVerticalAngle: number;
    /**
     * @deprecated minPolarAngle has been renamed to minVerticalAngle.
     * @property {number} minPolarAngle
     *
     * *deprecated*: minPolarAngle has been renamed to minVerticalAngle.
     */
    get minPolarAngle(): number;
    set minPolarAngle(value: number);
    /**
     * @property {number} maxVerticalAngle
     *
     * *attribute*
     *
     * Default: `90`
     *
     * The highest angle that the camera will rotate vertically.
     *
     * <live-code id="verticalExample"></live-code>
     *
     * <script>
     *   example.content = cameraRigExample
     *   verticalExample.content = cameraRigVerticalRotationExample
     * </script>
     */
    maxVerticalAngle: number;
    /**
     * @deprecated maxPolarAngle has been renamed to maxVerticalAngle.
     * @property {number} maxPolarAngle
     *
     * *deprecated*: maxPolarAngle has been renamed to maxVerticalAngle.
     */
    get maxPolarAngle(): number;
    set maxPolarAngle(value: number);
    /**
     * @property {number} horizontalAngle
     *
     * *attribute*
     *
     * Default: `0`
     *
     * The horizontal angle of the camera (rotation around a vertical axis). When the user drags left or
     * right, the camera will move left or right as it rotates around the center.
     * The camera is always looking at the center.
     */
    horizontalAngle: number;
    /**
     * @property {number} minHorizontalAngle
     *
     * *attribute*
     *
     * Default: `-Infinity`
     *
     * The smallest angle that the camera will be allowed to rotate to
     * horizontally. The default of `-Infinity` means the camera will rotate
     * laterally around the focus point indefinitely.
     */
    minHorizontalAngle: number;
    /**
     * @property {number} maxHorizontalAngle
     *
     * *attribute*
     *
     * Default: `Infinity`
     *
     * The largest angle that the camera will be allowed to rotate to
     * horizontally. The default of `Infinity` means the camera will rotate
     * laterally around the focus point indefinitely.
     */
    maxHorizontalAngle: number;
    /**
     * @property {number} distance
     *
     * *attribute*
     *
     * Default: `1000`
     *
     * The distance that the camera will be away from the center point.
     * When the performing a scroll gesture, the camera will zoom by moving
     * towards or away from the center point (i.e. dollying).
     */
    distance: number;
    /**
     * @deprecated initialDistance has been renamed to distance.
     * @property {number} initialDistance
     *
     * *deprecated*: initialDistance has been renamed to distance.
     */
    get initialDistance(): number;
    set initialDistance(value: number);
    /**
     * @property {number} minDistance
     *
     * *attribute*
     *
     * Default: `200`
     *
     * The smallest distance the camera can get to the center point when zooming
     * by scrolling.
     */
    minDistance: number;
    /**
     * @property {number} maxDistance
     *
     * *attribute*
     *
     * Default: `2000`
     *
     * The largest distance the camera can get from the center point when
     * zooming by scrolling.
     */
    maxDistance: number;
    /**
     * @property {boolean} active
     *
     * *attribute*
     *
     * Default: `true`
     *
     * When `true`, the underlying camera is set to [`active`](./PerspectiveCamera#active).
     */
    active: boolean;
    /**
     * @property {number} dollySpeed
     *
     * *attribute*
     *
     * Default: `1`
     */
    dollySpeed: number;
    /**
     * @property {boolean} interactive
     *
     * *attribute*
     *
     * Default: `true`
     *
     * When `false`, user interaction (ability to zoom or rotate the camera) is
     * disabled, but the camera rig can still be manipulated programmatically.
     */
    interactive: boolean;
    cam?: PerspectiveCamera;
    rotationYTarget?: Element3D;
    template: () => Node | Node[];
    flingRotation: FlingRotation | null;
    scrollFling: ScrollFling | null;
    pinchFling: PinchFling | null;
    startInteraction(): void;
    stopInteraction(): void;
    _loadGL(): boolean;
    _loadCSS(): boolean;
    _unloadGL(): boolean;
    _unloadCSS(): boolean;
    disconnectedCallback(): void;
}
import type { ElementAttributes } from '@lume/element';
declare module 'solid-js' {
    namespace JSX {
        interface IntrinsicElements {
            'lume-camera-rig': ElementAttributes<CameraRig, CameraRigAttributes>;
        }
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'lume-camera-rig': CameraRig;
    }
}
//# sourceMappingURL=CameraRig.d.ts.map