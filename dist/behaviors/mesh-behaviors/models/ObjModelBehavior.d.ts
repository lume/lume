import 'element-behaviors';
import type { ElementBehaviors } from 'element-behaviors';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import type { Group } from 'three/src/objects/Group.js';
import { RenderableBehavior } from '../../RenderableBehavior.js';
declare global {
    interface Element extends ElementBehaviors {
    }
}
export type ObjModelBehaviorAttributes = 'obj' | 'mtl';
export declare class ObjModelBehavior extends RenderableBehavior {
    #private;
    obj: string;
    mtl: string;
    model?: Group;
    objLoader: OBJLoader;
    mtlLoader: MTLLoader;
    connectedCallback(): void;
}
//# sourceMappingURL=ObjModelBehavior.d.ts.map