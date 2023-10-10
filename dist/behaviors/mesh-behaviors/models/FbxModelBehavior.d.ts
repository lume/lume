import 'element-behaviors';
import { FBXLoader } from '../../../lib/three/examples/jsm/loaders/FBXLoader.js';
import { RenderableBehavior } from '../../RenderableBehavior.js';
import type { Group } from 'three/src/objects/Group.js';
export declare type FbxModelBehaviorAttributes = 'src' | 'centerGeometry';
export declare class FbxModelBehavior extends RenderableBehavior {
    #private;
    src: string;
    centerGeometry: boolean;
    loader?: FBXLoader;
    model?: Group;
    loadGL(): void;
    unloadGL(): void;
}
//# sourceMappingURL=FbxModelBehavior.d.ts.map