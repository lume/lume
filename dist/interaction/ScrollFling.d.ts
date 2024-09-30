import { Effects } from 'classy-solid';
type Options = Partial<Pick<ScrollFling, 'target' | 'x' | 'y' | 'minX' | 'maxX' | 'minY' | 'maxY' | 'sensitivity' | 'hasInteracted' | 'epsilon' | 'lerpAmount'>>;
export declare class ScrollFling extends Effects {
    #private;
    /**
     * During scroll, this value will change. It is a signal so that it can be
     * observed. Set this value initially if you want to start at a certain
     * value. Setting the value immediately stops any smoothing animation.
     */
    get x(): number;
    set x(val: number);
    /**
     * During scroll, this value will change. It is a signal so that it can be
     * observed. Set this value initially if you want to start at a certain
     * value. Setting the value immediately stops any smoothing animation.
     */
    get y(): number;
    set y(val: number);
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    target: Element;
    sensitivity: number;
    hasInteracted: boolean;
    epsilon: number;
    /**
     * The portion to lerp towards the target values each frame. Between 0 and 1.
     */
    lerpAmount: number;
    get isStarted(): boolean;
    constructor(options?: Options);
    start(): this;
    stop(): this;
}
export {};
//# sourceMappingURL=ScrollFling.d.ts.map