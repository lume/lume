import { Mesh } from './Mesh.js';
import type { MeshAttributes } from './Mesh.js';
export declare type BoxAttributes = MeshAttributes;
export declare class Box extends Mesh {
    static defaultBehaviors: {
        'box-geometry': (initialBehaviors: any) => boolean;
        'phong-material': (initialBehaviors: any) => boolean;
    };
}
declare global {
    interface HTMLElementTagNameMap {
        'lume-box': Box;
    }
}
declare module '@lume/element' {
    namespace JSX {
        interface IntrinsicElements {
            'lume-box': JSX.IntrinsicElements['lume-mesh'];
        }
    }
}
//# sourceMappingURL=Box.d.ts.map