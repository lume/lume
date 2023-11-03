import 'element-behaviors';
import { TDSLoader } from 'three/examples/jsm/loaders/TDSLoader.js';
import { RenderableBehavior } from '../../RenderableBehavior.js';
import type { Group } from 'three/src/objects/Group.js';
export declare type TdsModelBehaviorAttributes = 'src';
export declare class TdsModelBehavior extends RenderableBehavior {
    #private;
    src: string;
    loader?: TDSLoader;
    model?: Group;
    loadGL(): void;
    unloadGL(): void;
}
//# sourceMappingURL=TdsModelBehavior.d.ts.map