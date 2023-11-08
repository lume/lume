export function observeChildren({ target, onConnect, onDisconnect, skipTextNodes }) {
    const childObserver = createChildObserver(onConnect, onDisconnect, skipTextNodes);
    childObserver.observe(target, { childList: true });
    return () => childObserver.disconnect();
}
export function createChildObserver(onConnect, onDisconnect, skipTextNodes = false) {
    const observer = new MutationObserver(changes => {
        const weightsPerTarget = new Map();
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
        for (const [target, weights] of Array.from(weightsPerTarget)) {
            for (const [child, weight] of Array.from(weights)) {
                if (skipTextNodes && (child instanceof Text || child instanceof Comment))
                    continue;
                if (weight > 0 && typeof onConnect == 'function') {
                    onConnect.call(target, child);
                }
                else if (weight < 0 && typeof onDisconnect == 'function') {
                    console.log(' - Child Observer, child disconnected', target.id, child.id);
                    onDisconnect.call(target, child);
                }
            }
        }
    });
    return observer;
}
//# sourceMappingURL=observeChildren.js.map