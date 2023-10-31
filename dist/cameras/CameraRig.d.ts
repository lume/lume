import { StopFunction } from '@lume/element';
import { Element3D, Element3DAttributes } from '../core/Element3D.js';
import { FlingRotation, ScrollFling, PinchFling } from '../interaction/index.js';
import type { PerspectiveCamera } from './PerspectiveCamera.js';
export declare type CameraRigAttributes = Element3DAttributes | 'initialPolarAngle' | 'verticalAngle' | 'minPolarAngle' | 'minVerticalAngle' | 'maxPolarAngle' | 'maxVerticalAngle' | 'initialDistance' | 'distance' | 'minDistance' | 'maxDistance' | 'active' | 'dollySpeed' | 'interactive';
export declare class CameraRig extends Element3D {
    #private;
    readonly hasShadow: true;
    verticalAngle: number;
    initialPolarAngle: number;
    minVerticalAngle: number;
    minPolarAngle: number;
    maxVerticalAngle: number;
    maxPolarAngle: number;
    horizontalAngle: number;
    minHorizontalAngle: number;
    maxHorizontalAngle: number;
    distance: number;
    initialDistance: number;
    minDistance: number;
    maxDistance: number;
    active: boolean;
    dollySpeed: number;
    interactive: boolean;
    cam?: PerspectiveCamera;
    rotationYTarget?: Element3D;
    template: () => Node | Node[];
    flingRotation: FlingRotation | null;
    scrollFling: ScrollFling | null;
    pinchFling: PinchFling | null;
    autorunStoppers?: StopFunction[];
    startInteraction(): void;
    stopInteraction(): void;
    _loadGL(): boolean;
    _loadCSS(): boolean;
    _unloadGL(): boolean;
    _unloadCSS(): boolean;
    disconnectedCallback(): void;
}
import type { ElementAttributes } from '@lume/element';
declare module '@lume/element' {
    namespace JSX {
        interface IntrinsicElements {
            'lume-camera-rig': ElementAttributes<CameraRig, CameraRigAttributes>;
        }
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'lume-camera-rig': CameraRig;
    }
}
//# sourceMappingURL=CameraRig.d.ts.map