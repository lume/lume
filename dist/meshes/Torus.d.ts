import { Mesh } from './Mesh.js';
import type { MeshAttributes } from './Mesh.js';
export type TorusAttributes = MeshAttributes;
export declare class Torus extends Mesh {
    static defaultBehaviors: {
        'torus-geometry': (initialBehaviors: any) => boolean;
        'phong-material': (initialBehaviors: any) => boolean;
    };
}
declare global {
    interface HTMLElementTagNameMap {
        'lume-torus': Torus;
    }
}
declare module '@lume/element' {
    namespace JSX {
        interface IntrinsicElements {
            'lume-torus': JSX.IntrinsicElements['lume-mesh'];
        }
    }
}
//# sourceMappingURL=Torus.d.ts.map