import Class from 'lowclass'

import SceneWorker from 'worker!./SceneWorker.js'

// to keep track of whether the singleton Motor is instantiated.
let singleton = null

let privates = new WeakMap

let sceneWorker = new SceneWorker

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
            sceneWorker: null
        })
    },

    startLoop() {
        if (updateQueue.length) {
            rAF = requestAnimationFrame(this.startLoop)
        }
    },

    drive() {},

    addToQueue(fn) {
        privates.get(this).updateQueue.push(fn)
    },

    removeFromQueue(fn) {
        let queue = privates.get(this).updateQueue
        queue.splice(queue.indexOf(fn), 1)
    },
})
