export class DRACOLoader extends Loader<any, string> {
    constructor(manager: any);
    decoderPath: string;
    decoderConfig: {};
    decoderBinary: any;
    decoderPending: Promise<void> | null;
    workerLimit: number;
    workerPool: any[];
    workerNextTaskID: number;
    workerSourceURL: string;
    defaultAttributeIDs: {
        position: string;
        normal: string;
        color: string;
        uv: string;
    };
    defaultAttributeTypes: {
        position: string;
        normal: string;
        color: string;
        uv: string;
    };
    setDecoderPath(path: any): DRACOLoader;
    setDecoderConfig(config: any): DRACOLoader;
    setWorkerLimit(workerLimit: any): DRACOLoader;
    load(url: any, onLoad: any, onProgress: any, onError: any): void;
    decodeDracoFile(buffer: any, callback: any, attributeIDs: any, attributeTypes: any): void;
    decodeGeometry(buffer: any, taskConfig: any): any;
    _createGeometry(geometryData: any): BufferGeometry<import("three/src/core/BufferGeometry.js").NormalBufferAttributes>;
    _loadLibrary(url: any, responseType: any): Promise<any>;
    preload(): DRACOLoader;
    _initDecoder(): Promise<void>;
    _getWorker(taskID: any, taskCost: any): Promise<any>;
    _releaseTask(worker: any, taskID: any): void;
    debug(): void;
    dispose(): DRACOLoader;
}
import { Loader } from "three/src/loaders/Loader.js";
import { BufferGeometry } from "three/src/core/BufferGeometry.js";
//# sourceMappingURL=DRACOLoader.d.ts.map