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

export {
  epsilon,
  applyCSSLabel,
  getBodySize,
  animationFrame,
  makeLowercaseSetterAliases,
}
