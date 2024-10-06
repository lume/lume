declare const _ErrorEvent: {
    new (type: string, eventInitDict?: ErrorEventInit): globalThis.ErrorEvent;
    prototype: globalThis.ErrorEvent;
};
/**
 * @class ErrorEvent - An elements that loads any content will dispatch this
 * event if loading fails.
 * @extends globalThis.ErrorEvent
 */
export declare class ErrorEvent extends _ErrorEvent {
    static type: string;
    static defaultOptions: ErrorEventInit;
    constructor(error?: string | Error, options?: ErrorEventInit);
}
export declare function normalizeError(error: unknown): Error;
export {};
//# sourceMappingURL=ErrorEvent.d.ts.map