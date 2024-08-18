import 'element-behaviors';
import { TDSLoader } from 'three/examples/jsm/loaders/TDSLoader.js';
import type { Group } from 'three/src/objects/Group.js';
import { ModelBehavior } from './ModelBehavior.js';
import { TdsModel } from '../../../models/TdsModel.js';
export type TdsModelBehaviorAttributes = 'src';
/**
 * A behavior containing the logic that loads 3DS models for `<lume-3ds-model>`
 * elements.
 * @deprecated Don't use this behavior directly, instead use a `<lume-3ds-model>` element.
 * @extends ModelBehavior
 */
export declare class TdsModelBehavior extends ModelBehavior {
    #private;
    /** Path to a .3ds file. */
    src: string;
    loader: TDSLoader;
    model?: Group;
    element: TdsModel;
    requiredElementType(): (typeof TdsModel)[];
    connectedCallback(): void;
}
//# sourceMappingURL=TdsModelBehavior.d.ts.map