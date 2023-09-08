declare type ScrollFlingOptions = Partial<Pick<ScrollFling, 'target' | 'x' | 'y' | 'minX' | 'maxX' | 'minY' | 'maxY' | 'scrollFactor'>>;
export declare class ScrollFling {
    #private;
    x: number;
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