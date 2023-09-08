import { Mesh, MeshAttributes } from './Mesh.js';
export declare type PlaneAttributes = MeshAttributes;
export declare class Plane extends Mesh {
    static defaultBehaviors: {
        'plane-geometry': (initialBehaviors: string[]) => boolean;
        'phong-material': (initialBehaviors: string[]) => boolean;
    };
}
declare module '@lume/element' {
    namespace JSX {
        interface IntrinsicElements {
            'lume-plane': JSX.IntrinsicElements['lume-mesh'];
        }
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'lume-plane': Plane;
    }
}
//# sourceMappingURL=Plane.d.ts.map