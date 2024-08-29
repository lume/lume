import 'element-behaviors';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { ModelBehavior } from './ModelBehavior.js';
import type { Group } from 'three/src/objects/Group.js';
import type { ElementBehaviors } from 'element-behaviors';
declare global {
    interface Element extends ElementBehaviors {
    }
}
export type ObjModelBehaviorAttributes = 'obj' | 'mtl';
export declare class ObjModelBehavior extends ModelBehavior {
    #private;
    obj: string;
    mtl: string;
    model?: Group;
    objLoader: OBJLoader;
    mtlLoader: MTLLoader;
    connectedCallback(): void;
}
//# sourceMappingURL=ObjModelBehavior.d.ts.map