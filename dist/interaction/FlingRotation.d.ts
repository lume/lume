import { Effects } from 'classy-solid';
import type { Element3D } from '../core/Element3D.js';
declare const FlingRotation_base: {
    new (...a: any[]): {
        set<T extends any, K extends keyof T, V extends T[K]>(props: Partial<Record<K, V>>): any;
    };
} & typeof Effects;
/**
 * Rotates the `rotationXTarget` element on X, and the `rotationYTarget` element
 * on Y, to make interactive rotation of an object.
 */
export declare class FlingRotation extends FlingRotation_base {
    #private;
    /** The object that will be rotated on Y. Required. */
    rotationYTarget: Element3D;
    /**
     * The object that will be rotated on X. Defaults to the element inside the
     * rotationYTarget (it's like a gimball).
     */
    rotationXTarget: Element3D;
    /**
     * The element that will used for drag handling, defaults to
     * rotationXTarget. You could set it to a <lume-scene>, for example, to make
     * the rotation interaction start anywhere in a scene, not specifically on
     * the object to be rotated.
     */
    target: Element;
    /**
     * The X rotation can not go below this value. Defaults to -90 which means
     * facing straight up.
     */
    minRotationX: number;
    /**
     * The X rotation can not go above this value. Defaults to 90 which means
     * facing straight down.
     */
    maxRotationX: number;
    /**
     * The Y rotation can not go below this value. Defaults to -Infinity which
     * means the camera can keep rotating laterally around the focus point
     * indefinitely.
     */
    minRotationY: number;
    /**
     * The Y rotation can not go below this value. Defaults to Infinity which
     * means the camera can keep rotating laterally around the focus point
     * indefinitely.
     */
    maxRotationY: number;
    sensitivity: number;
    epsilon: number;
    /**
     * Portion of the change in rotation that is removed each frame to
     * cause slowdown. Between 0 and 1.
     */
    slowdownAmount: number;
    /**
     * The allowed pointer types to use for dragging ('mouse', 'pen', or
     * 'touch'). Default is all of them.
     */
    pointerTypes: ('mouse' | 'pen' | 'touch')[];
    start(): this;
    stop(): this;
}
export {};
//# sourceMappingURL=FlingRotation.d.ts.map