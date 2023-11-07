import 'element-behaviors';
import { ColladaLoader, type Collada } from 'three/examples/jsm/loaders/ColladaLoader.js';
import { RenderableBehavior } from '../../RenderableBehavior.js';
export type ColladaModelBehaviorAttributes = 'src';
export declare class ColladaModelBehavior extends RenderableBehavior {
    #private;
    src: string;
    loader?: ColladaLoader;
    model?: Collada;
    loadGL(): void;
    unloadGL(): void;
}
//# sourceMappingURL=ColladaModelBehavior.d.ts.map