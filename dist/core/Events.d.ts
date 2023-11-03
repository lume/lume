import type { Constructor } from 'lowclass';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { Collada } from 'three/examples/jsm/loaders/ColladaLoader.js';
import type { Group } from 'three/src/objects/Group.js';
import type { BufferGeometry } from 'three/src/core/BufferGeometry.js';
export declare class EventTypes {
    GL_LOAD: undefined;
    GL_UNLOAD: undefined;
    CSS_LOAD: undefined;
    CSS_UNLOAD: undefined;
    BEHAVIOR_GL_LOAD: undefined;
    BEHAVIOR_GL_UNLOAD: undefined;
    MODEL_LOAD: {
        format: 'obj' | 'gltf' | 'collada' | 'fbx' | 'ply';
        model: Group | GLTF | Collada | BufferGeometry;
    };
    MODEL_ERROR: Error;
    PROGRESS: ProgressEvent;
    constructor(GL_LOAD: undefined, GL_UNLOAD: undefined, CSS_LOAD: undefined, CSS_UNLOAD: undefined, BEHAVIOR_GL_LOAD: undefined, BEHAVIOR_GL_UNLOAD: undefined, MODEL_LOAD: {
        format: 'obj' | 'gltf' | 'collada' | 'fbx' | 'ply';
        model: Group | GLTF | Collada | BufferGeometry;
    }, MODEL_ERROR: Error, PROGRESS: ProgressEvent);
}
export declare const Events: Readonly<{
    GL_LOAD: "GL_LOAD";
    GL_UNLOAD: "GL_UNLOAD";
    CSS_LOAD: "CSS_LOAD";
    CSS_UNLOAD: "CSS_UNLOAD";
    BEHAVIOR_GL_LOAD: "BEHAVIOR_GL_LOAD";
    BEHAVIOR_GL_UNLOAD: "BEHAVIOR_GL_UNLOAD";
    MODEL_LOAD: "MODEL_LOAD";
    MODEL_ERROR: "MODEL_ERROR";
    PROGRESS: "PROGRESS";
}>;
export declare function makeEnumFromClassProperties<T>(Class: Constructor<T>): Readonly<{ [k in keyof T]: k; }>;
//# sourceMappingURL=Events.d.ts.map