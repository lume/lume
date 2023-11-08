export interface ObserveChildrenOptions {
    target: any;
    onConnect: any;
    onDisconnect: any;
    skipTextNodes: any;
}
export declare function observeChildren({ target, onConnect, onDisconnect, skipTextNodes }: ObserveChildrenOptions): () => void;
export declare function createChildObserver(onConnect: any, onDisconnect: any, skipTextNodes?: boolean): MutationObserver;
//# sourceMappingURL=observeChildren.d.ts.map