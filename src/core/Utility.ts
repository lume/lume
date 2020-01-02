function epsilon(value: any) {
    return Math.abs(value) < 0.000001 ? 0 : value
}

function applyCSSLabel(value: any, label: any) {
    if (value === 0) {
        return '0px'
    } else if (label === '%') {
        return value * 100 + '%'
    } else if (label === 'px') {
        return value + 'px'
    }
}

// TODO padd an options object to make it more clear what the args are.
function observeChildren(target: any, onConnect: any, onDisconnect: any, skipTextNodes: any) {
    // TODO this Map is never cleaned, leaks memory. Maybe use WeakMap
    const childObserver = createChildObserver(onConnect, onDisconnect, skipTextNodes)
    childObserver.observe(target, {childList: true})
    return childObserver
}

// NOTE: If a child is disconnected then connected to the same parent in the
// same turn, then the onConnect and onDisconnect callbacks won't be called
// because the DOM tree will be back in the exact state as before (this is
// possible thanks to the logic associated with weightsPerTarget).
function createChildObserver(onConnect: any, onDisconnect: any, skipTextNodes = false) {
    return new MutationObserver(changes => {
        const weightsPerTarget = new Map<any, Map<any, any>>()

        // We're just counting how many times each child node was added and
        // removed from the parent we're observing.
        for (let i = 0, l = changes.length; i < l; i += 1) {
            const change = changes[i]

            if (change.type != 'childList') continue

            let weights = weightsPerTarget.get(change.target)

            if (!weights) weightsPerTarget.set(change.target, (weights = new Map()))

            const {addedNodes} = change
            for (let l = addedNodes.length, i = 0; i < l; i += 1)
                weights.set(addedNodes[i], (weights.get(addedNodes[i]) || 0) + 1)

            const {removedNodes} = change
            for (let l = removedNodes.length, i = 0; i < l; i += 1)
                weights.set(removedNodes[i], (weights.get(removedNodes[i]) || 0) - 1)
        }

        // NOTE, the destructuring inside the for..of header currently doesn't
        // work due to a Buble bug, so we destructure inside the loop instead.
        // https://github.com/Rich-Harris/buble/issues/182
        // for (const [target, weights] of Array.from(weightsPerTarget)) {
        for (const entry of Array.from(weightsPerTarget)) {
            const [target, weights] = entry

            // for (const [node, weight] of Array.from(weights)) {
            for (const entry of Array.from(weights)) {
                const [node, weight] = entry

                if (skipTextNodes && (node instanceof Text || node instanceof Comment)) continue

                // If the number of times a child was added is greater than the
                // number of times it was removed, then the net result is that
                // it was added, so we call onConnect just once.
                if (weight > 0 && typeof onConnect == 'function') onConnect.call(target, node)
                // If the number of times a child was added is less than the
                // number of times it was removed, then the net result is that
                // it was removed, so we call onDisconnect just once.
                else if (weight < 0 && typeof onDisconnect == 'function') onDisconnect.call(target, node)

                // If the number of times a child was added is equal to the
                // number of times it was removed, then it was essentially left
                // in place, so we don't call anything.
            }
        }
    })
}

const hasShadowDomV1 =
    typeof Element.prototype.attachShadow == 'function' && typeof HTMLSlotElement == 'function' ? true : false

function documentBody(): Promise<void> {
    return new Promise(resolve => {
        if (document.body) return resolve()

        const observer = new MutationObserver(() => {
            if (document.body) {
                resolve()
                observer.disconnect()
            }
        })

        observer.observe(document.documentElement, {childList: true})
    })
}

function toRadians(degrees: number): number {
    return (degrees / 180) * Math.PI
}

/**
 * Execute the given `func`tion on the next micro "tick" of the JS engine.
 */
export function defer(func: () => unknown): Promise<unknown> {
    // "defer" is used as a semantic label for Promise.resolve().then
    return Promise.resolve().then(func)
}

export {
    epsilon,
    applyCSSLabel,
    observeChildren,
    hasShadowDomV1,
    // helper function to use instead of instanceof for classes that implement the
    // static Symbol.hasInstance method, because the behavior of instanceof isn't
    // polyfillable.
    documentBody,
    toRadians,
}
