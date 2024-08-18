import { Element as LumeElement } from '@lume/element';
declare const TreeNode_base: (new (...a: any[]) => {
    "__#1@#effects": Set<import("classy-solid").Effect>;
    createEffect(fn: () => void): void;
    stopEffects(): void;
    "__#1@#createEffect1"(fn: () => void): void;
    "__#1@#stopEffects1"(): void;
    "__#1@#owner": import("solid-js").Owner | null;
    "__#1@#dispose": (() => void) | null;
    "__#1@#createEffect2"(fn: () => void): void;
    "__#1@#stopEffects2"(): void;
}) & (new (...a: any[]) => {
    on(eventName: string, callback: Function, context?: any): void;
    off(eventName: string, callback?: Function | undefined, context?: any): void;
    emit(eventName: string, data?: any): void;
    "__#1@#eventMap": Map<string, [Function, any][]> | null;
}) & typeof LumeElement;
/**
 * @class TreeNode - The `TreeNode` class represents objects that are connected
 * to each other in parent-child relationships in a tree structure. A parent
 * can have multiple children, and a child can have only one parent.
 * @extends Eventful
 * @extends LumeElement
 */
export declare class TreeNode extends TreeNode_base {
    /**
     * @property {TreeNode | null} parentLumeElement -
     *
     * *readonly*
     *
     * The LUME-specific parent of the current TreeNode. Each node in a tree can
     * have only one parent. This is `null` if there is no parent when not
     * connected into a tree, or if the parentElement while connected into a
     * tree is not as LUME 3D element.
     */
    get parentLumeElement(): TreeNode | null;
    /**
     * @property {TreeNode[]} lumeChildren -
     *
     * *readonly*
     *
     * An array of this element's LUME-specific children. This returns a new
     * static array each time, so and modifying this array directly does not
     * effect the state of the TreeNode. Use [TreeNode.append(child)](#append)
     * and [TreeNode.removeChild(child)](#removechild) to modify a TreeNode's
     * actual children.
     */
    get lumeChildren(): TreeNode[];
    /**
     * @property {number} lumeChildCount -
     *
     * *readonly*
     *
     * The number of children this TreeNode has.
     */
    get lumeChildCount(): number;
    disconnectedCallback(): void;
    /** @deprecated Use `addEventListener()` instead. */
    on(eventName: string, callback: Function, context?: any): void;
    /** @deprecated Use `dispatchEvent()` instead. */
    emit(eventName: string, data?: any): void;
}
export {};
//# sourceMappingURL=TreeNode.d.ts.map