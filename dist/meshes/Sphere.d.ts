import { Mesh, MeshAttributes } from './Mesh.js';
export declare type SphereAttributes = MeshAttributes;
export declare class Sphere extends Mesh {
    static defaultBehaviors: {
        'sphere-geometry': (initialBehaviors: string[]) => boolean;
        'phong-material': (initialBehaviors: string[]) => boolean;
    };
}
declare global {
    interface HTMLElementTagNameMap {
        'lume-sphere': Sphere;
    }
}
declare module '@lume/element' {
    namespace JSX {
        interface IntrinsicElements {
            'lume-sphere': JSX.IntrinsicElements['lume-mesh'];
        }
    }
}
//# sourceMappingURL=Sphere.d.ts.map