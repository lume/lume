import 'element-behaviors';
import { TDSLoader } from 'three/examples/jsm/loaders/TDSLoader.js';
import { ModelBehavior } from './ModelBehavior.js';
import type { Group } from 'three/src/objects/Group.js';
export type TdsModelBehaviorAttributes = 'src';
export declare class TdsModelBehavior extends ModelBehavior {
    #private;
    /** Path to a .3ds file. */
    src: string;
    loader: TDSLoader;
    model?: Group;
    connectedCallback(): void;
}
//# sourceMappingURL=TdsModelBehavior.d.ts.map