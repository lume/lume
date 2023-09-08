import { WebGLRenderer } from 'three/src/renderers/WebGLRenderer.js';
import { PMREMGenerator } from 'three/src/extras/PMREMGenerator.js';
import './handle-DOM-absence.js';
import type { Scene } from '../core/Scene.js';
import type { Texture } from 'three/src/textures/Texture.js';
declare const SceneEffects_base: {
    new (...a: any[]): {
        "__#8@#owner": import("solid-js").Owner | null;
        "__#8@#dispose": (() => void) | null;
        createEffect(fn: () => void): void;
        stopEffects(): void;
    };
} & ObjectConstructor;
declare class SceneEffects extends SceneEffects_base {
}
interface SceneState {
    renderer: WebGLRenderer;
    pmremgen?: PMREMGenerator;
    backgroundIsEquirectangular?: boolean;
    hasBackground?: boolean;
    hasEnvironment?: boolean;
    sizeChangeHandler: () => void;
    effects: SceneEffects;
}
export declare type ShadowMapTypeString = 'pcf' | 'pcfsoft' | 'basic';
export declare class WebglRendererThree {
    #private;
    static singleton(): WebglRendererThree;
    private constructor();
    sceneStates: WeakMap<Scene, SceneState>;
    localClippingEnabled: boolean;
    initialize(scene: Scene): void;
    uninitialize(scene: Scene): void;
    drawScene(scene: Scene): void;
    updateResolution(scene: Scene): void;
    setClearColor(scene: Scene, color: any, opacity: number): void;
    setClearAlpha(scene: Scene, opacity: number): void;
    setShadowMapType(scene: Scene, type: ShadowMapTypeString | null): void;
    setPhysicallyCorrectLights(scene: Scene, value: boolean): void;
    enableBackground(scene: Scene, isEquirectangular: boolean, cb: (tex: Texture | undefined) => void): void;
    disableBackground(scene: Scene): void;
    enableEnvironment(scene: Scene, cb: (tex: Texture) => void): void;
    disableEnvironment(scene: Scene): void;
    requestFrame(scene: Scene, fn: FrameRequestCallback): void;
    enableVR(scene: Scene, enable: boolean): void;
    createDefaultVRButton(scene: Scene): HTMLElement;
}
export declare function releaseWebGLRendererThree(): void;
export {};
//# sourceMappingURL=WebglRendererThree.d.ts.map