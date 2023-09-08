import 'element-behaviors';
import { OBJLoader } from '../../../lib/three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from '../../../lib/three/examples/jsm/loaders/MTLLoader.js';
import { RenderableBehavior } from '../../RenderableBehavior.js';
import type { Group } from 'three/src/objects/Group.js';
import type { ElementBehaviors } from 'element-behaviors';
declare global {
    interface Element extends ElementBehaviors {
    }
}
export declare type ObjModelBehaviorAttributes = 'obj' | 'mtl';
export declare class ObjModelBehavior extends RenderableBehavior {
    #private;
    obj: string;
    mtl: string;
    model?: Group;
    objLoader?: OBJLoader;
    mtlLoader?: MTLLoader;
    loadGL(): void;
    unloadGL(): void;
}
//# sourceMappingURL=ObjModelBehavior.d.ts.map