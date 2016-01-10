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
        rAF = requestAnimationFrame(function tick() {

            // (errors could happen in the TWEEN.update() call below, so we catch them.)
            try {

                // If we have a reason to request a new frame, continue.
                if (TWEEN.getAll().length) { // if we have tweens left to animate.
                    TWEEN.update() // update all tweens
                    rAF = requestAnimationFrame(tick)
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
        return new Promise(function(resolve) {
            document.addEventListener('DOMContentLoaded', event => resolve())
        })
    }
    else return
}

/**
 * Await for this to run code after the DOM's sub-resources have been loaded
 * (images, scripts, etc).
 */
async function windowLoaded() {
    if (document.readyState !== 'complete') {
        return new Promise(function(resolve) {
            window.addEventListener('load', event => resolve())
        })
    }
    else return
}


/**
 * Alias to windowLoaded.
 */
async function documentLoaded() {
    return await windowLoaded()
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

export {
  startTween,
  startLoop,
  epsilon,
  applyCSSLabel,
  documentReady,
  windowLoaded,
  documentLoaded,
  getBodySize,
}
