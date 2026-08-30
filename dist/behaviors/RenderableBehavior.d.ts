import { Behavior } from './Behavior.js';
import { Element3D } from '../core/Element3D.js';
declare const RenderableBehavior_base: (new (...a: any[]) => {
    "__#1@#effectFunctions": Array<() => void>;
    "__#1@#started": boolean;
    createEffect(fn: () => void): void;
    addEffectFn(fn: () => void): void;
    "__#1@#isRestarting": boolean;
    startEffects(): void;
    stopEffects(): void;
    clearEffects(): void;
    "__#1@#owner": import("solid-js").Owner | null;
    "__#1@#dispose": (() => void) | null;
    "__#1@#createEffect"(fn: () => void): void;
}) & typeof Behavior;
/**
 * @class RenderableBehavior
 * Base class for element behaviors that provide rendering features (f.e. geometries, materials, etc).
 *
 * @extends Behavior
 * @deprecated Legacy behavior system via `has=""` attribute is deprecated. Use child behavior elements instead. Legacy behaviors will be removed in a future version.
 */
export declare abstract class RenderableBehavior extends RenderableBehavior_base {
    element: Element3D;
    requiredElementType(): (typeof Element3D)[];
    connectedCallback(): void;
    disconnectedCallback(): void;
}
export {};
//# sourceMappingURL=RenderableBehavior.d.ts.map