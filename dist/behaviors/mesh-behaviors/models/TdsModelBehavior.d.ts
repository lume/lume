import 'element-behaviors';
import { TDSLoader } from 'three/examples/jsm/loaders/TDSLoader.js';
import { RenderableBehavior } from '../../RenderableBehavior.js';
import type { Group } from 'three/src/objects/Group.js';
export type TdsModelBehaviorAttributes = 'src';
/**
 * @deprecated Legacy behavior via `has=""` attribute is deprecated. Use `<lume-tds-model>` child elements instead. Legacy behaviors will be removed in a future version.
 */
export declare class TdsModelBehavior extends RenderableBehavior {
    #private;
    /** Path to a .3ds file. */
    src: string;
    loader: TDSLoader;
    model?: Group;
    connectedCallback(): void;
}
//# sourceMappingURL=TdsModelBehavior.d.ts.map