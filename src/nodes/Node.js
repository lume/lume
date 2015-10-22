import Class from 'lowclass'
import randomstring from 'randomstring'

import Motor from '../core/Motor'

let privates = new WeakMap
let __ = key => privates.get(key)

/**
 * @public
 * @class Node
 */
export default
Class ('Node', {

    /**
     * @constructor
     */
    Node() {
        privates.set(this, {
            motor: null, // ref to the singleton Motor
            id: '',
        })

        // Motor is a singleton, so if it already exists, the existing one is
        // returned from the constructor here.
        let motor = __(this).motor = new Motor

        // new Nodes get a new random ID, used to associate the UI Node with a
        // twin WorkerNode.
        let id = this.id = randomstring.generate()

        // registers this Node with the Motor, which creates it's worker twin
        // in the SceneWorker.
        motor.registerNode(this)
    },

    addChild() {},

    addComponent() {},
})
