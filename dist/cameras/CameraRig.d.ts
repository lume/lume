import { StopFunction } from '@lume/element';
import { Element3D, Element3DAttributes } from '../core/Element3D.js';
import { FlingRotation, ScrollFling, PinchFling } from '../interaction/index.js';
import type { PerspectiveCamera } from './PerspectiveCamera.js';
export declare type CameraRigAttributes = Element3DAttributes | 'verticalAngle' | 'minVerticalAngle' | 'maxVerticalAngle' | 'horizontalAngle' | 'minHorizontalAngle' | 'maxHorizontalAngle' | 'distance' | 'minDistance' | 'maxDistance' | 'active' | 'dollySpeed' | 'interactive' | 'initialPolarAngle' | 'minPolarAngle' | 'maxPolarAngle' | 'initialDistance';
export declare class CameraRig extends Element3D {
    #private;
    readonly hasShadow: true;
    verticalAngle: number;
    get initialPolarAngle(): number;
    set initialPolarAngle(value: number);
    minVerticalAngle: number;
    get minPolarAngle(): number;
    set minPolarAngle(value: number);
    maxVerticalAngle: number;
    get maxPolarAngle(): number;
    set maxPolarAngle(value: number);
    horizontalAngle: number;
    minHorizontalAngle: number;
    maxHorizontalAngle: number;
    distance: number;
    get initialDistance(): number;
    set initialDistance(value: number);
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