export class ColladaLoader extends Loader {
    constructor(manager: any);
    load(url: any, onLoad: any, onProgress: any, onError: any): void;
    parse(text: any, path: any): {
        scene: Scene;
        readonly animations?: undefined;
        kinematics?: undefined;
        library?: undefined;
    } | {
        readonly animations: any[];
        kinematics: {};
        library: {
            animations: {};
            clips: {};
            controllers: {};
            images: {};
            effects: {};
            materials: {};
            cameras: {};
            lights: {};
            geometries: {};
            nodes: {};
            visualScenes: {};
            kinematicsModels: {};
            physicsModels: {};
            kinematicsScenes: {};
        };
        scene: any;
    } | null;
}
import { Loader } from "three/src/loaders/Loader.js";
import { Scene } from "three/src/scenes/Scene.js";
//# sourceMappingURL=ColladaLoader.d.ts.map