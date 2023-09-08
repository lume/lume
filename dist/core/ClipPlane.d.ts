import { ElementAttributes } from '@lume/element';
import { Plane } from 'three/src/math/Plane.js';
import { Element3D, Element3DAttributes } from './Element3D.js';
declare type ClipPlaneAttributes = Element3DAttributes;
export declare class ClipPlane extends Element3D {
    #private;
    get __clip(): Readonly<Plane> | null;
    get __inverseClip(): Readonly<Plane> | null;
    _loadGL(): boolean;
    _unloadGL(): boolean;
    updateWorldMatrices(): void;
}
declare module '@lume/element' {
    namespace JSX {
        interface IntrinsicElements {
            'lume-clip-plane': ElementAttributes<ClipPlane, ClipPlaneAttributes>;
        }
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'lume-clip-plane': ClipPlane;
    }
}
export {};
//# sourceMappingURL=ClipPlane.d.ts.map