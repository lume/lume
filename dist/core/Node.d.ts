import { Element3D, type Element3DAttributes } from './Element3D.js';
import { type ElementAttributes } from '@lume/element';
/** @deprecated Use `Element3DAttributes` instead. */
export type NodeAttributes = Element3DAttributes;
/** @deprecated Use `Element3D` (`<lume-element3d>`) instead. */
export declare class Node extends Element3D {
    /**
     * @property {true} isNode -
     *
     * *readonly*
     *
     * Always `true` for things that are or inherit from `Node`.
     *
     * @deprecated Use `Element3D`, `<lume-element3d>`, and `.isElement3D` instead.
     */
    readonly isNode = true;
}
declare module 'solid-js' {
    namespace JSX {
        interface IntrinsicElements {
            /** @deprecated Use Element3D (<lume-element3d>) instead. */
            'lume-node': ElementAttributes<Node, NodeAttributes>;
        }
    }
}
declare global {
    interface HTMLElementTagNameMap {
        /** @deprecated Use Element3D (<lume-element3d>) instead. */
        'lume-node': Node;
    }
}
//# sourceMappingURL=Node.d.ts.map