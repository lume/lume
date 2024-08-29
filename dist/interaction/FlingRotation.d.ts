import { Effects } from 'classy-solid';
import type { Element3D } from '../core/Element3D.js';
declare const FlingRotation_base: {
    new (...a: any[]): {
        set<T extends any, K extends keyof T, V extends T[K]>(props: Partial<Record<K, V>>): any;
    };
} & typeof Effects;
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
     * The element on which the pointer should be placed down on in order to
     * initiate drag tracking. This defaults to rotationXTarget.
     */
    interactionInitiator: Element;
    /**
     * The area in which drag tacking will happen. Defaults to
     * document.documentElement for tracking in the whole viewport.
     */
    interactionContainer: Element;
    /**
     * The X rotation can not go below this value. Defaults to -90 which means
     * facing straight up.
     */
    minFlingRotationX: number;
    /**
     * The X rotation can not go above this value. Defaults to 90 which means
     * facing straight down.
     */
    maxFlingRotationX: number;
    /**
     * The Y rotation can not go below this value. Defaults to -Infinity which
     * means the camera can keep rotating laterally around the focus point
     * indefinitely.
     */
    minFlingRotationY: number;
    /**
     * The Y rotation can not go below this value. Defaults to Infinity which
     * means the camera can keep rotating laterally around the focus point
     * indefinitely.
     */
    maxFlingRotationY: number;
    factor: number;
    epsilon: number;
    /**
     * Portion of the change in rotation that is removed each frame to
     * cause slowdown. Between 0 and 1.
     */
    slowdownAmount: number;
    start(): this;
    stop(): this;
}
export {};
//# sourceMappingURL=FlingRotation.d.ts.map