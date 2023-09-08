import { Mesh, MeshAttributes } from './Mesh.js';
export declare type MixedPlaneAttributes = MeshAttributes;
export declare class MixedPlane extends Mesh {
    static defaultBehaviors: {
        'mixedplane-geometry': (initialBehaviors: any) => boolean;
        'mixedplane-material': (initialBehaviors: any) => boolean;
    };
    get isMixedPlane(): boolean;
}
declare module '@lume/element' {
    namespace JSX {
        interface IntrinsicElements {
            'lume-mixed-plane': JSX.IntrinsicElements['lume-mesh'];
        }
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'lume-mixed-plane': MixedPlane;
    }
}
//# sourceMappingURL=MixedPlane.d.ts.map