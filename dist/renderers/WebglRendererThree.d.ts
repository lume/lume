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
/** @typedef {'pcf' | 'pcfsoft' | 'basic'} ShadowMapTypeString */
export type ShadowMapTypeString = 'pcf' | 'pcfsoft' | 'basic';
/**
 * @internal
 * A singleton responsible for setting up and
 * drawing a WebGL scene for a given core/Scene using Three.js
 */
export declare class WebglRendererThree {
    #private;
    static singleton(): WebglRendererThree;
    constructor();
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
    /**
     * @method enableBackground - Enable background texture handling for the given scene.
     * @param {Scene} scene - The given scene.
     * @param {boolean} isEquirectangular - True if the background is equirectangular (to use as an environment map), false for a static background image.
     * @param {(t: Texture | undefined) => void} cb - A callback that is called
     * when the background mechanics are done loading. The Callback receives the
     * background Texture instance.
     */
    enableBackground(scene: Scene, isEquirectangular: boolean, cb: (tex: Texture | undefined) => void): void;
    /**
     * @method disableBackground - Disable background for the given scene.
     * @param {Scene} scene - The given scene.
     */
    disableBackground(scene: Scene): void;
    /**
     * @method enableEnvironment - Enable environment texture handling for the given scene.
     * @param {Scene} scene - The given scene.
     * @param {(t: Texture | undefined) => void} cb - A callback that is called
     * when the environment mechanics are done loading. The Callback receives the
     * background Texture instance.
     */
    enableEnvironment(scene: Scene, cb: (tex: Texture) => void): void;
    /**
     * @method disableEnvironment - Disable the environment map for the given scene.
     * @param {Scene} scene - The given scene.
     */
    disableEnvironment(scene: Scene): void;
    requestFrame(scene: Scene, fn: FrameRequestCallback): void;
    enableVR(scene: Scene, enable: boolean): void;
    createDefaultVRButton(scene: Scene): HTMLElement;
}
export declare function releaseWebGLRendererThree(): void;
export {};
//# sourceMappingURL=WebglRendererThree.d.ts.map