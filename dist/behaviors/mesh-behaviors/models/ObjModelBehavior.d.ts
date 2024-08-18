import 'element-behaviors';
import type { ElementBehaviors } from 'element-behaviors';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import type { Group } from 'three/src/objects/Group.js';
import { ModelBehavior } from './ModelBehavior.js';
import { ObjModel } from '../../../models/ObjModel.js';
declare global {
    interface Element extends ElementBehaviors {
    }
}
export type ObjModelBehaviorAttributes = 'obj' | 'mtl';
/**
 * A behavior containing the logic that loads OBJ models for `<lume-obj-model>`
 * elements.
 * @deprecated Don't use this behavior directly, instead use a `<lume-obj-model>` element.
 * @extends ModelBehavior
 */
export declare class ObjModelBehavior extends ModelBehavior {
    #private;
    obj: string;
    mtl: string;
    model?: Group;
    element: ObjModel;
    requiredElementType(): (typeof ObjModel)[];
    objLoader: OBJLoader;
    mtlLoader: MTLLoader;
    connectedCallback(): void;
}
//# sourceMappingURL=ObjModelBehavior.d.ts.map