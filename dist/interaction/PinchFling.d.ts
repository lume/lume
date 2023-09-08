declare type ScrollFlingOptions = Partial<Pick<PinchFling, 'target' | 'x' | 'minX' | 'maxX' | 'factor'>>;
export declare class PinchFling {
    #private;
    x: number;
    minX: number;
    maxX: number;
    target: Document | ShadowRoot | Element;
    factor: number;
    get interacting(): boolean;
    get isStarted(): boolean;
    constructor(options: ScrollFlingOptions);
    start(): this;
    stop(): this;
}
export {};
//# sourceMappingURL=PinchFling.d.ts.map