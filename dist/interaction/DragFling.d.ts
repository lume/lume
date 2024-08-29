import { Effects } from 'classy-solid';
declare const DragFling_base: {
    new (...a: any[]): {
        set<T extends any, K extends keyof T, V extends T[K]>(props: Partial<Record<K, V>>): any;
    };
} & typeof Effects;
export declare class DragFling extends DragFling_base {
    #private;
    private _x;
    /**
     * During drag, this value will change. It is a signal so that it can be
     * observed. Set this value initially if you want to start at a certain
     * value.
     */
    get x(): number;
    set x(val: number);
    private _y;
    /**
     * During drag, this value will change. It is a signal so that it can be
     * observed. Set this value initially if you want to start at a certain
     * value.
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
     * Portion of the change in value that is removed each frame to
     * cause slowdown. Between 0 and 1.
     */
    slowdownAmount: number;
    invertY: boolean;
    invertX: boolean;
    /**
     * The allowed pointer types to use for dragging ('mouse', 'pen', or
     * 'touch'). Default is all of them.
     */
    pointerTypes: ('mouse' | 'pen' | 'touch')[];
    get interacting(): boolean;
    get isStarted(): boolean;
    start(): this;
    stop(): this;
}
export {};
//# sourceMappingURL=DragFling.d.ts.map