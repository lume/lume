import Class from 'lowclass'

// TODO: prevent from overriding the import syntax with the "worker!".
import SceneWorker from 'worker!./SceneWorker.js'

// to keep track of whether the singleton Motor is instantiated or not.
let singleton = null

// privates holds private data for each instance of the class defined in this file.
let privates = new WeakMap
let __ = key => privates.get(key)

export default
Class ('Motor', {

    /**
     * @constructor
     */
    Motor() {
        if (singleton) return singleton
        else singleton = this

        privates.set(this, {
            updateQueue: [], // holds update functions
            rAF: null, // ID of the currently requested animation frame
            sceneWorker: null, // ref to a SceneWorker
        })

        this._initSceneWorker()
    },

    /**
     * @private
     */
    _initSceneWorker() {
        let sceneWorker = __(this).sceneWorker = new SceneWorker

        sceneWorker.addEventListener('message', function(message) {
            let data = message.data

            if (data instanceof Object && data.method === '') { }
        })
    },

    /**
     * Registers a Node with the Motor, which creates it's twin WorkerNode in the SceneWorker.
     * @param {../nodes/Node} node The node to be registered.
     */
    registerNode(node) {

        // TODO: We can create proxy methods that use postMessage internally to
        // create RPC-like method calling between UI and worker. See
        // https://github.com/blittle/bridged-worker for ideas.
        __(this).sceneWorker.postMessage({method: 'registerNode', id: node.id})
    },








    startLoop() {
        if (updateQueue.length) {
            rAF = requestAnimationFrame(this.startLoop)
        }
    },

    addToQueue(fn) {
        __(this).updateQueue.push(fn)
    },

    removeFromQueue(fn) {
        let queue = __(this).updateQueue
        queue.splice(queue.indexOf(fn), 1)
    },
})
