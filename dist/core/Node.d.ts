import { Element3D, Element3DAttributes } from './Element3D.js';
import { ElementAttributes } from '@lume/element';
export declare type NodeAttributes = Element3DAttributes;
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