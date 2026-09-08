import 'element-behaviors';
import { ColladaLoader, type Collada } from 'three/examples/jsm/loaders/ColladaLoader.js';
import { RenderableBehavior } from '../../RenderableBehavior.js';
export type ColladaModelBehaviorAttributes = 'src';
/**
 * @deprecated Legacy behavior via `has=""` attribute is deprecated. Use `<lume-collada-model>` child elements instead. Legacy behaviors will be removed in a future version.
 */
export declare class ColladaModelBehavior extends RenderableBehavior {
    #private;
    /** Path to a .dae file. */
    src: string;
    loader: ColladaLoader;
    model?: Collada;
    connectedCallback(): void;
}
//# sourceMappingURL=ColladaModelBehavior.d.ts.map