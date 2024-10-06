import type { Constructor } from 'lowclass/dist/Constructor.js';
export interface PossiblyCustomElement {
    connectedCallback?(): void;
    disconnectedCallback?(): void;
    adoptedCallback?(): void;
    attributeChangedCallback?(name: string, oldVal: string | null, newVal: string | null): void;
}
export interface PossibleCustomElement extends PossiblyCustomElement, HTMLElement {
}
export interface PossibleCustomElementConstructor extends Constructor<HTMLElement> {
    observedAttributes?: string[];
}
//# sourceMappingURL=PossibleCustomElement.d.ts.map