import { Behavior } from './Behavior.js';
import { Element3D } from '../core/Element3D.js';
declare const RenderableBehavior_base: {
    new (...a: any[]): {
        "__#8@#owner": import("solid-js").Owner | null;
        "__#8@#dispose": (() => void) | null;
        createEffect(fn: () => void): void;
        stopEffects(): void;
    };
} & typeof Behavior;
export declare abstract class RenderableBehavior extends RenderableBehavior_base {
    #private;
    element: Element3D;
    requiredElementType(): (typeof Element3D)[];
    connectedCallback(): void;
    disconnectedCallback(): void;
    get glLoaded(): boolean;
    _glLoaded: boolean;
    get cssLoaded(): boolean;
    _cssLoaded: boolean;
    loadGL(): void;
    unloadGL(): void;
}
export {};
//# sourceMappingURL=RenderableBehavior.d.ts.map