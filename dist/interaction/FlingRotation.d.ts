import type { Element3D } from '../core/Element3D.js';
type FlingRotationOptions = Pick<FlingRotation, 'rotationYTarget'> & Partial<Pick<FlingRotation, 'rotationXTarget' | 'interactionInitiator' | 'minFlingRotationX' | 'maxFlingRotationX' | 'minFlingRotationY' | 'maxFlingRotationY' | 'interactionContainer' | 'factor'>>;
export declare class FlingRotation {
    #private;
    /** The object that will be rotated on Y. Required. */
    readonly rotationYTarget: Element3D;
    /**
     * The object that will be rotated on X. Defaults to the element inside the
     * rotationYTarget (it's like a gimball).
     */
    readonly rotationXTarget: Element3D;
    /**
     * The element on which the pointer should be placed down on in order to
     * initiate drag tracking. This defaults to rotationXTarget.
     */
    readonly interactionInitiator: Element;
    /**
     * The X rotation can not go below this value. Defaults to -90 which means
     * facing straight up.
     */
    readonly minFlingRotationX: number;
    /**
     * The X rotation can not go above this value. Defaults to 90 which means
     * facing straight down.
     */
    readonly maxFlingRotationX: number;
    /**
     * The Y rotation can not go below this value. Defaults to -Infinity which
     * means the camera can keep rotating laterally around the focus point
     * indefinitely.
     */
    readonly minFlingRotationY: number;
    /**
     * The Y rotation can not go below this value. Defaults to Infinity which
     * means the camera can keep rotating laterally around the focus point
     * indefinitely.
     */
    readonly maxFlingRotationY: number;
    /**
     * The area in which drag tacking will happen. Defaults to
     * document.documentElement for tracking in the whole viewport.
     */
    readonly interactionContainer: Element;
    factor: number;
    constructor(options: FlingRotationOptions);
    start(): this;
    stop(): this;
}
export {};
//# sourceMappingURL=FlingRotation.d.ts.map