import { ElementAttributes } from '@lume/element';
import { Element3D, Element3DAttributes } from '../core/Element3D.js';
declare type CubeLayoutAttributes = Element3DAttributes;
export declare class CubeLayout extends Element3D {
    #private;
    readonly hasShadow = true;
    connectedCallback(): void;
    setContent(content: Element3D[]): this;
}
declare module '@lume/element' {
    namespace JSX {
        interface IntrinsicElements {
            'lume-cube-layout': ElementAttributes<CubeLayout, CubeLayoutAttributes>;
        }
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'lume-cube-layout': CubeLayout;
    }
}
export {};
//# sourceMappingURL=CubeLayout.d.ts.map