import TWEEN from 'tween.js'

let rAF = null // reference to the rAF loop used for animating everything.

function startTween(tween) {
    tween.start()
    startLoop()
}

// Render the scene repeatedly. In the future we can render only the needed
// parts.
function startLoop() {
    // start an rAF loop if there isn't one.
    if (!rAF) {
        rAF = window.requestAnimationFrame(function tick() {

            // (errors could happen in the TWEEN.update() call below, so we
            // catch them and rethrow them, for now.)
            try {

                // If we have a reason to request a new frame, continue.
                if (TWEEN.getAll().length) { // if we have tweens left to animate.
                    TWEEN.update() // update all tweens
                    // ^ TODO: pass in a custom timestamp here. We'll need to
                    // do this in order to synchronize all the parts (DOM
                    // renderer, WebGL renderer, etc).

                    rAF = window.requestAnimationFrame(tick)
                }

                // Otherwise don't request the next frame, and nullify the rAF
                // reference.
                else {
                    rAF = null
                }
            }
            catch (error) {
                throw error
            }
        })
    }
}

// TODO: How do we pause tweens?
function stopLoop() {
    if (rAF) {
        window.cancelAnimationFrame(rAF)
        rAF = null
    }
}

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
 * Await for this to run code after the DOM has been parsed and loaded (but not
 * sub-resources like images, scripts, etc).
 */
async function documentReady() {
    if (document.readyState === 'loading') {
        await new Promise(function(resolve) {
            document.addEventListener('DOMContentLoaded', resolve)
        })
    }
}

/**
 * Await for this to run code after the DOM's sub-resources have been loaded
 * (images, scripts, etc).
 */
async function windowLoaded() {
    if (document.readyState !== 'complete') {
        await new Promise(function(resolve) {
            window.addEventListener('load', resolve)
        })
    }
}


/**
 * Alias to windowLoaded.
 */
async function documentLoaded() {
    await windowLoaded()
}

/**
 * Get the dimensions of the body element.
 * @async
 * @return {Object} An object containing `width` and `height` properties.
 */
async function getBodySize() {
    await documentLoaded()

    let body = document.body
    let width = window.parseInt(window.getComputedStyle(body).getPropertyValue('width'))
    let height = window.parseInt(window.getComputedStyle(body).getPropertyValue('height'))

    return { width, height }
}

// Create lowercase versions of each setter property.
function makeLowercaseSetterAliases(object) {
    const props = Object.getOwnPropertyNames(object)
    for (let prop of props) {
        const lowercaseProp = prop.toLowerCase()
        if (lowercaseProp != prop) {
            const descriptor = Object.getOwnPropertyDescriptor(object, prop)
            if (Object.getOwnPropertyNames(descriptor).includes('set')) { // we care only about the setters.
                Object.defineProperty(object, lowercaseProp, descriptor)
            }
        }
    }
}

export {
  startTween,
  startLoop,
  stopLoop,
  epsilon,
  applyCSSLabel,
  documentReady,
  windowLoaded,
  documentLoaded,
  getBodySize,
  makeLowercaseSetterAliases,
}
