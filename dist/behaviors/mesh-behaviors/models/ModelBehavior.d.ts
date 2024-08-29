import { Model } from '../../../models/Model.js';
import { RenderableBehavior } from '../../RenderableBehavior.js';
/** Base class for model behaviors. */
export declare abstract class ModelBehavior extends RenderableBehavior {
    element: Model;
    requiredElementType(): (typeof Model)[];
    isLoading: boolean;
    model?: unknown;
}
//# sourceMappingURL=ModelBehavior.d.ts.map