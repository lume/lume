import type { Constructor } from 'lowclass/dist/Constructor.js';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { Collada } from 'three/examples/jsm/loaders/ColladaLoader.js';
import type { Group } from 'three/src/objects/Group.js';
import type { BufferGeometry } from 'three/src/core/BufferGeometry.js';
export declare class EventTypes {
    MODEL_LOAD: {
        format: 'obj' | 'gltf' | 'collada' | 'fbx' | 'ply';
        model: Group | GLTF | Collada | BufferGeometry;
    };
    MODEL_ERROR: Error;
    PROGRESS: ProgressEvent;
    constructor(MODEL_LOAD: {
        format: 'obj' | 'gltf' | 'collada' | 'fbx' | 'ply';
        model: Group | GLTF | Collada | BufferGeometry;
    }, MODEL_ERROR: Error, PROGRESS: ProgressEvent);
}
export declare const Events: Readonly<{
    MODEL_LOAD: "MODEL_LOAD";
    MODEL_ERROR: "MODEL_ERROR";
    PROGRESS: "PROGRESS";
}>;
export declare function makeEnumFromClassProperties<T>(Class: Constructor<T>): Readonly<{ [k in keyof T]: k; }>;
//# sourceMappingURL=Events.d.ts.map