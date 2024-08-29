import { Group } from 'three/src/objects/Group.js';
import type { Object3D } from 'three/src/core/Object3D.js';
import type { AnimationClip } from 'three/src/animation/AnimationClip.js';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { Collada } from 'three/examples/jsm/loaders/ColladaLoader.js';
import { Model } from '../Model.js';
export type ThreeModelAsset = GLTF | Collada | Group;
export interface ThreeModel {
    root: Object3D;
    clips: AnimationClip[];
}
/**
 * Given a Model element, returns a signal that will contain the element's
 * loaded model (undefined until loaded). The signal also changes any time the
 * element loads a new model.
 */
export declare function createThreeModelMemo(modelEl: Model): import("solid-js").Accessor<ThreeModel | undefined>;
//# sourceMappingURL=createThreeModelMemo.d.ts.map