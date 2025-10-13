import { TDSLoader } from 'three/examples/jsm/loaders/TDSLoader.js';
import { RenderableBehavior } from '../../RenderableBehavior.js';
import type { Group } from 'three/src/objects/Group.js';
export type TdsModelBehaviorAttributes = 'src';
export declare class TdsModelBehavior extends RenderableBehavior {
    #private;
    /** Path to a .3ds file. */
    src: string;
    loader: TDSLoader;
    model?: Group;
    protected _parentDefinedEffect(parent?: NonNullable<this['composedParent']>): void;
}
//# sourceMappingURL=TdsModelBehavior.d.ts.map