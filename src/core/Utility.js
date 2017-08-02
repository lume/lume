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

function animationFrame() {
    let resolve = null
    const promise = new Promise(r => resolve = r)
    window.requestAnimationFrame(resolve)
    return promise
}

// Create lowercase versions of each setter property.
function makeLowercaseSetterAliases(object) {
    const props = Object.getOwnPropertyNames(object)
    for (let l=props.length, i=0; i<l; i+=1) {
        const prop = props[i]
        const lowercaseProp = prop.toLowerCase()
        if (lowercaseProp != prop) {
            const descriptor = Object.getOwnPropertyDescriptor(object, prop)
            if (Object.getOwnPropertyNames(descriptor).indexOf('set') >= 0) { // we care only about the setters.
                Object.defineProperty(object, lowercaseProp, descriptor)
            }
        }
    }
}

function makeAccessorsEnumerable(object) {
    const props = Object.getOwnPropertyNames(object)
    for (let l=props.length, i=0; i<l; i+=1) {
        const prop = props[i]
        const descriptor = Object.getOwnPropertyDescriptor(object, prop)
        if (descriptor && (descriptor.set || descriptor.get)) {
            descriptor.enumerable = true
            Object.defineProperty(object, prop, descriptor)
        }
    }
}

let childObservationHandlers = null
let childObserver = null
function observeChildren(ctx, onConnect, onDisconnect) {
    if (!childObservationHandlers) childObservationHandlers = new Map
    if (!childObserver) childObserver = createChildObserver()
    childObservationHandlers.set(ctx, {onConnect, onDisconnect})
    childObserver.observe(ctx, { childList: true })
    return true
}

// NOTE: If a child is disconnected then connected to the same parent in the
// same turn, then the onConnect and onDisconnect callbacks won't be called
// because the DOM tree will be back in the exact state as before (this is
// possible thanks to the logic associated with weightsPerTarget).
function createChildObserver() {
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

        // TODO PERFORMANCE: Can these for..of loops be converted to regular for loops?
        for (const [target, weights] of weightsPerTarget) {
            const {onConnect, onDisconnect} = childObservationHandlers.get(target)

            for (const [node, weight] of weights) {
                // If the number of times a child was added is greater than the
                // number of times it was removed, then the net result is that
                // it was added, so we call onConnect just once.
                if (weight > 0 && typeof onConnect == 'function')
                    onConnect.call(target, node)

                // If the number of times a child was added is less than the
                // number of times it was removed, then the net result is that
                // it was removed, so we call onConnect just once.
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

// in the future, the user will be able to toggle the HTML API.
const hasHtmlApi = true

// Traverses a tree while considering ShadowDOM disribution.
function traverse(node, isShadowChild) {
    console.log(isShadowChild ? 'distributedNode:' : 'node:', node)

    const {children} = node
    for (let l=children.length, i=0; i<l; i+=1) {
        // skip nodes that are possiblyDistributed, i.e. they have a parent
        // that has a ShadowRoot.
        if (!hasHtmlApi || !children[i]._elementManager.element._isPossiblyDistributed)
            traverse(children[i])
    }

    const shadowChildren = node._elementManager.element._shadowChildren
    if (hasHtmlApi && shadowChildren) {
        for (let l=shadowChildren.length, i=0; i<l; i+=1)
            traverse(shadowChildren[i].imperativeCounterpart, true)
    }
}

export {
  epsilon,
  applyCSSLabel,
  animationFrame,
  makeLowercaseSetterAliases,
  makeAccessorsEnumerable,
  observeChildren,
  getShadowRootVersion,
  hasShadowDomV0,
  hasShadowDomV1,
  getAncestorShadowRoot,
  traverse,
}
