import { Effects } from 'classy-solid';
import type { Element3D } from '../core/Element3D.js';
type Options = Partial<Pick<FlingRotation, 'rotationXTarget' | 'rotationYTarget' | 'interactionInitiator' | 'interactionContainer' | 'minFlingRotationX' | 'maxFlingRotationX' | 'minFlingRotationY' | 'maxFlingRotationY' | 'factor'>>;
export declare class FlingRotation extends Effects {
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
    constructor(options?: Options);
    start(): this;
    stop(): this;
}
export {};
//# sourceMappingURL=FlingRotation.d.ts.map