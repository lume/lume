import { type ElementAttributes } from '@lume/element';
import { Element3D, type Element3DAttributes } from '../core/Element3D.js';
import { FlingRotation, ScrollFling, PinchFling } from '../interaction/index.js';
import type { PerspectiveCamera } from './PerspectiveCamera.js';
export type CameraRigAttributes = Element3DAttributes | 'verticalAngle' | 'minVerticalAngle' | 'maxVerticalAngle' | 'horizontalAngle' | 'minHorizontalAngle' | 'maxHorizontalAngle' | 'distance' | 'minDistance' | 'maxDistance' | 'active' | 'dollySpeed' | 'interactive' | 'dollyEpsilon' | 'dollyScrollLerp' | 'dollyPinchSlowdown' | 'rotationEpsilon' | 'rotationSlowdown' | 'initialPolarAngle' | 'minPolarAngle' | 'maxPolarAngle' | 'initialDistance';
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
     * Default: `-1`
     *
     * The distance that the camera will be away from the center point.
     * When the performing a scroll gesture, the camera will zoom by moving
     * towards or away from the center point (i.e. dollying).
     *
     * A value of `-1` means automatic distance based on the current scene's
     * [`.perspective`](../core/Scene#perspective), matching the behavior of
     * [CSS `perspective`](https://developer.mozilla.org/en-US/docs/Web/CSS/perspective).
     */
    distance: number;
    __appliedDistance: number;
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
     * Default: `-1`
     *
     * The smallest distance (a non-zero value) the camera can get to the center point when zooming
     * by scrolling.
     *
     * A value of `-1` means the value will automatically be half of whatever
     * the [`.distance`](#distance) value is.
     */
    minDistance: number;
    __appliedMinDistance: number;
    /**
     * @property {number} maxDistance
     *
     * *attribute*
     *
     * Default: `-1`
     *
     * The largest distance (a non-zero value) the camera can get from the
     * center point when zooming out by scrolling or with pinch gesture.
     *
     * A value of `-1` means the value will automatically be double of whatever
     * the [`.distance`](#distance) value is.
     */
    maxDistance: number;
    __appliedMaxDistance: number;
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
    /**
     * @property {number} dollyEpsilon
     *
     * *attribute*
     *
     * Default: `0.01`
     *
     * The threshold for when to stop dolly smoothing animation (lerp). When the
     * delta between actual dolly position and target dolly position is below
     * this number, animation stops. Set this to a high value to prevent
     * smoothing.
     */
    dollyEpsilon: number;
    /**
     * @property {number} dollyScrollLerp
     *
     * *attribute*
     *
     * Default: `0.3`
     *
     * The portion to lerp towards the dolly target position each frame after
     * scrolling to dolly the camera. Between 0 and 1.
     */
    dollyScrollLerp: number;
    /**
     * @property {number} dollyPinchSlowdown
     *
     * *attribute*
     *
     * Default: `0.05`
     *
     * Portion of the dolly speed to remove each frame to slow down the dolly
     * animation after pinching to dolly the camera, i.e. how much to lerp
     * towards zero motion. Between 0 and 1.
     */
    dollyPinchSlowdown: number;
    /**
     * @property {number} rotationEpsilon
     *
     * *attribute*
     *
     * Default: `0.01`
     *
     * The threshold for when to stop intertial rotation slowdown animation.
     * When the current frame's change in rotation goes below this number,
     * animation stops. Set this to a high value to prevent inertial slowdown.
     */
    rotationEpsilon: number;
    /**
     * @property {number} rotationSlowdown
     *
     * *attribute*
     *
     * Default: `0.05`
     *
     * Portion of the rotational speed to remove each frame to slow down the
     * rotation after dragging to rotate the camera, i.e. how much to lerp
     * towards zero motion. Between 0 and 1.
     */
    rotationSlowdown: number;
    threeCamera?: PerspectiveCamera;
    /** @deprecated Use `.threeCamera` instead. */
    get cam(): PerspectiveCamera | undefined;
    rotationYTarget?: Element3D;
    rotationXTarget?: Element3D;
    flingRotation: FlingRotation;
    scrollFling: ScrollFling;
    pinchFling: PinchFling;
    connectedCallback(): void;
    template: () => Node | Node[];
}
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