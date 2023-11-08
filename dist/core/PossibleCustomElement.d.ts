import type { Constructor } from 'lowclass';
export interface PossibleCustomElement extends HTMLElement {
    connectedCallback?(): void;
    disconnectedCallback?(): void;
    adoptedCallback?(): void;
    attributeChangedCallback?(name: string, oldVal: string | null, newVal: string | null): void;
}
export interface PossibleCustomElementConstructor extends Constructor<HTMLElement> {
    observedAttributes?: string[];
}
//# sourceMappingURL=PossibleCustomElement.d.ts.map