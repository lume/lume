import { ColladaLoader, type Collada } from 'three/examples/jsm/loaders/ColladaLoader.js';
import { RenderableBehavior } from '../../RenderableBehavior.js';
export type ColladaModelBehaviorAttributes = 'src';
export declare class ColladaModelBehavior extends RenderableBehavior {
    #private;
    /** Path to a .dae file. */
    src: string;
    loader: ColladaLoader;
    model?: Collada;
    protected _parentDefinedEffect(parent?: NonNullable<this['composedParent']>): void;
}
//# sourceMappingURL=ColladaModelBehavior.d.ts.map