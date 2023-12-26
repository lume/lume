import { Behavior } from './Behavior.js';
import { Element3D } from '../core/Element3D.js';
declare const RenderableBehavior_base: (new (...a: any[]) => {
    "__#1@#effects": Set<import("classy-solid").Effect>;
    createEffect(fn: () => void): void;
    stopEffects(): void;
    "__#1@#createEffect1"(fn: () => void): void;
    "__#1@#stopEffects1"(): void;
    "__#1@#owner": import("solid-js").Owner | null;
    "__#1@#dispose": (() => void) | null;
    "__#1@#createEffect2"(fn: () => void): void;
    "__#1@#stopEffects2"(): void;
}) & typeof Behavior;
/**
 * @class RenderableBehavior
 * Base class for element behaviors that provide rendering features (f.e. geometries, materials, etc).
 *
 * @extends Behavior
 */
export declare abstract class RenderableBehavior extends RenderableBehavior_base {
    element: Element3D;
    requiredElementType(): (typeof Element3D)[];
    connectedCallback(): void;
    disconnectedCallback(): void;
}
export {};
//# sourceMappingURL=RenderableBehavior.d.ts.map