import TWEEN from 'tween.js'
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

    let body = document.body
    let width = window.parseInt(window.getComputedStyle(body).getPropertyValue('width'))
    let height = window.parseInt(window.getComputedStyle(body).getPropertyValue('height'))

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
    for (let prop of props) {
        const lowercaseProp = prop.toLowerCase()
        if (lowercaseProp != prop) {
            const descriptor = Object.getOwnPropertyDescriptor(object, prop)
            if (Object.getOwnPropertyNames(descriptor).indexOf('set') >= 0) { // we care only about the setters.
                Object.defineProperty(object, lowercaseProp, descriptor)
            }
        }
    }
}

// Node methods not to proxy (private underscored methods are also detected and
// ignored).
//
// XXX Should use a whitelist instead of a blacklist?
const methodProxyBlacklist = [
    'constructor',
    'parent',
    'children', // proxying this one would really break stuff (f.e. React)
    'element',
    'scene',
    'addChild',
    'addChildren',
    'removeChild',
    'removeChildren',
]

// Creates setters/getters on the MotorHTMLNode which proxy to the
// setters/getters on Node.
function proxyMethods(SourceClass, TargetClass) {
    const props = Object.getOwnPropertyNames(SourceClass.prototype)

    for (let prop of props) {
        // skip the blacklisted properties
        if (methodProxyBlacklist.includes(prop)) continue

        // skip the private underscored properties
        if (prop.indexOf('_') == 0) continue

        const proxyDescriptor = {}
        const actualDescriptor = Object.getOwnPropertyDescriptor(SourceClass.prototype, prop)

        // if the property has a setter
        if (actualDescriptor.set) {
            Object.assign(proxyDescriptor, {
                set(value) {
                    this.node[prop] = value
                }
            })
        }

        // if the property has a getter
        if (actualDescriptor.get) {
            Object.assign(proxyDescriptor, {
                get() {
                    return this.node[prop]
                }
            })
        }

        Object.defineProperty(TargetClass.prototype, prop, proxyDescriptor)
    }
}

export {
  epsilon,
  applyCSSLabel,
  getBodySize,
  animationFrame,
  makeLowercaseSetterAliases,
  proxyMethods,
}
