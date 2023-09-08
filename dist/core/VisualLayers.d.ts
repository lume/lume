import { Scene as ThreeScene } from 'three/src/scenes/Scene.js';
import type { Camera, Object3D, Renderer } from 'three';
export declare class VisualLayers {
    __layers: Array<Layer>;
    __renderer: Renderer;
    __Scene: typeof ThreeScene;
    constructor(renderer: Renderer, Scene?: typeof ThreeScene);
    dispose(): void;
    defineLayer(layerName: LayerName, order?: number): Layer;
    setLayerVisible(layerNames: LayerNames, visible: boolean): void;
    __setLayerVisible(layerName: LayerName, visible: boolean): void;
    __getOrMakeLayer(layerName: LayerName): Layer;
    removeLayer(layerName: LayerName): void;
    hasLayer(layerName: LayerName): boolean;
    get layerCount(): number;
    addObjectToLayer(obj: Object3D, layerNames: LayerNames, withSubtree?: boolean): void;
    addObjectsToLayer(objects: Object3D[], layerNames: LayerNames, withSubtree?: boolean): void;
    addObjectToAllLayers(obj: Object3D, withSubtree?: boolean): void;
    addObjectsToAllLayers(objects: Object3D[], withSubtree?: boolean): void;
    readonly __emptyArray: readonly never[];
    __addObjectToLayer(obj: Object3D, layerName: LayerName, withSubtree: boolean): void;
    __layerHasObject(layer: Layer, obj: Object3D): boolean;
    removeObjectFromLayer(obj: Object3D, layerNames: LayerNames): void;
    removeObjectsFromLayer(objects: Object3D[], layerNames: LayerNames): void;
    removeObjectFromAllLayers(obj: Object3D): void;
    removeObjectsFromAllLayers(objects: Object3D[]): void;
    __removeObjectFromLayer(obj: Object3D, layer: Layer | undefined): void;
    render(camera: Camera, beforeAll?: BeforeAllCallback, beforeEach?: BeforeEachCallback, afterEach?: AfterEachCallback): void;
    __defaultBeforeAllCallback: () => void;
    __defaultBeforeEachCallback: () => void;
    __defaultAfterEachCallback: () => void;
}
declare type LayerName = string;
declare type LayerNames = LayerName | LayerName[];
declare type Layer = {
    name: LayerName;
    backingScene: THREE.Scene;
    order: number;
    visible: boolean;
};
declare type BeforeEachCallback = (layerName: LayerName) => void;
declare type BeforeAllCallback = () => void;
declare type AfterEachCallback = (layerName: LayerName) => void;
export {};
//# sourceMappingURL=VisualLayers.d.ts.map