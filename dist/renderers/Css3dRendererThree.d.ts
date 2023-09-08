import { CSS3DRendererNested } from './CSS3DRendererNested.js';
import type { Scene } from '../core/Scene.js';
interface SceneState {
    renderer: CSS3DRendererNested;
    sizeChangeHandler: () => void;
}
export declare class Css3dRendererThree {
    static singleton(): Css3dRendererThree;
    private constructor();
    sceneStates: WeakMap<Scene, SceneState>;
    initialize(scene: Scene): void;
    uninitialize(scene: Scene): void;
    drawScene(scene: Scene): void;
    updateResolution(scene: Scene): void;
    requestFrame(_scene: Scene, fn: FrameRequestCallback): void;
}
export declare function releaseCSS3DRendererThree(): void;
export {};
//# sourceMappingURL=Css3dRendererThree.d.ts.map