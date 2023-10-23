import AutoLayout from '@lume/autolayout';
import { Element3D, Element3DAttributes } from '../core/Element3D.js';
export { AutoLayout };
export declare type AutoLayoutNodeAttributes = Element3DAttributes | 'visualFormat';
export declare class AutoLayoutNode extends Element3D {
    #private;
    static DEFAULT_PARSE_OPTIONS: {
        extended: boolean;
        strict: boolean;
    };
    visualFormat: string | null;
    constructor(options: any);
    connectedCallback(): void;
    childConnectedCallback(child: Element3D): void;
    childDisconnectedCallback(child: Element3D): void;
    reflowLayout(): this;
    setVisualFormat(visualFormat: string, parseOptions?: any): this;
    setLayoutOptions(options: any): this;
    addToLayout(child: Element3D, id: string): Element3D;
    removeFromLayout(child: Element3D, id: string): void;
}
import type { ElementAttributes } from '@lume/element';
declare module '@lume/element' {
    namespace JSX {
        interface IntrinsicElements {
            'lume-autolayout-node': ElementAttributes<AutoLayoutNode, AutoLayoutNodeAttributes>;
        }
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'lume-autolayout-node': AutoLayoutNode;
    }
}
//# sourceMappingURL=AutoLayoutNode.d.ts.map