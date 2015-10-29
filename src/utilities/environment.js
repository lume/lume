
// Based on http://stackoverflow.com/a/23619712/454780
let isNode      = typeof process === 'object' && typeof require === 'function'
let isWeb       = typeof Window === 'function' && window instanceof Window
let isWebWorker = typeof WorkerGlobalScope === 'function' && self instanceof WorkerGlobalScope
let isShell     = !isWeb && !isNode && !isWorker

export default {
    isNode,
    isWeb,
    isWebWorker,
    isShell,
}
