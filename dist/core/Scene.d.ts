import { Scene as ThreeScene } from 'three/src/scenes/Scene.js';
import { PerspectiveCamera as ThreePerspectiveCamera } from 'three/src/cameras/PerspectiveCamera.js';
import { type ShadowMapTypeString } from '../renderers/WebglRendererThree.js';
import { SharedAPI } from './SharedAPI.js';
import type { TColor } from '../utils/three.js';
import type { PerspectiveCamera } from '../cameras/PerspectiveCamera.js';
import type { XYZValuesObject } from '../xyz-values/XYZValues.js';
import type { SizeableAttributes } from './Sizeable.js';
import type { Element3D } from './Element3D.js';
export type SceneAttributes = SizeableAttributes | 'shadowmapType' | 'vr' | 'webgl' | 'enableCss' | 'swapLayers' | 'backgroundColor' | 'backgroundOpacity' | 'background' | 'equirectangularBackground' | 'environment' | 'fogMode' | 'fogNear' | 'fogFar' | 'fogColor' | 'fogDensity' | 'physicallyCorrectLights' | 'cameraNear' | 'cameraFar' | 'perspective';
export declare class Scene extends SharedAPI {
    #private;
    readonly isScene = true;
    skipShadowObservation: boolean;
    enableCss: boolean;
    webgl: boolean;
    swapLayers: boolean;
    shadowmapType: ShadowMapTypeString | null;
    vr: boolean;
    backgroundColor: TColor | null;
    backgroundOpacity: number;
    background: string | null;
    equirectangularBackground: boolean;
    environment: string | null;
    fogMode: FogMode;
    fogNear: number;
    fogFar: number;
    fogColor: string;
    fogDensity: number;
    physicallyCorrectLights: boolean;
    cameraNear: number;
    cameraFar: number;
    set perspective(value: number);
    get perspective(): number;
    get threeCamera(): ThreePerspectiveCamera;
    __threeCamera: ThreePerspectiveCamera;
    get camera(): PerspectiveCamera | null;
    get glRenderer(): import("three").WebGLRenderer | undefined;
    get cssRenderer(): import("../renderers/CSS3DRendererNested.js").CSS3DRendererNested | undefined;
    __camera: PerspectiveCamera | null;
    __localClipping: boolean;
    constructor();
    _glLayer: HTMLDivElement | null;
    _cssLayer: HTMLDivElement | null;
    _miscLayer: HTMLDivElement | null;
    drawScene(): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    static observedAttributes: string[];
    attributeChangedCallback(name: string, oldV: string | null, newV: string | null): void;
    makeThreeObject3d(): ThreeScene;
    makeThreeCSSObject(): ThreeScene;
    traverseSceneGraph(visitor: (el: Element3D) => void, waitForUpgrade?: boolean): Promise<void> | void;
    _createDefaultCamera(): void;
    _updateCameraPerspective(): void;
    _updateCameraAspect(): void;
    _updateCameraProjection(): void;
    __activeCameras?: Set<PerspectiveCamera>;
    _addCamera(camera: PerspectiveCamera): void;
    _removeCamera(camera: PerspectiveCamera): void;
    get parentSize(): XYZValuesObject<number>;
    _loadGL(): boolean;
    _unloadGL(): boolean;
    _loadCSS(): boolean;
    _unloadCSS(): boolean;
    __setCamera(camera?: PerspectiveCamera): void;
    __elementParentSize: XYZValuesObject<number>;
    template: () => Node | Node[];
    static css: string;
}
import type { ElementAttributes } from '@lume/element';
declare module '@lume/element' {
    namespace JSX {
        interface IntrinsicElements {
            'lume-scene': ElementAttributes<Scene, SceneAttributes>;
        }
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'lume-scene': Scene;
    }
}
type FogMode = 'none' | 'linear' | 'expo2';
export {};
//# sourceMappingURL=Scene.d.ts.map