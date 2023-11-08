import { SharedAPI } from './SharedAPI.js';
import type { BaseAttributes } from './SharedAPI.js';
export type Element3DAttributes = BaseAttributes | 'visible';
export declare class Element3D extends SharedAPI {
    readonly hasShadow: boolean;
    readonly isElement3D = true;
    visible: boolean;
    get parentSize(): {
        x: number;
        y: number;
        z: number;
    };
    constructor();
    traverseSceneGraph(visitor: (node: Element3D) => void, waitForUpgrade?: boolean): Promise<void> | void;
    _loadCSS(): boolean;
    _loadGL(): boolean;
}
import type { ElementAttributes } from '@lume/element';
declare module '@lume/element' {
    namespace JSX {
        interface IntrinsicElements {
            'lume-element3d': ElementAttributes<Element3D, Element3DAttributes>;
        }
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'lume-element3d': Element3D;
    }
}
//# sourceMappingURL=Element3D.d.ts.map