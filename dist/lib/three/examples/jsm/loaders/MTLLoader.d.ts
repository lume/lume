export class MTLLoader extends Loader {
    constructor(manager: any);
    load(url: string, onLoad?: Function | undefined, onProgress?: Function | undefined, onError?: Function | undefined): void;
    setMaterialOptions(value: any): MTLLoader;
    materialOptions: any;
    parse(text: string, path: any): MaterialCreator;
}
import { Loader } from "three/src/loaders/Loader.js";
declare class MaterialCreator {
    constructor(baseUrl?: string, options?: {});
    baseUrl: string;
    options: {};
    materialsInfo: {};
    materials: {};
    materialsArray: any[];
    nameLookup: {};
    crossOrigin: string;
    side: any;
    wrap: any;
    setCrossOrigin(value: any): MaterialCreator;
    setManager(value: any): void;
    manager: any;
    setMaterials(materialsInfo: any): void;
    convert(materialsInfo: any): any;
    preload(): void;
    getIndex(materialName: any): any;
    getAsArray(): any[];
    create(materialName: any): any;
    createMaterial_(materialName: any): any;
    getTextureParams(value: any, matParams: any): {
        scale: Vector2;
        offset: Vector2;
    };
    loadTexture(url: any, mapping: any, onLoad: any, onProgress: any, onError: any): any;
}
import { Vector2 } from "three/src/math/Vector2.js";
export {};
//# sourceMappingURL=MTLLoader.d.ts.map