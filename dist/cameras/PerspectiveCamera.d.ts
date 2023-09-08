import { PerspectiveCamera as ThreePerspectiveCamera } from 'three/src/cameras/PerspectiveCamera.js';
import { Element3D, Element3DAttributes } from '../core/Element3D.js';
export declare type PerspectiveCameraAttributes = Element3DAttributes | 'fov' | 'aspect' | 'near' | 'far' | 'zoom' | 'active';
export declare class PerspectiveCamera extends Element3D {
    #private;
    fov: number;
    aspect: number;
    near: number;
    far: number;
    zoom: number;
    active: boolean;
    connectedCallback(): void;
    makeThreeObject3d(): ThreePerspectiveCamera;
    disconnectedCallback(): void;
}
import type { ElementAttributes } from '@lume/element';
declare module '@lume/element' {
    namespace JSX {
        interface IntrinsicElements {
            'lume-perspective-camera': ElementAttributes<PerspectiveCamera, PerspectiveCameraAttributes>;
        }
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'lume-perspective-camera': PerspectiveCamera;
    }
}
//# sourceMappingURL=PerspectiveCamera.d.ts.map