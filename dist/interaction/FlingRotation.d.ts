import type { Element3D } from '../core/Element3D.js';
type FlingRotationOptions = Pick<FlingRotation, 'rotationYTarget'> & Partial<Pick<FlingRotation, 'rotationXTarget' | 'interactionInitiator' | 'minFlingRotationX' | 'maxFlingRotationX' | 'minFlingRotationY' | 'maxFlingRotationY' | 'interactionContainer' | 'factor'>>;
export declare class FlingRotation {
    #private;
    readonly rotationYTarget: Element3D;
    readonly rotationXTarget: Element3D;
    readonly interactionInitiator: Document | ShadowRoot | Element;
    readonly minFlingRotationX: number;
    readonly maxFlingRotationX: number;
    readonly minFlingRotationY: number;
    readonly maxFlingRotationY: number;
    readonly interactionContainer: Document | ShadowRoot | Element;
    factor: number;
    constructor(options: FlingRotationOptions);
    start(): this;
    stop(): this;
}
export {};
//# sourceMappingURL=FlingRotation.d.ts.map