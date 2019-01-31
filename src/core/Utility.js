function epsilon(value) {
    return Math.abs(value) < 0.000001 ? 0 : value;
}

function applyCSSLabel(value, label) {
    if (value === 0) {
        return '0px'
    } else if (label === '%') {
        return value * 100 + '%';
    } else if (label === 'px') {
        return value + 'px'
    }
}

function observeChildren(target, onConnect, onDisconnect, skipTextNodes) {
    // TODO this Map is never cleaned, leaks memory. Maybe use WeakMap
    const childObserver = createChildObserver(onConnect, onDisconnect, skipTextNodes)
    childObserver.observe(target, { childList: true })
    return childObserver
}

// NOTE: If a child is disconnected then connected to the same parent in the
// same turn, then the onConnect and onDisconnect callbacks won't be called
// because the DOM tree will be back in the exact state as before (this is
// possible thanks to the logic associated with weightsPerTarget).
function createChildObserver(onConnect, onDisconnect, skipTextNodes = false) {
    return new MutationObserver(changes => {
        const weightsPerTarget = new Map

        // We're just counting how many times each child node was added and
        // removed from the parent we're observing.
        for (let i=0, l=changes.length; i<l; i+=1) {
            const change = changes[i]

            if (change.type != 'childList') continue

            if (!weightsPerTarget.has(change.target))
                weightsPerTarget.set(change.target, new Map)

            const weights = weightsPerTarget.get(change.target)

            const {addedNodes} = change
            for (let l=addedNodes.length, i=0; i<l; i+=1)
                weights.set(addedNodes[i], (weights.get(addedNodes[i]) || 0) + 1)

            const {removedNodes} = change
            for (let l=removedNodes.length, i=0; i<l; i+=1)
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
                if (weight > 0 && typeof onConnect == 'function')
                    onConnect.call(target, node)

                // If the number of times a child was added is less than the
                // number of times it was removed, then the net result is that
                // it was removed, so we call onDisconnect just once.
                else if (weight < 0 && typeof onDisconnect == 'function')
                    onDisconnect.call(target, node)

                // If the number of times a child was added is equal to the
                // number of times it was removed, then it was essentially left
                // in place, so we don't call anything.
            }
        }
    })
}

const hasShadowDomV0 =
    typeof Element.prototype.createShadowRoot == 'function'
    && typeof HTMLContentElement == 'function'
    ? true : false

const hasShadowDomV1 =
    typeof Element.prototype.attachShadow == 'function'
    && typeof HTMLSlotElement == 'function'
    ? true : false

function getShadowRootVersion(shadowRoot) {
    console.log('getShadowRootVersion')
    if (!shadowRoot) return null
    const slot = document.createElement('slot')
    shadowRoot.appendChild(slot)
    slot.appendChild(document.createElement('div'))
    const assignedNodes = slot.assignedNodes({ flatten: true })
    slot.remove()
    console.log('hmm', assignedNodes.length, assignedNodes.length > 0 ? 'v1' : 'v0')
    return assignedNodes.length > 0 ? 'v1' : 'v0'
}

function getAncestorShadowRoot(node) {
    let current = node

    while (current && !(current instanceof ShadowRoot)) {
        current = current.parentNode
    }

    return current
}

// helper function to use instead of instanceof for classes that implement the
// static Symbol.hasInstance method, because the behavior of instanceof isn't
// polyfillable.
function isInstanceof(lhs, rhs) {
    if (typeof rhs == 'function' && rhs[Symbol.hasInstance])
        return rhs[Symbol.hasInstance](lhs)
    else return lhs instanceof rhs
}

function checkIsNumberArrayString(str) {
    if (!str.match(/^\s*(((\s*(-|\+)?((\.\d+)|(\d+\.\d+)|(\d+)|(\d+(\.\d+)?e(-|\+)?(\d+)))\s*,){0,2}(\s*(-|\+)?((\.\d+)|(\d+\.\d+)|(\d+)|(\d+(\.\d+)?e(-|\+)?(\d+)))))|((\s*(-|\+)?((\.\d+)|(\d+\.\d+)|(\d+)|(\d+(\.\d+)?e(-|\+)?(\d+)))\s){0,2}(\s*(-|\+)?((\.\d+)|(\d+\.\d+)|(\d+)|(\d+(\.\d+)?e(-|\+)?(\d+))))))\s*$/g))
        throw new Error(`Attribute must be a comma- or space-separated sequence of up to three numbers, for example "1 2.5 3". Yours was "${str}".`)
}

function checkIsSizeArrayString(str) {
    if (!str.match(/^\s*(((\s*([a-zA-Z]+)\s*,){0,2}(\s*([a-zA-Z]+)))|((\s*([a-zA-Z]+)\s*){1,3}))\s*$/g))
        throw new Error(`Attribute must be a comma- or space-separated sequence of up to three strings, for example "literal proportional". Yours was "${str}".`)
}

export {
    epsilon,
    applyCSSLabel,
    observeChildren,
    getShadowRootVersion,
    hasShadowDomV0,
    hasShadowDomV1,
    getAncestorShadowRoot,
    isInstanceof,
}
