import Class from 'lowclass'

// TODO: prevent from overriding the import syntax with the "worker!" prefix so
// we can be compatible with other build systems.
import SceneWorker from 'worker!./SceneWorker.js'

import Privates from '../utilities/Privates'
let __ = new Privates()

// to keep track of whether the singleton Motor is instantiated or not.
let singleton = null

export default
Class ('Motor', {

    /**
     * @constructor
     */
    Motor() {
        if (singleton) return singleton
        else singleton = this

        // holds update functions
        __(this).updateQueue = []

        // ID of the currently requested animation frame
        __(this).rAF = null

        // ref to a SceneWorker
        __(this).sceneWorker = null

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

    /*
     * XXX: For the following register* methods, We can create proxy methods
     * that use postMessage internally to create RPC-like method calling
     * between UI and worker. So, for example, we can do something like
     *
     *   __(this).sceneWorker.registerNode(node.id)
     *
     * instead of
     *
     *   __(this).sceneWorker.postMessage({method: 'registerNode', id: node.id})
     *
     * See https://github.com/blittle/bridged-worker for ideas.
     */

    /**
     * Registers a Node with the Motor, which creates it's twin WorkerNode in
     * the SceneWorker.
     *
     * @param {../nodes/Node} node The node to be registered.
     */
    registerNode(node) {
        __(this).sceneWorker.postMessage({method: 'registerNode', id: node.id})
    },

    /**
     * Registers a NodeComponent with the Motor, which creates it's twin
     * WorkerNodeComponent in the SceneWorker.
     *
     * @param {../nodes/Node} node The component to be registered.
     */
    registerComponent(component) {
        __(this).sceneWorker.postMessage({method: 'registerComponent', id: component.id})
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
