import { Element as LumeElement } from '@lume/element';
declare const TreeNode_base: {
    new (...a: any[]): {
        "__#8@#owner": import("solid-js").Owner | null;
        "__#8@#dispose": (() => void) | null;
        createEffect(fn: () => void): void;
        stopEffects(): void;
    };
} & (new (...a: any[]) => {
    on(eventName: string, callback: Function, context?: any): void;
    off(eventName: string, callback?: Function | undefined, context?: any): void;
    emit(eventName: string, data?: any): void;
    "__#1@#eventMap": Map<string, [Function, any][]> | null;
}) & typeof LumeElement;
export declare class TreeNode extends TreeNode_base {
    get parentLumeElement(): TreeNode | null;
    get lumeChildren(): TreeNode[];
    get lumeChildCount(): number;
    disconnectedCallback(): void;
}
export {};
//# sourceMappingURL=TreeNode.d.ts.map