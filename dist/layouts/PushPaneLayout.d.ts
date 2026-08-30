import { type ElementAttributes } from '@lume/element';
import { Node, type NodeAttributes } from '../core/Node.js';
export type PushPaneLayoutAttributes = NodeAttributes;
export declare class PushPaneLayout extends Node {
}
declare module 'solid-js' {
    namespace JSX {
        interface IntrinsicElements {
            'lume-push-pane-layout': ElementAttributes<PushPaneLayout, PushPaneLayoutAttributes>;
        }
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'lume-push-pane-layout': PushPaneLayout;
    }
}
//# sourceMappingURL=PushPaneLayout.d.ts.map