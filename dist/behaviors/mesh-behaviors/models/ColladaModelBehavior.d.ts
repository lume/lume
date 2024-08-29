import 'element-behaviors';
import { ColladaLoader, type Collada } from 'three/examples/jsm/loaders/ColladaLoader.js';
import { ModelBehavior } from './ModelBehavior.js';
export type ColladaModelBehaviorAttributes = 'src';
export declare class ColladaModelBehavior extends ModelBehavior {
    #private;
    /** Path to a .dae file. */
    src: string;
    loader: ColladaLoader;
    model?: Collada;
    connectedCallback(): void;
}
//# sourceMappingURL=ColladaModelBehavior.d.ts.map