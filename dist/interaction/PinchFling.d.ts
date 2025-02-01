import { Effects } from 'classy-solid';
declare const PinchFling_base: {
    new (...a: any[]): {
        set<T extends any, K extends keyof T, V extends T[K]>(props: Partial<Record<K, V>>): any;
    };
} & typeof Effects;
export declare class PinchFling extends PinchFling_base {
    #private;
    /**
     * During pinch, this value will change. It is a signal so that it can be
     * observed. Set this value initially if you want to start at a certain
     * value.
     */
    x: number;
    minX: number;
    maxX: number;
    target: Element;
    sensitivity: number;
    hasInteracted: boolean;
    epsilon: number;
    /**
     * Portion of the change in value that is removed each frame to
     * cause slowdown. Between 0 and 1.
     */
    slowdownAmount: number;
    get interacting(): boolean;
    get isStarted(): boolean;
    start(): this;
    stop(): this;
}
export {};
//# sourceMappingURL=PinchFling.d.ts.map