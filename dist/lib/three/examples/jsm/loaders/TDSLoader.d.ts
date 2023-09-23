export class TDSLoader extends Loader<any, string> {
    constructor(manager: any);
    debug: boolean;
    group: Group<import("three").Object3DEventMap> | null;
    materials: any[];
    meshes: any[];
    load(url: [type], onLoad: Function, onProgress: Function, onError: Function): void;
    parse(arraybuffer: ArrayBuffer, path: string): Group;
    readFile(arraybuffer: ArrayBuffer, path: string): void;
    readMeshData(chunk: Chunk, path: string): void;
    readNamedObject(chunk: Chunk): void;
    readMaterialEntry(chunk: Chunk, path: string): void;
    readMesh(chunk: Chunk): Mesh;
    readFaceArray(chunk: Chunk, mesh: Mesh): void;
    readMap(chunk: Chunk, path: string): Texture;
    readMaterialGroup(chunk: Chunk): Object;
    readColor(chunk: Chunk): Color;
    readPercentage(chunk: Chunk): number;
    debugMessage(message: Object): void;
}
import { Loader } from "three/src/loaders/Loader.js";
import { Group } from "three/src/objects/Group.js";
declare class Chunk {
    constructor(data: DataView, position: number, debugMessage: Function);
    data: DataView;
    offset: number;
    position: number;
    debugMessage: () => void;
    id: number;
    size: number;
    end: number;
    readChunk(): Chunk | null;
    get hexId(): string;
    get endOfChunk(): boolean;
    readByte(): number;
    readFloat(): number;
    readInt(): number;
    readShort(): number;
    readDWord(): number;
    readWord(): number;
    readString(): string;
}
import { Mesh } from "three/src/objects/Mesh.js";
import { Color } from "three/src/math/Color.js";
export {};
//# sourceMappingURL=TDSLoader.d.ts.map