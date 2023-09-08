import type { Constructor } from 'lowclass';
export declare function PropReceiver<T extends Constructor<CustomElementLike>>(Base?: T): {
    new (...args: any[]): {
        connectedCallback(): void;
        disconnectedCallback(): void;
        readonly observedObject: object;
        _propChangedCallback(propName: string, value: any): void;
        "__#5@#observeProps"(): void;
        "__#5@#unobserveProps"(): void;
        __forwardedProps(): string[];
        __forwardInitialProps(): void;
        adoptedCallback?(): void;
        attributeChangedCallback?(name: string, oldVal: string | null, newVal: string | null): void;
    };
    receivedProperties?: string[] | undefined;
} & T;
export interface CustomElementLike {
    connectedCallback?(): void;
    disconnectedCallback?(): void;
    adoptedCallback?(): void;
    attributeChangedCallback?(name: string, oldVal: string | null, newVal: string | null): void;
}
export declare function receiver(...args: any[]): any;
export declare function decoratorAbstraction(decorator: (prototype: any, propName: string, _descriptor?: PropertyDescriptor) => void, handlerOrProtoOrFactoryArg?: any, propName?: string, descriptor?: PropertyDescriptor): any;
//# sourceMappingURL=PropReceiver.d.ts.map