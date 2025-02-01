import 'element-behaviors';
import { ColladaLoader, type Collada } from 'three/examples/jsm/loaders/ColladaLoader.js';
import { ModelBehavior } from './ModelBehavior.js';
import { ColladaModel } from '../../../models/ColladaModel.js';
export type ColladaModelBehaviorAttributes = 'src';
/**
 * A behavior containing the logic that loads Collada models for `<lume-collada-model>`
 * elements.
 * @deprecated Don't use this behavior directly, instead use a `<lume-collada-model>` element.
 * @extends ModelBehavior
 */
export declare class ColladaModelBehavior extends ModelBehavior {
    #private;
    /** Path to a .dae file. */
    src: string;
    loader: ColladaLoader;
    /** @deprecated access `.threeModel` on the lume-collada-model element instead. */
    model?: Collada;
    element: ColladaModel;
    requiredElementType(): (typeof ColladaModel)[];
    connectedCallback(): void;
}
//# sourceMappingURL=ColladaModelBehavior.d.ts.map