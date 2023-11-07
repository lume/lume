import 'element-behaviors';
import type { ElementWithBehaviors } from 'element-behaviors';
declare const Behavior_base: {
    new (...args: any[]): {
        connectedCallback(): void;
        disconnectedCallback(): void;
        readonly observedObject: object;
        _propChangedCallback(propName: PropertyKey, value: any): void;
        "__#5@#observeProps"(): void;
        "__#5@#unobserveProps"(): void;
        __forwardedProps(): never[];
        __forwardInitialProps(): void;
        adoptedCallback?(): void;
        attributeChangedCallback?(name: string, oldVal: string | null, newVal: string | null): void;
    };
    receivedProperties?: PropertyKey[] | undefined;
} & (new (...a: any[]) => import("./PropReceiver.js").PossiblyCustomElement);
export declare abstract class Behavior extends Behavior_base {
    #private;
    static awaitElementDefined: boolean;
    element: Element;
    constructor(element: ElementWithBehaviors);
    requiredElementType(): {
        new (): Element;
        prototype: Element;
    }[];
    get observedObject(): Element;
    __forwardInitialProps(): void;
}
export {};
//# sourceMappingURL=Behavior.d.ts.map