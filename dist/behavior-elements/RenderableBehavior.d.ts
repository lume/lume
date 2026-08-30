import { BehaviorEl } from './Behavior.js';
import { Element3D } from '../core/Element3D.js';
/**
 * @class RenderableBehavior
 * Base class for element behaviors that provide rendering features (f.e. geometries, materials, etc).
 *
 * @extends HTMLElement
 */
export declare abstract class RenderableBehaviorEl extends BehaviorEl {
    readonly composedParent: Element3D | null;
    requiredParentType(): (typeof Element3D)[];
    protected _parentDefinedEffect(parent?: NonNullable<this['composedParent']>): void;
}
//# sourceMappingURL=RenderableBehavior.d.ts.map