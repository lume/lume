import Class from 'lowclass'
import randomstring from 'randomstring'

import Motor from '../core/Motor'
import Transform from '../nodeComponents/Transform'

import env from '../utilities/environment'

import Privates from '../utilities/Privates'
let __ = new Privates()

/**
 * @public
 * @class Node
 */
export default
Class ('Node', {

    /**
     * This constructor simply calls init or worker__init depending on
     * which environment an instance of this class is running in.
     *
     * @constructor
     */
    Node() {
        if (env.isWeb) this.init.apply(this, arguments)
        else if (env.isWebWorker) this.worker__init.apply(this, arguments)
    },

    /**
     * Constructor logic for the UI thread.
     *
     * A UI-side Node uses the singleton Motor to...
     */
    init() {
        console.log('Calling init on ', this.constructor.name)

        // Motor is a singleton, so if it already exists, the existing one is
        // returned from the constructor here.
        let motor = __(this).motor = new Motor

        // new Nodes get a new random ID, used to associate the UI Node with a
        // twin WorkerNode.
        this.id = this._idPrefix + '#' + randomstring.generate()
        // TODO: detect ID collisions.

        // registers this Node with the Motor, which creates it's worker twin
        // in the SceneWorker.
        motor.registerNode(this)

        if (this.useDefaultComponents) {
            this.addComponent(new Transform)
        }
    },

    /**
     * Don't override this unless you know what you're doing. This returns a
     * string that becomes the prefix of the ID of this Node. The ID prefix is
     * used so that the SceneWorker can determine what type of object to
     * instantiate to pair with a UI-side instance of this class.
     *
     * @private
     * @return {string} The ID prefix for this Node.
     */
    get _idPrefix() { return "Node" },

    /**
     * If this getter returns true, then default components are created for
     * this Node. It can be overriden in subclasses.
     */
    get useDefaultComponents() { return true },

    /**
     * Add a child Node to this Node.
     */
    addChild() {},

    /**
     * Add a NodeComponent to this Node.
     *
     * @param {NodeComponent} component The component to add to this Node.
     */
    addComponent(component) {
        console.log('Add component: ', component)
        component.addTo(this)
    },

    /*
     * Worker methods --------------------------------------------------
     */

    /**
     * Constructor logic for the worker thread.
     *
     * @param {string} id The ID of a UI-side Node instance that the current
     * worker-side Node instance will be associated with.
     */
    worker__init(id) {
        this.id = id
    },
    worker__addChild() {},
    worker__addComponent() {},
})
