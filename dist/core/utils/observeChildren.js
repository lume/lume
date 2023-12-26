// const addedTo = new Map<Node, Node>()
// const removedFrom = new Map<Node, Node>()
// let scheduled = false
export function observeChildren({ target, onConnect, onDisconnect, includeTextNodes = false, weighted = false, }) {
    const childObserver = createChildObserver(onConnect, onDisconnect, includeTextNodes, weighted);
    childObserver.observe(target, { childList: true });
    return () => childObserver.disconnect();
}
/**
 * NOTE: If a child is synchronously disconnected then connected to the same parent in the
 * same tick when weighted is true, then the onConnect and onDisconnect callbacks won't be called
 * because the DOM tree will be back in the exact state as before (this is
 * possible thanks to the logic associated with weightsPerTarget).
 */
export function createChildObserver(onConnect, onDisconnect, includeTextNodes = false, weighted = false) {
    const observer = new MutationObserver(changes => {
        if (!weighted) {
            for (const change of changes) {
                const { target, removedNodes, addedNodes } = change;
                for (let i = 0, l = removedNodes.length; i < l; i += 1)
                    onDisconnect.call(target, removedNodes[i]);
                for (let i = 0, l = addedNodes.length; i < l; i += 1)
                    onConnect.call(target, addedNodes[i]);
            }
            return;
        }
        const weightsPerTarget = new Map();
        // We're just counting how many times each child node was added and
        // removed from the parent we're observing.
        for (let i = 0, l = changes.length; i < l; i += 1) {
            const change = changes[i];
            if (change.type != 'childList')
                continue;
            let weights = weightsPerTarget.get(change.target);
            if (!weights)
                weightsPerTarget.set(change.target, (weights = new Map()));
            const { addedNodes } = change;
            for (let l = addedNodes.length, i = 0; i < l; i += 1) {
                const child = addedNodes[i];
                weights.set(child, (weights.get(child) || 0) + 1);
            }
            const { removedNodes } = change;
            for (let l = removedNodes.length, i = 0; i < l; i += 1) {
                const child = removedNodes[i];
                weights.set(child, (weights.get(child) || 0) - 1);
            }
        }
        // The order of added and removed callbacks is wrong: it fires connected
        // before disconnected when a node was moved synchronously.
        // https://github.com/whatwg/dom/issues/1105
        for (const [target, weights] of Array.from(weightsPerTarget)) {
            for (const [child, weight] of Array.from(weights)) {
                if (!includeTextNodes && (child instanceof Text || child instanceof Comment))
                    continue;
                // If the number of times a child was added is greater than the
                // number of times it was removed, then the net result is that
                // it was added, so we call onConnect just once.
                if (weight > 0 && typeof onConnect == 'function') {
                    onConnect.call(target, child);
                    // addedTo.set(child, target)
                }
                // If the number of times a child was added is less than the
                // number of times it was removed, then the net result is that
                // it was removed, so we call onDisconnect just once.
                else if (weight < 0 && typeof onDisconnect == 'function') {
                    onDisconnect.call(target, child);
                    // removedFrom.set(child, target)
                }
                // If the number of times a child was added is equal to the
                // number of times it was removed, then it was essentially left
                // in place, so we don't call anything.
            }
        }
    });
    return observer;
}
//# sourceMappingURL=observeChildren.js.map