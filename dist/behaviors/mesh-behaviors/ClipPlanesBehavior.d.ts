import { ClipPlane } from '../../core/ClipPlane.js';
import { MeshBehavior } from './MeshBehavior.js';
export declare type ClipPlanesBehaviorAttributes = 'clipPlanes' | 'clipIntersection' | 'clipShadows' | 'flipClip' | 'clipDisabled';
export declare class ClipPlanesBehavior extends MeshBehavior {
    #private;
    clipIntersection: boolean;
    clipShadows: boolean;
    get clipPlanes(): Array<ClipPlane>;
    set clipPlanes(value: string | Array<ClipPlane | string>);
    flipClip: boolean;
    clipDisabled: boolean;
    get material(): import("three").Material | null;
    loadGL(): void;
    unloadGL(): void;
}
//# sourceMappingURL=ClipPlanesBehavior.d.ts.map