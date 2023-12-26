import { Effects } from 'classy-solid';
type Options = Partial<Pick<ScrollFling, 'target' | 'x' | 'y' | 'minX' | 'maxX' | 'minY' | 'maxY' | 'sensitivity' | 'hasInteracted'>>;
export declare class ScrollFling extends Effects {
    #private;
    /**
     * During scroll, this value will change. It is a signal so that it can be
     * observed. Set this value initially if you want to start at a certain
     * value.
     */
    x: number;
    /**
     * During scroll, this value will change. It is a signal so that it can be
     * observed. Set this value initially if you want to start at a certain
     * value.
     */
    y: number;
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    target: Element;
    sensitivity: number;
    hasInteracted: boolean;
    get isStarted(): boolean;
    constructor(options?: Options);
    start(): this;
    stop(): this;
}
export {};
//# sourceMappingURL=ScrollFling.d.ts.map