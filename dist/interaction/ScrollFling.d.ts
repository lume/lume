type ScrollFlingOptions = Partial<Pick<ScrollFling, 'target' | 'x' | 'y' | 'minX' | 'maxX' | 'minY' | 'maxY' | 'scrollFactor'>>;
export declare class ScrollFling {
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
    target: Document | ShadowRoot | Element;
    scrollFactor: number;
    get isStarted(): boolean;
    constructor(options: ScrollFlingOptions);
    start(): this;
    stop(): this;
}
export {};
//# sourceMappingURL=ScrollFling.d.ts.map