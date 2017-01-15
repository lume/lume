import windowLoaded from 'awaitbox/dom/windowLoaded'

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

/**
 * Get the dimensions of the body element.
 * @async
 * @return {Object} An object containing `width` and `height` properties.
 */
async function getBodySize() {
    await windowLoaded()

    const body = document.body
    const width = window.parseInt(window.getComputedStyle(body).getPropertyValue('width'))
    const height = window.parseInt(window.getComputedStyle(body).getPropertyValue('height'))

    return { width, height }
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
    for (const prop of props) {
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
    for (const prop of props) {
        const descriptor = Object.getOwnPropertyDescriptor(object, prop)
        if (descriptor && (descriptor.set || descriptor.get)) {
            descriptor.enumerable = true
            Object.defineProperty(object, prop, descriptor)
        }
    }
}

function observeChildren(ctx, onConnect, onDisconnect) {

    // TODO issue #40
    // Observe nodes in the future.
    // This one doesn't need a timeout since the observation is already
    // async.
    const observer = new MutationObserver(changes => {
        for (const change of changes) {
            if (change.type != 'childList') continue

            if (typeof onConnect == 'function')
                for (const node of change.addedNodes)
                    onConnect.call(ctx, node)

            if (typeof onDisconnect == 'function')
                for (const node of change.removedNodes)
                    onDisconnect.call(ctx, node)
        }
    })
    observer.observe(ctx, { childList: true })
    return observer
}

const hasShadowDomV0 =
    typeof Element.prototype.createShadowRoot == 'function'
    && typeof HTMLContentElement == 'function'
    ? true : false

const hasShadowDomV1 =
    typeof Element.prototype.attachShadow == 'function'
    && typeof HTMLSlotElement == 'function'
    ? true : false

// See http://stackoverflow.com/a/40078261/454780
// XXX This function only works on roots whose hosts have no light-tree Nodes,
// so we're not using this at the moment when detecting slot and content
// elements in DeclarativeBase childConnected/Disconnected Callbacks. See
// the TODO there.
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

function getAncestorShadowRootIfAny(node) {
    if (!node) return null // XXX throw error instead? What pattern is better?

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

    for (const child of node.children) {
        // skip nodes that are possiblyDistributed, i.e. they have a parent
        // that has a ShadowRoot.
        if (!hasHtmlApi || !child._elementManager.element._isPossiblyDistributed)
            traverse(child)
    }

    if (hasHtmlApi && node._elementManager.element._shadowChildren) {
        for (const shadowChild of node._elementManager.element._shadowChildren)
            traverse(shadowChild.imperativeCounterpart, true)
    }
}

export {
  epsilon,
  applyCSSLabel,
  getBodySize,
  animationFrame,
  makeLowercaseSetterAliases,
  makeAccessorsEnumerable,
  observeChildren,
  getShadowRootVersion,
  hasShadowDomV0,
  hasShadowDomV1,
  getAncestorShadowRootIfAny,
  traverse,
}
