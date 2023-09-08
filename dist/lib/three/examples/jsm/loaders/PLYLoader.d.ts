export class PLYLoader extends Loader {
    constructor(manager: any);
    propertyNameMapping: {};
    load(url: any, onLoad: any, onProgress: any, onError: any): void;
    setPropertyNameMapping(mapping: any): void;
    parse(data: any): BufferGeometry<import("three/src/core/BufferGeometry.js").NormalBufferAttributes>;
}
import { Loader } from "three/src/loaders/Loader.js";
import { BufferGeometry } from "three/src/core/BufferGeometry.js";
//# sourceMappingURL=PLYLoader.d.ts.map