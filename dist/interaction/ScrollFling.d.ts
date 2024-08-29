import { Effects } from 'classy-solid';
declare const ScrollFling_base: {
    new (...a: any[]): {
        set<T extends any, K extends keyof T, V extends T[K]>(props: Partial<Record<K, V>>): any;
    };
} & typeof Effects;
export declare class ScrollFling extends ScrollFling_base {
    #private;
    private _x;
    /**
     * During scroll, this value will change. It is a signal so that it can be
     * observed. Set this value initially if you want to start at a certain
     * value. Setting the value immediately stops any smoothing animation.
     */
    get x(): number;
    set x(val: number);
    private _y;
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
    epsilon: number;
    /**
     * The portion to lerp towards the target values each frame. Between 0 and 1.
     */
    lerpAmount: number;
    hasInteracted: boolean;
    get isStarted(): boolean;
    start(): this;
    stop(): this;
}
export {};
//# sourceMappingURL=ScrollFling.d.ts.map