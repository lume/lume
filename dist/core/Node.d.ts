import { Element3D, type Element3DAttributes } from './Element3D.js';
import { type ElementAttributes } from '@lume/element';
export type NodeAttributes = Element3DAttributes;
export declare class Node extends Element3D {
    readonly isNode = true;
}
declare module '@lume/element' {
    namespace JSX {
        interface IntrinsicElements {
            'lume-node': ElementAttributes<Node, NodeAttributes>;
        }
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'lume-node': Node;
    }
}
//# sourceMappingURL=Node.d.ts.map